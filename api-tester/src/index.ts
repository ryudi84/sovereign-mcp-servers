#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// === Helpers ===

const TICK3 = "```";

function errorText(e: unknown): string {
  return "Error: " + ((e instanceof Error) ? e.message : String(e));
}

// === MCP Server Setup ===

const server = new McpServer(
  { name: "api-tester", version: "1.0.0" },
  {
    capabilities: { tools: {} },
    instructions:
      "MCP server for API testing — make HTTP requests, test endpoints, generate cURL commands, create mock responses, and health checks. Postman in your IDE.",
  }
);

// ── Tool: http_request ──────────────────────────────────────────────────────

server.tool(
  "http_request",
  "Make an HTTP request (GET, POST, PUT, DELETE, PATCH) with custom headers and body. Returns status, timing, response headers, and body.",
  {
    url: z.string().describe("Request URL"),
    method: z
      .enum(["GET", "POST", "PUT", "DELETE", "PATCH"])
      .default("GET")
      .describe("HTTP method"),
    headers: z
      .record(z.string(), z.string())
      .default({})
      .describe("Request headers as key-value pairs"),
    body: z
      .string()
      .optional()
      .describe("Request body (JSON string for POST/PUT/PATCH)"),
  },
  async ({ url, method, headers, body }) => {
    try {
      const startTime = Date.now();

      const reqHeaders: Record<string, string> = Object.assign({}, headers);
      const options: RequestInit = { method, headers: reqHeaders };

      if (body && ["POST", "PUT", "PATCH"].includes(method)) {
        options.body = body;
        if (!reqHeaders["Content-Type"] && !reqHeaders["content-type"]) {
          reqHeaders["Content-Type"] = "application/json";
        }
      }

      const response = await fetch(url, options);
      const elapsed = Date.now() - startTime;

      const respHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        respHeaders[key] = value;
      });

      const ct = response.headers.get("content-type") || "";
      let respBody: string;
      if (ct.includes("json")) {
        const json = await response.json();
        respBody = JSON.stringify(json, null, 2);
      } else {
        respBody = await response.text();
        if (respBody.length > 3000) {
          respBody = respBody.substring(0, 3000) + "\n[Truncated]";
        }
      }

      const lines: string[] = [
        "# " + method + " " + url,
        "",
        "**Status**: " + response.status + " " + response.statusText,
        "**Time**: " + elapsed + "ms",
        "**Content-Type**: " + ct,
        "",
        "## Response Headers",
        TICK3 + "json",
        JSON.stringify(respHeaders, null, 2),
        TICK3,
        "",
        "## Body",
        TICK3,
        respBody,
        TICK3,
      ];

      return { content: [{ type: "text" as const, text: lines.join("\n") }] };
    } catch (e: unknown) {
      return {
        content: [{ type: "text" as const, text: errorText(e) }],
        isError: true,
      };
    }
  }
);

// ── Tool: test_endpoint ─────────────────────────────────────────────────────

server.tool(
  "test_endpoint",
  "Test an API endpoint with expected status code validation and optional JSON field checks. Shows PASS/FAIL for each check.",
  {
    url: z.string().describe("Endpoint URL to test"),
    method: z
      .enum(["GET", "POST", "PUT", "DELETE"])
      .default("GET")
      .describe("HTTP method"),
    expected_status: z
      .number()
      .default(200)
      .describe("Expected HTTP status code"),
    expected_fields: z
      .array(z.string())
      .default([])
      .describe("Dot-notation JSON field paths expected in response (e.g. 'data.id')"),
  },
  async ({ url, method, expected_status, expected_fields }) => {
    try {
      const startTime = Date.now();
      const response = await fetch(url, { method });
      const elapsed = Date.now() - startTime;

      const checks: string[] = [];

      // Status check
      const statusOk = response.status === expected_status;
      checks.push(
        (statusOk ? "PASS" : "FAIL") +
          " Status: " +
          response.status +
          " (expected " +
          expected_status +
          ")"
      );

      // Timing check
      let timeLabel: string;
      if (elapsed < 1000) {
        timeLabel = "PASS";
      } else if (elapsed < 3000) {
        timeLabel = "WARN";
      } else {
        timeLabel = "FAIL";
      }
      checks.push(timeLabel + " Response time: " + elapsed + "ms");

      // Field checks
      if (expected_fields.length > 0) {
        try {
          const json = await response.json();
          for (const field of expected_fields) {
            const parts = field.split(".");
            let current: unknown = json;
            let found = true;
            for (const part of parts) {
              if (
                current !== null &&
                current !== undefined &&
                typeof current === "object" &&
                part in (current as Record<string, unknown>)
              ) {
                current = (current as Record<string, unknown>)[part];
              } else {
                found = false;
                break;
              }
            }
            checks.push(
              (found ? "PASS" : "FAIL") +
                ' Field "' +
                field +
                '" ' +
                (found ? "present" : "missing")
            );
          }
        } catch {
          checks.push("FAIL Could not parse response as JSON");
        }
      }

      const passed = checks.filter((c) => c.startsWith("PASS")).length;
      const total = checks.length;

      const lines: string[] = [
        "# Endpoint Test: " + method + " " + url,
        "",
        "**Result**: " + passed + "/" + total + " checks passed",
        "",
      ];
      for (const c of checks) {
        lines.push("- " + c);
      }

      return { content: [{ type: "text" as const, text: lines.join("\n") }] };
    } catch (e: unknown) {
      return {
        content: [{ type: "text" as const, text: errorText(e) }],
        isError: true,
      };
    }
  }
);

