# changelog-forge-mcp

[![npm version](https://img.shields.io/npm/v/changelog-forge-mcp.svg)](https://www.npmjs.com/package/changelog-forge-mcp)
[![npm downloads](https://img.shields.io/npm/dw/changelog-forge-mcp.svg)](https://www.npmjs.com/package/changelog-forge-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![MCP](https://img.shields.io/badge/MCP-Compatible-blue.svg)](https://modelcontextprotocol.io)

**Generate changelogs from conventional commits.**

Auto-generate changelogs from commit messages. Conventional commits format.

## Quick Start

```bash
npx changelog-forge-mcp
```

### Claude Desktop / Cursor / Windsurf

Add to your MCP configuration:

```json
{
  "mcpServers": {
    "changelog": {
      "command": "npx",
      "args": ["-y", "changelog-forge-mcp"]
    }
  }
}
```

## Tools (3)

| Tool | Description |
|------|-------------|
| `parse_commits` | Parse conventional commit messages and categorize them (feat, fix, docs, chore, etc.). |
| `generate_changelog` | Generate a full CHANGELOG.md entry from commit messages. |
| `bump_version` | Suggest the next semver version based on commit types (major for breaking, minor for feat, patch for fix). |

## Examples

**Generate changelog:**
```json
{
  "tool": "changelog_generate",
  "arguments": {"commits": ["feat: add login", "fix: crash"]}
}
```

## Build from Source

```bash
git clone https://github.com/ryudi84/sovereign-mcp-servers
cd sovereign-mcp-servers/changelog-forge
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
