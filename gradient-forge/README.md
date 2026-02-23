# Gradient Forge MCP Server

MCP server for generating CSS gradients (linear, radial, conic) with presets.

## Tools

| Tool | Description |
|------|-------------|
| `generate_gradient` | Generate a CSS gradient. |
| `random_gradient` | Generate a random beautiful gradient. |


## Installation

### Claude Desktop / Claude Code

Add to your MCP config:

```json
{
  "mcpServers": {
    "gradient-forge": {
      "command": "node",
      "args": ["/path/to/gradient-forge/dist/index.js"]
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
