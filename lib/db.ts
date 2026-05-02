// Postgres client. Single shared connection pool, lazily initialized,
// reused across the serverless instance.

import postgres, { type Sql } from "postgres";

declare global {
  var __perksDb: Sql | undefined;
}

function getDb(): Sql {
  if (globalThis.__perksDb) return globalThis.__perksDb;

  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "Missing DATABASE_URL. Set it to your Neon Postgres connection string in .env.local and Vercel project env.",
    );
  }

  // Neon recommends `prepare: false` for the pooled connection string and a
  // small max for serverless (each invocation gets its own pool).
  const client = postgres(url, {
    max: 1,
    prepare: false,
    idle_timeout: 20,
    connect_timeout: 10,
  });

  globalThis.__perksDb = client;
  return client;
}

// Proxy target must be callable so the `apply` trap fires when `sql` is used
// as a tagged template (sql`select ...`). A plain `{}` target makes the
// Proxy non-callable and the engine throws before reaching `apply`.
const sqlTarget = (() => {}) as unknown as Sql;

export const sql = new Proxy(sqlTarget, {
  get(_t, key) {
    const inst = getDb() as unknown as Record<string | symbol, unknown>;
    const v = inst[key];
    return typeof v === "function" ? v.bind(inst) : v;
  },
  apply(_t, _this, args) {
    return (getDb() as unknown as (...a: unknown[]) => unknown)(...args);
  },
}) as Sql;

// Postgres "undefined_table" error — fired when a query references a
// table the database doesn't have yet (typically because migrations
// haven't been run). Used to soft-fail post-cutover queries on tables
// like user_self_reported so login still works on a partially-migrated
// database; callers treat the missing data as empty.
export function isUndefinedTableError(e: unknown): boolean {
  if (!e || typeof e !== "object") return false;
  const code = (e as { code?: string }).code;
  if (code === "42P01") return true;
  const msg = (e as { message?: string }).message ?? "";
  return /relation .* does not exist/i.test(msg);
}
