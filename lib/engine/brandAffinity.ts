// Brand-affinity layer. Bridges the user's free-form brand selections
// (from /onboarding/brands) onto two engine concerns:
//
//   1. Brand-fit scoring — cobrand cards (Costco, Amazon Prime Visa, Target
//      RedCard, Sam's Club, etc.) earn rewards on cobrand-specific spend
//      that doesn't always map cleanly onto the user's spend taxonomy.
//      When the user has signaled they actually shop at the brand, we add
//      a conservative dollar bonus representing captured cobrand value
//      the existing earning math underestimates (POS-only discounts,
//      annual cash-back vouchers, the Visa-only-at-Costco network gate).
//
//   2. Membership eligibility — cards with `membership_required` get a
//      yellow flag unless the user's brand picks imply they hold the
//      membership. "Costco" picked → Costco membership satisfied; no
//      brand picked → yellow with a "needs membership" note.
//
// Brand strings here must match the chip labels in
// components/onboarding/BrandsForm.tsx exactly.
//
// Conservative dollar amounts come from each card's
// `breakeven_logic_notes` and represent realistic captured value for an
// active member of that brand. We undershoot rather than overstate.

import type { Card } from "@/lib/data/loader";
import type { ScoreLineItem } from "./types";

interface BrandFit {
  brand: string;
  // Family slug used by the family-best pin rule in ranking.ts. Retail
  // cards each get their own family (one card per retailer); travel
  // cobrand cards share a family with their siblings (e.g. all Hilton
  // cards share family "hilton") so the ranker pins the highest-scoring
  // member, not all of them.
  family: string;
  bonus: number;
  note: string; // long-form, used in the breakdown line item
  whyPhrase: string; // short tail that follows "You shop at {brand} —"
}

