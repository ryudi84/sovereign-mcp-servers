# mcp-forge-mcp

[![npm version](https://img.shields.io/npm/v/mcp-forge-mcp.svg)](https://www.npmjs.com/package/mcp-forge-mcp)
[![npm downloads](https://img.shields.io/npm/dw/mcp-forge-mcp.svg)](https://www.npmjs.com/package/mcp-forge-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![MCP](https://img.shields.io/badge/MCP-Compatible-blue.svg)](https://modelcontextprotocol.io)

**The factory that builds factories. Generate MCP servers from specs.**

Describe tools → get a complete MCP server project. Build MCP servers from your MCP client.

## Quick Start

```bash
npx mcp-forge-mcp
```

### Claude Desktop / Cursor / Windsurf

Add to your MCP configuration:

```json
{
  "mcpServers": {
    "mcp": {
      "command": "npx",
      "args": ["-y", "mcp-forge-mcp"]
    }
  }
}
```

## Tools (3)

| Tool | Description |
|------|-------------|
| `generate_server` | Generate a complete MCP server package from a name, description, and tool definitions. Returns package.json, tsconfig.json, src/index.ts, README.md, and mcpize.yaml. |
| `list_templates` | List available pre-built MCP server templates with their included tools. |
| `generate_from_template` | Generate a complete MCP server from a pre-built template (utility, converter, generator, validator). |

## Examples

**Generate server:**
```json
{
  "tool": "forge_server",
  "arguments": {"name": "my-tool", "tools": [{"name": "greet"}]}
}
```

## Build from Source

```bash
git clone https://github.com/ryudi84/sovereign-mcp-servers
cd sovereign-mcp-servers/mcp-forge-mcp
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
