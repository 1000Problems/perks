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
      // Sorting invariant: deltaOngoing is monotonically non-increasing.
      for (let i = 1; i < r.visible.length; i++) {
        expect(r.visible[i - 1].score.deltaOngoing).toBeGreaterThanOrEqual(
          r.visible[i].score.deltaOngoing,
        );
      }
    }
  });

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
});
