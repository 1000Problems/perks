"use server";

// Server actions for profile updates. Always operates on the currently
// authenticated user. Accepts a partial UserProfile and merges into the
// existing row in a single UPDATE. JSON columns are sent via sql.json so
// the postgres driver handles type tagging.

import { sql } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";
import { getCurrentProfile } from "./server";
import type { UserProfile } from "./types";

export interface UpdateResult {
  ok: boolean;
  error?: string;
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

    // The postgres driver's sql.json type bound is strict about index
    // signatures; cast through unknown so our own branded shapes pass.
    const j = (v: unknown) => sql.json(v as Parameters<typeof sql.json>[0]);
    await sql`
      update perks_profiles
         set spend_profile = ${j(merged.spend_profile)},
             brands_used   = ${j(merged.brands_used)},
             cards_held    = ${j(merged.cards_held)},
             trips_planned = ${j(merged.trips_planned)},
             preferences   = ${j(merged.preferences)},
             updated_at    = now()
       where user_id = ${user.id}
    `;
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[profile:update] failed:", msg);
    return { ok: false, error: "update_failed" };
  }
}
