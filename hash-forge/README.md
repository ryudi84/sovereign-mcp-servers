# hash-forge-mcp

[![npm version](https://img.shields.io/npm/v/hash-forge-mcp.svg)](https://www.npmjs.com/package/hash-forge-mcp)
[![npm downloads](https://img.shields.io/npm/dw/hash-forge-mcp.svg)](https://www.npmjs.com/package/hash-forge-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![MCP](https://img.shields.io/badge/MCP-Compatible-blue.svg)](https://modelcontextprotocol.io)

**Cryptographic hashing made easy. MD5, SHA-256, SHA-512.**

Hash strings and compare digests without leaving your editor.

## Quick Start

```bash
npx hash-forge-mcp
```

### Claude Desktop / Cursor / Windsurf

Add to your MCP configuration:

```json
{
  "mcpServers": {
    "hash": {
      "command": "npx",
      "args": ["-y", "hash-forge-mcp"]
    }
  }
}
```

## Tools (3)

| Tool | Description |
|------|-------------|
| `hash_text` | Hash text with all algorithms: MD5, SHA-1, SHA-256, SHA-384, SHA-512. |
| `compute_hmac` | Generate an HMAC signature. |
| `compare_hashes` | Compare two hash strings (case-insensitive). |

## Examples

**Hash a string:**
```json
{
  "tool": "hash_string",
  "arguments": {"text": "hello world", "algorithm": "sha256"}
}
```

## Build from Source

```bash
git clone https://github.com/ryudi84/sovereign-mcp-servers
cd sovereign-mcp-servers/hash-forge
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
