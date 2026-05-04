"use server";

// Server actions for profile updates. Always operates on the currently
// authenticated user. Accepts a partial UserProfile and merges into the
// existing row in a single UPDATE. JSON columns are sent via sql.json so
// the postgres driver handles type tagging.
//
// Cutover behavior:
//   - When CARDS_HELD_DUAL_WRITE=on (default), updateProfile writes
//     cards_held to BOTH perks_profiles.cards_held (jsonb) and
//     user_cards (relational, status='held'), inside one transaction.
//   - When CARDS_HELD_DUAL_WRITE=off, only user_cards is written.
//   - updateUserCard() always writes only to user_cards — used by new
//     UI flows that need closed-card support.

import { sql, isUndefinedTableError } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";
import { getCurrentProfile } from "./server";
import { loadCardDatabase } from "@/lib/data/loader";
import type {
  CardPlayState,
  CreditScoreBand,
  UserProfile,
  WalletCardHeld,
} from "./types";

// Phase 3 of signal-first architecture. UI tristate maps onto the
// persisted play_state enum, which in turn maps onto the new
// signal_state enum. SignalState type lives in ./server (re-exported
// for convenience) since the read path is the canonical owner.
import type { SignalState } from "./server";

const PLAY_STATE_TO_SIGNAL_STATE: Record<
  CardPlayState["state"],
  SignalState | null
> = {
  got_it: "confirmed",
  want_it: "interested",
  skip: "dismissed",
  unset: null, // signal row deleted; no opinion captured
};

const VALID_CREDIT_BANDS: ReadonlyArray<CreditScoreBand> = [
  "building",
  "fair",
  "good",
  "very_good",
  "excellent",
  "unknown",
];

export interface UpdateResult {
  ok: boolean;
  // Stable machine-readable code the client maps to user-facing copy.
  error?:
    | "not_authenticated"
    | "invalid_band"
    | "card_not_in_catalog"
    | "duplicate_card"
    | "missing_table"
    | "update_failed";
  // Optional human-readable detail for log/debug. The form shouldn't
  // display this raw — map `error` to friendly copy instead.
  detail?: string;
}

// Walk an error and any chained `cause`/`error_unwrap` properties looking
// for a Postgres SQLSTATE code. postgres-js sometimes wraps the original
// PG error inside a transaction failure, which would otherwise hide the
// code we want to classify on.
function findPgCode(e: unknown, depth = 0): string | undefined {
  if (depth > 5 || !e || typeof e !== "object") return undefined;
  const obj = e as Record<string, unknown>;
  if (typeof obj.code === "string" && /^[0-9A-Z]{5}$/.test(obj.code)) {
    return obj.code;
  }
  return findPgCode(obj.cause, depth + 1);
}

function findPgMessage(e: unknown): string {
  if (!e) return "";
  if (e instanceof Error) {
    const detail = (e as Error & { detail?: string }).detail;
    return detail ? `${e.message} — ${detail}` : e.message;
  }
  return String(e);
}

// Translate Postgres SQLSTATE codes to our stable error union. Anything
// unknown falls back to generic update_failed.
function classifyDbError(e: unknown): UpdateResult["error"] {
  const code = findPgCode(e);
  if (!code) {
    // Common case: error message contains the SQLSTATE info but not as
    // a discrete property. Pattern-match a couple of high-value cases.
    const msg = findPgMessage(e).toLowerCase();
    if (/violates foreign key|is not present in table "cards"/i.test(msg)) {
      return "card_not_in_catalog";
    }
    if (/duplicate key value/i.test(msg) || /violates unique constraint/i.test(msg)) {
      return "duplicate_card";
    }
    if (/relation .* does not exist/i.test(msg)) return "missing_table";
    return "update_failed";
  }
  if (code === "23503") return "card_not_in_catalog";
  if (code === "23505") return "duplicate_card";
  if (code === "42P01") return "missing_table";
  return "update_failed";
}

function dualWriteEnabled(): boolean {
  return (process.env.CARDS_HELD_DUAL_WRITE ?? "on") !== "off";
}

