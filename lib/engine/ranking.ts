// Ranking engine. Composes eligibility + scoring into an ordered list
// of candidate cards plus a one-line "why" sentence per card. Pure
// function — depends only on lib/engine/{eligibility,scoring} and the
// loaded card database.

import type { Card, CardDatabase } from "@/lib/data/loader";
import type { SpendCategoryId } from "@/lib/data/types";
import type {
  CardScore,
  EligibilityResult,
  RankOptions,
  RankResult,
  RankedRecommendation,
  UserProfile,
  WalletCardHeld,
} from "./types";
import { CREDIT_BAND_RANK } from "./types";
import type { SignalState } from "@/lib/profile/server";
import { creditBandFloorForCard, evaluateEligibility } from "./eligibility";
import { scoreCard } from "./scoring";
import { getBrandFit } from "./brandAffinity";
import type { ProgramCppOverride } from "./programOverrides";

// When the user's reported credit band is below a card's typical-approval
// floor, we don't hide the card — we keep it visible — but we down-rank
// it so a 670 user doesn't see Sapphire Reserve at #1. Used at sort time
// only; the score on the recommendation panel is unchanged.
const BELOW_FLOOR_RANK_MULT = 0.6;

function rankAdjustedDelta(
  card: Card,
  delta: number,
  userBand: UserProfile["credit_score_band"],
): number {
  if (!userBand || userBand === "unknown") return delta;
  const floor = creditBandFloorForCard(card);
  if (CREDIT_BAND_RANK[userBand] >= CREDIT_BAND_RANK[floor]) return delta;
  return delta * BELOW_FLOOR_RANK_MULT;
}

// ── feeder-pair candidates ─────────────────────────────────────────────

// Per CLAUDE.md / TASK-recommendations-consume-feeder-pair.md:
// the per-card detail page no longer renders the "highest-leverage
// next card" panel. Instead, every held card with `feeder_pair`
// surfaces its missing feeders as ranked candidates here. The held
// card's `value_when_missing` becomes the why-line; the priority drives
// pin order (first > high > normal).

const PRIORITY_RANK: Record<"first" | "high" | "normal", number> = {
  first: 2,
  high: 1,
  normal: 0,
};

interface FeederCandidate {
  cardId: string;
  priority: "first" | "high" | "normal";
  whyOverride: string;
  sourceCardId: string;
  pairRole: "currency_pooler" | "category_specialist" | "annual_credit_stacker";
}

function computeFeederCandidates(
  wallet: WalletCardHeld[],
  db: CardDatabase,
): Map<string, FeederCandidate> {
  const heldIds = new Set(wallet.map((h) => h.card_id));
  const out = new Map<string, FeederCandidate>();
  for (const held of wallet) {
    const card = db.cardById.get(held.card_id);
    if (!card?.feeder_pair) continue;
    const { feeder_card_ids, recommendation_priority, value_when_missing, pair_role } =
      card.feeder_pair;
    for (const feederId of feeder_card_ids) {
      if (feederId === card.id) continue; // defensive self-ref guard
      if (heldIds.has(feederId)) continue;
      const incoming: FeederCandidate = {
        cardId: feederId,
        priority: recommendation_priority,
        whyOverride: value_when_missing,
        sourceCardId: card.id,
        pairRole: pair_role,
      };
      const existing = out.get(feederId);
      if (
        !existing ||
        PRIORITY_RANK[incoming.priority] > PRIORITY_RANK[existing.priority]
      ) {
        out.set(feederId, incoming);
      }
    }
  }
  return out;
}

// ── why generator ──────────────────────────────────────────────────────

interface WhyContext {
  card: Card;
  score: CardScore;
  eligibility: EligibilityResult;
  userProfile: UserProfile;
  db: CardDatabase;
  /** When set, overrides every other rule and is returned directly. */
  /** Drives feeder-pair recommendations: the held card's */
  /** value_when_missing copy reads as a complete why-sentence. */
  feederWhy?: string;
}

const TRIP_KEY_NORMALIZERS = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

// Pick the destination_perks key best matching a free-text destination.
function matchDestinationKey(dest: string, db: CardDatabase): string | null {
  const norm = TRIP_KEY_NORMALIZERS(dest);
  const keys = Object.keys(db.destinationPerks);
  // Exact then substring match.
  if (keys.includes(norm)) return norm;
  for (const k of keys) {
    const kn = TRIP_KEY_NORMALIZERS(k);
    if (kn.includes(norm) || norm.includes(kn)) return k;
  }
  return null;
}

