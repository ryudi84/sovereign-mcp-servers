# Markdown Forge MCP Server

MCP server for markdown processing — generate tables, TOC, convert to HTML, format badges, create link references.

## Tools

| Tool | Description |
|------|-------------|
| `generate_table` | Generate a markdown table from headers and rows. |
| `generate_toc` | Generate a table of contents from markdown headings. |
| `generate_badges` | Generate shields.io markdown badges for a project. |
| `markdown_to_html` | Convert basic markdown to HTML (headings, bold, italic, code, links, lists, paragraphs). |


## Installation

### Claude Desktop / Claude Code

Add to your MCP config:

```json
{
  "mcpServers": {
    "markdown-forge": {
      "command": "node",
      "args": ["/path/to/markdown-forge/dist/index.js"]
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
