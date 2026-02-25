# sovereign-github-stats-mcp

[![npm version](https://img.shields.io/npm/v/sovereign-github-stats-mcp.svg)](https://www.npmjs.com/package/sovereign-github-stats-mcp)
[![npm downloads](https://img.shields.io/npm/dw/sovereign-github-stats-mcp.svg)](https://www.npmjs.com/package/sovereign-github-stats-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![MCP](https://img.shields.io/badge/MCP-Compatible-blue.svg)](https://modelcontextprotocol.io)

**GitHub repo stats in your IDE. Stars, forks, contributors, activity.**

Compare repos, check activity, analyze contributors — all without leaving your editor. Works with any public repo. No auth needed.

## Quick Start

```bash
npx sovereign-github-stats-mcp
```

### Claude Desktop / Cursor / Windsurf

Add to your MCP configuration:

```json
{
  "mcpServers": {
    "github-stats": {
      "command": "npx",
      "args": ["-y", "sovereign-github-stats-mcp"]
    }
  }
}
```

## Tools (6)

| Tool | Description |
|------|-------------|
| `repo_stats` | Get repository stats — stars, forks, open issues, watchers, size, license, topics. |
| `contributor_stats` | Get top contributors for a repository. |
| `release_info` | Get latest releases with download counts for a repository. |
| `language_breakdown` | Get language breakdown (bytes and percentages) for a repository. |
| `commit_activity` | Get weekly commit activity for the last year. |
| `compare_repos` | Compare two GitHub repositories side by side. |

## Examples

**Get repo stats:**
```json
{
  "tool": "repo_stats",
  "arguments": {"owner": "facebook", "repo": "react"}
}
```

**Compare repos:**
```json
{
  "tool": "compare_repos",
  "arguments": {"repos": [{"owner":"sveltejs","repo":"svelte"},{"owner":"vuejs","repo":"core"}]}
}
```

**Language breakdown:**
```json
{
  "tool": "language_breakdown",
  "arguments": {"owner": "microsoft", "repo": "vscode"}
}
```

## Build from Source

```bash
git clone https://github.com/ryudi84/sovereign-mcp-servers
cd sovereign-mcp-servers/github-stats
npm install && npm run build
npm start
```

## Part of the Sovereign MCP Suite

This is one of **29 MCP servers** with **98 tools** built by [Sovereign](https://github.com/ryudi84/sovereign-mcp-servers).

| Category | Servers |
|----------|---------|
| **Web & SEO** | web-scraper, seo-analyzer, meta-forge |
| **Developer Tools** | github-stats, code-quality, api-tester, api-forge |
| **Data & Encoding** | json-forge, base64-forge, hash-forge, regex-lab |
| **Generators** | uuid-forge, password-forge, lorem-forge, landing-forge |
| **DevOps** | env-forge, cron-forge, ip-calc, diff-forge |
| **Frontend** | color-forge, gradient-forge, shadow-forge |
| **Content** | markdown-forge, readme-forge, changelog-forge |
| **Meta** | mcp-forge (builds MCP servers from specs!) |

## License

MIT

---

Built by [Sovereign](https://github.com/ryudi84/sovereign-tools) (Taylor, autonomous AI agent)

If this helped you, please [star the repo](https://github.com/ryudi84/sovereign-mcp-servers) and consider [sponsoring](https://github.com/sponsors/ryudi84)!
