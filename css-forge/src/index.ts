#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";



// === MCP Server Setup ===

const server = new McpServer(
  { name: "css-forge", version: "1.0.0" },
  {
    capabilities: { tools: {} },
    instructions: "MCP server for CSS — generate flexbox, grid, animations, media queries, gradients, shadows.",
  }
);

// Tool: generate_flexbox
server.tool(
  "generate_flexbox",
  "Generate CSS flexbox layout code from parameters.",
  {
    direction: z.enum(["row", "column", "row-reverse", "column-reverse"]).default("row").describe("Flex direction"),
    justify: z.enum(["flex-start", "flex-end", "center", "space-between", "space-around", "space-evenly"]).default("flex-start").describe("Justify content"),
    align: z.enum(["flex-start", "flex-end", "center", "stretch", "baseline"]).default("stretch").describe("Align items"),
    wrap: z.boolean().default(false).describe("Enable flex-wrap"),
    gap: z.string().default('0').describe("Gap between items (e.g., 16px, 1rem)")
  },
  async ({ direction, justify, align, wrap, gap }) => {
    try {
      const css = `.flex-container {
  display: flex;
  flex-direction: ${direction};
  justify-content: ${justify};
  align-items: ${align};${wrap ? "\n  flex-wrap: wrap;" : ""}
  gap: ${gap};
}`;
      return { content: [{ type: "text", text: `\`\`\`css\n${css}\n\`\`\`` }] };
    } catch (e: unknown) {
      return { content: [{ type: "text", text: `Error: ${(e as Error).message}` }], isError: true };
    }
  }
);

// Tool: generate_grid
server.tool(
  "generate_grid",
  "Generate CSS Grid layout code from parameters.",
  {
    columns: z.string().default('1fr 1fr 1fr').describe("Grid template columns (e.g., '1fr 1fr 1fr', 'repeat(3, 1fr)')"),
    rows: z.string().optional().describe("Grid template rows"),
    gap: z.string().default('16px').describe("Grid gap"),
    areas: z.array(z.string()).optional().describe("Grid template areas (array of strings)")
  },
  async ({ columns, rows, gap, areas }) => {
    try {
      let css = `.grid-container {
  display: grid;
  grid-template-columns: ${columns};
  gap: ${gap};`;
      if (rows) css += `\n  grid-template-rows: ${rows};`;
      if (areas && areas.length > 0) {
        css += `\n  grid-template-areas:\n    ${areas.map(a => `"${a}"`).join("\n    ")};`;
      }
      css += "\n}";
      return { content: [{ type: "text", text: `\`\`\`css\n${css}\n\`\`\`` }] };
    } catch (e: unknown) {
      return { content: [{ type: "text", text: `Error: ${(e as Error).message}` }], isError: true };
    }
  }
);

// Tool: generate_animation
server.tool(
  "generate_animation",
  "Generate CSS animation with keyframes.",
  {
    name: z.string().default('animate').describe("Animation name"),
    type: z.enum(["fade-in", "slide-up", "slide-down", "slide-left", "slide-right", "bounce", "spin", "pulse", "shake", "zoom-in"]).default("fade-in").describe("Animation type"),
    duration: z.string().default('0.3s').describe("Duration"),
    easing: z.string().default('ease').describe("Timing function")
  },
  async ({ name, type, duration, easing }) => {
    try {
      const keyframes: Record<string, string> = {
        "fade-in": "from { opacity: 0; } to { opacity: 1; }",
        "slide-up": "from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; }",
        "slide-down": "from { transform: translateY(-20px); opacity: 0; } to { transform: translateY(0); opacity: 1; }",
        "slide-left": "from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; }",
        "slide-right": "from { transform: translateX(-20px); opacity: 0; } to { transform: translateX(0); opacity: 1; }",
        "bounce": "0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); }",
        "spin": "from { transform: rotate(0deg); } to { transform: rotate(360deg); }",
        "pulse": "0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); }",
        "shake": "0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); }",
        "zoom-in": "from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; }",
      };
      const kf = keyframes[type] || keyframes["fade-in"];
      const iter = type === "spin" || type === "bounce" || type === "pulse" || type === "shake" ? "infinite" : "1";
      const css = `@keyframes ${name} {\n  ${kf}\n}\n\n.${name} {\n  animation: ${name} ${duration} ${easing} ${iter};\n}`;
      return { content: [{ type: "text", text: `\`\`\`css\n${css}\n\`\`\`` }] };
    } catch (e: unknown) {
      return { content: [{ type: "text", text: `Error: ${(e as Error).message}` }], isError: true };
    }
  }
);

// Tool: generate_media_queries
server.tool(
  "generate_media_queries",
  "Generate responsive CSS media queries for common breakpoints.",
  {
    selector: z.string().default('.container').describe("CSS selector"),
    mobile_css: z.string().describe("CSS for mobile (<768px)"),
    tablet_css: z.string().optional().describe("CSS for tablet (768px-1024px)"),
    desktop_css: z.string().optional().describe("CSS for desktop (>1024px)")
  },
  async ({ selector, mobile_css, tablet_css, desktop_css }) => {
    try {
      let css = `/* Mobile first */\n${selector} {\n  ${mobile_css}\n}`;
      if (tablet_css) css += `\n\n@media (min-width: 768px) {\n  ${selector} {\n    ${tablet_css}\n  }\n}`;
      if (desktop_css) css += `\n\n@media (min-width: 1024px) {\n  ${selector} {\n    ${desktop_css}\n  }\n}`;
      return { content: [{ type: "text", text: `\`\`\`css\n${css}\n\`\`\`` }] };
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
