#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";



// === MCP Server Setup ===

const server = new McpServer(
  { name: "ip-calc", version: "1.0.0" },
  {
    capabilities: { tools: {} },
    instructions: "MCP server for IP address calculations — subnet masks, CIDR notation, IP ranges, network analysis. Zero external deps.",
  }
);

// Tool: analyze_ip
server.tool(
  "analyze_ip",
  "Analyze an IP address — determine class, type (private/public/loopback/multicast), and binary representation.",
  {
    ip: z.string().describe("IPv4 address (e.g. '192.168.1.1')")
  },
  async ({ ip }) => {
    try {
      const parts = ip.split(".").map(Number);
      if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 255))
        return { content: [{ type: "text", text: "Invalid IPv4 address" }], isError: true };
      const [a, b] = parts;
      let ipClass = "Unknown", type = "Public";
      if (a >= 1 && a <= 126) ipClass = "A";
      else if (a >= 128 && a <= 191) ipClass = "B";
      else if (a >= 192 && a <= 223) ipClass = "C";
      else if (a >= 224 && a <= 239) ipClass = "D (Multicast)";
      else if (a >= 240) ipClass = "E (Reserved)";
      if (a === 10) type = "Private (10.0.0.0/8)";
      else if (a === 172 && b >= 16 && b <= 31) type = "Private (172.16.0.0/12)";
      else if (a === 192 && b === 168) type = "Private (192.168.0.0/16)";
      else if (a === 127) type = "Loopback";
      else if (a === 169 && b === 254) type = "Link-Local";
      else if (a >= 224 && a <= 239) type = "Multicast";
      const binary = parts.map(p => p.toString(2).padStart(8, "0")).join(".");
      const hex = parts.map(p => p.toString(16).padStart(2, "0")).join(":");
      const info = [`IP: ${ip}`, `Class: ${ipClass}`, `Type: ${type}`, `Binary: ${binary}`, `Hex: ${hex}`, `Decimal: ${parts.reduce((acc, p, i) => acc + p * Math.pow(256, 3 - i), 0)}`];
      return { content: [{ type: "text", text: info.join("\n") }] };
    } catch (e: unknown) {
      return { content: [{ type: "text", text: `Error: ${(e as Error).message}` }], isError: true };
    }
  }
);

// Tool: calculate_subnet
server.tool(
  "calculate_subnet",
  "Calculate subnet details from an IP/CIDR (e.g. '192.168.1.0/24'). Returns network, broadcast, host range, usable hosts.",
  {
    cidr: z.string().describe("IP address with CIDR notation (e.g. '192.168.1.0/24')")
  },
  async ({ cidr }) => {
    try {
      const [ipStr, prefixStr] = cidr.split("/");
      const prefix = parseInt(prefixStr);
      if (!ipStr || isNaN(prefix) || prefix < 0 || prefix > 32)
        return { content: [{ type: "text", text: "Invalid CIDR notation. Use format: 192.168.1.0/24" }], isError: true };
      const parts = ipStr.split(".").map(Number);
      if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 255))
        return { content: [{ type: "text", text: "Invalid IP address" }], isError: true };
      const ipNum = parts.reduce((acc, p, i) => acc + (p << (24 - i * 8)), 0) >>> 0;
      const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
      const network = (ipNum & mask) >>> 0;
      const broadcast = (network | (~mask >>> 0)) >>> 0;
      const firstHost = prefix >= 31 ? network : (network + 1) >>> 0;
      const lastHost = prefix >= 31 ? broadcast : (broadcast - 1) >>> 0;
      const totalHosts = prefix >= 31 ? (prefix === 32 ? 1 : 2) : Math.pow(2, 32 - prefix) - 2;
      const toIP = (n: number) => [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join(".");
      const toMask = (n: number) => toIP(n);
      const info = [
        `CIDR: ${cidr}`,
        `Network: ${toIP(network)}`,
        `Broadcast: ${toIP(broadcast)}`,
        `Subnet Mask: ${toMask(mask)}`,
        `Wildcard: ${toMask(~mask >>> 0)}`,
        `First Host: ${toIP(firstHost)}`,
        `Last Host: ${toIP(lastHost)}`,
        `Total Usable Hosts: ${totalHosts}`,
        `Prefix: /${prefix}`,
      ];
      return { content: [{ type: "text", text: info.join("\n") }] };
    } catch (e: unknown) {
      return { content: [{ type: "text", text: `Error: ${(e as Error).message}` }], isError: true };
    }
  }
);

// Tool: ip_in_range
server.tool(
  "ip_in_range",
  "Check if an IP address falls within a CIDR range.",
  {
    ip: z.string().describe("IP to check"),
    cidr: z.string().describe("CIDR range (e.g. '10.0.0.0/8')")
  },
  async ({ ip, cidr }) => {
    try {
      const [rangeIp, prefixStr] = cidr.split("/");
      const prefix = parseInt(prefixStr);
      const toNum = (s: string) => s.split(".").map(Number).reduce((a, p, i) => a + (p << (24 - i * 8)), 0) >>> 0;
      const ipNum = toNum(ip);
      const rangeNum = toNum(rangeIp);
      const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
      const inRange = (ipNum & mask) === (rangeNum & mask);
      return { content: [{ type: "text", text: inRange ? `YES - ${ip} is within ${cidr}` : `NO - ${ip} is NOT within ${cidr}` }] };
    } catch (e: unknown) {
      return { content: [{ type: "text", text: `Error: ${(e as Error).message}` }], isError: true };
    }
  }
);

// === Smithery sandbox support ===
export function createSandboxServer() {
  return server;
}

// === Start Server ===
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

// Only auto-start when run directly
const isDirectRun = !process.env.SMITHERY_SCAN;
if (isDirectRun) {
  main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
}
