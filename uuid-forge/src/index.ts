#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import * as crypto from "crypto";

// === MCP Server Setup ===

const server = new McpServer(
  { name: "uuid-forge", version: "1.0.0" },
  {
    capabilities: { tools: {} },
    instructions: "MCP server for generating UUIDs (v4, v7), ULIDs, nanoids, and random IDs. Every project needs unique identifiers.",
  }
);

// Tool: generate_uuid_v4
server.tool(
  "generate_uuid_v4",
  "Generate one or more UUID v4 (random). Returns the most common ID format.",
  {
    count: z.number().min(1).max(100).default(1).describe("Number of UUIDs to generate")
  },
  async ({ count }) => {
    try {
      const ids = Array.from({ length: count }, () => crypto.randomUUID());
      return { content: [{ type: "text", text: ids.join("\n") }] };
    } catch (e: unknown) {
      return { content: [{ type: "text", text: `Error: ${(e as Error).message}` }], isError: true };
    }
  }
);

// Tool: generate_uuid_v7
server.tool(
  "generate_uuid_v7",
  "Generate UUID v7 (time-sortable, recommended for databases). Includes millisecond timestamp prefix.",
  {
    count: z.number().min(1).max(100).default(1).describe("Number of UUIDs to generate")
  },
  async ({ count }) => {
    try {
      function uuidv7(): string {
        const now = Date.now();
        const bytes = crypto.randomBytes(16);
        // Set timestamp (48 bits)
        bytes[0] = (now / 2**40) & 0xff;
        bytes[1] = (now / 2**32) & 0xff;
        bytes[2] = (now / 2**24) & 0xff;
        bytes[3] = (now / 2**16) & 0xff;
        bytes[4] = (now / 2**8) & 0xff;
        bytes[5] = now & 0xff;
        // Set version (7) and variant (2)
        bytes[6] = (bytes[6] & 0x0f) | 0x70;
        bytes[8] = (bytes[8] & 0x3f) | 0x80;
        const hex = bytes.toString("hex");
        return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
      }
      const ids = Array.from({ length: count }, () => uuidv7());
      return { content: [{ type: "text", text: ids.join("\n") }] };
    } catch (e: unknown) {
      return { content: [{ type: "text", text: `Error: ${(e as Error).message}` }], isError: true };
    }
  }
);

// Tool: generate_nanoid
server.tool(
  "generate_nanoid",
  "Generate nanoid-style compact IDs. URL-safe, shorter than UUID.",
  {
    length: z.number().min(4).max(64).default(21).describe("ID length"),
    count: z.number().min(1).max(100).default(1).describe("Number of IDs"),
    alphabet: z.string().default("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-").describe("Character set")
  },
  async ({ length, count, alphabet }) => {
    try {
      function nanoid(len: number, abc: string): string {
        const bytes = crypto.randomBytes(len);
        return Array.from(bytes, b => abc[b % abc.length]).join("");
      }
      const ids = Array.from({ length: count }, () => nanoid(length, alphabet));
      return { content: [{ type: "text", text: ids.join("\n") }] };
    } catch (e: unknown) {
      return { content: [{ type: "text", text: `Error: ${(e as Error).message}` }], isError: true };
    }
  }
);

// Tool: generate_ulid
server.tool(
  "generate_ulid",
  "Generate ULID (Universally Unique Lexicographically Sortable Identifier). Great for distributed systems.",
  {
    count: z.number().min(1).max(100).default(1).describe("Number of ULIDs")
  },
  async ({ count }) => {
    try {
      const ENCODING = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
      function ulid(): string {
        const now = Date.now();
        let time = "";
        let t = now;
        for (let i = 0; i < 10; i++) { time = ENCODING[t % 32] + time; t = Math.floor(t / 32); }
        const rand = crypto.randomBytes(10);
        let random = "";
        for (let i = 0; i < 16; i++) {
          const idx = i < 10 ? rand[i] % 32 : crypto.randomBytes(1)[0] % 32;
          random += ENCODING[idx];
        }
        return time + random;
      }
      const ids = Array.from({ length: count }, () => ulid());
      return { content: [{ type: "text", text: ids.join("\n") }] };
    } catch (e: unknown) {
      return { content: [{ type: "text", text: `Error: ${(e as Error).message}` }], isError: true };
    }
  }
);

// Tool: parse_uuid
server.tool(
  "parse_uuid",
  "Parse a UUID and extract version, variant, and timestamp (if v1/v7).",
  {
    uuid: z.string().describe("UUID string to parse")
  },
  async ({ uuid }) => {
    try {
      const clean = uuid.replace(/-/g, "");
      if (clean.length !== 32) return { content: [{ type: "text", text: "Invalid UUID: must be 32 hex characters" }], isError: true };
      const version = parseInt(clean[12], 16);
      const variantBits = parseInt(clean[16], 16);
      let variant = "Unknown";
      if ((variantBits & 0x8) === 0) variant = "NCS (reserved)";
      else if ((variantBits & 0xc) === 0x8) variant = "RFC 4122 / RFC 9562";
      else if ((variantBits & 0xe) === 0xc) variant = "Microsoft (reserved)";
      else variant = "Future (reserved)";
      const info = [`Version: ${version}`, `Variant: ${variant}`, `Canonical: ${uuid.toLowerCase()}`];
      if (version === 7) {
        const ts = parseInt(clean.slice(0, 12), 16);
        info.push(`Timestamp: ${new Date(ts).toISOString()}`);
      }
      return { content: [{ type: "text", text: info.join("\n") }] };
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
