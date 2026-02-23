# Cron Forge MCP Server

MCP server for cron expression parsing, validation, human-readable explanation, and next run calculations.

## Tools

| Tool | Description |
|------|-------------|
| `explain_cron` | Explain a cron expression in human-readable English. |
| `next_cron_runs` | Calculate the next N run times for a cron expression. |
| `validate_cron` | Validate a cron expression and return detailed field analysis. |


## Installation

### Claude Desktop / Claude Code

Add to your MCP config:

```json
{
  "mcpServers": {
    "cron-forge": {
      "command": "node",
      "args": ["/path/to/cron-forge/dist/index.js"]
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
