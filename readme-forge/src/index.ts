#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";



// === MCP Server Setup ===

const server = new McpServer(
  { name: "readme-forge", version: "1.0.0" },
  {
    capabilities: { tools: {} },
    instructions: "MCP server for generating professional README.md files from project details.",
  }
);

// Tool: generate_readme
server.tool(
  "generate_readme",
  "Generate a complete README.md for a project.",
  {
    project_name: z.string().describe("Project name"),
    tagline: z.string().default("").describe("Short tagline/description"),
    description: z.string().default("").describe("Detailed description"),
    tech_stack: z.string().default("").describe("Comma-separated technologies"),
    install_cmd: z.string().default("npm install").describe("Installation command"),
    features: z.string().default("").describe("Comma-separated feature list"),
    license: z.string().default("MIT").describe("License type"),
    author: z.string().default("").describe("Author name")
  },
  async ({ project_name, tagline, description, tech_stack, install_cmd, features, license, author }) => {
    try {
      const featureList = features ? features.split(",").map(f => `- ${f.trim()}`).join("\n") : "";
      const techBadges = tech_stack ? tech_stack.split(",").map(t => `![${t.trim()}](https://img.shields.io/badge/-${t.trim().replace(/ /g, "%20")}-333?style=flat)`).join(" ") : "";
      const md = [
        `# ${project_name}`,
        tagline ? `\n> ${tagline}` : "",
        techBadges ? `\n${techBadges}` : "",
        description ? `\n## About\n\n${description}` : "",
        featureList ? `\n## Features\n\n${featureList}` : "",
        `\n## Installation\n\n\`\`\`bash\n${install_cmd}\n\`\`\``,
        `\n## License\n\n${license}`,
        author ? `\n## Author\n\n${author}` : "",
      ].filter(Boolean).join("\n");
      return { content: [{ type: "text", text: md }] };
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
