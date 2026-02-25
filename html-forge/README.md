# html-forge-mcp

[![npm version](https://img.shields.io/npm/v/html-forge-mcp.svg)](https://www.npmjs.com/package/html-forge-mcp)
[![npm downloads](https://img.shields.io/npm/dw/html-forge-mcp.svg)](https://www.npmjs.com/package/html-forge-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![MCP](https://img.shields.io/badge/MCP-Compatible-blue.svg)](https://modelcontextprotocol.io)

**HTML toolkit in your IDE. Boilerplate, minify, prettify, validate, meta tags.**

Generate HTML5 boilerplate with dark mode support, minify/prettify HTML, validate structure and accessibility, create complete meta tag sets (SEO + Open Graph + Twitter) — all from your editor.

## Quick Start

```bash
npx html-forge-mcp
```

### Claude Desktop / Cursor / Windsurf

Add to your MCP configuration:

```json
{
  "mcpServers": {
    "html": {
      "command": "npx",
      "args": ["-y", "html-forge-mcp"]
    }
  }
}
```

## Tools (5)

| Tool | Description |
|------|-------------|
| `generate_boilerplate` | Generate HTML5 boilerplate with optional features |
| `minify_html` | Minify HTML by removing comments, extra whitespace, and newlines |
| `prettify_html` | Format/prettify HTML with proper indentation |
| `validate_html` | Check HTML for common issues (unclosed tags, missing attributes, accessibility) |
| `generate_meta_tags` | Generate complete meta tags (SEO, Open Graph, Twitter Card) |

## Examples

**Generate boilerplate:**
```json
{
  "tool": "generate_boilerplate",
  "arguments": {"title": "My App", "description": "A great app", "dark_mode": true}
}
```

**Generate meta tags:**
```json
{
  "tool": "generate_meta_tags",
  "arguments": {"title": "My App", "description": "A great app", "type": "website"}
}
```

**Validate HTML:**
```json
{
  "tool": "validate_html",
  "arguments": {"html": "<html><body><img src=\"photo.jpg\"></body></html>"}
}
```

## Build from Source

```bash
git clone https://github.com/ryudi84/sovereign-mcp-servers
cd sovereign-mcp-servers/html-forge
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
