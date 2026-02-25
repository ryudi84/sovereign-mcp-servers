# ip-calc-mcp

[![npm version](https://img.shields.io/npm/v/ip-calc-mcp.svg)](https://www.npmjs.com/package/ip-calc-mcp)
[![npm downloads](https://img.shields.io/npm/dw/ip-calc-mcp.svg)](https://www.npmjs.com/package/ip-calc-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![MCP](https://img.shields.io/badge/MCP-Compatible-blue.svg)](https://modelcontextprotocol.io)

**IP subnet calculator in your IDE. CIDR, ranges, masks.**

Calculate subnets, convert CIDR notation, check IP ranges.

## Quick Start

```bash
npx ip-calc-mcp
```

### Claude Desktop / Cursor / Windsurf

Add to your MCP configuration:

```json
{
  "mcpServers": {
    "ip-calc": {
      "command": "npx",
      "args": ["-y", "ip-calc-mcp"]
    }
  }
}
```

## Tools (3)

| Tool | Description |
|------|-------------|
| `analyze_ip` | Analyze an IP address — determine class, type (private/public/loopback/multicast), and binary representation. |
| `calculate_subnet` | Calculate subnet details from an IP/CIDR (e.g.  |
| `ip_in_range` | Check if an IP address falls within a CIDR range. |

## Examples

**Calculate subnet:**
```json
{
  "tool": "subnet_calc",
  "arguments": {"cidr": "192.168.1.0/24"}
}
```

## Build from Source

```bash
git clone https://github.com/ryudi84/sovereign-mcp-servers
cd sovereign-mcp-servers/ip-calc
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
