import { redirect } from "next/navigation";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { BrandsForm } from "@/components/onboarding/BrandsForm";
import { getCurrentProfile } from "@/lib/profile/server";

export default async function OnboardingBrandsPage({
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
      step={3}
      title={editMode ? "Edit brands & trips" : "What do you actually use?"}
      hideContinue
      editMode={editMode}
    >
      <BrandsForm initialProfile={profile} editMode={editMode} />
    </OnboardingShell>
  );
}
