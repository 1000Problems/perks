// Eligibility engine tests. Uses the real compiled database (data/*.json
// must exist — `npm run cards:build` runs as prebuild) so we exercise the
// engine against actual issuer rules and card metadata.

import { describe, it, expect } from "vitest";
import { evaluateEligibility } from "@/lib/engine/eligibility";
import { loadCardDatabase } from "@/lib/data/loader";
import type { WalletCardHeld } from "@/lib/engine/types";

const TODAY = new Date("2026-05-01T00:00:00Z");
const db = loadCardDatabase();

const get = (id: string) => {
  const c = db.cardById.get(id);
  if (!c) throw new Error(`fixture card missing: ${id}`);
  return c;
};

function held(card_id: string, monthsAgo: number, bonus = true): WalletCardHeld {
  const d = new Date(TODAY);
  d.setMonth(d.getMonth() - monthsAgo);
  const iso = d.toISOString().slice(0, 10);
  return { card_id, opened_at: iso, bonus_received: bonus };
}

describe("evaluateEligibility — Chase 5/24", () => {
  it("clean wallet → green", () => {
    const r = evaluateEligibility(get("chase_sapphire_preferred"), [], db, TODAY);
    expect(r.status).toBe("green");
    expect(r.note).toMatch(/0\/24/);
  });

  it("4 personal cards in last 24mo → yellow", () => {
    const wallet = [
      held("amex_blue_cash_preferred", 3),
      held("amex_gold", 6),
      held("citi_double_cash", 10),
      held("capital_one_venture", 18),
    ];
    const r = evaluateEligibility(get("chase_sapphire_preferred"), wallet, db, TODAY);
    expect(r.status).toBe("yellow");
    expect(r.note).toMatch(/4\/24/);
  });

  it("5 personal cards in last 24mo → red", () => {
    const wallet = [
      held("amex_blue_cash_preferred", 3),
      held("amex_gold", 6),
      held("citi_double_cash", 10),
      held("capital_one_venture", 18),
      held("wells_fargo_active_cash", 22),
    ];
    const r = evaluateEligibility(get("chase_sapphire_preferred"), wallet, db, TODAY);
    expect(r.status).toBe("red");
  });
});

describe("evaluateEligibility — Amex once-per-lifetime", () => {
  it("holding the same Amex with bonus_received → red", () => {
    const wallet = [held("amex_gold", 36, true)];
    const r = evaluateEligibility(get("amex_gold"), wallet, db, TODAY);
    expect(r.status).toBe("red");
    expect(r.note).toMatch(/once-per-lifetime/i);
  });

  it("holding same Amex but bonus_received=false → green", () => {
    const wallet = [held("amex_gold", 36, false)];
    const r = evaluateEligibility(get("amex_gold"), wallet, db, TODAY);
    expect(r.status).toBe("green");
  });
});

describe("evaluateEligibility — business card flag", () => {
  it("business card returns yellow with verify-business-income note", () => {
    const r = evaluateEligibility(get("amex_business_gold"), [], db, TODAY);
    expect(r.status).toBe("yellow");
    expect(r.note).toMatch(/business/i);
  });
});

describe("evaluateEligibility — Sapphire 48-month rule", () => {
  it("recent Sapphire SUB → red on a new Sapphire", () => {
    const wallet = [held("chase_sapphire_preferred", 24, true)];
    const r = evaluateEligibility(get("chase_sapphire_reserve"), wallet, db, TODAY);
    expect(r.status).toBe("red");
    expect(r.note).toMatch(/48-month/i);
  });

  it("Sapphire opened > 48mo ago → green (bonus eligible again)", () => {
    const wallet = [held("chase_sapphire_preferred", 60, true)];
    const r = evaluateEligibility(get("chase_sapphire_reserve"), wallet, db, TODAY);
    expect(r.status).not.toBe("red");
  });
});
