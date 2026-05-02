import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthForm } from "@/components/auth/AuthForm";
import { loginAction } from "@/lib/auth/actions";

export default function LoginPage() {
  return (
    <AuthShell
      title="Sign in to perks"
      subtitle="Welcome back."
      footer={
        <p style={{ marginTop: 18, fontSize: 13, color: "var(--ink-3)", textAlign: "center" }}>
          New here?{" "}
          <Link href="/signup" style={{ color: "var(--ink)" }}>
            Create an account
          </Link>
        </p>
      }
    >
      <AuthForm
        action={loginAction}
        submitLabel="Sign in"
        submittingLabel="Signing in…"
        passwordAutoComplete="current-password"
      />
    </AuthShell>
  );
}
