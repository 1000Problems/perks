// Numbered section header used across the recommendation surfaces.
// Lifted out of DrillIn so the wallet-row expansion can match its
// visual language exactly (eyebrow + 0{num} mono prefix + h3 title).

interface Props {
  num: string;
  title: string;
  children: React.ReactNode;
  // Tighten the top margin when the section is nested inside a row
  // expansion (default rec-panel spacing is too generous there).
  compact?: boolean;
}

export function Section({ num, title, children, compact = false }: Props) {
  return (
    <section style={{ marginTop: compact ? 16 : 28 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 10 }}>
        <span
          style={{
            fontSize: 11,
            fontFamily: "var(--font-mono), ui-monospace, monospace",
            color: "var(--ink-4)",
          }}
        >
          0{num}
        </span>
        <h3 style={{ margin: 0, fontSize: 13, fontWeight: 600, letterSpacing: "-0.005em" }}>
          {title}
        </h3>
      </div>
      {children}
    </section>
  );
}
