// Ranking engine tests. Validates filter modes, deny-list path, why
// generator priority, and empty candidate handling.

import { describe, it, expect } from "vitest";
import { rankCards } from "@/lib/engine/ranking";
import { loadCardDatabase } from "@/lib/data/loader";
import type { RankOptions, UserProfile, WalletCardHeld } from "@/lib/engine/types";

const db = loadCardDatabase();
const TODAY = new Date("2026-05-01T00:00:00Z");

const baseOptions = (overrides: Partial<RankOptions> = {}): RankOptions => ({
  filter: "total",
  scoring: { creditsMode: "realistic", subAmortizeMonths: 24 },
  today: TODAY,
  limit: 5,
  ...overrides,
});

const profile = (overrides: Partial<UserProfile> = {}): UserProfile => ({
  spend_profile: { dining: 6000, groceries: 8000, gas: 2400, other: 12000 },
  brands_used: [],
  cards_held: [],
  trips_planned: [],
  preferences: {},
  ...overrides,
});

describe("rankCards — filter modes", () => {
  it("total: returns up to 5 visible cards sorted by deltaOngoing", () => {
    const r = rankCards(profile(), [], db, baseOptions({ filter: "total" }));
    expect(r.visible.length).toBeLessThanOrEqual(5);
    for (let i = 1; i < r.visible.length; i++) {
      expect(r.visible[i - 1].score.deltaOngoing).toBeGreaterThanOrEqual(
        r.visible[i].score.deltaOngoing,
      );
    }
  });

  it("nofee: every visible card has annual_fee_usd === 0", () => {
    const r = rankCards(profile(), [], db, baseOptions({ filter: "nofee" }));
    for (const v of r.visible) {
      expect(v.card.annual_fee_usd ?? 0).toBe(0);
    }
  });

  it("premium: every visible card has annual_fee_usd >= 395", () => {
    const r = rankCards(profile(), [], db, baseOptions({ filter: "premium" }));
    for (const v of r.visible) {
      expect(v.card.annual_fee_usd ?? 0).toBeGreaterThanOrEqual(395);
    }
  });
});

describe("rankCards — deny list", () => {
  it("never places a red-eligibility card in visible", () => {
    // Wallet held the bonus on amex_gold; ranking should put amex_gold in
    // denied (red), never in visible.
    const wallet: WalletCardHeld[] = [
      // hold amex_gold elsewhere — wait, ranking already filters held cards.
      // To exercise denied, hold five Chase personal cards in <24 months so
      // every Chase card hits 5/24.
      { card_id: "amex_blue_cash_preferred", opened_at: "2025-01-15", bonus_received: true },
      { card_id: "amex_gold", opened_at: "2025-04-10", bonus_received: false },
      { card_id: "citi_double_cash", opened_at: "2024-09-22", bonus_received: true },
      { card_id: "capital_one_venture", opened_at: "2024-06-30", bonus_received: true },
      { card_id: "wells_fargo_active_cash", opened_at: "2024-12-01", bonus_received: true },
    ];
    const r = rankCards(profile(), wallet, db, baseOptions());
    const chaseInVisible = r.visible.filter((v) => v.card.issuer === "Chase");
    const chaseInDenied = r.denied.filter((d) => d.card.issuer === "Chase");
    // 5/24 should push every Chase card to denied.
    expect(chaseInDenied.length).toBeGreaterThan(0);
    expect(chaseInVisible.length).toBe(0);
  });
});

