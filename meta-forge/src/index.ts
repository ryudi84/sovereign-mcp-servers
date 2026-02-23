#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";



// === MCP Server Setup ===

const server = new McpServer(
  { name: "meta-forge", version: "1.0.0" },
  {
    capabilities: { tools: {} },
    instructions: "MCP server for generating HTML meta tags (Open Graph, Twitter Card, SEO) and running SEO checks.",
  }
);

// Tool: generate_meta_tags
server.tool(
  "generate_meta_tags",
  "Generate complete HTML meta tags for SEO, Open Graph, and Twitter Card.",
  {
    title: z.string().describe("Page title"),
    description: z.string().describe("Meta description"),
    url: z.string().default("").describe("Canonical URL"),
    og_image: z.string().default("").describe("Open Graph image URL"),
    twitter_handle: z.string().default("").describe("Twitter @handle")
  },
  async ({ title, description, url, og_image, twitter_handle }) => {
    try {
      const tags = [
        `<title>${title}</title>`,
        `<meta name="description" content="${description}">`,
        `<meta property="og:title" content="${title}">`,
        `<meta property="og:description" content="${description}">`,
        `<meta property="og:type" content="website">`,
      ];
      if (url) tags.push(`<meta property="og:url" content="${url}">`, `<link rel="canonical" href="${url}">`);
      if (og_image) tags.push(`<meta property="og:image" content="${og_image}">`);
      tags.push(`<meta name="twitter:card" content="summary_large_image">`, `<meta name="twitter:title" content="${title}">`, `<meta name="twitter:description" content="${description}">`);
      if (twitter_handle) tags.push(`<meta name="twitter:site" content="${twitter_handle}">`);
      if (og_image) tags.push(`<meta name="twitter:image" content="${og_image}">`);
      return { content: [{ type: "text", text: tags.join("\n") }] };
    } catch (e: unknown) {
      return { content: [{ type: "text", text: `Error: ${(e as Error).message}` }], isError: true };
    }
  }
);

// Tool: check_seo
server.tool(
  "check_seo",
  "Run an SEO checklist on meta tag values. Returns pass/fail for title length, description length, etc.",
  {
    title: z.string().describe("Page title"),
    description: z.string().describe("Meta description")
  },
  async ({ title, description }) => {
    try {
      const checks = [
        title.length >= 30 && title.length <= 60 ? `✓ Title length: ${title.length} (ideal: 30-60)` : `✗ Title length: ${title.length} (ideal: 30-60)`,
        description.length >= 120 && description.length <= 160 ? `✓ Description length: ${description.length} (ideal: 120-160)` : `✗ Description length: ${description.length} (ideal: 120-160)`,
        title.length > 0 ? "✓ Title is set" : "✗ Title is missing",
        description.length > 0 ? "✓ Description is set" : "✗ Description is missing",
      ];
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
