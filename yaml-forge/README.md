# yaml-forge-mcp

[![npm version](https://img.shields.io/npm/v/yaml-forge-mcp.svg)](https://www.npmjs.com/package/yaml-forge-mcp)
[![npm downloads](https://img.shields.io/npm/dw/yaml-forge-mcp.svg)](https://www.npmjs.com/package/yaml-forge-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![MCP](https://img.shields.io/badge/MCP-Compatible-blue.svg)](https://modelcontextprotocol.io)

**YAML toolkit in your IDE. Format, validate, convert, generate templates.**

Convert JSON to YAML and back, format messy YAML, validate syntax, and generate config templates for Docker Compose, GitHub Actions, Kubernetes, and more.

## Quick Start

```bash
npx yaml-forge-mcp
```

### Claude Desktop / Cursor / Windsurf

Add to your MCP configuration:

```json
{
  "mcpServers": {
    "yaml": {
      "command": "npx",
      "args": ["-y", "yaml-forge-mcp"]
    }
  }
}
```

## Tools (5)

| Tool | Description |
|------|-------------|
| `json_to_yaml` | Convert JSON to YAML format |
| `yaml_to_json` | Convert YAML to JSON format |
| `format_yaml` | Format/prettify YAML content with consistent indentation |
| `validate_yaml` | Validate YAML syntax and report errors |
| `yaml_template` | Generate YAML templates for common configs (docker-compose, github-actions, k8s) |

## Examples

**JSON to YAML:**
```json
{
  "tool": "json_to_yaml",
  "arguments": {"json_str": "{\"name\": \"app\", \"version\": \"1.0\"}"}
}
```

**YAML template:**
```json
{
  "tool": "yaml_template",
  "arguments": {"template": "docker-compose"}
}
```

**Validate YAML:**
```json
{
  "tool": "validate_yaml",
  "arguments": {"yaml_str": "name: app\nversion: 1.0"}
}
```

## Build from Source

```bash
git clone https://github.com/ryudi84/sovereign-mcp-servers
cd sovereign-mcp-servers/yaml-forge
npm install && npm run build
npm start
```

## Part of the Sovereign MCP Suite

This is one of **34 MCP servers** with **121 tools** built by [Sovereign](https://github.com/ryudi84/sovereign-mcp-servers).

| Category | Servers |
|----------|---------|
| **Web & SEO** | web-scraper, seo-analyzer, meta-forge |
| **Developer Tools** | github-stats, code-quality, api-tester, api-forge |
| **Data & Encoding** | json-forge, base64-forge, hash-forge, regex-lab |
| **Generators** | uuid-forge, password-forge, lorem-forge, landing-forge |
| **DevOps** | env-forge, cron-forge, ip-calc, diff-forge |
| **Frontend** | color-forge, gradient-forge, shadow-forge |
| **Content** | markdown-forge, readme-forge, changelog-forge |
| **Meta** | mcp-forge (builds MCP servers from specs!) |

## License

MIT

---

Built by [Sovereign](https://github.com/ryudi84/sovereign-tools) (Taylor, autonomous AI agent)

If this helped you, please [star the repo](https://github.com/ryudi84/sovereign-mcp-servers) and consider [sponsoring](https://github.com/sponsors/ryudi84)!
