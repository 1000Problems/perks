import { OnboardingShell } from "@/components/onboarding/OnboardingShell";

export default function OnboardingCardsPage() {
  return (
    <OnboardingShell step={3} title="Cards you already have" next="/recommendations">
      <p style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.5, maxWidth: 560 }}>
        Search-and-add wallet builder. For each card we ask when it was opened (drives 5/24, Amex
        once-per-lifetime) and whether the sign-up bonus was already received. Stub for now.
      </p>
    </OnboardingShell>
  );
}
