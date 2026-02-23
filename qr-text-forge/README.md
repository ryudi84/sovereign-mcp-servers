# Qr Text Forge MCP Server

MCP server for generating QR code data, encoding URLs, and creating vCard/WiFi/email QR payloads. Returns text-based QR representations.

## Tools

| Tool | Description |
|------|-------------|
| `generate_qr_payload` | Generate a QR code payload for various data types — URL, WiFi, vCard, email, phone, SMS, geo location. |
| `ascii_qr` | Generate a simple ASCII art QR-like representation of text data. Good for terminal display. |


## Installation

### Claude Desktop / Claude Code

Add to your MCP config:

```json
{
  "mcpServers": {
    "qr-text-forge": {
      "command": "node",
      "args": ["/path/to/qr-text-forge/dist/index.js"]
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
