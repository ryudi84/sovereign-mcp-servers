#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const GH_API = "https://api.github.com";
const GH_HEADERS: Record<string, string> = {
  "User-Agent": "SovereignMCP/1.0",
  "Accept": "application/vnd.github.v3+json",
};

async function ghFetch(path: string): Promise<any> {
  const res = await fetch(`${GH_API}${path}`, { headers: GH_HEADERS });
  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

// === MCP Server Setup ===

const server = new McpServer(
  { name: "github-stats", version: "1.0.0" },
  {
    capabilities: { tools: {} },
    instructions:
      "MCP server for GitHub repository statistics — stars, forks, issues, PRs, languages, contributors, commit activity. No auth needed for public repos.",
  }
);

// Tool: repo_stats
server.tool(
  "repo_stats",
  "Get repository stats — stars, forks, open issues, watchers, size, license, topics.",
  {
    owner: z.string().describe("Repository owner (e.g. facebook)"),
    repo: z.string().describe("Repository name (e.g. react)"),
  },
  async ({ owner, repo }) => {
    try {
      const data = await ghFetch(`/repos/${owner}/${repo}`);
      const report = [
        `# ${data.full_name}`,
        "",
        data.description || "No description",
        "",
        `**Stars**: ${data.stargazers_count.toLocaleString()}`,
        `**Forks**: ${data.forks_count.toLocaleString()}`,
        `**Open Issues**: ${data.open_issues_count.toLocaleString()}`,
        `**Watchers**: ${data.subscribers_count?.toLocaleString() ?? "N/A"}`,
        `**Size**: ${(data.size / 1024).toFixed(1)} MB`,
        `**Language**: ${data.language || "N/A"}`,
        `**License**: ${data.license?.spdx_id || "None"}`,
        `**Created**: ${data.created_at?.split("T")[0]}`,
        `**Updated**: ${data.updated_at?.split("T")[0]}`,
        `**Topics**: ${data.topics?.join(", ") || "None"}`,
        `**Default Branch**: ${data.default_branch}`,
        `**Archived**: ${data.archived}`,
      ].join("\n");
      return { content: [{ type: "text" as const, text: report }] };
    } catch (e: unknown) {
      return {
        content: [{ type: "text" as const, text: `Error: ${(e as Error).message}` }],
        isError: true,
      };
    }
  }
);

// Tool: contributor_stats
server.tool(
  "contributor_stats",
  "Get top contributors for a repository.",
  {
    owner: z.string().describe("Repository owner"),
    repo: z.string().describe("Repository name"),
    top_n: z.number().default(10).describe("Number of top contributors to return"),
  },
  async ({ owner, repo, top_n }) => {
    try {
      const data = await ghFetch(
        `/repos/${owner}/${repo}/contributors?per_page=${top_n}`
      );
      const lines = data.map(
        (c: any, i: number) =>
          `${i + 1}. **${c.login}** — ${c.contributions} commits`
      );
      const text = `# Top Contributors: ${owner}/${repo}\n\n${lines.join("\n")}`;
      return { content: [{ type: "text" as const, text }] };
    } catch (e: unknown) {
      return {
        content: [{ type: "text" as const, text: `Error: ${(e as Error).message}` }],
        isError: true,
      };
    }
  }
);

// Tool: release_info
server.tool(
  "release_info",
  "Get latest releases with download counts for a repository.",
  {
    owner: z.string().describe("Repository owner"),
    repo: z.string().describe("Repository name"),
    count: z.number().default(5).describe("Number of releases to fetch"),
  },
  async ({ owner, repo, count }) => {
    try {
      const data = await ghFetch(
        `/repos/${owner}/${repo}/releases?per_page=${count}`
      );
      if (!Array.isArray(data) || data.length === 0) {
        return { content: [{ type: "text" as const, text: "No releases found." }] };
      }
      const sections = data.map((r: any) => {
        const title = r.name ? `${r.tag_name} — ${r.name}` : r.tag_name;
        const published = r.published_at?.split("T")[0] ?? "Unknown";
        const downloads = r.assets?.reduce(
          (sum: number, a: any) => sum + (a.download_count || 0),
          0
        ) ?? 0;
        const body = r.body
          ? r.body.substring(0, 200) + (r.body.length > 200 ? "..." : "")
          : "No release notes";
        return [
          `## ${title}`,
          `**Published**: ${published}`,
          `**Downloads**: ${downloads.toLocaleString()}`,
          body,
        ].join("\n");
      });
      const text = `# Releases: ${owner}/${repo}\n\n${sections.join("\n\n")}`;
      return { content: [{ type: "text" as const, text }] };
    } catch (e: unknown) {
      return {
        content: [{ type: "text" as const, text: `Error: ${(e as Error).message}` }],
        isError: true,
      };
    }
  }
);

// Tool: language_breakdown
server.tool(
  "language_breakdown",
  "Get language breakdown (bytes and percentages) for a repository.",
  {
    owner: z.string().describe("Repository owner"),
    repo: z.string().describe("Repository name"),
  },
  async ({ owner, repo }) => {
    try {
      const data: Record<string, number> = await ghFetch(
        `/repos/${owner}/${repo}/languages`
      );
      const entries = Object.entries(data);
      if (entries.length === 0) {
        return {
          content: [{ type: "text" as const, text: "No language data available." }],
        };
      }
      const total = entries.reduce((sum, [, bytes]) => sum + bytes, 0);
      const rows = entries.map(
        ([lang, bytes]) =>
          `| ${lang} | ${(bytes / 1024).toFixed(1)} KB | ${((bytes / total) * 100).toFixed(1)}% |`
      );
      const table = [
        `# Languages: ${owner}/${repo}`,
        "",
        "| Language | Size | Percentage |",
        "|----------|------|------------|",
        ...rows,
      ].join("\n");
      return { content: [{ type: "text" as const, text: table }] };
    } catch (e: unknown) {
      return {
        content: [{ type: "text" as const, text: `Error: ${(e as Error).message}` }],
        isError: true,
      };
    }
  }
);

// Tool: commit_activity
server.tool(
  "commit_activity",
  "Get weekly commit activity for the last year.",
  {
    owner: z.string().describe("Repository owner"),
    repo: z.string().describe("Repository name"),
  },
  async ({ owner, repo }) => {
    try {
      const data = await ghFetch(
        `/repos/${owner}/${repo}/stats/commit_activity`
      );
      if (!Array.isArray(data)) {
        return {
          content: [
            {
              type: "text" as const,
              text: "Commit data not ready — GitHub is computing stats. Try again in a few seconds.",
            },
          ],
        };
      }
      const recent = data.slice(-12);
      const totalYear = data.reduce(
        (sum: number, w: any) => sum + w.total,
        0
      );
      const chartLines = recent.map((w: any) => {
        const date = new Date(w.week * 1000).toISOString().split("T")[0];
        const bar = "\u2588".repeat(Math.min(w.total, 50));
        return `${date}: ${bar} (${w.total})`;
      });
      const text = [
        `# Commit Activity: ${owner}/${repo}`,
        "",
        `**Total (year)**: ${totalYear} commits`,
        "",
        "Last 12 weeks:",
        "```",
        ...chartLines,
        "```",
      ].join("\n");
      return { content: [{ type: "text" as const, text }] };
    } catch (e: unknown) {
      return {
        content: [{ type: "text" as const, text: `Error: ${(e as Error).message}` }],
        isError: true,
      };
    }
  }
);

// Tool: compare_repos
server.tool(
  "compare_repos",
  "Compare two GitHub repositories side by side.",
  {
    repo1: z.string().describe("First repo in owner/name format (e.g. facebook/react)"),
    repo2: z.string().describe("Second repo in owner/name format (e.g. vuejs/core)"),
  },
  async ({ repo1, repo2 }) => {
    try {
      const [r1, r2] = await Promise.all([
        ghFetch(`/repos/${repo1}`),
        ghFetch(`/repos/${repo2}`),
      ]);

      const row = (label: string, v1: any, v2: any): string => {
        const s1 = typeof v1 === "number" ? v1.toLocaleString() : String(v1);
        const s2 = typeof v2 === "number" ? v2.toLocaleString() : String(v2);
        return `| ${label} | ${s1} | ${s2} |`;
      };

      const table = [
        `# Repo Comparison`,
        "",
        `| Metric | ${repo1} | ${repo2} |`,
        `|--------|${"-".repeat(repo1.length + 2)}|${"-".repeat(repo2.length + 2)}|`,
        row("Stars", r1.stargazers_count, r2.stargazers_count),
        row("Forks", r1.forks_count, r2.forks_count),
        row("Open Issues", r1.open_issues_count, r2.open_issues_count),
        row("Watchers", r1.subscribers_count ?? "N/A", r2.subscribers_count ?? "N/A"),
        row("Language", r1.language || "N/A", r2.language || "N/A"),
        row("License", r1.license?.spdx_id || "None", r2.license?.spdx_id || "None"),
        row(
          "Size",
          `${(r1.size / 1024).toFixed(1)} MB`,
          `${(r2.size / 1024).toFixed(1)} MB`
        ),
        row(
          "Created",
          r1.created_at?.split("T")[0],
          r2.created_at?.split("T")[0]
        ),
        row(
          "Updated",
          r1.updated_at?.split("T")[0],
          r2.updated_at?.split("T")[0]
        ),
        row("Archived", r1.archived, r2.archived),
      ].join("\n");

      return { content: [{ type: "text" as const, text: table }] };
    } catch (e: unknown) {
      return {
        content: [{ type: "text" as const, text: `Error: ${(e as Error).message}` }],
        isError: true,
      };
    }
  }
);

// === Start Server ===

async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error: unknown) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
