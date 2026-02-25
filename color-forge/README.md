# color-forge-mcp

[![npm version](https://img.shields.io/npm/v/color-forge-mcp.svg)](https://www.npmjs.com/package/color-forge-mcp)
[![npm downloads](https://img.shields.io/npm/dw/color-forge-mcp.svg)](https://www.npmjs.com/package/color-forge-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![MCP](https://img.shields.io/badge/MCP-Compatible-blue.svg)](https://modelcontextprotocol.io)

**Color palette generation and HEX/RGB/HSL conversion.**

Generate color palettes and convert between formats from your IDE.

## Quick Start

```bash
npx color-forge-mcp
```

### Claude Desktop / Cursor / Windsurf

Add to your MCP configuration:

```json
{
  "mcpServers": {
    "color": {
      "command": "npx",
      "args": ["-y", "color-forge-mcp"]
    }
  }
}
```

## Tools (2)

| Tool | Description |
|------|-------------|
| `generate_palette` | Generate a color palette. Harmonies: random, analogous, complementary, triadic, monochromatic, warm, cool, pastel, neon. |
| `export_palette` | Export colors to CSS, Tailwind, SCSS, or JSON format. |

## Examples

**Convert color:**
```json
{
  "tool": "color_convert",
  "arguments": {"color": "#FF5733", "format": "rgb"}
}
```

## Build from Source

```bash
git clone https://github.com/ryudi84/sovereign-mcp-servers
cd sovereign-mcp-servers/color-forge
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
