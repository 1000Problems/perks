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
import type { CreditScoreBand, UserProfile, WalletCardHeld } from "./types";

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
    const heldRows = await sql<UserCardReadRow[]>`
      select card_id, status, opened_at, closed_at, bonus_received
        from user_cards
       where user_id = ${user.id} and status = 'held'
       order by opened_at desc nulls last
    `;
    const cards_held: WalletCardHeld[] = heldRows.map((r) => ({
      card_id: r.card_id,
      opened_at: isoDate(r.opened_at),
      bonus_received: r.bonus_received,
    }));
    return { ...base, cards_held };
  }

  return base;
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
