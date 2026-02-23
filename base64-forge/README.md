# Base64 Forge MCP Server

MCP server for Base64, URL, and HTML encoding/decoding.

## Tools

| Tool | Description |
|------|-------------|
| `encode_base64` | Encode text to Base64. |
| `decode_base64` | Decode a Base64 string to plain text. |
| `encode_url` | URL-encode a string. |
| `decode_url` | Decode a URL-encoded string. |
| `encode_html` | Escape HTML special characters. |
| `decode_html` | Decode HTML entities to plain text. |


## Installation

### Claude Desktop / Claude Code

Add to your MCP config:

```json
{
  "mcpServers": {
    "base64-forge": {
      "command": "node",
      "args": ["/path/to/base64-forge/dist/index.js"]
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
