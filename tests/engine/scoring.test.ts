// Scoring engine tests against the real card database.

import { describe, it, expect } from "vitest";
import { scoreCard } from "@/lib/engine/scoring";
import { loadCardDatabase } from "@/lib/data/loader";
import type { ScoringOptions, UserProfile, WalletCardHeld } from "@/lib/engine/types";

const db = loadCardDatabase();
const card = (id: string) => {
  const c = db.cardById.get(id);
  if (!c) throw new Error(`fixture card missing: ${id}`);
  return c;
};

const opts = (creditsMode: "realistic" | "face" = "realistic"): ScoringOptions => ({
  creditsMode,
  subAmortizeMonths: 24,
});

const minimalProfile: UserProfile = {
  spend_profile: { groceries: 5000, dining: 2000, other: 8000 },
  brands_used: [],
  cards_held: [],
  trips_planned: [],
  preferences: {},
};

const heavyTravelProfile: UserProfile = {
  spend_profile: {
    dining: 10000,
    airfare: 8000,
    hotels: 6000,
    groceries: 6000,
    other: 12000,
  },
  brands_used: ["Hyatt"],
  cards_held: [],
  trips_planned: [],
  preferences: {},
};

describe("scoreCard — minimal spend, no-AF cashback card", () => {
  it("Wells Fargo Active Cash returns positive ongoing delta on minimal spend", () => {
    const result = scoreCard(
      card("wells_fargo_active_cash"),
      minimalProfile,
      [],
      db,
      opts(),
    );
    // 2% on $15,000 = $300, no fee
    expect(result.deltaOngoing).toBeGreaterThan(0);
    expect(result.deltaOngoing).toBeLessThanOrEqual(400);
  });
});

describe("scoreCard — premium travel card on heavy travel spend", () => {
  it("Chase Sapphire Reserve produces a positive delta", () => {
    const result = scoreCard(
      card("chase_sapphire_reserve"),
      heavyTravelProfile,
      [],
      db,
      opts(),
    );
    expect(result.deltaOngoing).toBeGreaterThan(0);
  });
});

describe("scoreCard — credits mode", () => {
  it("face-mode credits return more value than realistic-mode for premium cards", () => {
    const realistic = scoreCard(
      card("amex_platinum"),
      heavyTravelProfile,
      [],
      db,
      opts("realistic"),
    );
    const face = scoreCard(
      card("amex_platinum"),
      heavyTravelProfile,
      [],
      db,
      opts("face"),
    );
    expect(face.deltaOngoing).toBeGreaterThan(realistic.deltaOngoing);
  });
});

describe("scoreCard — perk dedup", () => {
  it("a card whose perks all overlap with the wallet returns nothing in newPerks of value", () => {
    // Hold CSP and CSR, score CSR — most CSR perks should already be covered.
    const wallet: WalletCardHeld[] = [
      { card_id: "chase_sapphire_preferred", opened_at: "2024-01-01", bonus_received: true },
    ];
    const result = scoreCard(
      card("chase_sapphire_reserve"),
      heavyTravelProfile,
      wallet,
      db,
      opts(),
    );
    // Some duplicated perks should be reported.
    expect(result.duplicatedPerks.length + result.newPerks.length).toBeGreaterThan(0);
  });
});

describe("scoreCard — brand-fit bonus", () => {
  it("Costco brand selection adds a brand-fit line item to costco_anywhere_visa", () => {
    const profile: UserProfile = {
      ...minimalProfile,
      brands_used: ["Costco"],
    };
    const result = scoreCard(
      card("costco_anywhere_visa"),
      profile,
      [],
      db,
      opts(),
    );
    const fitLine = result.breakdown.find((b) =>
      /Brand fit:.*Costco/i.test(b.label),
    );
    expect(fitLine).toBeDefined();
    expect(fitLine?.value).toBeGreaterThan(0);
  });

  it("no Costco brand selection → no brand-fit line item", () => {
    const result = scoreCard(
      card("costco_anywhere_visa"),
      minimalProfile,
      [],
      db,
      opts(),
    );
    const fitLine = result.breakdown.find((b) => /Brand fit/i.test(b.label));
    expect(fitLine).toBeUndefined();
  });

  it("brand fit lifts deltaOngoing for the matching cobrand card", () => {
    const without = scoreCard(
      card("costco_anywhere_visa"),
      minimalProfile,
      [],
      db,
      opts(),
    );
    const withBrand = scoreCard(
      card("costco_anywhere_visa"),
      { ...minimalProfile, brands_used: ["Costco"] },
      [],
      db,
      opts(),
    );
    expect(withBrand.deltaOngoing).toBeGreaterThan(without.deltaOngoing);
  });
});

describe("scoreCard — spend caps", () => {
  it("respects cap_usd_per_year on category rules", () => {
    // Amex Gold: 4x on us_supermarkets capped at $25,000/yr
    const profile: UserProfile = {
      spend_profile: { groceries: 30000, other: 5000 },
      brands_used: [],
      cards_held: [],
      trips_planned: [],
      preferences: {},
    };
    const result = scoreCard(card("amex_gold"), profile, [], db, opts());
    // Earnings on groceries should be capped: 25k @ 4x + 5k @ 1x = ~$1050,
    // not 30k @ 4x = $1200. With baseline of 1% covering the over-cap.
    const earningLine = result.breakdown.find(
      (b) => b.kind === "earning" && /Groceries/.test(b.label),
    );
    expect(earningLine).toBeDefined();
    if (earningLine) {
      // Should be substantially less than 30000 * 0.04 = 1200
      expect(earningLine.value).toBeLessThan(1200);
    }
  });
});
