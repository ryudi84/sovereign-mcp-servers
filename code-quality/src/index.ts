#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// === MCP Server Setup ===

const server = new McpServer(
  { name: "code-quality", version: "1.0.0" },
  {
    capabilities: { tools: {} },
    instructions:
      "MCP server for code quality analysis — cyclomatic complexity, duplicate detection, naming conventions, file metrics, refactoring suggestions.",
  }
);

// ──────────────────────────────────────────────
// Tool 1: analyze_complexity
// ──────────────────────────────────────────────

server.tool(
  "analyze_complexity",
  "Calculate cyclomatic complexity of code. Counts decision points (if, for, while, case, &&, ||, ternary).",
  {
    code: z.string().describe("Source code to analyze"),
    language: z
      .string()
      .default("auto")
      .describe("Language hint (js, ts, py, auto)"),
  },
  async ({ code, language }) => {
    try {
      const lines = code.split("\n");
      let complexity = 1; // base complexity for a single path

      const decisions: { pattern: RegExp; name: string }[] = [
        { pattern: /\bif\b/g, name: "if" },
        { pattern: /\belse\s+if\b/g, name: "else if" },
        { pattern: /\bfor\b/g, name: "for" },
        { pattern: /\bwhile\b/g, name: "while" },
        { pattern: /\bcase\b/g, name: "case" },
        { pattern: /\bcatch\b/g, name: "catch" },
        { pattern: /&&/g, name: "&&" },
        { pattern: /\|\|/g, name: "||" },
        { pattern: /\?\s*[^?:]/g, name: "ternary" },
      ];

      const counts: Record<string, number> = {};

      for (const d of decisions) {
        const matches = code.match(d.pattern);
        const count = matches ? matches.length : 0;
        if (count > 0) {
          counts[d.name] = count;
        }
        complexity += count;
      }

      let rating = "LOW";
      if (complexity > 20) {
        rating = "VERY HIGH -- refactor immediately";
      } else if (complexity > 10) {
        rating = "HIGH -- consider refactoring";
      } else if (complexity > 5) {
        rating = "MODERATE";
      }

      const breakdown = Object.entries(counts)
        .map(([k, v]) => "  " + k + ": " + v)
        .join("\n");

      const text = [
        "# Cyclomatic Complexity Analysis",
        "",
        "**Complexity Score**: " + complexity,
        "**Rating**: " + rating,
        "**Lines**: " + lines.length,
        "",
        "**Decision Points**:",
        breakdown || "  None found",
        "",
        "**Tip**: Functions with complexity > 10 should be split into smaller functions.",
      ].join("\n");

      return { content: [{ type: "text" as const, text }] };
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      return {
        content: [{ type: "text" as const, text: "Error: " + msg }],
        isError: true,
      };
    }
  }
);

// ──────────────────────────────────────────────
// Tool 2: find_duplicates
// ──────────────────────────────────────────────

server.tool(
  "find_duplicates",
  "Find duplicate/similar code blocks (potential code clones).",
  {
    code: z.string().describe("Source code to analyze"),
    min_lines: z
      .number()
      .default(3)
      .describe("Minimum number of lines for a duplicate block"),
  },
  async ({ code, min_lines }) => {
    try {
      // Normalize: trim whitespace, remove blank lines and single-line comments
      const rawLines = code.split("\n");
      const normalized: { text: string; originalLine: number }[] = [];
      for (let i = 0; i < rawLines.length; i++) {
        const trimmed = rawLines[i].trim();
        if (
          trimmed.length === 0 ||
          trimmed.startsWith("//") ||
          trimmed.startsWith("#")
        ) {
          continue;
        }
        normalized.push({ text: trimmed, originalLine: i + 1 });
      }

      interface Duplicate {
        block: string;
        positions: number[];
        lineCount: number;
      }

      const duplicates: Duplicate[] = [];
      const maxBlockSize = Math.min(Math.floor(normalized.length / 2), 20);

      for (
        let size = min_lines;
        size <= Math.max(min_lines, maxBlockSize);
        size++
      ) {
        const seen = new Map<string, number[]>();
        for (let i = 0; i <= normalized.length - size; i++) {
          const block = normalized
            .slice(i, i + size)
            .map((n) => n.text)
            .join("\n");
          if (!seen.has(block)) {
            seen.set(block, []);
          }
          seen.get(block)!.push(normalized[i].originalLine);
        }
        for (const [block, positions] of seen) {
          if (positions.length > 1 && block.length > 20) {
            duplicates.push({ block, positions, lineCount: size });
          }
        }
      }

      // Sort by block length descending, keep top 5
      const unique = duplicates
        .sort((a, b) => b.block.length - a.block.length)
        .slice(0, 5);

      if (unique.length === 0) {
        return {
          content: [
            {
              type: "text" as const,
              text: "# Code Clone Detection\n\nNo duplicate code blocks found. Code looks DRY!",
            },
          ],
        };
      }

      const report = unique
        .map((d, i) => {
          const header =
            "## Clone " +
            (i + 1) +
            " (appears " +
            d.positions.length +
            "x at lines " +
            d.positions.join(", ") +
            ")";
          return header + "\n```\n" + d.block + "\n```";
        })
        .join("\n\n");

      const text = [
        "# Code Clone Detection",
        "",
        "Found " + unique.length + " duplicate block(s):",
        "",
        report,
        "",
        "**Tip**: Extract duplicates into reusable functions.",
      ].join("\n");

      return { content: [{ type: "text" as const, text }] };
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      return {
        content: [{ type: "text" as const, text: "Error: " + msg }],
        isError: true,
      };
    }
  }
);

