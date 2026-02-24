#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// === Theme Definitions ===

interface ThemeColors {
  bg: string;
  surface: string;
  surfaceAlt: string;
  accent: string;
  accentHover: string;
  text: string;
  textMuted: string;
  border: string;
}

const themes: Record<string, ThemeColors> = {
  dark: {
    bg: "#030712",
    surface: "#111827",
    surfaceAlt: "#1f2937",
    accent: "#818cf8",
    accentHover: "#6366f1",
    text: "#f9fafb",
    textMuted: "#9ca3af",
    border: "#374151",
  },
  light: {
    bg: "#ffffff",
    surface: "#f9fafb",
    surfaceAlt: "#f3f4f6",
    accent: "#4f46e5",
    accentHover: "#4338ca",
    text: "#111827",
    textMuted: "#6b7280",
    border: "#e5e7eb",
  },
};

// === HTML Escape Utility ===

function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// === Feature Icons ===

function getFeatureIcon(index: number): string {
  const icons = [
    "&#9889;", "&#128640;", "&#128736;", "&#128161;",
    "&#128170;", "&#127919;", "&#9733;", "&#128171;",
    "&#128274;", "&#128200;", "&#128293;", "&#9881;",
  ];
  return icons[index % icons.length];
}

// === Landing Page Generator ===

function generateLandingPage(
  productName: string,
  tagline: string,
  features: string[],
  ctaUrl: string,
  ctaText: string,
  theme: string
): string {
  const t = themes[theme] || themes.dark;

  const featureCards = features
    .map(
      (f, i) => `
        <div class="feature-card">
          <div class="feature-icon">${getFeatureIcon(i)}</div>
          <p class="feature-text">${esc(f)}</p>
        </div>`
    )
    .join("\n");

  const firstWord = esc(productName).split(" ")[0];
  const restWords = esc(productName).split(" ").slice(1).join(" ");
  const logoHtml = restWords ? `<span>${firstWord}</span> ${restWords}` : `<span>${firstWord}</span>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(productName)} — ${esc(tagline)}</title>
  <meta name="description" content="${esc(tagline)}">
  <meta property="og:title" content="${esc(productName)}">
  <meta property="og:description" content="${esc(tagline)}">
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(productName)}">
  <meta name="twitter:description" content="${esc(tagline)}">
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background: ${t.bg};
      color: ${t.text};
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
    }

    .container { max-width: 1120px; margin: 0 auto; padding: 0 24px; }

    nav { padding: 20px 0; border-bottom: 1px solid ${t.border}; }
    nav .container { display: flex; align-items: center; justify-content: space-between; }
    .logo { font-size: 1.25rem; font-weight: 700; color: ${t.text}; text-decoration: none; letter-spacing: -0.025em; }
    .logo span { color: ${t.accent}; }
    .nav-cta { display: inline-block; padding: 8px 20px; background: ${t.accent}; color: #fff; text-decoration: none; border-radius: 8px; font-size: 0.875rem; font-weight: 600; transition: background 0.2s; }
    .nav-cta:hover { background: ${t.accentHover}; }
    .hero { padding: 100px 0 80px; text-align: center; }
    .hero-badge { display: inline-block; padding: 6px 16px; background: ${t.surfaceAlt}; border: 1px solid ${t.border}; border-radius: 100px; font-size: 0.8rem; font-weight: 500; color: ${t.accent}; margin-bottom: 24px; letter-spacing: 0.05em; text-transform: uppercase; }
    .hero h1 { font-size: clamp(2.5rem, 6vw, 4rem); font-weight: 800; line-height: 1.1; letter-spacing: -0.03em; margin-bottom: 20px; }
    .hero p { font-size: 1.2rem; color: ${t.textMuted}; max-width: 600px; margin: 0 auto 40px; line-height: 1.7; }
    .hero-cta { display: inline-block; padding: 16px 40px; background: ${t.accent}; color: #fff; text-decoration: none; border-radius: 12px; font-size: 1.1rem; font-weight: 700; transition: background 0.2s, transform 0.15s; box-shadow: 0 4px 24px ${t.accent}33; }
    .hero-cta:hover { background: ${t.accentHover}; transform: translateY(-2px); }
    .features { padding: 80px 0; }
    .features h2 { text-align: center; font-size: 2rem; font-weight: 700; margin-bottom: 12px; letter-spacing: -0.02em; }
    .features .subtitle { text-align: center; color: ${t.textMuted}; font-size: 1.05rem; margin-bottom: 56px; }
    .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; }
    .feature-card { background: ${t.surface}; border: 1px solid ${t.border}; border-radius: 16px; padding: 32px 28px; transition: border-color 0.2s, transform 0.15s; }
    .feature-card:hover { border-color: ${t.accent}; transform: translateY(-4px); }
    .feature-icon { font-size: 2rem; margin-bottom: 16px; }
    .feature-text { font-size: 1rem; color: ${t.textMuted}; line-height: 1.65; }
    .cta-section { padding: 80px 0; text-align: center; }
    .cta-box { background: ${t.surface}; border: 1px solid ${t.border}; border-radius: 24px; padding: 64px 40px; }
    .cta-box h2 { font-size: 2rem; font-weight: 700; margin-bottom: 16px; letter-spacing: -0.02em; }
    .cta-box p { color: ${t.textMuted}; font-size: 1.05rem; margin-bottom: 32px; }
    .cta-button { display: inline-block; padding: 16px 48px; background: ${t.accent}; color: #fff; text-decoration: none; border-radius: 12px; font-size: 1.1rem; font-weight: 700; transition: background 0.2s, transform 0.15s; box-shadow: 0 4px 24px ${t.accent}33; }
    .cta-button:hover { background: ${t.accentHover}; transform: translateY(-2px); }
    footer { padding: 40px 0; text-align: center; border-top: 1px solid ${t.border}; color: ${t.textMuted}; font-size: 0.875rem; }

    @media (max-width: 640px) {
      .hero { padding: 60px 0 50px; }
      .hero h1 { font-size: 2rem; }
      .hero p { font-size: 1rem; }
      .features { padding: 50px 0; }
      .cta-box { padding: 40px 24px; }
    }
  </style>
</head>
<body>
  <nav>
    <div class="container">
      <a href="#" class="logo">${logoHtml}</a>
      <a href="${esc(ctaUrl)}" class="nav-cta">${esc(ctaText)}</a>
    </div>
  </nav>

  <section class="hero">
    <div class="container">
      <div class="hero-badge">Introducing ${esc(productName)}</div>
      <h1>${esc(tagline)}</h1>
      <p>Built for developers, designers, and makers who want to ship faster without sacrificing quality.</p>
      <a href="${esc(ctaUrl)}" class="hero-cta">${esc(ctaText)} &rarr;</a>
    </div>
  </section>

  <section class="features">
    <div class="container">
      <h2>Everything you need</h2>
      <p class="subtitle">Powerful features to help you build, ship, and grow.</p>
      <div class="features-grid">
${featureCards}
      </div>
    </div>
  </section>

  <section class="cta-section">
    <div class="container">
      <div class="cta-box">
        <h2>Ready to get started?</h2>
        <p>Join thousands of developers already using ${esc(productName)}.</p>
        <a href="${esc(ctaUrl)}" class="cta-button">${esc(ctaText)} &rarr;</a>
      </div>
    </div>
  </section>

  <footer>
    <div class="container">
      <p>&copy; ${new Date().getFullYear()} ${esc(productName)}. All rights reserved.</p>
    </div>
  </footer>
</body>
</html>`;
}

