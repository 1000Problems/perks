import { redirect } from "next/navigation";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { CreditForm } from "@/components/onboarding/CreditForm";
import { getCurrentProfile } from "@/lib/profile/server";

export default async function OnboardingCreditPage() {
  let profile;
  try {
    profile = await getCurrentProfile();
  } catch {
    redirect("/login");
  }
  return (
    <OnboardingShell step={1} title="What's your credit like?" hideContinue>
      <CreditForm initialBand={profile.credit_score_band ?? null} />
    </OnboardingShell>
  );
}
