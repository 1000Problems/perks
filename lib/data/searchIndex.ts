// Search haystack for the recommendations search box. Pure UI helper —
// not consumed by the engine. Builds a single lowercased string per Card
// from the fields that match user search intent: name, issuer, network,
// rewards currency, best-for tags, categories, ongoing perk names, and
// annual credit names. Substring match is the predicate; no fuzzy.
//
// Cache is a WeakMap keyed on Card so it's automatically dropped when
// the database is rebuilt (fromSerialized produces fresh objects on
// each remount).

import type { Card } from "@/lib/data/loader";

const cache = new WeakMap<Card, string>();

export function haystackFor(card: Card): string {
  const cached = cache.get(card);
  if (cached !== undefined) return cached;
  const parts: string[] = [
    card.name,
    card.issuer,
    card.network ?? "",
    card.currency_earned ?? "",
    ...(card.best_for ?? []),
    ...(card.category ?? []),
    ...card.ongoing_perks.map((p) => p.name),
    ...card.annual_credits.map((c) => c.name),
  ];
  const out = parts.join(" ").toLowerCase();
  cache.set(card, out);
  return out;
}

// Predicate factory — normalizes the query once. Empty/whitespace
// query returns a tautology (no filter applied).
export function makeQueryPredicate(query: string): (card: Card) => boolean {
  const q = query.trim().toLowerCase();
  if (q.length === 0) return () => true;
  return (card) => haystackFor(card).includes(q);
}

// Segment predicate — duplicated from lib/engine/ranking.ts so the UI
// can apply it independently when search overrides the engine's filter.
// If the thresholds in ranking.ts ever change, update this function too.
export type SegmentFilter = "total" | "nofee" | "premium";

export function segmentMatches(
  filter: SegmentFilter,
  fee: number | null | undefined,
): boolean {
  const f = fee ?? 0;
  if (filter === "nofee") return f === 0;
  if (filter === "premium") return f >= 395;
  return true;
}

// Returns the highest-scoring card whose name (not the full haystack)
// contains the query. Used to pin a name-match to position 1.
export function nameMatch<T extends { card: Card }>(
  rows: T[],
  query: string,
): T | null {
  const q = query.trim().toLowerCase();
  if (q.length === 0) return null;
  for (const r of rows) {
    if (r.card.name.toLowerCase().includes(q)) return r;
  }
  return null;
}
