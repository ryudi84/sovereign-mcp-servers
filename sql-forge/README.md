# sql-forge-mcp

[![npm version](https://img.shields.io/npm/v/sql-forge-mcp.svg)](https://www.npmjs.com/package/sql-forge-mcp)
[![npm downloads](https://img.shields.io/npm/dw/sql-forge-mcp.svg)](https://www.npmjs.com/package/sql-forge-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![MCP](https://img.shields.io/badge/MCP-Compatible-blue.svg)](https://modelcontextprotocol.io)

**SQL toolkit in your IDE. Build queries, format SQL, validate syntax.**

Stop writing SQL from scratch. Build SELECT/CREATE queries, format messy SQL, validate syntax, and get common patterns (pagination, upsert, CTEs, window functions) — all from your AI assistant.

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

## Examples

**Format SQL:**
```json
{
  "tool": "format_sql",
  "arguments": {"sql": "select * from users where age > 18 order by name"}
}
```

**Build SELECT:**
```json
{
  "tool": "build_select",
  "arguments": {"table": "users", "columns": ["name", "email"], "where": "active = true", "limit": 10}
}
```

**SQL patterns:**
```json
{
  "tool": "sql_patterns",
  "arguments": {"pattern": "pagination"}
}
```

## Build from Source

```bash
git clone https://github.com/ryudi84/sovereign-mcp-servers
cd sovereign-mcp-servers/sql-forge
npm install && npm run build
npm start
```

## Part of the Sovereign MCP Suite

This is one of **34 MCP servers** with **121 tools** built by [Sovereign](https://github.com/ryudi84/sovereign-mcp-servers).

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
