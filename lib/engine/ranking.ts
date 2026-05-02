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
import { creditBandFloorForCard, evaluateEligibility } from "./eligibility";
import { scoreCard } from "./scoring";
import { getBrandFit } from "./brandAffinity";

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

// ── why generator ──────────────────────────────────────────────────────

interface WhyContext {
  card: Card;
  score: CardScore;
  eligibility: EligibilityResult;
  userProfile: UserProfile;
  db: CardDatabase;
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
  const { card, score, userProfile, db } = ctx;

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
): RankResult {
  const today = options.today ?? new Date();
  const heldIds = new Set(wallet.map((h) => h.card_id));
  const limit = options.limit ?? 5;

  type Row = RankedRecommendation;
  const visibleRaw: Row[] = [];
  const denied: Row[] = [];

  const userBand = userProfile.credit_score_band;
  for (const card of db.cards) {
    if (heldIds.has(card.id)) continue;
    if (card.closed_to_new_apps) continue;

    const score = scoreCard(card, userProfile, wallet, db, options.scoring);
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
    const why = generateWhy({ card, score, eligibility, userProfile, db });

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
    if (sortBy.kind === "specialization" && sortBy.lens === "perks") {
      // Net perks: gross perks-and-credits value minus annual fee.
      // feeOngoing is signed negative, so this is addition. Cards
      // where the fee exceeds capturable perks rank below no-fee
      // perk-light cards, which is what we want — Reserve/Platinum
      // only deserve the top under this lens when their perks justify
      // the fee for this user's claim profile.
      return r.score.components.perksOngoing + r.score.components.feeOngoing;
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
    const familyBest = new Map<string, Row>();
    const rest: Row[] = [];
    for (const r of filtered) {
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
    // Sort pinned cards among themselves by deltaOngoing desc so multi-
    // family pin order is deterministic (highest-value pin first).
    const pinned = Array.from(familyBest.values()).sort(
      (a, b) => b.score.deltaOngoing - a.score.deltaOngoing,
    );
    combined = [...pinned, ...rest];
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
