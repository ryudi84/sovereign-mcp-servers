#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// === Type Definitions ===

interface EndpointDef {
  method: string;
  path: string;
  description: string;
}

interface ParamDef {
  name: string;
  type: string;
  required: boolean;
}

// === Code Generation Helpers ===

function generatePackageJson(name: string, withAuth: boolean): string {
  const deps: Record<string, string> = {
    express: "^4.21.2",
    cors: "^2.8.5",
    helmet: "^8.1.0",
  };
  if (withAuth) {
    deps["jsonwebtoken"] = "^9.0.2";
  }
  const pkg = {
    name: name,
    version: "1.0.0",
    description: `${name} REST API`,
    main: "index.js",
    scripts: {
      start: "node index.js",
      dev: "node --watch index.js",
    },
    dependencies: deps,
  };
  return JSON.stringify(pkg, null, 2);
}

function generateAuthMiddleware(): string {
  const lines = [
    "const jwt = require('jsonwebtoken');",
    "",
    "const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-production';",
    "",
    "/**",
    " * JWT Authentication Middleware",
    " * Expects header: Authorization: Bearer <token>",
    " */",
    "function authMiddleware(req, res, next) {",
    "  const authHeader = req.headers.authorization;",
    "  if (!authHeader || !authHeader.startsWith('Bearer ')) {",
    "    return res.status(401).json({ error: 'Missing or invalid Authorization header' });",
    "  }",
    "",
    "  const token = authHeader.split(' ')[1];",
    "  try {",
    "    const decoded = jwt.verify(token, JWT_SECRET);",
    "    req.user = decoded;",
    "    next();",
    "  } catch (err) {",
    "    return res.status(401).json({ error: 'Invalid or expired token' });",
    "  }",
    "}",
    "",
    "module.exports = { authMiddleware, JWT_SECRET };",
  ];
  return lines.join("\n");
}

function generateErrorHandler(): string {
  const lines = [
    "/**",
    " * Global error handling middleware.",
    " * Place this AFTER all routes.",
    " */",
    "function errorHandler(err, req, res, _next) {",
    "  console.error(`[ERROR] ${req.method} ${req.path}:`, err.message);",
    "",
    "  if (err.name === 'ValidationError') {",
    "    return res.status(400).json({",
    "      error: 'Validation Error',",
    "      details: err.message,",
    "    });",
    "  }",
    "",
    "  if (err.name === 'UnauthorizedError') {",
    "    return res.status(401).json({ error: 'Unauthorized' });",
    "  }",
    "",
    "  if (err.statusCode) {",
    "    return res.status(err.statusCode).json({ error: err.message });",
    "  }",
    "",
    "  res.status(500).json({ error: 'Internal Server Error' });",
    "}",
    "",
    "/**",
    " * 404 handler for unmatched routes.",
    " */",
    "function notFoundHandler(req, res) {",
    "  res.status(404).json({",
    "    error: 'Not Found',",
    "    message: `Route ${req.method} ${req.path} does not exist`,",
    "  });",
    "}",
    "",
    "module.exports = { errorHandler, notFoundHandler };",
  ];
  return lines.join("\n");
}

function generateRouteHandler(ep: EndpointDef, withAuth: boolean): string {
  const method = ep.method.toLowerCase();
  const hasBody = method === "post" || method === "put" || method === "patch";

  const lines: string[] = [];
  lines.push("/**");
  lines.push(` * ${ep.method} ${ep.path}`);
  lines.push(` * ${ep.description}`);
  lines.push(" */");

  let handlerStart = `router.${method}('${ep.path}', `;
  if (withAuth) {
    handlerStart += "authMiddleware, ";
  }
  handlerStart += "async (req, res, next) => {";
  lines.push(handlerStart);
  lines.push("  try {");

  if (hasBody) {
    lines.push("    const body = req.body;");
    lines.push("    if (!body || Object.keys(body).length === 0) {");
    lines.push("      return res.status(400).json({ error: 'Request body is required' });");
    lines.push("    }");
    lines.push("");
    lines.push(`    // TODO: Implement ${ep.description}`);
    const status = method === "post" ? "201" : "200";
    lines.push(`    res.status(${status}).json({`);
    lines.push(`      message: '${ep.description}',`);
    lines.push("      data: body,");
    lines.push("    });");
  } else if (method === "delete") {
    lines.push(`    // TODO: Implement ${ep.description}`);
    lines.push("    res.status(204).send();");
  } else {
    lines.push(`    // TODO: Implement ${ep.description}`);
    lines.push("    res.json({");
    lines.push(`      message: '${ep.description}',`);
    lines.push("      data: [],");
    lines.push("    });");
  }

  lines.push("  } catch (err) {");
  lines.push("    next(err);");
  lines.push("  }");
  lines.push("});");

  return lines.join("\n");
}

