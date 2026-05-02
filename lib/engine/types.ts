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

// The hero number split. The recommendation UI surfaces these as two
// pillars instead of one combined +$X so users can tell what's earned
// from spending (high confidence — happens automatically) from what's
// upside if they actually claim a perk or credit.
export interface CardScoreComponents {
  // Spend "floor": value the user earns by spending normally with this
  // card in their wallet. Sums earning-rule deltas across spend
  // categories plus brand-fit cobrand bonuses (Costco, Amazon, etc.).
  // Always >= 0.
  spendOngoing: number;
  // Perk "upside": value the user only realises if they claim it.
  // Sums annual credits (haircut by ease in realistic mode) and
  // ongoing perks (lounge access, insurance, status, etc.) that aren't
  // already covered by another card in the wallet. Always >= 0.
  perksOngoing: number;
  // Annual fee, signed negative when present, 0 otherwise.
  feeOngoing: number;
  // Year-1 sign-up bonus, amortized per options.subAmortizeMonths.
  // Surfaced separately so the year-1 view can render it as its own
  // small pill rather than mixed into spend or perks.
  subYear1: number;
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
