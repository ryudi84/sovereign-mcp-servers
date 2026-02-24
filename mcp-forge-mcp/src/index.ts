#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// === Template Definitions ===

interface TemplateInfo {
  name: string;
  label: string;
  description: string;
  tools: Array<{
    name: string;
    description: string;
    params: Array<{ name: string; type: string; description: string }>;
    implementation: string;
  }>;
}

const TEMPLATES: Record<string, TemplateInfo> = {
  utility: {
    name: "utility",
    label: "Utility — Basic Text Processing",
    description: "A general-purpose text processing server with tools for counting, reversing, transforming case, and extracting substrings.",
    tools: [
      {
        name: "count_words",
        description: "Count the number of words in a text string",
        params: [
          {
            name: "text",
            type: "string",
            description: "Text to count words in",
          },
        ],
        implementation: "const count = text.trim().split(/\\\\s+/).filter(Boolean).length;\\nreturn `Word count: ${count}`;",
      },
      {
        name: "reverse_text",
        description: "Reverse a text string",
        params: [
          {
            name: "text",
            type: "string",
            description: "Text to reverse",
          },
        ],
        implementation: "return text.split(\"\").reverse().join(\"\");",
      },
      {
        name: "transform_case",
        description: "Transform text to uppercase, lowercase, or title case",
        params: [
          {
            name: "text",
            type: "string",
            description: "Text to transform",
          },
          {
            name: "mode",
            type: "string",
            description: "One of: upper, lower, title",
          },
        ],
        implementation: "switch (mode) {\\n  case \"upper\": return text.toUpperCase();\\n  case \"lower\": return text.toLowerCase();\\n  case \"title\": return text.replace(/\\\\b\\\\w/g, c => c.toUpperCase());\\n  default: return \"Error: mode must be upper, lower, or title\";\\n}",
      },
      {
        name: "extract_emails",
        description: "Extract all email addresses from text",
        params: [
          {
            name: "text",
            type: "string",
            description: "Text to extract emails from",
          },
        ],
        implementation: "const emails = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\\\.[a-zA-Z]{2,}/g) || [];\\nreturn emails.length > 0 ? emails.join(\"\\\\n\") : \"No email addresses found.\";",
      },
    ],
  },
  converter: {
    name: "converter",
    label: "Converter — Format Conversion",
    description: "A format conversion server with tools for converting between JSON, CSV, and XML.",
    tools: [
      {
        name: "json_to_csv",
        description: "Convert a JSON array of objects to CSV format",
        params: [
          {
            name: "json_input",
            type: "string",
            description: "JSON array string to convert",
          },
        ],
        implementation: "const arr = JSON.parse(json_input);\\nif (!Array.isArray(arr)) return \"Error: input must be a JSON array\";\\nif (arr.length === 0) return \"\";\\nconst headers = Object.keys(arr[0]);\\nconst rows = arr.map((row: Record<string, unknown>) => headers.map(h => String(row[h] ?? \"\")).join(\",\"));\\nreturn [headers.join(\",\"), ...rows].join(\"\\n\");",
      },
      {
        name: "csv_to_json",
        description: "Convert CSV text to a JSON array of objects",
        params: [
          {
            name: "csv_input",
            type: "string",
            description: "CSV string to convert",
          },
        ],
        implementation: "const lines = csv_input.trim().split(\"\\n\");\\nif (lines.length < 2) return \"Error: CSV needs header + data\";\\nconst headers = lines[0].split(\",\").map(h => h.trim());\\nconst result = lines.slice(1).map(line => {\\n  const vals = line.split(\",\").map(v => v.trim());\\n  const obj: Record<string, string> = {};\\n  headers.forEach((h, i) => { obj[h] = vals[i] || \"\"; });\\n  return obj;\\n});\\nreturn JSON.stringify(result, null, 2);",
      },
      {
        name: "json_to_xml",
        description: "Convert a JSON object to XML format",
        params: [
          {
            name: "json_input",
            type: "string",
            description: "JSON string to convert",
          },
          {
            name: "root_tag",
            type: "string",
            description: "Root XML element name",
          },
        ],
        implementation: "function toXml(o: unknown, t: string, i: number): string {\\n  const p = \"  \".repeat(i);\\n  if (typeof o !== \"object\" || o === null) {\\n    return p + \"<\" + t + \">\" + String(o).replace(/&/g, \"&amp;\").replace(/</g, \"&lt;\") + \"</\" + t + \">\";\\n  }\\n  if (Array.isArray(o)) return o.map(x => toXml(x, \"item\", i)).join(\"\\n\");\\n  let xml = p + \"<\" + t + \">\\n\";\\n  for (const [k, v] of Object.entries(o)) xml += toXml(v, k, i + 1) + \"\\n\";\\n  xml += p + \"</\" + t + \">\";\\n  return xml;\\n}\\nreturn toXml(JSON.parse(json_input), root_tag, 0);",
      },
      {
        name: "json_to_typescript",
        description: "Generate TypeScript interfaces from JSON",
        params: [
          {
            name: "json_input",
            type: "string",
            description: "JSON string to generate types from",
          },
        ],
        implementation: "function inferType(v: unknown, n: string): string {\\n  if (v===null) return \"null\";\\n  if (Array.isArray(v)) return v.length===0?\"unknown[]\":typeof v[0]+\"[]\";\\n  if (typeof v===\"object\") return n;\\n  return typeof v;\\n}\\nfunction gen(o: Record<string,unknown>, nm: string): string {\\n  const f: string[]=[]; const ch: string[]=[];\\n  for (const [k,v] of Object.entries(o)) {\\n    const cn=k.charAt(0).toUpperCase()+k.slice(1);\\n    f.push(\"  \"+k+\": \"+inferType(v,cn)+\";\");\\n    if (typeof v===\"object\"&&v!==null&&!Array.isArray(v)) ch.push(gen(v as Record<string,unknown>,cn));\\n  }\\n  return ch.join(\"\\\\n\\\\n\")+(ch.length?\"\\\\n\\\\n\":\"\")+\"interface \"+nm+\" {\\\\n\"+f.join(\"\\\\n\")+\"\\\\n}\";\\n}\\nreturn gen(JSON.parse(json_input),\"Root\");",
      },
    ],
  },
  generator: {
    name: "generator",
    label: "Generator — Content Generation",
    description: "A content generation server with tools for generating UUIDs, lorem ipsum, placeholder data, and random passwords.",
    tools: [
      {
        name: "generate_uuid",
        description: "Generate one or more v4 UUIDs",
        params: [
          {
            name: "count",
            type: "number",
            description: "Number of UUIDs to generate (1-100)",
          },
        ],
        implementation: "function uuid(): string {\\n  return \"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx\".replace(/[xy]/g, c => {\\n    const r = Math.random() * 16 | 0;\\n    return (c === \"x\" ? r : (r & 0x3 | 0x8)).toString(16);\\n  });\\n}\\nconst n = Math.min(Math.max(1, count), 100);\\nreturn Array.from({ length: n }, () => uuid()).join(\"\\n\");",
      },
      {
        name: "generate_lorem",
        description: "Generate lorem ipsum placeholder text",
        params: [
          {
            name: "paragraphs",
            type: "number",
            description: "Number of paragraphs (1-20)",
          },
        ],
        implementation: "const base = \"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\";\\nconst n = Math.min(Math.max(1, paragraphs), 20);\\nreturn Array.from({ length: n }, () => base).join(\"\\n\\n\");",
      },
      {
        name: "generate_password",
        description: "Generate a random password",
        params: [
          {
            name: "length",
            type: "number",
            description: "Password length (8-128)",
          },
          {
            name: "include_symbols",
            type: "string",
            description: "Include symbols: yes or no",
          },
        ],
        implementation: "const chars = \"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789\";\\nconst symbols = \"!@#$%^&*()-_=+\";\\nconst pool = include_symbols === \"yes\" ? chars + symbols : chars;\\nconst len = Math.min(Math.max(8, length), 128);\\nreturn Array.from({ length: len }, () => pool[Math.floor(Math.random() * pool.length)]).join(\"\");",
      },
      {
        name: "generate_placeholder_data",
        description: "Generate placeholder JSON data",
        params: [
          {
            name: "count",
            type: "number",
            description: "Number of records (1-50)",
          },
        ],
        implementation: "const fn=[\"Alice\",\"Bob\",\"Charlie\",\"Diana\"];const ln=[\"Smith\",\"Johnson\",\"Brown\"];const dm=[\"example.com\",\"test.org\"];\\nconst n=Math.min(Math.max(1,count),50);\\nconst r=Array.from({length:n},(_,i)=>{const f=fn[Math.floor(Math.random()*fn.length)];const l=ln[Math.floor(Math.random()*ln.length)];const d=dm[Math.floor(Math.random()*dm.length)];return{id:i+1,name:f+\" \"+l,email:(f+\".\"+l+\"@\"+d).toLowerCase(),active:Math.random()>0.3};});\\nreturn JSON.stringify(r,null,2);",
      },
    ],
  },
  validator: {
    name: "validator",
    label: "Validator — Input Validation",
    description: "An input validation server with tools for validating emails, URLs, JSON, and date formats.",
    tools: [
      {
        name: "validate_email",
        description: "Validate email addresses",
        params: [
          {
            name: "emails",
            type: "string",
            description: "Comma-separated email addresses",
          },
        ],
        implementation: "const p=/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\\\.[a-zA-Z]{2,}$/;\\nreturn emails.split(\",\").map(e=>e.trim()).map(e=>(p.test(e)?\"VALID\":\"INVALID\")+\": \"+e).join(\"\\n\");",
      },
      {
        name: "validate_url",
        description: "Validate URLs",
        params: [
          {
            name: "urls",
            type: "string",
            description: "Comma-separated URLs",
          },
        ],
        implementation: "return urls.split(\",\").map(u=>u.trim()).map(u=>{try{new URL(u);return \"VALID: \"+u;}catch{return \"INVALID: \"+u;}}).join(\"\\n\");",
      },
      {
        name: "validate_json",
        description: "Validate JSON syntax",
        params: [
          {
            name: "json_input",
            type: "string",
            description: "JSON string to validate",
          },
        ],
        implementation: "try{const p=JSON.parse(json_input);return \"VALID JSON\\nType: \"+(Array.isArray(p)?\"array\":typeof p)+\"\\nSize: \"+JSON.stringify(p).length+\" chars\";}catch(e:unknown){return \"INVALID JSON\\nError: \"+(e as Error).message;}",
      },
      {
        name: "validate_date",
        description: "Validate date strings",
        params: [
          {
            name: "dates",
            type: "string",
            description: "Comma-separated date strings",
          },
        ],
        implementation: "return dates.split(\",\").map(d=>d.trim()).map(d=>{const ts=Date.parse(d);return isNaN(ts)?\"INVALID: \"+d:\"VALID: \"+d+\" -> \"+new Date(ts).toISOString();}).join(\"\\n\");",
      },
    ],
  },
};