function generateIndexJs(name: string, endpoints: EndpointDef[], withAuth: boolean): string {
  const lines: string[] = [];
  lines.push("const express = require('express');");
  lines.push("const cors = require('cors');");
  lines.push("const helmet = require('helmet');");
  if (withAuth) {
    lines.push("const { authMiddleware } = require('./auth');");
  }
  lines.push("const { errorHandler, notFoundHandler } = require('./errors');");
  lines.push("");
  lines.push("const app = express();");
  lines.push("const PORT = process.env.PORT || 3000;");
  lines.push("");
  lines.push("// --- Middleware ---");
  lines.push("app.use(helmet());");
  lines.push("app.use(cors());");
  lines.push("app.use(express.json({ limit: '10mb' }));");
  lines.push("app.use(express.urlencoded({ extended: true }));");
  lines.push("");
  lines.push("// --- Request logging ---");
  lines.push("app.use((req, _res, next) => {");
  lines.push("  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);");
  lines.push("  next();");
  lines.push("});");
  lines.push("");
  lines.push("// --- Health check ---");
  lines.push("app.get('/health', (_req, res) => {");
  lines.push(`  res.json({ status: 'ok', name: '${name}', uptime: process.uptime() });`);
  lines.push("});");
  lines.push("");
  lines.push("// --- Routes ---");
  lines.push("const router = express.Router();");
  lines.push("");

  for (const ep of endpoints) {
    lines.push(generateRouteHandler(ep, withAuth));
    lines.push("");
  }

  lines.push("app.use('/api', router);");
  lines.push("");
  lines.push("// --- Error handling ---");
  lines.push("app.use(notFoundHandler);");
  lines.push("app.use(errorHandler);");
  lines.push("");
  lines.push("// --- Start server ---");
  lines.push("app.listen(PORT, () => {");
  lines.push(`  console.log('${name} running on http://localhost:' + PORT);`);
  lines.push("  console.log('Health check: http://localhost:' + PORT + '/health');");
  lines.push("});");

  return lines.join("\n");
}

function generateReadme(name: string, endpoints: EndpointDef[], withAuth: boolean): string {
  const lines: string[] = [];
  lines.push(`# ${name}`);
  lines.push("");
  lines.push("REST API generated by [API Forge MCP](https://github.com/ryudi84/sovereign-mcp-servers).");
  lines.push("");
  lines.push("## Quick Start");
  lines.push("");
  lines.push("```bash");
  lines.push("npm install");
  lines.push("npm start");
  lines.push("```");
  lines.push("");
  lines.push("Server runs on `http://localhost:3000` by default.");
  lines.push("");
  lines.push("## Health Check");
  lines.push("");
  lines.push("```bash");
  lines.push("curl http://localhost:3000/health");
  lines.push("```");
  lines.push("");

  if (withAuth) {
    lines.push("## Authentication");
    lines.push("");
    lines.push("This API uses JWT authentication. Include a Bearer token in the Authorization header:");
    lines.push("");
    lines.push("```bash");
    lines.push('curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/api/...');
    lines.push("```");
    lines.push("");
    lines.push("Set `JWT_SECRET` environment variable in production.");
    lines.push("");
  }

  lines.push("## Endpoints");
  lines.push("");
  lines.push("All routes are prefixed with `/api`.");
  lines.push("");

  for (const ep of endpoints) {
    lines.push(`### ${ep.method} /api${ep.path}`);
    lines.push("");
    lines.push(ep.description);
    lines.push("");
    lines.push("```bash");

    const authFlag = withAuth ? ' -H "Authorization: Bearer YOUR_TOKEN"' : "";
    const m = ep.method.toUpperCase();

    if (m === "GET") {
      lines.push(`curl${authFlag} http://localhost:3000/api${ep.path}`);
    } else if (m === "DELETE") {
      lines.push(`curl -X DELETE${authFlag} http://localhost:3000/api${ep.path}`);
    } else {
      lines.push("curl -X " + m + authFlag + " -H \"Content-Type: application/json\" \\\\");
      lines.push("  -d '{\"key\": \"value\"}' \\\\");
      lines.push("  http://localhost:3000/api" + ep.path);
    }

    lines.push("```");
    lines.push("");
  }

  lines.push("## Environment Variables");
  lines.push("");
  lines.push("| Variable | Default | Description |");
  lines.push("|----------|---------|-------------|");
  lines.push("| PORT | 3000 | Server port |");
  if (withAuth) {
    lines.push("| JWT_SECRET | change-me-in-production | JWT signing secret |");
  }
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push("Generated by API Forge MCP");

  return lines.join("\n");
}

