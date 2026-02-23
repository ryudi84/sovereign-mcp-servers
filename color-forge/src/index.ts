#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";



// === MCP Server Setup ===

const server = new McpServer(
  { name: "color-forge", version: "1.0.0" },
  {
    capabilities: { tools: {} },
    instructions: "MCP server for generating color palettes and exporting to CSS, Tailwind, SCSS, JSON.",
  }
);

// Tool: generate_palette
server.tool(
  "generate_palette",
  "Generate a color palette. Harmonies: random, analogous, complementary, triadic, monochromatic, warm, cool, pastel, neon.",
  {
    harmony: z.enum(["random", "analogous", "complementary", "triadic", "monochromatic", "warm", "cool", "pastel", "neon"]).default("random").describe("Color harmony type"),
    count: z.number().min(2).max(10).default(5).describe("Number of colors")
  },
  async ({ harmony, count }) => {
    try {
      function hslToHex(h: number, s: number, l: number): string {
        s /= 100; l /= 100;
        const a = s * Math.min(l, 1 - l);
        const f = (n: number) => { const k = (n + h / 30) % 12; return Math.round(255 * (l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)))); };
        return "#" + [f(0), f(8), f(4)].map(v => v.toString(16).padStart(2, "0")).join("");
      }
      const base = Math.random() * 360;
      const colors: string[] = [];
      for (let i = 0; i < count; i++) {
        let h = 0, s = 0, l = 0;
        switch (harmony) {
          case "analogous": h = (base + i * 30) % 360; s = 60 + Math.random() * 20; l = 45 + Math.random() * 20; break;
          case "complementary": h = (base + (i % 2 === 0 ? 0 : 180) + i * 5) % 360; s = 70; l = 50; break;
          case "triadic": h = (base + i * 120) % 360; s = 65 + Math.random() * 15; l = 50; break;
          case "monochromatic": h = base; s = 50 + Math.random() * 30; l = 20 + (i / count) * 60; break;
          case "warm": h = Math.random() * 60; s = 70 + Math.random() * 20; l = 40 + Math.random() * 30; break;
          case "cool": h = 180 + Math.random() * 80; s = 60 + Math.random() * 20; l = 40 + Math.random() * 25; break;
          case "pastel": h = Math.random() * 360; s = 40 + Math.random() * 20; l = 75 + Math.random() * 15; break;
          case "neon": h = Math.random() * 360; s = 100; l = 50 + Math.random() * 10; break;
          default: h = Math.random() * 360; s = 50 + Math.random() * 40; l = 30 + Math.random() * 40; break;
        }
        colors.push(hslToHex(h, s, l));
      }
      return { content: [{ type: "text", text: `Palette (${harmony}, ${count} colors):\n${colors.join("\n")}` }] };
    } catch (e: unknown) {
      return { content: [{ type: "text", text: `Error: ${(e as Error).message}` }], isError: true };
    }
  }
);

// Tool: export_palette
server.tool(
  "export_palette",
  "Export colors to CSS, Tailwind, SCSS, or JSON format.",
  {
    colors: z.string().describe("Comma-separated hex colors (e.g. #ff0000,#00ff00,#0000ff)"),
    format: z.enum(["css", "tailwind", "scss", "json"]).default("css").describe("Export format")
  },
  async ({ colors, format }) => {
    try {
      const cols = colors.split(",").map(c => c.trim());
      let result = "";
      switch (format) {
        case "css": result = ":root {\n" + cols.map((c, i) => `  --color-${i + 1}: ${c};`).join("\n") + "\n}"; break;
        case "tailwind": result = "module.exports = {\n  theme: {\n    extend: {\n      colors: {\n" + cols.map((c, i) => `        'custom-${i + 1}': '${c}',`).join("\n") + "\n      }\n    }\n  }\n}"; break;
        case "scss": result = cols.map((c, i) => `$color-${i + 1}: ${c};`).join("\n"); break;
        case "json": result = JSON.stringify(cols.reduce((o: Record<string,string>, c, i) => { o[`color-${i + 1}`] = c; return o; }, {}), null, 2); break;
      }
      return { content: [{ type: "text", text: result }] };
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
