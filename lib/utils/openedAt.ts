// Tiny shared helpers for the per-card "Opened" date control.
//
// `opened_at` is stored as `YYYY-MM-01` on every WalletCardHeld row —
// day precision isn't useful and we want a stable canonical form. The
// month/year are decomposed for the picker UI and recomposed on write.
//
// Hoisted out of SignalsEditor so the new OpenedAtPill on the identity
// strip and the existing editor share the same parsing/formatting.

export const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

/**
 * Parse a `YYYY-MM-DD` string into [year, month] (month 1-indexed). Returns
 * [null, null] for missing or malformed input — callers fall back to
 * "today" before writing back.
 */
export function parseYM(iso: string | undefined): [number | null, number | null] {
  if (!iso) return [null, null];
  const [y, m] = iso.split("-").map(Number);
  return [Number.isFinite(y) ? y : null, Number.isFinite(m) ? m : null];
}

/**
 * Compose a canonical `YYYY-MM-01` from a year + 1-indexed month. The
 * `_prev` argument is ignored; it's there so the call site reads as a
 * patch over the previous opened_at value.
 */
export function setYM(_prev: string | undefined, year: number, month: number): string {
  const mm = String(month).padStart(2, "0");
  return `${year}-${mm}-01`;
}

/** "Apr 2024" — used by the OpenedAtPill display state. */
export function formatMonYear(iso: string | undefined): string | null {
  const [y, m] = parseYM(iso);
  if (!y || !m) return null;
  return `${MONTH_LABELS[m - 1]} ${y}`;
}
