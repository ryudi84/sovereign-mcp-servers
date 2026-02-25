# env-forge-mcp

[![npm version](https://img.shields.io/npm/v/env-forge-mcp.svg)](https://www.npmjs.com/package/env-forge-mcp)
[![npm downloads](https://img.shields.io/npm/dw/env-forge-mcp.svg)](https://www.npmjs.com/package/env-forge-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![MCP](https://img.shields.io/badge/MCP-Compatible-blue.svg)](https://modelcontextprotocol.io)

**Parse, validate, and compare .env files in your IDE.**

Validate .env files against templates, compare environments, parse variables.

## Quick Start

```bash
npx env-forge-mcp
```

### Claude Desktop / Cursor / Windsurf

Add to your MCP configuration:

```json
{
  "mcpServers": {
    "env": {
      "command": "npx",
      "args": ["-y", "env-forge-mcp"]
    }
  }
}
```

## Tools (3)

| Tool | Description |
|------|-------------|
| `parse_env` | Parse a .env file content and return all key-value pairs with metadata. |
| `validate_env` | Validate .env content against an expected schema (list of required keys). |
| `generate_env_template` | Generate an .env.example template from a list of variable names with placeholder values. |

## Examples

**Parse .env:**
```json
{
  "tool": "env_parse",
  "arguments": {"content": "DB_HOST=localhost\nDB_PORT=5432"}
}
```

## Build from Source

```bash
git clone https://github.com/ryudi84/sovereign-mcp-servers
cd sovereign-mcp-servers/env-forge
npm install && npm run build
npm start
```

## Part of the Sovereign MCP Suite

This is one of **34 MCP servers** with **121 tools** built by [Sovereign](https://github.com/ryudi84/sovereign-mcp-servers).

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