// Family-specific opener for the brand-fit why-line. Retail families fall
// through to the default "You shop at {brand}" — that reads naturally for
// Costco, Amazon, Target, etc. Airline and hotel families get verb-
// matched openers so "You shop at United" / "You shop at Hilton" don't
// surface in the UI.
const FAMILY_OPENER: Record<string, string> = {
  // Hotels
  hilton: "You stay at",
  marriott: "You stay at",
  hyatt: "You stay at",
  ihg: "You stay at",
  wyndham: "You stay at",
  // Airlines (no preposition reads more natural — "You fly United")
  united: "You fly",
  delta: "You fly",
  american: "You fly",
  southwest: "You fly",
  alaska: "You fly",
  jetblue: "You fly",
};

function brandFitOpener(family: string): string {
  return FAMILY_OPENER[family] ?? "You shop at";
}

const CAT_DISPLAY: Record<SpendCategoryId, string> = {
  groceries: "groceries",
  dining: "dining",
  gas: "gas",
  airfare: "airfare",
  hotels: "hotels",
  streaming: "streaming",
  shopping: "online shopping",
  drugstore: "drugstore",
  transit: "rideshare",
  utilities: "utilities",
  home: "home improvement",
  other: "everyday spend",
};

function findBiggestCategoryGain(score: CardScore): { cat: SpendCategoryId; jump: number } | null {
  let best: { cat: SpendCategoryId; jump: number } | null = null;
  for (const [cat, { current, new: nw }] of Object.entries(score.spendImpact) as [
    SpendCategoryId,
    { current: number; new: number },
  ][]) {
    const jump = nw - current;
    if (jump > 0.005 && (!best || jump > best.jump)) {
      best = { cat, jump };
    }
  }
  return best;
}

function findBiggestPerk(score: CardScore): { name: string; value: number } | null {
  let best: { name: string; value: number } | null = null;
  for (const p of score.newPerks) {
    if (typeof p.value === "number" && p.value > 100 && (!best || p.value > best.value)) {
      best = { name: p.name, value: p.value };
    }
  }
  return best;
}

// Trim long names down to a single recognizable word (Hyatt, Hilton, etc.).
function shorten(brand: string): string {
  return brand.split(/[\s,/]/)[0];
}

function brandMatch(perkName: string, userBrands: string[]): string | null {
  const lower = perkName.toLowerCase();
  for (const b of userBrands) {
    if (lower.includes(b.toLowerCase())) return shorten(b);
  }
  return null;
}

// Find the first partner name that appears (literally or by leading
// token) in any of the destination's phrases. Returns the partner name
// (so the why-sentence can use it), or null.
function findPartnerInPhrases(partners: string[], phrases: string[]): string | null {
  if (partners.length === 0 || phrases.length === 0) return null;
  for (const p of partners) {
    const pLower = p.toLowerCase();
    const firstTwo = pLower.split(/\s+/).slice(0, 2).join(" ");
    for (const phrase of phrases) {
      const phLower = phrase.toLowerCase();
      if (phLower.includes(pLower) || phLower.includes(firstTwo)) {
        return p;
      }
    }
  }
  return null;
}

function transferPartnersForCard(card: Card, db: CardDatabase): string[] {
  const programIds: string[] = [];
  if (card.currency_earned) programIds.push(card.currency_earned);
  if (card.transfer_partners_inherited_from) {
    programIds.push(card.transfer_partners_inherited_from);
  }
  const partners = new Set<string>();
  for (const pid of programIds) {
    const prog = db.programById.get(pid);
    if (!prog) continue;
    for (const tp of prog.transfer_partners) partners.add(tp.partner);
  }
  return Array.from(partners);
}

