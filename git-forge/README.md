# git-forge-mcp

[![npm version](https://img.shields.io/npm/v/git-forge-mcp.svg)](https://www.npmjs.com/package/git-forge-mcp)
[![npm downloads](https://img.shields.io/npm/dw/git-forge-mcp.svg)](https://www.npmjs.com/package/git-forge-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![MCP](https://img.shields.io/badge/MCP-Compatible-blue.svg)](https://modelcontextprotocol.io)

**MCP server for Git — generate commands, commit messages, .gitignore files, branch names, changelogs**

A powerful MCP server with 4 tools.

## Quick Start

```bash
npx git-forge-mcp
```

### Claude Desktop / Cursor / Windsurf

Add to your MCP configuration:

```json
{
  "mcpServers": {
    "git": {
      "command": "npx",
      "args": ["-y", "git-forge-mcp"]
    }
  }
}
```

## Tools (4)

| Tool | Description |
|------|-------------|
| `generate_commit_message` | Generate conventional commit messages from change descriptions |
| `generate_gitignore` | Generate .gitignore for project types (node, python, rust, go, java) |
| `generate_branch_name` | Generate Git branch names following conventions |
| `git_command` | Generate Git commands for common operations (squash, rebase, cherry-pick, etc.) |

## Build from Source

```bash
git clone https://github.com/ryudi84/sovereign-mcp-servers
cd sovereign-mcp-servers/git-forge
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
