#!/usr/bin/env python3
"""
MCP Server Forge — The factory that builds MCP server factories.
Generates complete, compilable MCP server packages from tool specifications.
Built by Taylor (Sovereign AI Agent).
"""

import json
import os
import subprocess
import sys
from pathlib import Path
from typing import Any

BASE_DIR = Path(__file__).parent.parent / "products" / "mcp-servers"


def generate_package_json(name: str, description: str) -> str:
    return json.dumps({
        "name": f"@sovereign/{name}-mcp",
        "version": "1.0.0",
        "description": description,
        "main": "dist/index.js",
        "bin": {f"{name}-mcp": "dist/index.js"},
        "scripts": {
            "build": "tsc",
            "start": "node dist/index.js",
            "dev": "tsc && node dist/index.js"
        },
        "keywords": ["mcp", name.replace("-", " "), "ai-tools", "sovereign"],
        "author": "Sovereign (Taylor) <ricardo.yudi@gmail.com>",
        "license": "MIT",
        "type": "commonjs",
        "dependencies": {
            "@modelcontextprotocol/sdk": "^1.26.0",
            "zod": "^4.3.6"
        },
        "devDependencies": {
            "@types/node": "^25.3.0",
            "typescript": "^5.9.3"
        }
    }, indent=2)


TSCONFIG = """{
  "compilerOptions": {
    "target": "ES2022",
    "module": "Node16",
    "moduleResolution": "Node16",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "declaration": true
  },
  "include": ["src/**/*"]
}
"""


def generate_tool_registration(tool: dict[str, Any]) -> str:
    """Generate the server.tool() call for a single tool."""
    name = tool["name"]
    desc = tool["description"]
    params = tool.get("params", {})
    impl = tool["implementation"]

    # Build Zod schema params
    param_lines = []
    for pname, pspec in params.items():
        zod_type = pspec.get("zod", "z.string()")
        pdesc = pspec.get("description", "")
        param_lines.append(f'    {pname}: {zod_type}.describe("{pdesc}")')

    params_obj = "{\n" + ",\n".join(param_lines) + "\n  }" if param_lines else "{}"

    # Build destructured args
    args = ", ".join(params.keys()) if params else ""
    args_destructure = f"{{ {args} }}" if args else "{}"

    return f'''
// Tool: {name}
server.tool(
  "{name}",
  "{desc}",
  {params_obj},
  async ({args_destructure}) => {{
    try {{
{impl}
    }} catch (e: unknown) {{
      return {{ content: [{{ type: "text", text: `Error: ${{(e as Error).message}}` }}], isError: true }};
    }}
  }}
);'''


def generate_index_ts(server_name: str, description: str, tools: list[dict], helpers: str = "") -> str:
    """Generate the complete src/index.ts file."""
    tool_registrations = "\n".join(generate_tool_registration(t) for t in tools)

    return f'''#!/usr/bin/env node

import {{ McpServer }} from "@modelcontextprotocol/sdk/server/mcp.js";
import {{ StdioServerTransport }} from "@modelcontextprotocol/sdk/server/stdio.js";
import {{ z }} from "zod";

{helpers}

// === MCP Server Setup ===

const server = new McpServer(
  {{ name: "{server_name}", version: "1.0.0" }},
  {{
    capabilities: {{ tools: {{}} }},
    instructions: "{description}",
  }}
);
{tool_registrations}

// === Start Server ===

async function main() {{
  const transport = new StdioServerTransport();
  await server.connect(transport);
}}

main().catch((error) => {{
  console.error("Fatal error:", error);
  process.exit(1);
}});
'''


