// Server-side loader for the network research JSON produced by the
// _PROMPT_NETWORK_RESEARCH.md workflow. The build pipeline ingests these
// files for the `disabled_network_benefits` field on cards, but Section 2
// of the per-card page needs the full payload at runtime.
//
// Files live in cards/_NETWORK_RESEARCH/. Filename pattern is
// {network_slug}_{verified_at}.json — e.g.
// world_elite_mastercard_2026-05-05.json. We pick the most recent file
// per network slug.

import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const RESEARCH_DIR = join(process.cwd(), "cards", "_NETWORK_RESEARCH");

type Source = {
  url: string;
  type: "network" | "underwriter" | "partner" | "issuer";
  label?: string;
  verified_at?: string;
};

export interface BenefitEntry {
  id: string;
  name: string;
  value_estimate_usd: number | null;
  category:
    | "passive"
    | "lifestyle"
    | "travel_perk"
    | "travel_protection"
    | "shopping_protection";
  activation: "passive" | "signal_gated";
  signal_id: string | null;
  subtype?: "always_on" | "activation_required" | "partner_offer";
  enrollment_url: string | null;
  expires_at: string | null;
  notes: string;
  source: Source;
}

export interface EarnChannelEntry {
  id: string;
  name: string;
  kind:
    | "international_cashback_portal"
    | "booking_site"
    | "merchant_offers"
    | "small_business";
  how_to_access: string;
  eligibility: string;
  enrollment_url: string;
  earn_structure: Array<{
    country?: string;
    category?: string;
    cashback_pct?: number;
  }>;
  sample_participating_merchants: string[];
  notes: string;
  source: Source;
}

export interface DestinationEntry {
  id: string;
  name: string;
  destination_signal: string;
  city: string | null;
  country: string;
  current_experiences: Array<{ title: string; category: string; url: string }>;
  notes: string;
  source: Source;
}

export interface CardOverlayEntry {
  card_id: string;
  verified_at: string;
  issuer_source_url: string;
  guide_to_benefits_url: string | null;
  enabled_network_benefits: string[];
  disabled_or_not_offered: Array<{
    id: string;
    reason: string;
    evidence_url: string;
  }>;
  issuer_overrides: Array<{
    id: string;
    what_changed: string;
    evidence_url: string;
  }>;
}

export interface NetworkResearch {
  research_run: {
    network: string;
    region: string;
    verified_at: string;
    researcher: string;
  };
  universal_benefits: BenefitEntry[];
  tier_specific_benefits: BenefitEntry[];
  earn_channels: EarnChannelEntry[];
  destination_benefits: DestinationEntry[];
  insurance_protection: BenefitEntry[];
  card_overlays: CardOverlayEntry[];
}

const NETWORK_SLUG: Record<string, string> = {
  "Mastercard World Elite": "world_elite_mastercard",
  "Visa Infinite": "visa_infinite",
  "Visa Signature": "visa_signature",
};

/**
 * Load the most recent research JSON for a given network. Throws if no
 * file exists for the network — callers should handle that case for
 * cards on networks we haven't researched yet.
 */
export function loadNetworkResearch(network: string): NetworkResearch | null {
  const slug = NETWORK_SLUG[network];
  if (!slug || !existsSync(RESEARCH_DIR)) return null;

  const files = readdirSync(RESEARCH_DIR)
    .filter((f) => f.startsWith(slug) && f.endsWith(".json"))
    .sort()
    .reverse(); // lexical sort is also chronological — ISO dates in filename

  if (files.length === 0) return null;

  const raw = readFileSync(join(RESEARCH_DIR, files[0]), "utf8");
  return JSON.parse(raw) as NetworkResearch;
}

/**
 * Extract a card's overlay from a NetworkResearch document. Returns null
 * if the card isn't covered by this research run.
 */
export function getCardOverlay(
  research: NetworkResearch,
  cardId: string,
): CardOverlayEntry | null {
  return (
    research.card_overlays.find((o) => o.card_id === cardId) ?? null
  );
}

/**
 * Filter a benefit list to entries enabled by the card overlay.
 * Preserves source order.
 */
export function filterEnabled<T extends { id: string }>(
  entries: T[],
  enabledIds: Set<string>,
): T[] {
  return entries.filter((e) => enabledIds.has(e.id));
}
