# Meta Forge MCP Server

MCP server for generating HTML meta tags (Open Graph, Twitter Card, SEO) and running SEO checks.

## Tools

| Tool | Description |
|------|-------------|
| `generate_meta_tags` | Generate complete HTML meta tags for SEO, Open Graph, and Twitter Card. |
| `check_seo` | Run an SEO checklist on meta tag values. Returns pass/fail for title length, description length, etc. |


## Installation

### Claude Desktop / Claude Code

Add to your MCP config:

```json
{
  "mcpServers": {
    "meta-forge": {
      "command": "node",
      "args": ["/path/to/meta-forge/dist/index.js"]
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