// === Product Card Generator ===

function generateProductCard(
  name: string,
  description: string,
  price: string,
  url: string,
  badge?: string
): string {
  const badgeHtml = badge
    ? `<span style="position:absolute;top:16px;right:16px;background:#818cf8;color:#fff;font-size:0.7rem;font-weight:700;padding:4px 10px;border-radius:100px;text-transform:uppercase;letter-spacing:0.05em;">${esc(badge)}</span>`
    : "";

  return `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;background:#111827;border:1px solid #374151;border-radius:16px;padding:28px 24px;max-width:340px;color:#f9fafb;position:relative;overflow:hidden;">
  ${badgeHtml}
  <h3 style="font-size:1.25rem;font-weight:700;margin:0 0 8px 0;letter-spacing:-0.02em;color:#f9fafb;">${esc(name)}</h3>
  <p style="font-size:0.9rem;color:#9ca3af;margin:0 0 20px 0;line-height:1.6;">${esc(description)}</p>
  <div style="display:flex;align-items:center;justify-content:space-between;">
    <span style="font-size:1.5rem;font-weight:800;color:#f9fafb;letter-spacing:-0.02em;">${esc(price)}</span>
    <a href="${esc(url)}" style="display:inline-block;padding:10px 24px;background:#818cf8;color:#fff;text-decoration:none;border-radius:10px;font-size:0.875rem;font-weight:600;">Buy Now</a>
  </div>
</div>`;
}

// === Pricing Table Generator ===

interface PricingPlan {
  name: string;
  price: string;
  features: string[];
  highlighted: boolean;
}