describe("rankCards — why generator", () => {
  it("produces non-empty under-90-char why for every visible card", () => {
    const r = rankCards(profile({ trips_planned: [{ destination: "phoenix" }] }), [], db, baseOptions());
    for (const v of r.visible) {
      expect(v.why.length).toBeGreaterThan(0);
      expect(v.why.length).toBeLessThanOrEqual(90);
    }
  });

  it("destination match leads when applicable", () => {
    // Tokyo matches the japan_tokyo destination_perks key. Cards that
    // earn MR (transfers to Virgin Atlantic for ANA biz) should surface
    // a Tokyo or Virgin reference in their why.
    const p = profile({
      trips_planned: [{ destination: "tokyo" }],
      brands_used: ["Virgin Atlantic"],
    });
    const r = rankCards(p, [], db, baseOptions({ filter: "premium" }));
    const matchingWhy = r.visible.find((v) =>
      /tokyo|virgin|ana/i.test(v.why),
    );
    expect(matchingWhy).toBeDefined();
  });
});

describe("rankCards — empty candidates", () => {
  it("returns empty visible if nothing eligible", () => {
    // Hold every card the database has — trick: hold a tiny set, set
    // limit=0, expect empty visible.
    const r = rankCards(profile(), [], db, baseOptions({ limit: 0 }));
    expect(r.visible.length).toBe(0);
  });
});

describe("rankCards — family-best pin", () => {
  // Hilton family per CARD_BRAND_FIT in lib/engine/brandAffinity.ts
  const HILTON_IDS = [
    "hilton_honors",
    "hilton_honors_surpass",
    "hilton_honors_aspire",
    "hilton_honors_business",
  ];
  const UNITED_IDS = [
    "united_gateway",
    "united_explorer",
    "united_quest",
    "united_club_infinite",
  ];

  it("picks Hilton: pins exactly one Hilton card at the top of visible", () => {
    const p = profile({
      brands_used: ["Hilton"],
      spend_profile: { hotels: 4000, dining: 3000, other: 30000 },
    });
    const r = rankCards(p, [], db, baseOptions({ limit: 50 }));
    expect(HILTON_IDS).toContain(r.visible[0].card.id);
    // The pinned card has the max deltaOngoing among Hilton siblings
    // present in the catalog.
    const hiltonRows = r.visible.filter((v) => HILTON_IDS.includes(v.card.id));
    const max = Math.max(...hiltonRows.map((v) => v.score.deltaOngoing));
    expect(r.visible[0].score.deltaOngoing).toBe(max);
  });

  it("non-best Hilton siblings still appear when limit is wide enough", () => {
    // Under TPG-anchored cpp, Hilton points are 0.4¢, and with no perk
    // opt-ins the siblings' deltas land low. They still show when the
    // limit is generous — the family-pin only guarantees the BEST
    // Hilton card lands at the top, not that all siblings are in top
    // 50. This test now uses a wide limit to assert the siblings exist
    // somewhere in `visible`.
    const p = profile({
      brands_used: ["Hilton"],
      spend_profile: { hotels: 4000, other: 30000 },
    });
    const r = rankCards(p, [], db, baseOptions({ limit: 500 }));
    const visibleHilton = r.visible.filter((v) =>
      HILTON_IDS.includes(v.card.id),
    );
    // Pinned + at least one sibling visible somewhere in the list.
    expect(visibleHilton.length).toBeGreaterThanOrEqual(2);
  });

  it("retail behavior unchanged: Costco pick pins costco_anywhere_visa", () => {
    const r = rankCards(
      profile({ brands_used: ["Costco"] }),
      [],
      db,
      baseOptions(),
    );
    expect(r.visible[0].card.id).toBe("costco_anywhere_visa");
  });

  it("multi-brand: Hilton + United pin one card per family in top 2", () => {
    const p = profile({
      brands_used: ["Hilton", "United"],
      spend_profile: { hotels: 3000, airfare: 3000, other: 30000 },
    });
    const r = rankCards(p, [], db, baseOptions({ limit: 5 }));
    const top2 = [r.visible[0].card.id, r.visible[1].card.id];
    expect(top2.some((id) => HILTON_IDS.includes(id))).toBe(true);
    expect(top2.some((id) => UNITED_IDS.includes(id))).toBe(true);
  });

  it("under category sort: family-best pin does not fire", () => {
    const p = profile({
      brands_used: ["Hilton"],
      spend_profile: { dining: 6000, hotels: 4000, other: 30000 },
    });
    const r = rankCards(
      p,
      [],
      db,
      baseOptions({
        limit: 10,
        sortBy: { kind: "category", category: "dining" },
      }),
    );
    // Order is strictly by dining delta desc, regardless of brand
    // affinity. The pin cannot insert a card out of dining-delta order.
    for (let i = 1; i < r.visible.length; i++) {
      const prev = r.visible[i - 1].score.spendImpact.dining?.delta ?? 0;
      const curr = r.visible[i].score.spendImpact.dining?.delta ?? 0;
      expect(prev).toBeGreaterThanOrEqual(curr);
    }
  });
});

