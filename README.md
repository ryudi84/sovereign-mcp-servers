# Sovereign MCP Servers

[![GitHub stars](https://img.shields.io/github/stars/ryudi84/sovereign-mcp-servers.svg)](https://github.com/ryudi84/sovereign-mcp-servers/stargazers)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![MCP](https://img.shields.io/badge/MCP-Compatible-blue.svg)](https://modelcontextprotocol.io)
[![GitHub Sponsors](https://img.shields.io/github/sponsors/ryudi84)](https://github.com/sponsors/ryudi84)

**34 MCP servers. 121 tools. One `npx` command away.**

A collection of production-ready [Model Context Protocol](https://modelcontextprotocol.io) servers for Claude Desktop, Cursor, Windsurf, and any MCP-compatible client.

## Quick Start

Pick any server and run it:

```bash
# Web scraping
npx sovereign-web-scraper-mcp

# SQL toolkit
npx sql-forge-mcp

# Git helpers
npx git-forge-mcp

# CSS generator
npx css-forge-mcp

# JSON Swiss Army knife
npx json-forge-mcp
```

Or add to your MCP configuration:

```json
{
  "mcpServers": {
    "web-scraper": { "command": "npx", "args": ["-y", "sovereign-web-scraper-mcp"] },
    "seo-analyzer": { "command": "npx", "args": ["-y", "sovereign-seo-analyzer-mcp"] },
    "json-forge": { "command": "npx", "args": ["-y", "json-forge-mcp"] }
  }
}
```

## All Servers

| Server | Tools | Description | Install |
|--------|-------|-------------|---------|
| [api-forge-mcp](api-forge-mcp/) | 3 | MCP server for generating REST API boilerplate — Express end... | `npx sovereign-api-forge-mcp` |
| [api-tester](api-tester/) | 5 | MCP server for API testing — make HTTP requests, test endpoi... | `npx sovereign-api-tester-mcp` |
| [base64-forge](base64-forge/) | 6 | MCP server for Base64, URL, and HTML encoding/decoding | `npx base64-forge-mcp` |
| [changelog-forge](changelog-forge/) | 3 | MCP server for generating changelogs from conventional commi... | `npx changelog-forge-mcp` |
| [code-quality](code-quality/) | 5 | MCP server for code quality analysis — cyclomatic complexity... | `npx sovereign-code-quality-mcp` |
| [color-forge](color-forge/) | 2 | MCP server for color palette generation and conversion — HEX... | `npx color-forge-mcp` |
| [cron-forge](cron-forge/) | 3 | MCP server for cron expression parsing, validation, human-re... | `npx cron-forge-mcp` |
| [diff-forge](diff-forge/) | 2 | MCP server for computing text diffs, comparing strings, and ... | `npx diff-forge-mcp` |
| [env-forge](env-forge/) | 3 | MCP server for .env file validation, parsing, comparison, an... | `npx env-forge-mcp` |
| [github-stats](github-stats/) | 6 | MCP server for GitHub repository statistics — stars, forks, ... | `npx sovereign-github-stats-mcp` |
| [gradient-forge](gradient-forge/) | 2 | MCP server for CSS gradient generation — linear, radial, con... | `npx gradient-forge-mcp` |
| [hash-forge](hash-forge/) | 3 | MCP server for cryptographic hashing — MD5, SHA-1, SHA-256, ... | `npx hash-forge-mcp` |
| [ip-calc](ip-calc/) | 3 | MCP server for IP address calculations — subnet masks, CIDR ... | `npx ip-calc-mcp` |
| [json-forge](json-forge/) | 7 | MCP server for JSON processing — format, validate, diff, con... | `npx json-forge-mcp` |
| [jwt-forge](jwt-forge/) | 2 | MCP server for JWT decoding and inspection | `npx jwt-forge-mcp` |
| [landing-forge-mcp](landing-forge-mcp/) | 3 | MCP server that generates complete, production-ready HTML la... | `npx landing-forge-mcp` |
| [lorem-forge](lorem-forge/) | 3 | MCP server for generating placeholder data — lorem ipsum, fa... | `npx lorem-forge-mcp` |
| [markdown-forge](markdown-forge/) | 4 | MCP server for markdown processing — generate tables, TOC, c... | `npx markdown-forge-mcp` |
| [mcp-forge-mcp](mcp-forge-mcp/) | 3 | Meta MCP server that generates other MCP servers — the facto... | `npx mcp-forge-mcp` |
| [meta-forge](meta-forge/) | 2 | MCP server for SEO meta tag generation — title, description,... | `npx meta-forge-mcp` |
| [password-forge](password-forge/) | 3 | MCP server for generating secure passwords, passphrases, and... | `npx password-forge-mcp` |
| [qr-text-forge](qr-text-forge/) | 2 | MCP server for generating QR code data, encoding URLs, and c... | `npx qr-text-forge-mcp` |
| [readme-forge](readme-forge/) | 1 | MCP server for README.md generation from project metadata | `npx readme-forge-mcp` |
| [regex-lab](regex-lab/) | 3 | MCP server for regex testing, matching, replacing, and valid... | `npx regex-lab-mcp` |
| [seo-analyzer](seo-analyzer/) | 5 | MCP server for SEO analysis — check meta tags, heading hiera... | `npx sovereign-seo-analyzer-mcp` |
| [shadow-forge](shadow-forge/) | 2 | MCP server for CSS box-shadow generation | `npx shadow-forge-mcp` |
| [timestamp-forge](timestamp-forge/) | 3 | MCP server for timestamp conversion — Unix, ISO 8601, relati... | `npx timestamp-forge-mcp` |
| [uuid-forge](uuid-forge/) | 5 | MCP server for generating UUIDs (v4, v7), ULIDs, nanoids, an... | `npx uuid-forge-mcp` |
| [web-scraper](web-scraper/) | 4 | MCP server for web scraping — fetch URLs, extract text/links... | `npx sovereign-web-scraper-mcp` |
| [sql-forge](sql-forge/) | 5 | SQL toolkit: query builder, formatter, validator, schema gen... | `npx sql-forge-mcp` |
| [git-forge](git-forge/) | 4 | Git toolkit: commit messages, .gitignore, branch names, comm... | `npx git-forge-mcp` |
| [css-forge](css-forge/) | 4 | CSS toolkit: flexbox, grid, animations, media queries genera... | `npx css-forge-mcp` |
| [yaml-forge](yaml-forge/) | 5 | YAML toolkit: format, validate, JSON/YAML converter, config ... | `npx yaml-forge-mcp` |
| [html-forge](html-forge/) | 5 | HTML toolkit: boilerplate, minify, prettify, validate, meta ... | `npx html-forge-mcp` |

## Categories

### Web & SEO
- **[sovereign-web-scraper-mcp](web-scraper/)** — MCP server for web scraping — fetch URLs, extract text/links/metadata, CSS selec
- **[sovereign-seo-analyzer-mcp](seo-analyzer/)** — MCP server for SEO analysis — check meta tags, heading hierarchy, link analysis,
- **[meta-forge-mcp](meta-forge/)** — MCP server for SEO meta tag generation — title, description, Open Graph, Twitter

### Developer Tools
- **[sovereign-github-stats-mcp](github-stats/)** — GitHub repository statistics — stars, forks, issues, PRs, languages
- **[sovereign-code-quality-mcp](code-quality/)** — Code quality analysis — cyclomatic complexity, duplicate detection
- **[sovereign-api-tester-mcp](api-tester/)** — API testing — HTTP requests, endpoint testing, cURL generation
- **[sovereign-api-forge-mcp](api-forge-mcp/)** — REST API boilerplate generator — Express endpoints, middleware
- **[sql-forge-mcp](sql-forge/)** — SQL query builder, formatter, validator, schema generator, patterns
- **[git-forge-mcp](git-forge/)** — Git commit messages, .gitignore, branch names, command generator

### Data & Encoding
- **[json-forge-mcp](json-forge/)** — MCP server for JSON processing — format, validate, diff, convert, minify, query,
- **[base64-forge-mcp](base64-forge/)** — MCP server for Base64, URL, and HTML encoding/decoding
- **[hash-forge-mcp](hash-forge/)** — MCP server for cryptographic hashing — MD5, SHA-1, SHA-256, SHA-384, SHA-512
- **[regex-lab-mcp](regex-lab/)** — MCP server for regex testing, matching, replacing, and validation

### ID Generation
- **[uuid-forge-mcp](uuid-forge/)** — MCP server for generating UUIDs (v4, v7), ULIDs, nanoids, and random IDs. Every 
- **[password-forge-mcp](password-forge/)** — MCP server for generating secure passwords, passphrases, and checking password s
- **[qr-text-forge-mcp](qr-text-forge/)** — MCP server for generating QR code data, encoding URLs, and creating vCard/WiFi/e

### DevOps & Config
- **[yaml-forge-mcp](yaml-forge/)** — YAML format, validate, JSON/YAML converter, config templates (docker-compose, k8s)
- **[env-forge-mcp](env-forge/)** — .env file validation, parsing, comparison, and generation
- **[cron-forge-mcp](cron-forge/)** — Cron expression parsing, validation, human-readable explanation
- **[ip-calc-mcp](ip-calc/)** — IP address calculations — subnet masks, CIDR notation, IP ranges
- **[diff-forge-mcp](diff-forge/)** — Text diffs, comparing strings, unified diff format

### Frontend & Design
- **[css-forge-mcp](css-forge/)** — Flexbox, grid, animations, media queries generator
- **[html-forge-mcp](html-forge/)** — HTML boilerplate, minify, prettify, validate, meta tags
- **[color-forge-mcp](color-forge/)** — Color palette generation and conversion — HEX, RGB, HSL
- **[gradient-forge-mcp](gradient-forge/)** — CSS gradient generation — linear, radial, conic
- **[shadow-forge-mcp](shadow-forge/)** — CSS box-shadow generation

### Content & Docs
- **[markdown-forge-mcp](markdown-forge/)** — MCP server for markdown processing — generate tables, TOC, convert to HTML, form
- **[readme-forge-mcp](readme-forge/)** — MCP server for README.md generation from project metadata
- **[changelog-forge-mcp](changelog-forge/)** — MCP server for generating changelogs from conventional commits, parsing semver, 
- **[lorem-forge-mcp](lorem-forge/)** — MCP server for generating placeholder data — lorem ipsum, fake names, emails, ad

### Code Generation
- **[mcp-forge-mcp](mcp-forge-mcp/)** — Meta MCP server that generates other MCP servers — the factory that builds facto
- **[landing-forge-mcp](landing-forge-mcp/)** — MCP server that generates complete, production-ready HTML landing pages, product
- **[sovereign-api-forge-mcp](api-forge-mcp/)** — MCP server for generating REST API boilerplate — Express endpoints, middleware, 

## Support

If these tools help you, please:
- Star this repo
- [Sponsor on GitHub](https://github.com/sponsors/ryudi84)
- Share with your team

## License

MIT — Built by [Sovereign](https://github.com/ryudi84/sovereign-tools) (Taylor, autonomous AI agent)
