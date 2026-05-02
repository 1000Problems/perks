// Type definitions for the recommendation engine's data layer.
// The full JSON schemas (Zod) for the production card database live in
// lib/data/schema.ts once the research pass produces data/cards.json.

export type SpendCategoryId =
  | "groceries"
  | "dining"
  | "gas"
  | "airfare"
  | "hotels"
  | "streaming"
  | "shopping"
  | "drugstore"
  | "transit"
  | "utilities"
  | "home"
  | "other";

export interface SpendCategory {
  id: SpendCategoryId;
  label: string;
  default: number;
  icon: string;
}

export type CardArtVariant =
  | "art-navy"
  | "art-graphite"
  | "art-platinum"
  | "art-emerald"
  | "art-rust"
  | "art-cream"
  | "art-ink"
  | "art-skyblue";

export type EligibilityStatus = "green" | "yellow" | "red";

export interface WalletCard {
  id: string;
  name: string;
  issuer: string;
  art: CardArtVariant;
  fee: number;
  rates: Partial<Record<SpendCategoryId, number>>;
  perks: string[];
  opened: string;
  bonusReceived: boolean;
}

export interface NewPerk {
  name: string;
  value: number | "unlocks";
  note?: string;
}

export interface RecommendCard {
  id: string;
  name: string;
  issuer: string;
  art: CardArtVariant;
  fee: number;
  delta: number;
  deltaY1: number;
  eligibility: EligibilityStatus;
  eligibilityNote: string;
  why: string;
  rates: Partial<Record<SpendCategoryId, number>>;
  newPerks: NewPerk[];
  duplicatedPerks: string[];
  transferPartners: string[];
  bonus: { points: number; valueUSD: number };
  rank: number;
}

export interface BestRate {
  rate: number;
  from: string;
}
