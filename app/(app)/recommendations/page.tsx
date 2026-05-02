import { redirect } from "next/navigation";
import { RecPanelDesktop } from "@/components/recommender/RecPanelDesktop";
import { RecPanelMobile } from "@/components/recommender/RecPanelMobile";
import { getCurrentProfile } from "@/lib/profile/server";
import { loadCardDatabase } from "@/lib/data/loader";
import { toSerialized } from "@/lib/data/serialized";

export default async function RecommendationsPage() {
  let profile;
  try {
    profile = await getCurrentProfile();
  } catch {
    redirect("/login");
  }
  // Onboarding gate — credit band first, then spend.
  if (profile.credit_score_band == null) {
    redirect("/onboarding/credit");
  }
  const hasSpend =
    Object.values(profile.spend_profile ?? {}).some((v) => (v ?? 0) > 0);
  if (!hasSpend && (profile.cards_held?.length ?? 0) === 0) {
    redirect("/onboarding/spend");
  }
  const db = loadCardDatabase();
  const serializedDb = toSerialized(db);
  return (
    <>
      <div className="hidden md:block">
        <RecPanelDesktop profile={profile} serializedDb={serializedDb} />
      </div>
      <div className="block md:hidden">
        <RecPanelMobile profile={profile} serializedDb={serializedDb} />
      </div>
    </>
  );
}
