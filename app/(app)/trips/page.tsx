export default function TripsPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "48px 32px",
        maxWidth: 1100,
        margin: "0 auto",
      }}
    >
      <div className="eyebrow">Trip planner</div>
      <h1 style={{ margin: "8px 0 16px", fontSize: 32, letterSpacing: "-0.02em", fontWeight: 600 }}>
        Where are you going?
      </h1>
      <p style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.5, maxWidth: 560 }}>
        Pick a destination — we&apos;ll show what&apos;s bookable today with the points you hold and
        which cards in the rec list would unlock more. Stub for now.
      </p>
    </main>
  );
}
