# password-forge-mcp

[![npm version](https://img.shields.io/npm/v/password-forge-mcp.svg)](https://www.npmjs.com/package/password-forge-mcp)
[![npm downloads](https://img.shields.io/npm/dw/password-forge-mcp.svg)](https://www.npmjs.com/package/password-forge-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![MCP](https://img.shields.io/badge/MCP-Compatible-blue.svg)](https://modelcontextprotocol.io)

**Generate secure passwords and passphrases in your IDE.**

Need a strong password? A passphrase? Check password strength? All from your AI assistant.

## Quick Start

```bash
npx password-forge-mcp
```

### Claude Desktop / Cursor / Windsurf

Add to your MCP configuration:

```json
{
  "mcpServers": {
    "password": {
      "command": "npx",
      "args": ["-y", "password-forge-mcp"]
    }
  }
}
```

## Tools (3)

| Tool | Description |
|------|-------------|
| `generate_password` | Generate a cryptographically secure random password. |
| `generate_passphrase` | Generate a memorable passphrase from random words (XKCD-style). |
| `check_strength` | Analyze password strength — length, charset diversity, entropy estimate, and tips. |

## Examples

**Generate password:**
```json
{
  "tool": "generate_password",
  "arguments": {"length": 24, "symbols": true}
}
```

## Build from Source

```bash
git clone https://github.com/ryudi84/sovereign-mcp-servers
cd sovereign-mcp-servers/password-forge
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