// === Standalone Endpoint Generator ===

function generateStandaloneEndpoint(
  method: string,
  path: string,
  description: string,
  params: ParamDef[],
  responseExample: string
): string {
  const m = method.toLowerCase();
  const hasBody = m === "post" || m === "put" || m === "patch";

  const lines: string[] = [];
  lines.push("/**");
  lines.push(` * @route ${method.toUpperCase()} ${path}`);
  lines.push(` * @description ${description}`);

  for (const p of params) {
    const src = hasBody ? "body" : "query";
    lines.push(` * @param {${p.type}} ${src}.${p.name} ${p.required ? "(required)" : "(optional)"}`);
  }

  lines.push(" * @returns {Object} JSON response");

  if (responseExample) {
    lines.push(" *");
    lines.push(" * @example Response:");
    for (const line of responseExample.split("\n")) {
      lines.push(` * ${line}`);
    }
  }

  lines.push(" */");

  let handlerStart = `router.${m}('${path}', async (req, res, next) => {`;
  lines.push(handlerStart);
  lines.push("  try {");

  // Validation
  if (params.length > 0) {
    const source = hasBody ? "req.body" : "req.query";
    lines.push("    // --- Validate parameters ---");
    lines.push("    const errors = [];");
    lines.push("");

    for (const p of params) {
      if (p.required) {
        lines.push(`    if (${source}.${p.name} === undefined || ${source}.${p.name} === null || ${source}.${p.name} === '') {`);
        lines.push(`      errors.push('${p.name} is required');`);
        lines.push("    }");
        if (p.type === "number") {
          lines.push(`    else if (isNaN(Number(${source}.${p.name}))) {`);
          lines.push(`      errors.push('${p.name} must be a number');`);
          lines.push("    }");
        } else if (p.type === "boolean") {
          lines.push(`    else if (typeof ${source}.${p.name} !== 'boolean' && ${source}.${p.name} !== 'true' && ${source}.${p.name} !== 'false') {`);
          lines.push(`      errors.push('${p.name} must be a boolean');`);
          lines.push("    }");
        }
        lines.push("");
      } else {
        if (p.type === "number") {
          lines.push(`    if (${source}.${p.name} !== undefined && isNaN(Number(${source}.${p.name}))) {`);
          lines.push(`      errors.push('${p.name} must be a number');`);
          lines.push("    }");
          lines.push("");
        }
      }
    }

    lines.push("    if (errors.length > 0) {");
    lines.push("      return res.status(400).json({ error: 'Validation failed', details: errors });");
    lines.push("    }");
    lines.push("");
  }

  lines.push(`    // TODO: Implement ${description}`);
  lines.push("");

  if (m === "delete") {
    lines.push("    res.status(204).send();");
  } else if (m === "post") {
    lines.push("    res.status(201).json({");
    lines.push(`      message: '${description}',`);
    lines.push("      data: {},");
    lines.push("    });");
  } else {
    lines.push("    res.json({");
    lines.push(`      message: '${description}',`);
    lines.push("      data: {},");
    lines.push("    });");
  }

  lines.push("  } catch (err) {");
  lines.push("    next(err);");
  lines.push("  }");
  lines.push("});");

  return lines.join("\n");
}

// === Middleware Generator ===

