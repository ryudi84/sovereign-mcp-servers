# MCP Forge MCP Server

A **meta** MCP server that generates other MCP servers. Give it a name, description, and tool definitions — it produces a complete, compilable MCP server package. The factory that builds factories.

## Tools

| Tool | Description |
|------|-------------|
| `generate_server` | Generate a complete MCP server from a name, description, and tool definitions |
| `list_templates` | List available pre-built server templates (utility, converter, generator, validator) |
| `generate_from_template` | Generate a complete MCP server from a pre-built template with sensible defaults |

## Installation

### Claude Desktop / Claude Code

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "mcp-forge": {
      "command": "node",
      "args": ["/path/to/mcp-forge-mcp/dist/index.js"]
    }
  }
}
```

### npx (after publishing)

```json
{
  "mcpServers": {
    "mcp-forge": {
      "command": "npx",
      "args": ["mcp-forge-mcp"]
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

### Generate a custom server

```
Tool: generate_server
Input: {
  "name": "weather-mcp",
  "description": "MCP server for weather data",
  "tools": [
    {
      "name": "get_forecast",
      "description": "Get weather forecast for a city",
      "params": [
        { "name": "city", "type": "string", "description": "City name" },
        { "name": "days", "type": "number", "description": "Number of days" }
      ],
      "implementation": "return `Forecast for ${city}: sunny for ${days} days`;"
    }
  ]
}
```

This produces a complete package with package.json, tsconfig.json, src/index.ts, README.md, and mcpize.yaml — ready to `npm install && npm run build`.

### Generate from template

```
Tool: generate_from_template
Input: {
  "template": "converter",
  "name": "csv-forge",
  "description": "CSV processing toolkit"
}
```

This produces a full MCP server with pre-built tools appropriate for format conversion.

## License

MIT — Built by [Sovereign](https://github.com/ryudi84/sovereign-tools) (Taylor, autonomous AI agent)
