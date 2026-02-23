#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// === JSON Processing Utilities ===

function getDepth(obj: unknown, current = 0): number {
  if (typeof obj !== "object" || obj === null) return current;
  const entries = Array.isArray(obj) ? obj : Object.values(obj);
  if (entries.length === 0) return current + 1;
  return Math.max(...entries.map((v) => getDepth(v, current + 1)));
}

function countKeys(obj: unknown): number {
  if (typeof obj !== "object" || obj === null) return 0;
  if (Array.isArray(obj)) return obj.reduce((s: number, v) => s + countKeys(v), 0);
  return Object.keys(obj).length + Object.values(obj).reduce((s: number, v) => s + countKeys(v), 0);
}

function analyzeStructure(obj: unknown, indent = 0, maxDepth = 5): string {
  const pad = "  ".repeat(indent);
  if (indent > maxDepth) return pad + "...\n";
  if (Array.isArray(obj)) {
    if (obj.length === 0) return pad + "[] (empty array)\n";
    return pad + `Array[${obj.length}]\n` + analyzeStructure(obj[0], indent + 1, maxDepth);
  }
  if (typeof obj === "object" && obj !== null) {
    let result = "";
    for (const [k, v] of Object.entries(obj)) {
      const type = Array.isArray(v) ? `Array[${v.length}]` : typeof v;
      result += pad + `${k}: ${type}\n`;
      if (typeof v === "object" && v !== null) result += analyzeStructure(v, indent + 1, maxDepth);
    }
    return result;
  }
  return pad + `${typeof obj}: ${String(obj)}\n`;
}

function deepDiff(a: unknown, b: unknown, path = ""): Array<{ path: string; type: string; oldVal?: unknown; newVal?: unknown }> {
  const diffs: Array<{ path: string; type: string; oldVal?: unknown; newVal?: unknown }> = [];
  if (typeof a !== typeof b || Array.isArray(a) !== Array.isArray(b)) {
    diffs.push({ path: path || "$", type: "changed", oldVal: a, newVal: b });
    return diffs;
  }
  if (typeof a !== "object" || a === null || b === null) {
    if (a !== b) diffs.push({ path: path || "$", type: "changed", oldVal: a, newVal: b });
    return diffs;
  }
  const aObj = a as Record<string, unknown>;
  const bObj = b as Record<string, unknown>;
  const allKeys = new Set([...Object.keys(aObj), ...Object.keys(bObj)]);
  for (const key of allKeys) {
    const p = path ? `${path}.${key}` : key;
    if (!(key in aObj)) diffs.push({ path: p, type: "added", newVal: bObj[key] });
    else if (!(key in bObj)) diffs.push({ path: p, type: "removed", oldVal: aObj[key] });
    else diffs.push(...deepDiff(aObj[key], bObj[key], p));
  }
  return diffs;
}

function jsonToYaml(obj: unknown, indent = 0): string {
  const pad = "  ".repeat(indent);
  if (obj === null || obj === undefined) return "null";
  if (typeof obj === "boolean" || typeof obj === "number") return String(obj);
  if (typeof obj === "string") {
    return /[:#\n]/.test(obj) ? `"${obj.replace(/"/g, '\\"')}"` : obj;
  }
  if (Array.isArray(obj)) {
    if (obj.length === 0) return "[]";
    return obj.map((item) => {
      const val = jsonToYaml(item, indent + 1);
      return typeof item === "object" && item !== null
        ? `${pad}- \n${val}`
        : `${pad}- ${val}`;
    }).join("\n");
  }
  if (typeof obj === "object") {
    const entries = Object.entries(obj);
    if (entries.length === 0) return "{}";
    return entries.map(([k, v]) => {
      const val = jsonToYaml(v, indent + 1);
      return typeof v === "object" && v !== null
        ? `${pad}${k}:\n${val}`
        : `${pad}${k}: ${val}`;
    }).join("\n");
  }
  return String(obj);
}

function jsonToCsv(obj: unknown): string {
  if (!Array.isArray(obj)) return "Error: CSV conversion requires a JSON array of objects";
  if (obj.length === 0) return "";
  const headers = new Set<string>();
  for (const row of obj) {
    if (typeof row === "object" && row !== null) {
      Object.keys(row).forEach((k) => headers.add(k));
    }
  }
  const cols = [...headers];
  const escape = (val: unknown): string => {
    const s = val === null || val === undefined ? "" : String(val);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [cols.join(",")];
  for (const row of obj) {
    const r = row as Record<string, unknown>;
    lines.push(cols.map((c) => escape(r[c])).join(","));
  }
  return lines.join("\n");
}

function jsonToXml(obj: unknown, rootTag = "root", indent = 0): string {
  const pad = "  ".repeat(indent);
  if (typeof obj !== "object" || obj === null) {
    const escaped = String(obj).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return `${pad}<${rootTag}>${escaped}</${rootTag}>`;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => jsonToXml(item, "item", indent)).join("\n");
  }
  let xml = `${pad}<${rootTag}>\n`;
  for (const [k, v] of Object.entries(obj)) {
    xml += jsonToXml(v, k, indent + 1) + "\n";
  }
  xml += `${pad}</${rootTag}>`;
  return xml;
}

function jsonToToml(obj: unknown, section = ""): string {
  if (typeof obj !== "object" || obj === null || Array.isArray(obj)) {
    return "Error: TOML requires a JSON object at root level";
  }
  const lines: string[] = [];
  const nested: Array<[string, unknown]> = [];
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === "object" && v !== null && !Array.isArray(v)) {
      nested.push([k, v]);
    } else if (typeof v === "string") {
      lines.push(`${k} = "${v}"`);
    } else {
      lines.push(`${k} = ${JSON.stringify(v)}`);
    }
  }
  for (const [k, v] of nested) {
    const sec = section ? `${section}.${k}` : k;
    lines.push("", `[${sec}]`, jsonToToml(v, sec));
  }
  return lines.join("\n");
}