function generateMiddleware(type: string): string {
  switch (type) {
    case "auth":
      return [
        "const jwt = require('jsonwebtoken');",
        "",
        "const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-production';",
        "",
        "/**",
        " * JWT Authentication Middleware",
        " * Verifies Bearer token from Authorization header.",
        " * On success, attaches decoded payload to req.user.",
        " */",
        "function authMiddleware(req, res, next) {",
        "  const authHeader = req.headers.authorization;",
        "",
        "  if (!authHeader) {",
        "    return res.status(401).json({",
        "      error: 'Unauthorized',",
        "      message: 'Missing Authorization header',",
        "    });",
        "  }",
        "",
        "  if (!authHeader.startsWith('Bearer ')) {",
        "    return res.status(401).json({",
        "      error: 'Unauthorized',",
        "      message: 'Authorization header must use Bearer scheme',",
        "    });",
        "  }",
        "",
        "  const token = authHeader.split(' ')[1];",
        "",
        "  try {",
        "    const decoded = jwt.verify(token, JWT_SECRET);",
        "    req.user = decoded;",
        "    next();",
        "  } catch (err) {",
        "    if (err.name === 'TokenExpiredError') {",
        "      return res.status(401).json({ error: 'Unauthorized', message: 'Token has expired' });",
        "    }",
        "    return res.status(401).json({ error: 'Unauthorized', message: 'Invalid token' });",
        "  }",
        "}",
        "",
        "function generateToken(payload, expiresIn = '24h') {",
        "  return jwt.sign(payload, JWT_SECRET, { expiresIn });",
        "}",
        "",
        "module.exports = { authMiddleware, generateToken, JWT_SECRET };",
      ].join("\n");

    case "rate-limit":
      return [
        "/**",
        " * Rate Limiting Middleware (in-memory, no dependencies)",
        " * Usage: app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));",
        " */",
        "function rateLimit(options = {}) {",
        "  const windowMs = options.windowMs || 15 * 60 * 1000;",
        "  const max = options.max || 100;",
        "  const message = options.message || 'Too many requests, please try again later';",
        "  const keyFn = options.keyFn || ((req) => req.ip || req.connection.remoteAddress);",
        "  const hits = new Map();",
        "  const cleanup = setInterval(() => {",
        "    const now = Date.now();",
        "    for (const [key, entry] of hits.entries()) {",
        "      if (now > entry.resetTime) hits.delete(key);",
        "    }",
        "  }, windowMs);",
        "  if (cleanup.unref) cleanup.unref();",
        "  return function rateLimitMiddleware(req, res, next) {",
        "    const key = keyFn(req);",
        "    const now = Date.now();",
        "    let entry = hits.get(key);",
        "    if (!entry || now > entry.resetTime) {",
        "      entry = { count: 0, resetTime: now + windowMs };",
        "      hits.set(key, entry);",
        "    }",
        "    entry.count++;",
        "    res.set('X-RateLimit-Limit', String(max));",
        "    res.set('X-RateLimit-Remaining', String(Math.max(0, max - entry.count)));",
        "    res.set('X-RateLimit-Reset', String(Math.ceil(entry.resetTime / 1000)));",
        "    if (entry.count > max) {",
        "      return res.status(429).json({",
        "        error: 'Too Many Requests',",
        "        message: message,",
        "        retryAfter: Math.ceil((entry.resetTime - now) / 1000),",
        "      });",
        "    }",
        "    next();",
        "  };",
        "}",
        "module.exports = { rateLimit };",
      ].join("\n");

    case "cors":
      return [
        "/**",
        " * CORS Middleware",
        " * Usage: app.use(corsMiddleware({ origins: ['https://myapp.com'], credentials: true }));",
        " */",
        "function corsMiddleware(options = {}) {",
        "  const origins = options.origins || '*';",
        "  const methods = options.methods || ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'];",
        "  const headers = options.headers || ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'];",
        "  const credentials = options.credentials || false;",
        "  const maxAge = options.maxAge || 86400;",
        "  return function cors(req, res, next) {",
        "    const requestOrigin = req.headers.origin;",
        "    let allowedOrigin = '*';",
        "    if (Array.isArray(origins)) {",
        "      allowedOrigin = origins.includes(requestOrigin) ? requestOrigin : '';",
        "    } else if (origins === '*' && credentials) {",
        "      allowedOrigin = requestOrigin || '*';",
        "    }",
        "    if (allowedOrigin) res.set('Access-Control-Allow-Origin', allowedOrigin);",
        "    res.set('Access-Control-Allow-Methods', methods.join(', '));",
        "    res.set('Access-Control-Allow-Headers', headers.join(', '));",
        "    res.set('Access-Control-Max-Age', String(maxAge));",
        "    if (credentials) res.set('Access-Control-Allow-Credentials', 'true');",
        "    if (req.method === 'OPTIONS') return res.status(204).send();",
        "    next();",
        "  };",
        "}",
        "module.exports = { corsMiddleware };",
      ].join("\n");

    case "logging":
      return [
        "/**",
        " * Request Logging Middleware",
        " * Usage: app.use(requestLogger({ level: 'verbose' }));",
        " */",
        "function requestLogger(options = {}) {",
        "  const level = options.level || 'standard';",
        "  const skip = options.skip || (() => false);",
        "  return function logger(req, res, next) {",
        "    if (skip(req, res)) return next();",
        "    const start = Date.now();",
        "    const timestamp = new Date().toISOString();",
        "    const originalEnd = res.end;",
        "    res.end = function (...args) {",
        "      const duration = Date.now() - start;",
        "      const status = res.statusCode;",
        "      if (level === 'minimal') {",
        "        console.log(status + ' ' + req.method + ' ' + req.path + ' ' + duration + 'ms');",
        "      } else if (level === 'standard') {",
        "        console.log(timestamp + ' ' + status + ' ' + req.method + ' ' + (req.originalUrl || req.url) + ' ' + duration + 'ms');",
        "      } else {",
        "        console.log(timestamp + ' ' + status + ' ' + req.method + ' ' + (req.originalUrl || req.url) + ' ' + duration + 'ms');",
        "        console.log('  IP: ' + (req.ip || req.connection.remoteAddress));",
        "        console.log('  User-Agent: ' + (req.headers['user-agent'] || 'unknown'));",
        "        if (Object.keys(req.query || {}).length > 0) {",
        "          console.log('  Query: ' + JSON.stringify(req.query));",
        "        }",
        "      }",
        "      originalEnd.apply(res, args);",
        "    };",
        "    next();",
        "  };",
        "}",
        "module.exports = { requestLogger };",
      ].join("\n");

    case "validation":
      return [
        "/**",
        " * Request Validation Middleware",
        " * Usage: router.post('/users', validate({ body: { name: { type: 'string', required: true } } }), handler);",
        " */",
        "function validate(schema) {",
        "  return function validationMiddleware(req, res, next) {",
        "    const errors = [];",
        "    for (const source of ['body', 'query', 'params']) {",
        "      if (!schema[source]) continue;",
        "      const data = req[source] || {};",
        "      const fields = schema[source];",
        "      for (const [field, rules] of Object.entries(fields)) {",
        "        let value = data[field];",
        "        if ((value === undefined || value === null || value === '') && rules.default !== undefined) {",
        "          data[field] = rules.default; value = rules.default;",
        "        }",
        "        if (rules.required && (value === undefined || value === null || value === '')) {",
        "          errors.push(source + '.' + field + ' is required'); continue;",
        "        }",
        "        if (value === undefined || value === null || value === '') continue;",
        "        if (source !== 'body' && rules.type === 'number') {",
        "          value = Number(value); data[field] = value;",
        "          if (isNaN(value)) { errors.push(source + '.' + field + ' must be a valid number'); continue; }",
        "        }",
        "        if (rules.type) {",
        "          const actualType = Array.isArray(value) ? 'array' : typeof value;",
        "          if (actualType !== rules.type) {",
        "            errors.push(source + '.' + field + ' must be type ' + rules.type + ' (got ' + actualType + ')'); continue;",
        "          }",
        "        }",
        "        if (typeof value === 'string') {",
        "          if (rules.minLength && value.length < rules.minLength) errors.push(source + '.' + field + ' must be at least ' + rules.minLength + ' chars');",
        "          if (rules.maxLength && value.length > rules.maxLength) errors.push(source + '.' + field + ' must be at most ' + rules.maxLength + ' chars');",
        "          if (rules.pattern && !rules.pattern.test(value)) errors.push(source + '.' + field + ' has invalid format');",
        "        }",
        "        if (typeof value === 'number') {",
        "          if (rules.min !== undefined && value < rules.min) errors.push(source + '.' + field + ' must be >= ' + rules.min);",
        "          if (rules.max !== undefined && value > rules.max) errors.push(source + '.' + field + ' must be <= ' + rules.max);",
        "        }",
        "        if (rules.enum && !rules.enum.includes(value)) errors.push(source + '.' + field + ' must be one of: ' + rules.enum.join(', '));",
        "      }",
        "    }",
        "    if (errors.length > 0) {",
        "      return res.status(400).json({ error: 'Validation Error', details: errors });",
        "    }",
        "    next();",
        "  };",
        "}",
        "module.exports = { validate };",
      ].join("\n");

    default:
      return "// Unknown middleware type: " + JSON.stringify(type) + "\n// Supported types: auth, rate-limit, cors, logging, validation";
  }
}

