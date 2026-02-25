# qr-text-forge-mcp

[![npm version](https://img.shields.io/npm/v/qr-text-forge-mcp.svg)](https://www.npmjs.com/package/qr-text-forge-mcp)
[![npm downloads](https://img.shields.io/npm/dw/qr-text-forge-mcp.svg)](https://www.npmjs.com/package/qr-text-forge-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![MCP](https://img.shields.io/badge/MCP-Compatible-blue.svg)](https://modelcontextprotocol.io)

**Generate QR code data and encode URLs, vCards, WiFi.**

Create QR code payloads for URLs, contacts, WiFi networks.

## Quick Start

```bash
npx qr-text-forge-mcp
```

### Claude Desktop / Cursor / Windsurf

Add to your MCP configuration:

```json
{
  "mcpServers": {
    "qr-text": {
      "command": "npx",
      "args": ["-y", "qr-text-forge-mcp"]
    }
  }
}
```

## Tools (2)

| Tool | Description |
|------|-------------|
| `generate_qr_payload` | Generate a QR code payload for various data types — URL, WiFi, vCard, email, phone, SMS, geo location. |
| `ascii_qr` | Generate a simple ASCII art QR-like representation of text data. Good for terminal display. |

## Examples

**Encode URL:**
```json
{
  "tool": "qr_encode",
  "arguments": {"data": "https://example.com", "type": "url"}
}
```

## Build from Source

```bash
git clone https://github.com/ryudi84/sovereign-mcp-servers
cd sovereign-mcp-servers/qr-text-forge
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
