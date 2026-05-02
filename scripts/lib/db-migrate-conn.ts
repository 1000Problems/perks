// Migration-side DB connection.
//
// Long-running migrations and dry-runs hold a single transaction across
// hundreds of INSERTs. Neon's pooler runs in transaction-pooling mode
// and kills idle-in-transaction connections at ~15s, which trips
// CONNECTION_CLOSED mid-seed when migrating the full catalog.
//
// To avoid that, this module prefers DATABASE_URL_DIRECT (the unpooled
// Neon URL) when set, and falls back to DATABASE_URL otherwise. Set
// DATABASE_URL_DIRECT in .env.local to the connection string from the
// Neon dashboard WITHOUT the `-pooler` suffix in the host.
//
// Used by:
//   - scripts/migrate-cards-to-db.ts
//   - scripts/verify-cards-soul-parity.ts
//   - scripts/db-migrate.ts (schema migrations)
//
// The app code (lib/db.ts) keeps using the pooled URL.

import postgres, { type Sql } from "postgres";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

let cached: Sql | undefined;

// ── inline dotenv loader ──────────────────────────────────────────────
//
// tsx (and bare node) don't auto-load .env files. Next.js does for
// `next dev` / `next build`, but our migration CLIs run outside Next.
// To avoid a hard dep on dotenv, we parse .env.local and .env ourselves
// at module-load time. Existing process.env values always win — we only
// fill in keys that aren't already set, so explicit `export FOO=...` in
// the shell still takes priority.
//
// .env.local is read first (highest priority among files), then .env.
// This matches the precedence Next.js uses for client-side rendering.

function parseDotenv(text: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const rawLine of text.split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq < 0) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    // Strip surrounding quotes if matched.
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!key) continue;
    out[key] = value;
  }
  return out;
}

function loadDotenvFiles(): void {
  const cwd = process.cwd();
  for (const filename of [".env.local", ".env"]) {
    const path = resolve(cwd, filename);
    if (!existsSync(path)) continue;
    let parsed: Record<string, string>;
    try {
      parsed = parseDotenv(readFileSync(path, "utf8"));
    } catch {
      continue;
    }
    for (const [k, v] of Object.entries(parsed)) {
      if (!(k in process.env)) process.env[k] = v;
    }
  }
}

loadDotenvFiles();

export function getMigrationDb(): Sql {
  if (cached) return cached;

  const direct = process.env.DATABASE_URL_DIRECT;
  const pooled = process.env.DATABASE_URL;
  const url = direct ?? pooled;

  if (!url) {
    throw new Error(
      "Missing DATABASE_URL_DIRECT (preferred) or DATABASE_URL. " +
        "Set DATABASE_URL_DIRECT to your Neon UNPOOLED connection string for migrations.",
    );
  }
  if (!direct) {
    console.warn(
      "[db-migrate-conn] DATABASE_URL_DIRECT not set; falling back to DATABASE_URL. " +
        "Long-running migrations may hit Neon's pooled transaction timeout. " +
        "Recommended: add the unpooled URL (no `-pooler` in host) to .env.local.",
    );
  }

  cached = postgres(url, {
    // Higher ceilings for migrations; we hold connections longer than the
    // serverless app does and don't need aggressive idle eviction.
    max: 1,
    prepare: false,
    idle_timeout: 60,
    connect_timeout: 30,
    // Keep statement timeout off here — schema migrations and bulk
    // upserts can legitimately take a while.
  });

  return cached;
}
