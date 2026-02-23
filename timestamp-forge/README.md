# Timestamp Forge MCP Server

MCP server for timestamp conversion, timezone handling, and date calculations.

## Tools

| Tool | Description |
|------|-------------|
| `current_time` | Get current time in multiple formats: Unix, UTC, ISO 8601, RFC 2822, SQL datetime. |
| `unix_to_human` | Convert Unix timestamp to human-readable formats. Auto-detects seconds vs milliseconds. |
| `date_diff` | Calculate the difference between two dates. |


## Installation

### Claude Desktop / Claude Code

Add to your MCP config:

```json
{
  "mcpServers": {
    "timestamp-forge": {
      "command": "node",
      "args": ["/path/to/timestamp-forge/dist/index.js"]
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
