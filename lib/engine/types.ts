// Engine-facing types. Pure data, no I/O. Profile shapes that touch
// Postgres are re-exported from lib/profile/types.ts in TASK-05.

import type { SpendCategoryId } from "@/lib/data/types";

export interface WalletCardHeld {
  card_id: string;
  opened_at: string; // ISO date "YYYY-MM-DD"
  bonus_received: boolean;
}

// Self-reported credit band. Matches the Postgres credit_score_band enum
// in 0001_init_catalog.sql. `null` = user hasn't answered yet (treated
// the same as "unknown" for engine purposes; "unknown" is what the user
// picked when they explicitly chose "I'm not sure").
export type CreditScoreBand =
  | "building"
  | "fair"
  | "good"
  | "very_good"
  | "excellent"
  | "unknown";

export const CREDIT_BAND_RANK: Record<CreditScoreBand, number> = {
  building: 0,
  fair: 1,
  good: 2,
  very_good: 3,
  excellent: 4,
  unknown: -1,
};

export interface UserProfile {
  spend_profile: Partial<Record<SpendCategoryId, number>>;
  brands_used: string[];
  cards_held: WalletCardHeld[];
  trips_planned: { destination: string; month?: string }[];
  // null/undefined = the credit-onboarding step hasn't run yet for this
  // user. The engine treats both the same as "no signal" — `unknown` is
  // a separate state the user explicitly opts into via the radio.
  credit_score_band?: CreditScoreBand | null;
  preferences: {
    creditsMode?: "realistic" | "face";
    viewMode?: "ongoing" | "year1";
  };
}

export interface ScoringOptions {
  creditsMode: "realistic" | "face";
  subAmortizeMonths: number; // default 24
}

export interface ScoreLineItem {
  label: string;
  value: number;
  kind: "earning" | "credit" | "fee" | "perk" | "sub" | "brand_fit" | "other";
  note?: string;
}

// Result of classifying a card's earned currency in the context of a
// wallet. Cards in `cash` mode contribute to `cashOngoing`; cards in
// `loyalty` mode contribute to `pointsOngoing`. The mode is per-wallet:
// CFU classifies as cash on its own, loyalty when paired with a Sapphire
// or Ink Preferred (any card in the program's transfer_unlock_card_ids).
// See lib/engine/scoring.ts → classifyEarning.
export interface EarningMode {
  mode: "cash" | "loyalty";
  cpp: number; // dollar value per point. 1.0 in cash mode.
  programId: string | null;
  programName: string | null;
}

// Loyalty-currency earnings split out of the cash bucket. `pts` is raw
// points/yr; `valueUsd` is `pts × cpp / 100` rounded. The UI renders
// `pts` as the headline number with `valueUsd` as the caption.
export interface PointsBucket {
  pts: number;
  valueUsd: number;
  programId: string;
  programName: string;
  cpp: number;
}

// Year-1 sign-up bonus, broken out by currency type. Cash-mode SUBs put
// the dollar value in `valueUsd` and `pts: 0`. Loyalty-mode SUBs report
// both the points awarded (amortized) and their dollar equivalent.
export interface SubBucket {
  mode: "cash" | "loyalty";
  pts: number;
  valueUsd: number;
  programId: string | null;
  programName: string | null;
}

// Cobrand "soft" value from the brand-affinity layer — a flat bonus the
// engine adds when the user has signaled they actually shop / fly / stay
// at the card's brand. Distinct from `cashOngoing` because it's an
// estimate, not a calculation off reported spend, and the UI should
// present it differently (muted secondary line, not a green pillar).
// Counts toward `spendOngoing` and `deltaOngoing` so ranking still
// reflects the cobrand fit. Null when the card has no brand-fit entry
// or the user didn't pick the matching brand.
export interface BrandFitBucket {
  valueUsd: number;
  brand: string;
  // Short tail used in the muted caption — same wording as the why-line
  // opener but without the "You shop at {brand} —" prefix.
  whyPhrase: string;
}

// The hero number split. The recommendation UI surfaces these as
// pillars so users can tell what's earned automatically from what's
// upside they only realise if they claim it. Cash and points were
// previously lumped into one `spendOngoing` number; they're split now
// because a 6% cashback card and a 3x points card are not the same.
export interface CardScoreComponents {
  // Statement-credit dollars/yr the user earns from spending. Sums
  // cashback earning-rule deltas across spend categories ONLY — brand-fit
  // cobrand bonuses are split out into `brandFitOngoing` so the UI can
  // show the calculated portion separately from the soft estimate.
  // Always >= 0.
  cashOngoing: number;
  // Loyalty-currency earnings/yr from spend, valued at the program's
  // portal cpp. Null when the card earns no points (cash-mode programs,
  // or transferable programs whose wallet doesn't unlock transfers).
  // The bucket is per-program; a card earns into exactly one program.
  pointsOngoing: PointsBucket | null;
  // Cobrand soft value (Costco voucher, Amazon-Prime 5%, airline status
  // perks). Always >= 0 dollars when present. Counts toward
  // `spendOngoing` and `deltaOngoing` (so the ranker pins cobrand cards
  // for users who shop at the brand), but is rendered as a muted line
  // beneath the CASH/POINTS/PERKS pillars rather than rolled into the
  // green CASH pillar — the value is an estimate, not derived from the
  // user's reported spend. Null when the card has no brand-fit entry or
  // the user didn't pick the matching brand chip.
  brandFitOngoing: BrandFitBucket | null;
  // Sum of the spend-side buckets:
  //   cashOngoing + (pointsOngoing?.valueUsd ?? 0) + (brandFitOngoing?.valueUsd ?? 0)
  // Reconciles exactly to `deltaOngoing - perksOngoing - feeOngoing`.
  spendOngoing: number;
  // Perk "upside": value the user only realises if they claim it.
  // Sums annual credits (haircut by ease in realistic mode) and
  // ongoing perks (lounge access, insurance, status, etc.) that aren't
  // already covered by another card in the wallet. Always >= 0.
  perksOngoing: number;
  // Annual fee, signed negative when present, 0 otherwise.
  feeOngoing: number;
  // Year-1 sign-up bonus value, amortized per options.subAmortizeMonths.
  // Same back-compat shim philosophy: dollar-amortized for existing UI,
  // detail breakdown in subYear1Detail for the new UI.
  subYear1: number;
  subYear1Detail: SubBucket | null;
}

