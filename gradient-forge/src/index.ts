#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";



// === MCP Server Setup ===

const server = new McpServer(
  { name: "gradient-forge", version: "1.0.0" },
  {
    capabilities: { tools: {} },
    instructions: "MCP server for generating CSS gradients (linear, radial, conic) with presets.",
  }
);

// Tool: generate_gradient
server.tool(
  "generate_gradient",
  "Generate a CSS gradient.",
  {
    type: z.enum(["linear", "radial", "conic"]).default("linear").describe("Gradient type"),
    colors: z.string().describe("Comma-separated colors (e.g. #ff0000,#0000ff)"),
    angle: z.number().default(135).describe("Angle in degrees (for linear/conic)")
  },
  async ({ type, colors, angle }) => {
    try {
      const cols = colors.split(",").map(c => c.trim());
      let css = "";
      switch (type) {
        case "linear": css = `linear-gradient(${angle}deg, ${cols.join(", ")})`; break;
        case "radial": css = `radial-gradient(circle, ${cols.join(", ")})`; break;
        case "conic": css = `conic-gradient(from ${angle}deg, ${cols.join(", ")})`; break;
      }
      return { content: [{ type: "text", text: `background: ${css};` }] };
    } catch (e: unknown) {
      return { content: [{ type: "text", text: `Error: ${(e as Error).message}` }], isError: true };
    }
  }
);

// Tool: random_gradient
server.tool(
  "random_gradient",
  "Generate a random beautiful gradient.",
  {
    stops: z.number().min(2).max(5).default(2).describe("Number of color stops")
  },
  async ({ stops }) => {
    try {
      const colors: string[] = [];
      for (let i = 0; i < stops; i++) {
        const h = Math.floor(Math.random() * 360);
        const s = 60 + Math.floor(Math.random() * 30);
        const l = 40 + Math.floor(Math.random() * 30);
        colors.push(`hsl(${h}, ${s}%, ${l}%)`);
      }
      const angle = Math.floor(Math.random() * 360);
      const css = `linear-gradient(${angle}deg, ${colors.join(", ")})`;
      return { content: [{ type: "text", text: `background: ${css};` }] };
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