// === Code Generation Helpers ===

interface ToolParam { name: string; type: string; description: string; }
interface ToolDef { name: string; description: string; params: ToolParam[]; implementation: string; }

function zodTypeFor(type: string): string {
  switch (type.toLowerCase()) {
    case "number": return "z.number()";
    case "boolean": return "z.boolean()";
    case "string": default: return "z.string()";
  }
}

function generateIndexTs(serverName: string, description: string, tools: ToolDef[]): string {
  const lines: string[] = [];
  lines.push("#!/usr/bin/env node");
  lines.push("");
  lines.push('import { McpServer } from \"@modelcontextprotocol/sdk/server/mcp.js\";');
  lines.push('import { StdioServerTransport } from \"@modelcontextprotocol/sdk/server/stdio.js\";');
  lines.push('import { z } from \"zod\";');
  lines.push("");
  lines.push("const server = new McpServer(");
  lines.push(`  { name: ${JSON.stringify(serverName)}, version: \"1.0.0\" },`);
  lines.push("  { capabilities: { tools: {} }, instructions: " + JSON.stringify(description) + " }");
  lines.push(");");
  lines.push("");
  for (const tool of tools) {
    const paramParts: string[] = [];
    const names: string[] = [];
    for (const p of tool.params) {
      paramParts.push(`    ${p.name}: ${zodTypeFor(p.type)}.describe(${JSON.stringify(p.description)})`);
      names.push(p.name);
    }
    lines.push(`// Tool: ${tool.name}`);
    lines.push("server.tool(");
    lines.push(`  ${JSON.stringify(tool.name)},`);
    lines.push(`  ${JSON.stringify(tool.description)},`);
    lines.push("  {");
    lines.push(paramParts.join(",\n"));
    lines.push("  },");
    lines.push(`  async ({ ${names.join(", ")} }) => {`);
    lines.push("    try {");
    lines.push("      const result = (() => {");
    lines.push(`        ${tool.implementation}`);
    lines.push("      })();");
    lines.push('      return { content: [{ type: \"text\" as const, text: String(result) }] };');
    lines.push("    } catch (e: unknown) {");
    lines.push('      return { content: [{ type: \"text\" as const, text: `Error: ${(e as Error).message}` }], isError: true };');
    lines.push("    }");
    lines.push("  }");
    lines.push(");");
    lines.push("");
  }
  lines.push("async function main() { const transport = new StdioServerTransport(); await server.connect(transport); }");
  lines.push('main().catch((e) => { console.error(e); process.exit(1); });');
  return lines.join("\n");
}

