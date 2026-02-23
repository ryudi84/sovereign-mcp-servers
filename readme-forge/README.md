# Readme Forge MCP Server

MCP server for generating professional README.md files from project details.

## Tools

| Tool | Description |
|------|-------------|
| `generate_readme` | Generate a complete README.md for a project. |


## Installation

### Claude Desktop / Claude Code

Add to your MCP config:

```json
{
  "mcpServers": {
    "readme-forge": {
      "command": "node",
      "args": ["/path/to/readme-forge/dist/index.js"]
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
