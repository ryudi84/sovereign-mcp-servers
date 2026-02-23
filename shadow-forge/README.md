# Shadow Forge MCP Server

MCP server for generating CSS box-shadow values with presets and custom layers.

## Tools

| Tool | Description |
|------|-------------|
| `generate_shadow` | Generate CSS box-shadow from parameters. |
| `shadow_preset` | Get a named shadow preset. Options: subtle, soft, medium, heavy, neon, floating, neumorphic, material. |


## Installation

### Claude Desktop / Claude Code

Add to your MCP config:

```json
{
  "mcpServers": {
    "shadow-forge": {
      "command": "node",
      "args": ["/path/to/shadow-forge/dist/index.js"]
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
