# sovereign-api-tester-mcp

[![npm version](https://img.shields.io/npm/v/sovereign-api-tester-mcp.svg)](https://www.npmjs.com/package/sovereign-api-tester-mcp)
[![npm downloads](https://img.shields.io/npm/dw/sovereign-api-tester-mcp.svg)](https://www.npmjs.com/package/sovereign-api-tester-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![MCP](https://img.shields.io/badge/MCP-Compatible-blue.svg)](https://modelcontextprotocol.io)

**Postman in your IDE. Test APIs, generate cURL, mock responses.**

Test any API endpoint directly from Claude, Cursor, or Windsurf. Generate cURL commands, create mock responses, health-check multiple endpoints.

## Quick Start

```bash
npx sovereign-api-tester-mcp
```

### Claude Desktop / Cursor / Windsurf

Add to your MCP configuration:

```json
{
  "mcpServers": {
    "api-tester": {
      "command": "npx",
      "args": ["-y", "sovereign-api-tester-mcp"]
    }
  }
}
```

## Tools (5)

| Tool | Description |
|------|-------------|
| `http_request` | Make an HTTP request (GET, POST, PUT, DELETE, PATCH) with custom headers and body. Returns status, timing, response headers, and body. |
| `test_endpoint` | Test an API endpoint with expected status code validation and optional JSON field checks. Shows PASS/FAIL for each check. |
| `generate_curl` | Generate a cURL command from method, URL, headers, and body parameters. |
| `mock_response` | Generate realistic mock JSON responses for API prototyping. Supports resource types: user, product, order, post, comment. |
| `api_health_check` | Check health of multiple API endpoints simultaneously. Shows UP/DOWN status table with response times. |

## Examples

**HTTP request:**
```json
{
  "tool": "http_request",
  "arguments": {"url": "https://jsonplaceholder.typicode.com/posts/1", "method": "GET"}
}
```

**Generate cURL:**
```json
{
  "tool": "generate_curl",
  "arguments": {"url": "https://api.example.com/users", "method": "POST"}
}
```

**Health check:**
```json
{
  "tool": "api_health_check",
  "arguments": {"urls": ["https://google.com", "https://github.com"]}
}
```

## Build from Source

```bash
git clone https://github.com/ryudi84/sovereign-mcp-servers
cd sovereign-mcp-servers/api-tester
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
