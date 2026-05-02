// Cash vs points split — verifies the classifier resolves wallet-
// dependent earning modes (CFU alone vs CFU + Sapphire), the score
// outputs separate cashOngoing and pointsOngoing buckets, and the
// back-compat invariant `spendOngoing === cashOngoing + points$` holds.

import { describe, it, expect } from "vitest";
import { loadCardDatabase } from "@/lib/data/loader";
import { classifyEarning, scoreCard } from "@/lib/engine/scoring";
import type {
  ScoringOptions,
  UserProfile,
  WalletCardHeld,
} from "@/lib/engine/types";

const db = loadCardDatabase();
const get = (id: string) => {
  const c = db.cardById.get(id);
  if (!c) throw new Error(`fixture card missing: ${id}`);
  return c;
};

const SCORING: ScoringOptions = {
  creditsMode: "realistic",
  subAmortizeMonths: 24,
};

function profile(spend: Partial<UserProfile["spend_profile"]>): UserProfile {
  return {
    spend_profile: spend,
    brands_used: [],
    cards_held: [],
    trips_planned: [],
    credit_score_band: "very_good",
    preferences: {},
  };
}

function held(card_id: string): WalletCardHeld {
  return { card_id, opened_at: "2026-01-01", bonus_received: true };
}

describe("classifyEarning", () => {
  it("cash program → cash mode at 1cpp", () => {
    const card = get("amex_blue_cash_preferred");
    const m = classifyEarning(card, [card], db);
    expect(m.mode).toBe("cash");
    expect(m.cpp).toBe(1);
    expect(m.programId).toBe("amex_cashback");
  });

  it("loyalty program — candidate is itself an unlock card", () => {
    const card = get("chase_sapphire_preferred");
    const m = classifyEarning(card, [card], db);
    expect(m.mode).toBe("loyalty");
    expect(m.cpp).toBe(1.25);
    expect(m.programId).toBe("chase_ur");
  });

  it("loyalty program — CFU alone falls back to cash mode", () => {
    const card = get("chase_freedom_unlimited");
    const m = classifyEarning(card, [card], db);
    expect(m.mode).toBe("cash");
    expect(m.cpp).toBe(1);
    // programId still resolves — the card earns into chase_ur, just at
    // cash-redemption value. UI can use this to show "earns UR (cash
    // until paired with a Sapphire)".
    expect(m.programId).toBe("chase_ur");
  });

  it("loyalty program — CFU + CSP flips into loyalty mode", () => {
    const cfu = get("chase_freedom_unlimited");
    const csp = get("chase_sapphire_preferred");
    const m = classifyEarning(cfu, [csp, cfu], db);
    expect(m.mode).toBe("loyalty");
    expect(m.cpp).toBe(1.25);
    expect(m.programId).toBe("chase_ur");
  });

  it("cobrand program → always loyalty regardless of wallet", () => {
    const card = get("united_explorer");
    const m = classifyEarning(card, [card], db);
    expect(m.mode).toBe("loyalty");
    expect(m.programId).toBe("united_mileageplus");
  });
});

