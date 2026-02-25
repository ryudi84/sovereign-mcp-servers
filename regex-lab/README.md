# regex-lab-mcp

[![npm version](https://img.shields.io/npm/v/regex-lab-mcp.svg)](https://www.npmjs.com/package/regex-lab-mcp)
[![npm downloads](https://img.shields.io/npm/dw/regex-lab-mcp.svg)](https://www.npmjs.com/package/regex-lab-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![MCP](https://img.shields.io/badge/MCP-Compatible-blue.svg)](https://modelcontextprotocol.io)

**Test and debug regex patterns right in your IDE.**

Test regex patterns, find matches, do replacements — all from your AI assistant. No more regex101.com tabs.

## Quick Start

```bash
npx regex-lab-mcp
```

### Claude Desktop / Cursor / Windsurf

Add to your MCP configuration:

```json
{
  "mcpServers": {
    "regex-lab": {
      "command": "npx",
      "args": ["-y", "regex-lab-mcp"]
    }
  }
}
```

## Tools (3)

| Tool | Description |
|------|-------------|
| `test_regex` | Test a regex pattern against a string. Returns all matches with positions and capture groups. |
| `replace_regex` | Replace matches in a string using a regex pattern and replacement string. |
| `validate_regex` | Check if a regex pattern is syntactically valid. |

## Examples

**Test pattern:**
```json
{
  "tool": "regex_test",
  "arguments": {"pattern": "\\d{3}-\\d{4}", "text": "Call 555-1234"}
}
```

## Build from Source

```bash
git clone https://github.com/ryudi84/sovereign-mcp-servers
cd sovereign-mcp-servers/regex-lab
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
