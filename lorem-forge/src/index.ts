#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import * as crypto from "crypto";

// === MCP Server Setup ===

const server = new McpServer(
  { name: "lorem-forge", version: "1.0.0" },
  {
    capabilities: { tools: {} },
    instructions: "MCP server for generating placeholder data — lorem ipsum, fake names, emails, addresses, phone numbers, company names. Zero external deps.",
  }
);

// Tool: generate_lorem
server.tool(
  "generate_lorem",
  "Generate lorem ipsum text. Choose paragraphs, sentences, or words.",
  {
    unit: z.enum(["paragraphs", "sentences", "words"]).default("paragraphs").describe("Unit of text"),
    count: z.number().min(1).max(50).default(3).describe("Number of units")
  },
  async ({ unit, count }) => {
    try {
      const words = ["lorem","ipsum","dolor","sit","amet","consectetur","adipiscing","elit","sed","do","eiusmod","tempor","incididunt","ut","labore","et","dolore","magna","aliqua","enim","ad","minim","veniam","quis","nostrud","exercitation","ullamco","laboris","nisi","aliquip","ex","ea","commodo","consequat","duis","aute","irure","in","reprehenderit","voluptate","velit","esse","cillum","fugiat","nulla","pariatur","excepteur","sint","occaecat","cupidatat","non","proident","sunt","culpa","qui","officia","deserunt","mollit","anim","id","est","laborum","porta","nibh","venenatis","cras","ornare","arcu","dui","vivamus"];
      const pick = () => words[Math.floor(Math.random() * words.length)];
      const sentence = () => { const len = 8 + Math.floor(Math.random() * 12); const s = Array.from({length: len}, pick).join(" "); return s.charAt(0).toUpperCase() + s.slice(1) + "."; };
      const paragraph = () => Array.from({length: 3 + Math.floor(Math.random() * 4)}, sentence).join(" ");
      let result = "";
      switch (unit) {
        case "words": result = Array.from({length: count}, pick).join(" "); break;
        case "sentences": result = Array.from({length: count}, sentence).join(" "); break;
        case "paragraphs": result = Array.from({length: count}, paragraph).join("\n\n"); break;
      }
      return { content: [{ type: "text", text: result }] };
    } catch (e: unknown) {
      return { content: [{ type: "text", text: `Error: ${(e as Error).message}` }], isError: true };
    }
  }
);

// Tool: generate_fake_data
server.tool(
  "generate_fake_data",
  "Generate fake placeholder data — names, emails, phone numbers, addresses, companies. Great for testing.",
  {
    type: z.enum(["name", "email", "phone", "address", "company", "url", "ip", "date"]).default("name").describe("Type of fake data"),
    count: z.number().min(1).max(50).default(5).describe("Number of items")
  },
  async ({ type, count }) => {
    try {
      const firstNames = ["James","Mary","John","Patricia","Robert","Jennifer","Michael","Linda","David","Elizabeth","William","Barbara","Richard","Susan","Joseph","Jessica","Thomas","Sarah","Charles","Karen"];
      const lastNames = ["Smith","Johnson","Williams","Brown","Jones","Garcia","Miller","Davis","Rodriguez","Martinez","Hernandez","Lopez","Gonzalez","Wilson","Anderson","Thomas","Taylor","Moore","Jackson","Martin"];
      const domains = ["gmail.com","yahoo.com","outlook.com","company.io","example.com","mail.org","proton.me"];
      const streets = ["Main St","Oak Ave","Elm Blvd","Park Dr","Cedar Ln","Maple Rd","Pine Way","Lake Dr"];
      const cities = ["New York","Los Angeles","Chicago","Houston","Phoenix","San Antonio","San Diego","Dallas","Austin","Miami"];
      const companies = ["Acme Corp","TechFlow Inc","DataSync Labs","CloudPeak","NexGen Solutions","Quantum Dynamics","InnoVerse","CyberNova","PulseWave","ZenithAI"];
      const r = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
      const rn = (min: number, max: number) => min + Math.floor(Math.random() * (max - min));
      const items: string[] = [];
      for (let i = 0; i < count; i++) {
        switch (type) {
          case "name": items.push(`${r(firstNames)} ${r(lastNames)}`); break;
          case "email": items.push(`${r(firstNames).toLowerCase()}${rn(1,99)}@${r(domains)}`); break;
          case "phone": items.push(`+1-${rn(200,999)}-${rn(200,999)}-${rn(1000,9999)}`); break;
          case "address": items.push(`${rn(100,9999)} ${r(streets)}, ${r(cities)}, ${rn(10000,99999)}`); break;
          case "company": items.push(r(companies)); break;
          case "url": items.push(`https://${r(["www","app","api","dev"])}.${r(lastNames).toLowerCase()}.${r(["com","io","dev","app"])}`); break;
          case "ip": items.push(`${rn(1,255)}.${rn(0,255)}.${rn(0,255)}.${rn(1,255)}`); break;
          case "date": { const d = new Date(Date.now() - rn(0, 365*5) * 86400000); items.push(d.toISOString().split("T")[0]); break; }
        }
      }
      return { content: [{ type: "text", text: items.join("\n") }] };
    } catch (e: unknown) {
      return { content: [{ type: "text", text: `Error: ${(e as Error).message}` }], isError: true };
    }
  }
);

// Tool: generate_json_data
server.tool(
  "generate_json_data",
  "Generate an array of fake JSON objects with specified fields. Perfect for API mocking.",
  {
    fields: z.string().describe("Comma-separated field:type pairs. Types: name,email,phone,number,boolean,date,id. E.g. 'name:name,email:email,age:number'"),
    count: z.number().min(1).max(100).default(10).describe("Number of objects")
  },
  async ({ fields, count }) => {
    try {
      const firstNames = ["James","Mary","John","Patricia","Robert","Jennifer","Michael","Linda","David","Elizabeth"];
      const lastNames = ["Smith","Johnson","Williams","Brown","Jones","Garcia","Miller","Davis","Rodriguez","Martinez"];
      const domains = ["gmail.com","yahoo.com","outlook.com","company.io"];
      const r = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
      const rn = (min: number, max: number) => min + Math.floor(Math.random() * (max - min));
      const fieldDefs = fields.split(",").map(f => { const [name, type] = f.trim().split(":"); return { name: name.trim(), type: (type || "name").trim() }; });
      const objects = [];
      for (let i = 0; i < count; i++) {
        const obj: Record<string, unknown> = {};
        for (const fd of fieldDefs) {
          switch (fd.type) {
            case "name": obj[fd.name] = `${r(firstNames)} ${r(lastNames)}`; break;
            case "email": obj[fd.name] = `${r(firstNames).toLowerCase()}${rn(1,99)}@${r(domains)}`; break;
            case "phone": obj[fd.name] = `+1-${rn(200,999)}-${rn(200,999)}-${rn(1000,9999)}`; break;
            case "number": obj[fd.name] = rn(1, 1000); break;
            case "boolean": obj[fd.name] = Math.random() > 0.5; break;
            case "date": obj[fd.name] = new Date(Date.now() - rn(0, 365*3) * 86400000).toISOString().split("T")[0]; break;
            case "id": obj[fd.name] = crypto.randomUUID(); break;
            default: obj[fd.name] = `${r(firstNames)} ${r(lastNames)}`; break;
          }
        }
        objects.push(obj);
      }
      return { content: [{ type: "text", text: JSON.stringify(objects, null, 2) }] };
    } catch (e: unknown) {
      return { content: [{ type: "text", text: `Error: ${(e as Error).message}` }], isError: true };
    }
  }
);

// === Start Server ===

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
