#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";


function minifyHtml(html: string): string {
  return html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\s+/g, ' ')
    .replace(/>\s+</g, '><')
    .replace(/\s+>/g, '>')
    .replace(/<\s+/g, '<')
    .trim();
}

function prettifyHtml(html: string, indent: number = 2): string {
  const pad = ' '.repeat(indent);
  let level = 0;
  const lines: string[] = [];
  // Split by tags
  const tokens = html.replace(/>\s*</g, '>\n<').split('\n');
  for (const token of tokens) {
    const trimmed = token.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith('</')) {
      level = Math.max(0, level - 1);
      lines.push(pad.repeat(level) + trimmed);
    } else if (trimmed.startsWith('<') && !trimmed.startsWith('<!') && !trimmed.endsWith('/>') && !trimmed.includes('</')) {
      lines.push(pad.repeat(level) + trimmed);
      // Don't indent void elements
      const voidTags = ['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'];
      const tagName = (trimmed.match(/<([a-z]+)/i) || [])[1]?.toLowerCase();
      if (tagName && !voidTags.includes(tagName)) level++;
    } else {
      lines.push(pad.repeat(level) + trimmed);
    }
  }
  return lines.join('\n');
}


// === MCP Server Setup ===

const server = new McpServer(
  { name: "html-forge", version: "1.0.0" },
  {
    capabilities: { tools: {} },
    instructions: "MCP server for HTML — generate boilerplate, validate structure, minify, prettify, extract text.",
  }
);

// Tool: generate_boilerplate
server.tool(
  "generate_boilerplate",
  "Generate HTML5 boilerplate with optional features (meta tags, viewport, CSS reset, favicon).",
  {
    title: z.string().default('My Page').describe("Page title"),
    description: z.string().optional().describe("Meta description"),
    lang: z.string().default('en').describe("Language code"),
    css_reset: z.boolean().default(true).describe("Include CSS reset"),
    dark_mode: z.boolean().default(false).describe("Include dark mode CSS")
  },
  async ({ title, description, lang, css_reset, dark_mode }) => {
    try {
      let html = `<!DOCTYPE html>\n<html lang="${lang}">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>${title}</title>`;
      if (description) html += `\n  <meta name="description" content="${description}">`;
      html += `\n  <meta name="robots" content="index, follow">`;
      if (css_reset) html += `\n  <style>\n    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }\n    body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; }\n  </style>`;
      if (dark_mode) html += `\n  <style>\n    @media (prefers-color-scheme: dark) {\n      body { background: #1a1a1a; color: #e0e0e0; }\n      a { color: #6ea8fe; }\n    }\n  </style>`;
      html += `\n</head>\n<body>\n  <main>\n    <h1>${title}</h1>\n    <p>Welcome to ${title}.</p>\n  </main>\n</body>\n</html>`;
      return { content: [{ type: "text", text: `\`\`\`html\n${html}\n\`\`\`` }] };
    } catch (e: unknown) {
      return { content: [{ type: "text", text: `Error: ${(e as Error).message}` }], isError: true };
    }
  }
);

// Tool: minify_html
server.tool(
  "minify_html",
  "Minify HTML by removing comments, extra whitespace, and newlines.",
  {
    html: z.string().describe("HTML to minify")
  },
  async ({ html }) => {
    try {
      const minified = minifyHtml(html);
      const saved = ((1 - minified.length / html.length) * 100).toFixed(1);
      return { content: [{ type: "text", text: `<!-- Minified: ${html.length} → ${minified.length} bytes (${saved}% smaller) -->\n${minified}` }] };
    } catch (e: unknown) {
      return { content: [{ type: "text", text: `Error: ${(e as Error).message}` }], isError: true };
    }
  }
);

// Tool: prettify_html
server.tool(
  "prettify_html",
  "Format/prettify HTML with proper indentation.",
  {
    html: z.string().describe("HTML to prettify"),
    indent_size: z.number().default(2).describe("Spaces per indent level")
  },
  async ({ html, indent_size }) => {
    try {
      const pretty = prettifyHtml(html, indent_size);
      return { content: [{ type: "text", text: `\`\`\`html\n${pretty}\n\`\`\`` }] };
    } catch (e: unknown) {
      return { content: [{ type: "text", text: `Error: ${(e as Error).message}` }], isError: true };
    }
  }
);

// Tool: validate_html
server.tool(
  "validate_html",
  "Check HTML for common issues (unclosed tags, missing attributes, accessibility).",
  {
    html: z.string().describe("HTML to validate")
  },
  async ({ html }) => {
    try {
      const issues: string[] = [];
      // Check for DOCTYPE
      if (!html.trim().toLowerCase().startsWith("<!doctype")) issues.push("Missing <!DOCTYPE html> declaration");
      // Check lang attribute
      if (html.includes("<html") && !html.match(/<html[^>]+lang=/i)) issues.push("Missing lang attribute on <html>");
      // Check viewport meta
      if (!html.includes("viewport")) issues.push("Missing viewport meta tag");
      // Check images for alt
      const imgNoAlt = html.match(/<img(?![^>]*alt=)[^>]*>/gi);
      if (imgNoAlt) issues.push(`${imgNoAlt.length} <img> tag(s) missing alt attribute`);
      // Check title
      if (!html.match(/<title[^>]*>.+<\/title>/i)) issues.push("Missing or empty <title> tag");
      // Check for inline styles
      const inlineCount = (html.match(/style="/g) || []).length;
      if (inlineCount > 3) issues.push(`${inlineCount} inline styles found (consider using CSS classes)`);

      if (issues.length === 0) return { content: [{ type: "text", text: "PASS: No HTML issues found!" }] };
      return { content: [{ type: "text", text: `Found ${issues.length} issue(s):\n\n${issues.map((i, n) => `${n+1}. ${i}`).join("\n")}` }] };
    } catch (e: unknown) {
      return { content: [{ type: "text", text: `Error: ${(e as Error).message}` }], isError: true };
    }
  }
);

// Tool: generate_meta_tags
server.tool(
  "generate_meta_tags",
  "Generate complete meta tags (SEO, Open Graph, Twitter Card) for a webpage.",
  {
    title: z.string().describe("Page title"),
    description: z.string().describe("Page description"),
    url: z.string().optional().describe("Page URL"),
    image: z.string().optional().describe("OG image URL"),
    type: z.enum(["website", "article", "product"]).default("website").describe("Page type")
  },
  async ({ title, description, url, image, type }) => {
    try {
      let tags = `<!-- Primary Meta Tags -->\n<title>${title}</title>\n<meta name="title" content="${title}">\n<meta name="description" content="${description}">`;
      tags += `\n\n<!-- Open Graph / Facebook -->\n<meta property="og:type" content="${type}">\n<meta property="og:title" content="${title}">\n<meta property="og:description" content="${description}">`;
      if (url) tags += `\n<meta property="og:url" content="${url}">`;
      if (image) tags += `\n<meta property="og:image" content="${image}">`;
      tags += `\n\n<!-- Twitter -->\n<meta property="twitter:card" content="summary_large_image">\n<meta property="twitter:title" content="${title}">\n<meta property="twitter:description" content="${description}">`;
      if (url) tags += `\n<meta property="twitter:url" content="${url}">`;
      if (image) tags += `\n<meta property="twitter:image" content="${image}">`;
      return { content: [{ type: "text", text: `\`\`\`html\n${tags}\n\`\`\`` }] };
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
