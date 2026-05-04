// scripts/backfill-user-signals.ts
//
// Phase 3 of signal-first architecture: walks every existing
// user_card_play_state row and translates it into the matching
// perks_user_signals rows via the play's reveals_signals (Phase 2).
//
// Idempotent — safe to re-run. The conflict resolution prefers the more
// recent updated_at, so a re-run with no new chip clicks is a no-op.
//
// Usage:
//   npm run backfill:user-signals
//
// Reports counts at the end:
//   - rows scanned (legacy table)
//   - signal rows written (new table)
//   - plays skipped because reveals_signals is empty
//   - plays skipped because the play no longer exists in the catalog
//
// Run AFTER applying migration 0006_user_signals.sql.

import { loadCardDatabase } from "@/lib/data/loader";
import { getMigrationDb } from "./lib/db-migrate-conn";

const PLAY_STATE_TO_SIGNAL_STATE: Record<string, "confirmed" | "interested" | "dismissed" | null> = {
  got_it: "confirmed",
  want_it: "interested",
  skip: "dismissed",
  unset: null,
};

interface LegacyRow {
  user_id: string;
  card_id: string;
  play_id: string;
  state: string;
  updated_at: Date;
}

async function main(): Promise<void> {
  const sql = getMigrationDb();
  const db = loadCardDatabase();

  // Per-(card,play) lookup of reveals_signals.
  const reveals = new Map<string, string[]>();
  for (const card of db.cards) {
    for (const play of card.card_plays ?? []) {
      reveals.set(`${card.id}:${play.id}`, play.reveals_signals);
    }
  }

  console.log(
    `[backfill] catalog: ${db.signals.length} signals, ${reveals.size} (card,play) keys with reveals_signals`,
  );

  // Pull every legacy row with a non-unset state. Synthetic ids
  // (group:*, cold:*) never produce signal rows, so filter them out
  // upfront — they're real entries in the legacy table but have no
  // corresponding catalog play.
  const rows = await sql<LegacyRow[]>`
    select user_id, card_id, play_id, state, updated_at
      from user_card_play_state
     where state in ('got_it', 'want_it', 'skip')
       and play_id not like 'group:%'
       and play_id not like 'cold:%'
  `;

  console.log(`[backfill] legacy rows scanned: ${rows.length}`);

  let written = 0;
  let emptyReveals = 0;
  let missingPlay = 0;
  let unknownState = 0;

  for (const row of rows) {
    const key = `${row.card_id}:${row.play_id}`;
    const sigs = reveals.get(key);
    if (sigs == null) {
      missingPlay++;
      continue;
    }
    if (sigs.length === 0) {
      emptyReveals++;
      continue;
    }
    const target = PLAY_STATE_TO_SIGNAL_STATE[row.state];
    if (target == null) {
      // Shouldn't hit — we filtered for got_it/want_it/skip — but stay
      // defensive against schema drift.
      unknownState++;
      continue;
    }

    for (const sig of sigs) {
      await sql`
        insert into perks_user_signals (
          user_id, signal_id, state, source_card_id, source_play_id,
          recorded_at, updated_at
        ) values (
          ${row.user_id}, ${sig}, ${target}::signal_state,
          ${row.card_id}, ${row.play_id},
          ${row.updated_at}, ${row.updated_at}
        )
        on conflict (user_id, signal_id) do update set
          -- Backfill discipline: prefer the row whose source updated_at
          -- is more recent. A re-run with the same data is a no-op
          -- because excluded.updated_at == perks_user_signals.updated_at.
          state = case
            when excluded.updated_at >= perks_user_signals.updated_at
              then excluded.state
            else perks_user_signals.state
          end,
          source_card_id = case
            when excluded.updated_at >= perks_user_signals.updated_at
              then excluded.source_card_id
            else perks_user_signals.source_card_id
          end,
          source_play_id = case
            when excluded.updated_at >= perks_user_signals.updated_at
              then excluded.source_play_id
            else perks_user_signals.source_play_id
          end,
          updated_at = greatest(excluded.updated_at, perks_user_signals.updated_at)
      `;
      written++;
    }
  }

  console.log(`[backfill] signal rows written: ${written}`);
  console.log(`[backfill] plays with empty reveals_signals (no-op): ${emptyReveals}`);
  console.log(`[backfill] plays no longer in catalog (skipped): ${missingPlay}`);
  if (unknownState > 0) {
    console.log(`[backfill] rows with unrecognized state (skipped): ${unknownState}`);
  }

  await sql.end();
}

main().catch((e) => {
  console.error("[backfill] failed:", e instanceof Error ? e.message : String(e));
  process.exit(1);
});
