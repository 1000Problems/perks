// /wallet/list — Phase 5 of signal-first architecture.
//
// Cross-card aggregation of every play whose state is "interested"
// across the user's wallet. Sortable by value or by source card.
// Empty-state prompt when nothing is on the list yet. Same v2
// feature-flag as the rest of the wallet redesign.

import { notFound, redirect } from "next/navigation";
import {
  getCurrentProfile,
  getCurrentUserId,
  getUserSignals,
} from "@/lib/profile/server";
import { loadCardDatabase } from "@/lib/data/loader";
import { toSerialized } from "@/lib/data/serialized";
import {
  deriveHoldingSignals,
  mergeSignals,
} from "@/lib/engine/holdingSignals";
import { getOnMyListItems } from "@/lib/engine/cardValue";
import { OnMyListClient, type OnMyListEntry } from "@/components/wallet-v2/OnMyListClient";
import "@/app/wallet-edit-v2.css";

export const dynamic = "force-dynamic";

export default async function WalletListPage() {
  if (process.env.NEXT_PUBLIC_WALLET_EDIT_V2 !== "1") {
    notFound();
  }

  let profile;
  let userId: string;
  try {
    profile = await getCurrentProfile();
    userId = await getCurrentUserId();
  } catch {
    redirect("/login");
  }

  const db = loadCardDatabase();

  const userSignals = await getUserSignals(userId);
  const merged = mergeSignals(
    userSignals,
    deriveHoldingSignals(profile.cards_held),
  );
  const items = getOnMyListItems(profile, merged, db);

  // Flatten the data the client needs. Don't pass Play objects across
  // the RSC boundary — the per-row UI only wants the headline + group
  // + value plus enough card identity to render the link and a thumb.
  const entries: OnMyListEntry[] = items.map((i) => {
    const card = db.cardById.get(i.cardId);
    return {
      cardId: i.cardId,
      playId: i.play.id,
      headline: i.play.headline,
      group: i.group,
      valueUsd: i.valueUsd,
      cardName: card?.name ?? i.cardId,
      cardIssuer: card?.issuer ?? "",
      cardNetwork: card?.network ?? null,
    };
  });

  return (
    <OnMyListClient
      entries={entries}
      serializedDb={toSerialized(db)}
    />
  );
}