// card_id → brand chip(s) that signal a fit. Multiple brands may map to
// the same card (e.g., a co-issued card across two retailers); a single
// brand may map to multiple cards (e.g., Apple maps to Apple Card only,
// but Costco only maps to costco_anywhere_visa). The first matching
// brand wins.
//
// Bonus values represent soft-status / cobrand value the spend taxonomy
// underestimates — POS-only discounts, cash-back vouchers, status perks,
// priority boarding, bag-fee waivers. Big credits and free-night certs
// stay in the card's annual_credits / ongoing_perks (not double-counted
// here). Travel bonuses are tiered by annual_fee_usd:
//   fee == 0     → 30   (entry-tier soft-status only)
//   0 < fee ≤ 150 → 60   (mid-tier benefits)
//   fee > 150    → 100  (premium benefits)
const CARD_BRAND_FIT: Record<string, BrandFit[]> = {
  // ── Retail (each card is its own family) ──────────────────────────
  costco_anywhere_visa: [
    {
      brand: "Costco",
      family: "costco_anywhere_visa",
      bonus: 80,
      note: "Costco only accepts Visa, and this card pays 2% on warehouse purchases plus the Feb cash-back voucher",
      whyPhrase: "the only Visa Costco accepts, 2% on warehouse runs",
    },
  ],
  amazon_prime_visa: [
    {
      brand: "Amazon",
      family: "amazon_prime_visa",
      bonus: 90,
      note: "5% on Amazon and Whole Foods for active Prime members — adds up fast on a typical $3k/yr Amazon spend",
      whyPhrase: "5% back on every Amazon and Whole Foods order",
    },
  ],
  target_redcard: [
    {
      brand: "Target",
      family: "target_redcard",
      bonus: 75,
      note: "5% off at the register on every Target run — paid as a point-of-sale discount, no caps",
      whyPhrase: "5% off at checkout, every visit",
    },
  ],
  sams_club_mastercard: [
    {
      brand: "Sam's Club",
      family: "sams_club_mastercard",
      bonus: 60,
      note: "2% on Sam's purchases (Plus members) plus 5% on gas — pairs naturally with a Sam's membership",
      whyPhrase: "2% on warehouse runs, 5% on gas",
    },
  ],
  capital_one_walmart: [
    {
      brand: "Walmart",
      family: "capital_one_walmart",
      bonus: 50,
      note: "5% on Walmart.com / pickup / app and 2% in-store via Walmart Pay",
      whyPhrase: "5% on Walmart.com and pickup, no fee",
    },
  ],
  apple_card: [
    {
      brand: "Apple",
      family: "apple_card",
      bonus: 40,
      note: "3% on Apple purchases (and select merchants) — pays back on every iPhone, MacBook, and App Store charge",
      whyPhrase: "3% back on every Apple purchase",
    },
  ],
  rei_co_op_mastercard: [
    {
      brand: "REI",
      family: "rei_co_op_mastercard",
      bonus: 30,
      note: "5% on REI purchases plus the annual member dividend stacks on top",
      whyPhrase: "5% on REI plus the annual dividend",
    },
  ],

  // ── Hilton family ─────────────────────────────────────────────────
  hilton_honors: [
    {
      brand: "Hilton",
      family: "hilton",
      bonus: 30,
      note: "Entry Hilton card — 7× Honors points on stays plus complimentary Silver status, no fee",
      whyPhrase: "7× HH points and free Silver status",
    },
  ],
  hilton_honors_surpass: [
    {
      brand: "Hilton",
      family: "hilton",
      bonus: 60,
      note: "12× points on Hilton, automatic Gold status, and a free-night cert after $15k annual spend",
      whyPhrase: "12× HH, Gold status, $15k free-night cert",
    },
  ],
  hilton_honors_aspire: [
    {
      brand: "Hilton",
      family: "hilton",
      bonus: 100,
      note: "Diamond status, $400 resort credit, free-night cert — pays back fast for a regular Hilton stayer",
      whyPhrase: "Diamond status, $400 resort credit, free-night cert",
    },
  ],
  hilton_honors_business: [
    {
      brand: "Hilton",
      family: "hilton",
      bonus: 100,
      note: "Business Hilton card — 12× points, Gold status, two free-night certs at higher spend tiers",
      whyPhrase: "12× HH, Gold status, two free-night certs",
    },
  ],

  // ── United family ─────────────────────────────────────────────────
  united_gateway: [
    {
      brand: "United",
      family: "united",
      bonus: 30,
      note: "Entry-level United card — 2× MileagePlus on United purchases, no annual fee",
      whyPhrase: "2× on United, no fee, no foreign transaction fees",
    },
  ],
  united_explorer: [
    {
      brand: "United",
      family: "united",
      bonus: 60,
      note: "Free first checked bag for you and a companion, two annual United Club passes, priority boarding",
      whyPhrase: "free first bag on United, 25% off in-flight",
    },
  ],
  united_quest: [
    {
      brand: "United",
      family: "united",
      bonus: 100,
      note: "Free first bag for you and a companion, $125 United travel credit, 3× MileagePlus on United",
      whyPhrase: "free first bag for two, $125 United credit",
    },
  ],
  united_club_infinite: [
    {
      brand: "United",
      family: "united",
      bonus: 100,
      note: "United Club lounge access, free first two checked bags, premier-qualifying-points boost",
      whyPhrase: "United Club lounge, free first two bags",
    },
  ],

  // ── Delta family ──────────────────────────────────────────────────
  delta_skymiles_blue: [
    {
      brand: "Delta",
      family: "delta",
      bonus: 30,
      note: "Entry Delta card — 2× SkyMiles on Delta and dining, no annual fee",
      whyPhrase: "2× on Delta and dining, no fee",
    },
  ],
  delta_skymiles_gold: [
    {
      brand: "Delta",
      family: "delta",
      bonus: 60,
      note: "Free first checked bag, $200 Delta flight credit, 2× on Delta and dining",
      whyPhrase: "free first bag on Delta, $200 flight credit",
    },
  ],
  delta_skymiles_platinum: [
    {
      brand: "Delta",
      family: "delta",
      bonus: 100,
      note: "Annual domestic companion certificate, free first bag, MQM status-qualifying boost",
      whyPhrase: "domestic companion cert, MQM boost",
    },
  ],
  delta_skymiles_reserve: [
    {
      brand: "Delta",
      family: "delta",
      bonus: 100,
      note: "Delta Sky Club lounge access, annual companion certificate, premium status path",
      whyPhrase: "Sky Club lounge, companion cert",
    },
  ],

  // ── American family ───────────────────────────────────────────────
  citi_aa_mileup: [
    {
      brand: "American",
      family: "american",
      bonus: 30,
      note: "Entry AA card — 2× AAdvantage miles on American purchases, no annual fee",
      whyPhrase: "2× on American, no fee",
    },
  ],
  citi_aa_platinum: [
    {
      brand: "American",
      family: "american",
      bonus: 60,
      note: "Free first checked bag on AA, preferred boarding, 25% off in-flight purchases",
      whyPhrase: "free first bag on American, preferred boarding",
    },
  ],
  citi_aa_executive: [
    {
      brand: "American",
      family: "american",
      bonus: 100,
      note: "Admirals Club lounge access, $120 Global Entry credit, AAdvantage status path",
      whyPhrase: "Admirals Club lounge, status credit",
    },
  ],
  barclays_aa_aviator_red: [
    {
      brand: "American",
      family: "american",
      bonus: 60,
      note: "Free first checked bag on AA, preferred boarding, AAdvantage earning on every purchase",
      whyPhrase: "free first bag on American, preferred boarding",
    },
  ],

  // ── Southwest family ──────────────────────────────────────────────
  southwest_plus: [
    {
      brand: "Southwest",
      family: "southwest",
      bonus: 60,
      note: "Rapid Rewards earning on every purchase, points count toward the Companion Pass",
      whyPhrase: "2× on Southwest, points toward Companion Pass",
    },
  ],
  southwest_premier: [
    {
      brand: "Southwest",
      family: "southwest",
      bonus: 60,
      note: "6,000-point anniversary bonus, Companion Pass qualifying spend, no foreign transaction fees",
      whyPhrase: "anniversary points, Companion Pass earning",
    },
  ],
  southwest_priority: [
    {
      brand: "Southwest",
      family: "southwest",
      bonus: 60,
      note: "$75 annual Southwest credit, four upgraded boardings per year, 7,500-point anniversary bonus",
      whyPhrase: "$75 Southwest credit, 4 upgraded boardings",
    },
  ],

  // ── Alaska family ─────────────────────────────────────────────────
  alaska_airlines_visa: [
    {
      brand: "Alaska",
      family: "alaska",
      bonus: 60,
      note: "$122 companion fare each year, free first checked bag, 3× miles on Alaska purchases",
      whyPhrase: "$122 companion fare, free first bag",
    },
  ],

  // ── JetBlue family ────────────────────────────────────────────────
  jetblue_card: [
    {
      brand: "JetBlue",
      family: "jetblue",
      bonus: 30,
      note: "Entry JetBlue card — 3× TrueBlue points on JetBlue, 2× on dining and groceries, no fee",
      whyPhrase: "3× on JetBlue, 2× on dining and groceries",
    },
  ],
  jetblue_plus: [
    {
      brand: "JetBlue",
      family: "jetblue",
      bonus: 60,
      note: "Free first checked bag on JetBlue, 5,000-point anniversary bonus, 50% in-flight discount",
      whyPhrase: "free first bag, 5,000-point anniversary",
    },
  ],
  jetblue_premier: [
    {
      brand: "JetBlue",
      family: "jetblue",
      bonus: 100,
      note: "Mosaic-1 status qualifying, free first checked bag for you and three companions",
      whyPhrase: "Mosaic status path, free first bag for four",
    },
  ],

  // ── Marriott family ───────────────────────────────────────────────
  marriott_bonvoy_bold: [
    {
      brand: "Marriott",
      family: "marriott",
      bonus: 30,
      note: "Entry Marriott card — 3× points on Marriott stays, no annual fee",
      whyPhrase: "3× on Marriott, no fee",
    },
  ],
  marriott_bonvoy_boundless: [
    {
      brand: "Marriott",
      family: "marriott",
      bonus: 60,
      note: "35k-point free-night cert annually, automatic Silver status, 6× on Marriott",
      whyPhrase: "35k free-night cert, Silver status",
    },
  ],
  marriott_bonvoy_bevy: [
    {
      brand: "Marriott",
      family: "marriott",
      bonus: 100,
      note: "50k-point free-night cert annually, 4× on dining and groceries, Gold status",
      whyPhrase: "50k free-night cert, 4× on dining and groceries",
    },
  ],
  marriott_bonvoy_bountiful: [
    {
      brand: "Marriott",
      family: "marriott",
      bonus: 100,
      note: "50k-point free-night cert, 15 elite-night credits toward Marriott status",
      whyPhrase: "50k free-night cert, status qualifying nights",
    },
  ],
  marriott_bonvoy_brilliant: [
    {
      brand: "Marriott",
      family: "marriott",
      bonus: 100,
      note: "Platinum Elite status, $300 dining credit, 85k-point free-night cert",
      whyPhrase: "Platinum status, $300 dining credit, 85k free night",
    },
  ],
  marriott_bonvoy_business: [
    {
      brand: "Marriott",
      family: "marriott",
      bonus: 60,
      note: "Business Marriott card — 35k-point free-night cert, 4× on Marriott, Silver status",
      whyPhrase: "35k free-night cert, 4× on Marriott",
    },
  ],

  // ── Hyatt family ──────────────────────────────────────────────────
  world_of_hyatt: [
    {
      brand: "Hyatt",
      family: "hyatt",
      bonus: 60,
      note: "Annual category 1-4 free-night cert, 4× on Hyatt stays, Discoverist status",
      whyPhrase: "free-night cert, 4× on Hyatt, Discoverist status",
    },
  ],
  world_of_hyatt_business: [
    {
      brand: "Hyatt",
      family: "hyatt",
      bonus: 100,
      note: "Business Hyatt card — annual free-night cert, 4× on Hyatt, employee earning visibility",
      whyPhrase: "free-night cert, business expense earning",
    },
  ],

  // ── IHG family ────────────────────────────────────────────────────
  ihg_traveler: [
    {
      brand: "IHG",
      family: "ihg",
      bonus: 30,
      note: "Entry IHG card — 5× points on IHG stays, no annual fee",
      whyPhrase: "5× on IHG, no fee",
    },
  ],
  ihg_premier: [
    {
      brand: "IHG",
      family: "ihg",
      bonus: 60,
      note: "Annual 40k-point free-night cert, Platinum Elite status, 4th-night-free benefit",
      whyPhrase: "annual free-night cert, Platinum status",
    },
  ],

  // ── Wyndham family ────────────────────────────────────────────────
  wyndham_earner: [
    {
      brand: "Wyndham",
      family: "wyndham",
      bonus: 30,
      note: "Entry Wyndham card — 3× points on Wyndham stays, no annual fee",
      whyPhrase: "3× on Wyndham, no fee",
    },
  ],
  wyndham_earner_plus: [
    {
      brand: "Wyndham",
      family: "wyndham",
      bonus: 60,
      note: "7,500 anniversary points, 6× on Wyndham stays, Platinum-tier status",
      whyPhrase: "7,500 anniversary points, 6× on Wyndham",
    },
  ],
};

