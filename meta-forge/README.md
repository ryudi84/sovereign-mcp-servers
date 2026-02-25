# meta-forge-mcp

[![npm version](https://img.shields.io/npm/v/meta-forge-mcp.svg)](https://www.npmjs.com/package/meta-forge-mcp)
[![npm downloads](https://img.shields.io/npm/dw/meta-forge-mcp.svg)](https://www.npmjs.com/package/meta-forge-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![MCP](https://img.shields.io/badge/MCP-Compatible-blue.svg)](https://modelcontextprotocol.io)

**Generate SEO meta tags — title, OG, Twitter cards.**

Create complete meta tag sets including Open Graph and Twitter Cards.

## Quick Start

```bash
npx meta-forge-mcp
```

### Claude Desktop / Cursor / Windsurf

Add to your MCP configuration:

```json
{
  "mcpServers": {
    "meta": {
      "command": "npx",
      "args": ["-y", "meta-forge-mcp"]
    }
  }
}
```

## Tools (2)

| Tool | Description |
|------|-------------|
| `generate_meta_tags` | Generate complete HTML meta tags for SEO, Open Graph, and Twitter Card. |
| `check_seo` | Run an SEO checklist on meta tag values. Returns pass/fail for title length, description length, etc. |

## Examples

**Generate meta:**
```json
{
  "tool": "meta_generate",
  "arguments": {"title": "My App", "description": "A great app"}
}
```

## Build from Source

```bash
git clone https://github.com/ryudi84/sovereign-mcp-servers
cd sovereign-mcp-servers/meta-forge
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