function jsonToTypescript(obj: unknown, name = "Root"): string {
  if (typeof obj !== "object" || obj === null) return `type ${name} = ${typeof obj};`;
  if (Array.isArray(obj)) {
    if (obj.length === 0) return `type ${name} = unknown[];`;
    const itemType = jsonToTypescript(obj[0], `${name}Item`);
    return `${itemType}\n\ntype ${name} = ${name}Item[];`;
  }
  const fields: string[] = [];
  const childTypes: string[] = [];
  for (const [k, v] of Object.entries(obj)) {
    if (Array.isArray(v)) {
      if (v.length > 0 && typeof v[0] === "object" && v[0] !== null) {
        const childName = k.charAt(0).toUpperCase() + k.slice(1) + "Item";
        childTypes.push(jsonToTypescript(v[0], childName));
        fields.push(`  ${k}: ${childName}[];`);
      } else {
        const itemType = v.length > 0 ? typeof v[0] : "unknown";
        fields.push(`  ${k}: ${itemType}[];`);
      }
    } else if (typeof v === "object" && v !== null) {
      const childName = k.charAt(0).toUpperCase() + k.slice(1);
      childTypes.push(jsonToTypescript(v, childName));
      fields.push(`  ${k}: ${childName};`);
    } else {
      fields.push(`  ${k}: ${typeof v};`);
    }
  }
  return [...childTypes, `interface ${name} {\n${fields.join("\n")}\n}`].join("\n\n");
}

