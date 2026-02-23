#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";



// === MCP Server Setup ===

const server = new McpServer(
  { name: "env-forge", version: "1.0.0" },
  {
    capabilities: { tools: {} },
    instructions: "MCP server for .env file validation, parsing, comparison, and generation. Every project uses .env files.",
  }
);

// Tool: parse_env
server.tool(
  "parse_env",
  "Parse a .env file content and return all key-value pairs with metadata.",
  {
    content: z.string().describe(".env file contents")
  },
  async ({ content }) => {
    try {
      const lines = content.split("\n");
      const vars: string[] = [];
      let comments = 0, empty = 0, entries = 0;
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) { empty++; continue; }
        if (trimmed.startsWith("#")) { comments++; continue; }
        const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)/);
        if (match) {
          entries++;
          let val = match[2].replace(/^["']|["']$/g, "");
          const masked = val.length > 4 ? val.slice(0, 2) + "*".repeat(val.length - 4) + val.slice(-2) : "****";
          vars.push(`${match[1]}=${masked}`);
        }
      }
      const result = [`Parsed ${entries} variables, ${comments} comments, ${empty} blank lines`, "", ...vars];
      return { content: [{ type: "text", text: result.join("\n") }] };
    } catch (e: unknown) {
      return { content: [{ type: "text", text: `Error: ${(e as Error).message}` }], isError: true };
    }
  }
);

// Tool: validate_env
server.tool(
  "validate_env",
  "Validate .env content against an expected schema (list of required keys).",
  {
    content: z.string().describe(".env file contents"),
    required_keys: z.string().describe("Comma-separated list of required env var names")
  },
  async ({ content, required_keys }) => {
    try {
      const lines = content.split("\n");
      const defined = new Set<string>();
      for (const line of lines) {
        const match = line.trim().match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=/);
        if (match) defined.add(match[1]);
      }
      const required = required_keys.split(",").map(k => k.trim()).filter(Boolean);
      const missing = required.filter(k => !defined.has(k));
      const extra = [...defined].filter(k => !required.includes(k));
      const checks = [
        `Required: ${required.length}`,
        `Defined: ${defined.size}`,
        `Missing: ${missing.length > 0 ? missing.join(", ") : "none"}`,
        `Extra: ${extra.length > 0 ? extra.join(", ") : "none"}`,
        "",
        missing.length === 0 ? "VALID - all required keys present" : `INVALID - missing: ${missing.join(", ")}`,
      ];
      return { content: [{ type: "text", text: checks.join("\n") }] };
    } catch (e: unknown) {
      return { content: [{ type: "text", text: `Error: ${(e as Error).message}` }], isError: true };
    }
  }
);

// Tool: generate_env_template
server.tool(
  "generate_env_template",
  "Generate an .env.example template from a list of variable names with placeholder values.",
  {
    keys: z.string().describe("Comma-separated variable names (e.g. 'DATABASE_URL,API_KEY,PORT')")
  },
  async ({ keys }) => {
    try {
      const vars = keys.split(",").map(k => k.trim()).filter(Boolean);
      const placeholders: Record<string, string> = {
        "DATABASE_URL": "postgresql://user:password@localhost:5432/dbname",
        "API_KEY": "your-api-key-here",
        "SECRET_KEY": "your-secret-key-here",
        "JWT_SECRET": "your-jwt-secret-here",
        "PORT": "3000",
        "HOST": "localhost",
        "NODE_ENV": "development",
        "LOG_LEVEL": "info",
        "REDIS_URL": "redis://localhost:6379",
        "SMTP_HOST": "smtp.example.com",
        "SMTP_PORT": "587",
        "AWS_REGION": "us-east-1",
        "S3_BUCKET": "your-bucket-name",
      };
      const lines = ["# Environment Variables", "# Copy this to .env and fill in your values", ""];
      for (const key of vars) {
        const val = placeholders[key] || `your-${key.toLowerCase().replace(/_/g, "-")}-here`;
        lines.push(`${key}=${val}`);
      }
      return { content: [{ type: "text", text: lines.join("\n") }] };
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
