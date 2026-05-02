import { redirect } from "next/navigation";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { SpendForm } from "@/components/onboarding/SpendForm";
import { getCurrentProfile } from "@/lib/profile/server";

export default async function OnboardingSpendPage() {
  let profile;
  try {
    profile = await getCurrentProfile();
  } catch {
    redirect("/login");
  }
  return (
    <OnboardingShell step={1} title="How do you spend?" hideContinue>
      <SpendForm initialProfile={profile} />
    </OnboardingShell>
  );
}