// ── Tool: generate_curl ─────────────────────────────────────────────────────

server.tool(
  "generate_curl",
  "Generate a cURL command from method, URL, headers, and body parameters.",
  {
    url: z.string().describe("Request URL"),
    method: z
      .enum(["GET", "POST", "PUT", "DELETE", "PATCH"])
      .default("GET")
      .describe("HTTP method"),
    headers: z
      .record(z.string(), z.string())
      .default({})
      .describe("Request headers as key-value pairs"),
    body: z.string().optional().describe("Request body (JSON string)"),
  },
  async ({ url, method, headers, body }) => {
    try {
      const parts: string[] = ["curl"];

      if (method !== "GET") {
        parts.push("-X " + method);
      }

      for (const [key, value] of Object.entries(headers)) {
        parts.push("-H '" + key + ": " + value + "'");
      }

      if (body) {
        parts.push("-d '" + body + "'");
      }

      parts.push("'" + url + "'");

      const curlCmd = parts.join(" \\\n  ");

      const lines: string[] = [
        "# Generated cURL Command",
        "",
        TICK3 + "bash",
        curlCmd,
        TICK3,
      ];

      return { content: [{ type: "text" as const, text: lines.join("\n") }] };
    } catch (e: unknown) {
      return {
        content: [{ type: "text" as const, text: errorText(e) }],
        isError: true,
      };
    }
  }
);

// ── Tool: mock_response ─────────────────────────────────────────────────────

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(daysBack: number): string {
  const ms = Date.now() - Math.random() * daysBack * 86400000;
  return new Date(ms).toISOString();
}

const FIRST_NAMES = [
  "Alice", "Bob", "Charlie", "Diana", "Eve", "Frank", "Grace", "Hank",
  "Ivy", "Jack", "Karen", "Leo", "Mia", "Noah", "Olivia", "Paul",
];
const LAST_NAMES = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller",
  "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Wilson", "Anderson",
];
const PRODUCT_ADJECTIVES = [
  "Premium", "Ultra", "Pro", "Essential", "Classic", "Deluxe", "Smart", "Eco",
];
const PRODUCT_NOUNS = [
  "Widget", "Gadget", "Device", "Tool", "Kit", "Pack", "Module", "Unit",
];
const CATEGORIES = ["electronics", "clothing", "food", "tools", "books", "home", "sports"];
const ORDER_STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];
const POST_TOPICS = [
  "Getting Started with TypeScript",
  "10 Tips for Better APIs",
  "Understanding REST vs GraphQL",
  "Modern JavaScript Best Practices",
  "Building Scalable Microservices",
  "Docker for Beginners",
  "CI/CD Pipeline Setup Guide",
  "Database Optimization Techniques",
];
const COMMENT_TEXTS = [
  "Great article, very helpful!",
  "Thanks for sharing this.",
  "I disagree with point #3, but overall solid.",
  "Could you elaborate on the performance section?",
  "This saved me hours of debugging.",
  "Bookmarked for later reference.",
  "Nice write-up. Would love a follow-up post.",
  "The code examples are really clean.",
];

type MockItem = Record<string, unknown>;

