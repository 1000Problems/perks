// scripts/verify-cards-held-parity.ts
// For every user, compare perks_profiles.cards_held (jsonb held set) to
// user_cards rows with status='held'. Exit 0 on full parity, non-zero
// otherwise. Output a concise diff per mismatch.

import { sql } from "../lib/db";

interface ProfileRow {
  user_id: string;
  cards_held: unknown;
}
interface UserCardRow {
  user_id: string;
  card_id: string;
  opened_at: Date | null;
  bonus_received: boolean;
}

interface HeldEntry {
  card_id: string;
  opened_at: string;
  bonus_received: boolean;
}

function asHeldArray(v: unknown): HeldEntry[] {
  if (!Array.isArray(v)) return [];
  return v.filter((e): e is HeldEntry =>
    typeof e === "object" && e !== null
    && typeof (e as HeldEntry).card_id === "string"
    && typeof (e as HeldEntry).opened_at === "string"
    && typeof (e as HeldEntry).bonus_received === "boolean",
  );
}

async function main() {
  const profiles = await sql<ProfileRow[]>`
    select user_id, cards_held from perks_profiles
  `;
  const userCards = await sql<UserCardRow[]>`
    select user_id, card_id, opened_at, bonus_received
      from user_cards where status = 'held'
  `;

  const byUser = new Map<string, UserCardRow[]>();
  for (const u of userCards) {
    const list = byUser.get(u.user_id) ?? [];
    list.push(u);
    byUser.set(u.user_id, list);
  }

  let mismatches = 0;
  for (const p of profiles) {
    const jsonbSide = asHeldArray(p.cards_held);
    const relSide = byUser.get(p.user_id) ?? [];

    const jsonbByCard = new Map(jsonbSide.map((e) => [e.card_id, e]));
    const relByCard = new Map(relSide.map((r) => [r.card_id, r]));

    for (const [cardId, j] of jsonbByCard) {
      const r = relByCard.get(cardId);
      if (!r) {
        console.error(`✗ user ${p.user_id}: card ${cardId} in jsonb but missing from user_cards`);
        mismatches++;
        continue;
      }
      const relIso = r.opened_at ? r.opened_at.toISOString().slice(0, 10) : "";
      if (relIso !== j.opened_at) {
        console.error(`✗ user ${p.user_id}: card ${cardId} opened_at jsonb=${j.opened_at} rel=${relIso}`);
        mismatches++;
      }
      if (r.bonus_received !== j.bonus_received) {
        console.error(`✗ user ${p.user_id}: card ${cardId} bonus_received jsonb=${j.bonus_received} rel=${r.bonus_received}`);
        mismatches++;
      }
    }
    for (const [cardId] of relByCard) {
      if (!jsonbByCard.has(cardId)) {
        console.error(`✗ user ${p.user_id}: card ${cardId} in user_cards but missing from jsonb`);
        mismatches++;
      }
    }
  }

  if (mismatches === 0) {
    console.log("✓ parity confirmed across all users");
    process.exit(0);
  }
  console.error(`Found ${mismatches} mismatch(es).`);
  process.exit(1);
}

main()
  .catch((e) => {
    console.error("verify failed:", e);
    process.exit(1);
  })
  .finally(() => sql.end());