export async function updateProfile(
  partial: Partial<UserProfile>,
): Promise<UpdateResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "not_authenticated" };

  try {
    const current = await getCurrentProfile();
    const merged: UserProfile = {
      spend_profile: partial.spend_profile ?? current.spend_profile,
      brands_used: partial.brands_used ?? current.brands_used,
      cards_held: partial.cards_held ?? current.cards_held,
      trips_planned: partial.trips_planned ?? current.trips_planned,
      preferences: { ...current.preferences, ...(partial.preferences ?? {}) },
    };

    const j = (v: unknown) => sql.json(v as Parameters<typeof sql.json>[0]);
    const cardsHeldChanged = partial.cards_held !== undefined;
    const useDual = dualWriteEnabled();

    await sql.begin(async (tx) => {
      if (useDual) {
        // Update the JSONB-keyed legacy row first.
        await tx`
          update perks_profiles
             set spend_profile = ${j(merged.spend_profile)},
                 brands_used   = ${j(merged.brands_used)},
                 cards_held    = ${j(merged.cards_held)},
                 trips_planned = ${j(merged.trips_planned)},
                 preferences   = ${j(merged.preferences)},
                 updated_at    = now()
           where user_id = ${user.id}
        `;
      } else {
        // Skip cards_held in the JSONB write; everything else still goes there.
        await tx`
          update perks_profiles
             set spend_profile = ${j(merged.spend_profile)},
                 brands_used   = ${j(merged.brands_used)},
                 trips_planned = ${j(merged.trips_planned)},
                 preferences   = ${j(merged.preferences)},
                 updated_at    = now()
           where user_id = ${user.id}
        `;
      }

      if (cardsHeldChanged) {
        // Replace the user's held rows. Closed-status rows are untouched —
        // those come from updateUserCard() and are not derivable from JSONB.
        await tx`
          delete from user_cards
           where user_id = ${user.id} and status = 'held'
        `;
        for (const c of merged.cards_held) {
          await tx`
            insert into user_cards (user_id, card_id, status, opened_at, bonus_received)
            values (${user.id}, ${c.card_id}, 'held', ${c.opened_at}, ${c.bonus_received})
            on conflict (user_id, card_id) do update set
              status = excluded.status,
              opened_at = excluded.opened_at,
              bonus_received = excluded.bonus_received,
              updated_at = now()
          `;
        }
      }
    });
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[profile:update] failed:", msg);
    return { ok: false, error: classifyDbError(e), detail: msg };
  }
}

// Granular update for a single user_cards row. Used by new UI flows
// that record closed_in_past_year, closed_long_ago, or per-card edits.
// Writes ONLY to user_cards — never to perks_profiles.cards_held.
//
// Wallet-edit-v2 fields (nickname, authorized_users, pool_status,
// pinned_category, elite_reached, activity_threshold_met,
// card_status_v2, signals_filled/total, found_money_cached_usd) are all
// optional and additive. Pass any subset; only the supplied keys are
// updated. The legacy four fields (status, opened_at, closed_at,
// bonus_received) are required-on-insert; on update, missing values
// preserve the existing row.
export interface UpdateUserCardInput {
  card_id: string;
  status?: "held" | "closed_in_past_year" | "closed_long_ago";
  opened_at?: string | null;
  closed_at?: string | null;
  bonus_received?: boolean;

  // v2 fields
  nickname?: string | null;
  authorized_users?: number | null;
  pool_status?: "yes" | "not_yet" | "unknown" | null;
  pinned_category?: string | null;
  elite_reached?: boolean | null;
  activity_threshold_met?: boolean | null;
  card_status_v2?: "active" | "considering_close" | "downgraded" | "closed" | null;
  found_money_cached_usd?: number | null;
  signals_filled?: number | null;
  signals_total?: number | null;
}