// === MCP Server Setup ===

const server = new McpServer(
  { name: "api-forge", version: "1.0.0" },
  {
    capabilities: { tools: {} },
    instructions:
      "API Forge MCP Server — Generate REST API boilerplate code. Create complete Express.js APIs with endpoints, middleware, validation, and error handling.",
  }
);

// --- Tool: generate_express_api ---

const EndpointSchema = z.object({
  method: z.enum(["GET", "POST", "PUT", "DELETE"]).describe("HTTP method"),
  path: z.string().describe("Route path (e.g. /users, /users/:id)"),
  description: z.string().describe("What this endpoint does"),
});

server.tool(
  "generate_express_api",
  "Generate a complete Express.js REST API with routes, error handling, CORS, and optional JWT auth",
  {
    name: z.string().describe("Project/API name (kebab-case, e.g. my-api)"),
    endpoints: z.array(EndpointSchema).describe("Array of endpoint definitions"),
    with_auth: z.boolean().default(false).describe("Include JWT authentication middleware"),
  },
  async ({ name, endpoints, with_auth }) => {
    try {
      const files: Array<{ filename: string; content: string }> = [];

      files.push({ filename: "package.json", content: generatePackageJson(name, with_auth) });
      files.push({ filename: "errors.js", content: generateErrorHandler() });
      if (with_auth) {
        files.push({ filename: "auth.js", content: generateAuthMiddleware() });
      }
      files.push({ filename: "index.js", content: generateIndexJs(name, endpoints, with_auth) });
      files.push({ filename: "README.md", content: generateReadme(name, endpoints, with_auth) });

      const fileCount = files.length;
      const endpointCount = endpoints.length;
      const separator = "\n" + "=".repeat(60) + "\n";

      let output = "API Forge: Generated " + fileCount + " files for \"" + name + "\" (" + endpointCount + " endpoints" + (with_auth ? ", with JWT auth" : "") + ")\n";
      output += separator;

      for (const file of files) {
        output += "\n--- " + file.filename + " ---\n\n";
        output += file.content;
        output += "\n";
      }

      output += separator;
      output += "\nQuick start:\n";
      output += "  mkdir " + name + " && cd " + name + "\n";
      output += "  # Save each file above\n";
      output += "  npm install\n";
      output += "  npm start\n";

      return { content: [{ type: "text", text: output }] };
    } catch (e: unknown) {
      return {
        content: [{ type: "text", text: "Error generating API: " + (e as Error).message }],
        isError: true,
      };
    }
  }
);

