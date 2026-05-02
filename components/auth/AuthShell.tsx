import Link from "next/link";

interface Props {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}

export function AuthShell({ title, subtitle, children, footer }: Props) {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "40px 24px",
      }}
    >
      <div style={{ width: "100%", maxWidth: 360 }}>
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            textDecoration: "none",
            color: "inherit",
            marginBottom: 28,
          }}
        >
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: 6,
              background: "var(--ink)",
              display: "grid",
              placeItems: "center",
              color: "var(--paper)",
              fontFamily: "var(--font-display), serif",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            p
          </div>
          <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em" }}>perks</span>
        </Link>
        <h1 style={{ margin: 0, fontSize: 24, letterSpacing: "-0.01em", fontWeight: 600 }}>
          {title}
        </h1>
        <p style={{ marginTop: 8, marginBottom: 22, fontSize: 14, color: "var(--ink-3)" }}>
          {subtitle}
        </p>
        {children}
        {footer}
      </div>
    </main>
  );
}
