#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";



// === MCP Server Setup ===

const server = new McpServer(
  { name: "base64-forge", version: "1.0.0" },
  {
    capabilities: { tools: {} },
    instructions: "MCP server for Base64, URL, and HTML encoding/decoding.",
  }
);

// Tool: encode_base64
server.tool(
  "encode_base64",
  "Encode text to Base64.",
  {
    text: z.string().describe("Text to encode")
  },
  async ({ text }) => {
    try {
      const encoded = Buffer.from(text, "utf-8").toString("base64");
      return { content: [{ type: "text", text: `${encoded}\n\nOriginal: ${text.length} chars, Encoded: ${encoded.length} chars` }] };
    } catch (e: unknown) {
      return { content: [{ type: "text", text: `Error: ${(e as Error).message}` }], isError: true };
    }
  }
);

// Tool: decode_base64
server.tool(
  "decode_base64",
  "Decode a Base64 string to plain text.",
  {
    base64_string: z.string().describe("Base64 string to decode")
  },
  async ({ base64_string }) => {
    try {
      const decoded = Buffer.from(base64_string, "base64").toString("utf-8");
      return { content: [{ type: "text", text: decoded }] };
    } catch (e: unknown) {
      return { content: [{ type: "text", text: `Error: ${(e as Error).message}` }], isError: true };
    }
  }
);

// Tool: encode_url
server.tool(
  "encode_url",
  "URL-encode a string.",
  {
    text: z.string().describe("Text to URL-encode")
  },
  async ({ text }) => {
    try {
      return { content: [{ type: "text", text: encodeURIComponent(text) }] };
    } catch (e: unknown) {
      return { content: [{ type: "text", text: `Error: ${(e as Error).message}` }], isError: true };
    }
  }
);

// Tool: decode_url
server.tool(
  "decode_url",
  "Decode a URL-encoded string.",
  {
    encoded: z.string().describe("URL-encoded string")
  },
  async ({ encoded }) => {
    try {
      return { content: [{ type: "text", text: decodeURIComponent(encoded) }] };
    } catch (e: unknown) {
      return { content: [{ type: "text", text: `Error: ${(e as Error).message}` }], isError: true };
    }
  }
);

// Tool: encode_html
server.tool(
  "encode_html",
  "Escape HTML special characters.",
  {
    text: z.string().describe("Text to HTML-encode")
  },
  async ({ text }) => {
    try {
      const escaped = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
      return { content: [{ type: "text", text: escaped }] };
    } catch (e: unknown) {
      return { content: [{ type: "text", text: `Error: ${(e as Error).message}` }], isError: true };
    }
  }
);

// Tool: decode_html
server.tool(
  "decode_html",
  "Decode HTML entities to plain text.",
  {
    html: z.string().describe("HTML-encoded string")
  },
  async ({ html }) => {
    try {
      const decoded = html.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
      return { content: [{ type: "text", text: decoded }] };
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