// ──────────────────────────────────────────────
// Tool 3: check_naming
// ──────────────────────────────────────────────

server.tool(
  "check_naming",
  "Check naming conventions (camelCase, snake_case, PascalCase) in code.",
  {
    code: z.string().describe("Source code to check"),
    convention: z
      .enum(["camelCase", "snake_case", "PascalCase"])
      .default("camelCase")
      .describe("Expected naming convention"),
  },
  async ({ code, convention }) => {
    try {
      const patterns: Record<string, RegExp> = {
        camelCase: /^[a-z][a-zA-Z0-9]*$/,
        snake_case: /^[a-z][a-z0-9_]*$/,
        PascalCase: /^[A-Z][a-zA-Z0-9]*$/,
      };

      // Extract identifiers declared with common keywords
      const idRegex =
        /(?:const|let|var|function|def|class)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
      const identifiers: string[] = [];
      let match: RegExpExecArray | null;
      while ((match = idRegex.exec(code)) !== null) {
        identifiers.push(match[1]);
      }

      const checker = patterns[convention];
      const violations = identifiers.filter(
        (id) => !checker.test(id) && id !== "_"
      );
      const conforming = identifiers.filter((id) => checker.test(id));

      let violationSection: string;
      if (violations.length > 0) {
        violationSection =
          "**Non-conforming names**:\n" +
          violations
            .map((v) => "- `" + v + "` -- should be " + convention)
            .join("\n");
      } else {
        violationSection =
          "All names follow " + convention + " convention!";
      }

      const text = [
        "# Naming Convention Check (" + convention + ")",
        "",
        "**Total identifiers**: " + identifiers.length,
        "**Conforming**: " + conforming.length,
        "**Violations**: " + violations.length,
        "",
        violationSection,
      ].join("\n");

      return { content: [{ type: "text" as const, text }] };
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      return {
        content: [{ type: "text" as const, text: "Error: " + msg }],
        isError: true,
      };
    }
  }
);

// ──────────────────────────────────────────────
// Tool 4: measure_file
// ──────────────────────────────────────────────