const MOCK_GENERATORS: Record<string, () => MockItem> = {
  user: () => {
    const first = randomChoice(FIRST_NAMES);
    const last = randomChoice(LAST_NAMES);
    const name = first + " " + last;
    const email = first.toLowerCase() + "." + last.toLowerCase() + "@example.com";
    return {
      id: randomInt(1, 99999),
      name,
      email,
      role: randomChoice(["admin", "user", "editor", "viewer"]),
      active: Math.random() > 0.3,
      created_at: randomDate(365),
    };
  },
  product: () => ({
    id: randomInt(1, 99999),
    name: randomChoice(PRODUCT_ADJECTIVES) + " " + randomChoice(PRODUCT_NOUNS),
    price: +(Math.random() * 200 + 5).toFixed(2),
    currency: "USD",
    in_stock: Math.random() > 0.2,
    stock_count: randomInt(0, 500),
    category: randomChoice(CATEGORIES),
    rating: +(Math.random() * 4 + 1).toFixed(1),
    created_at: randomDate(180),
  }),
  order: () => ({
    id: "ORD-" + randomInt(10000, 99999),
    customer_id: randomInt(1, 9999),
    status: randomChoice(ORDER_STATUSES),
    total: +(Math.random() * 500 + 10).toFixed(2),
    currency: "USD",
    items_count: randomInt(1, 8),
    shipping_address: {
      city: randomChoice(["New York", "London", "Tokyo", "Berlin", "Sydney"]),
      country: randomChoice(["US", "UK", "JP", "DE", "AU"]),
    },
    created_at: randomDate(30),
  }),
  post: () => ({
    id: randomInt(1, 99999),
    title: randomChoice(POST_TOPICS),
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    author_id: randomInt(1, 500),
    tags: Array.from({ length: randomInt(1, 4) }, () =>
      randomChoice(["javascript", "typescript", "api", "devops", "cloud", "testing", "security"])
    ),
    likes: randomInt(0, 2000),
    published: Math.random() > 0.2,
    created_at: randomDate(90),
  }),
  comment: () => ({
    id: randomInt(1, 99999),
    post_id: randomInt(1, 500),
    author: randomChoice(FIRST_NAMES) + "_" + randomInt(1, 999),
    text: randomChoice(COMMENT_TEXTS),
    upvotes: randomInt(0, 150),
    created_at: randomDate(14),
  }),
};

server.tool(
  "mock_response",
  "Generate realistic mock JSON responses for API prototyping. Supports resource types: user, product, order, post, comment.",
  {
    resource: z
      .string()
      .describe("Resource type: user, product, order, post, or comment"),
    count: z
      .number()
      .default(3)
      .describe("Number of items to generate (1-50)"),
  },
  async ({ resource, count }) => {
    try {
      const clampedCount = Math.max(1, Math.min(count, 50));
      const generator = MOCK_GENERATORS[resource.toLowerCase()];

      if (!generator) {
        const supported = Object.keys(MOCK_GENERATORS).join(", ");
        return {
          content: [
            {
              type: "text" as const,
              text:
                "Unknown resource type: " +
                resource +
                ". Supported types: " +
                supported,
            },
          ],
          isError: true,
        };
      }

      const items = Array.from({ length: clampedCount }, () => generator());
      const payload = { data: items, total: clampedCount, page: 1 };
      const jsonStr = JSON.stringify(payload, null, 2);

      const lines: string[] = [
        "# Mock " + resource + " Response (" + clampedCount + " items)",
        "",
        TICK3 + "json",
        jsonStr,
        TICK3,
      ];

      return { content: [{ type: "text" as const, text: lines.join("\n") }] };
    } catch (e: unknown) {
      return {
        content: [{ type: "text" as const, text: errorText(e) }],
        isError: true,
      };
    }
  }
);

// ── Tool: api_health_check ──────────────────────────────────────────────────

interface HealthResult {
  url: string;
  status: number;
  time: number;
}

server.tool(
  "api_health_check",
  "Check health of multiple API endpoints simultaneously. Shows UP/DOWN status table with response times.",
  {
    urls: z
      .array(z.string())
      .describe("List of endpoint URLs to check"),
  },
  async ({ urls }) => {
    try {
      const TIMEOUT_MS = 10000;

      const results = await Promise.allSettled(
        urls.map(async (url): Promise<HealthResult> => {
          const controller = new AbortController();
          const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
          try {
            const start = Date.now();
            const res = await fetch(url, {
              method: "HEAD",
              signal: controller.signal,
            });
            const time = Date.now() - start;
            return { url, status: res.status, time };
          } finally {
            clearTimeout(timer);
          }
        })
      );

      const tableRows: string[] = [];
      let upCount = 0;

      for (let i = 0; i < results.length; i++) {
        const r = results[i];
        if (r.status === "fulfilled") {
          const { url, status, time } = r.value;
          const isUp = status >= 200 && status < 400;
          if (isUp) upCount++;
          tableRows.push(
            "| " +
              (isUp ? "UP" : "DOWN") +
              " | " +
              url +
              " | " +
              status +
              " | " +
              time +
              "ms |"
          );
        } else {
          const reason =
            r.reason instanceof Error ? r.reason.message : String(r.reason);
          tableRows.push(
            "| DOWN | " + urls[i] + " | ERROR | " + reason + " |"
          );
        }
      }

      const lines: string[] = [
        "# API Health Check",
        "",
        "**" + upCount + "/" + urls.length + " endpoints healthy**",
        "",
        "| Status | URL | Code | Time |",
        "|--------|-----|------|------|",
      ];
      for (const row of tableRows) {
        lines.push(row);
      }

      return { content: [{ type: "text" as const, text: lines.join("\n") }] };
    } catch (e: unknown) {
      return {
        content: [{ type: "text" as const, text: errorText(e) }],
        isError: true,
      };
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
