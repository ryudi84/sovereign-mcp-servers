# cron-forge-mcp

[![npm version](https://img.shields.io/npm/v/cron-forge-mcp.svg)](https://www.npmjs.com/package/cron-forge-mcp)
[![npm downloads](https://img.shields.io/npm/dw/cron-forge-mcp.svg)](https://www.npmjs.com/package/cron-forge-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![MCP](https://img.shields.io/badge/MCP-Compatible-blue.svg)](https://modelcontextprotocol.io)

**Parse, validate, and explain cron expressions in your IDE.**

Stop guessing what cron expressions mean. Parse them to human-readable text, validate syntax, get next run times.

## Quick Start

```bash
npx cron-forge-mcp
```

### Claude Desktop / Cursor / Windsurf

Add to your MCP configuration:

```json
{
  "mcpServers": {
    "cron": {
      "command": "npx",
      "args": ["-y", "cron-forge-mcp"]
    }
  }
}
```

## Tools (3)

| Tool | Description |
|------|-------------|
| `explain_cron` | Explain a cron expression in human-readable English. |
| `next_cron_runs` | Calculate the next N run times for a cron expression. |
| `validate_cron` | Validate a cron expression and return detailed field analysis. |

## Examples

**Explain cron:**
```json
{
  "tool": "cron_explain",
  "arguments": {"expression": "*/5 * * * *"}
}
```

## Build from Source

```bash
git clone https://github.com/ryudi84/sovereign-mcp-servers
cd sovereign-mcp-servers/cron-forge
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
