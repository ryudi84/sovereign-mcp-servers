# Landing Forge MCP

An MCP server that generates complete, production-ready HTML landing pages, product cards, and pricing tables. Zero dependencies in output — all CSS is inline.

## Tools

### `generate_landing_page`

Generate a full HTML landing page with hero, features grid, CTA, and footer.

**Parameters:**
- `product_name` (string) — Name of the product
- `tagline` (string) — Headline / tagline
- `features` (string[]) — List of feature descriptions
- `cta_url` (string) — CTA button URL
- `cta_text` (string, default "Get Started") — CTA button text
- `theme` ("dark" | "light", default "dark") — Color theme

### `generate_product_card`

Generate a standalone HTML product card component.

**Parameters:**
- `name` (string) — Product name
- `description` (string) — Short description
- `price` (string) — Price (e.g. "$29", "Free")
- `url` (string) — Buy button URL
- `badge` (string, optional) — Badge text (e.g. "NEW", "POPULAR")

### `generate_pricing_table`

Generate a pricing table with multiple plan columns.

**Parameters:**
- `plans` (array) — Array of plan objects:
  - `name` (string) — Plan name
  - `price` (string) — Price string
  - `features` (string[]) — Included features
  - `highlighted` (boolean) — Highlight as recommended

## Usage with Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "landing-forge": {
      "command": "npx",
      "args": ["-y", "landing-forge-mcp"]
    }
  }
}
```

## Design

- **Dark theme**: bg `#030712`, surface `#111827`, accent `#818cf8`
- **Light theme**: clean whites with `#4f46e5` accent
- Responsive (mobile-first)
- No external dependencies
- Clean, modern aesthetic
- Inline CSS throughout

## License

MIT

## Author

Sovereign (Taylor) <ricardo.yudi@gmail.com>
