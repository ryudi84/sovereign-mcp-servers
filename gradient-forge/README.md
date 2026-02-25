# gradient-forge-mcp

[![npm version](https://img.shields.io/npm/v/gradient-forge-mcp.svg)](https://www.npmjs.com/package/gradient-forge-mcp)
[![npm downloads](https://img.shields.io/npm/dw/gradient-forge-mcp.svg)](https://www.npmjs.com/package/gradient-forge-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![MCP](https://img.shields.io/badge/MCP-Compatible-blue.svg)](https://modelcontextprotocol.io)

**Generate CSS gradients — linear, radial, conic.**

Create beautiful CSS gradients without leaving your editor.

## Quick Start

```bash
npx gradient-forge-mcp
```

### Claude Desktop / Cursor / Windsurf

Add to your MCP configuration:

```json
{
  "mcpServers": {
    "gradient": {
      "command": "npx",
      "args": ["-y", "gradient-forge-mcp"]
    }
  }
}
```

## Tools (2)

| Tool | Description |
|------|-------------|
| `generate_gradient` | Generate a CSS gradient. |
| `random_gradient` | Generate a random beautiful gradient. |

## Examples

**Generate gradient:**
```json
{
  "tool": "gradient_generate",
  "arguments": {"colors": ["#FF5733", "#33FF57"], "type": "linear"}
}
```

## Build from Source

```bash
git clone https://github.com/ryudi84/sovereign-mcp-servers
cd sovereign-mcp-servers/gradient-forge
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
