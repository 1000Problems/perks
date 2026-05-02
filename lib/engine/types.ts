// Engine-facing types. Pure data, no I/O. Profile shapes that touch
// Postgres are re-exported from lib/profile/types.ts in TASK-05.

import type { SpendCategoryId } from "@/lib/data/types";

export interface WalletCardHeld {
  card_id: string;
  opened_at: string; // ISO date "YYYY-MM-DD"
  bonus_received: boolean;
}

export interface UserProfile {
  spend_profile: Partial<Record<SpendCategoryId, number>>;
  brands_used: string[];
  cards_held: WalletCardHeld[];
  trips_planned: { destination: string; month?: string }[];
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

export type RankFilter = "total" | "payself" | "nofee" | "premium";

export interface RankOptions {
  filter: RankFilter;
  scoring: ScoringOptions;
  today?: Date;
  limit?: number; // default 5
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
