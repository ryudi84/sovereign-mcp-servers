# json-forge-mcp

[![npm version](https://img.shields.io/npm/v/json-forge-mcp.svg)](https://www.npmjs.com/package/json-forge-mcp)
[![npm downloads](https://img.shields.io/npm/dw/json-forge-mcp.svg)](https://www.npmjs.com/package/json-forge-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![MCP](https://img.shields.io/badge/MCP-Compatible-blue.svg)](https://modelcontextprotocol.io)

**Swiss Army knife for JSON. Format, validate, diff, query, convert.**

7 powerful JSON tools in one server. Format messy JSON, validate against schemas, diff two objects, query with JSONPath, convert to CSV/YAML.

## Quick Start

```bash
npx json-forge-mcp
```

### Claude Desktop / Cursor / Windsurf

Add to your MCP configuration:

```json
{
  "mcpServers": {
    "json": {
      "command": "npx",
      "args": ["-y", "json-forge-mcp"]
    }
  }
}
```

## Tools (7)

| Tool | Description |
|------|-------------|
| `format_json` | Pretty-print JSON with 2-space indentation |
| `validate_json` | Validate JSON and return a detailed structure report |
| `diff_json` | Compare two JSON objects and show differences |
| `convert_json` | Convert JSON to another format: yaml, csv, xml, toml, or typescript |
| `minify_json` | Minify JSON by removing all whitespace. Returns minified output and compression stats. |
| `query_json` | Extract data from JSON using dot-notation path (e.g.  |
| `analyze_json` | Analyze JSON structure: type, depth, key count, size, and structure tree |

## Examples

**Format JSON:**
```json
{
  "tool": "json_format",
  "arguments": {"json": "{\"a\":1,\"b\":[2,3]}"}
}
```

**Diff objects:**
```json
{
  "tool": "json_diff",
  "arguments": {"json1": "{\"a\":1}", "json2": "{\"a\":2,\"b\":3}"}
}
```

## Build from Source

```bash
git clone https://github.com/ryudi84/sovereign-mcp-servers
cd sovereign-mcp-servers/json-forge
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
