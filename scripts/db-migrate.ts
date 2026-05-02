// scripts/db-migrate.ts
// Tiny migration runner. Reads .sql files from db/migrations/, applies any
// not yet recorded in schema_migrations. Idempotent. Each file runs in its
// own transaction; a failure rolls that file back and halts the run.
//
// Usage:
//   npm run db:migrate             — apply pending migrations
//   npm run db:migrate -- --status — list applied vs pending
//   npm run db:migrate -- --reset  — drop ALL tables (dev only; refuses on prod)

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { sql } from "../lib/db";

const MIGRATIONS_DIR = join(process.cwd(), "db", "migrations");

interface MigrationRow {
  filename: string;
  applied_at: Date;
}

async function ensureMigrationsTable() {
  await sql`
    create table if not exists schema_migrations (
      filename text primary key,
      applied_at timestamptz not null default now()
    )
  `;
}

function listLocalMigrations(): string[] {
  return readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith(".sql"))
    .sort();
}

async function listAppliedMigrations(): Promise<Set<string>> {
  const rows = await sql<MigrationRow[]>`
    select filename, applied_at from schema_migrations order by filename
  `;
  return new Set(rows.map((r) => r.filename));
}

async function apply(filename: string): Promise<void> {
  const path = join(MIGRATIONS_DIR, filename);
  const body = readFileSync(path, "utf8");

  console.log(`→ applying ${filename}`);
  await sql.begin(async (tx) => {
    // postgres-js ships unsafe() for arbitrary statements. Each migration
    // file is one logical unit; statement splitting belongs in the SQL.
    await tx.unsafe(body);
    await tx`insert into schema_migrations (filename) values (${filename})`;
  });
  console.log(`  ✓ ${filename}`);
}

async function status(): Promise<void> {
  await ensureMigrationsTable();
  const local = listLocalMigrations();
  const applied = await listAppliedMigrations();
  console.log("Migrations status:");
  for (const f of local) {
    console.log(`  ${applied.has(f) ? "[x]" : "[ ]"} ${f}`);
  }
}

async function reset(): Promise<void> {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Refusing to reset in production (NODE_ENV=production).");
  }
  console.log("→ dropping all schema");
  // Drop in dependency-safe order: cascade everything in the public schema.
  await sql.unsafe(`
    drop schema public cascade;
    create schema public;
    grant all on schema public to public;
  `);
  console.log("  ✓ reset complete");
}

async function migrate(): Promise<void> {
  await ensureMigrationsTable();
  const local = listLocalMigrations();
  const applied = await listAppliedMigrations();
  const pending = local.filter((f) => !applied.has(f));

  if (pending.length === 0) {
    console.log("No pending migrations.");
    return;
  }

  for (const f of pending) {
    await apply(f);
  }

  console.log(`Applied ${pending.length} migration(s).`);
}

async function main() {
  const arg = process.argv[2];
  try {
    if (arg === "--status") {
      await status();
    } else if (arg === "--reset") {
      await reset();
      await migrate();
    } else {
      await migrate();
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("Migration failed:", msg);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

main();
