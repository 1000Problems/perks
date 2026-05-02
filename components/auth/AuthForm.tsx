"use client";

import { useActionState } from "react";
import {
  type AuthState,
  initialAuthState,
} from "@/lib/auth/types";

type Action = (state: AuthState, formData: FormData) => Promise<AuthState>;

interface Props {
  action: Action;
  submitLabel: string;
  submittingLabel: string;
  passwordAutoComplete: "current-password" | "new-password";
  helperText?: string;
}

export function AuthForm({
  action,
  submitLabel,
  submittingLabel,
  passwordAutoComplete,
  helperText,
}: Props) {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    action,
    initialAuthState,
  );

  return (
    <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Field
        label="Account"
        name="account"
        type="text"
        autoComplete="username"
        helper={helperText}
      />
      <Field
        label="Password"
        name="password"
        type="password"
        autoComplete={passwordAutoComplete}
      />
      {state.error && (
        <div
          role="alert"
          style={{
            fontSize: 12.5,
            color: "var(--neg-ink)",
            background: "var(--neg-bg)",
            border: "1px solid var(--neg)",
            padding: "8px 10px",
            borderRadius: "var(--r-sm)",
            lineHeight: 1.4,
          }}
        >
          {state.error}
        </div>
      )}
      <button
        type="submit"
        className="btn btn-primary"
        style={{ marginTop: 6, justifyContent: "center" }}
        disabled={pending}
        aria-busy={pending}
      >
        {pending ? submittingLabel : submitLabel}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type,
  autoComplete,
  helper,
}: {
  label: string;
  name: string;
  type: string;
  autoComplete: string;
  helper?: string;
}) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span className="eyebrow">{label}</span>
      <input
        name={name}
        type={type}
        autoComplete={autoComplete}
        required
        spellCheck={type === "password" ? false : undefined}
        autoCapitalize="off"
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
      {helper && (
        <span style={{ fontSize: 11.5, color: "var(--ink-3)", lineHeight: 1.4 }}>
          {helper}
        </span>
      )}
    </label>
  );
}
