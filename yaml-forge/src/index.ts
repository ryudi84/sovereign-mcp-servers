#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";


// Simple YAML parser/serializer (no deps)
function jsonToYaml(obj: unknown, indent: number = 0): string {
  const pad = "  ".repeat(indent);
  if (obj === null || obj === undefined) return pad + "null";
  if (typeof obj === "string") {
    if (obj.includes("\n") || obj.includes(": ") || obj.includes("#")) return pad + `"${obj.replace(/"/g, '\\"')}"`;
    return pad + obj;
  }
  if (typeof obj === "number" || typeof obj === "boolean") return pad + String(obj);
  if (Array.isArray(obj)) {
    if (obj.length === 0) return pad + "[]";
    return obj.map(item => {
      const val = jsonToYaml(item, indent + 1).trimStart();
      return pad + "- " + val;
    }).join("\n");
  }
  if (typeof obj === "object") {
    const entries = Object.entries(obj as Record<string, unknown>);
    if (entries.length === 0) return pad + "{}";
    return entries.map(([key, val]) => {
      if (typeof val === "object" && val !== null) {
        return pad + key + ":\n" + jsonToYaml(val, indent + 1);
      }
      return pad + key + ": " + jsonToYaml(val, 0).trimStart();
    }).join("\n");
  }
  return pad + String(obj);
}

// Simple YAML to JSON (handles basic YAML)
function yamlToJson(yaml: string): unknown {
  const lines = yaml.split("\n").filter(l => !l.trim().startsWith("#") && l.trim() !== "");
  const result: Record<string, unknown> = {};
  let currentKey = "";
  let currentIndent = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === "---" || trimmed === "...") continue;
    const indent = line.search(/\S/);

    // Key: value
    const kvMatch = trimmed.match(/^([^:]+):\s*(.+)$/);
    if (kvMatch && indent === 0) {
      const key = kvMatch[1].trim();
      let val: unknown = kvMatch[2].trim();
      if (val === "true") val = true;
      else if (val === "false") val = false;
      else if (val === "null") val = null;
      else if (!isNaN(Number(val)) && val !== "") val = Number(val);
      else if (typeof val === "string" && val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
      result[key] = val;
      currentKey = key;
      currentIndent = indent;
    } else if (kvMatch && indent === 0) {
      result[kvMatch[1].trim()] = kvMatch[2].trim();
    }
    // Array item
    else if (trimmed.startsWith("- ")) {
      if (!Array.isArray(result[currentKey])) result[currentKey] = [];
      (result[currentKey] as unknown[]).push(trimmed.slice(2).trim());
    }
    // Nested key (just assign as string for simple parser)
    else if (trimmed.includes(":")) {
      const [k, ...v] = trimmed.split(":");
      if (indent > currentIndent && currentKey) {
        if (typeof result[currentKey] !== "object" || Array.isArray(result[currentKey])) {
          result[currentKey] = {};
        }
        (result[currentKey] as Record<string, unknown>)[k.trim()] = v.join(":").trim() || null;
      }
    }
  }
  return result;
}


// === MCP Server Setup ===

const server = new McpServer(
  { name: "yaml-forge", version: "1.0.0" },
  {
    capabilities: { tools: {} },
    instructions: "MCP server for YAML — format, validate, convert between JSON/YAML, merge files, query paths.",
  }
);

// Tool: json_to_yaml
server.tool(
  "json_to_yaml",
  "Convert JSON to YAML format.",
  {
    json_str: z.string().describe("JSON string to convert")
  },
  async ({ json_str }) => {
    try {
      const obj = JSON.parse(json_str);
      const yaml = jsonToYaml(obj);
      return { content: [{ type: "text", text: `\`\`\`yaml\n${yaml}\n\`\`\`` }] };
    } catch (e: unknown) {
      return { content: [{ type: "text", text: `Error: ${(e as Error).message}` }], isError: true };
    }
  }
);

// Tool: yaml_to_json
server.tool(
  "yaml_to_json",
  "Convert YAML to JSON format.",
  {
    yaml_str: z.string().describe("YAML string to convert")
  },
  async ({ yaml_str }) => {
    try {
      const obj = yamlToJson(yaml_str);
      const json = JSON.stringify(obj, null, 2);
      return { content: [{ type: "text", text: `\`\`\`json\n${json}\n\`\`\`` }] };
    } catch (e: unknown) {
      return { content: [{ type: "text", text: `Error: ${(e as Error).message}` }], isError: true };
    }
  }
);

