# Ip Calc MCP Server

MCP server for IP address calculations — subnet masks, CIDR notation, IP ranges, network analysis. Zero external deps.

## Tools

| Tool | Description |
|------|-------------|
| `analyze_ip` | Analyze an IP address — determine class, type (private/public/loopback/multicast), and binary representation. |
| `calculate_subnet` | Calculate subnet details from an IP/CIDR (e.g. '192.168.1.0/24'). Returns network, broadcast, host range, usable hosts. |
| `ip_in_range` | Check if an IP address falls within a CIDR range. |


## Installation

### Claude Desktop / Claude Code

Add to your MCP config:

```json
{
  "mcpServers": {
    "ip-calc": {
      "command": "node",
      "args": ["/path/to/ip-calc/dist/index.js"]
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
