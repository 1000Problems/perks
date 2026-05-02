"use server";

// Server actions for login, signup, and logout. Form submissions hit these
// directly via <form action={...}>. Errors come back via useActionState;
// success branches end in redirect() which throws to navigate.
//
// Note: this file may only export async functions. Shared types and
// constants live in lib/auth/types.ts.

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  toEmail,
  validateAccount,
  validatePassword,
} from "@/lib/auth/account";
import type { AuthState } from "@/lib/auth/types";

// Map a raw Supabase error to a user-facing string. Logs the full original
// error server-side (visible in Vercel function logs) so we can debug
// without leaking internals to the client when the message is generic.
function describeAuthError(
  context: "login" | "signup",
  error: { message: string; status?: number; code?: string },
): string {
  console.error(`[auth:${context}]`, {
    message: error.message,
    status: error.status,
    code: error.code,
  });

  const msg = error.message.toLowerCase();

  if (/invalid login credentials/.test(msg)) {
    return "Wrong account or password.";
  }
  if (/registered|already exists|user already/.test(msg)) {
    return "An account with that name already exists. Try signing in.";
  }
  if (/email.*invalid|invalid.*email|unable to validate email/.test(msg)) {
    return "That account name isn't accepted. Try a more email-like format (e.g. you@example.com).";
  }
  if (/password.*at least|password.*short|weak password/.test(msg)) {
    return "Password is too weak. Try at least 8 characters with mixed types.";
  }
  if (/rate limit|too many/.test(msg)) {
    return "Too many tries. Wait a minute and try again.";
  }
  if (/signups not allowed|signup is disabled/.test(msg)) {
    return "Signups are disabled. Enable email signups in Supabase Auth settings.";
  }
  if (/captcha/.test(msg)) {
    return "CAPTCHA is required. Disable it in Supabase Auth settings or wire it up.";
  }

  // Pass through the raw Supabase message so you can see what's wrong.
  // It's safe to show — Supabase auth errors don't leak credentials.
  return `Auth error: ${error.message}`;
}

export async function loginAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const account = String(formData.get("account") ?? "");
  const password = String(formData.get("password") ?? "");

  const accountErr = validateAccount(account);
  if (accountErr) return { error: accountErr };
  if (!password) return { error: "Enter your password." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: toEmail(account),
    password,
  });

  if (error) {
    return { error: describeAuthError("login", error) };
  }

  // Decide where to send the user. If they have a profile row, head straight
  // to the recommendations. Otherwise drop them into onboarding.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Login failed unexpectedly." };

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  redirect(profile ? "/recommendations" : "/onboarding/spend");
}

export async function signupAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const account = String(formData.get("account") ?? "");
  const password = String(formData.get("password") ?? "");

  const accountErr = validateAccount(account);
  if (accountErr) return { error: accountErr };
  const passwordErr = validatePassword(password);
  if (passwordErr) return { error: passwordErr };

  const supabase = await createClient();
  const email = toEmail(account);
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return { error: describeAuthError("signup", error) };
  }

  // Supabase returns success with no session when "Confirm email" is on.
  // We disabled confirmation, so we should always have a session here. If
  // not, surface that — it's the most common deployment-time misconfig.
  if (!data.session) {
    console.error("[auth:signup] no session returned — check Supabase Auth → Email → 'Confirm email' is OFF");
    return {
      error:
        "Account created but no session. In Supabase: Authentication → Providers → Email, turn off 'Confirm email'.",
    };
  }

  // Insert an empty profile row. RLS allows this because the user just
  // signed up and is authenticated under their own id.
  if (data.user) {
    const { error: profileErr } = await supabase
      .from("profiles")
      .insert({ id: data.user.id });
    if (profileErr) {
      console.warn("[auth:signup] profiles insert failed:", profileErr.message);
    }
  }

  redirect("/onboarding/spend");
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
