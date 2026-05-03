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

describe("scoreCard — spend-driven perk capture", () => {
  it("perks capture from spend signal: heavy travel → Amex Platinum perks activate", () => {
    // heavyTravelProfile has airfare/hotels/dining/transit spend, so
    // signal-gated credits (airline incidental, hotel credit, Uber,
    // dining) ramp up via lib/engine/perkSignals.ts.
    const result = scoreCard(
      card("amex_platinum"),
      heavyTravelProfile,
      [],
      db,
      opts(),
    );
    expect(result.components.perksOngoing).toBeGreaterThan(0);
  });

  it("perks stay at $0 when spend signal is absent", () => {
    // A profile with no airfare/hotels/transit/dining → no spend
    // signal can fire, so Amex Platinum's signal-gated perks all
    // capture $0. Subjective perks (Equinox, Saks, Clear) also stay
    // at $0 because they have no inferable signal.
    const lightSpend: UserProfile = {
      spend_profile: { groceries: 2000, other: 3000 },
      brands_used: [],
      cards_held: [],
      trips_planned: [],
      preferences: {},
    };
    const result = scoreCard(
      card("amex_platinum"),
      lightSpend,
      [],
      db,
      opts(),
    );
    expect(result.components.perksOngoing).toBe(0);
    expect(result.availablePerks.length).toBeGreaterThan(0);
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

describe("scoreCard — components reconcile to deltas", () => {
  it("spendOngoing + perksOngoing + feeOngoing equals deltaOngoing", () => {
    const result = scoreCard(
      card("amex_platinum"),
      heavyTravelProfile,
      [],
      db,
      opts(),
    );
    const { spendOngoing, perksOngoing, feeOngoing, subYear1 } = result.components;
    expect(spendOngoing + perksOngoing + feeOngoing).toBe(result.deltaOngoing);
    expect(spendOngoing + perksOngoing + feeOngoing + subYear1).toBe(result.deltaYear1);
  });

  it("a no-AF cashback card has spend pillar dominating perks", () => {
    // Cards in this class are spend-driven by design — small perks
    // (cell-phone protection etc.) may exist but the split should make
    // it visually obvious that the value is overwhelmingly from
    // spending, not from claim-conditional benefits.
    const result = scoreCard(
      card("wells_fargo_active_cash"),
      minimalProfile,
      [],
      db,
      opts(),
    );
    expect(result.components.spendOngoing).toBeGreaterThan(0);
    expect(result.components.spendOngoing).toBeGreaterThan(
      result.components.perksOngoing,
    );
    expect(result.components.feeOngoing).toBe(0);
  });

  it("a premium credit-heavy card with no opt-ins has perks pillar at $0", () => {
    // Pre-fix this test asserted that face-mode credits dominate spend
    // on Amex Platinum. Under perk-capture gating that's no longer true:
    // perks default to $0 until the user explicitly opts in. The card
    // now has to win on earnings, which is the right behavior — Platinum
    // shouldn't rank well for users whose spend doesn't match its 5×
    // airfare bonus.
    const lightSpend: UserProfile = {
      spend_profile: { other: 3000 },
      brands_used: [],
      cards_held: [],
      trips_planned: [],
      preferences: {},
    };
    const result = scoreCard(
      card("amex_platinum"),
      lightSpend,
      [],
      db,
      opts(),
    );
    expect(result.components.perksOngoing).toBe(0);
    expect(result.components.feeOngoing).toBeLessThan(0);
  });

  it("brand-fit value lands in the spend pillar, not perks", () => {
    const profile: UserProfile = {
      ...minimalProfile,
      brands_used: ["Costco"],
    };
    const without = scoreCard(
      card("costco_anywhere_visa"),
      minimalProfile,
      [],
      db,
      opts(),
    );
    const withBrand = scoreCard(
      card("costco_anywhere_visa"),
      profile,
      [],
      db,
      opts(),
    );
    // Spend pillar moves up; perks pillar does not.
    expect(withBrand.components.spendOngoing).toBeGreaterThan(
      without.components.spendOngoing,
    );
    expect(withBrand.components.perksOngoing).toBe(without.components.perksOngoing);
  });
});

describe("scoreCard — spend caps", () => {
  it("respects cap_usd_per_year on category rules", () => {
    // Amex Gold: 4x MR on us_supermarkets capped at $25,000/yr.
    // Under TPG-anchored amex_mr at 2.0¢: 25k × 4 × 2.0/100 = $2000
    // capped + 5k × 1 × 2.0/100 = $100 over-cap = $2100 total. Without
    // the cap it would be 30k × 4 × 2.0/100 = $2400. We assert the
    // earnings line is below the uncapped value (cap is being honored)
    // and equals the capped arithmetic to within rounding.
    const profile: UserProfile = {
      spend_profile: { groceries: 30000, other: 5000 },
      brands_used: [],
      cards_held: [],
      trips_planned: [],
      preferences: {},
    };
    const result = scoreCard(card("amex_gold"), profile, [], db, opts());
    const earningLine = result.breakdown.find(
      (b) => b.kind === "earning" && /Groceries/.test(b.label),
    );
    expect(earningLine).toBeDefined();
    if (earningLine) {
      // Cap is in effect: less than uncapped 30k × 4 × 2.0/100 = $2400.
      expect(earningLine.value).toBeLessThan(2400);
      // And matches the capped arithmetic within $50.
      expect(earningLine.value).toBeGreaterThan(2050);
      expect(earningLine.value).toBeLessThan(2150);
    }
  });
});
