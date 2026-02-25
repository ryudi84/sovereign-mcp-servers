#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";


// SQL formatting helper
function formatSql(sql: string): string {
  const keywords = ['SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN',
    'ON', 'AND', 'OR', 'ORDER BY', 'GROUP BY', 'HAVING', 'LIMIT', 'OFFSET', 'INSERT INTO',
    'VALUES', 'UPDATE', 'SET', 'DELETE FROM', 'CREATE TABLE', 'ALTER TABLE', 'DROP TABLE',
    'CREATE INDEX', 'UNION', 'UNION ALL', 'AS', 'IN', 'NOT IN', 'EXISTS', 'BETWEEN', 'LIKE',
    'IS NULL', 'IS NOT NULL', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'DISTINCT', 'COUNT',
    'SUM', 'AVG', 'MIN', 'MAX'];
  let formatted = sql.trim();
  // Uppercase keywords
  for (const kw of keywords) {
    formatted = formatted.replace(new RegExp('\\b' + kw.replace(' ', '\\s+') + '\\b', 'gi'), kw);
  }
  // Add newlines before major clauses
  const breakBefore = ['SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN',
    'ORDER BY', 'GROUP BY', 'HAVING', 'LIMIT', 'UNION', 'INSERT INTO', 'UPDATE', 'SET', 'DELETE FROM',
    'VALUES', 'CREATE TABLE', 'ALTER TABLE'];
  for (const kw of breakBefore) {
    formatted = formatted.replace(new RegExp('\\s+(' + kw.replace(' ', '\\s+') + ')\\b', 'gi'), '\n$1');
  }
  return formatted.trim();
}

