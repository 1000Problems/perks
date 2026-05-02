// Server-side profile reader. Looks up the row for the currently
// authenticated user. Returns a default empty profile if no row exists
// (signup writes one, but be defensive).

import "server-only";
import { sql } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";
import type { UserProfile } from "./types";

interface ProfileRow {
  spend_profile: UserProfile["spend_profile"];
  brands_used: UserProfile["brands_used"];
  cards_held: UserProfile["cards_held"];
  trips_planned: UserProfile["trips_planned"];
  preferences: UserProfile["preferences"];
}

const EMPTY: UserProfile = {
  spend_profile: {},
  brands_used: [],
  cards_held: [],
  trips_planned: [],
  preferences: {},
};

export async function getCurrentProfile(): Promise<UserProfile> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("not_authenticated");
  }
  const rows = await sql<ProfileRow[]>`
    select spend_profile, brands_used, cards_held, trips_planned, preferences
    from perks_profiles
    where user_id = ${user.id}
    limit 1
  `;
  const row = rows[0];
  if (!row) return { ...EMPTY };
  return {
    spend_profile: row.spend_profile ?? {},
    brands_used: Array.isArray(row.brands_used) ? row.brands_used : [],
    cards_held: Array.isArray(row.cards_held) ? row.cards_held : [],
    trips_planned: Array.isArray(row.trips_planned) ? row.trips_planned : [],
    preferences: row.preferences ?? {},
  };
}

export async function getCurrentUserId(): Promise<string> {
  const user = await getCurrentUser();
  if (!user) throw new Error("not_authenticated");
  return user.id;
}