export function generateWhy(ctx: WhyContext): string {
  const { card, score, userProfile, db, feederWhy } = ctx;

  // -1. Feeder-pair recommendation: this card completes a pair the
  // user already started by holding the source card. The held card's
  // value_when_missing is authored as a complete sentence — return as-is.
  if (feederWhy) {
    return clip(feederWhy);
  }

  // 0. Cobrand match — strongest signal we have. The user told us they
  // shop / fly / stay here; the card is built around that brand. Lead
  // with it. Opener is family-specific so the verb fits the brand
  // (retail "shop at", hotels "stay at", airlines "fly").
  const fit = getBrandFit(card, userProfile.brands_used);
  if (fit) {
    return clip(`${brandFitOpener(fit.family)} ${fit.brand} — ${fit.whyPhrase}.`);
  }

  // 1. Trip + sweet-spot match.
  for (const trip of userProfile.trips_planned) {
    const key = matchDestinationKey(trip.destination, db);
    if (!key) continue;
    const dp = db.destinationPerks[key];
    if (!dp) continue;
    const partners = transferPartnersForCard(card, db);
    const partnerHit = findPartnerInPhrases(
      partners,
      [...(dp.hotel_chains_strong ?? []), ...(dp.airline_routes_strong ?? [])],
    );
    if (partnerHit) {
      return clip(
        `Unlocks ${shorten(partnerHit)} transfers for your ${trip.destination} trip.`,
      );
    }
  }

  // 2. Big perk on a brand the user listed.
  const perk = findBiggestPerk(score);
  if (perk && userProfile.brands_used.length > 0) {
    const brand = brandMatch(perk.name, userProfile.brands_used);
    if (brand) {
      return clip(
        `Pays for itself with the ${brand} credit you already use.`,
      );
    }
  }

  // 3. Big category jump (≥ 2 percentage points). Tag the currency
  // type so a "3% on dining" line doesn't conflate cashback and points.
  const cat = findBiggestCategoryGain(score);
  if (cat && cat.jump >= 0.02) {
    const pct = Math.round(cat.jump * 100);
    const mode = score.spendImpact[cat.cat]?.newMode;
    const tag =
      mode === "loyalty"
        ? ` (${score.components.pointsOngoing?.programName ?? "points"})`
        : mode === "cash"
        ? " (cash back)"
        : "";
    return clip(
      `Adds ${pct}% on ${CAT_DISPLAY[cat.cat]}${tag}, your biggest gap.`,
    );
  }

  // 4. Plain perk lead.
  if (perk) {
    return clip(`${perk.name} alone is worth $${Math.round(perk.value)}/yr.`);
  }

  // 5. Largest breakdown line item as a fallback.
  const biggest = score.breakdown
    .filter((b) => b.value > 0)
    .sort((a, b) => b.value - a.value)[0];
  if (biggest) {
    return clip(`${biggest.label}.`);
  }

  // 6. Last-resort generic.
  if ((card.annual_fee_usd ?? 0) === 0) {
    return clip(`No annual fee, simple to use.`);
  }
  return clip(`Worth a look on your spend pattern.`);
}

function clip(s: string): string {
  return s.length > 90 ? s.slice(0, 87) + "…" : s;
}

// ── ranker ─────────────────────────────────────────────────────────────