def generate_readme(server_name: str, description: str, tools: list[dict]) -> str:
    """Generate README.md for the MCP server."""
    tool_table = "| Tool | Description |\n|------|-------------|\n"
    for t in tools:
        tool_table += f"| `{t['name']}` | {t['description']} |\n"

    return f"""# {server_name.replace('-', ' ').title()} MCP Server

{description}

## Tools

{tool_table}

## Installation

### Claude Desktop / Claude Code

Add to your MCP config:

```json
{{
  "mcpServers": {{
    "{server_name}": {{
      "command": "node",
      "args": ["/path/to/{server_name}/dist/index.js"]
    }}
  }}
}}
```

## Build

```bash
npm install
npm run build
npm start
```

## License

MIT — Built by [Sovereign](https://github.com/ryudi84/sovereign-tools) (Taylor, autonomous AI agent)
"""


def forge_server(spec: dict[str, Any], install: bool = True, build: bool = True) -> Path:
    """Generate a complete MCP server package from a spec."""
    name = spec["name"]
    desc = spec["description"]
    tools = spec["tools"]
    helpers = spec.get("helpers", "")

    server_dir = BASE_DIR / name
    src_dir = server_dir / "src"
    src_dir.mkdir(parents=True, exist_ok=True)

    # Write files
    (server_dir / "package.json").write_text(generate_package_json(name, desc), encoding="utf-8")
    (server_dir / "tsconfig.json").write_text(TSCONFIG, encoding="utf-8")
    (src_dir / "index.ts").write_text(generate_index_ts(name, desc, tools, helpers), encoding="utf-8")
    (server_dir / "README.md").write_text(generate_readme(name, desc, tools), encoding="utf-8")

    print(f"[FORGE] Generated {name} at {server_dir}")

    if install:
        print(f"[FORGE] Installing dependencies for {name}...")
        subprocess.run(["npm", "install"], cwd=str(server_dir), capture_output=True, timeout=60, shell=True)

    if build:
        print(f"[FORGE] Building {name}...")
        result = subprocess.run(["npx", "tsc"], cwd=str(server_dir), capture_output=True, text=True, timeout=30, shell=True)
        if result.returncode == 0:
            print(f"[FORGE] ✓ {name} built successfully!")
        else:
            print(f"[FORGE] ✗ {name} build failed:")
            print(result.stderr[:500])

    return server_dir


# =====================================================
# MCP SERVER SPECIFICATIONS
# =====================================================