export interface NewPerkOut {
  name: string;
  value: number | "unlocks";
  note?: string;
}

export interface CardScore {
  deltaOngoing: number;
  deltaYear1: number;
  // Two-pillar split of the hero. Sum reconciles to deltaOngoing
  // (spend + perks + fee) and deltaYear1 (+ subYear1).
  components: CardScoreComponents;
  breakdown: ScoreLineItem[];
  spendImpact: Record<
    SpendCategoryId,
    {
      current: number;
      new: number;
      // Source card name for the current best earner. "—" if the user
      // holds nothing in this category.
      currentFrom: string;
      // Source card name for the new best earner. May still be the
      // current card if this candidate doesn't beat what's held.
      newFrom: string;
      // The user's annual spend in this category (dollars). Mirrored
      // from the profile so the drill-in math is fully self-contained.
      spend: number;
      // Marginal dollars per year this category contributes to the
      // candidate's score. Zero unless `new > current`.
      delta: number;
      // When the candidate wins this category and its earning rule has
      // a per-year cap, this is the cap and the candidate's base rate
      // (used for over-cap remainder math). null when there's no cap or
      // the candidate isn't the winner.
      newCap: number | null;
      newBase: number | null;
      // Currency type of the new best earner. "cash" when the winning
      // card lands in `cashOngoing`, "loyalty" when it lands in
      // `pointsOngoing`. Null only when no card contributes (newFrom: "—").
      newMode: "cash" | "loyalty" | null;
    }
  >;
  newPerks: NewPerkOut[];
  duplicatedPerks: string[];
}

export type EligibilityStatus = "green" | "yellow" | "red";

export interface EligibilityResult {
  status: EligibilityStatus;
  note: string;
}

export type RankFilter = "total" | "nofee" | "premium";

// Sort axis for the rec panel. `total` (default) ranks by overall
// deltaOngoing — the existing behavior. `category` ranks by the
// candidate's marginal value in a single spend category, sourced from
// the precomputed `spendImpact[category].delta`. Used by the rec panel
// when the user picks a category from the Sort-by listbox.
//
// `specialization` is a discovery lens layered on top of the engine —
// not a new scoring algorithm. The lens both filters the candidate set
// and projects the score onto the lens-specific headline number that
// the user reads on the matching pillar of the card row:
//   - cash:   filter to programs where kind === "cash" OR cards whose
//             category array includes a structural cashback tag —
//             flat_rate_cashback, tiered_cashback, rotating_5_cashback
//             (catches Double Cash / Custom Cash — they earn
//             transferable ThankYou points but are marketed and used
//             as cashback). The marketing tag `no_af_cashback` is
//             explicitly NOT used as a signal because it's applied to
//             many cobrand cards too;
//             sort by components.cashOngoing.
//   - points: filter to programs where kind === "loyalty" &&
//             type === "transferable" AND the card is not cashback-
//             tagged (cobrand airline/hotel cards excluded by design —
//             they have their own categories);
//             sort by components.pointsOngoing?.valueUsd ?? 0.
//   - perks:  no program filter;
//             sort by components.perksOngoing (gross claimable perks).
// The sort axes are gross headline numbers — sorting by deltaOngoing
// would let perks-heavy cards win the Points lens and SUB-heavy cards
// win the Cash lens, contradicting the user's mental model of each
// lens.
// The brand-pin pass in rankCards is skipped under specialization for
// the same reason as category sort: an explicit lens choice is a
// stronger signal than cobrand affinity.
export type RankSortBy =
  | { kind: "total" }
  | { kind: "category"; category: SpendCategoryId }
  | { kind: "specialization"; lens: "cash" | "points" | "perks" };

export interface RankOptions {
  filter: RankFilter;
  scoring: ScoringOptions;
  today?: Date;
  limit?: number; // default 5
  // When provided, the ranker uses these verdicts instead of computing
  // eligibility in-engine. The recommendations page populates this from
  // the catalog-driven rules evaluator when RULES_ENGINE=server. Keys
  // are card IDs; missing keys fall back to the in-engine path.
  eligibilityOverrides?: Record<string, EligibilityResult>;
  // Sort axis. Defaults to `{ kind: "total" }` when omitted, matching
  // legacy behavior. When `kind: "category"`, the comparator uses
  // `score.spendImpact[category].delta` and the brand-pin pass is
  // skipped — the user's category choice is a stronger signal than
  // their cobrand affinity.
  sortBy?: RankSortBy;
}

export interface RankedRecommendation {
  card: import("@/lib/data/loader").Card;
  score: CardScore;
  eligibility: EligibilityResult;
  why: string;
  rank: number;
}

export interface RankResult {
  visible: RankedRecommendation[];
  denied: RankedRecommendation[];
}
