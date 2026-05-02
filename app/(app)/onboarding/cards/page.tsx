import { redirect } from "next/navigation";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { CardsForm } from "@/components/onboarding/CardsForm";
import { getCurrentProfile } from "@/lib/profile/server";
import { loadCardDatabase } from "@/lib/data/loader";
import { toSerialized } from "@/lib/data/serialized";

export default async function OnboardingCardsPage() {
  let profile;
  try {
    profile = await getCurrentProfile();
  } catch {
    redirect("/login");
  }
  const db = loadCardDatabase();
  return (
    <OnboardingShell step={3} title="Cards you already have" hideContinue>
      <CardsForm initialProfile={profile} serializedDb={toSerialized(db)} />
    </OnboardingShell>
  );
}