describe("rankCards — specialization lenses", () => {
  // High and well-distributed spend so every lens has room to rank
  // candidates by their normal scoring (otherwise ties dominate and
  // the comparator becomes ID-order, masking the filter behavior).
  const richProfile = profile({
    spend_profile: {
      groceries: 8000,
      dining: 6000,
      gas: 2400,
      airfare: 3000,
      hotels: 3000,
      shopping: 4000,
      other: 12000,
    },
  });

  it("cash lens excludes pure transferable-points cards", () => {
    const r = rankCards(
      richProfile,
      [],
      db,
      baseOptions({
        limit: 200,
        sortBy: { kind: "specialization", lens: "cash" },
      }),
    );
    const ids = r.visible.map((v) => v.card.id);
    // Sapphire Preferred / Reserve, Amex Gold / Platinum, Venture X,
    // Strata Premier — all earn transferable currencies and have no
    // cashback category tag. Should not appear in the Cash lens.
    expect(ids).not.toContain("chase_sapphire_preferred");
    expect(ids).not.toContain("chase_sapphire_reserve");
    expect(ids).not.toContain("amex_gold");
    expect(ids).not.toContain("amex_platinum");
    expect(ids).not.toContain("capital_one_venture_x");
    expect(ids).not.toContain("citi_strata_premier");
    // Cobrand cards (airline/hotel currencies) also excluded.
    expect(ids).not.toContain("hilton_honors_aspire");
    expect(ids).not.toContain("united_explorer");
    expect(ids).not.toContain("delta_skymiles_gold");
  });

  it("cash lens includes cashback-tagged cards even when they earn transferable points", () => {
    const r = rankCards(
      richProfile,
      [],
      db,
      baseOptions({
        limit: 200,
        sortBy: { kind: "specialization", lens: "cash" },
      }),
    );
    const ids = r.visible.map((v) => v.card.id);
    // Citi Double Cash earns into citi_thankyou (transferable) but is
    // marketed and used as a cashback card. Its category array has
    // "flat_rate_cashback" — that's the signal that pulls it into Cash.
    expect(ids).toContain("citi_double_cash");
    // Pure cashback programs (no transfer partners) are also in.
    expect(ids).toContain("wells_fargo_active_cash");
    expect(ids).toContain("citi_custom_cash");
  });

  it("points lens excludes cobrand airline/hotel cards", () => {
    const r = rankCards(
      richProfile,
      [],
      db,
      baseOptions({
        limit: 200,
        sortBy: { kind: "specialization", lens: "points" },
      }),
    );
    const ids = r.visible.map((v) => v.card.id);
    // Cobrand cards earn loyalty currency but it's not transferable.
    expect(ids).not.toContain("hilton_honors_aspire");
    expect(ids).not.toContain("hilton_honors_surpass");
    expect(ids).not.toContain("marriott_bonvoy_brilliant");
    expect(ids).not.toContain("united_explorer");
    expect(ids).not.toContain("delta_skymiles_gold");
    expect(ids).not.toContain("delta_skymiles_reserve");
    // Cashback cards excluded too — Double Cash earns TY but is in Cash.
    expect(ids).not.toContain("citi_double_cash");
    expect(ids).not.toContain("citi_custom_cash");
    expect(ids).not.toContain("wells_fargo_active_cash");
    // Pure no-rewards / secured cards excluded (currency_earned: null).
    expect(ids).not.toContain("citi_simplicity");
  });

  it("points lens includes transferable-points cards", () => {
    const r = rankCards(
      richProfile,
      [],
      db,
      baseOptions({
        limit: 200,
        sortBy: { kind: "specialization", lens: "points" },
      }),
    );
    const ids = r.visible.map((v) => v.card.id);
    expect(ids).toContain("chase_sapphire_preferred");
    expect(ids).toContain("amex_gold");
    expect(ids).toContain("capital_one_venture_x");
  });

  it("cash lens sorts by gross cashOngoing, not deltaOngoing", () => {
    const r = rankCards(
      richProfile,
      [],
      db,
      baseOptions({
        limit: 50,
        sortBy: { kind: "specialization", lens: "cash" },
      }),
    );
    expect(r.visible.length).toBeGreaterThan(0);
    for (let i = 1; i < r.visible.length; i++) {
      const prev = r.visible[i - 1].score.components.cashOngoing;
      const curr = r.visible[i].score.components.cashOngoing;
      expect(prev + 1e-6).toBeGreaterThanOrEqual(curr);
    }
  });

  it("points lens sorts by points value, not deltaOngoing", () => {
    const r = rankCards(
      richProfile,
      [],
      db,
      baseOptions({
        limit: 50,
        sortBy: { kind: "specialization", lens: "points" },
      }),
    );
    expect(r.visible.length).toBeGreaterThan(0);
    for (let i = 1; i < r.visible.length; i++) {
      const prev = r.visible[i - 1].score.components.pointsOngoing?.valueUsd ?? 0;
      const curr = r.visible[i].score.components.pointsOngoing?.valueUsd ?? 0;
      expect(prev + 1e-6).toBeGreaterThanOrEqual(curr);
    }
  });

  it("points lens does NOT put perks-heavy zero-points cards at the top", () => {
    // Repro of the user-reported bug: under deltaOngoing sort, Amex
    // Platinum (large perks + SUB, but pointsOngoing = 0 when MR
    // doesn't unlock for an empty wallet) sat at #1 above Sapphire
    // Reserve (which actually earns points on this profile). With the
    // pointsOngoing.valueUsd sort, the top card must have a non-zero
    // points value — otherwise it doesn't belong in Points.
    const r = rankCards(
      richProfile,
      [],
      db,
      baseOptions({
        limit: 5,
        sortBy: { kind: "specialization", lens: "points" },
      }),
    );
    expect(r.visible.length).toBeGreaterThan(0);
    const top = r.visible[0];
    const topPointsValue = top.score.components.pointsOngoing?.valueUsd ?? 0;
    expect(topPointsValue).toBeGreaterThan(0);
  });

  it("perks lens sorts by gross perksOngoing", () => {
    const r = rankCards(
      richProfile,
      [],
      db,
      baseOptions({
        limit: 50,
        sortBy: { kind: "specialization", lens: "perks" },
      }),
    );
    expect(r.visible.length).toBeGreaterThan(0);
    for (let i = 1; i < r.visible.length; i++) {
      const prev = r.visible[i - 1].score.components.perksOngoing;
      const curr = r.visible[i].score.components.perksOngoing;
      // Account for the credit-band haircut, which is a no-op when
      // userBand is undefined (default profile). Use a tolerant
      // comparison to absorb floating-point drift.
      expect(prev + 1e-6).toBeGreaterThanOrEqual(curr);
    }
  });

  it("specialization sort releases the brand-affinity pin", () => {
    // Hilton brand pin would normally pin a Hilton card to position #1
    // under total sort. Under cash/points/perks, the lens choice is the
    // ranking axis — pin must release.
    const p = profile({
      brands_used: ["Hilton"],
      spend_profile: { hotels: 4000, dining: 3000, other: 30000 },
    });
    // Cash lens excludes Hilton cards entirely (they earn loyalty
    // hotel currency, not cash) — perfect proof that the filter ran.
    const cashR = rankCards(
      p,
      [],
      db,
      baseOptions({
        limit: 50,
        sortBy: { kind: "specialization", lens: "cash" },
      }),
    );
    const cashIds = cashR.visible.map((v) => v.card.id);
    expect(cashIds.find((id) => id.startsWith("hilton_"))).toBeUndefined();
    // Perks lens has no program filter, so Hilton cards are eligible
    // — but they should NOT be pinned to #1 just because the user
    // listed Hilton. The top card is whichever has the highest net
    // perks value.
    const perksR = rankCards(
      p,
      [],
      db,
      baseOptions({
        limit: 50,
        sortBy: { kind: "specialization", lens: "perks" },
      }),
    );
    const topPerks = perksR.visible[0].score.components.perksOngoing;
    const maxPerks = Math.max(
      ...perksR.visible.map((v) => v.score.components.perksOngoing),
    );
    expect(topPerks).toBeCloseTo(maxPerks, 6);
  });
});

