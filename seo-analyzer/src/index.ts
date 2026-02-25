#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";


function countWords(text: string): Map<string, number> {
  const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 2);
  const freq = new Map<string, number>();
  for (const w of words) freq.set(w, (freq.get(w) || 0) + 1);
  return new Map([...freq.entries()].sort((a, b) => b[1] - a[1]));
}

function extractMetaSeo(html: string): Record<string, string> {
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
  { name: "seo-analyzer", version: "1.0.0" },
  {
    capabilities: { tools: {} },
    instructions: "MCP server for SEO analysis — check meta tags, heading hierarchy, link analysis, keyword density, robots.txt and sitemap generation.",
  }
);

// Tool: analyze_meta
server.tool(
  "analyze_meta",
  "Analyze a URL's SEO meta tags — title length, description, Open Graph, canonical, robots.",
  {
    url: z.string().describe("URL to analyze")
  },
  async ({ url }) => {
    try {
      const response = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (compatible; SovereignMCP/1.0)" } });
      const html = await response.text();
      const meta = extractMetaSeo(html);
      const issues: string[] = [];
      const title = meta.title || "";
      if (!title) issues.push("MISSING: <title> tag");
      else if (title.length < 30) issues.push(`WARNING: Title too short (${title.length} chars, aim for 50-60)`);
      else if (title.length > 60) issues.push(`WARNING: Title too long (${title.length} chars, max 60)`);
      const desc = meta.description || "";
      if (!desc) issues.push("MISSING: meta description");
      else if (desc.length < 120) issues.push(`WARNING: Description too short (${desc.length} chars, aim for 150-160)`);
      else if (desc.length > 160) issues.push(`WARNING: Description too long (${desc.length} chars, max 160)`);
      if (!meta["og:title"]) issues.push("MISSING: og:title (Open Graph)");
      if (!meta["og:description"]) issues.push("MISSING: og:description");
      if (!meta["og:image"]) issues.push("MISSING: og:image");
      const canonMatch = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
      if (!canonMatch) issues.push("MISSING: canonical URL");
      const ogKeys = ["og:title", "og:description", "og:image", "og:url", "og:type"];
      const ogLines = ogKeys.map(k => `- ${k}: ${meta[k] || "MISSING"}`).join("\n");
      const issueLines = issues.map(i => `- ${i}`).join("\n") || "None — looks good!";
      const report = `# SEO Meta Analysis: ${url}\n\n**Title**: ${title || "MISSING"} (${title.length} chars)\n**Description**: ${desc || "MISSING"} (${desc.length} chars)\n**Canonical**: ${canonMatch ? canonMatch[1] : "MISSING"}\n\n**Open Graph**:\n${ogLines}\n\n**Issues Found (${issues.length})**:\n${issueLines}`;
      return { content: [{ type: "text", text: report }] };
    } catch (e: unknown) {
      return { content: [{ type: "text", text: `Error: ${(e as Error).message}` }], isError: true };
    }
  }
);

// Tool: check_headings
server.tool(
  "check_headings",
  "Analyze heading hierarchy (H1-H6) for SEO best practices.",
  {
    url: z.string().describe("URL to check headings")
  },
  async ({ url }) => {
    try {
      const response = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (compatible; SovereignMCP/1.0)" } });
      const html = await response.text();
      const headings: { level: number; text: string }[] = [];
      const hRegex = /<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi;
      let hm: RegExpExecArray | null;
      while ((hm = hRegex.exec(html)) !== null) {
        headings.push({ level: parseInt(hm[1]), text: hm[2].replace(/<[^>]+>/g, '').trim() });
      }
      const issues: string[] = [];
      const h1s = headings.filter(h => h.level === 1);
      if (h1s.length === 0) issues.push("CRITICAL: No H1 tag found");
      if (h1s.length > 1) issues.push(`WARNING: Multiple H1 tags (${h1s.length}) — should have exactly 1`);
      for (let i = 1; i < headings.length; i++) {
        if (headings[i].level > headings[i - 1].level + 1) {
          issues.push(`WARNING: Heading jump from H${headings[i - 1].level} to H${headings[i].level} (skipped level)`);
        }
      }
      const tree = headings.map(h => `${"  ".repeat(h.level - 1)}H${h.level}: ${h.text}`).join("\n");
      const issueLines = issues.map(i => `- ${i}`).join("\n") || "None — structure looks good!";
      const report = `# Heading Structure: ${url}\n\n${tree}\n\n**Total**: ${headings.length} headings\n**Issues (${issues.length})**:\n${issueLines}`;
      return { content: [{ type: "text", text: report }] };
    } catch (e: unknown) {
      return { content: [{ type: "text", text: `Error: ${(e as Error).message}` }], isError: true };
    }
  }
);

// Tool: keyword_density
server.tool(
  "keyword_density",
  "Analyze keyword/word frequency and density on a page.",
  {
    url: z.string().describe("URL to analyze"),
    top_n: z.number().default(20).describe("Number of top words to return")
  },
  async ({ url, top_n }) => {
    try {
      const response = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (compatible; SovereignMCP/1.0)" } });
      const html = await response.text();
      const text = html.replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, '').replace(/<[^>]+>/g, ' ');
      const freq = countWords(text);
      const total = [...freq.values()].reduce((a, b) => a + b, 0);
      const top = [...freq.entries()].slice(0, top_n);
      const table = top.map(([word, count]) => `| ${word} | ${count} | ${((count / total) * 100).toFixed(2)}% |`).join("\n");
      const report = `# Keyword Density: ${url}\n\nTotal words: ${total}\n\n| Word | Count | Density |\n|------|-------|---------|\n${table}`;
      return { content: [{ type: "text", text: report }] };
    } catch (e: unknown) {
      return { content: [{ type: "text", text: `Error: ${(e as Error).message}` }], isError: true };
    }
  }
);

// Tool: generate_robots_txt
server.tool(
  "generate_robots_txt",
  "Generate a robots.txt file for a given domain.",
  {
    domain: z.string().describe("Domain name (e.g. example.com)"),
    disallow: z.array(z.string()).default(["/admin", "/api", "/private"]).describe("Paths to disallow"),
    sitemap_path: z.string().default("/sitemap.xml").describe("Sitemap path")
  },
  async ({ domain, disallow, sitemap_path }) => {
    try {
      const disallowLines = disallow.map((p: string) => `Disallow: ${p}`);
      const lines = [
        "User-agent: *",
        ...disallowLines,
        "",
        "User-agent: Googlebot",
        "Allow: /",
        "",
        `Sitemap: https://${domain}${sitemap_path}`
      ];
      return { content: [{ type: "text", text: lines.join("\n") }] };
    } catch (e: unknown) {
      return { content: [{ type: "text", text: `Error: ${(e as Error).message}` }], isError: true };
    }
  }
);

// Tool: generate_sitemap
server.tool(
  "generate_sitemap",
  "Generate a basic sitemap.xml from a list of URLs.",
  {
    urls: z.array(z.string()).describe("List of URLs to include"),
    changefreq: z.string().default("weekly").describe("Change frequency")
  },
  async ({ urls, changefreq }) => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const entries = urls.map((u: string) =>
        `  <url>\n    <loc>${u}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n  </url>`
      );
      const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</urlset>`;
      return { content: [{ type: "text", text: xml }] };
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
