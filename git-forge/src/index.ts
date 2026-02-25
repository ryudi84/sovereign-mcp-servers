#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";


const GITIGNORE_TEMPLATES: Record<string, string> = {
  node: "node_modules/\ndist/\n.env\n.env.local\ncoverage/\n*.log\n.DS_Store\npackage-lock.json",
  python: "__pycache__/\n*.pyc\n.env\nvenv/\n*.egg-info/\ndist/\nbuild/\n.pytest_cache/\n.mypy_cache/",
  rust: "target/\nCargo.lock\n**/*.rs.bk",
  go: "bin/\n*.exe\n*.test\nvendor/",
  java: "*.class\ntarget/\n.idea/\n*.jar\n*.war\n.gradle/\nbuild/",
  general: ".env\n.env.local\n*.log\n.DS_Store\nThumbs.db\n*.swp\n*.swo\n*~\n.vscode/\n.idea/"
};


// === MCP Server Setup ===

const server = new McpServer(
  { name: "git-forge", version: "1.0.0" },
  {
    capabilities: { tools: {} },
    instructions: "MCP server for Git — generate commands, commit messages, .gitignore files, branch names, changelogs.",
  }
);

// Tool: generate_commit_message
server.tool(
  "generate_commit_message",
  "Generate a conventional commit message from a description of changes.",
  {
    changes: z.string().describe("Description of what changed"),
    type: z.enum(["feat", "fix", "docs", "style", "refactor", "perf", "test", "chore", "ci", "build"]).default("feat").describe("Commit type"),
    scope: z.string().optional().describe("Scope (e.g., api, auth, ui)"),
    breaking: z.boolean().default(false).describe("Is this a breaking change?")
  },
  async ({ changes, type, scope, breaking }) => {
    try {
      const scopePart = scope ? `(${scope})` : "";
      const bang = breaking ? "!" : "";
      // Create a concise subject from the changes description
      const subject = changes.length > 72 ? changes.substring(0, 69) + "..." : changes;
      const msg = `${type}${scopePart}${bang}: ${subject}`;
      const lines = [msg];
      if (changes.length > 72) lines.push("", changes);
      if (breaking) lines.push("", `BREAKING CHANGE: ${changes}`);
      return { content: [{ type: "text", text: lines.join("\n") }] };
    } catch (e: unknown) {
      return { content: [{ type: "text", text: `Error: ${(e as Error).message}` }], isError: true };
    }
  }
);

// Tool: generate_gitignore
server.tool(
  "generate_gitignore",
  "Generate a .gitignore file for a project type (node, python, rust, go, java, general).",
  {
    types: z.array(z.string()).describe("Project types to combine (node, python, rust, go, java, general)"),
    extra: z.array(z.string()).default([]).describe("Additional patterns to ignore")
  },
  async ({ types, extra }) => {
    try {
      const lines = new Set<string>();
      for (const t of types) {
        const tmpl = GITIGNORE_TEMPLATES[t.toLowerCase()];
        if (tmpl) tmpl.split("\n").forEach(l => lines.add(l));
        else lines.add(`# Unknown type: ${t}`);
      }
      for (const e of extra) lines.add(e);
      return { content: [{ type: "text", text: `# .gitignore\n\n${[...lines].join("\n")}` }] };
    } catch (e: unknown) {
      return { content: [{ type: "text", text: `Error: ${(e as Error).message}` }], isError: true };
    }
  }
);

// Tool: generate_branch_name
server.tool(
  "generate_branch_name",
  "Generate a Git branch name from a description following conventions.",
  {
    description: z.string().describe("What the branch is for"),
    type: z.enum(["feature", "bugfix", "hotfix", "release", "chore"]).default("feature").describe("Branch type"),
    ticket: z.string().optional().describe("Ticket/issue number (e.g., PROJ-123)")
  },
  async ({ description, type, ticket }) => {
    try {
      const slug = description.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").substring(0, 50);
      const prefix = type === "feature" ? "feat" : type;
      const ticketPart = ticket ? `${ticket}-` : "";
      const branch = `${prefix}/${ticketPart}${slug}`;
      return { content: [{ type: "text", text: `\`${branch}\`` }] };
    } catch (e: unknown) {
      return { content: [{ type: "text", text: `Error: ${(e as Error).message}` }], isError: true };
    }
  }
);

// Tool: git_command
server.tool(
  "git_command",
  "Generate Git commands for common operations (squash, rebase, cherry-pick, bisect, stash, undo).",
  {
    operation: z.enum(["squash", "rebase", "cherry-pick", "bisect-start", "stash-save", "stash-pop", "undo-commit", "undo-push", "clean-branches", "log-pretty", "blame", "diff-stat"]).describe("Git operation to generate"),
    args: z.string().optional().describe("Additional context (branch name, commit SHA, etc.)")
  },
  async ({ operation, args }) => {
    try {
      const commands: Record<string, string> = {
        "squash": `# Squash last N commits (interactive)\ngit rebase -i HEAD~${args || "3"}\n\n# In the editor, change 'pick' to 'squash' (or 's') for commits to merge`,
        "rebase": `# Rebase current branch onto ${args || "main"}\ngit fetch origin\ngit rebase origin/${args || "main"}\n\n# If conflicts:\ngit add .\ngit rebase --continue`,
        "cherry-pick": `# Cherry-pick commit(s)\ngit cherry-pick ${args || "<commit-sha>"}\n\n# Cherry-pick without committing:\ngit cherry-pick --no-commit ${args || "<commit-sha>"}`,
        "bisect-start": `# Binary search for bad commit\ngit bisect start\ngit bisect bad  # current commit is bad\ngit bisect good ${args || "<known-good-sha>"}\n# Test each step, then: git bisect good/bad\n# When done: git bisect reset`,
        "stash-save": `git stash push -m "${args || "WIP"}"`,
        "stash-pop": "git stash pop\n\n# Or apply without removing from stash:\ngit stash apply",
        "undo-commit": "# Undo last commit, keep changes staged\ngit reset --soft HEAD~1\n\n# Undo last commit, unstage changes\ngit reset HEAD~1\n\n# Undo last commit completely (DESTRUCTIVE)\ngit reset --hard HEAD~1",
        "undo-push": "# Revert a pushed commit (safe, creates new commit)\ngit revert ${args || 'HEAD'}\ngit push",
        "clean-branches": "# Delete merged local branches\ngit branch --merged main | grep -v main | xargs git branch -d\n\n# Prune remote tracking branches\ngit remote prune origin",
        "log-pretty": "git log --oneline --graph --decorate -${args || '20'}",
        "blame": `git blame ${args || "<file>"} | head -50`,
        "diff-stat": `git diff --stat ${args || "HEAD~1"}`
      };
      const cmd = commands[operation] || "Unknown operation";
      return { content: [{ type: "text", text: `\`\`\`bash\n${cmd}\n\`\`\`` }] };
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
