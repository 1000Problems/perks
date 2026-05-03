// /wallet/cards/[id] — the per-card hero page. Feature-flagged behind
// the same NEXT_PUBLIC_WALLET_EDIT_V2 flag as /wallet/edit. Shows the
// card's full value content (earning, credits, transfers, sweet spots,
// rules) above the signals editor.
//
// Two scenarios:
//   - ?new=1 (or any value) → draft mode for adding a card from search
//   - default → edit mode for an existing held card

import { notFound, redirect } from "next/navigation";
import {
  getCurrentProfile,
  getCurrentCardPlayState,
} from "@/lib/profile/server";
import { loadCardDatabase } from "@/lib/data/loader";
import { toSerialized } from "@/lib/data/serialized";
import { CardHero } from "@/components/wallet-v2/CardHero";
import type { CardPlayState } from "@/lib/profile/types";
import "@/app/wallet-edit-v2.css";

export const dynamic = "force-dynamic";

export default async function CardHeroPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ new?: string }>;
}) {
  if (process.env.NEXT_PUBLIC_WALLET_EDIT_V2 !== "1") {
    notFound();
  }

  const { id } = await params;
  const { new: newFlag } = await searchParams;
  const isNew = Boolean(newFlag);

  let profile;
  try {
    profile = await getCurrentProfile();
  } catch {
    redirect("/login");
  }

  const db = loadCardDatabase();
  if (!db.cardById.has(id)) {
    notFound();
  }

  const held = profile.cards_held.find((h) => h.card_id === id) ?? null;
  // If the user navigated to a card they already hold with ?new=1, drop
  // the flag — they're really editing.
  const effectiveIsNew = isNew && !held;

  let playState: CardPlayState[];
  try {
    playState = await getCurrentCardPlayState(id);
  } catch {
    playState = [];
  }

  return (
    <CardHero
      cardId={id}
      serializedDb={toSerialized(db)}
      profile={profile}
      initialHeld={held}
      initialPlayState={playState}
      isNew={effectiveIsNew}
    />
  );
}