function generatePackageJson(name: string, description: string): string {
  return JSON.stringify({
    name, version: "1.0.0", description, main: "dist/index.js",
    bin: { [name]: "dist/index.js" },
    scripts: { build: "tsc", start: "node dist/index.js", dev: "tsc && node dist/index.js" },
    keywords: ["mcp", "ai-tools", "typescript", name.replace(/-mcp$/, "")],
    author: "Sovereign (Taylor) <ricardo.yudi@gmail.com>", license: "MIT", type: "commonjs",
    dependencies: { "@modelcontextprotocol/sdk": "^1.26.0", zod: "^4.3.6" },
    devDependencies: { "@types/node": "^25.3.0", typescript: "^5.9.3" },
    repository: { type: "git", url: "https://github.com/ryudi84/sovereign-mcp-servers" },
    files: ["dist/", "README.md", "LICENSE"],
  }, null, 2);
}

function generateTsConfig(): string {
  return JSON.stringify({
    compilerOptions: { target: "ES2022", module: "Node16", moduleResolution: "Node16",
      outDir: "./dist", rootDir: "./src", strict: true, esModuleInterop: true, skipLibCheck: true, declaration: true },
    include: ["src/**/*"],
  }, null, 2);
}

function generateReadme(name: string, description: string, tools: ToolDef[]): string {
  const hdr = [`# ${name}`, "", description, "", "## Tools", "", "| Tool | Description |", "|------|-------------|"];
  for (const t of tools) hdr.push(`| \`${t.name}\` | ${t.description} |`);
  hdr.push("", "## Installation", "", "");
  hdr.push("", "## Build", "", "", "", "## License", "", "MIT");
  return hdr.join("\n");
}