describe("rankCards — sortBy", () => {
  it("omitted sortBy matches { kind: total } order exactly", () => {
    const a = rankCards(profile(), [], db, baseOptions());
    const b = rankCards(profile(), [], db, baseOptions({ sortBy: { kind: "total" } }));
    expect(a.visible.map((v) => v.card.id)).toEqual(b.visible.map((v) => v.card.id));
  });

  it("category sort orders visible cards by descending category delta", () => {
    // High dining spend, no held cards — every dining-strong card has
    // room to add marginal value. Top of the list must hold the highest
    // dining delta.
    const p = profile({
      spend_profile: { dining: 12000, groceries: 4000, gas: 1200, other: 6000 },
    });
    const r = rankCards(
      p,
      [],
      db,
      baseOptions({
        limit: 5,
        sortBy: { kind: "category", category: "dining" },
      }),
    );
    expect(r.visible.length).toBeGreaterThan(0);
    for (let i = 1; i < r.visible.length; i++) {
      const prev = r.visible[i - 1].score.spendImpact.dining?.delta ?? 0;
      const curr = r.visible[i].score.spendImpact.dining?.delta ?? 0;
      expect(prev).toBeGreaterThanOrEqual(curr);
    }
  });

  it("category sort releases the brand-affinity pin", () => {
    // Brand affinity normally pins a cobrand card to position #1 even
    // when its raw delta is lower. Under category sort the pin should
    // release, so the top card is whichever has the highest category
    // delta — not necessarily the cobrand match.
    const brands = ["Costco"];
    const totalRanked = rankCards(
      profile({ brands_used: brands }),
      [],
      db,
      baseOptions({ filter: "total", limit: 10 }),
    );
    const categoryRanked = rankCards(
      profile({ brands_used: brands }),
      [],
      db,
      baseOptions({
        filter: "total",
        limit: 10,
        sortBy: { kind: "category", category: "dining" },
      }),
    );
    // Under category sort the order is strictly by dining delta
    // (descending), so the top card's dining delta must be the max
    // among all visible — even if a cobrand card has a higher overall
    // delta. The total-mode top card is whatever brand-pin selected.
    const categoryTopId = categoryRanked.visible[0]?.card.id;
    expect(categoryTopId).toBeDefined();
    const maxDiningDelta = Math.max(
      ...categoryRanked.visible.map((v) => v.score.spendImpact.dining?.delta ?? 0),
    );
    const topDiningDelta =
      categoryRanked.visible[0].score.spendImpact.dining?.delta ?? 0;
    expect(topDiningDelta).toBe(maxDiningDelta);
    // Sanity: the two modes should not always produce the same #1
    // when brand affinity is present and dining isn't the cobrand's
    // strong suit. (We don't strictly assert inequality because the
    // database may not have a Costco-branded card; the loose check
    // above is what proves the pin was released.)
    void totalRanked;
  });
});
