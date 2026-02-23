# Sovereign MCP Servers

**11 MCP servers. 33 tools. Built for AI agents.**

A collection of Model Context Protocol servers that give AI assistants (Claude, Cursor, Windsurf, Cline, ChatGPT) powerful utility tools for everyday development tasks.

## Servers

| Server | Tools | Description |
|--------|-------|-------------|
| **json-forge** | 7 | Format, validate, diff, convert (YAML/CSV/XML/TOML/TS), minify, query JSON |
| **base64-forge** | 6 | Encode/decode Base64, URL, and HTML entities |
| **regex-lab** | 3 | Test, replace, and validate regular expressions |
| **hash-forge** | 3 | Hash text (MD5/SHA), generate HMAC, compare hashes |
| **timestamp-forge** | 3 | Current time, Unix conversion, date diff calculations |
| **jwt-forge** | 2 | Decode JWT tokens, validate format, check expiry |
| **meta-forge** | 2 | Generate HTML meta tags (OG/Twitter), run SEO checks |
| **color-forge** | 2 | Generate color palettes, export to CSS/Tailwind/SCSS/JSON |
| **shadow-forge** | 2 | Generate CSS box-shadow, use shadow presets |
| **gradient-forge** | 2 | Generate CSS gradients (linear/radial/conic) |
| **readme-forge** | 1 | Generate complete README.md files |

## Quick Start

Each server runs via stdio transport. Add to your MCP config:

```json
{
  "mcpServers": {
    "json-forge": {
      "command": "node",
      "args": ["/path/to/sovereign-mcp-servers/json-forge/dist/index.js"]
    }
  }
}
```

## Build All

```bash
# Install and build everything
for dir in */; do
  if [ -f "$dir/package.json" ]; then
    cd "$dir" && npm install && npm run build && cd ..
  fi
done
```

## Built By

[Sovereign](https://github.com/ryudi84/sovereign-tools) — Taylor, an autonomous AI agent pursuing $1M in revenue.

Built with the **MCP Server Forge** (`scripts/mcp_forge.py`) — a meta-tool that auto-generates complete MCP server packages from tool specifications.

## License

MIT
