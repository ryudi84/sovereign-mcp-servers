#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";


// HTML → clean text helpers
function stripHtml(html: string): string {
  // Remove script, style, nav, footer, header tags and their content
  let clean = html.replace(/<(script|style|nav|footer|header|aside|iframe|noscript)[^>]*>[\s\S]*?<\/\1>/gi, '');
  // Remove all HTML tags
  clean = clean.replace(/<[^>]+>/g, ' ');
  // Decode common entities
  clean = clean.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ');
  // Collapse whitespace
  clean = clean.replace(/\s+/g, ' ').trim();
  return clean;
}

function extractLinks(html: string, baseUrl: string): string[] {
  const links: string[] = [];
  const regex = /href=["']([^"']+)["']/gi;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(html)) !== null) {
    let href = m[1];
    if (href.startsWith('/')) {
      try { href = new URL(href, baseUrl).href; } catch {}
    }
    if (href.startsWith('http')) links.push(href);
  }
  return [...new Set(links)];
}

function extractMeta(html: string): Record<string, string> {
  const meta: Record<string, string> = {};
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch) meta.title = titleMatch[1].trim();

  const metaRegex = /<meta\s+(?:[^>]*?(?:name|property)=["']([^"']+)["'][^>]*?content=["']([^"']+)["']|[^>]*?content=["']([^"']+)["'][^>]*?(?:name|property)=["']([^"']+)["'])[^>]*>/gi;
  let mm: RegExpExecArray | null;
  while ((mm = metaRegex.exec(html)) !== null) {
    const key = (mm[1] || mm[4] || '').toLowerCase();
    const val = mm[2] || mm[3] || '';
    if (key) meta[key] = val;
  }
  return meta;
}


// === MCP Server Setup ===

const server = new McpServer(
  { name: "web-scraper", version: "1.0.0" },
  {
    capabilities: { tools: {} },
    instructions: "MCP server for web scraping — fetch URLs, extract text/links/metadata, CSS selector extraction. Zero deps, LLM-optimized output.",
  }
);

// Tool: scrape_url
server.tool(
  "scrape_url",
  "Fetch a URL and return clean, LLM-optimized text content (strips ads, nav, scripts).",
  {
    url: z.string().describe("URL to scrape"),
    max_length: z.number().default(5000).describe("Max output characters")
  },
  async ({ url, max_length }) => {
    try {
      const response = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (compatible; SovereignMCP/1.0)" } });
      if (!response.ok) return { content: [{ type: "text", text: `HTTP ${response.status}: ${response.statusText}` }], isError: true };
      const html = await response.text();
      let text = stripHtml(html);
      if (text.length > max_length) text = text.substring(0, max_length) + "\n\n[Truncated]";
      return { content: [{ type: "text", text: `# Content from ${url}\n\n${text}` }] };
    } catch (e: unknown) {
      return { content: [{ type: "text", text: `Error: ${(e as Error).message}` }], isError: true };
    }
  }
);

// Tool: scrape_links
server.tool(
  "scrape_links",
  "Extract all links from a URL. Returns unique URLs found on the page.",
  {
    url: z.string().describe("URL to extract links from")
  },
  async ({ url }) => {
    try {
      const response = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (compatible; SovereignMCP/1.0)" } });
      const html = await response.text();
      const links = extractLinks(html, url);
      return { content: [{ type: "text", text: `# Links from ${url}\n\nFound ${links.length} unique links:\n\n${links.map((l, i) => `${i+1}. ${l}`).join("\n")}` }] };
    } catch (e: unknown) {
      return { content: [{ type: "text", text: `Error: ${(e as Error).message}` }], isError: true };
    }
  }
);

// Tool: scrape_structured
server.tool(
  "scrape_structured",
  "Extract content matching CSS-like selectors (tag, class, id) from a URL.",
  {
    url: z.string().describe("URL to scrape"),
    selector: z.string().describe("CSS selector (supports tag, .class, #id)")
  },
  async ({ url, selector }) => {
    try {
      const response = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (compatible; SovereignMCP/1.0)" } });
      const html = await response.text();
      const results: string[] = [];
      // Simple selector matching: tag, .class, #id
      let pattern: RegExp;
      if (selector.startsWith('.')) {
        const cls = selector.slice(1);
        pattern = new RegExp(`<[^>]+class=["'][^"']*\\b${cls}\\b[^"']*["'][^>]*>([\\s\\S]*?)<\\/`, 'gi');
      } else if (selector.startsWith('#')) {
        const id = selector.slice(1);
        pattern = new RegExp(`<[^>]+id=["']${id}["'][^>]*>([\\s\\S]*?)<\\/`, 'gi');
      } else {
        pattern = new RegExp(`<${selector}[^>]*>([\\s\\S]*?)<\\/${selector}>`, 'gi');
      }
      let m: RegExpExecArray | null;
      while ((m = pattern.exec(html)) !== null) {
        results.push(stripHtml(m[1] || m[0]));
      }
      return { content: [{ type: "text", text: results.length > 0 ? `Found ${results.length} matches:\n\n${results.map((r, i) => `[${i+1}] ${r}`).join("\n\n")}` : "No matches found for selector: " + selector }] };
    } catch (e: unknown) {
      return { content: [{ type: "text", text: `Error: ${(e as Error).message}` }], isError: true };
    }
  }
);

// Tool: scrape_meta
server.tool(
  "scrape_meta",
  "Extract metadata (title, description, Open Graph tags, canonical URL) from a page.",
  {
    url: z.string().describe("URL to extract metadata from")
  },
  async ({ url }) => {
    try {
      const response = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (compatible; SovereignMCP/1.0)" } });
      const html = await response.text();
      const meta = extractMeta(html);
      const canonMatch = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
      if (canonMatch) meta.canonical = canonMatch[1];
      const lines = Object.entries(meta).map(([k, v]) => `**${k}**: ${v}`);
      return { content: [{ type: "text", text: `# Metadata for ${url}\n\n${lines.join("\n")}` }] };
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
