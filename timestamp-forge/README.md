# timestamp-forge-mcp

[![npm version](https://img.shields.io/npm/v/timestamp-forge-mcp.svg)](https://www.npmjs.com/package/timestamp-forge-mcp)
[![npm downloads](https://img.shields.io/npm/dw/timestamp-forge-mcp.svg)](https://www.npmjs.com/package/timestamp-forge-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![MCP](https://img.shields.io/badge/MCP-Compatible-blue.svg)](https://modelcontextprotocol.io)

**Convert timestamps between Unix, ISO 8601, and readable formats.**

Instantly convert between timestamp formats. Unix epoch, ISO 8601, relative time.

## Quick Start

```bash
npx timestamp-forge-mcp
```

### Claude Desktop / Cursor / Windsurf

Add to your MCP configuration:

```json
{
  "mcpServers": {
    "timestamp": {
      "command": "npx",
      "args": ["-y", "timestamp-forge-mcp"]
    }
  }
}
```

## Tools (3)

| Tool | Description |
|------|-------------|
| `current_time` | Get current time in multiple formats: Unix, UTC, ISO 8601, RFC 2822, SQL datetime. |
| `unix_to_human` | Convert Unix timestamp to human-readable formats. Auto-detects seconds vs milliseconds. |
| `date_diff` | Calculate the difference between two dates. |

## Examples

**Convert timestamp:**
```json
{
  "tool": "timestamp_convert",
  "arguments": {"timestamp": 1703980800}
}
```

## Build from Source

```bash
git clone https://github.com/ryudi84/sovereign-mcp-servers
cd sovereign-mcp-servers/timestamp-forge
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
