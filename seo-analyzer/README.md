# sovereign-seo-analyzer-mcp

[![npm version](https://img.shields.io/npm/v/sovereign-seo-analyzer-mcp.svg)](https://www.npmjs.com/package/sovereign-seo-analyzer-mcp)
[![npm downloads](https://img.shields.io/npm/dw/sovereign-seo-analyzer-mcp.svg)](https://www.npmjs.com/package/sovereign-seo-analyzer-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![MCP](https://img.shields.io/badge/MCP-Compatible-blue.svg)](https://modelcontextprotocol.io)

**SEO analysis in your IDE. Check meta tags, headings, keywords — instantly.**

Run SEO audits without leaving your editor. Analyze any page meta tags, heading hierarchy, keyword density, and generate robots.txt/sitemaps.

## Quick Start

```bash
npx sovereign-seo-analyzer-mcp
```

### Claude Desktop / Cursor / Windsurf

Add to your MCP configuration:

```json
{
  "mcpServers": {
    "seo-analyzer": {
      "command": "npx",
      "args": ["-y", "sovereign-seo-analyzer-mcp"]
    }
  }
}
```

## Tools (5)

| Tool | Description |
|------|-------------|
| `analyze_meta` | Analyze a URL |
| `check_headings` | Analyze heading hierarchy (H1-H6) for SEO best practices. |
| `keyword_density` | Analyze keyword/word frequency and density on a page. |
| `generate_robots_txt` | Generate a robots.txt file for a given domain. |
| `generate_sitemap` | Generate a basic sitemap.xml from a list of URLs. |

## Examples

**Analyze meta tags:**
```json
{
  "tool": "analyze_meta",
  "arguments": {"url": "https://example.com"}
}
```

**Check heading hierarchy:**
```json
{
  "tool": "check_headings",
  "arguments": {"url": "https://example.com"}
}
```

**Keyword density:**
```json
{
  "tool": "keyword_density",
  "arguments": {"text": "your content here...", "top_n": 10}
}
```

## Build from Source

```bash
git clone https://github.com/ryudi84/sovereign-mcp-servers
cd sovereign-mcp-servers/seo-analyzer
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
