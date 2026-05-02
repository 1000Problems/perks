import { redirect } from "next/navigation";
import { RecPanelDesktop } from "@/components/recommender/RecPanelDesktop";
import { getCurrentProfile } from "@/lib/profile/server";

export default async function RecommendationsPage() {
  let profile;
  try {
    profile = await getCurrentProfile();
  } catch {
    redirect("/login");
  }
  return <RecPanelDesktop profile={profile} />;
}