// Tool: format_yaml
server.tool(
  "format_yaml",
  "Format/prettify YAML content with consistent indentation.",
  {
    yaml_str: z.string().describe("YAML to format")
  },
  async ({ yaml_str }) => {
    try {
      // Parse then re-serialize for consistent formatting
      const obj = yamlToJson(yaml_str);
      const formatted = jsonToYaml(obj);
      return { content: [{ type: "text", text: `\`\`\`yaml\n${formatted}\n\`\`\`` }] };
    } catch (e: unknown) {
      return { content: [{ type: "text", text: `Error: ${(e as Error).message}` }], isError: true };
    }
  }
);

// Tool: validate_yaml
server.tool(
  "validate_yaml",
  "Validate YAML syntax and report errors.",
  {
    yaml_str: z.string().describe("YAML to validate")
  },
  async ({ yaml_str }) => {
    try {
      const issues: string[] = [];
      const lines = yaml_str.split("\n");
      let tabLine = -1;
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes("\t")) { tabLine = i + 1; break; }
      }
      if (tabLine > 0) issues.push(`Line ${tabLine}: Contains tabs (YAML requires spaces for indentation)`);

      // Check for duplicate keys at root level
      const rootKeys = new Set<string>();
      for (const line of lines) {
        const m = line.match(/^([a-zA-Z_][a-zA-Z0-9_-]*)\s*:/);
        if (m) {
          if (rootKeys.has(m[1])) issues.push(`Duplicate root key: "${m[1]}"`);
          rootKeys.add(m[1]);
        }
      }

      // Try parsing
      try {
        yamlToJson(yaml_str);
      } catch (e) {
        issues.push(`Parse error: ${(e as Error).message}`);
      }

      if (issues.length === 0) return { content: [{ type: "text", text: "PASS: YAML is valid." }] };
      return { content: [{ type: "text", text: `FAIL: ${issues.length} issue(s):\n\n${issues.map((i, n) => `${n+1}. ${i}`).join("\n")}` }] };
    } catch (e: unknown) {
      return { content: [{ type: "text", text: `Error: ${(e as Error).message}` }], isError: true };
    }
  }
);

// Tool: yaml_template
server.tool(
  "yaml_template",
  "Generate YAML templates for common configs (docker-compose, github-actions, k8s, cloudflare).",
  {
    template: z.enum(["docker-compose", "github-actions", "k8s-deployment", "cloudflare-worker", "prettier", "eslint"]).describe("Template type")
  },
  async ({ template }) => {
    try {
      const templates: Record<string, string> = {
        "docker-compose": "version: \"3.8\"\nservices:\n  app:\n    build: .\n    ports:\n      - \"3000:3000\"\n    environment:\n      - NODE_ENV=production\n    volumes:\n      - ./data:/app/data\n    restart: unless-stopped",
        "github-actions": "name: CI\non:\n  push:\n    branches: [main]\n  pull_request:\n    branches: [main]\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: 20\n      - run: npm ci\n      - run: npm test",
        "k8s-deployment": "apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: app\n  labels:\n    app: app\nspec:\n  replicas: 2\n  selector:\n    matchLabels:\n      app: app\n  template:\n    metadata:\n      labels:\n        app: app\n    spec:\n      containers:\n        - name: app\n          image: app:latest\n          ports:\n            - containerPort: 3000",
        "cloudflare-worker": "name: my-worker\nmain: src/index.ts\ncompatibility_date: \"2024-01-01\"\n\n[vars]\nENVIRONMENT = \"production\"",
        "prettier": "semi: true\ntrailingComma: all\nsingleQuote: true\nprintWidth: 100\ntabWidth: 2",
        "eslint": "root: true\nenv:\n  node: true\n  es2022: true\nextends:\n  - eslint:recommended\nparserOptions:\n  ecmaVersion: 2022\n  sourceType: module\nrules:\n  no-console: warn\n  no-unused-vars: error"
      };
      const t = templates[template] || "Unknown template";
      return { content: [{ type: "text", text: `\`\`\`yaml\n${t}\n\`\`\`` }] };
    } catch (e: unknown) {
      return { content: [{ type: "text", text: `Error: ${(e as Error).message}` }], isError: true };
    }
  }
);

// === Smithery sandbox support ===
export function createSandboxServer() {
  return server;
}

// === Start Server ===

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

// Only auto-start when run directly
const isDirectRun = !process.env.SMITHERY_SCAN;
if (isDirectRun) {
  main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
}
