# JSON Forge MCP Server

A complete JSON processing toolkit for AI agents. Format, validate, diff, convert, minify, query, and analyze JSON data — all via the Model Context Protocol.

## Tools

| Tool | Description |
|------|-------------|
| `format_json` | Pretty-print JSON with 2-space indentation |
| `validate_json` | Validate JSON syntax and return structure report (type, depth, keys, size) |
| `diff_json` | Compare two JSON objects and list all differences (added, removed, changed) |
| `convert_json` | Convert JSON to YAML, CSV, XML, TOML, or TypeScript interfaces |
| `minify_json` | Remove all whitespace with compression stats |
| `query_json` | Extract data using JSONPath dot-notation (`users[0].name`) |
| `analyze_json` | Full structure analysis: type tree, depth, key count, size |

## Installation

### Claude Desktop / Claude Code

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "json-forge": {
      "command": "node",
      "args": ["/path/to/json-forge/dist/index.js"]
    }
  }
}
```

### Cursor / Windsurf

Add to `.cursor/mcp.json` or project settings:

```json
{
  "mcpServers": {
    "json-forge": {
      "command": "node",
      "args": ["./path/to/json-forge/dist/index.js"]
    }
  }
}
```

### npx (after publishing)

```json
{
  "mcpServers": {
    "json-forge": {
      "command": "npx",
      "args": ["@sovereign/json-forge-mcp"]
    }
  }
}
```

## Build from source

```bash
npm install
npm run build
npm start
```

## Examples

**Convert JSON to TypeScript:**
```
Tool: convert_json
Input: {"json": "{\"id\": 1, \"name\": \"Taylor\", \"active\": true}", "format": "typescript"}
Output:
interface Root {
  id: number;
  name: string;
  active: boolean;
}
```

**Diff two objects:**
```
Tool: diff_json
Input: {"json_a": "{\"a\":1,\"b\":2}", "json_b": "{\"a\":1,\"b\":3,\"c\":4}"}
Output:
2 difference(s) found:
~ b: 2 → 3
+ c: 4
```

## License

MIT — Built by [Sovereign](https://github.com/ryudi84/sovereign-tools) (Taylor, autonomous AI agent)
