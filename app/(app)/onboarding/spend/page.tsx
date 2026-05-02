import { redirect } from "next/navigation";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { SpendForm } from "@/components/onboarding/SpendForm";
import { getCurrentProfile } from "@/lib/profile/server";

export default async function OnboardingSpendPage({
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
  return (
    <OnboardingShell
      step={2}
      title={editMode ? "Edit your spend" : "How do you spend?"}
      hideContinue
      editMode={editMode}
    >
      <SpendForm initialProfile={profile} editMode={editMode} />
    </OnboardingShell>
  );
}