function generateMcpizeYaml(name: string, description: string): string {
  const safeDesc = description.replace(/'/g, "''");
  return ["version: 1", `name: ${name}`, `description: '${safeDesc}'`,
    "runtime: typescript", "entry: src/index.ts", "build:", "  install: npm install",
    "  command: npm run build", "startCommand:", "  type: stdio", "  command: node",
    "  args:", "    - dist/index.js"].join("\n");
}

function formatFileOutput(files: Record<string, string>): string {
  return Object.entries(files).map(([f, c]) => `===== ${f} =====\n${c}`).join("\n\n");
}

// === MCP Server Setup ===

const server = new McpServer(
  { name: "mcp-forge", version: "1.0.0" },
  { capabilities: { tools: {} },
    instructions: "MCP Forge \u2014 A meta MCP server that generates other MCP servers. The factory that builds factories." }
);

server.tool(
  "generate_server",
  "Generate a complete MCP server package from a name, description, and tool definitions. Returns package.json, tsconfig.json, src/index.ts, README.md, and mcpize.yaml.",
  {
    name: z.string().describe("Server package name"),
    description: z.string().describe("Short description of what the server does"),
    tools: z.array(z.object({
      name: z.string().describe("Tool name (snake_case)"),
      description: z.string().describe("What the tool does"),
      params: z.array(z.object({
        name: z.string().describe("Parameter name"),
        type: z.string().describe("Parameter type: string, number, or boolean"),
        description: z.string().describe("Parameter description"),
      })).describe("Array of parameter definitions"),
      implementation: z.string().describe("TypeScript function body that returns a string value"),
    })).describe("Array of tool definitions"),
  },
  async ({ name, description, tools }) => {
    try {
      if (name === undefined || name.trim().length === 0) return { content: [{ type: "text", text: "Error: name is required" }], isError: true };
      if (tools === undefined || tools.length === 0) return { content: [{ type: "text", text: "Error: at least one tool definition is required" }], isError: true };
      const sn = name.endsWith("-mcp") ? name : name + "-mcp";
      const desc = description || `MCP server: ${sn}`;
      const files: Record<string, string> = {
        "package.json": generatePackageJson(sn, desc), "tsconfig.json": generateTsConfig(),
        "src/index.ts": generateIndexTs(sn, desc, tools), "README.md": generateReadme(sn, desc, tools),
        "mcpize.yaml": generateMcpizeYaml(sn, desc),
      };
      const output = [`Generated MCP server: ${sn}`, `Tools: ${tools.map(t => t.name).join(", ")}`,
        `Files: ${Object.keys(files).join(", ")}`, "", "To build:", `  mkdir ${sn} && cd ${sn}`,
        "  # Write each file below to its path", "  npm install && npm run build", "",
        "--- FILES ---", "", formatFileOutput(files)].join("\n");
      return { content: [{ type: "text", text: output }] };
    } catch (e: unknown) {
      return { content: [{ type: "text", text: `Error: ${(e as Error).message}` }], isError: true };
    }
  }
);

server.tool(
  "list_templates",
  "List available pre-built MCP server templates with their included tools.",
  {},
  async () => {
    const lines = ["Available MCP Server Templates:", ""];
    for (const tpl of Object.values(TEMPLATES)) {
      lines.push(`## ${tpl.label}`, tpl.description, `Included tools: ${tpl.tools.map(t => t.name).join(", ")}`, "");
    }
    lines.push("Usage: Call generate_from_template with a template name, your server name, and a description.");
    lines.push(`Template names: ${Object.keys(TEMPLATES).join(", ")}`);
    return { content: [{ type: "text", text: lines.join("\n") }] };
  }
);

server.tool(
  "generate_from_template",
  "Generate a complete MCP server from a pre-built template (utility, converter, generator, validator).",
  {
    template: z.string().describe("Template name: utility, converter, generator, or validator"),
    name: z.string().describe("Server package name"),
    description: z.string().describe("Short description of what the server does"),
  },
  async ({ template, name, description }) => {
    try {
      const tpl = TEMPLATES[template];
      if (tpl === undefined) {
        return { content: [{ type: "text", text: `Error: Unknown template "${template}". Available: ${Object.keys(TEMPLATES).join(", ")}` }], isError: true };
      }
      const sn = name.endsWith("-mcp") ? name : name + "-mcp";
      const desc = description || tpl.description;
      const files: Record<string, string> = {
        "package.json": generatePackageJson(sn, desc), "tsconfig.json": generateTsConfig(),
        "src/index.ts": generateIndexTs(sn, desc, tpl.tools), "README.md": generateReadme(sn, desc, tpl.tools),
        "mcpize.yaml": generateMcpizeYaml(sn, desc),
      };
      const output = [`Generated MCP server from template: ${tpl.label}`, `Server: ${sn}`,
        `Tools: ${tpl.tools.map(t => t.name).join(", ")}`, `Files: ${Object.keys(files).join(", ")}`,
        "", "To build:", `  mkdir ${sn} && cd ${sn}`, "  # Write each file below to its path",
        "  npm install && npm run build", "", "--- FILES ---", "", formatFileOutput(files)].join("\n");
      return { content: [{ type: "text", text: output }] };
    } catch (e: unknown) {
      return { content: [{ type: "text", text: `Error: ${(e as Error).message}` }], isError: true };
    }
  }
);

export function createSandboxServer() { return server; }

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

const isDirectRun = process.env.SMITHERY_SCAN === undefined;
if (isDirectRun) {
  main().catch((error) => { console.error("Fatal error:", error); process.exit(1); });
}
