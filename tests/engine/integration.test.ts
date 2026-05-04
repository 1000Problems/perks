// Integration test — exercises the full engine pipeline against the
// real compiled card database. Catches data-vs-engine drift.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it, expect } from "vitest";
import { rankCards } from "@/lib/engine/ranking";
import { scoreCard } from "@/lib/engine/scoring";
import { loadCardDatabase } from "@/lib/data/loader";
import { getBrandFit } from "@/lib/engine/brandAffinity";
import type { RankOptions, UserProfile } from "@/lib/engine/types";
import type { ProgramCppOverride } from "@/lib/engine/programOverrides";

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
    for (const filter of ["total", "nofee", "premium"] as const) {
      const r = rankCards(fixture, fixture.cards_held, db, opts({ filter }));
      // Visible list is non-empty for total / nofee. Premium may be
      // empty depending on what cards are in the data, so we just
      // assert it's an array.
      expect(Array.isArray(r.visible)).toBe(true);
      // Sort invariant: among non-brand-matched cards (the "rest"
      // bucket below pinned cobrand cards), deltaOngoing is monotonically
      // non-increasing. Brand-matched cards are pinned to the top
      // regardless of delta.
      // Mirror the real pin rule from ranking.ts via getBrandFit, so
      // this test stays correct as new cobrand entries land in
      // CARD_BRAND_FIT (no need to keep a duplicate map in sync).
      const fit = (id: string) => {
        const card = db.cardById.get(id);
        if (!card) return false;
        return getBrandFit(card, fixture.brands_used) != null;
      };
      // Find the first card after the contiguous leading run of pinned
      // brand-matched cards, then assert deltaOngoing is monotonically
      // non-increasing across the unpinned tail.
      let firstUnpinned = 0;
      while (
        firstUnpinned < r.visible.length &&
        fit(r.visible[firstUnpinned].card.id)
      ) {
        firstUnpinned++;
      }
      for (let i = firstUnpinned + 1; i < r.visible.length; i++) {
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

  it("feeder-pair: holding Strata Premier surfaces Double Cash / Custom Cash at the top with value_when_missing copy", () => {
    // CLAUDE.md / TASK-recommendations-consume-feeder-pair: every held
    // card with feeder_pair surfaces its missing feeders as ranked
    // candidates. Strata Premier's feeder_pair pins both Double Cash
    // and Custom Cash with priority "first", which means they sit at
    // the top of the visible list ahead of brand pins and the regular
    // sort.
    const profile: UserProfile = {
      ...fixture,
      cards_held: [
        {
          card_id: "citi_strata_premier",
          opened_at: "2025-01-01",
          bonus_received: true,
        },
      ],
      // Empty brands_used so brand-pin doesn't compete with feeder-pin
      // for top slots in this test.
      brands_used: [],
    };
    const r = rankCards(
      profile,
      profile.cards_held,
      db,
      opts({ limit: 10 }),
    );
    const topIds = r.visible.slice(0, 2).map((v) => v.card.id);
    const hasFeeder =
      topIds.includes("citi_double_cash") ||
      topIds.includes("citi_custom_cash");
    expect(hasFeeder).toBe(true);

    // The why-line should be the value_when_missing copy from Strata
    // Premier's feeder_pair.
    const feederRec = r.visible.find(
      (v) =>
        v.card.id === "citi_double_cash" || v.card.id === "citi_custom_cash",
    );
    expect(feederRec?.why).toMatch(/cashback pools into this card/i);
  });

  it("feeder-pair: removing the source card drops the pin", () => {
    // Same fixture but Strata Premier is NOT held — the feeder pin
    // should disappear. Double Cash / Custom Cash may still appear
    // somewhere in the visible list on their own merits, but not
    // pinned to rank 1 by the feeder pass.
    const profile: UserProfile = {
      ...fixture,
      cards_held: [],
      brands_used: [],
    };
    const r = rankCards(profile, [], db, opts({ limit: 10 }));
    // Direct comparison: Double Cash without a feeder pull shouldn't
    // win against the highest-leverage cards in the catalog. We
    // just assert the feeder why-line copy isn't being applied to it.
    const dc = r.visible.find((v) => v.card.id === "citi_double_cash");
    if (dc) {
      expect(dc.why).not.toMatch(/cashback pools into this card/i);
    }
  });

  it("user-driven cpp: bumping citi_thankyou transfer cpp lifts Strata Premier's score", () => {
    // CLAUDE.md: User-driven cpp. The user can override the program's
    // shipped median (1.9¢) on the Strata page. The engine reads the
    // override via the programOverrides map and the candidate's
    // pointsOngoing.valueUsd should rise when the override is higher
    // than the default.
    const strata = db.cardById.get("citi_strata_premier");
    expect(strata).toBeDefined();
    if (!strata) return;

    const baseScore = scoreCard(
      strata,
      fixture,
      fixture.cards_held ?? [],
      db,
      { creditsMode: "realistic", subAmortizeMonths: 24 },
    );

    const overrides = new Map<string, ProgramCppOverride>([
      [
        "citi_thankyou",
        { cash_cpp: null, portal_cpp: null, transfer_cpp: 2.5 },
      ],
    ]);
    const lifted = scoreCard(
      strata,
      fixture,
      fixture.cards_held ?? [],
      db,
      { creditsMode: "realistic", subAmortizeMonths: 24 },
      new Map(),
      overrides,
    );

    // Points ongoing should show a higher cpp on the lifted run.
    const baseCpp = baseScore.components.pointsOngoing?.cpp ?? 0;
    const liftedCpp = lifted.components.pointsOngoing?.cpp ?? 0;
    expect(liftedCpp).toBe(2.5);
    expect(liftedCpp).toBeGreaterThan(baseCpp);

    // And the dollar value bucket should rise in lockstep.
    const baseUsd = baseScore.components.pointsOngoing?.valueUsd ?? 0;
    const liftedUsd = lifted.components.pointsOngoing?.valueUsd ?? 0;
    expect(liftedUsd).toBeGreaterThan(baseUsd);
  });
});
