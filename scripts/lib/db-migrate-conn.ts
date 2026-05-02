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

let cached: Sql | undefined;

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