export function rankCards(
  userProfile: UserProfile,
  wallet: WalletCardHeld[],
  db: CardDatabase,
  options: RankOptions,
  // Phase 4: optional. When provided, scoreCard applies the
  // signal-interest bonus to candidate cards with card_plays whose
  // reveals_signals overlap the user's "interested" set. Empty default
  // keeps behavior identical to the pre-Phase-4 world.
  signals: Map<string, SignalState> = new Map(),
  // CLAUDE.md User-driven cpp: per-program cpp overrides flow through
  // every candidate's scoring. Empty default = program shipped values.
  programOverrides: Map<string, ProgramCppOverride> = new Map(),
): RankResult {
  const today = options.today ?? new Date();
  const heldIds = new Set(wallet.map((h) => h.card_id));
  const limit = options.limit ?? 5;

  type Row = RankedRecommendation;
  const visibleRaw: Row[] = [];
  const denied: Row[] = [];

  // Feeder-pair candidates: missing cards that complete a pair the
  // user already started. Populated from every held card's
  // feeder_pair.feeder_card_ids, deduped by highest priority. Used
  // both for the why-line override and for pin order below.
  const feederCandidates = computeFeederCandidates(wallet, db);

  const userBand = userProfile.credit_score_band;
  for (const card of db.cards) {
    if (heldIds.has(card.id)) continue;
    if (card.closed_to_new_apps) continue;

    const score = scoreCard(
      card,
      userProfile,
      wallet,
      db,
      options.scoring,
      signals,
      programOverrides,
    );
    // Prefer a server-supplied verdict (from the catalog-driven rules
    // evaluator). Fall back to the in-engine path for any card the
    // overrides map doesn't cover — keeps the engine usable on a
    // partially-migrated database or in client-only mode.
    const eligibility =
      options.eligibilityOverrides?.[card.id] ??
      evaluateEligibility(
        card,
        wallet,
        db,
        today,
        userBand,
        userProfile.brands_used,
      );
    const feederWhy = feederCandidates.get(card.id)?.whyOverride;
    const why = generateWhy({
      card,
      score,
      eligibility,
      userProfile,
      db,
      feederWhy,
    });

    const row: Row = { card, score, eligibility, why, rank: 0 };
    if (eligibility.status === "red") {
      denied.push(row);
    } else {
      visibleRaw.push(row);
    }
  }

  // Apply filter mode.
  let filtered = visibleRaw;
  switch (options.filter) {
    case "nofee":
      filtered = visibleRaw.filter((r) => (r.card.annual_fee_usd ?? 0) === 0);
      break;
    case "premium":
      filtered = visibleRaw.filter((r) => (r.card.annual_fee_usd ?? 0) >= 395);
      break;
    case "total":
    default:
      // no filter
      break;
  }

  // Sort axis. `total` ranks by overall deltaOngoing (legacy default).
  // `category` ranks by the candidate's marginal delta in a single
  // spend category. `specialization` filters by program kind/type and
  // projects the score onto a lens-specific summary number. The credit-
  // band haircut applies the same way in every mode.
  const sortBy = options.sortBy ?? { kind: "total" };

  // Specialization filter pass. Applied AFTER the orthogonal `filter`
  // axis (No annual fee / Premium tier) so the segmented control still
  // works inside a lens — e.g. "cash specialists with no annual fee".
  // Cards with `currency_earned: null` (no-rewards builders, secured
  // cards) are excluded from cash and points lenses; they aren't
  // specialists in either currency.
  //
  // Classification uses BOTH program kind and card category. The
  // category signal is what catches Citi Double Cash and Citi Custom
  // Cash — they earn into citi_thankyou (a transferable program) but
  // are designed and used as cashback cards. We only treat structural
  // cashback tags as a signal, not the marketing tag `no_af_cashback`
  // which is also applied to many cobrand cards (e.g. hilton_honors,
  // marriott_bonvoy_bold) to mean "no fee, gives some rewards."
  if (sortBy.kind === "specialization" && sortBy.lens !== "perks") {
    const lens = sortBy.lens;
    const isCashCategory = (card: Card): boolean =>
      card.category.some(
        (c) =>
          c === "flat_rate_cashback" ||
          c === "tiered_cashback" ||
          c === "rotating_5_cashback",
      );
    filtered = filtered.filter((r) => {
      const programId = r.card.currency_earned;
      if (!programId) return false;
      const prog = db.programById.get(programId);
      if (!prog) return false;
      if (lens === "cash") {
        // Cash lens: pure cashback programs OR cards explicitly tagged
        // as cashback in the category array (covers Double Cash etc.).
        return prog.kind === "cash" || isCashCategory(r.card);
      }
      // Points lens: transferable currency, AND not a cashback-tagged
      // card. Excludes cobrand airline/hotel (not transferable) and
      // excludes Double-Cash-style cards that happen to earn TY but
      // belong in the Cash lens.
      return (
        prog.kind === "loyalty" &&
        prog.type === "transferable" &&
        !isCashCategory(r.card)
      );
    });
  }

  const valueOf = (r: Row): number => {
    if (sortBy.kind === "category") {
      return r.score.spendImpact[sortBy.category]?.delta ?? 0;
    }
    if (sortBy.kind === "specialization") {
      // Sort each lens by its own headline number — the same value the
      // user reads on the matching pillar of the card row. Sorting by
      // overall deltaOngoing would let perks-heavy cards win the
      // Points lens when they earn no points on the user's spend
      // (e.g. Amex Platinum with $2,839 perks but pointsOngoing 0
      // when MR doesn't unlock for the wallet — that surfaces a card
      // the user wouldn't expect under "Points").
      const c = r.score.components;
      switch (sortBy.lens) {
        case "cash":
          return c.cashOngoing;
        case "points":
          return c.pointsOngoing?.valueUsd ?? 0;
        case "perks":
          return c.perksOngoing;
      }
    }
    return r.score.deltaOngoing;
  };

  // Sort by a credit-band-adjusted delta — a 670 user gets a Sapphire
  // Reserve down-ranked, but it's still visible. The displayed
  // score.deltaOngoing is unchanged. Tiebreak on card.id so equal-scoring
  // cards don't reshuffle between renders.
  filtered.sort((a, b) => {
    const da = rankAdjustedDelta(b.card, valueOf(b), userBand) -
      rankAdjustedDelta(a.card, valueOf(a), userBand);
    if (da !== 0) return da;
    return a.card.id < b.card.id ? -1 : a.card.id > b.card.id ? 1 : 0;
  });

  // Pin brand-matched cobrand cards to the top, family-best style. When
  // the user said they shop at Costco, the Costco card surfaces first
  // even if a $550-AF premium card scores higher on raw earnings-and-
  // perks math. The brand-fit dollar bonus is already baked into
  // deltaOngoing; this affects sort order only.
  //
  // Family-best rule: when multiple cards in the same family match
  // (e.g. picking "Hilton" matches all four Hilton cards in the
  // catalog), only the highest-scoring family member is pinned. The
  // other siblings fall through to the regular sorted list at their
  // normal rank — they remain visible, just not pinned. Retail families
  // contain a single card each, so this preserves today's retail
  // behavior exactly.
  //
  // Skipped under category sort and specialization sort — the user
  // has explicitly chosen a single ranking axis (a category, or a
  // cash/points/perks lens), which is a stronger signal than their
  // cobrand affinity.
  let combined: Row[];
  if (sortBy.kind === "category" || sortBy.kind === "specialization") {
    combined = filtered;
  } else {
    // Feeder-pin pass — split candidates into three buckets based on
    // their feeder_pair.recommendation_priority (if any). "first"
    // priority pins above brand-pinned cobrand cards; "high" priority
    // pins below brand pins but above the regular sorted list;
    // "normal" priority falls through (the why-line override still
    // applies, set above in the why-generator call).
    const feederFirst: Row[] = [];
    const feederHigh: Row[] = [];
    const nonFeeder: Row[] = [];
    for (const r of filtered) {
      const fc = feederCandidates.get(r.card.id);
      if (fc?.priority === "first") feederFirst.push(r);
      else if (fc?.priority === "high") feederHigh.push(r);
      else nonFeeder.push(r);
    }

    // Brand-pin pass over the non-feeder bucket only. Feeder candidates
    // that ALSO match a brand pin still pin via feeder priority — the
    // feeder signal is more specific (it depends on what the user
    // already holds).
    const familyBest = new Map<string, Row>();
    const rest: Row[] = [];
    for (const r of nonFeeder) {
      const fit = getBrandFit(r.card, userProfile.brands_used);
      if (!fit) {
        rest.push(r);
        continue;
      }
      const current = familyBest.get(fit.family);
      if (!current) {
        familyBest.set(fit.family, r);
      } else if (r.score.deltaOngoing > current.score.deltaOngoing) {
        // New best for this family — old best demoted to rest, where it
        // re-enters at its natural rank position.
        rest.push(current);
        familyBest.set(fit.family, r);
      } else {
        rest.push(r);
      }
    }
    // Sort pinned brand cards among themselves by deltaOngoing desc so
    // multi-family pin order is deterministic (highest-value pin first).
    const pinned = Array.from(familyBest.values()).sort(
      (a, b) => b.score.deltaOngoing - a.score.deltaOngoing,
    );
    // Feeder buckets are already in the filtered order (deltaOngoing
    // desc within each priority tier).
    combined = [...feederFirst, ...pinned, ...feederHigh, ...rest];
  }
  const visible = combined.slice(0, limit).map((r, i) => ({ ...r, rank: i + 1 }));

  // Rank denied as well — useful when surfacing them.
  denied.sort((a, b) => {
    const da = rankAdjustedDelta(b.card, b.score.deltaOngoing, userBand) -
      rankAdjustedDelta(a.card, a.score.deltaOngoing, userBand);
    if (da !== 0) return da;
    return a.card.id < b.card.id ? -1 : a.card.id > b.card.id ? 1 : 0;
  });
  denied.forEach((d, i) => (d.rank = i + 1));

  return { visible, denied };
}
