"use server";

// Server actions for signup, login, logout. Form submissions hit these
// directly via <form action={...}>. Errors come back via useActionState;
// success branches end in redirect() which throws to navigate.
//
// Note: this file may only export async functions. Shared types and
// constants live in lib/auth/types.ts.

import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { createSession, destroySession } from "@/lib/auth/session";
import type { AuthState } from "@/lib/auth/types";

function validateAccount(raw: string): { ok: true; value: string } | { ok: false; error: string } {
  const v = raw.trim().toLowerCase();
  if (v.length < 3) return { ok: false, error: "Account name must be at least 3 characters." };
  if (v.length > 64) return { ok: false, error: "Account name is too long." };
  if (!/^[a-z0-9._-]+$/.test(v)) {
    return { ok: false, error: "Use letters, numbers, dots, dashes, or underscores only." };
  }
  return { ok: true, value: v };
}

function validatePassword(raw: string): string | null {
  if (raw.length < 8) return "Password must be at least 8 characters.";
  if (raw.length > 256) return "Password is too long.";
  return null;
}

interface UserRow {
  id: string;
  account: string;
  password_hash: string;
}

export async function signupAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const accountInput = String(formData.get("account") ?? "");
  const password = String(formData.get("password") ?? "");

  const accountCheck = validateAccount(accountInput);
  if (!accountCheck.ok) return { error: accountCheck.error };
  const account = accountCheck.value;

  const passwordErr = validatePassword(password);
  if (passwordErr) return { error: passwordErr };

  // Uniqueness pre-check. Race on the unique constraint is still possible —
  // we catch and surface it below.
  const existing = await sql<UserRow[]>`
    select id from perks_users where account = ${account} limit 1
  `;
  if (existing.length > 0) {
    return { error: "An account with that name already exists. Try signing in." };
  }

  let userId: string;
  try {
    const passwordHash = await hashPassword(password);
    const inserted = await sql<{ id: string }[]>`
      insert into perks_users (account, password_hash)
      values (${account}, ${passwordHash})
      returning id
    `;
    userId = inserted[0].id;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (/unique|duplicate/i.test(msg)) {
      return { error: "An account with that name already exists. Try signing in." };
    }
    console.error("[auth:signup] insert failed:", msg);
    return { error: "Couldn't create the account. Try again." };
  }

  // Create the empty profile row alongside the user.
  await sql`
    insert into perks_profiles (user_id) values (${userId})
    on conflict (user_id) do nothing
  `;

  await createSession(userId);
  redirect("/onboarding/spend");
}

export async function loginAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const accountInput = String(formData.get("account") ?? "");
  const password = String(formData.get("password") ?? "");

  const accountCheck = validateAccount(accountInput);
  if (!accountCheck.ok) return { error: accountCheck.error };
  const account = accountCheck.value;
  if (!password) return { error: "Enter your password." };

  const rows = await sql<UserRow[]>`
    select id, account, password_hash from perks_users where account = ${account} limit 1
  `;
  const user = rows[0];

  // Constant-ish-time response: hash a dummy password if the user doesn't
  // exist, so timing doesn't reveal which usernames are registered.
  if (!user) {
    await verifyPassword(password, "scrypt$32768$8$1$AAAA$AAAA");
    return { error: "Wrong account or password." };
  }

  const ok = await verifyPassword(password, user.password_hash);
  if (!ok) return { error: "Wrong account or password." };

  await createSession(user.id);

  // If they have an existing profile with any data, send straight to the
  // recommendations. Otherwise drop them into onboarding.
  const profile = await sql<{ has_data: boolean }[]>`
    select (
      jsonb_typeof(spend_profile) = 'object' and spend_profile <> '{}'::jsonb
    ) as has_data
    from perks_profiles where user_id = ${user.id} limit 1
  `;
  const hasData = profile[0]?.has_data === true;
  redirect(hasData ? "/recommendations" : "/onboarding/spend");
}

export async function logoutAction() {
  await destroySession();
  redirect("/");
}
