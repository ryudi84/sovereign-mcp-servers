# base64-forge-mcp

[![npm version](https://img.shields.io/npm/v/base64-forge-mcp.svg)](https://www.npmjs.com/package/base64-forge-mcp)
[![npm downloads](https://img.shields.io/npm/dw/base64-forge-mcp.svg)](https://www.npmjs.com/package/base64-forge-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![MCP](https://img.shields.io/badge/MCP-Compatible-blue.svg)](https://modelcontextprotocol.io)

**Encode and decode Base64, URL, and HTML — all in your IDE.**

6 encoding tools in one. Base64, URL, and HTML entity encode/decode.

## Quick Start

```bash
npx base64-forge-mcp
```

### Claude Desktop / Cursor / Windsurf

Add to your MCP configuration:

```json
{
  "mcpServers": {
    "base64": {
      "command": "npx",
      "args": ["-y", "base64-forge-mcp"]
    }
  }
}
```

## Tools (6)

| Tool | Description |
|------|-------------|
| `encode_base64` | Encode text to Base64. |
| `decode_base64` | Decode a Base64 string to plain text. |
| `encode_url` | URL-encode a string. |
| `decode_url` | Decode a URL-encoded string. |
| `encode_html` | Escape HTML special characters. |
| `decode_html` | Decode HTML entities to plain text. |

## Examples

**Base64 encode:**
```json
{
  "tool": "base64_encode",
  "arguments": {"text": "Hello, World!"}
}
```

## Build from Source

```bash
git clone https://github.com/ryudi84/sovereign-mcp-servers
cd sovereign-mcp-servers/base64-forge
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
