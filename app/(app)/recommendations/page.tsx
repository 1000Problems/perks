import { redirect } from "next/navigation";
import { RecPanelDesktop } from "@/components/recommender/RecPanelDesktop";
import { RecPanelMobile } from "@/components/recommender/RecPanelMobile";
import { getCurrentProfile } from "@/lib/profile/server";
import { loadCardDatabase } from "@/lib/data/loader";

export default async function RecommendationsPage() {
  let profile;
  try {
    profile = await getCurrentProfile();
  } catch {
    redirect("/login");
  }
  const hasSpend =
    Object.values(profile.spend_profile ?? {}).some((v) => (v ?? 0) > 0);
  if (!hasSpend && (profile.cards_held?.length ?? 0) === 0) {
    redirect("/onboarding/spend");
  }
  const db = loadCardDatabase();
  return (
    <>
      <div className="hidden md:block">
        <RecPanelDesktop profile={profile} db={db} />
      </div>
      <div className="block md:hidden">
        <RecPanelMobile profile={profile} db={db} />
      </div>
    </>
  );
}
