# Changelog Forge MCP Server

MCP server for generating changelogs from conventional commits, parsing semver, and creating release notes.

## Tools

| Tool | Description |
|------|-------------|
| `parse_commits` | Parse conventional commit messages and categorize them (feat, fix, docs, chore, etc.). |
| `generate_changelog` | Generate a full CHANGELOG.md entry from commit messages. |
| `bump_version` | Suggest the next semver version based on commit types (major for breaking, minor for feat, patch for fix). |


## Installation

### Claude Desktop / Claude Code

Add to your MCP config:

```json
{
  "mcpServers": {
    "changelog-forge": {
      "command": "node",
      "args": ["/path/to/changelog-forge/dist/index.js"]
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
