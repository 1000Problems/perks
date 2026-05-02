import { redirect } from "next/navigation";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { CardsForm } from "@/components/onboarding/CardsForm";
import { getCurrentProfile } from "@/lib/profile/server";
import { loadCardDatabase } from "@/lib/data/loader";
import { toSerialized } from "@/lib/data/serialized";

export default async function OnboardingCardsPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  let profile;
  try {
    profile = await getCurrentProfile();
  } catch {
    redirect("/login");
  }
  const { from } = await searchParams;
  const editMode = from === "settings";
  const db = loadCardDatabase();
  return (
    <OnboardingShell
      step={4}
      title={editMode ? "Edit your wallet" : "Cards you already have"}
      hideContinue
      editMode={editMode}
    >
      <CardsForm
        initialProfile={profile}
        serializedDb={toSerialized(db)}
        editMode={editMode}
      />
    </OnboardingShell>
  );
}
