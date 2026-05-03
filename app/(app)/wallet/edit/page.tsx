// /wallet/edit — list/index view of the user's wallet. Feature-flagged
// behind NEXT_PUBLIC_WALLET_EDIT_V2. Clicking any card row navigates to
// /wallet/cards/[id] (the per-card hero page); per-card editing happens
// there, not inline.

import { notFound, redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/profile/server";
import { loadCardDatabase } from "@/lib/data/loader";
import { toSerialized } from "@/lib/data/serialized";
import { EditWalletClient } from "@/components/wallet-v2/EditWalletClient";
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

  return (
    <EditWalletClient
      initialProfile={profile}
      serializedDb={toSerialized(db)}
    />
  );
}
