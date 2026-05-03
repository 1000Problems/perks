// /wallet/edit — feature-flagged redesign of the wallet editor.
// Auth-gated by the (app)/ layout. Returns 404 when the v2 flag is off
// so the route doesn't accidentally leak. Hydrates the user's profile
// + held cards + per-card play state and hands them to the client
// component.

import { notFound, redirect } from "next/navigation";
import { getCurrentProfile, getCurrentCardPlayState } from "@/lib/profile/server";
import { loadCardDatabase } from "@/lib/data/loader";
import { toSerialized } from "@/lib/data/serialized";
import { EditWalletClient } from "@/components/wallet-v2/EditWalletClient";
import type { CardPlayState } from "@/lib/profile/types";
import "@/app/wallet-edit-v2.css";

export const dynamic = "force-dynamic";

export default async function WalletEditPage() {
  if (process.env.NEXT_PUBLIC_WALLET_EDIT_V2 !== "1") {
    notFound();
  }

  let profile;
  try {
    profile = await getCurrentProfile();
  } catch {
    redirect("/login");
  }

  const db = loadCardDatabase();

  // Hydrate per-card play state for every held card. Soft-fails per
  // card if migration 0005 hasn't applied; the UI then renders all
  // toggles as 'unset' (the default).
  const playStateByCard: Record<string, CardPlayState[]> = {};
  for (const held of profile.cards_held) {
    try {
      playStateByCard[held.card_id] = await getCurrentCardPlayState(held.card_id);
    } catch {
      playStateByCard[held.card_id] = [];
    }
  }

  return (
    <EditWalletClient
      initialProfile={profile}
      serializedDb={toSerialized(db)}
      initialPlayStateByCard={playStateByCard}
    />
  );
}
