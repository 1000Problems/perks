import { redirect } from "next/navigation";
import { RecPanelDesktop } from "@/components/recommender/RecPanelDesktop";
import { getCurrentProfile } from "@/lib/profile/server";
import { loadCardDatabase } from "@/lib/data/loader";

export default async function RecommendationsPage() {
  let profile;
  try {
    profile = await getCurrentProfile();
  } catch {
    redirect("/login");
  }
  // Cold-start guard: brand-new account with no spend data and no held
  // cards lands on onboarding. The form persists progress as the user
  // moves; once any spend is set, this page becomes the value moment.
  const hasSpend =
    Object.values(profile.spend_profile ?? {}).some((v) => (v ?? 0) > 0);
  if (!hasSpend && (profile.cards_held?.length ?? 0) === 0) {
    redirect("/onboarding/spend");
  }
  const db = loadCardDatabase();
  return <RecPanelDesktop profile={profile} db={db} />;
}
