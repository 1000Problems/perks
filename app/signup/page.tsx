import Link from "next/link";

export default function SignupPage() {
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
          Create your account
        </h1>
        <p style={{ marginTop: 8, marginBottom: 22, fontSize: 14, color: "var(--ink-3)" }}>
          No email verification. Pick an account name and a password — that&apos;s it.
        </p>

        <form
          style={{ display: "flex", flexDirection: "column", gap: 14 }}
          action="/api/auth/signup"
          method="post"
        >
          <Field label="Account" name="email" type="text" autoComplete="username" />
          <Field label="Password" name="password" type="password" autoComplete="new-password" />
          <button type="submit" className="btn btn-primary" style={{ marginTop: 6, justifyContent: "center" }}>
            Create account
          </button>
        </form>

        <p style={{ marginTop: 18, fontSize: 13, color: "var(--ink-3)", textAlign: "center" }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "var(--ink)" }}>
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}

function Field({
  label,
  name,
  type,
  autoComplete,
}: {
  label: string;
  name: string;
  type: string;
  autoComplete: string;
}) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span className="eyebrow">{label}</span>
      <input
        name={name}
        type={type}
        autoComplete={autoComplete}
        required
        minLength={type === "password" ? 8 : undefined}
        style={{
          font: "inherit",
          fontSize: 14,
          padding: "10px 12px",
          borderRadius: "var(--r-md)",
          border: "1px solid var(--rule-2)",
          background: "white",
          color: "var(--ink)",
        }}
      />
    </label>
  );
}
