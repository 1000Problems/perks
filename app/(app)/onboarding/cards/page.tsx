import { redirect } from "next/navigation";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { CardsForm } from "@/components/onboarding/CardsForm";
import { getCurrentProfile } from "@/lib/profile/server";
import { loadCardDatabase } from "@/lib/data/loader";

export default async function OnboardingCardsPage() {
  let profile;
  try {
    profile = await getCurrentProfile();
  } catch {
    redirect("/login");
  }
  const db = loadCardDatabase();
  // Slim DB shape — the client form only needs cards, issuer rules, and
  // dedup entries. Programs/destinations are not used in onboarding.
  const serializedDb = {
    cards: db.cards,
    issuerRules: db.issuerRules,
    perksDedup: db.perksDedup,
  };
  return (
    <OnboardingShell step={3} title="Cards you already have" hideContinue>
      <CardsForm initialProfile={profile} cards={db.cards} serializedDb={serializedDb} />
    </OnboardingShell>
  );
}