// Simple SQL syntax checker
function checkSqlSyntax(sql: string): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  const upper = sql.toUpperCase().trim();
  if (upper.startsWith('SELECT') && !upper.includes('FROM')) issues.push('SELECT without FROM clause');
  if (upper.includes('WHERE') && !upper.includes('SELECT') && !upper.includes('UPDATE') && !upper.includes('DELETE')) {
    issues.push('WHERE clause without SELECT/UPDATE/DELETE');
  }
  const opens = (sql.match(/\(/g) || []).length;
  const closes = (sql.match(/\)/g) || []).length;
  if (opens !== closes) issues.push(`Unbalanced parentheses: ${opens} open, ${closes} close`);
  if (sql.includes("'") && (sql.match(/'/g) || []).length % 2 !== 0) {
    issues.push('Unbalanced single quotes');
  }
  return { valid: issues.length === 0, issues };
}


// === MCP Server Setup ===

const server = new McpServer(
  { name: "sql-forge", version: "1.0.0" },
  {
    capabilities: { tools: {} },
    instructions: "MCP server for SQL — query builder, syntax validator, schema generator, query formatter, common patterns.",
  }
);

// Tool: format_sql
server.tool(
  "format_sql",
  "Format and prettify SQL queries with proper indentation and keyword capitalization.",
  {
    sql: z.string().describe("SQL query to format")
  },
  async ({ sql }) => {
    try {
      const formatted = formatSql(sql);
      return { content: [{ type: "text", text: `\`\`\`sql\n${formatted}\n\`\`\`` }] };
    } catch (e: unknown) {
      return { content: [{ type: "text", text: `Error: ${(e as Error).message}` }], isError: true };
    }
  }
);

// Tool: validate_sql
server.tool(
  "validate_sql",
  "Check SQL syntax for common issues (unbalanced parens, missing clauses, quote errors).",
  {
    sql: z.string().describe("SQL query to validate")
  },
  async ({ sql }) => {
    try {
      const result = checkSqlSyntax(sql);
      if (result.valid) {
        return { content: [{ type: "text", text: "PASS: No syntax issues found." }] };
      }
      return { content: [{ type: "text", text: `FAIL: ${result.issues.length} issue(s) found:\n\n${result.issues.map((i, n) => `${n+1}. ${i}`).join("\n")}` }] };
    } catch (e: unknown) {
      return { content: [{ type: "text", text: `Error: ${(e as Error).message}` }], isError: true };
    }
  }
);

// Tool: build_select
server.tool(
  "build_select",
  "Build a SELECT query from table, columns, conditions, ordering.",
  {
    table: z.string().describe("Table name"),
    columns: z.array(z.string()).default(['*']).describe("Columns to select"),
    where: z.string().optional().describe("WHERE condition"),
    order_by: z.string().optional().describe("ORDER BY clause"),
    limit: z.number().optional().describe("LIMIT value")
  },
  async ({ table, columns, where, order_by, limit }) => {
    try {
      let q = `SELECT ${columns.join(", ")}\nFROM ${table}`;
      if (where) q += `\nWHERE ${where}`;
      if (order_by) q += `\nORDER BY ${order_by}`;
      if (limit) q += `\nLIMIT ${limit}`;
      return { content: [{ type: "text", text: `\`\`\`sql\n${q}\n\`\`\`` }] };
    } catch (e: unknown) {
      return { content: [{ type: "text", text: `Error: ${(e as Error).message}` }], isError: true };
    }
  }
);

// Tool: build_create_table
server.tool(
  "build_create_table",
  "Generate CREATE TABLE SQL from column definitions.",
  {
    table: z.string().describe("Table name"),
    columns: z.array(z.object({ name: z.string(), type: z.string(), nullable: z.boolean().default(true), primary: z.boolean().default(false) })).describe("Column definitions")
  },
  async ({ table, columns }) => {
    try {
      const colDefs = columns.map(c => {
        let def = `  ${c.name} ${c.type.toUpperCase()}`;
        if (c.primary) def += " PRIMARY KEY";
        if (!c.nullable && !c.primary) def += " NOT NULL";
        return def;
      });
      const sql = `CREATE TABLE ${table} (\n${colDefs.join(",\n")}\n);`;
      return { content: [{ type: "text", text: `\`\`\`sql\n${sql}\n\`\`\`` }] };
    } catch (e: unknown) {
      return { content: [{ type: "text", text: `Error: ${(e as Error).message}` }], isError: true };
    }
  }
);

// Tool: sql_patterns
server.tool(
  "sql_patterns",
  "Get common SQL patterns/snippets (pagination, upsert, pivot, CTE, window functions).",
  {
    pattern: z.enum(["pagination", "upsert", "cte", "window", "pivot", "soft_delete", "audit"]).describe("Pattern name")
  },
  async ({ pattern }) => {
    try {
      const patterns: Record<string, string> = {
        pagination: "SELECT * FROM table_name\nORDER BY id\nLIMIT :page_size OFFSET (:page - 1) * :page_size;",
        upsert: "INSERT INTO table_name (id, col1, col2)\nVALUES (:id, :val1, :val2)\nON CONFLICT (id) DO UPDATE SET\n  col1 = EXCLUDED.col1,\n  col2 = EXCLUDED.col2;",
        cte: "WITH ranked AS (\n  SELECT *, ROW_NUMBER() OVER (PARTITION BY category ORDER BY score DESC) as rn\n  FROM items\n)\nSELECT * FROM ranked WHERE rn <= 3;",
        window: "SELECT name, department, salary,\n  AVG(salary) OVER (PARTITION BY department) as dept_avg,\n  RANK() OVER (ORDER BY salary DESC) as salary_rank\nFROM employees;",
        pivot: "SELECT\n  category,\n  SUM(CASE WHEN month = 'Jan' THEN amount ELSE 0 END) as jan,\n  SUM(CASE WHEN month = 'Feb' THEN amount ELSE 0 END) as feb,\n  SUM(CASE WHEN month = 'Mar' THEN amount ELSE 0 END) as mar\nFROM sales GROUP BY category;",
        soft_delete: "-- Add soft delete column\nALTER TABLE table_name ADD COLUMN deleted_at TIMESTAMP NULL;\n\n-- Query only active records\nSELECT * FROM table_name WHERE deleted_at IS NULL;\n\n-- Soft delete\nUPDATE table_name SET deleted_at = NOW() WHERE id = :id;",
        audit: "CREATE TABLE audit_log (\n  id SERIAL PRIMARY KEY,\n  table_name VARCHAR(100),\n  record_id INTEGER,\n  action VARCHAR(10),\n  old_data JSONB,\n  new_data JSONB,\n  changed_by VARCHAR(100),\n  changed_at TIMESTAMP DEFAULT NOW()\n);"
      };
      const p = patterns[pattern] || "Unknown pattern";
      return { content: [{ type: "text", text: `# SQL Pattern: ${pattern}\n\n\`\`\`sql\n${p}\n\`\`\`` }] };
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
