# Diff Forge MCP Server

MCP server for computing text diffs, comparing strings, and generating unified diff output.

## Tools

| Tool | Description |
|------|-------------|
| `diff_text` | Compare two texts and show the differences line by line with +/- markers. |
| `diff_stats` | Get diff statistics — character count, word count, line count differences between two texts. |


## Installation

### Claude Desktop / Claude Code

Add to your MCP config:

```json
{
  "mcpServers": {
    "diff-forge": {
      "command": "node",
      "args": ["/path/to/diff-forge/dist/index.js"]
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
