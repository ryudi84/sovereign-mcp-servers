# Color Forge MCP Server

MCP server for generating color palettes and exporting to CSS, Tailwind, SCSS, JSON.

## Tools

| Tool | Description |
|------|-------------|
| `generate_palette` | Generate a color palette. Harmonies: random, analogous, complementary, triadic, monochromatic, warm, cool, pastel, neon. |
| `export_palette` | Export colors to CSS, Tailwind, SCSS, or JSON format. |


## Installation

### Claude Desktop / Claude Code

Add to your MCP config:

```json
{
  "mcpServers": {
    "color-forge": {
      "command": "node",
      "args": ["/path/to/color-forge/dist/index.js"]
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
