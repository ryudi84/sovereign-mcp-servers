# Hash Forge MCP Server

MCP server for hashing text with MD5, SHA-1, SHA-256, SHA-384, SHA-512 and HMAC generation.

## Tools

| Tool | Description |
|------|-------------|
| `hash_text` | Hash text with all algorithms: MD5, SHA-1, SHA-256, SHA-384, SHA-512. |
| `compute_hmac` | Generate an HMAC signature. |
| `compare_hashes` | Compare two hash strings (case-insensitive). |


## Installation

### Claude Desktop / Claude Code

Add to your MCP config:

```json
{
  "mcpServers": {
    "hash-forge": {
      "command": "node",
      "args": ["/path/to/hash-forge/dist/index.js"]
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