describe("scoreCard split — cash vs points buckets", () => {
  it("cash card populates cashOngoing only", () => {
    // Heavy grocery profile so BCP's 6% category fires.
    const p = profile({ groceries: 6000 });
    const score = scoreCard(get("amex_blue_cash_preferred"), p, [], db, SCORING);
    expect(score.components.cashOngoing).toBeGreaterThan(0);
    expect(score.components.pointsOngoing).toBeNull();
    expect(score.components.spendOngoing).toBe(score.components.cashOngoing);
  });

  it("loyalty card populates pointsOngoing only", () => {
    // Heavy dining profile; CSP earns 3x UR on dining.
    const p = profile({ dining: 8000 });
    const score = scoreCard(get("chase_sapphire_preferred"), p, [], db, SCORING);
    expect(score.components.cashOngoing).toBe(0); // no brand-fit on this profile
    const pts = score.components.pointsOngoing;
    expect(pts).not.toBeNull();
    expect(pts!.pts).toBeGreaterThan(0);
    expect(pts!.programId).toBe("chase_ur");
    expect(pts!.cpp).toBe(1.25);
    expect(score.components.spendOngoing).toBe(pts!.valueUsd);
  });

  it("CFU flips between cash and loyalty depending on wallet", () => {
    const p = profile({ dining: 6000, other: 30000 });
    const cfu = get("chase_freedom_unlimited");

    // Alone — cash mode. earnings flow to cashOngoing.
    const alone = scoreCard(cfu, p, [], db, SCORING);
    expect(alone.components.pointsOngoing).toBeNull();
    expect(alone.components.cashOngoing).toBeGreaterThan(0);

    // With Sapphire in wallet — loyalty mode at 1.25cpp.
    const paired = scoreCard(cfu, p, [held("chase_sapphire_preferred")], db, SCORING);
    expect(paired.components.pointsOngoing).not.toBeNull();
    expect(paired.components.pointsOngoing!.programId).toBe("chase_ur");
    // Pure dollar value in paired mode beats the alone mode by the cpp
    // uplift on whatever portion of CFU's earning isn't beaten by CSP's
    // own dining/portal rates. With CSP holding 3x dining (3.75¢) and
    // 5x portal (6.25¢), the uplift mostly shows on `other` (1.5x →
    // 1.875¢ vs 1.5¢). The two values must differ.
    expect(paired.components.spendOngoing).not.toBe(alone.components.spendOngoing);
  });

  it("back-compat: spendOngoing == cashOngoing + (pointsOngoing?.valueUsd ?? 0) across many cards", () => {
    const p = profile({
      groceries: 6000,
      dining: 4000,
      gas: 2000,
      airfare: 3000,
      hotels: 2000,
      shopping: 4000,
      other: 25000,
    });
    const sample = [
      "amex_blue_cash_preferred",
      "amex_gold",
      "chase_sapphire_preferred",
      "chase_freedom_unlimited",
      "citi_double_cash",
      "citi_strata_premier",
      "capital_one_venture_x",
      "wells_fargo_active_cash",
      "bilt_blue",
      "united_explorer",
    ];
    for (const id of sample) {
      const score = scoreCard(get(id), p, [], db, SCORING);
      const c = score.components;
      const ptsValue = c.pointsOngoing?.valueUsd ?? 0;
      expect(c.spendOngoing).toBe(c.cashOngoing + ptsValue);
      expect(score.deltaOngoing).toBe(
        c.spendOngoing + c.perksOngoing + c.feeOngoing,
      );
      expect(score.deltaYear1).toBe(score.deltaOngoing + c.subYear1);
    }
  });

  it("loyalty SUB carries an amortized point count in subYear1Detail", () => {
    const p = profile({ dining: 4000 });
    const score = scoreCard(get("chase_sapphire_preferred"), p, [], db, SCORING);
    const sub = score.components.subYear1Detail;
    expect(sub).not.toBeNull();
    expect(sub!.mode).toBe("loyalty");
    expect(sub!.pts).toBeGreaterThan(0);
    expect(sub!.programId).toBe("chase_ur");
    expect(sub!.valueUsd).toBe(score.components.subYear1);
  });

  it("displayed pts × cpp reverse-reconciles to displayed $ (no rounding drift)", () => {
    // The user reads "X pts ≈ $Y portal" and expects X × cpp / 100 ≈ Y.
    // Pre-fix this drifted by up to a cent because pts were derived
    // from unrounded earningsDelta while $ was the rounded value.
    const p = profile({
      groceries: 6000,
      dining: 8000,
      airfare: 4000,
      hotels: 3000,
      shopping: 4000,
      other: 25000,
    });
    const sample = [
      "chase_sapphire_preferred",
      "chase_sapphire_reserve",
      "amex_gold",
      "amex_platinum",
      "citi_strata_premier",
      "capital_one_venture_x",
      "bilt_blue",
      "united_explorer",
    ];
    for (const id of sample) {
      const score = scoreCard(get(id), p, [], db, SCORING);
      const pts = score.components.pointsOngoing;
      if (!pts) continue;
      // pts × cpp / 100, rounded, must equal displayed valueUsd exactly.
      const reconstructed = Math.round((pts.pts * pts.cpp) / 100);
      expect(reconstructed).toBe(pts.valueUsd);
    }
  });

  it("cash SUB has pts=0 in subYear1Detail", () => {
    const p = profile({ groceries: 4000 });
    const score = scoreCard(get("amex_blue_cash_preferred"), p, [], db, SCORING);
    const sub = score.components.subYear1Detail;
    expect(sub).not.toBeNull();
    expect(sub!.mode).toBe("cash");
    expect(sub!.pts).toBe(0);
    expect(sub!.valueUsd).toBeGreaterThan(0);
  });
});
