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
//
// `flaggable: true` — source came from a real annual_credit /
//   ongoing_perk entry. The UI shows the flag button; reports route
//   to the perks_source_flags table keyed by (card_id, perk_name).
//
// `flaggable: false` — source came from a play.source_urls fallback
//   (earning multipliers, niche plays). No perk row exists to flag
//   against, so the UI hides the flag button. Users can still click
//   through to the URL; reports for these need to come through a
//   different surface (out of scope today).
export interface ResolvedSource {
  source: PerkSource;
  perkKind: "annual_credit" | "ongoing_perk";
  perkName: string;
  flaggable: boolean;
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
      return {
        source: hit.source,
        perkKind: hit.kind,
        perkName: hit.name,
        flaggable: true,
      };
    }
  }

  // 2. Signal ID match.
  const requiresSignal = getRequiresSignal(play);
  if (requiresSignal) {
    const hit = entries.find(
      (e) => e.signal_id === requiresSignal && e.source != null,
    );
    if (hit?.source) {
      return {
        source: hit.source,
        perkKind: hit.kind,
        perkName: hit.name,
        flaggable: true,
      };
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
      flaggable: true,
    };
  }

  // 4. Fallback to play.source_urls[0]. Earning multipliers and
  // niche plays don't map to a credit/perk, but they often carry
  // their own citation list. Synthesize a non-flaggable
  // ResolvedSource so the UI still renders a visible source link.
  const firstPlayUrl = play.source_urls?.[0];
  if (firstPlayUrl) {
    return {
      source: {
        url: firstPlayUrl,
        type: classifySourceUrl(firstPlayUrl),
        // No label / verified_at — these are play-level URLs, not
        // human-stamped perk citations. UI falls back to hostname.
      },
      perkKind: "ongoing_perk", // synthetic; never read because flaggable=false
      perkName: play.id,         // synthetic; never read because flaggable=false
      flaggable: false,
    };
  }

  return undefined;
}

// Heuristic URL → source type classification. Used only for the
// play.source_urls fallback above (when a play has a citation but no
// matching perk in the markdown, so we don't have an authored type).
//
// Order matters — most specific first. The list is intentionally
// small; community sites that don't appear here fall through to the
// "community" default.
function classifySourceUrl(url: string): PerkSource["type"] {
  let host = "";
  try {
    host = new URL(url).hostname.toLowerCase();
  } catch {
    return "community";
  }
  // Strip leading www. for cleaner matching.
  host = host.replace(/^www\./, "");

  // Issuer (Citi-owned domains)
  if (host === "citi.com" || host.endsWith(".citi.com")) return "issuer";
  if (host === "thankyou.com" || host.endsWith(".thankyou.com")) return "issuer";
  if (host === "citientertainment.com") return "issuer";

  // Network (Mastercard / Visa / Amex network domains)
  if (host === "mastercard.com" || host.endsWith(".mastercard.com")) return "network";
  if (host === "mastercard.us" || host.endsWith(".mastercard.us")) return "network";
  if (host === "mastercardus.idprotectiononline.com") return "network";
  if (host === "visa.com" || host.endsWith(".visa.com")) return "network";

  // Underwriter (insurance benefit administrators)
  if (host === "cardbenefitservices.com" || host.endsWith(".cardbenefitservices.com")) return "underwriter";
  if (host === "cardbenefits.citi.com") return "underwriter";

  // Partner (the merchant administering the offer)
  if (host === "lyft.com" || host.endsWith(".lyft.com")) return "partner";
  if (host === "instacart.com" || host.endsWith(".instacart.com")) return "partner";
  if (host === "doordash.com" || host.endsWith(".doordash.com")) return "partner";
  if (host === "peacocktv.com" || host.endsWith(".peacocktv.com")) return "partner";

  // Default — TPG, Frequent Miler, Thrifty Traveler, Award Wallet,
  // Travel Freely, OMAAT, etc.
  return "community";
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
