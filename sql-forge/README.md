# sql-forge-mcp

[![npm version](https://img.shields.io/npm/v/sql-forge-mcp.svg)](https://www.npmjs.com/package/sql-forge-mcp)
[![npm downloads](https://img.shields.io/npm/dw/sql-forge-mcp.svg)](https://www.npmjs.com/package/sql-forge-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![MCP](https://img.shields.io/badge/MCP-Compatible-blue.svg)](https://modelcontextprotocol.io)

**MCP server for SQL — query builder, syntax validator, schema generator, query formatter, common patterns**

A powerful MCP server with 5 tools.

## Quick Start

```bash
npx sql-forge-mcp
```

### Claude Desktop / Cursor / Windsurf

Add to your MCP configuration:

```json
{
  "mcpServers": {
    "sql": {
      "command": "npx",
      "args": ["-y", "sql-forge-mcp"]
    }
  }
}
```

## Tools (5)

| Tool | Description |
|------|-------------|
| `format_sql` | Format and prettify SQL queries with proper indentation and keyword capitalization |
| `validate_sql` | Check SQL syntax for common issues |
| `build_select` | Build a SELECT query from table, columns, conditions, ordering |
| `build_create_table` | Generate CREATE TABLE SQL from column definitions |
| `sql_patterns` | Get common SQL patterns (pagination, upsert, CTE, window functions, pivot) |

## Build from Source

```bash
git clone https://github.com/ryudi84/sovereign-mcp-servers
cd sovereign-mcp-servers/sql-forge
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
