// Stub data for the scaffolding. Replaced by data/cards.json + data/programs.json
// once the research pass completes. Card names are generic placeholders, not
// real issuer products — the data shape mirrors the production schema.

import type {
  BestRate,
  RecommendCard,
  SpendCategoryId,
  WalletCard,
} from "./types";
import { SPEND_CATEGORIES } from "@/lib/categories";

// SPEND_CATEGORIES moved to lib/categories.ts. Re-exported for any
// stale callers in the stub data path.
export { SPEND_CATEGORIES };

export const WALLET_CARDS: WalletCard[] = [
  {
    id: "cb-core",
    name: "Cashback Core",
    issuer: "Northbank",
    art: "art-skyblue",
    fee: 0,
    rates: { groceries: 0.03, gas: 0.03, other: 0.015 },
    perks: ["No annual fee"],
    opened: "Mar 2022",
    bonusReceived: true,
  },
  {
    id: "voyager",
    name: "Voyager Travel",
    issuer: "Northbank",
    art: "art-navy",
    fee: 95,
    rates: { dining: 0.03, airfare: 0.02, hotels: 0.02, other: 0.01 },
    perks: ["Trip delay insurance", "No FX fees", "Primary rental car coverage"],
    opened: "Aug 2023",
    bonusReceived: true,
  },
  {
    id: "everyday",
    name: "Everyday Rewards",
    issuer: "Centra",
    art: "art-cream",
    fee: 0,
    rates: { groceries: 0.04, dining: 0.02, other: 0.01 },
    perks: ["No annual fee", "Cell phone protection"],
    opened: "Jan 2021",
    bonusReceived: true,
  },
];

export const RECOMMEND_CARDS: RecommendCard[] = [
  {
    id: "sapphire-tier",
    name: "Voyager Reserve",
    issuer: "Northbank",
    art: "art-navy",
    fee: 550,
    delta: 612,
    deltaY1: 1487,
    eligibility: "green",
    eligibilityNote: "Eligible · 2/24",
    why: "Doubles your dining rate and unlocks Hyatt transfers for your Phoenix trip.",
    rates: { dining: 0.05, airfare: 0.05, hotels: 0.05, other: 0.01 },
    newPerks: [
      { name: "$300 travel credit", value: 280, note: "You spend $1.5k+ on hotels — easy to use" },
      { name: "Priority Pass lounge", value: 90, note: "Realistic value for 3 trips/year" },
      { name: "Hyatt point transfers", value: "unlocks", note: "Andaz Scottsdale at 12k pts (~$400)" },
      { name: "Trip cancellation, primary CDW", value: 60 },
    ],
    duplicatedPerks: ["No FX fees (Voyager Travel has it)", "Trip delay insurance"],
    transferPartners: ["Hyatt", "United", "Southwest", "Air Canada", "Virgin Atlantic"],
    bonus: { points: 60000, valueUSD: 875 },
    rank: 1,
  },
  {
    id: "amber-cash",
    name: "Amber Cash",
    issuer: "Greenpoint",
    art: "art-rust",
    fee: 0,
    delta: 384,
    deltaY1: 584,
    eligibility: "green",
    eligibilityNote: "Eligible",
    why: "Pays for itself with the Walmart+ credit you already use, plus 5% on online shopping.",
    rates: { shopping: 0.05, other: 0.01 },
    newPerks: [
      { name: "Walmart+ membership", value: 98, note: "You already pay for this" },
      { name: "5% rotating online", value: 180 },
    ],
    duplicatedPerks: [],
    transferPartners: [],
    bonus: { points: 0, valueUSD: 200 },
    rank: 2,
  },
  {
    id: "metal-reserve",
    name: "Platinum Metal",
    issuer: "Sutter & Co",
    art: "art-platinum",
    fee: 695,
    delta: 248,
    deltaY1: 1148,
    eligibility: "yellow",
    eligibilityNote: "Once-per-lifetime risk — verify",
    why: "Heavy on perks. Worth it only if you fly enough to use the lounges.",
    rates: { airfare: 0.05, hotels: 0.05, other: 0.01 },
    newPerks: [
      { name: "Centurion lounge access", value: 220 },
      { name: "$200 hotel credit", value: 160, note: "Realistic — you book direct sometimes" },
      { name: "$240 streaming credit", value: 200 },
      { name: "Global Entry", value: 0, note: "Already have via Voyager Travel" },
    ],
    duplicatedPerks: ["Global Entry credit", "Trip delay coverage"],
    transferPartners: ["Delta", "Marriott", "Hilton", "Air Canada", "Virgin Atlantic"],
    bonus: { points: 80000, valueUSD: 1200 },
    rank: 3,
  },
  {
    id: "flex-cash",
    name: "Flex Cashback",
    issuer: "Northbank",
    art: "art-skyblue",
    fee: 0,
    delta: 192,
    deltaY1: 392,
    eligibility: "yellow",
    eligibilityNote: "At 4/24 — risky",
    why: "Adds 5% on rotating quarterly categories. Modest gain unless you track them.",
    rates: { other: 0.01 },
    newPerks: [{ name: "5% rotating quarterly", value: 200 }],
    duplicatedPerks: ["No annual fee"],
    transferPartners: [],
    bonus: { points: 0, valueUSD: 200 },
    rank: 4,
  },
  {
    id: "ink-business",
    name: "Ink Foundation",
    issuer: "Northbank",
    art: "art-ink",
    fee: 95,
    delta: 156,
    deltaY1: 906,
    eligibility: "red",
    eligibilityNote: "Business card — needs business income",
    why: "Only worth pursuing if you have side-business spend. Skip otherwise.",
    rates: { utilities: 0.05, shopping: 0.02, other: 0.01 },
    newPerks: [{ name: "Cell phone protection", value: 0, note: "Already have" }],
    duplicatedPerks: ["Cell phone protection", "Trip cancellation"],
    transferPartners: ["Hyatt", "United", "Southwest"],
    bonus: { points: 90000, valueUSD: 1350 },
    rank: 5,
  },
];

// Derived: best rate per category across the user's wallet.
export const WALLET_BEST_RATES: Record<SpendCategoryId, BestRate> = (() => {
  const out = {} as Record<SpendCategoryId, BestRate>;
  for (const c of SPEND_CATEGORIES) {
    let best = 0;
    let from = "—";
    for (const card of WALLET_CARDS) {
      const r = card.rates[c.id] ?? card.rates.other ?? 0.01;
      if (r > best) {
        best = r;
        from = card.name;
      }
    }
    out[c.id] = { rate: best, from };
  }
  return out;
})();
