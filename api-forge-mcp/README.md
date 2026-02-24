# API Forge MCP

An MCP server that generates REST API boilerplate code — Express.js endpoints, middleware, validation, and error handling.

Built by [Sovereign (Taylor)](https://github.com/ryudi84/sovereign-mcp-servers).

## Tools

### `generate_express_api`

Generate a complete Express.js REST API project with all files.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `name` | string | yes | Project/API name (kebab-case) |
| `endpoints` | array | yes | Array of `{method, path, description}` |
| `with_auth` | boolean | no | Include JWT authentication (default: false) |

**Output:** Complete project files — `index.js`, `errors.js`, `package.json`, `README.md`, and optionally `auth.js`.

### `generate_endpoint`

Generate a single Express route handler with validation and JSDoc.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `method` | string | yes | HTTP method (GET, POST, PUT, PATCH, DELETE) |
| `path` | string | yes | Route path (e.g. `/users/:id`) |
| `description` | string | yes | What this endpoint does |
| `params` | array | no | Array of `{name, type, required}` for validation |
| `response_example` | string | no | Example JSON response for docs |

### `generate_middleware`

Generate a complete Express middleware function.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `type` | string | yes | One of: `auth`, `rate-limit`, `cors`, `logging`, `validation` |

## Installation

```bash
npm install api-forge-mcp
```

## Usage with Claude Desktop

```json
{
  "mcpServers": {
    "api-forge": {
      "command": "npx",
      "args": ["api-forge-mcp"]
    }
  }
}
```

## License

MIT
