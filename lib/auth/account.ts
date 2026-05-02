// Helpers for the "account name + password" UX where Supabase requires
// email-shaped identifiers under the hood.

// The fake-email domain we append to bare account names. Should match the
// production domain so Supabase's email validator accepts it. Override per
// environment with NEXT_PUBLIC_AUTH_DOMAIN if needed.
const DEFAULT_DOMAIN = "perks.1000problems.com";
const FAKE_DOMAIN =
  process.env.NEXT_PUBLIC_AUTH_DOMAIN?.trim() || DEFAULT_DOMAIN;

// If the user typed something that already looks like an email, use it
// as-is. Otherwise, append our fake domain. This is invisible to the user
// — they only ever see the field as "Account."
export function toEmail(account: string): string {
  const trimmed = account.trim();
  if (trimmed.includes("@")) return trimmed.toLowerCase();
  return `${trimmed.toLowerCase()}@${FAKE_DOMAIN}`;
}

// Validate the account name itself before we shape it into an email. We're
// permissive: 3+ chars, no whitespace, no control characters.
export function validateAccount(account: string): string | null {
  const trimmed = account.trim();
  if (trimmed.length < 3) return "Account name must be at least 3 characters.";
  if (/\s/.test(trimmed)) return "Account name can't contain spaces.";
  return null;
}

export function validatePassword(password: string): string | null {
  if (password.length < 8) return "Password must be at least 8 characters.";
  return null;
}
