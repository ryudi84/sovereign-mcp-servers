# sovereign-code-quality-mcp

[![npm version](https://img.shields.io/npm/v/sovereign-code-quality-mcp.svg)](https://www.npmjs.com/package/sovereign-code-quality-mcp)
[![npm downloads](https://img.shields.io/npm/dw/sovereign-code-quality-mcp.svg)](https://www.npmjs.com/package/sovereign-code-quality-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![MCP](https://img.shields.io/badge/MCP-Compatible-blue.svg)](https://modelcontextprotocol.io)

**Code quality metrics in your IDE. Complexity, duplicates, naming.**

Get instant code quality feedback. Measure complexity, find duplicates, check naming conventions — all from your AI assistant.

## Quick Start

```bash
npx sovereign-code-quality-mcp
```

### Claude Desktop / Cursor / Windsurf

Add to your MCP configuration:

```json
{
  "mcpServers": {
    "code-quality": {
      "command": "npx",
      "args": ["-y", "sovereign-code-quality-mcp"]
    }
  }
}
```

## Tools (5)

| Tool | Description |
|------|-------------|
| `analyze_complexity` | Calculate cyclomatic complexity of code. Counts decision points (if, for, while, case, &&, ||, ternary). |
| `find_duplicates` | Find duplicate/similar code blocks (potential code clones). |
| `check_naming` | Check naming conventions (camelCase, snake_case, PascalCase) in code. |
| `measure_file` | Measure file metrics -- lines of code, comments, blank lines, comment ratio. |
| `suggest_refactor` | Analyze code and suggest refactoring improvements. |

## Examples

**Analyze complexity:**
```json
{
  "tool": "analyze_complexity",
  "arguments": {"code": "function example(x) { if (x > 0) { for (let i = 0; i < x; i++) { console.log(i); } } }"}
}
```

**Check naming:**
```json
{
  "tool": "check_naming",
  "arguments": {"code": "const myVar = 1;", "language": "javascript"}
}
```

## Build from Source

```bash
git clone https://github.com/ryudi84/sovereign-mcp-servers
cd sovereign-mcp-servers/code-quality
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
