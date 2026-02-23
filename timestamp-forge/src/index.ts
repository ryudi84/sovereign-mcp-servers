#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";



// === MCP Server Setup ===

const server = new McpServer(
  { name: "timestamp-forge", version: "1.0.0" },
  {
    capabilities: { tools: {} },
    instructions: "MCP server for timestamp conversion, timezone handling, and date calculations.",
  }
);

// Tool: current_time
server.tool(
  "current_time",
  "Get current time in multiple formats: Unix, UTC, ISO 8601, RFC 2822, SQL datetime.",
  {},
  async ({}) => {
    try {
      const now = new Date();
      const formats = [
        `Unix (seconds): ${Math.floor(now.getTime() / 1000)}`,
        `Unix (ms): ${now.getTime()}`,
        `UTC: ${now.toUTCString()}`,
        `ISO 8601: ${now.toISOString()}`,
        `SQL: ${now.toISOString().replace("T", " ").replace("Z", "")}`,
        `Local: ${now.toString()}`,
        `Day of year: ${Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000)}`,
      ];
      return { content: [{ type: "text", text: formats.join("\n") }] };
    } catch (e: unknown) {
      return { content: [{ type: "text", text: `Error: ${(e as Error).message}` }], isError: true };
    }
  }
);

// Tool: unix_to_human
server.tool(
  "unix_to_human",
  "Convert Unix timestamp to human-readable formats. Auto-detects seconds vs milliseconds.",
  {
    timestamp: z.number().describe("Unix timestamp (seconds or milliseconds)")
  },
  async ({ timestamp }) => {
    try {
      const ms = timestamp > 1e12 ? timestamp : timestamp * 1000;
      const d = new Date(ms);
      if (isNaN(d.getTime())) return { content: [{ type: "text", text: "Invalid timestamp" }], isError: true };
      const formats = [
        `UTC: ${d.toUTCString()}`,
        `ISO 8601: ${d.toISOString()}`,
        `Local: ${d.toString()}`,
        `SQL: ${d.toISOString().replace("T", " ").replace("Z", "")}`,
        `Unix (s): ${Math.floor(ms / 1000)}`,
        `Unix (ms): ${ms}`,
      ];
      return { content: [{ type: "text", text: formats.join("\n") }] };
    } catch (e: unknown) {
      return { content: [{ type: "text", text: `Error: ${(e as Error).message}` }], isError: true };
    }
  }
);

// Tool: date_diff
server.tool(
  "date_diff",
  "Calculate the difference between two dates.",
  {
    start_date: z.string().describe("Start date (any parseable format)"),
    end_date: z.string().describe("End date (any parseable format)")
  },
  async ({ start_date, end_date }) => {
    try {
      const a = new Date(start_date), b = new Date(end_date);
      if (isNaN(a.getTime()) || isNaN(b.getTime())) return { content: [{ type: "text", text: "Invalid date format" }], isError: true };
      const diffMs = Math.abs(b.getTime() - a.getTime());
      const days = Math.floor(diffMs / 86400000);
      const hours = Math.floor(diffMs / 3600000);
      const mins = Math.floor(diffMs / 60000);
      const secs = Math.floor(diffMs / 1000);
      const result = [`Days: ${days}`, `Hours: ${hours}`, `Minutes: ${mins}`, `Seconds: ${secs}`, `Weeks: ${(days / 7).toFixed(1)}`, `Months (approx): ${(days / 30.44).toFixed(1)}`];
      return { content: [{ type: "text", text: result.join("\n") }] };
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
