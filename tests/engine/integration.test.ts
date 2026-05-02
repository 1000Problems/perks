// Integration test — exercises the full engine pipeline against the
// real compiled card database. Catches data-vs-engine drift.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it, expect } from "vitest";
import { rankCards } from "@/lib/engine/ranking";
import { loadCardDatabase } from "@/lib/data/loader";
import type { RankOptions, UserProfile } from "@/lib/engine/types";

const FIXTURE_PATH = join(__dirname, "..", "fixtures", "profile.json");
const fixture: UserProfile = JSON.parse(readFileSync(FIXTURE_PATH, "utf8"));

const db = loadCardDatabase();
const TODAY = new Date("2026-05-01T00:00:00Z");

const opts = (overrides: Partial<RankOptions> = {}): RankOptions => ({
  filter: "total",
  scoring: { creditsMode: "realistic", subAmortizeMonths: 24 },
  today: TODAY,
  limit: 5,
  ...overrides,
});

describe("integration — full engine against real card database", () => {
  it("returns 5 visible recommendations for a typical US household", () => {
    const r = rankCards(fixture, fixture.cards_held, db, opts());
    expect(r.visible.length).toBe(5);
  });

  it("each filter mode returns sensible results", () => {
    for (const filter of ["total", "payself", "nofee", "premium"] as const) {
      const r = rankCards(fixture, fixture.cards_held, db, opts({ filter }));
      // Visible list is non-empty for total / payself / nofee. Premium
      // may be empty depending on what cards are in the data, so we
      // just assert it's an array.
      expect(Array.isArray(r.visible)).toBe(true);
      // Sort invariant: among non-brand-matched cards (the "rest"
      // bucket below pinned cobrand cards), deltaOngoing is monotonically
      // non-increasing. Brand-matched cards are pinned to the top
      // regardless of delta.
      const fit = (id: string) => {
        const card = db.cardById.get(id);
        if (!card) return false;
        return Boolean(
          // mirror the pin rule from ranking.ts
          fixture.brands_used.length > 0 && card.id in costcoLikePins(),
        );
      };
      // Skip first-pinned and assert order on the unpinned tail.
      const firstUnpinned = r.visible.findIndex((v) => !fit(v.card.id));
      for (let i = Math.max(firstUnpinned + 1, 1); i < r.visible.length; i++) {
        expect(r.visible[i - 1].score.deltaOngoing).toBeGreaterThanOrEqual(
          r.visible[i].score.deltaOngoing,
        );
      }
    }
  });

  // Mirrors CARD_BRAND_FIT keys in lib/engine/brandAffinity.ts. Kept
  // local so the test is self-contained — if a new cobrand fit lands,
  // add the card_id here too.
  function costcoLikePins(): Record<string, true> {
    return {
      costco_anywhere_visa: true,
      amazon_prime_visa: true,
      target_redcard: true,
      sams_club_mastercard: true,
      capital_one_walmart: true,
      apple_card: true,
      rei_co_op_mastercard: true,
    };
  }

  it("doubling dining lifts the top dining-heavy card's delta", () => {
    const baseline = rankCards(fixture, fixture.cards_held, db, opts());
    const heavyDining: UserProfile = {
      ...fixture,
      spend_profile: {
        ...fixture.spend_profile,
        dining: (fixture.spend_profile.dining ?? 0) * 4,
      },
    };
    const shifted = rankCards(heavyDining, heavyDining.cards_held, db, opts());

    // The top card's deltaOngoing should rise (or hold) when dining
    // spend quadruples — every reasonable rec gains either dining
    // points or doesn't change.
    expect(shifted.visible[0].score.deltaOngoing).toBeGreaterThanOrEqual(
      baseline.visible[0].score.deltaOngoing,
    );

    // A dining-heavy card (amex_gold, chase_sapphire_reserve, or
    // chase_sapphire_preferred) should appear somewhere in the top 5
    // when dining is dominant.
    const diningHeavyIds = new Set([
      "amex_gold",
      "chase_sapphire_reserve",
      "chase_sapphire_preferred",
      "capital_one_savor",
      "us_bank_altitude_go",
    ]);
    const shiftedHas = shifted.visible.some((r) => diningHeavyIds.has(r.card.id));
    expect(shiftedHas).toBe(true);
  });

  it("manifest exposes a compile date and counts", () => {
    expect(db.manifest.compiled_at).toMatch(/^\d{4}-\d{2}-\d{2}/);
    expect(db.manifest.counts.cards).toBeGreaterThan(0);
  });

  it("Costco-only brand pick + excellent credit + no cards → Costco lands in top 5", () => {
    // Mirrors the realistic onboarding scenario: user finishes the
    // four-step flow accepting default spend, picks Costco as their
    // only brand, reports excellent credit, and has no existing cards.
    const profile: UserProfile = {
      spend_profile: {
        groceries: 8400,
        dining: 4200,
        gas: 2400,
        airfare: 1800,
        hotels: 1500,
        streaming: 480,
        shopping: 3600,
        drugstore: 600,
        transit: 1200,
        utilities: 2400,
        home: 1500,
        other: 6000,
      },
      brands_used: ["Costco"],
      cards_held: [],
      trips_planned: [],
      credit_score_band: "excellent",
      preferences: { creditsMode: "realistic", viewMode: "ongoing" },
    };
    const r = rankCards(profile, [], db, opts());
    const ids = r.visible.map((v) => v.card.id);
    expect(ids).toContain("costco_anywhere_visa");

    // The why-sentence on that recommendation should lead with the
    // Costco brand fit, not a generic perk line.
    const costcoRec = r.visible.find((v) => v.card.id === "costco_anywhere_visa");
    expect(costcoRec?.why).toMatch(/costco/i);
  });

  it("Membership requirement → yellow when user hasn't picked the brand", () => {
    // Same profile but no Costco in brands_used. The Costco card stays
    // visible (not red-listed), but eligibility chip should be yellow
    // with a "requires Costco membership" note.
    const profile: UserProfile = {
      ...fixture,
      brands_used: [],
      cards_held: [],
    };
    const r = rankCards(profile, [], db, opts({ limit: 500 }));
    const costco = [...r.visible, ...r.denied].find(
      (v) => v.card.id === "costco_anywhere_visa",
    );
    expect(costco).toBeDefined();
    if (costco) {
      expect(costco.eligibility.status).toBe("yellow");
      expect(costco.eligibility.note).toMatch(/costco/i);
    }
  });

  it("Membership requirement → not flagged when user picked the matching brand", () => {
    const profile: UserProfile = {
      ...fixture,
      brands_used: ["Costco"],
      cards_held: [],
    };
    const r = rankCards(profile, [], db, opts({ limit: 500 }));
    const costco = [...r.visible, ...r.denied].find(
      (v) => v.card.id === "costco_anywhere_visa",
    );
    expect(costco).toBeDefined();
    // No yellow membership flag — should be green or carry only an
    // unrelated flag (e.g., business or credit-band).
    if (costco) {
      expect(costco.eligibility.note).not.toMatch(/requires costco/i);
    }
  });
});
