// perkSource — map a play.id back to the source citation on its
// corresponding annual_credit or ongoing_perk. Used by the per-card
// hero page to render an inline ⓘ link next to each perk row's title.
//
// Resolution strategy (TASK-per-perk-source-urls), in order:
//   1. Explicit override — a small play.id → perk.name table for cases
//      the heuristics miss (e.g. "fx_zero" → "No foreign transaction
//      fees", which share no tokens).
//   2. Signal ID match — when play.value_model.requires_signal_id
//      equals a credit/perk's signal_id, the credit/perk is the
//      canonical match. Strongest signal we have without authoring.
//   3. Token / substring match — tokenize play.id and the perk name,
//      score by Jaccard plus substring containment. Highest-scoring
//      perk above a small threshold wins.
//
// Returns undefined when no perk matches (airline-redemption plays,
// earning multiplier plays, niche plays — none of these are perks).

import type { Card, Play } from "@/lib/data/loader";

export interface PerkSource {
  url: string;
  type: "issuer" | "network" | "underwriter" | "partner" | "community";
  label?: string;
  verified_at?: string;
}

// Carries the source plus the perk identity (kind + name) so the UI
// can pass it straight to flag actions without re-resolving.
export interface ResolvedSource {
  source: PerkSource;
  perkKind: "annual_credit" | "ongoing_perk";
  perkName: string;
}

// Explicit overrides for plays whose id doesn't tokenize cleanly to
// the perk name. Add entries here as new edge cases surface across
// the catalog rollout. Per-card prefixed (`{card_id}::{play_id}`) so
// the same play.id on different cards can resolve differently.
const EXPLICIT_OVERRIDES: Record<string, string> = {
  "citi_strata_premier::fx_zero": "No foreign transaction fees",
};

const STOP_TOKENS: ReadonlySet<string> = new Set([
  "the",
  "and",
  "for",
  "with",
  "your",
  "every",
]);

function tokenize(s: string): Set<string> {
  const tokens = s
    .toLowerCase()
    .split(/[\s_+/&-]+/)
    .map((t) => t.replace(/[^a-z0-9]/g, ""))
    .filter((t) => t.length > 2 && !STOP_TOKENS.has(t));
  return new Set(tokens);
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let intersection = 0;
  for (const t of a) if (b.has(t)) intersection += 1;
  const union = a.size + b.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

function substringScore(a: string, b: string): number {
  // 1.0 if either fully contains a meaningful slice of the other.
  // Used to rescue cases like "rental_cdw" → "MasterRental car
  // insurance" where the token "rental" is a substring of "masterrental".
  const al = a.toLowerCase();
  const bl = b.toLowerCase();
  for (const t of tokenize(a)) {
    if (t.length >= 5 && bl.includes(t)) return 0.4;
  }
  for (const t of tokenize(b)) {
    if (t.length >= 5 && al.includes(t)) return 0.3;
  }
  return 0;
}

function getRequiresSignal(play: Play): string | null {
  const vm = play.value_model as { requires_signal_id?: string };
  return vm?.requires_signal_id ?? null;
}

interface CatalogEntry {
  name: string;
  kind: "annual_credit" | "ongoing_perk";
  signal_id?: string | null;
  source?: PerkSource;
}

export function findSourceForPlay(
  card: Card,
  play: Play,
): ResolvedSource | undefined {
  // 1. Explicit override.
  const overrideKey = `${card.id}::${play.id}`;
  const overrideName = EXPLICIT_OVERRIDES[overrideKey];

  const entries: CatalogEntry[] = [
    ...card.annual_credits.map((c) => ({
      name: c.name,
      kind: "annual_credit" as const,
      signal_id: c.signal_id,
      source: c.source as PerkSource | undefined,
    })),
    ...card.ongoing_perks.map((p) => ({
      name: p.name,
      kind: "ongoing_perk" as const,
      signal_id: p.signal_id,
      source: p.source as PerkSource | undefined,
    })),
  ];
  if (overrideName) {
    const hit = entries.find((e) => e.name === overrideName);
    if (hit?.source) {
      return { source: hit.source, perkKind: hit.kind, perkName: hit.name };
    }
  }

  // 2. Signal ID match.
  const requiresSignal = getRequiresSignal(play);
  if (requiresSignal) {
    const hit = entries.find(
      (e) => e.signal_id === requiresSignal && e.source != null,
    );
    if (hit?.source) {
      return { source: hit.source, perkKind: hit.kind, perkName: hit.name };
    }
  }

  // 3. Token + substring match. Score every entry, return highest
  // above a small threshold.
  const playTokens = tokenize(play.id);
  let best: { score: number; entry: CatalogEntry } | null = null;
  for (const e of entries) {
    if (!e.source) continue;
    const tokens = tokenize(e.name);
    const score =
      jaccard(playTokens, tokens) + substringScore(play.id, e.name);
    if (score > 0.25 && (best == null || score > best.score)) {
      best = { score, entry: e };
    }
  }
  if (best && best.entry.source) {
    return {
      source: best.entry.source,
      perkKind: best.entry.kind,
      perkName: best.entry.name,
    };
  }
  return undefined;
}

// Build a Map<play_id, ResolvedSource> for every play in a card. Used
// by CardHero to precompute once per render and thread to
// CatalogGroup. The richer shape (source + perkKind + perkName) lets
// the UI pass identifying info to flag actions without re-resolving.
export function buildPlaySourceMap(card: Card): Map<string, ResolvedSource> {
  const out = new Map<string, ResolvedSource>();
  for (const play of card.card_plays ?? []) {
    const r = findSourceForPlay(card, play);
    if (r) out.set(play.id, r);
  }
  return out;
}

// Display-friendly hostname extraction for the UI tooltip fallback.
// Drops www. prefix; preserves subdomains like cardbenefits.citi.com.
export function hostnameOf(url: string): string {
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}
