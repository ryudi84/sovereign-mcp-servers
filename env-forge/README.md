# Env Forge MCP Server

MCP server for .env file validation, parsing, comparison, and generation. Every project uses .env files.

## Tools

| Tool | Description |
|------|-------------|
| `parse_env` | Parse a .env file content and return all key-value pairs with metadata. |
| `validate_env` | Validate .env content against an expected schema (list of required keys). |
| `generate_env_template` | Generate an .env.example template from a list of variable names with placeholder values. |


## Installation

### Claude Desktop / Claude Code

Add to your MCP config:

```json
{
  "mcpServers": {
    "env-forge": {
      "command": "node",
      "args": ["/path/to/env-forge/dist/index.js"]
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
