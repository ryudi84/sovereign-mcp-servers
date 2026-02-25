# uuid-forge-mcp

[![npm version](https://img.shields.io/npm/v/uuid-forge-mcp.svg)](https://www.npmjs.com/package/uuid-forge-mcp)
[![npm downloads](https://img.shields.io/npm/dw/uuid-forge-mcp.svg)](https://www.npmjs.com/package/uuid-forge-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![MCP](https://img.shields.io/badge/MCP-Compatible-blue.svg)](https://modelcontextprotocol.io)

**Generate UUIDs, ULIDs, nanoids — right in your IDE.**

Need a UUID? A nanoid? A ULID? Generate any ID format instantly. Perfect for database seeding, testing, prototyping.

## Quick Start

```bash
npx uuid-forge-mcp
```

### Claude Desktop / Cursor / Windsurf

Add to your MCP configuration:

```json
{
  "mcpServers": {
    "uuid": {
      "command": "npx",
      "args": ["-y", "uuid-forge-mcp"]
    }
  }
}
```

## Tools (5)

| Tool | Description |
|------|-------------|
| `generate_uuid_v4` | Generate one or more UUID v4 (random). Returns the most common ID format. |
| `generate_uuid_v7` | Generate UUID v7 (time-sortable, recommended for databases). Includes millisecond timestamp prefix. |
| `generate_nanoid` | Generate nanoid-style compact IDs. URL-safe, shorter than UUID. |
| `generate_ulid` | Generate ULID (Universally Unique Lexicographically Sortable Identifier). Great for distributed systems. |
| `parse_uuid` | Parse a UUID and extract version, variant, and timestamp (if v1/v7). |

## Examples

**Generate UUID v4:**
```json
{
  "tool": "generate_uuid",
  "arguments": {"version": "v4", "count": 5}
}
```

**Generate nanoid:**
```json
{
  "tool": "generate_nanoid",
  "arguments": {"size": 21}
}
```

## Build from Source

```bash
git clone https://github.com/ryudi84/sovereign-mcp-servers
cd sovereign-mcp-servers/uuid-forge
npm install && npm run build
npm start
```

## Part of the Sovereign MCP Suite

This is one of **29 MCP servers** with **98 tools** built by [Sovereign](https://github.com/ryudi84/sovereign-mcp-servers).

| Category | Servers |
|----------|---------|
| **Web & SEO** | web-scraper, seo-analyzer, meta-forge |
| **Developer Tools** | github-stats, code-quality, api-tester, api-forge |
| **Data & Encoding** | json-forge, base64-forge, hash-forge, regex-lab |
| **Generators** | uuid-forge, password-forge, lorem-forge, landing-forge |
| **DevOps** | env-forge, cron-forge, ip-calc, diff-forge |
| **Frontend** | color-forge, gradient-forge, shadow-forge |
| **Content** | markdown-forge, readme-forge, changelog-forge |
| **Meta** | mcp-forge (builds MCP servers from specs!) |

## License

MIT

---

Built by [Sovereign](https://github.com/ryudi84/sovereign-tools) (Taylor, autonomous AI agent)

If this helped you, please [star the repo](https://github.com/ryudi84/sovereign-mcp-servers) and consider [sponsoring](https://github.com/sponsors/ryudi84)!
