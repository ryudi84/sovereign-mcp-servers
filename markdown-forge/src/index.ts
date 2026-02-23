#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";



// === MCP Server Setup ===

const server = new McpServer(
  { name: "markdown-forge", version: "1.0.0" },
  {
    capabilities: { tools: {} },
    instructions: "MCP server for markdown processing — generate tables, TOC, convert to HTML, format badges, create link references.",
  }
);

// Tool: generate_table
server.tool(
  "generate_table",
  "Generate a markdown table from headers and rows.",
  {
    headers: z.string().describe("Comma-separated column headers"),
    rows: z.string().describe("Rows as semicolon-separated, columns comma-separated. E.g. 'a,b;c,d'"),
    alignment: z.enum(["left", "center", "right"]).default("left").describe("Column alignment")
  },
  async ({ headers, rows, alignment }) => {
    try {
      const cols = headers.split(",").map(h => h.trim());
      const dataRows = rows.split(";").map(r => r.split(",").map(c => c.trim()));
      const align = alignment === "center" ? ":---:" : alignment === "right" ? "---:" : ":---";
      const sep = cols.map(() => align);
      const lines = [
        "| " + cols.join(" | ") + " |",
        "| " + sep.join(" | ") + " |",
        ...dataRows.map(r => "| " + r.join(" | ") + " |"),
      ];
      return { content: [{ type: "text", text: lines.join("\n") }] };
    } catch (e: unknown) {
      return { content: [{ type: "text", text: `Error: ${(e as Error).message}` }], isError: true };
    }
  }
);

// Tool: generate_toc
server.tool(
  "generate_toc",
  "Generate a table of contents from markdown headings.",
  {
    markdown: z.string().describe("Markdown content to extract headings from"),
    max_depth: z.number().min(1).max(6).default(3).describe("Maximum heading depth to include")
  },
  async ({ markdown, max_depth }) => {
    try {
      const lines = markdown.split("\n");
      const toc: string[] = [];
      for (const line of lines) {
        const match = line.match(/^(#{1,6})\s+(.+)/);
        if (!match) continue;
        const level = match[1].length;
        if (level > max_depth) continue;
        const text = match[2].replace(/[*_`\[\]]/g, "");
        const anchor = text.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");
        toc.push(`${"  ".repeat(level - 1)}- [${text}](#${anchor})`);
      }
      return { content: [{ type: "text", text: toc.length > 0 ? toc.join("\n") : "No headings found" }] };
    } catch (e: unknown) {
      return { content: [{ type: "text", text: `Error: ${(e as Error).message}` }], isError: true };
    }
  }
);

// Tool: generate_badges
server.tool(
  "generate_badges",
  "Generate shields.io markdown badges for a project.",
  {
    badges: z.string().describe("Comma-separated badge specs: 'label:message:color'. E.g. 'version:1.0:blue,license:MIT:green'")
  },
  async ({ badges }) => {
    try {
      const badgeList = badges.split(",").map(b => {
        const [label, message, color] = b.trim().split(":");
        const url = `https://img.shields.io/badge/${encodeURIComponent(label || "")}-${encodeURIComponent(message || "")}-${color || "blue"}`;
        return `![${label}](${url})`;
      });
      return { content: [{ type: "text", text: badgeList.join(" ") }] };
    } catch (e: unknown) {
      return { content: [{ type: "text", text: `Error: ${(e as Error).message}` }], isError: true };
    }
  }
);

// Tool: markdown_to_html
server.tool(
  "markdown_to_html",
  "Convert basic markdown to HTML (headings, bold, italic, code, links, lists, paragraphs).",
  {
    markdown: z.string().describe("Markdown text to convert")
  },
  async ({ markdown }) => {
    try {
      let html = markdown
        .replace(/^### (.+)$/gm, "<h3>$1</h3>")
        .replace(/^## (.+)$/gm, "<h2>$1</h2>")
        .replace(/^# (.+)$/gm, "<h1>$1</h1>")
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.+?)\*/g, "<em>$1</em>")
        .replace(/`([^`]+)`/g, "<code>$1</code>")
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
        .replace(/^- (.+)$/gm, "<li>$1</li>")
        .replace(/(<li>.*<\/li>)/s, "<ul>$1</ul>")
        .replace(/^(?!<[hulo])(\S.+)$/gm, "<p>$1</p>");
      return { content: [{ type: "text", text: html }] };
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