// --- Tool: generate_endpoint ---

const ParamSchema = z.object({
  name: z.string().describe("Parameter name"),
  type: z.string().describe("Parameter type (string, number, boolean)"),
  required: z.boolean().describe("Whether the parameter is required"),
});

server.tool(
  "generate_endpoint",
  "Generate a single Express route handler with validation, error handling, and JSDoc documentation",
  {
    method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]).describe("HTTP method"),
    path: z.string().describe("Route path (e.g. /users/:id)"),
    description: z.string().describe("What this endpoint does"),
    params: z.array(ParamSchema).default([]).describe("Array of parameter definitions for validation"),
    response_example: z.string().default("").describe("Example JSON response for documentation"),
  },
  async ({ method, path, description, params, response_example }) => {
    try {
      const code = generateStandaloneEndpoint(method, path, description, params, response_example);

      let output = "// Express route handler: " + method + " " + path + "\n";
      output += "// " + description + "\n";
      const paramStr = params.length > 0
        ? params.map((p) => p.name + " (" + p.type + (p.required ? ", required" : "") + ")").join(", ")
        : "none";
      output += "// Params: " + paramStr + "\n\n";
      output += code;

      return { content: [{ type: "text", text: output }] };
    } catch (e: unknown) {
      return {
        content: [{ type: "text", text: "Error generating endpoint: " + (e as Error).message }],
        isError: true,
      };
    }
  }
);

// --- Tool: generate_middleware ---

server.tool(
  "generate_middleware",
  "Generate a complete Express middleware function (auth, rate-limit, cors, logging, or validation)",
  {
    type: z.enum(["auth", "rate-limit", "cors", "logging", "validation"]).describe("Middleware type to generate"),
  },
  async ({ type }) => {
    try {
      const code = generateMiddleware(type);

      let output = "// Express Middleware: " + type + "\n";
      output += "// Generated by API Forge MCP\n\n";
      output += code;

      return { content: [{ type: "text", text: output }] };
    } catch (e: unknown) {
      return {
        content: [{ type: "text", text: "Error generating middleware: " + (e as Error).message }],
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