server.tool(
  "measure_file",
  "Measure file metrics -- lines of code, comments, blank lines, comment ratio.",
  {
    code: z.string().describe("Source code to measure"),
    language: z
      .string()
      .default("auto")
      .describe("Language for comment style detection"),
  },
  async ({ code, language }) => {
    try {
      const lines = code.split("\n");
      const total = lines.length;
      const blank = lines.filter((l) => l.trim().length === 0).length;

      const commentPatterns = [
        /^\s*\/\//, // JS/TS/C single-line
        /^\s*#/,    // Python/Shell
        /^\s*\*/,   // Block comment continuation
        /^\s*\/\*/, // Block comment start
        /^\s*\*\//, // Block comment end
      ];
      const comments = lines.filter((l) =>
        commentPatterns.some((p) => p.test(l))
      ).length;

      const codeLines = total - blank - comments;
      const ratio =
        codeLines > 0 ? ((comments / codeLines) * 100).toFixed(1) : "0.0";

      let health = "Good";
      if (codeLines > 500) {
        health = "Very large file -- strongly recommend splitting";
      } else if (codeLines > 300) {
        health = "Large file -- consider splitting into modules";
      } else if (parseFloat(ratio) < 5 && codeLines > 50) {
        health = "Low comments -- consider documenting complex logic";
      }

      const text = [
        "# File Metrics",
        "",
        "| Metric | Count |",
        "|--------|-------|",
        "| Total lines | " + total + " |",
        "| Code lines | " + codeLines + " |",
        "| Comments | " + comments + " |",
        "| Blank lines | " + blank + " |",
        "| Comment ratio | " + ratio + "% |",
        "",
        "**Health**: " + health,
      ].join("\n");

      return { content: [{ type: "text" as const, text }] };
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      return {
        content: [{ type: "text" as const, text: "Error: " + msg }],
        isError: true,
      };
    }
  }
);

// ──────────────────────────────────────────────
// Tool 5: suggest_refactor
// ──────────────────────────────────────────────

server.tool(
  "suggest_refactor",
  "Analyze code and suggest refactoring improvements.",
  {
    code: z.string().describe("Source code to analyze"),
  },
  async ({ code }) => {
    try {
      const lines = code.split("\n");
      const suggestions: string[] = [];

      // --- Check function length ---
      const funcRegex = /(?:function|async\s+function|def)\s+(\w+)/;
      let funcStart = -1;
      let funcName = "";

      for (let i = 0; i < lines.length; i++) {
        const fm = lines[i].match(funcRegex);
        if (fm) {
          // Close previous function if it was too long
          if (funcStart >= 0 && i - funcStart > 30) {
            suggestions.push(
              "**Long function** `" +
                funcName +
                "` (" +
                (i - funcStart) +
                " lines) -- extract sub-functions"
            );
          }
          funcStart = i;
          funcName = fm[1];
        }
      }
      // Check last function
      if (funcStart >= 0 && lines.length - funcStart > 30) {
        suggestions.push(
          "**Long function** `" +
            funcName +
            "` (" +
            (lines.length - funcStart) +
            " lines) -- extract sub-functions"
        );
      }

      // --- Check nesting depth ---
      let maxDepth = 0;
      let depth = 0;
      for (const line of lines) {
        const opens = (line.match(/\{/g) || []).length;
        const closes = (line.match(/\}/g) || []).length;
        depth += opens - closes;
        if (depth > maxDepth) {
          maxDepth = depth;
        }
      }
      if (maxDepth > 4) {
        suggestions.push(
          "**Deep nesting** (" +
            maxDepth +
            " levels) -- use early returns or extract functions"
        );
      }

      // --- Check for magic numbers ---
      const magicMatches = code.match(/(?<![.\w])\d{2,}(?![\w"])/g);
      if (magicMatches && magicMatches.length > 3) {
        const uniqueNums = [...new Set(magicMatches)].slice(0, 5);
        suggestions.push(
          "**Magic numbers** found (" +
            uniqueNums.join(", ") +
            ") -- extract to named constants"
        );
      }

      // --- Check for console.log ---
      const consoleLogCount = (code.match(/console\.log/g) || []).length;
      if (consoleLogCount > 2) {
        suggestions.push(
          "**" +
            consoleLogCount +
            " console.log statements** -- remove or replace with proper logging"
        );
      }

      // --- Check for TODO/FIXME ---
      const todoCount = (code.match(/TODO|FIXME|HACK|XXX/gi) || []).length;
      if (todoCount > 0) {
        suggestions.push(
          "**" +
            todoCount +
            " TODO/FIXME comments** -- address or track in issues"
        );
      }

      if (suggestions.length === 0) {
        suggestions.push(
          "Code looks clean! No major refactoring suggestions."
        );
      }

      const text = [
        "# Refactoring Suggestions",
        "",
        ...suggestions.map((s, i) => (i + 1) + ". " + s),
      ].join("\n");

      return { content: [{ type: "text" as const, text }] };
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      return {
        content: [{ type: "text" as const, text: "Error: " + msg }],
        isError: true,
      };
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
