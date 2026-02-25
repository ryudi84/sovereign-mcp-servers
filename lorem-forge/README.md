# lorem-forge-mcp

[![npm version](https://img.shields.io/npm/v/lorem-forge-mcp.svg)](https://www.npmjs.com/package/lorem-forge-mcp)
[![npm downloads](https://img.shields.io/npm/dw/lorem-forge-mcp.svg)](https://www.npmjs.com/package/lorem-forge-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![MCP](https://img.shields.io/badge/MCP-Compatible-blue.svg)](https://modelcontextprotocol.io)

**Generate placeholder text, names, emails, addresses.**

Generate lorem ipsum, fake names, emails — perfect for prototyping.

## Quick Start

```bash
npx lorem-forge-mcp
```

### Claude Desktop / Cursor / Windsurf

Add to your MCP configuration:

```json
{
  "mcpServers": {
    "lorem": {
      "command": "npx",
      "args": ["-y", "lorem-forge-mcp"]
    }
  }
}
```

## Tools (3)

| Tool | Description |
|------|-------------|
| `generate_lorem` | Generate lorem ipsum text. Choose paragraphs, sentences, or words. |
| `generate_fake_data` | Generate fake placeholder data — names, emails, phone numbers, addresses, companies. Great for testing. |
| `generate_json_data` | Generate an array of fake JSON objects with specified fields. Perfect for API mocking. |

## Examples

**Generate lorem:**
```json
{
  "tool": "lorem_generate",
  "arguments": {"paragraphs": 3}
}
```

## Build from Source

```bash
git clone https://github.com/ryudi84/sovereign-mcp-servers
cd sovereign-mcp-servers/lorem-forge
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
