import { redirect } from "next/navigation";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { BrandsForm } from "@/components/onboarding/BrandsForm";
import { getCurrentProfile } from "@/lib/profile/server";

export default async function OnboardingBrandsPage() {
  let profile;
  try {
    profile = await getCurrentProfile();
  } catch {
    redirect("/login");
  }
  return (
    <OnboardingShell step={2} title="What do you actually use?" hideContinue>
      <BrandsForm initialProfile={profile} />
    </OnboardingShell>
  );
}
