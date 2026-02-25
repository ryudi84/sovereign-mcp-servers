# markdown-forge-mcp

[![npm version](https://img.shields.io/npm/v/markdown-forge-mcp.svg)](https://www.npmjs.com/package/markdown-forge-mcp)
[![npm downloads](https://img.shields.io/npm/dw/markdown-forge-mcp.svg)](https://www.npmjs.com/package/markdown-forge-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![MCP](https://img.shields.io/badge/MCP-Compatible-blue.svg)](https://modelcontextprotocol.io)

**Generate markdown tables, TOC, HTML conversion, and more.**

Automate markdown generation. Create tables from data, generate TOC, convert to HTML.

## Quick Start

```bash
npx markdown-forge-mcp
```

### Claude Desktop / Cursor / Windsurf

Add to your MCP configuration:

```json
{
  "mcpServers": {
    "markdown": {
      "command": "npx",
      "args": ["-y", "markdown-forge-mcp"]
    }
  }
}
```

## Tools (4)

| Tool | Description |
|------|-------------|
| `generate_table` | Generate a markdown table from headers and rows. |
| `generate_toc` | Generate a table of contents from markdown headings. |
| `generate_badges` | Generate shields.io markdown badges for a project. |
| `markdown_to_html` | Convert basic markdown to HTML (headings, bold, italic, code, links, lists, paragraphs). |

## Examples

**Generate table:**
```json
{
  "tool": "markdown_table",
  "arguments": {"headers": ["Name", "Stars"], "rows": [["React", "220k"]]}
}
```

## Build from Source

```bash
git clone https://github.com/ryudi84/sovereign-mcp-servers
cd sovereign-mcp-servers/markdown-forge
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
