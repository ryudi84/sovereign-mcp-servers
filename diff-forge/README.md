# diff-forge-mcp

[![npm version](https://img.shields.io/npm/v/diff-forge-mcp.svg)](https://www.npmjs.com/package/diff-forge-mcp)
[![npm downloads](https://img.shields.io/npm/dw/diff-forge-mcp.svg)](https://www.npmjs.com/package/diff-forge-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![MCP](https://img.shields.io/badge/MCP-Compatible-blue.svg)](https://modelcontextprotocol.io)

**Compare text and strings with unified diffs.**

Generate diffs between text, code, or files directly from your IDE.

## Quick Start

```bash
npx diff-forge-mcp
```

### Claude Desktop / Cursor / Windsurf

Add to your MCP configuration:

```json
{
  "mcpServers": {
    "diff": {
      "command": "npx",
      "args": ["-y", "diff-forge-mcp"]
    }
  }
}
```

## Tools (2)

| Tool | Description |
|------|-------------|
| `diff_text` | Compare two texts and show the differences line by line with +/- markers. |
| `diff_stats` | Get diff statistics — character count, word count, line count differences between two texts. |

## Examples

**Diff texts:**
```json
{
  "tool": "text_diff",
  "arguments": {"text1": "hello", "text2": "hello world"}
}
```

## Build from Source

```bash
git clone https://github.com/ryudi84/sovereign-mcp-servers
cd sovereign-mcp-servers/diff-forge
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
