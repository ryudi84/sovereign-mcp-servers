# Lorem Forge MCP Server

MCP server for generating placeholder data — lorem ipsum, fake names, emails, addresses, phone numbers, company names. Zero external deps.

## Tools

| Tool | Description |
|------|-------------|
| `generate_lorem` | Generate lorem ipsum text. Choose paragraphs, sentences, or words. |
| `generate_fake_data` | Generate fake placeholder data — names, emails, phone numbers, addresses, companies. Great for testing. |
| `generate_json_data` | Generate an array of fake JSON objects with specified fields. Perfect for API mocking. |


## Installation

### Claude Desktop / Claude Code

Add to your MCP config:

```json
{
  "mcpServers": {
    "lorem-forge": {
      "command": "node",
      "args": ["/path/to/lorem-forge/dist/index.js"]
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
