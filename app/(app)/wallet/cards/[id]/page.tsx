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
  getCurrentUserId,
  getUserSignals,
  getProgramCppOverrides,
  getPerkFlagsForCard,
} from "@/lib/profile/server";
import { loadCardDatabase } from "@/lib/data/loader";
import { toSerialized } from "@/lib/data/serialized";
import {
  deriveHoldingSignals,
  mergeSignals,
} from "@/lib/engine/holdingSignals";
import { CardHero } from "@/components/wallet-v2/CardHero";
import type { CardPlayState } from "@/lib/profile/types";
import "@/app/wallet-edit-v2.css";
// Editorial card-hero redesign — must import AFTER wallet-edit-v2.css so
// scoped overrides win on equal specificity. All rules in this stylesheet
// are nested under .card-hero-page so they don't leak into other routes.
import "@/app/card-hero-redesign.css";

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
  let userId: string;
  try {
    profile = await getCurrentProfile();
    userId = await getCurrentUserId();
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

  // Phase 4: load + merge signals server-side. Empty object on
  // pre-Phase-3 DBs (getUserSignals tolerates missing table).
  const userSignals = await getUserSignals(userId);
  const merged = mergeSignals(
    userSignals,
    deriveHoldingSignals(profile.cards_held),
  );

  // CLAUDE.md User-driven cpp: per-program cpp overrides drive the
  // YOUR POINTS panel inputs and the Earning section dollar figures.
  // Empty map on pre-0007 DBs (getProgramCppOverrides tolerates
  // missing table).
  const programOverrides = await getProgramCppOverrides(userId);

  // TASK-perk-source-flags: user's open flags on this card's perks.
  // Drives the "You flagged this — undo" state in the inline ⓘ
  // popover. Empty on pre-0008 DBs.
  const { myFlags: perkFlags } = await getPerkFlagsForCard(userId, id);

  return (
    <CardHero
      cardId={id}
      serializedDb={toSerialized(db)}
      profile={profile}
      initialHeld={held}
      initialPlayState={playState}
      isNew={effectiveIsNew}
      userSignals={Object.fromEntries(merged)}
      programOverrides={Object.fromEntries(programOverrides)}
      perkFlags={Object.fromEntries(perkFlags)}
    />
  );
}
