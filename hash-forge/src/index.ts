#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import * as crypto from "crypto";

// === MCP Server Setup ===

const server = new McpServer(
  { name: "hash-forge", version: "1.0.0" },
  {
    capabilities: { tools: {} },
    instructions: "MCP server for hashing text with MD5, SHA-1, SHA-256, SHA-384, SHA-512 and HMAC generation.",
  }
);

// Tool: hash_text
server.tool(
  "hash_text",
  "Hash text with all algorithms: MD5, SHA-1, SHA-256, SHA-384, SHA-512.",
  {
    text: z.string().describe("Text to hash")
  },
  async ({ text }) => {
    try {
      const algos = ["md5", "sha1", "sha256", "sha384", "sha512"];
      const results = algos.map(a => `${a.toUpperCase()}: ${crypto.createHash(a).update(text).digest("hex")}`);
      return { content: [{ type: "text", text: results.join("\n") }] };
    } catch (e: unknown) {
      return { content: [{ type: "text", text: `Error: ${(e as Error).message}` }], isError: true };
    }
  }
);

// Tool: compute_hmac
server.tool(
  "compute_hmac",
  "Generate an HMAC signature.",
  {
    key: z.string().describe("Secret key"),
    message: z.string().describe("Message to sign"),
    algorithm: z.enum(["sha1", "sha256", "sha384", "sha512"]).default("sha256").describe("Hash algorithm")
  },
  async ({ key, message, algorithm }) => {
    try {
      const hmac = crypto.createHmac(algorithm, key).update(message).digest("hex");
      return { content: [{ type: "text", text: `HMAC-${algorithm.toUpperCase()}: ${hmac}` }] };
    } catch (e: unknown) {
      return { content: [{ type: "text", text: `Error: ${(e as Error).message}` }], isError: true };
    }
  }
);

// Tool: compare_hashes
server.tool(
  "compare_hashes",
  "Compare two hash strings (case-insensitive).",
  {
    hash_a: z.string().describe("First hash"),
    hash_b: z.string().describe("Second hash")
  },
  async ({ hash_a, hash_b }) => {
    try {
      const match = hash_a.toLowerCase().trim() === hash_b.toLowerCase().trim();
      return { content: [{ type: "text", text: match ? "✓ Hashes match" : "✗ Hashes do NOT match" }] };
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
