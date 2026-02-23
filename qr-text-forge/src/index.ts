#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";



// === MCP Server Setup ===

const server = new McpServer(
  { name: "qr-text-forge", version: "1.0.0" },
  {
    capabilities: { tools: {} },
    instructions: "MCP server for generating QR code data, encoding URLs, and creating vCard/WiFi/email QR payloads. Returns text-based QR representations.",
  }
);

// Tool: generate_qr_payload
server.tool(
  "generate_qr_payload",
  "Generate a QR code payload for various data types — URL, WiFi, vCard, email, phone, SMS, geo location.",
  {
    type: z.enum(["url", "wifi", "vcard", "email", "phone", "sms", "geo"]).default("url").describe("QR code type"),
    data: z.string().describe("Primary data (URL, phone number, etc.)"),
    extra: z.string().default("").describe("Extra params: wifi='ssid,password,WPA' | vcard='name,org,email' | email='subject,body' | sms='message' | geo='lat,lon'")
  },
  async ({ type, data, extra }) => {
    try {
      let payload = "";
      switch (type) {
        case "url": payload = data.startsWith("http") ? data : `https://${data}`; break;
        case "wifi": {
          const [ssid, pass, auth] = (extra || data).split(",");
          payload = `WIFI:T:${auth || "WPA"};S:${ssid || data};P:${pass || ""};;`;
          break;
        }
        case "vcard": {
          const [name, org, email] = extra.split(",");
          payload = `BEGIN:VCARD\nVERSION:3.0\nN:${name || data}\nORG:${org || ""}\nEMAIL:${email || ""}\nTEL:${data}\nEND:VCARD`;
          break;
        }
        case "email": {
          const [subject, body] = extra.split(",");
          payload = `mailto:${data}?subject=${encodeURIComponent(subject || "")}&body=${encodeURIComponent(body || "")}`;
          break;
        }
        case "phone": payload = `tel:${data}`; break;
        case "sms": payload = `sms:${data}${extra ? `?body=${encodeURIComponent(extra)}` : ""}`; break;
        case "geo": {
          const [lat, lon] = data.split(",");
          payload = `geo:${lat},${lon}`;
          break;
        }
      }
      return { content: [{ type: "text", text: `QR Payload (${type}):\n${payload}\n\nUse this payload with any QR generator to create a scannable code.` }] };
    } catch (e: unknown) {
      return { content: [{ type: "text", text: `Error: ${(e as Error).message}` }], isError: true };
    }
  }
);

// Tool: ascii_qr
server.tool(
  "ascii_qr",
  "Generate a simple ASCII art QR-like representation of text data. Good for terminal display.",
  {
    text: z.string().describe("Text to encode")
  },
  async ({ text }) => {
    try {
      // Simple visual hash representation (not a real QR code, but useful for identification)
      const hash = Array.from(text).reduce((h, c) => ((h << 5) - h + c.charCodeAt(0)) | 0, 0);
      const size = 11;
      const grid: string[][] = [];
      for (let y = 0; y < size; y++) {
        grid[y] = [];
        for (let x = 0; x < size; x++) {
          // Fixed patterns for QR-like corners
          if ((x < 3 && y < 3) || (x >= size - 3 && y < 3) || (x < 3 && y >= size - 3)) {
            grid[y][x] = (x === 1 && y === 1) || (x === size - 2 && y === 1) || (x === 1 && y === size - 2) ? "##" : "  ";
            if (x === 0 || x === 2 || y === 0 || y === 2) grid[y][x] = "##";
            if (x >= size - 3) { if (x === size - 1 || x === size - 3 || y === 0 || y === 2) grid[y][x] = "##"; }
            if (y >= size - 3) { if (x === 0 || x === 2 || y === size - 1 || y === size - 3) grid[y][x] = "##"; }
          } else {
            const seed = (hash + x * 17 + y * 31 + x * y) & 0xff;
            grid[y][x] = seed % 3 === 0 ? "##" : "  ";
          }
        }
      }
      const art = grid.map(row => row.join("")).join("\n");
      return { content: [{ type: "text", text: `Data: ${text}\n\n${art}\n\n(Visual hash — use generate_qr_payload for actual QR data)` }] };
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
