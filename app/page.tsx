import Link from "next/link";

export default function LandingPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 24px",
        textAlign: "center",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: "var(--ink)",
            display: "grid",
            placeItems: "center",
            color: "var(--paper)",
            fontFamily: "var(--font-display), serif",
            fontSize: 18,
            fontWeight: 500,
          }}
        >
          p
        </div>
        <span style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.01em" }}>perks</span>
      </div>
      <h1
        className="num"
        style={{
          fontSize: 56,
          letterSpacing: "-0.02em",
          fontWeight: 400,
          maxWidth: 720,
          margin: 0,
          lineHeight: 1.05,
        }}
      >
        The single best next card to add to your wallet.
      </h1>
      <p
        style={{
          marginTop: 20,
          fontSize: 17,
          color: "var(--ink-2)",
          maxWidth: 560,
          lineHeight: 1.5,
        }}
      >
        Tell us how you spend and what cards you already hold. We tell you what card to add next, what
        it would actually save you, and which trips it unlocks.
      </p>
      <div style={{ marginTop: 32, display: "flex", gap: 12 }}>
        <Link href="/login" className="btn btn-primary">
          Sign in
        </Link>
      </div>
    </main>
  );
}
