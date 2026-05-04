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
// Phase 4 wires this into the engine via lib/engine/cardValue.ts and
// lib/engine/scoring.ts.
export type SignalState = "confirmed" | "interested" | "dismissed";

export const getUserSignals = cache(
  async (userId: string): Promise<Map<string, SignalState>> => {
    try {
      const rows = await sql<{ signal_id: string; state: SignalState }[]>`
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

// Phase 5: signals dashboard variant. Returns the same per-user signal
// state plus source_card_id / source_play_id so the dashboard can
// render "Edit on Strata Premier →" links back to the card hero where
// the chip click happened. Kept separate from getUserSignals so the
// engine path stays minimal (engine doesn't need source attribution).
export interface UserSignalRow {
  state: SignalState;
  source_card_id: string | null;
  source_play_id: string | null;
}

export const getUserSignalsWithSource = cache(
  async (userId: string): Promise<Map<string, UserSignalRow>> => {
    try {
      const rows = await sql<{
        signal_id: string;
        state: SignalState;
        source_card_id: string | null;
        source_play_id: string | null;
      }[]>`
        select signal_id, state, source_card_id, source_play_id
          from perks_user_signals
         where user_id = ${userId}
      `;
      return new Map(
        rows.map((r) => [
          r.signal_id,
          {
            state: r.state,
            source_card_id: r.source_card_id,
            source_play_id: r.source_play_id,
          },
        ]),
      );
    } catch (e) {
      if (isUndefinedTableError(e)) return new Map();
      throw e;
    }
  },
);

// Per-user per-program cpp overrides. Stored in
// perks_point_value_overrides (migration 0007). Overrides live on the
// program, not the card — editing Citi TY's transfer cpp from any
// Citi TY card's detail page propagates to every card earning Citi TY.
//
// Bank transferable currencies populate all three columns; airline/
// hotel programs only populate transfer_cpp. Either way the column is
// nullable — null means "use the program default."
//
// Soft-fails on missing table the same way getUserSignals does, so the
// page still renders for users on a database that hasn't applied
// migration 0007 yet (engine sees an empty map and falls back to
// program defaults).
export interface ProgramCppOverride {
  cash_cpp: number | null;
  portal_cpp: number | null;
  transfer_cpp: number | null;
}

export const getProgramCppOverrides = cache(
  async (userId: string): Promise<Map<string, ProgramCppOverride>> => {
    try {
      const rows = await sql<{
        program_id: string;
        cash_cpp: number | null;
        portal_cpp: number | null;
        transfer_cpp: number | null;
      }[]>`
        select program_id, cash_cpp, portal_cpp, transfer_cpp
          from perks_point_value_overrides
         where user_id = ${userId}
      `;
      return new Map(
        rows.map((r) => [
          r.program_id,
          {
            // postgres-js returns numeric columns as strings unless
            // typed; coerce to number so engine math is consistent.
            cash_cpp: r.cash_cpp == null ? null : Number(r.cash_cpp),
            portal_cpp: r.portal_cpp == null ? null : Number(r.portal_cpp),
            transfer_cpp: r.transfer_cpp == null ? null : Number(r.transfer_cpp),
          },
        ]),
      );
    } catch (e) {
      if (isUndefinedTableError(e)) {
        // Migration 0007 not applied — empty map. Engine falls back to
        // program defaults; the UI shows defaults with no override hint.
        return new Map();
      }
      throw e;
    }
  },
);

// Per-user perk-source flags. TASK-perk-source-flags. Powers the
// inline ⓘ popover's "Report a problem" form: shows the user's own
// open flag (so we can render "You flagged this — undo") and an
// open-flag count per perk for future analytics surfaces.
//
// Soft-fails on missing table the same way getProgramCppOverrides
// does — pre-0008 dbs see empty maps and the popover just renders
// the report form with no prior state.
export type PerkFlagReason =
  | "link_broken"
  | "info_outdated"
  | "perk_removed"
  | "other";

export interface PerkFlag {
  card_id: string;
  perk_kind: "annual_credit" | "ongoing_perk";
  perk_name: string;
  reason: PerkFlagReason;
  note: string | null;
  created_at: string;
  resolved_at: string | null;
}

export interface PerkFlagsForCard {
  /** Current user's open flag for each perk on the card, keyed by perk_name. */
  myFlags: Map<string, PerkFlag>;
  /** Open flag count per perk_name across all users (any user, any reason). */
  openFlagCounts: Map<string, number>;
}

export const getPerkFlagsForCard = cache(
  async (userId: string, cardId: string): Promise<PerkFlagsForCard> => {
    try {
      const [myRows, countRows] = await Promise.all([
        sql<{
          card_id: string;
          perk_kind: "annual_credit" | "ongoing_perk";
          perk_name: string;
          reason: PerkFlagReason;
          note: string | null;
          created_at: Date;
          resolved_at: Date | null;
        }[]>`
          select card_id, perk_kind, perk_name, reason, note,
                 created_at, resolved_at
            from perks_source_flags
           where user_id = ${userId}
             and card_id = ${cardId}
             and resolved_at is null
        `,
        sql<{ perk_name: string; n: number }[]>`
          select perk_name, count(*)::int as n
            from perks_source_flags
           where card_id = ${cardId}
             and resolved_at is null
           group by perk_name
        `,
      ]);
      const myFlags = new Map<string, PerkFlag>(
        myRows.map((r) => [
          r.perk_name,
          {
            card_id: r.card_id,
            perk_kind: r.perk_kind,
            perk_name: r.perk_name,
            reason: r.reason,
            note: r.note,
            created_at: r.created_at.toISOString(),
            resolved_at: r.resolved_at ? r.resolved_at.toISOString() : null,
          },
        ]),
      );
      const openFlagCounts = new Map(countRows.map((r) => [r.perk_name, r.n]));
      return { myFlags, openFlagCounts };
    } catch (e) {
      if (isUndefinedTableError(e)) {
        return { myFlags: new Map(), openFlagCounts: new Map() };
      }
      throw e;
    }
  },
);
