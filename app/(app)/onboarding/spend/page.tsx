import { OnboardingShell } from "@/components/onboarding/OnboardingShell";

export default function OnboardingSpendPage() {
  return (
    <OnboardingShell step={1} title="How do you spend?" next="/onboarding/brands">
      <p style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.5, maxWidth: 560 }}>
        Sliders for the twelve categories that matter, with US-household defaults pre-filled. Live
        total at the top. Stub for now — the real component is a TASK file for Code.
      </p>
    </OnboardingShell>
  );
}
