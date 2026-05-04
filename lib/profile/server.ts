// Server-side profile reader. Looks up the row for the currently
// authenticated user. Returns a default empty profile if no row exists
// (signup writes one, but be defensive).
//
// CARDS_HELD_READ_SOURCE controls where cards_held comes from:
//   - "jsonb" (default during cutover) — read perks_profiles.cards_held
//   - "relational" — read user_cards where status='held' and map to the
//     legacy WalletCardHeld shape; the engine sees identical data.

import "server-only";
import { cache } from "react";
import { sql, isUndefinedTableError } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";
import type {
  CardPlayState,
  CreditScoreBand,
  UserProfile,
  WalletCardHeld,
} from "./types";

interface ProfileRow {
  spend_profile: UserProfile["spend_profile"];
  brands_used: UserProfile["brands_used"];
  cards_held: UserProfile["cards_held"];
  trips_planned: UserProfile["trips_planned"];
  preferences: UserProfile["preferences"];
}

interface SelfReportedRow {
  credit_score_band: CreditScoreBand;
}

interface UserCardReadRow {
  card_id: string;
  status: "held" | "closed_in_past_year" | "closed_long_ago";
  opened_at: Date | null;
  closed_at: Date | null;
  bonus_received: boolean;
  // Wallet-edit-v2 columns. All nullable. See migration 0005.
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

const EMPTY: UserProfile = {
  spend_profile: {},
  brands_used: [],
  cards_held: [],
  trips_planned: [],
  credit_score_band: null,
  preferences: {},
};

function readSource(): "jsonb" | "relational" {
  return process.env.CARDS_HELD_READ_SOURCE === "relational" ? "relational" : "jsonb";
}

function isoDate(d: Date | null): string {
  return d ? d.toISOString().slice(0, 10) : "";
}

export const getCurrentProfile = cache(_getCurrentProfile);

async function _getCurrentProfile(): Promise<UserProfile> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("not_authenticated");
  }
  // user_self_reported may not exist yet if migration 0003 hasn't been
  // applied. Soft-fail the credit-band lookup so login + onboarding still
  // work on a partially-migrated database; callers see band=null and the
  // engine treats it as "unknown / no signal".
  const [rows, selfRows] = await Promise.all([
    sql<ProfileRow[]>`
      select spend_profile, brands_used, cards_held, trips_planned, preferences
      from perks_profiles
      where user_id = ${user.id}
      limit 1
    `,
    (async () => {
      try {
        return await sql<SelfReportedRow[]>`
          select credit_score_band
          from user_self_reported
          where user_id = ${user.id}
          limit 1
        `;
      } catch (e) {
        if (isUndefinedTableError(e)) return [];
        throw e;
      }
    })(),
  ]);
  const row = rows[0];
  // No row yet means the user hasn't answered the credit question. We
  // distinguish that from "unknown" (the explicit opt-out radio).
  const creditBand: CreditScoreBand | null = selfRows[0]?.credit_score_band ?? null;
  const base: UserProfile = row
    ? {
        spend_profile: row.spend_profile ?? {},
        brands_used: Array.isArray(row.brands_used) ? row.brands_used : [],
        cards_held: Array.isArray(row.cards_held) ? row.cards_held : [],
        trips_planned: Array.isArray(row.trips_planned) ? row.trips_planned : [],
        credit_score_band: creditBand,
        preferences: row.preferences ?? {},
      }
    : { ...EMPTY, credit_score_band: creditBand };

  if (readSource() === "relational") {
    // Soft-fail on the v2 columns: they only exist after migration 0005
    // applies. If the columns are missing (older DB or test fixture), we
    // fall back to the legacy four-field read.
    const heldRows = await readUserCardsWithV2(user.id);
    const cards_held: WalletCardHeld[] = heldRows.map((r) => {
      const held: WalletCardHeld = {
        card_id: r.card_id,
        opened_at: isoDate(r.opened_at),
        bonus_received: r.bonus_received,
      };
      if (r.nickname != null) held.nickname = r.nickname;
      if (r.authorized_users != null) held.authorized_users = r.authorized_users;
      if (r.pool_status != null) held.pool_status = r.pool_status;
      if (r.pinned_category != null) held.pinned_category = r.pinned_category as WalletCardHeld["pinned_category"];
      if (r.elite_reached != null) held.elite_reached = r.elite_reached;
      if (r.activity_threshold_met != null) held.activity_threshold_met = r.activity_threshold_met;
      if (r.card_status_v2 != null) held.card_status_v2 = r.card_status_v2;
      if (r.found_money_cached_usd != null) held.found_money_cached_usd = r.found_money_cached_usd;
      if (r.signals_filled != null) held.signals_filled = r.signals_filled;
      if (r.signals_total != null) held.signals_total = r.signals_total;
      return held;
    });
    return { ...base, cards_held };
  }

  return base;
}

