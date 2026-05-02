import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthForm } from "@/components/auth/AuthForm";
import { signupAction } from "@/lib/auth/actions";

export default function SignupPage() {
  return (
    <AuthShell
      title="Create your account"
      subtitle="No email verification. Pick a name and a password — that's it."
      footer={
        <p style={{ marginTop: 18, fontSize: 13, color: "var(--ink-3)", textAlign: "center" }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "var(--ink)" }}>
            Sign in
          </Link>
        </p>
      }
    >
      <AuthForm
        action={signupAction}
        submitLabel="Create account"
        submittingLabel="Creating…"
        passwordAutoComplete="new-password"
        helperText="Letters, numbers, dots, and dashes. Minimum 3 characters."
      />
    </AuthShell>
  );
}