function queryJson(obj: unknown, path: string): unknown {
  const parts = path.replace(/^\$\.?/, "").split(/\.|\[(\d+)\]/).filter(Boolean);
  let current: unknown = obj;
  for (const part of parts) {
    if (current === null || current === undefined) return undefined;
    if (typeof current === "object") {
      current = (current as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }
  return current;
}

// === MCP Server Setup ===

const server = new McpServer(
  { name: "json-forge", version: "1.0.0" },
  {
    capabilities: { tools: {} },
    instructions: "JSON Forge MCP Server — A complete JSON processing toolkit. Format, validate, diff, convert, minify, query, and analyze JSON data.",
  }
);

// Tool: format_json
server.tool(
  "format_json",
  "Pretty-print JSON with 2-space indentation",
  { json: z.string().describe("JSON string to format") },
  async ({ json }) => {
    try {
      const parsed = JSON.parse(json);
      const formatted = JSON.stringify(parsed, null, 2);
      return { content: [{ type: "text", text: formatted }] };
    } catch (e: unknown) {
      return { content: [{ type: "text", text: `Error: ${(e as Error).message}` }], isError: true };
    }
  }
);

// Tool: validate_json
server.tool(
  "validate_json",
  "Validate JSON and return a detailed structure report",
  { json: z.string().describe("JSON string to validate") },
  async ({ json }) => {
    try {
      const parsed = JSON.parse(json);
      const type = Array.isArray(parsed) ? "Array" : typeof parsed;
      const depth = getDepth(parsed);
      const keys = countKeys(parsed);
      const size = new TextEncoder().encode(json).length;
      const report = [
        "✓ Valid JSON",
        `Type: ${type}`,
        `Depth: ${depth}`,
        `Keys/Items: ${keys}`,
        `Size: ${size} bytes`,
        "",
        "Structure:",
        analyzeStructure(parsed),
      ].join("\n");
      return { content: [{ type: "text", text: report }] };
    } catch (e: unknown) {
      const msg = (e as Error).message;
      return { content: [{ type: "text", text: `✗ Invalid JSON\n\nError: ${msg}` }], isError: true };
    }
  }
);

// Tool: diff_json
server.tool(
  "diff_json",
  "Compare two JSON objects and show differences",
  {
    json_a: z.string().describe("First JSON string"),
    json_b: z.string().describe("Second JSON string"),
  },
  async ({ json_a, json_b }) => {
    try {
      const a = JSON.parse(json_a);
      const b = JSON.parse(json_b);
      const diffs = deepDiff(a, b);
      if (diffs.length === 0) {
        return { content: [{ type: "text", text: "No differences found. The objects are identical." }] };
      }
      const report = diffs
        .map((d) => {
          if (d.type === "added") return `+ ${d.path}: ${JSON.stringify(d.newVal)}`;
          if (d.type === "removed") return `- ${d.path}: ${JSON.stringify(d.oldVal)}`;
          return `~ ${d.path}: ${JSON.stringify(d.oldVal)} → ${JSON.stringify(d.newVal)}`;
        })
        .join("\n");
      return { content: [{ type: "text", text: `${diffs.length} difference(s) found:\n\n${report}` }] };
    } catch (e: unknown) {
      return { content: [{ type: "text", text: `Error: ${(e as Error).message}` }], isError: true };
    }
  }
);

// Tool: convert_json
server.tool(
  "convert_json",
  "Convert JSON to another format: yaml, csv, xml, toml, or typescript",
  {
    json: z.string().describe("JSON string to convert"),
    format: z.enum(["yaml", "csv", "xml", "toml", "typescript"]).describe("Target format"),
  },
  async ({ json, format }) => {
    try {
      const parsed = JSON.parse(json);
      let result: string;
      switch (format) {
        case "yaml": result = jsonToYaml(parsed); break;
        case "csv": result = jsonToCsv(parsed); break;
        case "xml": result = `<?xml version="1.0" encoding="UTF-8"?>\n${jsonToXml(parsed)}`; break;
        case "toml": result = jsonToToml(parsed); break;
        case "typescript": result = jsonToTypescript(parsed); break;
      }
      return { content: [{ type: "text", text: result }] };
    } catch (e: unknown) {
      return { content: [{ type: "text", text: `Error: ${(e as Error).message}` }], isError: true };
    }
  }
);

// Tool: minify_json
server.tool(
  "minify_json",
  "Minify JSON by removing all whitespace. Returns minified output and compression stats.",
  { json: z.string().describe("JSON string to minify") },
  async ({ json }) => {
    try {
      const parsed = JSON.parse(json);
      const minified = JSON.stringify(parsed);
      const originalSize = new TextEncoder().encode(json).length;
      const minifiedSize = new TextEncoder().encode(minified).length;
      const saved = originalSize - minifiedSize;
      const pct = originalSize > 0 ? ((saved / originalSize) * 100).toFixed(1) : "0";
      const result = `${minified}\n\n--- Stats ---\nOriginal: ${originalSize} bytes\nMinified: ${minifiedSize} bytes\nSaved: ${saved} bytes (${pct}%)`;
      return { content: [{ type: "text", text: result }] };
    } catch (e: unknown) {
      return { content: [{ type: "text", text: `Error: ${(e as Error).message}` }], isError: true };
    }
  }
);

// Tool: query_json
server.tool(
  "query_json",
  "Extract data from JSON using dot-notation path (e.g. 'users[0].name', '$.store.book')",
  {
    json: z.string().describe("JSON string to query"),
    path: z.string().describe("JSONPath-style query (dot notation, e.g. 'users[0].name')"),
  },
  async ({ json, path }) => {
    try {
      const parsed = JSON.parse(json);
      const result = queryJson(parsed, path);
      if (result === undefined) {
        return { content: [{ type: "text", text: `No value found at path: ${path}` }] };
      }
      const output = typeof result === "object" ? JSON.stringify(result, null, 2) : String(result);
      return { content: [{ type: "text", text: output }] };
    } catch (e: unknown) {
      return { content: [{ type: "text", text: `Error: ${(e as Error).message}` }], isError: true };
    }
  }
);

// Tool: analyze_json
server.tool(
  "analyze_json",
  "Analyze JSON structure: type, depth, key count, size, and structure tree",
  { json: z.string().describe("JSON string to analyze") },
  async ({ json }) => {
    try {
      const parsed = JSON.parse(json);
      const type = Array.isArray(parsed) ? `Array[${parsed.length}]` : typeof parsed;
      const depth = getDepth(parsed);
      const keys = countKeys(parsed);
      const size = new TextEncoder().encode(json).length;
      const lines = JSON.stringify(parsed, null, 2).split("\n").length;
      const structure = analyzeStructure(parsed);
      const report = [
        `Type: ${type}`,
        `Depth: ${depth}`,
        `Keys: ${keys}`,
        `Size: ${size} bytes`,
        `Lines: ${lines}`,
        "",
        "Structure:",
        structure,
      ].join("\n");
      return { content: [{ type: "text", text: report }] };
    } catch (e: unknown) {
      return { content: [{ type: "text", text: `Error: ${(e as Error).message}` }], isError: true };
    }
  }
);

// === Start Server ===

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