export async function updateUserCard(input: UpdateUserCardInput): Promise<UpdateResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "not_authenticated" };
  // Build the SET clause dynamically from whatever the caller passed.
  // postgres-js's tagged template doesn't easily handle dynamic column
  // lists, so we use sql.unsafe for the column names (which are
  // hardcoded literals here, not user input) and parameterize the values.
  const sets: { col: string; val: unknown }[] = [];
  const push = <T>(col: string, val: T | undefined) => {
    if (val !== undefined) sets.push({ col, val });
  };
  push("status", input.status);
  push("opened_at", input.opened_at);
  push("closed_at", input.closed_at);
  push("bonus_received", input.bonus_received);
  push("nickname", input.nickname);
  push("authorized_users", input.authorized_users);
  push("pool_status", input.pool_status);
  push("pinned_category", input.pinned_category);
  push("elite_reached", input.elite_reached);
  push("activity_threshold_met", input.activity_threshold_met);
  push("card_status_v2", input.card_status_v2);
  push("found_money_cached_usd", input.found_money_cached_usd);
  push("signals_filled", input.signals_filled);
  push("signals_total", input.signals_total);

  // Insert-on-conflict needs sane defaults for non-null columns even
  // when the caller is just updating a single field. status defaults to
  // 'held' (matches the legacy onboarding flow).
  const insertStatus = input.status ?? "held";
  const insertOpenedAt = input.opened_at ?? null;
  const insertClosedAt = input.closed_at ?? null;
  const insertBonus = input.bonus_received ?? false;

  try {
    if (sets.length === 0) {
      // No-op; treat as success.
      return { ok: true };
    }
    // Use a parameterized UPSERT. Build the update assignment list from
    // the keys we got. postgres.js unsafe interpolation is restricted
    // to the hardcoded `col` strings above (never user-supplied keys).
    const updateAssignments = sets
      .map((s, i) => `${s.col} = $${i + 6}`)
      .join(", ");
    type Param = string | number | boolean | null;
    const params: Param[] = [
      user.id,
      input.card_id,
      insertStatus,
      insertOpenedAt,
      insertClosedAt,
      ...sets.map((s) => s.val as Param),
      insertBonus,
    ];
    await sql.unsafe(
      `insert into user_cards (
         user_id, card_id, status, opened_at, closed_at, bonus_received
       ) values ($1, $2, $3, $4, $5, $${6 + sets.length})
       on conflict (user_id, card_id) do update set
         ${updateAssignments},
         updated_at = now()`,
      params,
    );
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[profile:update_user_card] failed:", msg);
    return { ok: false, error: classifyDbError(e), detail: msg };
  }
}

// Per-card per-play tristate writer. Upserts a single row in
// user_card_play_state. Soft-fails when migration 0005 hasn't applied
// yet so the page still loads for users on an older DB.
export async function updateCardPlayState(
  cardId: string,
  playId: string,
  state: Pick<CardPlayState, "state" | "claimed_at" | "notes">,
): Promise<UpdateResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "not_authenticated" };
  try {
    await sql`
      insert into user_card_play_state (
        user_id, card_id, play_id, state, claimed_at, notes
      ) values (
        ${user.id}, ${cardId}, ${playId}, ${state.state}::play_state,
        ${state.claimed_at ?? null}, ${state.notes ?? null}
      )
      on conflict (user_id, card_id, play_id) do update set
        state = excluded.state,
        claimed_at = excluded.claimed_at,
        notes = excluded.notes,
        updated_at = now()
    `;
    return { ok: true };
  } catch (e) {
    if (isUndefinedTableError(e)) {
      // Migration 0005 not applied. Treat as no-op — the UI still
      // reflects local state; persistence catches up after migration.
      const msg = e instanceof Error ? e.message : String(e);
      console.warn("[profile:update_card_play_state] table missing — skipping persist:", msg);
      return { ok: true };
    }
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[profile:update_card_play_state] failed:", msg);
    return { ok: false, error: classifyDbError(e), detail: msg };
  }
}

