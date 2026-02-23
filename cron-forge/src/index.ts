#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";



// === MCP Server Setup ===

const server = new McpServer(
  { name: "cron-forge", version: "1.0.0" },
  {
    capabilities: { tools: {} },
    instructions: "MCP server for cron expression parsing, validation, human-readable explanation, and next run calculations.",
  }
);

// Tool: explain_cron
server.tool(
  "explain_cron",
  "Explain a cron expression in human-readable English.",
  {
    expression: z.string().describe("Cron expression (5 fields: minute hour day month weekday)")
  },
  async ({ expression }) => {
    try {
      const parts = expression.trim().split(/\s+/);
      if (parts.length < 5) return { content: [{ type: "text", text: "Invalid cron: need 5 fields (minute hour day month weekday)" }], isError: true };
      const [min, hour, dom, mon, dow] = parts;
      const explain = (val: string, unit: string, names?: string[]): string => {
        if (val === "*") return `every ${unit}`;
        if (val.includes("/")) { const [, step] = val.split("/"); return `every ${step} ${unit}s`; }
        if (val.includes(",")) return `at ${unit}s ${val}`;
        if (val.includes("-")) return `${unit}s ${val}`;
        if (names && !isNaN(Number(val))) return names[Number(val)] || val;
        return `at ${unit} ${val}`;
      };
      const months = ["","January","February","March","April","May","June","July","August","September","October","November","December"];
      const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
      const desc = [
        explain(min, "minute"),
        explain(hour, "hour"),
        explain(dom, "day"),
        explain(mon, "month", months),
        explain(dow, "weekday", days),
      ];
      return { content: [{ type: "text", text: `Cron: ${expression}\n\nSchedule:\n- Minute: ${desc[0]}\n- Hour: ${desc[1]}\n- Day of month: ${desc[2]}\n- Month: ${desc[3]}\n- Day of week: ${desc[4]}` }] };
    } catch (e: unknown) {
      return { content: [{ type: "text", text: `Error: ${(e as Error).message}` }], isError: true };
    }
  }
);

// Tool: next_cron_runs
server.tool(
  "next_cron_runs",
  "Calculate the next N run times for a cron expression.",
  {
    expression: z.string().describe("Cron expression (5 fields)"),
    count: z.number().min(1).max(20).default(5).describe("Number of next runs to calculate")
  },
  async ({ expression, count }) => {
    try {
      const parts = expression.trim().split(/\s+/);
      if (parts.length < 5) return { content: [{ type: "text", text: "Invalid cron: need 5 fields" }], isError: true };
      const [minSpec, hourSpec, domSpec, monSpec, dowSpec] = parts;
      function matches(spec: string, value: number, max: number): boolean {
        if (spec === "*") return true;
        if (spec.includes("/")) { const [base, step] = spec.split("/"); const b = base === "*" ? 0 : parseInt(base); return (value - b) % parseInt(step) === 0 && value >= b; }
        if (spec.includes(",")) return spec.split(",").map(Number).includes(value);
        if (spec.includes("-")) { const [a, b] = spec.split("-").map(Number); return value >= a && value <= b; }
        return parseInt(spec) === value;
      }
      const runs: string[] = [];
      const now = new Date();
      const check = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes() + 1, 0, 0);
      for (let i = 0; i < 525600 && runs.length < count; i++) {
        const d = new Date(check.getTime() + i * 60000);
        if (matches(minSpec, d.getMinutes(), 59) &&
            matches(hourSpec, d.getHours(), 23) &&
            matches(domSpec, d.getDate(), 31) &&
            matches(monSpec, d.getMonth() + 1, 12) &&
            matches(dowSpec, d.getDay(), 6)) {
          runs.push(d.toISOString());
        }
      }
      return { content: [{ type: "text", text: runs.length > 0 ? `Next ${runs.length} runs:\n${runs.join("\n")}` : "No matches found in the next year" }] };
    } catch (e: unknown) {
      return { content: [{ type: "text", text: `Error: ${(e as Error).message}` }], isError: true };
    }
  }
);

// Tool: validate_cron
server.tool(
  "validate_cron",
  "Validate a cron expression and return detailed field analysis.",
  {
    expression: z.string().describe("Cron expression to validate")
  },
  async ({ expression }) => {
    try {
      const parts = expression.trim().split(/\s+/);
      const checks: string[] = [];
      if (parts.length !== 5 && parts.length !== 6) {
        checks.push(`\u2717 Expected 5 or 6 fields, got ${parts.length}`);
        return { content: [{ type: "text", text: checks.join("\n") }] };
      }
      const fieldNames = ["Minute (0-59)", "Hour (0-23)", "Day of month (1-31)", "Month (1-12)", "Day of week (0-6)"];
      const ranges = [[0,59],[0,23],[1,31],[1,12],[0,6]];
      for (let i = 0; i < Math.min(parts.length, 5); i++) {
        const valid = /^(\*|\d+(-\d+)?(,\d+(-\d+)?)*)(\/\d+)?$/.test(parts[i]);
        checks.push(`${valid ? "\u2713" : "\u2717"} ${fieldNames[i]}: ${parts[i]}`);
      }
      return { content: [{ type: "text", text: `Cron: ${expression}\n\n${checks.join("\n")}` }] };
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
