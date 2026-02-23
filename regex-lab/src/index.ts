#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";



// === MCP Server Setup ===

const server = new McpServer(
  { name: "regex-lab", version: "1.0.0" },
  {
    capabilities: { tools: {} },
    instructions: "MCP server for regex testing, matching, replacing, and validation.",
  }
);

// Tool: test_regex
server.tool(
  "test_regex",
  "Test a regex pattern against a string. Returns all matches with positions and capture groups.",
  {
    pattern: z.string().describe("Regular expression pattern"),
    flags: z.string().default("g").describe("Regex flags (g, m, i, s)"),
    test_string: z.string().describe("String to test against")
  },
  async ({ pattern, flags, test_string }) => {
    try {
      const regex = new RegExp(pattern, flags);
      const matches: string[] = [];
      let match: RegExpExecArray | null;
      if (flags.includes("g")) {
        while ((match = regex.exec(test_string)) !== null) {
          matches.push(`Match ${matches.length + 1}: "${match[0]}" at index ${match.index}${match.length > 1 ? " groups: " + match.slice(1).join(", ") : ""}`);
        }
      } else {
        match = regex.exec(test_string);
        if (match) matches.push(`Match: "${match[0]}" at index ${match.index}${match.length > 1 ? " groups: " + match.slice(1).join(", ") : ""}`);
      }
      const result = matches.length > 0 ? matches.join("\n") : "No matches found.";
      return { content: [{ type: "text", text: result }] };
    } catch (e: unknown) {
      return { content: [{ type: "text", text: `Error: ${(e as Error).message}` }], isError: true };
    }
  }
);

// Tool: replace_regex
server.tool(
  "replace_regex",
  "Replace matches in a string using a regex pattern and replacement string.",
  {
    pattern: z.string().describe("Regular expression pattern"),
    flags: z.string().default("g").describe("Regex flags"),
    test_string: z.string().describe("Input string"),
    replacement: z.string().describe("Replacement string (supports $1 capture groups)")
  },
  async ({ pattern, flags, test_string, replacement }) => {
    try {
      const regex = new RegExp(pattern, flags);
      const result = test_string.replace(regex, replacement);
      return { content: [{ type: "text", text: result }] };
    } catch (e: unknown) {
      return { content: [{ type: "text", text: `Error: ${(e as Error).message}` }], isError: true };
    }
  }
);

// Tool: validate_regex
server.tool(
  "validate_regex",
  "Check if a regex pattern is syntactically valid.",
  {
    pattern: z.string().describe("Regex pattern to validate")
  },
  async ({ pattern }) => {
    try {
      try { new RegExp(pattern); return { content: [{ type: "text", text: "✓ Valid regex pattern" }] }; }
      catch (err: unknown) { return { content: [{ type: "text", text: `✗ Invalid: ${(err as Error).message}` }] }; }
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
