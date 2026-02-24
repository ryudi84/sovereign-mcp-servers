# Sovereign MCP Servers

**21 MCP servers. 64 tools. Built for AI agents.**

The largest open-source collection of developer utility MCP servers. Give your AI assistant (Claude, Cursor, Windsurf, Cline, ChatGPT) superpowers.

Zero external API keys. Zero configuration. Just install and use.

## Servers

| Server | Tools | Description |
|--------|-------|-------------|
| **json-forge** | 7 | Format, validate, diff, convert (YAML/CSV/XML/TOML/TS), minify, query JSON |
| **base64-forge** | 6 | Encode/decode Base64, URL, and HTML entities |
| **uuid-forge** | 5 | Generate UUID v4/v7, ULID, nanoid, parse UUIDs |
| **markdown-forge** | 4 | Generate tables, TOC, badges, convert to HTML |
| **ip-calc** | 3 | IP analysis, subnet calculator, CIDR range check |
| **password-forge** | 3 | Secure passwords, XKCD passphrases, strength checker |
| **regex-lab** | 3 | Test, replace, and validate regular expressions |
| **hash-forge** | 3 | Hash text (MD5/SHA), generate HMAC, compare hashes |
| **timestamp-forge** | 3 | Current time, Unix conversion, date diff calculations |
| **lorem-forge** | 3 | Lorem ipsum, fake data (names/emails/phones), mock JSON |
| **cron-forge** | 3 | Explain cron expressions, next runs, validate syntax |
| **changelog-forge** | 3 | Parse conventional commits, generate changelogs, bump versions |
| **env-forge** | 3 | Parse .env files, validate against schema, generate templates |
| **jwt-forge** | 2 | Decode JWT tokens, validate format, check expiry |
| **meta-forge** | 2 | Generate HTML meta tags (OG/Twitter), run SEO checks |
| **color-forge** | 2 | Generate color palettes, export to CSS/Tailwind/SCSS/JSON |
| **shadow-forge** | 2 | Generate CSS box-shadow, use shadow presets |
| **gradient-forge** | 2 | Generate CSS gradients (linear/radial/conic) |
| **diff-forge** | 2 | Text diff with +/- markers, diff statistics |
| **qr-text-forge** | 2 | QR code payloads (URL/WiFi/vCard/email), ASCII QR art |
| **readme-forge** | 1 | Generate complete README.md files |

## Quick Start

### Via npx (easiest)

Add to your Claude Desktop config (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "json-forge": { "command": "npx", "args": ["json-forge-mcp"] },
    "hash-forge": { "command": "npx", "args": ["hash-forge-mcp"] },
    "regex-lab": { "command": "npx", "args": ["regex-lab-mcp"] }
  }
}
```

All 21 servers are on npm: `npx <server-name>-mcp`

### Via MCPize (cloud-hosted)

13 servers available on [MCPize](https://mcpize.com) — no install needed:
- https://mcpize.com/mcp/json-forge-mcp
- https://mcpize.com/mcp/password-forge-mcp
- https://mcpize.com/mcp/cron-forge-mcp
- And 10 more...

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
