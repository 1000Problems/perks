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

import { sql } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";
import { getCurrentProfile } from "./server";
import type { CreditScoreBand, UserProfile, WalletCardHeld } from "./types";

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
  error?: string;
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
    return { ok: false, error: "update_failed" };
  }
}

// Granular update for a single user_cards row. Used by new UI flows
// that record closed_in_past_year, closed_long_ago, or per-card edits.
// Writes ONLY to user_cards — never to perks_profiles.cards_held.
export interface UpdateUserCardInput {
  card_id: string;
  status: "held" | "closed_in_past_year" | "closed_long_ago";
  opened_at?: string | null;
  closed_at?: string | null;
  bonus_received?: boolean;
}

export async function updateUserCard(input: UpdateUserCardInput): Promise<UpdateResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "not_authenticated" };
  try {
    await sql`
      insert into user_cards (
        user_id, card_id, status, opened_at, closed_at, bonus_received
      ) values (
        ${user.id}, ${input.card_id}, ${input.status},
        ${input.opened_at ?? null}, ${input.closed_at ?? null},
        ${input.bonus_received ?? false}
      )
      on conflict (user_id, card_id) do update set
        status = excluded.status,
        opened_at = excluded.opened_at,
        closed_at = excluded.closed_at,
        bonus_received = excluded.bonus_received,
        updated_at = now()
    `;
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[profile:update_user_card] failed:", msg);
    return { ok: false, error: "update_failed" };
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
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[profile:update_credit_band] failed:", msg);
    return { ok: false, error: "update_failed" };
  }
}

export type { WalletCardHeld, CreditScoreBand };
