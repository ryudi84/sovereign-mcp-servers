# sovereign-web-scraper-mcp

[![npm version](https://img.shields.io/npm/v/sovereign-web-scraper-mcp.svg)](https://www.npmjs.com/package/sovereign-web-scraper-mcp)
[![npm downloads](https://img.shields.io/npm/dw/sovereign-web-scraper-mcp.svg)](https://www.npmjs.com/package/sovereign-web-scraper-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![MCP](https://img.shields.io/badge/MCP-Compatible-blue.svg)](https://modelcontextprotocol.io)

**Scrape any website from your IDE. Zero config. LLM-optimized output.**

Stop copy-pasting from browsers. Scrape URLs, extract links, pull metadata — all from Claude, Cursor, or Windsurf. No API keys needed.

## Quick Start

```bash
npx sovereign-web-scraper-mcp
```

### Claude Desktop / Cursor / Windsurf

Add to your MCP configuration:

```json
{
  "mcpServers": {
    "web-scraper": {
      "command": "npx",
      "args": ["-y", "sovereign-web-scraper-mcp"]
    }
  }
}
```

## Tools (4)

| Tool | Description |
|------|-------------|
| `scrape_url` | Fetch a URL and return clean, LLM-optimized text content (strips ads, nav, scripts). |
| `scrape_links` | Extract all links from a URL. Returns unique URLs found on the page. |
| `scrape_structured` | Extract content matching CSS-like selectors (tag, class, id) from a URL. |
| `scrape_meta` | Extract metadata (title, description, Open Graph tags, canonical URL) from a page. |

## Examples

**Scrape a docs page:**
```json
{
  "tool": "scrape_url",
  "arguments": {"url": "https://docs.python.org/3/tutorial/"}
}
```

**Extract all links:**
```json
{
  "tool": "scrape_links",
  "arguments": {"url": "https://news.ycombinator.com"}
}
```

**Get page metadata:**
```json
{
  "tool": "scrape_meta",
  "arguments": {"url": "https://github.com/anthropics/claude-code"}
}
```

## Build from Source

```bash
git clone https://github.com/ryudi84/sovereign-mcp-servers
cd sovereign-mcp-servers/web-scraper
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
