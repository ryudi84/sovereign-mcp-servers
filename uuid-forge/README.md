# Uuid Forge MCP Server

MCP server for generating UUIDs (v4, v7), ULIDs, nanoids, and random IDs. Every project needs unique identifiers.

## Tools

| Tool | Description |
|------|-------------|
| `generate_uuid_v4` | Generate one or more UUID v4 (random). Returns the most common ID format. |
| `generate_uuid_v7` | Generate UUID v7 (time-sortable, recommended for databases). Includes millisecond timestamp prefix. |
| `generate_nanoid` | Generate nanoid-style compact IDs. URL-safe, shorter than UUID. |
| `generate_ulid` | Generate ULID (Universally Unique Lexicographically Sortable Identifier). Great for distributed systems. |
| `parse_uuid` | Parse a UUID and extract version, variant, and timestamp (if v1/v7). |


## Installation

### Claude Desktop / Claude Code

Add to your MCP config:

```json
{
  "mcpServers": {
    "uuid-forge": {
      "command": "node",
      "args": ["/path/to/uuid-forge/dist/index.js"]
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
