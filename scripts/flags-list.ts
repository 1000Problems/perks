// scripts/flags-list.ts — list open perk-source flags
// (TASK-perk-source-flags). Reads perks_source_flags directly. Run
// via `npm run flags:list`.
//
// Output groups flags by card → perk → reason, ordered alphabetically
// by card and then by reason then by created_at. User ids are
// printed as a short prefix (`user_${first8}`) to keep the report
// human-scannable while preserving identity.

// Use the migration-side connection — it loads .env.local on module
// import (the app-side lib/db.ts assumes Next.js env loading is in
// effect). Identical SQL surface (`sql` tagged template).
import { getMigrationDb } from "./lib/db-migrate-conn";
const sql = getMigrationDb();

interface OpenFlagRow {
  user_id: string;
  card_id: string;
  perk_kind: "annual_credit" | "ongoing_perk";
  perk_name: string;
  reason: "link_broken" | "info_outdated" | "perk_removed" | "other";
  note: string | null;
  created_at: Date;
}

function isMissingTableError(e: unknown): boolean {
  if (!e || typeof e !== "object") return false;
  return (e as { code?: string }).code === "42P01";
}

async function main() {
  let rows: OpenFlagRow[];
  try {
    rows = await sql<OpenFlagRow[]>`
      select user_id::text as user_id,
             card_id, perk_kind, perk_name, reason, note, created_at
        from perks_source_flags
       where resolved_at is null
       order by card_id asc, perk_name asc, reason asc, created_at asc
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

  if (rows.length === 0) {
    console.log("[flags] no open flags");
    return;
  }

  const cards = new Set(rows.map((r) => r.card_id));
  console.log(`[flags] ${rows.length} open across ${cards.size} card(s)`);
  console.log("");

  let currentCard = "";
  let currentPerk = "";
  let currentReason = "";
  for (const r of rows) {
    if (r.card_id !== currentCard) {
      if (currentCard !== "") console.log("");
      console.log(r.card_id);
      currentCard = r.card_id;
      currentPerk = "";
      currentReason = "";
    }
    const perkKey = `${r.perk_name}::${r.reason}`;
    if (perkKey !== `${currentPerk}::${currentReason}`) {
      // Count siblings with the same (perk, reason) for the header.
      const sameKey = rows.filter(
        (x) =>
          x.card_id === r.card_id &&
          x.perk_name === r.perk_name &&
          x.reason === r.reason,
      ).length;
      console.log(
        `  [${r.reason}] ${r.perk_name} — ${sameKey} open`,
      );
      currentPerk = r.perk_name;
      currentReason = r.reason;
    }
    const userPrefix = `user_${r.user_id.replace(/-/g, "").slice(0, 8)}`;
    const dateStr = r.created_at.toISOString().slice(0, 10);
    const noteStr = r.note ? `: "${r.note}"` : ": (no note)";
    console.log(`    ↳ ${dateStr} ${userPrefix}${noteStr}`);
  }

  await sql.end();
}

main().catch((e) => {
  console.error("[flags] FAIL:", e);
  process.exit(1);
});
