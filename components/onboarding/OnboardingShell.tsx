import Link from "next/link";
import type { Route } from "next";

interface Props {
  step: 1 | 2 | 3;
  title: string;
  next?: Route;
  children: React.ReactNode;
  // If true, the shell skips its own Continue link — the child renders
  // the navigation itself (for forms that need to persist before moving on).
  hideContinue?: boolean;
}

export function OnboardingShell({
  step,
  title,
  next,
  children,
  hideContinue,
}: Props) {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "48px 32px 96px",
        maxWidth: 880,
        margin: "0 auto",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
        <div className="eyebrow">Step {step} of 3</div>
        <div style={{ height: 2, flex: 1, background: "var(--rule)", borderRadius: 1 }}>
          <div
            style={{
              height: 2,
              width: `${(step / 3) * 100}%`,
              background: "var(--ink)",
              borderRadius: 1,
            }}
          />
        </div>
      </div>
      <h1 style={{ margin: 0, fontSize: 32, letterSpacing: "-0.02em", fontWeight: 600 }}>{title}</h1>
      <div style={{ marginTop: 24 }}>{children}</div>
      {!hideContinue && next && (
        <div style={{ marginTop: 48, display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <Link href={next} className="btn btn-primary">
            Continue
          </Link>
        </div>
      )}
    </main>
  );
}
