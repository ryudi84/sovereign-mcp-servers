# Password Forge MCP Server

MCP server for generating secure passwords, passphrases, and checking password strength. Zero external deps.

## Tools

| Tool | Description |
|------|-------------|
| `generate_password` | Generate a cryptographically secure random password. |
| `generate_passphrase` | Generate a memorable passphrase from random words (XKCD-style). |
| `check_strength` | Analyze password strength — length, charset diversity, entropy estimate, and tips. |


## Installation

### Claude Desktop / Claude Code

Add to your MCP config:

```json
{
  "mcpServers": {
    "password-forge": {
      "command": "node",
      "args": ["/path/to/password-forge/dist/index.js"]
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
