#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";



// === MCP Server Setup ===

const server = new McpServer(
  { name: "shadow-forge", version: "1.0.0" },
  {
    capabilities: { tools: {} },
    instructions: "MCP server for generating CSS box-shadow values with presets and custom layers.",
  }
);

// Tool: generate_shadow
server.tool(
  "generate_shadow",
  "Generate CSS box-shadow from parameters.",
  {
    h_offset: z.number().default(0).describe("Horizontal offset (px)"),
    v_offset: z.number().default(4).describe("Vertical offset (px)"),
    blur: z.number().default(10).describe("Blur radius (px)"),
    spread: z.number().default(0).describe("Spread radius (px)"),
    color: z.string().default("#00000040").describe("Shadow color (hex with optional alpha)"),
    inset: z.boolean().default(false).describe("Inset shadow")
  },
  async ({ h_offset, v_offset, blur, spread, color, inset }) => {
    try {
      const shadow = `${inset ? "inset " : ""}${h_offset}px ${v_offset}px ${blur}px ${spread}px ${color}`;
      return { content: [{ type: "text", text: `box-shadow: ${shadow};` }] };
    } catch (e: unknown) {
      return { content: [{ type: "text", text: `Error: ${(e as Error).message}` }], isError: true };
    }
  }
);

// Tool: shadow_preset
server.tool(
  "shadow_preset",
  "Get a named shadow preset. Options: subtle, soft, medium, heavy, neon, floating, neumorphic, material.",
  {
    preset: z.enum(["subtle", "soft", "medium", "heavy", "neon", "floating", "neumorphic", "material"]).default("soft").describe("Preset name")
  },
  async ({ preset }) => {
    try {
      const presets: Record<string, string> = {
        subtle: "0 1px 2px rgba(0,0,0,0.05)",
        soft: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)",
        medium: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)",
        heavy: "0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)",
        neon: "0 0 5px #00ff00, 0 0 20px #00ff00, 0 0 40px #00ff00",
        floating: "0 25px 50px -12px rgba(0,0,0,0.25)",
        neumorphic: "5px 5px 10px #d1d9e6, -5px -5px 10px #ffffff",
        material: "0 3px 5px -1px rgba(0,0,0,0.2), 0 6px 10px 0 rgba(0,0,0,0.14), 0 1px 18px 0 rgba(0,0,0,0.12)",
      };
      return { content: [{ type: "text", text: `box-shadow: ${presets[preset]};` }] };
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
