# readme-forge-mcp

[![npm version](https://img.shields.io/npm/v/readme-forge-mcp.svg)](https://www.npmjs.com/package/readme-forge-mcp)
[![npm downloads](https://img.shields.io/npm/dw/readme-forge-mcp.svg)](https://www.npmjs.com/package/readme-forge-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![MCP](https://img.shields.io/badge/MCP-Compatible-blue.svg)](https://modelcontextprotocol.io)

**Generate README.md from project metadata.**

Auto-generate professional READMEs with badges and sections.

## Quick Start

```bash
npx readme-forge-mcp
```

### Claude Desktop / Cursor / Windsurf

Add to your MCP configuration:

```json
{
  "mcpServers": {
    "readme": {
      "command": "npx",
      "args": ["-y", "readme-forge-mcp"]
    }
  }
}
```

## Tools (1)

| Tool | Description |
|------|-------------|
| `generate_readme` | Generate a complete README.md for a project. |

## Examples

**Generate README:**
```json
{
  "tool": "readme_generate",
  "arguments": {"name": "my-project"}
}
```

## Build from Source

```bash
git clone https://github.com/ryudi84/sovereign-mcp-servers
cd sovereign-mcp-servers/readme-forge
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
