#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";



// === MCP Server Setup ===

const server = new McpServer(
  { name: "diff-forge", version: "1.0.0" },
  {
    capabilities: { tools: {} },
    instructions: "MCP server for computing text diffs, comparing strings, and generating unified diff output.",
  }
);

// Tool: diff_text
server.tool(
  "diff_text",
  "Compare two texts and show the differences line by line with +/- markers.",
  {
    text_a: z.string().describe("First text (original)"),
    text_b: z.string().describe("Second text (modified)")
  },
  async ({ text_a, text_b }) => {
    try {
      const linesA = text_a.split("\n");
      const linesB = text_b.split("\n");
      const output: string[] = ["--- original", "+++ modified", ""];
      const maxLen = Math.max(linesA.length, linesB.length);
      for (let i = 0; i < maxLen; i++) {
        const a = linesA[i];
        const b = linesB[i];
        if (a === undefined) output.push(`+ ${b}`);
        else if (b === undefined) output.push(`- ${a}`);
        else if (a !== b) { output.push(`- ${a}`); output.push(`+ ${b}`); }
        else output.push(`  ${a}`);
      }
      const added = output.filter(l => l.startsWith("+") && !l.startsWith("+++")).length;
      const removed = output.filter(l => l.startsWith("-") && !l.startsWith("---")).length;
      output.push("", `Summary: ${added} additions, ${removed} deletions`);
      return { content: [{ type: "text", text: output.join("\n") }] };
    } catch (e: unknown) {
      return { content: [{ type: "text", text: `Error: ${(e as Error).message}` }], isError: true };
    }
  }
);

// Tool: diff_stats
server.tool(
  "diff_stats",
  "Get diff statistics — character count, word count, line count differences between two texts.",
  {
    text_a: z.string().describe("First text"),
    text_b: z.string().describe("Second text")
  },
  async ({ text_a, text_b }) => {
    try {
      const stats = (t: string) => ({
        chars: t.length,
        words: t.split(/\s+/).filter(Boolean).length,
        lines: t.split("\n").length,
        sentences: t.split(/[.!?]+/).filter(Boolean).length,
      });
      const a = stats(text_a), b = stats(text_b);
      const diff = (x: number, y: number) => { const d = y - x; return d > 0 ? `+${d}` : `${d}`; };
      const result = [
        "Metric       | Original | Modified | Diff",
        "-------------|----------|----------|-----",
        `Characters   | ${a.chars.toString().padEnd(8)} | ${b.chars.toString().padEnd(8)} | ${diff(a.chars, b.chars)}`,
        `Words        | ${a.words.toString().padEnd(8)} | ${b.words.toString().padEnd(8)} | ${diff(a.words, b.words)}`,
        `Lines        | ${a.lines.toString().padEnd(8)} | ${b.lines.toString().padEnd(8)} | ${diff(a.lines, b.lines)}`,
        `Sentences    | ${a.sentences.toString().padEnd(8)} | ${b.sentences.toString().padEnd(8)} | ${diff(a.sentences, b.sentences)}`,
      ];
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
