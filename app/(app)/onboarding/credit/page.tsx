import { redirect } from "next/navigation";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { CreditForm } from "@/components/onboarding/CreditForm";
import { getCurrentProfile } from "@/lib/profile/server";

export default async function OnboardingCreditPage({
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
      step={1}
      title={editMode ? "Edit your credit band" : "What's your credit like?"}
      hideContinue
      editMode={editMode}
    >
      <CreditForm
        initialBand={profile.credit_score_band ?? null}
        editMode={editMode}
      />
    </OnboardingShell>
  );
}
