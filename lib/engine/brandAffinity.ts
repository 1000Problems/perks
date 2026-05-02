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
  bonus: number;
  note: string; // long-form, used in the breakdown line item
  whyPhrase: string; // short tail that follows "You shop at {brand} —"
}

// card_id → brand chip(s) that signal a fit. Multiple brands may map to
// the same card (e.g., a co-issued card across two retailers); a single
// brand may map to multiple cards (e.g., Apple maps to Apple Card only,
// but Costco only maps to costco_anywhere_visa). The first matching
// brand wins.
const CARD_BRAND_FIT: Record<string, BrandFit[]> = {
  costco_anywhere_visa: [
    {
      brand: "Costco",
      bonus: 80,
      note: "Costco only accepts Visa, and this card pays 2% on warehouse purchases plus the Feb cash-back voucher",
      whyPhrase: "the only Visa Costco accepts, 2% on warehouse runs",
    },
  ],
  amazon_prime_visa: [
    {
      brand: "Amazon",
      bonus: 90,
      note: "5% on Amazon and Whole Foods for active Prime members — adds up fast on a typical $3k/yr Amazon spend",
      whyPhrase: "5% back on every Amazon and Whole Foods order",
    },
  ],
  target_redcard: [
    {
      brand: "Target",
      bonus: 75,
      note: "5% off at the register on every Target run — paid as a point-of-sale discount, no caps",
      whyPhrase: "5% off at checkout, every visit",
    },
  ],
  sams_club_mastercard: [
    {
      brand: "Sam's Club",
      bonus: 60,
      note: "2% on Sam's purchases (Plus members) plus 5% on gas — pairs naturally with a Sam's membership",
      whyPhrase: "2% on warehouse runs, 5% on gas",
    },
  ],
  capital_one_walmart: [
    {
      brand: "Walmart",
      bonus: 50,
      note: "5% on Walmart.com / pickup / app and 2% in-store via Walmart Pay",
      whyPhrase: "5% on Walmart.com and pickup, no fee",
    },
  ],
  apple_card: [
    {
      brand: "Apple",
      bonus: 40,
      note: "3% on Apple purchases (and select merchants) — pays back on every iPhone, MacBook, and App Store charge",
      whyPhrase: "3% back on every Apple purchase",
    },
  ],
  rei_co_op_mastercard: [
    {
      brand: "REI",
      bonus: 30,
      note: "5% on REI purchases plus the annual member dividend stacks on top",
      whyPhrase: "5% on REI plus the annual dividend",
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