SERVERS: list[dict[str, Any]] = [
    {
        "name": "regex-lab",
        "description": "MCP server for regex testing, matching, replacing, and validation.",
        "tools": [
            {
                "name": "test_regex",
                "description": "Test a regex pattern against a string. Returns all matches with positions and capture groups.",
                "params": {
                    "pattern": {"zod": "z.string()", "description": "Regular expression pattern"},
                    "flags": {"zod": 'z.string().default("g")', "description": "Regex flags (g, m, i, s)"},
                    "test_string": {"zod": "z.string()", "description": "String to test against"},
                },
                "implementation": '''      const regex = new RegExp(pattern, flags);
      const matches: string[] = [];
      let match: RegExpExecArray | null;
      if (flags.includes("g")) {
        while ((match = regex.exec(test_string)) !== null) {
          matches.push(`Match ${matches.length + 1}: "${match[0]}" at index ${match.index}${match.length > 1 ? " groups: " + match.slice(1).join(", ") : ""}`);
        }
      } else {
        match = regex.exec(test_string);
        if (match) matches.push(`Match: "${match[0]}" at index ${match.index}${match.length > 1 ? " groups: " + match.slice(1).join(", ") : ""}`);
      }
      const result = matches.length > 0 ? matches.join("\\n") : "No matches found.";
      return { content: [{ type: "text", text: result }] };'''
            },
            {
                "name": "replace_regex",
                "description": "Replace matches in a string using a regex pattern and replacement string.",
                "params": {
                    "pattern": {"zod": "z.string()", "description": "Regular expression pattern"},
                    "flags": {"zod": 'z.string().default("g")', "description": "Regex flags"},
                    "test_string": {"zod": "z.string()", "description": "Input string"},
                    "replacement": {"zod": "z.string()", "description": "Replacement string (supports $1 capture groups)"},
                },
                "implementation": '''      const regex = new RegExp(pattern, flags);
      const result = test_string.replace(regex, replacement);
      return { content: [{ type: "text", text: result }] };'''
            },
            {
                "name": "validate_regex",
                "description": "Check if a regex pattern is syntactically valid.",
                "params": {
                    "pattern": {"zod": "z.string()", "description": "Regex pattern to validate"},
                },
                "implementation": '''      try { new RegExp(pattern); return { content: [{ type: "text", text: "✓ Valid regex pattern" }] }; }
      catch (err: unknown) { return { content: [{ type: "text", text: `✗ Invalid: ${(err as Error).message}` }] }; }'''
            },
        ]
    },
    {
        "name": "base64-forge",
        "description": "MCP server for Base64, URL, and HTML encoding/decoding.",
        "tools": [
            {
                "name": "encode_base64",
                "description": "Encode text to Base64.",
                "params": {"text": {"zod": "z.string()", "description": "Text to encode"}},
                "implementation": '''      const encoded = Buffer.from(text, "utf-8").toString("base64");
      return { content: [{ type: "text", text: `${encoded}\\n\\nOriginal: ${text.length} chars, Encoded: ${encoded.length} chars` }] };'''
            },
            {
                "name": "decode_base64",
                "description": "Decode a Base64 string to plain text.",
                "params": {"base64_string": {"zod": "z.string()", "description": "Base64 string to decode"}},
                "implementation": '''      const decoded = Buffer.from(base64_string, "base64").toString("utf-8");
      return { content: [{ type: "text", text: decoded }] };'''
            },
            {
                "name": "encode_url",
                "description": "URL-encode a string.",
                "params": {"text": {"zod": "z.string()", "description": "Text to URL-encode"}},
                "implementation": '''      return { content: [{ type: "text", text: encodeURIComponent(text) }] };'''
            },
            {
                "name": "decode_url",
                "description": "Decode a URL-encoded string.",
                "params": {"encoded": {"zod": "z.string()", "description": "URL-encoded string"}},
                "implementation": '''      return { content: [{ type: "text", text: decodeURIComponent(encoded) }] };'''
            },
            {
                "name": "encode_html",
                "description": "Escape HTML special characters.",
                "params": {"text": {"zod": "z.string()", "description": "Text to HTML-encode"}},
                "implementation": '''      const escaped = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
      return { content: [{ type: "text", text: escaped }] };'''
            },
            {
                "name": "decode_html",
                "description": "Decode HTML entities to plain text.",
                "params": {"html": {"zod": "z.string()", "description": "HTML-encoded string"}},
                "implementation": '''      const decoded = html.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
      return { content: [{ type: "text", text: decoded }] };'''
            },
        ]
    },
    {
        "name": "hash-forge",
        "description": "MCP server for hashing text with MD5, SHA-1, SHA-256, SHA-384, SHA-512 and HMAC generation.",
        "helpers": 'import * as crypto from "crypto";',
        "tools": [
            {
                "name": "hash_text",
                "description": "Hash text with all algorithms: MD5, SHA-1, SHA-256, SHA-384, SHA-512.",
                "params": {"text": {"zod": "z.string()", "description": "Text to hash"}},
                "implementation": '''      const algos = ["md5", "sha1", "sha256", "sha384", "sha512"];
      const results = algos.map(a => `${a.toUpperCase()}: ${crypto.createHash(a).update(text).digest("hex")}`);
      return { content: [{ type: "text", text: results.join("\\n") }] };'''
            },
            {
                "name": "compute_hmac",
                "description": "Generate an HMAC signature.",
                "params": {
                    "key": {"zod": "z.string()", "description": "Secret key"},
                    "message": {"zod": "z.string()", "description": "Message to sign"},
                    "algorithm": {"zod": 'z.enum(["sha1", "sha256", "sha384", "sha512"]).default("sha256")', "description": "Hash algorithm"},
                },
                "implementation": '''      const hmac = crypto.createHmac(algorithm, key).update(message).digest("hex");
      return { content: [{ type: "text", text: `HMAC-${algorithm.toUpperCase()}: ${hmac}` }] };'''
            },
            {
                "name": "compare_hashes",
                "description": "Compare two hash strings (case-insensitive).",
                "params": {
                    "hash_a": {"zod": "z.string()", "description": "First hash"},
                    "hash_b": {"zod": "z.string()", "description": "Second hash"},
                },
                "implementation": '''      const match = hash_a.toLowerCase().trim() === hash_b.toLowerCase().trim();
      return { content: [{ type: "text", text: match ? "✓ Hashes match" : "✗ Hashes do NOT match" }] };'''
            },
        ]
    },
    {
        "name": "jwt-forge",
        "description": "MCP server for decoding, analyzing, and validating JWT tokens.",
        "tools": [
            {
                "name": "decode_jwt",
                "description": "Decode a JWT and return header, payload, and signature.",
                "params": {"token": {"zod": "z.string()", "description": "JWT token string"}},
                "implementation": '''      const parts = token.split(".");
      if (parts.length !== 3) return { content: [{ type: "text", text: "✗ Invalid JWT: must have 3 parts separated by dots" }], isError: true };
      const decode = (s: string) => JSON.parse(Buffer.from(s, "base64url").toString("utf-8"));
      const header = decode(parts[0]);
      const payload = decode(parts[1]);
      const sig = Buffer.from(parts[2], "base64url").toString("hex");
      const now = Math.floor(Date.now() / 1000);
      let expiry = "No expiration claim";
      if (payload.exp) expiry = payload.exp > now ? `✓ Valid (expires ${new Date(payload.exp * 1000).toISOString()})` : `✗ Expired (${new Date(payload.exp * 1000).toISOString()})`;
      const result = [
        "=== Header ===", JSON.stringify(header, null, 2),
        "\\n=== Payload ===", JSON.stringify(payload, null, 2),
        "\\n=== Signature ===", sig,
        "\\n=== Expiry ===", expiry
      ].join("\\n");
      return { content: [{ type: "text", text: result }] };'''
            },
            {
                "name": "validate_jwt_format",
                "description": "Check if a JWT is well-formed (3 parts, valid base64url, parseable header/payload).",
                "params": {"token": {"zod": "z.string()", "description": "JWT token to validate"}},
                "implementation": '''      const parts = token.split(".");
      const checks: string[] = [];
      checks.push(parts.length === 3 ? "✓ Has 3 parts" : "✗ Must have 3 dot-separated parts");
      try { JSON.parse(Buffer.from(parts[0] || "", "base64url").toString()); checks.push("✓ Header is valid JSON"); } catch { checks.push("✗ Header is not valid JSON"); }
      try { JSON.parse(Buffer.from(parts[1] || "", "base64url").toString()); checks.push("✓ Payload is valid JSON"); } catch { checks.push("✗ Payload is not valid JSON"); }
      return { content: [{ type: "text", text: checks.join("\\n") }] };'''
            },
        ]
    },
    {
        "name": "timestamp-forge",
        "description": "MCP server for timestamp conversion, timezone handling, and date calculations.",
        "tools": [
            {
                "name": "current_time",
                "description": "Get current time in multiple formats: Unix, UTC, ISO 8601, RFC 2822, SQL datetime.",
                "params": {},
                "implementation": '''      const now = new Date();
      const formats = [
        `Unix (seconds): ${Math.floor(now.getTime() / 1000)}`,
        `Unix (ms): ${now.getTime()}`,
        `UTC: ${now.toUTCString()}`,
        `ISO 8601: ${now.toISOString()}`,
        `SQL: ${now.toISOString().replace("T", " ").replace("Z", "")}`,
        `Local: ${now.toString()}`,
        `Day of year: ${Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000)}`,
      ];
      return { content: [{ type: "text", text: formats.join("\\n") }] };'''
            },
            {
                "name": "unix_to_human",
                "description": "Convert Unix timestamp to human-readable formats. Auto-detects seconds vs milliseconds.",
                "params": {"timestamp": {"zod": "z.number()", "description": "Unix timestamp (seconds or milliseconds)"}},
                "implementation": '''      const ms = timestamp > 1e12 ? timestamp : timestamp * 1000;
      const d = new Date(ms);
      if (isNaN(d.getTime())) return { content: [{ type: "text", text: "Invalid timestamp" }], isError: true };
      const formats = [
        `UTC: ${d.toUTCString()}`,
        `ISO 8601: ${d.toISOString()}`,
        `Local: ${d.toString()}`,
        `SQL: ${d.toISOString().replace("T", " ").replace("Z", "")}`,
        `Unix (s): ${Math.floor(ms / 1000)}`,
        `Unix (ms): ${ms}`,
      ];
      return { content: [{ type: "text", text: formats.join("\\n") }] };'''
            },
            {
                "name": "date_diff",
                "description": "Calculate the difference between two dates.",
                "params": {
                    "start_date": {"zod": "z.string()", "description": "Start date (any parseable format)"},
                    "end_date": {"zod": "z.string()", "description": "End date (any parseable format)"},
                },
                "implementation": '''      const a = new Date(start_date), b = new Date(end_date);
      if (isNaN(a.getTime()) || isNaN(b.getTime())) return { content: [{ type: "text", text: "Invalid date format" }], isError: true };
      const diffMs = Math.abs(b.getTime() - a.getTime());
      const days = Math.floor(diffMs / 86400000);
      const hours = Math.floor(diffMs / 3600000);
      const mins = Math.floor(diffMs / 60000);
      const secs = Math.floor(diffMs / 1000);
      const result = [`Days: ${days}`, `Hours: ${hours}`, `Minutes: ${mins}`, `Seconds: ${secs}`, `Weeks: ${(days / 7).toFixed(1)}`, `Months (approx): ${(days / 30.44).toFixed(1)}`];
      return { content: [{ type: "text", text: result.join("\\n") }] };'''
            },
        ]
    },
    {
        "name": "meta-forge",
        "description": "MCP server for generating HTML meta tags (Open Graph, Twitter Card, SEO) and running SEO checks.",
        "tools": [
            {
                "name": "generate_meta_tags",
                "description": "Generate complete HTML meta tags for SEO, Open Graph, and Twitter Card.",
                "params": {
                    "title": {"zod": "z.string()", "description": "Page title"},
                    "description": {"zod": "z.string()", "description": "Meta description"},
                    "url": {"zod": 'z.string().default("")', "description": "Canonical URL"},
                    "og_image": {"zod": 'z.string().default("")', "description": "Open Graph image URL"},
                    "twitter_handle": {"zod": 'z.string().default("")', "description": "Twitter @handle"},
                },
                "implementation": '''      const tags = [
        `<title>${title}</title>`,
        `<meta name="description" content="${description}">`,
        `<meta property="og:title" content="${title}">`,
        `<meta property="og:description" content="${description}">`,
        `<meta property="og:type" content="website">`,
      ];
      if (url) tags.push(`<meta property="og:url" content="${url}">`, `<link rel="canonical" href="${url}">`);
      if (og_image) tags.push(`<meta property="og:image" content="${og_image}">`);
      tags.push(`<meta name="twitter:card" content="summary_large_image">`, `<meta name="twitter:title" content="${title}">`, `<meta name="twitter:description" content="${description}">`);
      if (twitter_handle) tags.push(`<meta name="twitter:site" content="${twitter_handle}">`);
      if (og_image) tags.push(`<meta name="twitter:image" content="${og_image}">`);
      return { content: [{ type: "text", text: tags.join("\\n") }] };'''
            },
            {
                "name": "check_seo",
                "description": "Run an SEO checklist on meta tag values. Returns pass/fail for title length, description length, etc.",
                "params": {
                    "title": {"zod": "z.string()", "description": "Page title"},
                    "description": {"zod": "z.string()", "description": "Meta description"},
                },
                "implementation": '''      const checks = [
        title.length >= 30 && title.length <= 60 ? `✓ Title length: ${title.length} (ideal: 30-60)` : `✗ Title length: ${title.length} (ideal: 30-60)`,
        description.length >= 120 && description.length <= 160 ? `✓ Description length: ${description.length} (ideal: 120-160)` : `✗ Description length: ${description.length} (ideal: 120-160)`,
        title.length > 0 ? "✓ Title is set" : "✗ Title is missing",
        description.length > 0 ? "✓ Description is set" : "✗ Description is missing",
      ];
      return { content: [{ type: "text", text: checks.join("\\n") }] };'''
            },
        ]
    },
    {
        "name": "color-forge",
        "description": "MCP server for generating color palettes and exporting to CSS, Tailwind, SCSS, JSON.",
        "tools": [
            {
                "name": "generate_palette",
                "description": "Generate a color palette. Harmonies: random, analogous, complementary, triadic, monochromatic, warm, cool, pastel, neon.",
                "params": {
                    "harmony": {"zod": 'z.enum(["random", "analogous", "complementary", "triadic", "monochromatic", "warm", "cool", "pastel", "neon"]).default("random")', "description": "Color harmony type"},
                    "count": {"zod": "z.number().min(2).max(10).default(5)", "description": "Number of colors"},
                },
                "implementation": '''      function hslToHex(h: number, s: number, l: number): string {
        s /= 100; l /= 100;
        const a = s * Math.min(l, 1 - l);
        const f = (n: number) => { const k = (n + h / 30) % 12; return Math.round(255 * (l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)))); };
        return "#" + [f(0), f(8), f(4)].map(v => v.toString(16).padStart(2, "0")).join("");
      }
      const base = Math.random() * 360;
      const colors: string[] = [];
      for (let i = 0; i < count; i++) {
        let h = 0, s = 0, l = 0;
        switch (harmony) {
          case "analogous": h = (base + i * 30) % 360; s = 60 + Math.random() * 20; l = 45 + Math.random() * 20; break;
          case "complementary": h = (base + (i % 2 === 0 ? 0 : 180) + i * 5) % 360; s = 70; l = 50; break;
          case "triadic": h = (base + i * 120) % 360; s = 65 + Math.random() * 15; l = 50; break;
          case "monochromatic": h = base; s = 50 + Math.random() * 30; l = 20 + (i / count) * 60; break;
          case "warm": h = Math.random() * 60; s = 70 + Math.random() * 20; l = 40 + Math.random() * 30; break;
          case "cool": h = 180 + Math.random() * 80; s = 60 + Math.random() * 20; l = 40 + Math.random() * 25; break;
          case "pastel": h = Math.random() * 360; s = 40 + Math.random() * 20; l = 75 + Math.random() * 15; break;
          case "neon": h = Math.random() * 360; s = 100; l = 50 + Math.random() * 10; break;
          default: h = Math.random() * 360; s = 50 + Math.random() * 40; l = 30 + Math.random() * 40; break;
        }
        colors.push(hslToHex(h, s, l));
      }
      return { content: [{ type: "text", text: `Palette (${harmony}, ${count} colors):\\n${colors.join("\\n")}` }] };'''
            },
            {
                "name": "export_palette",
                "description": "Export colors to CSS, Tailwind, SCSS, or JSON format.",
                "params": {
                    "colors": {"zod": "z.string()", "description": "Comma-separated hex colors (e.g. #ff0000,#00ff00,#0000ff)"},
                    "format": {"zod": 'z.enum(["css", "tailwind", "scss", "json"]).default("css")', "description": "Export format"},
                },
                "implementation": '''      const cols = colors.split(",").map(c => c.trim());
      let result = "";
      switch (format) {
        case "css": result = ":root {\\n" + cols.map((c, i) => `  --color-${i + 1}: ${c};`).join("\\n") + "\\n}"; break;
        case "tailwind": result = "module.exports = {\\n  theme: {\\n    extend: {\\n      colors: {\\n" + cols.map((c, i) => `        'custom-${i + 1}': '${c}',`).join("\\n") + "\\n      }\\n    }\\n  }\\n}"; break;
        case "scss": result = cols.map((c, i) => `$color-${i + 1}: ${c};`).join("\\n"); break;
        case "json": result = JSON.stringify(cols.reduce((o: Record<string,string>, c, i) => { o[`color-${i + 1}`] = c; return o; }, {}), null, 2); break;
      }
      return { content: [{ type: "text", text: result }] };'''
            },
        ]
    },
    {
        "name": "shadow-forge",
        "description": "MCP server for generating CSS box-shadow values with presets and custom layers.",
        "tools": [
            {
                "name": "generate_shadow",
                "description": "Generate CSS box-shadow from parameters.",
                "params": {
                    "h_offset": {"zod": "z.number().default(0)", "description": "Horizontal offset (px)"},
                    "v_offset": {"zod": "z.number().default(4)", "description": "Vertical offset (px)"},
                    "blur": {"zod": "z.number().default(10)", "description": "Blur radius (px)"},
                    "spread": {"zod": "z.number().default(0)", "description": "Spread radius (px)"},
                    "color": {"zod": 'z.string().default("#00000040")', "description": "Shadow color (hex with optional alpha)"},
                    "inset": {"zod": "z.boolean().default(false)", "description": "Inset shadow"},
                },
                "implementation": '''      const shadow = `${inset ? "inset " : ""}${h_offset}px ${v_offset}px ${blur}px ${spread}px ${color}`;
      return { content: [{ type: "text", text: `box-shadow: ${shadow};` }] };'''
            },
            {
                "name": "shadow_preset",
                "description": "Get a named shadow preset. Options: subtle, soft, medium, heavy, neon, floating, neumorphic, material.",
                "params": {
                    "preset": {"zod": 'z.enum(["subtle", "soft", "medium", "heavy", "neon", "floating", "neumorphic", "material"]).default("soft")', "description": "Preset name"},
                },
                "implementation": '''      const presets: Record<string, string> = {
        subtle: "0 1px 2px rgba(0,0,0,0.05)",
        soft: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)",
        medium: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)",
        heavy: "0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)",
        neon: "0 0 5px #00ff00, 0 0 20px #00ff00, 0 0 40px #00ff00",
        floating: "0 25px 50px -12px rgba(0,0,0,0.25)",
        neumorphic: "5px 5px 10px #d1d9e6, -5px -5px 10px #ffffff",
        material: "0 3px 5px -1px rgba(0,0,0,0.2), 0 6px 10px 0 rgba(0,0,0,0.14), 0 1px 18px 0 rgba(0,0,0,0.12)",
      };
      return { content: [{ type: "text", text: `box-shadow: ${presets[preset]};` }] };'''
            },
        ]
    },
    {
        "name": "gradient-forge",
        "description": "MCP server for generating CSS gradients (linear, radial, conic) with presets.",
        "tools": [
            {
                "name": "generate_gradient",
                "description": "Generate a CSS gradient.",
                "params": {
                    "type": {"zod": 'z.enum(["linear", "radial", "conic"]).default("linear")', "description": "Gradient type"},
                    "colors": {"zod": "z.string()", "description": "Comma-separated colors (e.g. #ff0000,#0000ff)"},
                    "angle": {"zod": "z.number().default(135)", "description": "Angle in degrees (for linear/conic)"},
                },
                "implementation": '''      const cols = colors.split(",").map(c => c.trim());
      let css = "";
      switch (type) {
        case "linear": css = `linear-gradient(${angle}deg, ${cols.join(", ")})`; break;
        case "radial": css = `radial-gradient(circle, ${cols.join(", ")})`; break;
        case "conic": css = `conic-gradient(from ${angle}deg, ${cols.join(", ")})`; break;
      }
      return { content: [{ type: "text", text: `background: ${css};` }] };'''
            },
            {
                "name": "random_gradient",
                "description": "Generate a random beautiful gradient.",
                "params": {
                    "stops": {"zod": "z.number().min(2).max(5).default(2)", "description": "Number of color stops"},
                },
                "implementation": '''      const colors: string[] = [];
      for (let i = 0; i < stops; i++) {
        const h = Math.floor(Math.random() * 360);
        const s = 60 + Math.floor(Math.random() * 30);
        const l = 40 + Math.floor(Math.random() * 30);
        colors.push(`hsl(${h}, ${s}%, ${l}%)`);
      }
      const angle = Math.floor(Math.random() * 360);
      const css = `linear-gradient(${angle}deg, ${colors.join(", ")})`;
      return { content: [{ type: "text", text: `background: ${css};` }] };'''
            },
        ]
    },
    {
        "name": "readme-forge",
        "description": "MCP server for generating professional README.md files from project details.",
        "tools": [
            {
                "name": "generate_readme",
                "description": "Generate a complete README.md for a project.",
                "params": {
                    "project_name": {"zod": "z.string()", "description": "Project name"},
                    "tagline": {"zod": 'z.string().default("")', "description": "Short tagline/description"},
                    "description": {"zod": 'z.string().default("")', "description": "Detailed description"},
                    "tech_stack": {"zod": 'z.string().default("")', "description": "Comma-separated technologies"},
                    "install_cmd": {"zod": 'z.string().default("npm install")', "description": "Installation command"},
                    "features": {"zod": 'z.string().default("")', "description": "Comma-separated feature list"},
                    "license": {"zod": 'z.string().default("MIT")', "description": "License type"},
                    "author": {"zod": 'z.string().default("")', "description": "Author name"},
                },
                "implementation": r'''      const featureList = features ? features.split(",").map(f => `- ${f.trim()}`).join("\n") : "";
      const techBadges = tech_stack ? tech_stack.split(",").map(t => `![${t.trim()}](https://img.shields.io/badge/-${t.trim().replace(/ /g, "%20")}-333?style=flat)`).join(" ") : "";
      const md = [
        `# ${project_name}`,
        tagline ? `\n> ${tagline}` : "",
        techBadges ? `\n${techBadges}` : "",
        description ? `\n## About\n\n${description}` : "",
        featureList ? `\n## Features\n\n${featureList}` : "",
        `\n## Installation\n\n\`\`\`bash\n${install_cmd}\n\`\`\``,
        `\n## License\n\n${license}`,
        author ? `\n## Author\n\n${author}` : "",
      ].filter(Boolean).join("\n");
      return { content: [{ type: "text", text: md }] };'''
            },
        ]
    },
]


def main():
    """Forge all MCP servers."""
    if len(sys.argv) > 1 and sys.argv[1] == "--list":
        for s in SERVERS:
            print(f"  {s['name']}: {s['description']}")
        return

    target = sys.argv[1] if len(sys.argv) > 1 else None

    for spec in SERVERS:
        if target and spec["name"] != target:
            continue
        forge_server(spec)

    print(f"\n[FORGE] Done! Generated {len(SERVERS) if not target else 1} MCP servers.")
    print(f"[FORGE] All servers at: {BASE_DIR}")


if __name__ == "__main__":
    main()
