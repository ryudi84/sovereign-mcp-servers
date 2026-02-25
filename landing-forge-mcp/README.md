# landing-forge-mcp

[![npm version](https://img.shields.io/npm/v/landing-forge-mcp.svg)](https://www.npmjs.com/package/landing-forge-mcp)
[![npm downloads](https://img.shields.io/npm/dw/landing-forge-mcp.svg)](https://www.npmjs.com/package/landing-forge-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![MCP](https://img.shields.io/badge/MCP-Compatible-blue.svg)](https://modelcontextprotocol.io)

**Generate complete HTML landing pages from a prompt.**

Describe what you need → get a production-ready landing page.

## Quick Start

```bash
npx landing-forge-mcp
```

### Claude Desktop / Cursor / Windsurf

Add to your MCP configuration:

```json
{
  "mcpServers": {
    "landing": {
      "command": "npx",
      "args": ["-y", "landing-forge-mcp"]
    }
  }
}
```

## Tools (3)

| Tool | Description |
|------|-------------|
| `generate_landing_page` | Generate a complete, production-ready HTML landing page with responsive design, hero section, features grid, CTA, and footer. Returns a self-contained HTML document with inline CSS and no external dependencies. |
| `generate_product_card` | Generate a standalone HTML product card component with inline CSS. Perfect for embedding in landing pages, stores, or product showcases. |
| `generate_pricing_table` | Generate a complete pricing table HTML component with multiple plan columns. Supports highlighting a recommended plan. Uses dark theme with inline CSS. |

## Examples

**Generate page:**
```json
{
  "tool": "generate_landing",
  "arguments": {"product": "AI Tool", "style": "modern"}
}
```

## Build from Source

```bash
git clone https://github.com/ryudi84/sovereign-mcp-servers
cd sovereign-mcp-servers/landing-forge-mcp
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
