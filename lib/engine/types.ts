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
  kind: "earning" | "credit" | "fee" | "perk" | "sub" | "other";
  note?: string;
}

export interface NewPerkOut {
  name: string;
  value: number | "unlocks";
  note?: string;
}

export interface CardScore {
  deltaOngoing: number;
  deltaYear1: number;
  breakdown: ScoreLineItem[];
  spendImpact: Record<SpendCategoryId, { current: number; new: number }>;
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
