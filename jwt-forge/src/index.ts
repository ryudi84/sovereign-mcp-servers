#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";



// === MCP Server Setup ===

const server = new McpServer(
  { name: "jwt-forge", version: "1.0.0" },
  {
    capabilities: { tools: {} },
    instructions: "MCP server for decoding, analyzing, and validating JWT tokens.",
  }
);

// Tool: decode_jwt
server.tool(
  "decode_jwt",
  "Decode a JWT and return header, payload, and signature.",
  {
    token: z.string().describe("JWT token string")
  },
  async ({ token }) => {
    try {
      const parts = token.split(".");
      if (parts.length !== 3) return { content: [{ type: "text", text: "✗ Invalid JWT: must have 3 parts separated by dots" }], isError: true };
      const decode = (s: string) => JSON.parse(Buffer.from(s, "base64url").toString("utf-8"));
      const header = decode(parts[0]);
      const payload = decode(parts[1]);
      const sig = Buffer.from(parts[2], "base64url").toString("hex");
      const now = Math.floor(Date.now() / 1000);
      let expiry = "No expiration claim";
      if (payload.exp) expiry = payload.exp > now ? `✓ Valid (expires ${new Date(payload.exp * 1000).toISOString()})` : `✗ Expired (${new Date(payload.exp * 1000).toISOString()})`;
      const result = [
        "=== Header ===", JSON.stringify(header, null, 2),
        "\n=== Payload ===", JSON.stringify(payload, null, 2),
        "\n=== Signature ===", sig,
        "\n=== Expiry ===", expiry
      ].join("\n");
      return { content: [{ type: "text", text: result }] };
    } catch (e: unknown) {
      return { content: [{ type: "text", text: `Error: ${(e as Error).message}` }], isError: true };
    }
  }
);

// Tool: validate_jwt_format
server.tool(
  "validate_jwt_format",
  "Check if a JWT is well-formed (3 parts, valid base64url, parseable header/payload).",
  {
    token: z.string().describe("JWT token to validate")
  },
  async ({ token }) => {
    try {
      const parts = token.split(".");
      const checks: string[] = [];
      checks.push(parts.length === 3 ? "✓ Has 3 parts" : "✗ Must have 3 dot-separated parts");
      try { JSON.parse(Buffer.from(parts[0] || "", "base64url").toString()); checks.push("✓ Header is valid JSON"); } catch { checks.push("✗ Header is not valid JSON"); }
      try { JSON.parse(Buffer.from(parts[1] || "", "base64url").toString()); checks.push("✓ Payload is valid JSON"); } catch { checks.push("✗ Payload is not valid JSON"); }
      return { content: [{ type: "text", text: checks.join("\n") }] };
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
