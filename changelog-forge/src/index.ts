#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";



// === MCP Server Setup ===

const server = new McpServer(
  { name: "changelog-forge", version: "1.0.0" },
  {
    capabilities: { tools: {} },
    instructions: "MCP server for generating changelogs from conventional commits, parsing semver, and creating release notes.",
  }
);

// Tool: parse_commits
server.tool(
  "parse_commits",
  "Parse conventional commit messages and categorize them (feat, fix, docs, chore, etc.).",
  {
    commits: z.string().describe("Newline-separated commit messages in conventional format (e.g. 'feat: add login\nfix: null pointer')")
  },
  async ({ commits }) => {
    try {
      const lines = commits.split("\n").filter(l => l.trim());
      const categories: Record<string, string[]> = {};
      const typeNames: Record<string, string> = {
        feat: "Features", fix: "Bug Fixes", docs: "Documentation", chore: "Chores",
        style: "Styles", refactor: "Refactoring", perf: "Performance", test: "Tests",
        build: "Build", ci: "CI/CD", revert: "Reverts"
      };
      for (const line of lines) {
        const match = line.match(/^(\w+)(\(.+?\))?(!)?:\s*(.+)/);
        if (match) {
          const [, type, scope, breaking, msg] = match;
          const cat = typeNames[type] || "Other";
          if (!categories[cat]) categories[cat] = [];
          categories[cat].push(`- ${scope ? scope + " " : ""}${msg}${breaking ? " **BREAKING**" : ""}`);
        } else {
          if (!categories["Other"]) categories["Other"] = [];
          categories["Other"].push(`- ${line}`);
        }
      }
      const output = Object.entries(categories).map(([cat, items]) => `### ${cat}\n${items.join("\n")}`).join("\n\n");
      return { content: [{ type: "text", text: output || "No commits to categorize" }] };
    } catch (e: unknown) {
      return { content: [{ type: "text", text: `Error: ${(e as Error).message}` }], isError: true };
    }
  }
);

// Tool: generate_changelog
server.tool(
  "generate_changelog",
  "Generate a full CHANGELOG.md entry from commit messages.",
  {
    version: z.string().describe("Version number (e.g. '1.2.0')"),
    date: z.string().default("").describe("Release date (YYYY-MM-DD). Defaults to today."),
    commits: z.string().describe("Newline-separated conventional commit messages")
  },
  async ({ version, date, commits }) => {
    try {
      const releaseDate = date || new Date().toISOString().split("T")[0];
      const lines = commits.split("\n").filter(l => l.trim());
      const categories: Record<string, string[]> = {};
      const typeNames: Record<string, string> = {
        feat: "Features", fix: "Bug Fixes", docs: "Documentation", chore: "Chores",
        refactor: "Code Refactoring", perf: "Performance Improvements", test: "Tests",
        build: "Build System", ci: "Continuous Integration"
      };
      let hasBreaking = false;
      for (const line of lines) {
        const match = line.match(/^(\w+)(\(.+?\))?(!)?:\s*(.+)/);
        if (match) {
          const [, type, scope, breaking, msg] = match;
          if (breaking) hasBreaking = true;
          const cat = typeNames[type] || "Other";
          if (!categories[cat]) categories[cat] = [];
          categories[cat].push(`- ${scope ? `**${scope.replace(/[()]/g, "")}:** ` : ""}${msg}`);
        }
      }
      let md = `## [${version}] - ${releaseDate}\n`;
      if (hasBreaking) md += "\n### BREAKING CHANGES\n\n";
      md += "\n" + Object.entries(categories).map(([cat, items]) => `### ${cat}\n\n${items.join("\n")}`).join("\n\n");
      return { content: [{ type: "text", text: md }] };
    } catch (e: unknown) {
      return { content: [{ type: "text", text: `Error: ${(e as Error).message}` }], isError: true };
    }
  }
);

// Tool: bump_version
server.tool(
  "bump_version",
  "Suggest the next semver version based on commit types (major for breaking, minor for feat, patch for fix).",
  {
    current_version: z.string().describe("Current version (e.g. '1.2.3')"),
    commits: z.string().describe("Newline-separated conventional commit messages")
  },
  async ({ current_version, commits }) => {
    try {
      const parts = current_version.replace(/^v/, "").split(".").map(Number);
      if (parts.length !== 3) return { content: [{ type: "text", text: "Invalid semver: expected MAJOR.MINOR.PATCH" }], isError: true };
      let [major, minor, patch] = parts;
      const lines = commits.split("\n").filter(l => l.trim());
      let hasBreaking = false, hasFeat = false, hasFix = false;
      for (const line of lines) {
        if (line.includes("!:") || line.toLowerCase().includes("breaking")) hasBreaking = true;
        if (line.startsWith("feat")) hasFeat = true;
        if (line.startsWith("fix")) hasFix = true;
      }
      if (hasBreaking) { major++; minor = 0; patch = 0; }
      else if (hasFeat) { minor++; patch = 0; }
      else if (hasFix) { patch++; }
      else { patch++; }
      const next = `${major}.${minor}.${patch}`;
      const reason = hasBreaking ? "BREAKING CHANGE detected → major bump" : hasFeat ? "New feature detected → minor bump" : "Bug fix / maintenance → patch bump";
      return { content: [{ type: "text", text: `Current: ${current_version}\nNext: ${next}\nReason: ${reason}` }] };
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