// Phase 3 of signal-first architecture: dual-write target alongside
// updateCardPlayState. Translates a per-play tristate click into global
// signal state via the play's reveals_signals declarations (Phase 2).
//
//   got_it  → confirmed   (UPSERT, latest-click wins)
//   want_it → interested  (UPSERT)
//   skip    → dismissed   (UPSERT)
//   unset   → DELETE the (user, signal) row (toggle-off semantics)
//
// No-ops in three cases:
//   - playId is a synthetic key ("group:*" or "cold:*"): not a real play
//   - card or play not found in the catalog (defensive; should not
//     happen during normal flows)
//   - play.reveals_signals is empty (most plays today, until Phase 2.5
//     catalog growth)
//
// Soft-fails on missing perks_user_signals table (migration 0006 not
// applied) — same tolerance pattern as updateCardPlayState. The legacy
// user_card_play_state path still persists in that case.
export async function updateUserSignalsForPlay(
  cardId: string,
  playId: string,
  state: CardPlayState["state"],
): Promise<UpdateResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "not_authenticated" };

  // Synthetic play ids never reveal real signals.
  if (playId.startsWith("group:") || playId.startsWith("cold:")) {
    return { ok: true };
  }

  const db = loadCardDatabase();
  const card = db.cardById.get(cardId);
  if (!card) return { ok: true };
  const play = (card.card_plays ?? []).find((p) => p.id === playId);
  if (!play) return { ok: true };
  const signals = play.reveals_signals;
  if (signals.length === 0) return { ok: true };

  const target = PLAY_STATE_TO_SIGNAL_STATE[state];

  try {
    if (target === null) {
      // Toggle-off — delete the rows for this user + these signals.
      await sql`
        delete from perks_user_signals
        where user_id = ${user.id}
          and signal_id = any(${signals})
      `;
    } else {
      // postgres-js doesn't bulk-upsert with per-row source attribution
      // cleanly, so loop. Signal counts per play are tiny (typically 1-3),
      // so this is fine.
      for (const sig of signals) {
        await sql`
          insert into perks_user_signals (
            user_id, signal_id, state, source_card_id, source_play_id
          ) values (
            ${user.id}, ${sig}, ${target}::signal_state, ${cardId}, ${playId}
          )
          on conflict (user_id, signal_id) do update set
            state = excluded.state,
            source_card_id = excluded.source_card_id,
            source_play_id = excluded.source_play_id,
            updated_at = now()
        `;
      }
    }
    return { ok: true };
  } catch (e) {
    if (isUndefinedTableError(e)) {
      // Migration 0006 not applied — no-op. updateCardPlayState still
      // persisted on its own table.
      const msg = e instanceof Error ? e.message : String(e);
      console.warn("[profile:update_user_signals_for_play] table missing — skipping persist:", msg);
      return { ok: true };
    }
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[profile:update_user_signals_for_play] failed:", msg);
    return { ok: false, error: classifyDbError(e), detail: msg };
  }
}

// Persist the user's self-reported credit band. UPSERTs into
// user_self_reported. The recommendations engine reads this through
// getCurrentProfile() — it changes which cards we surface as risky vs.
// approvable, but never red-blocks (a self-reported number is too soft).
export async function updateCreditBand(band: CreditScoreBand): Promise<UpdateResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "not_authenticated" };
  if (!VALID_CREDIT_BANDS.includes(band)) {
    return { ok: false, error: "invalid_band" };
  }
  try {
    await sql`
      insert into user_self_reported (user_id, credit_score_band)
      values (${user.id}, ${band}::credit_score_band)
      on conflict (user_id) do update set
        credit_score_band = excluded.credit_score_band,
        updated_at = now()
    `;
    return { ok: true };
  } catch (e) {
    // Migration 0003 may not have run yet against this database. Treat
    // the missing table as a soft success so onboarding flows forward;
    // the band just isn't persisted yet (engine sees "unknown"). The
    // value will land once migrations are applied.
    if (isUndefinedTableError(e)) {
      const msg = e instanceof Error ? e.message : String(e);
      console.warn("[profile:update_credit_band] user_self_reported missing — skipping persist:", msg);
      return { ok: true };
    }
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[profile:update_credit_band] failed:", msg);
    return { ok: false, error: classifyDbError(e), detail: msg };
  }
}

export type { WalletCardHeld, CreditScoreBand };
