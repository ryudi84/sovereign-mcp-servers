# sovereign-api-forge-mcp

[![npm version](https://img.shields.io/npm/v/sovereign-api-forge-mcp.svg)](https://www.npmjs.com/package/sovereign-api-forge-mcp)
[![npm downloads](https://img.shields.io/npm/dw/sovereign-api-forge-mcp.svg)](https://www.npmjs.com/package/sovereign-api-forge-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![MCP](https://img.shields.io/badge/MCP-Compatible-blue.svg)](https://modelcontextprotocol.io)

**Generate REST API boilerplate — Express endpoints, middleware.**

Scaffold API endpoints, middleware, and route handlers from your IDE.

## Quick Start

```bash
npx sovereign-api-forge-mcp
```

### Claude Desktop / Cursor / Windsurf

Add to your MCP configuration:

```json
{
  "mcpServers": {
    "api": {
      "command": "npx",
      "args": ["-y", "sovereign-api-forge-mcp"]
    }
  }
}
```

## Tools (3)

| Tool | Description |
|------|-------------|
| `generate_express_api` | Generate a complete Express.js REST API with routes, error handling, CORS, and optional JWT auth |
| `generate_endpoint` | Generate a single Express route handler with validation, error handling, and JSDoc documentation |
| `generate_middleware` | Generate a complete Express middleware function (auth, rate-limit, cors, logging, or validation) |

## Examples

**Generate endpoint:**
```json
{
  "tool": "generate_endpoint",
  "arguments": {"path": "/api/users", "method": "GET"}
}
```

## Build from Source

```bash
git clone https://github.com/ryudi84/sovereign-mcp-servers
cd sovereign-mcp-servers/api-forge-mcp
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
