// scripts/flags-resolve.ts — resolve open perk-source flags
// (TASK-perk-source-flags). Run via:
//
//   npm run flags:resolve -- \
//     --card citi_strata_premier \
//     --perk "Trip Delay Protection" \
//     [--user <user_id>] \
//     [--note "fixed in markdown"] \
//     [--yes]
//
// Without --user, resolves every open flag matching (card, perk).
// With --user, resolves only that user's flag. --yes skips the
// confirmation prompt.

import { createInterface } from "node:readline/promises";
// Use the migration-side connection — it loads .env.local on module
// import. The app-side lib/db.ts depends on Next.js env loading.
import { getMigrationDb } from "./lib/db-migrate-conn";
const sql = getMigrationDb();

interface Args {
  cardId: string;
  perkName: string;
  userId: string | null;
  note: string | null;
  yes: boolean;
}

function parseArgs(): Args {
  const argv = process.argv.slice(2);
  let cardId: string | null = null;
  let perkName: string | null = null;
  let userId: string | null = null;
  let note: string | null = null;
  let yes = false;
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--card") cardId = argv[++i] ?? null;
    else if (a === "--perk") perkName = argv[++i] ?? null;
    else if (a === "--user") userId = argv[++i] ?? null;
    else if (a === "--note") note = argv[++i] ?? null;
    else if (a === "--yes" || a === "-y") yes = true;
    else if (a.startsWith("--card=")) cardId = a.slice("--card=".length);
    else if (a.startsWith("--perk=")) perkName = a.slice("--perk=".length);
    else if (a.startsWith("--user=")) userId = a.slice("--user=".length);
    else if (a.startsWith("--note=")) note = a.slice("--note=".length);
  }
  if (!cardId || !perkName) {
    console.error(
      'Usage: flags-resolve -- --card <card_id> --perk "<perk_name>" [--user <user_id>] [--note "..."] [--yes]',
    );
    process.exit(2);
  }
  return { cardId, perkName, userId, note, yes };
}

function isMissingTableError(e: unknown): boolean {
  if (!e || typeof e !== "object") return false;
  return (e as { code?: string }).code === "42P01";
}

async function main() {
  const args = parseArgs();

  // Find matching open flags first (count + summary for the prompt).
  let candidates: { user_id: string }[];
  try {
    candidates = args.userId
      ? await sql<{ user_id: string }[]>`
          select user_id::text as user_id
            from perks_source_flags
           where card_id = ${args.cardId}
             and perk_name = ${args.perkName}
             and resolved_at is null
             and user_id = ${args.userId}::uuid
        `
      : await sql<{ user_id: string }[]>`
          select user_id::text as user_id
            from perks_source_flags
           where card_id = ${args.cardId}
             and perk_name = ${args.perkName}
             and resolved_at is null
        `;
  } catch (e) {
    if (isMissingTableError(e)) {
      console.log(
        "[flags] table perks_source_flags doesn't exist yet — run `npm run db:migrate` to apply migration 0008",
      );
      await sql.end();
      return;
    }
    throw e;
  }

  if (candidates.length === 0) {
    console.log(
      `[flags] no open flags match card=${args.cardId} perk="${args.perkName}"${args.userId ? ` user=${args.userId}` : ""}`,
    );
    await sql.end();
    return;
  }

  console.log(
    `[flags] resolve ${candidates.length} open flag(s) on ${args.cardId} → "${args.perkName}"?`,
  );
  if (args.note) {
    console.log(`        resolution_note: "${args.note}"`);
  }

  if (!args.yes) {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    const answer = (await rl.question("        proceed? [y/N] ")).trim().toLowerCase();
    rl.close();
    if (answer !== "y" && answer !== "yes") {
      console.log("[flags] cancelled");
      await sql.end();
      return;
    }
  }

  // Run the update. Postgres returns the affected row count via the
  // `count` property on the postgres-js result.
  if (args.userId) {
    await sql`
      update perks_source_flags
         set resolved_at = now(),
             resolution_note = ${args.note},
             updated_at = now()
       where card_id = ${args.cardId}
         and perk_name = ${args.perkName}
         and user_id = ${args.userId}::uuid
         and resolved_at is null
    `;
  } else {
    await sql`
      update perks_source_flags
         set resolved_at = now(),
             resolution_note = ${args.note},
             updated_at = now()
       where card_id = ${args.cardId}
         and perk_name = ${args.perkName}
         and resolved_at is null
    `;
  }

  console.log(`[flags] resolved ${candidates.length} flag(s)`);
  await sql.end();
}

main().catch((e) => {
  console.error("[flags] FAIL:", e);
  process.exit(1);
});
