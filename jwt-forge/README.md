# Jwt Forge MCP Server

MCP server for decoding, analyzing, and validating JWT tokens.

## Tools

| Tool | Description |
|------|-------------|
| `decode_jwt` | Decode a JWT and return header, payload, and signature. |
| `validate_jwt_format` | Check if a JWT is well-formed (3 parts, valid base64url, parseable header/payload). |


## Installation

### Claude Desktop / Claude Code

Add to your MCP config:

```json
{
  "mcpServers": {
    "jwt-forge": {
      "command": "node",
      "args": ["/path/to/jwt-forge/dist/index.js"]
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
