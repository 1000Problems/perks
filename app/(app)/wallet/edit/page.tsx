// /wallet/edit — list/index view of the user's wallet. Feature-flagged
// behind NEXT_PUBLIC_WALLET_EDIT_V2. Clicking any card row navigates to
// /wallet/cards/[id] (the per-card hero page); per-card editing happens
// there, not inline.

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
import { EditWalletClient } from "@/components/wallet-v2/EditWalletClient";
import "@/app/wallet-edit-v2.css";

export const dynamic = "force-dynamic";

export default async function WalletEditPage() {
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

  // Phase 4: load user signals (Phase 3 storage) and merge with
  // auto-derived holdings (e.g. Citi Double Cash held → thank_you_feeder
  // confirmed). Pass as a serializable object; client reconstructs Map.
  const userSignals = await getUserSignals(userId);
  const merged = mergeSignals(userSignals, deriveHoldingSignals(profile.cards_held));
  const signalsObject = Object.fromEntries(merged);

  return (
    <EditWalletClient
      initialProfile={profile}
      serializedDb={toSerialized(db)}
      userSignals={signalsObject}
    />
  );
}