// Membership-required free-text → list of brand chips that imply the
// user holds it. When the card requires a membership none of the user's
// brands satisfy, eligibility.ts surfaces a yellow flag.
const MEMBERSHIP_TO_BRANDS: { test: RegExp; brands: string[] }[] = [
  { test: /costco/i, brands: ["Costco"] },
  { test: /amazon\s*prime/i, brands: ["Amazon"] },
  { test: /sam'?s\s*club/i, brands: ["Sam's Club"] },
  { test: /bj'?s/i, brands: [] }, // no chip yet
  { test: /rei/i, brands: ["REI"] },
];

export interface BrandFitResult {
  bonus: number;
  brand: string;
  // Family slug — used by the family-best pin rule in ranking.ts to
  // group cobrand siblings (e.g. all Hilton cards share family "hilton")
  // so the ranker pins one representative per brand instead of all of
  // them.
  family: string;
  note: string;
  whyPhrase: string;
  lineItem: ScoreLineItem;
}

// Compute the brand-fit bonus for a card given the user's selected
// brands. Returns null when the card has no brand-fit entry or no
// matching brand was picked.
export function getBrandFit(
  card: Card,
  brandsUsed: string[],
): BrandFitResult | null {
  const entries = CARD_BRAND_FIT[card.id];
  if (!entries || entries.length === 0) return null;
  const userSet = new Set(brandsUsed.map((b) => b.toLowerCase()));
  for (const entry of entries) {
    if (userSet.has(entry.brand.toLowerCase())) {
      return {
        bonus: entry.bonus,
        brand: entry.brand,
        family: entry.family,
        note: entry.note,
        whyPhrase: entry.whyPhrase,
        lineItem: {
          label: `Brand fit: regular ${entry.brand} customer`,
          value: entry.bonus,
          // brand_fit is spend-conditional (only realises when the user
          // actually shops at the brand). Distinct from "perk" so the
          // hero pillars can bucket it under spend rather than perks.
          kind: "brand_fit",
          note: entry.note,
        },
      };
    }
  }
  return null;
}

export type MembershipStatus = "satisfied" | "missing" | "not_required";

// Determine whether the user satisfies a card's membership_required
// gate. Cards without a membership_required field return "not_required".
// When the membership is one we know how to map to a brand chip and the
// user picked that chip → "satisfied". Otherwise → "missing".
export function getMembershipStatus(
  card: Card,
  brandsUsed: string[],
): MembershipStatus {
  const req = (card as { membership_required?: string | null }).membership_required;
  if (!req) return "not_required";
  const userSet = new Set(brandsUsed.map((b) => b.toLowerCase()));
  for (const m of MEMBERSHIP_TO_BRANDS) {
    if (!m.test.test(req)) continue;
    for (const brand of m.brands) {
      if (userSet.has(brand.toLowerCase())) return "satisfied";
    }
    // Membership pattern matched but no brand chip exists or none picked.
    return "missing";
  }
  // Unknown membership family (USAA, NFCU, PenFed, AAA, etc.) — we can't
  // verify either way; flag missing so the user sees the requirement.
  return "missing";
}

// Public read-only view of the membership requirement string. Convenience
// for eligibility.ts so it doesn't have to cast.
export function membershipRequired(card: Card): string | null {
  const req = (card as { membership_required?: string | null }).membership_required;
  return req ?? null;
}