function generatePricingTable(plans: PricingPlan[]): string {
  const planCards = plans
    .map((plan) => {
      const hl = plan.highlighted;
      const featuresHtml = plan.features
        .map(
          (f) => `<li style="padding:10px 0;border-bottom:1px solid #1f2937;color:#d1d5db;font-size:0.9rem;display:flex;align-items:center;gap:8px;"><span style="color:${hl ? "#818cf8" : "#6b7280"};font-size:1rem;">&#10003;</span>${esc(f)}</li>`
        )
        .join("\n        ");

      const popularBadge = hl
        ? `<div style="position:absolute;top:-14px;left:50%;transform:translateX(-50%);background:#818cf8;color:#fff;font-size:0.75rem;font-weight:700;padding:5px 16px;border-radius:100px;text-transform:uppercase;letter-spacing:0.05em;">Most Popular</div>`
        : "";

      const borderStyle = hl ? "2px solid #818cf8" : "1px solid #374151";
      const bgColor = hl ? "#1e1b4b" : "#111827";
      const extraStyle = hl ? "transform:scale(1.04);box-shadow:0 8px 40px #818cf822;" : "";
      const btnBg = hl ? "#818cf8" : "transparent";
      const btnBorder = hl ? "none" : "1px solid #374151";
      const btnColor = hl ? "#fff" : "#d1d5db";

      return `<div style="background:${bgColor};border:${borderStyle};border-radius:20px;padding:36px 28px;flex:1;min-width:260px;max-width:380px;position:relative;${extraStyle}">
      ${popularBadge}
      <h3 style="font-size:1.1rem;font-weight:600;color:#9ca3af;margin:0 0 8px 0;text-transform:uppercase;letter-spacing:0.05em;">${esc(plan.name)}</h3>
      <div style="font-size:2.75rem;font-weight:800;color:#f9fafb;margin:0 0 24px 0;letter-spacing:-0.03em;line-height:1;">${esc(plan.price)}</div>
      <ul style="list-style:none;padding:0;margin:0 0 28px 0;">
        ${featuresHtml}
      </ul>
      <a href="#" style="display:block;text-align:center;padding:14px 0;background:${btnBg};border:${btnBorder};color:${btnColor};text-decoration:none;border-radius:12px;font-size:0.95rem;font-weight:600;">Get Started</a>
    </div>`;
    })
    .join("\n    ");

  return `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;background:#030712;padding:80px 24px;color:#f9fafb;">
  <div style="text-align:center;margin-bottom:56px;">
    <h2 style="font-size:2.25rem;font-weight:800;letter-spacing:-0.03em;margin:0 0 12px 0;color:#f9fafb;">Simple, transparent pricing</h2>
    <p style="font-size:1.05rem;color:#9ca3af;margin:0;">Choose the plan that fits your needs. Upgrade anytime.</p>
  </div>
  <div style="display:flex;gap:24px;justify-content:center;align-items:flex-start;flex-wrap:wrap;max-width:1120px;margin:0 auto;">
    ${planCards}
  </div>
</div>`;
}

// === MCP Server Setup ===

const server = new McpServer({
  name: "landing-forge-mcp",
  version: "1.0.0",
});

// --- Tool: generate_landing_page ---

server.tool(
  "generate_landing_page",
  "Generate a complete, production-ready HTML landing page with responsive design, hero section, features grid, CTA, and footer. Returns a self-contained HTML document with inline CSS and no external dependencies.",
  {
    product_name: z.string().describe("Name of the product or tool"),
    tagline: z.string().describe("Short, compelling tagline or headline"),
    features: z.array(z.string()).describe("List of feature descriptions (3-12 recommended)"),
    cta_url: z.string().describe("URL for the call-to-action button"),
    cta_text: z.string().default("Get Started").describe("Text for the CTA button"),
    theme: z.enum(["dark", "light"]).default("dark").describe("Color theme: dark (default) or light"),
  },
  async ({ product_name, tagline, features, cta_url, cta_text, theme }) => {
    try {
      const html = generateLandingPage(product_name, tagline, features, cta_url, cta_text, theme);
      return {
        content: [{ type: "text" as const, text: html }],
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return {
        content: [{ type: "text" as const, text: "Error generating landing page: " + message }],
        isError: true,
      };
    }
  }
);

// --- Tool: generate_product_card ---

server.tool(
  "generate_product_card",
  "Generate a standalone HTML product card component with inline CSS. Perfect for embedding in landing pages, stores, or product showcases.",
  {
    name: z.string().describe("Product name"),
    description: z.string().describe("Short product description"),
    price: z.string().describe("Price string (e.g. $29, Free, $9/mo)"),
    url: z.string().describe("URL the buy/action button links to"),
    badge: z.string().optional().describe("Optional badge text (e.g. NEW, POPULAR, SALE)"),
  },
  async ({ name, description, price, url, badge }) => {
    try {
      const html = generateProductCard(name, description, price, url, badge);
      return {
        content: [{ type: "text" as const, text: html }],
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return {
        content: [{ type: "text" as const, text: "Error generating product card: " + message }],
        isError: true,
      };
    }
  }
);

// --- Tool: generate_pricing_table ---

server.tool(
  "generate_pricing_table",
  "Generate a complete pricing table HTML component with multiple plan columns. Supports highlighting a recommended plan. Uses dark theme with inline CSS.",
  {
    plans: z
      .array(
        z.object({
          name: z.string().describe("Plan name (e.g. Starter, Pro, Enterprise)"),
          price: z.string().describe("Price string (e.g. $9/mo, $49/mo, Custom)"),
          features: z.array(z.string()).describe("List of features included in this plan"),
          highlighted: z.boolean().describe("Whether this plan should be visually highlighted as recommended"),
        })
      )
      .describe("Array of pricing plans to display"),
  },
  async ({ plans }) => {
    try {
      const html = generatePricingTable(plans);
      return {
        content: [{ type: "text" as const, text: html }],
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return {
        content: [{ type: "text" as const, text: "Error generating pricing table: " + message }],
        isError: true,
      };
    }
  }
);

// === Start Server ===

async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
