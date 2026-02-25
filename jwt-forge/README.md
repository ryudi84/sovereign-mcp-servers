# jwt-forge-mcp

[![npm version](https://img.shields.io/npm/v/jwt-forge-mcp.svg)](https://www.npmjs.com/package/jwt-forge-mcp)
[![npm downloads](https://img.shields.io/npm/dw/jwt-forge-mcp.svg)](https://www.npmjs.com/package/jwt-forge-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![MCP](https://img.shields.io/badge/MCP-Compatible-blue.svg)](https://modelcontextprotocol.io)

**Decode and inspect JWTs right in your IDE.**

Decode any JWT token, inspect headers and claims, check expiration.

## Quick Start

```bash
npx jwt-forge-mcp
```

### Claude Desktop / Cursor / Windsurf

Add to your MCP configuration:

```json
{
  "mcpServers": {
    "jwt": {
      "command": "npx",
      "args": ["-y", "jwt-forge-mcp"]
    }
  }
}
```

## Tools (2)

| Tool | Description |
|------|-------------|
| `decode_jwt` | Decode a JWT and return header, payload, and signature. |
| `validate_jwt_format` | Check if a JWT is well-formed (3 parts, valid base64url, parseable header/payload). |

## Examples

**Decode JWT:**
```json
{
  "tool": "jwt_decode",
  "arguments": {"token": "eyJhbGciOiJIUzI1NiJ9..."}
}
```

## Build from Source

```bash
git clone https://github.com/ryudi84/sovereign-mcp-servers
cd sovereign-mcp-servers/jwt-forge
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
