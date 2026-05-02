// scripts/backfill-user-cards-from-jsonb.ts
// Read every perks_profiles row, decompose cards_held jsonb into
// user_cards rows (status='held'). Idempotent — closed-status rows
// (added by updateUserCard) are not touched. Cards referenced in JSONB
// that don't exist in cards.* are reported as conflicts and skipped.

import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { sql } from "../lib/db";

interface ProfileRow {
  user_id: string;
  cards_held: unknown;
}

interface HeldEntry {
  card_id: string;
  opened_at: string;
  bonus_received: boolean;
}

interface Conflict {
  user_id: string;
  card_id: string;
  reason: string;
}

const REPORT_PATH = join(process.cwd(), "scripts", "backfill-user-cards.report.md");

async function getKnownCardIds(): Promise<Set<string>> {
  const rows = await sql<{ id: string }[]>`select id from cards`;
  return new Set(rows.map((r) => r.id));
}

function isHeldEntry(v: unknown): v is HeldEntry {
  if (typeof v !== "object" || v === null) return false;
  const o = v as Record<string, unknown>;
  return typeof o.card_id === "string"
    && typeof o.opened_at === "string"
    && typeof o.bonus_received === "boolean";
}

async function backfillUser(userId: string, jsonb: unknown, known: Set<string>): Promise<{
  inserted: number; conflicts: Conflict[];
}> {
  const arr = Array.isArray(jsonb) ? jsonb : [];
  const conflicts: Conflict[] = [];
  const valid: HeldEntry[] = [];
  for (const e of arr) {
    if (!isHeldEntry(e)) {
      conflicts.push({ user_id: userId, card_id: String((e as { card_id?: string })?.card_id ?? "?"), reason: "malformed jsonb entry" });
      continue;
    }
    if (!known.has(e.card_id)) {
      conflicts.push({ user_id: userId, card_id: e.card_id, reason: "card_id not in cards" });
      continue;
    }
    valid.push(e);
  }

  await sql.begin(async (tx) => {
    await tx`delete from user_cards where user_id = ${userId} and status = 'held'`;
    for (const e of valid) {
      await tx`
        insert into user_cards (
          user_id, card_id, status, opened_at, bonus_received
        ) values (
          ${userId}, ${e.card_id}, 'held', ${e.opened_at}, ${e.bonus_received}
        )
        on conflict (user_id, card_id) do update set
          status = excluded.status,
          opened_at = excluded.opened_at,
          bonus_received = excluded.bonus_received,
          updated_at = now()
      `;
    }
  });

  return { inserted: valid.length, conflicts };
}

async function main() {
  console.log("Reading cards.id set…");
  const known = await getKnownCardIds();
  console.log(`  ${known.size} known card_ids`);

  const profiles = await sql<ProfileRow[]>`
    select user_id, cards_held from perks_profiles
  `;
  console.log(`Backfilling ${profiles.length} users…`);

  let usersProcessed = 0;
  let totalInserted = 0;
  const allConflicts: Conflict[] = [];

  for (const p of profiles) {
    const r = await backfillUser(p.user_id, p.cards_held, known);
    usersProcessed++;
    totalInserted += r.inserted;
    allConflicts.push(...r.conflicts);
  }

  const report = [
    `# Backfill report`,
    ``,
    `Run at: ${new Date().toISOString()}`,
    `Users processed: ${usersProcessed}`,
    `Total held rows inserted: ${totalInserted}`,
    `Conflicts: ${allConflicts.length}`,
    ``,
    `## Conflicts`,
    ``,
    ...allConflicts.map((c) => `- user \`${c.user_id}\` card \`${c.card_id}\` — ${c.reason}`),
    "",
  ].join("\n");
  writeFileSync(REPORT_PATH, report, "utf8");
  console.log(`Wrote ${REPORT_PATH}`);
  console.log(`(users_processed: ${usersProcessed}, total_held_rows_inserted: ${totalInserted}, conflicts: ${allConflicts.length})`);
}

main()
  .catch((e) => {
    console.error("backfill failed:", e);
    process.exit(1);
  })
  .finally(() => sql.end());
