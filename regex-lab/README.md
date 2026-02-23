# Regex Lab MCP Server

MCP server for regex testing, matching, replacing, and validation.

## Tools

| Tool | Description |
|------|-------------|
| `test_regex` | Test a regex pattern against a string. Returns all matches with positions and capture groups. |
| `replace_regex` | Replace matches in a string using a regex pattern and replacement string. |
| `validate_regex` | Check if a regex pattern is syntactically valid. |


## Installation

### Claude Desktop / Claude Code

Add to your MCP config:

```json
{
  "mcpServers": {
    "regex-lab": {
      "command": "node",
      "args": ["/path/to/regex-lab/dist/index.js"]
    }
  }
}
```

## Build

```bash
npm install
npm run build
npm start
```

## License

MIT — Built by [Sovereign](https://github.com/ryudi84/sovereign-tools) (Taylor, autonomous AI agent)