async function readUserCardsWithV2(userId: string): Promise<UserCardReadRow[]> {
  try {
    return await sql<UserCardReadRow[]>`
      select card_id, status, opened_at, closed_at, bonus_received,
             nickname, authorized_users, pool_status, pinned_category,
             elite_reached, activity_threshold_met, card_status_v2,
             found_money_cached_usd, signals_filled, signals_total
        from user_cards
       where user_id = ${userId} and status = 'held'
       order by opened_at desc nulls last
    `;
  } catch (e) {
    // Migration 0005 not applied yet — column doesn't exist. Fall back
    // to legacy read so the page still renders for users who haven't
    // had the migration run against their DB instance.
    if (isUndefinedColumnError(e)) {
      return await sql<UserCardReadRow[]>`
        select card_id, status, opened_at, closed_at, bonus_received
          from user_cards
         where user_id = ${userId} and status = 'held'
         order by opened_at desc nulls last
      `;
    }
    throw e;
  }
}

function isUndefinedColumnError(e: unknown): boolean {
  if (!e || typeof e !== "object") return false;
  const code = (e as { code?: string }).code;
  if (code === "42703") return true;
  const msg = (e as { message?: string }).message ?? "";
  return /column .* does not exist/i.test(msg);
}

// Per-card per-play state for the currently authenticated user. Returns
// only rows where state !== 'unset'. The audit UI treats missing rows as
// 'unset' (the default). Soft-fails when migration 0005 isn't applied.
export async function getCurrentCardPlayState(
  cardId: string,
): Promise<CardPlayState[]> {
  const user = await getCurrentUser();
  if (!user) throw new Error("not_authenticated");
  try {
    const rows = await sql<{
      play_id: string;
      state: CardPlayState["state"];
      claimed_at: Date | null;
      notes: string | null;
    }[]>`
      select play_id, state, claimed_at, notes
        from user_card_play_state
       where user_id = ${user.id} and card_id = ${cardId}
    `;
    return rows.map((r) => {
      const out: CardPlayState = {
        card_id: cardId,
        play_id: r.play_id,
        state: r.state,
      };
      if (r.claimed_at) out.claimed_at = r.claimed_at.toISOString().slice(0, 10);
      if (r.notes) out.notes = r.notes;
      return out;
    });
  } catch (e) {
    if (isUndefinedTableError(e)) return [];
    throw e;
  }
}

export interface UserCardFull {
  card_id: string;
  status: "held" | "closed_in_past_year" | "closed_long_ago";
  opened_at: string | null;
  closed_at: string | null;
  bonus_received: boolean;
}

// Full relational shape including closed cards. New UI flows call this
// when they need the "previously held" history rather than the engine's
// held-only view.
export async function getCurrentUserCards(): Promise<UserCardFull[]> {
  const user = await getCurrentUser();
  if (!user) throw new Error("not_authenticated");
  const rows = await sql<UserCardReadRow[]>`
    select card_id, status, opened_at, closed_at, bonus_received
      from user_cards
     where user_id = ${user.id}
     order by status, opened_at desc nulls last
  `;
  return rows.map((r) => ({
    card_id: r.card_id,
    status: r.status,
    opened_at: r.opened_at ? r.opened_at.toISOString().slice(0, 10) : null,
    closed_at: r.closed_at ? r.closed_at.toISOString().slice(0, 10) : null,
    bonus_received: r.bonus_received,
  }));
}

export async function getCurrentUserId(): Promise<string> {
  const user = await getCurrentUser();
  if (!user) throw new Error("not_authenticated");
  return user.id;
}

// Phase 3 of signal-first architecture. Returns the user's full signal
// state as a Map<signal_id, state>. Cached per-request via React.cache,
// matching the pattern of getCurrentProfile so multiple Server Components
// can call it without compounding DB hits.
//
// Phase 4 will wire this into the engine. Phase 3 ships the helper and
// leaves it cold so the cutover is one focused change.
export type SignalStateValue = "confirmed" | "interested" | "dismissed";

export const getUserSignals = cache(
  async (userId: string): Promise<Map<string, SignalStateValue>> => {
    try {
      const rows = await sql<{ signal_id: string; state: SignalStateValue }[]>`
        select signal_id, state
          from perks_user_signals
         where user_id = ${userId}
      `;
      return new Map(rows.map((r) => [r.signal_id, r.state]));
    } catch (e) {
      if (isUndefinedTableError(e)) {
        // Migration 0006 not applied — empty map. Engine sees no
        // signals; behavior matches the pre-Phase-3 world.
        return new Map();
      }
      throw e;
    }
  },
);
