import { OnboardingShell } from "@/components/onboarding/OnboardingShell";

export default function OnboardingBrandsPage() {
  return (
    <OnboardingShell step={2} title="Brands and trips" next="/onboarding/cards">
      <p style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.5, maxWidth: 560 }}>
        Multi-select chips for stores, airlines, hotels, services. Plus a destinations input that
        powers hidden-gem detection. Stub for now.
      </p>
    </OnboardingShell>
  );
}
