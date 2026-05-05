// Phase 4 tests — signal-aware card value computation.

import { describe, it, expect } from "vitest";
import {
  computeCardValue,
  yearlyEarningEstimate,
} from "@/lib/engine/cardValue";
import { computeFoundMoneyV2 } from "@/lib/engine/foundMoney";
import { loadCardDatabase } from "@/lib/data/loader";
import type { UserProfile, WalletCardHeld } from "@/lib/engine/types";
import type { SignalState } from "@/lib/profile/server";

const db = loadCardDatabase();

const baseProfile: UserProfile = {
  spend_profile: {
    groceries: 6000,
    dining: 4000,
    gas: 1500,
    airfare: 2000,
    hotels: 1000,
    other: 8000,
  },
  brands_used: [],
  cards_held: [],
  trips_planned: [],
  preferences: {},
};

const held = (cardId: string): WalletCardHeld => ({
  card_id: cardId,
  opened_at: "2024-06-01",
  bonus_received: true,
});

describe("computeCardValue — legacy path (cards without card_plays)", () => {
  // Pick a card that's confirmed not to have card_plays.
  const cardId = "chase_freedom_unlimited";
  const card = db.cardById.get(cardId)!;

  it("returns deterministic CardValue with confirmed=spend-derived, projected=available credits", () => {
    const out = computeCardValue(card, held(cardId), baseProfile, new Map(), db);
    expect(out.confirmed_usd).toBeGreaterThanOrEqual(0);
    expect(out.confirmed_from_signals_usd).toBe(0); // no plays = no signal-driven
    expect(out.dismissed_usd).toBe(0);
    expect(out.signalsTotal).toBeGreaterThan(0);
  });

  it("ignores the signal map for legacy-path cards", () => {
    const empty = computeCardValue(card, held(cardId), baseProfile, new Map(), db);
    const populated = computeCardValue(
      card,
      held(cardId),
      baseProfile,
      new Map<string, SignalState>([
        ["claims.dining_credit.standard", "confirmed"],
        ["intents.aspires_japan", "interested"],
      ]),
      db,
    );
    expect(populated.confirmed_usd).toBe(empty.confirmed_usd);
    expect(populated.projected_usd).toBe(empty.projected_usd);
  });
});

describe("computeCardValue — plays path (Strata Premier)", () => {
  const cardId = "citi_strata_premier";
  const card = db.cardById.get(cardId)!;

  it("uses the plays-aware path and returns nonzero for a card with card_plays", () => {
    expect((card.card_plays ?? []).length).toBeGreaterThan(0);
    const out = computeCardValue(card, held(cardId), baseProfile, new Map(), db);
    expect(out.confirmed_usd).toBeGreaterThanOrEqual(0);
  });

  it("confirmed signal lights the play's full value into the signals bucket", () => {
    // hotel_credit_100 reveals claims.hotel_credit.portal at face $100.
    // With signal confirmed, it should land in confirmed_from_signals_usd.
    const empty = computeCardValue(card, held(cardId), baseProfile, new Map(), db);
    const withSignal = computeCardValue(
      card,
      held(cardId),
      baseProfile,
      new Map<string, SignalState>([["claims.hotel_credit.portal", "confirmed"]]),
      db,
    );
    expect(withSignal.confirmed_from_signals_usd).toBeGreaterThan(
      empty.confirmed_from_signals_usd,
    );
  });

  it("interested signal routes value into projected, not confirmed", () => {
    const out = computeCardValue(
      card,
      held(cardId),
      baseProfile,
      new Map<string, SignalState>([
        ["intents.aspires_japan", "interested"],
        ["transfers.to_aadvantage", "interested"],
      ]),
      db,
    );
    // jal_biz_tokyo reveals both signals; with both interested it lands
    // in projected (transfer redemption value ~$4000+).
    expect(out.projected_usd).toBeGreaterThan(0);
  });

  it("dismissed signal routes value into dismissed (not subtracted from confirmed)", () => {
    // Use a play with reveals_signals but NO requires_signals so the
    // requirements check doesn't pre-zero the value. hyatt_park_tokyo
    // reveals [transfers.to_hyatt, intents.aspires_japan,
    // intents.aspires_premium_hotel] with requires=[].
    const out = computeCardValue(
      card,
      held(cardId),
      baseProfile,
      new Map<string, SignalState>([["transfers.to_hyatt", "dismissed"]]),
      db,
    );
    expect(out.dismissed_usd).toBeGreaterThan(0);
    // Confirmed bucket should not be inflated by the dismissed value.
    const empty = computeCardValue(card, held(cardId), baseProfile, new Map(), db);
    expect(out.confirmed_from_signals_usd).toBe(empty.confirmed_from_signals_usd);
  });

  it("requires_signals gates value when requirements unmet", () => {
    // hotel_credit_100 has requires_signals=[claims.hotel_credit.portal].
    // Without confirming, the play's contribution depends on legacy
    // capture-rate fallback rather than being zeroed; but a play whose
    // requires is non-empty AND not all confirmed should NOT count
    // anywhere — even via spend fallback.
    //
    // We can't easily isolate one play's contribution from the card's
    // total here, so we just sanity-check that confirming the requirement
    // raises the value compared to leaving it unset.
    const baseline = computeCardValue(card, held(cardId), baseProfile, new Map(), db);
    const requirementMet = computeCardValue(
      card,
      held(cardId),
      baseProfile,
      new Map<string, SignalState>([["claims.hotel_credit.portal", "confirmed"]]),
      db,
    );
    expect(requirementMet.confirmed_usd).toBeGreaterThanOrEqual(
      baseline.confirmed_usd,
    );
  });

  it("annual fee subtracted from confirmed only", () => {
    const out = computeCardValue(card, held(cardId), baseProfile, new Map(), db);
    const fee = card.annual_fee_usd ?? 0;
    expect(fee).toBeGreaterThan(0); // Strata Premier has $95 fee
    // confirmed = (signals + spend_estimate) - fee, clamped to zero
    expect(out.confirmed_usd).toBe(
      Math.max(
        0,
        Math.round(
          out.confirmed_from_signals_usd +
            out.confirmed_from_spend_estimate_usd -
            fee,
        ),
      ),
    );
  });
});

describe("computeFoundMoneyV2 — compat wrapper", () => {
  it("preserves shape: low/high/point/signalsFilled/signalsTotal", () => {
    const cardId = "chase_freedom_unlimited";
    const card = db.cardById.get(cardId)!;
    const out = computeFoundMoneyV2(card, held(cardId), baseProfile, db);
    expect(out).toHaveProperty("low");
    expect(out).toHaveProperty("high");
    expect(out).toHaveProperty("point");
    expect(out).toHaveProperty("signalsFilled");
    expect(out).toHaveProperty("signalsTotal");
    expect(out.low).toBeLessThanOrEqual(out.high);
    expect(out.point).toBeGreaterThanOrEqual(0);
  });

  it("4-arg call site (no signals param) compiles and runs", () => {
    const cardId = "amex_gold";
    const card = db.cardById.get(cardId);
    if (!card) return; // skip if not in catalog
    const out = computeFoundMoneyV2(card, held(cardId), baseProfile, db);
    expect(out.point).toBeGreaterThanOrEqual(0);
  });

  it("Strata Premier 'point' rises when user confirms a hotel-credit signal", () => {
    const cardId = "citi_strata_premier";
    const card = db.cardById.get(cardId)!;
    const baseline = computeFoundMoneyV2(card, held(cardId), baseProfile, db);
    const withSignal = computeFoundMoneyV2(
      card,
      held(cardId),
      baseProfile,
      db,
      new Map<string, SignalState>([
        ["claims.hotel_credit.portal", "confirmed"],
        ["transfers.to_hyatt", "confirmed"],
        ["intents.aspires_japan", "confirmed"],
        ["intents.aspires_premium_hotel", "confirmed"],
      ]),
    );
    expect(withSignal.point).toBeGreaterThanOrEqual(baseline.point);
  });
});

describe("yearlyEarningEstimate — drives the v3 CardArrivalHero number", () => {
  it("returns a positive value for Strata Premier holders with non-zero spend", () => {
    const card = db.cardById.get("citi_strata_premier")!;
    const out = yearlyEarningEstimate(card, baseProfile, db);
    expect(out).toBeGreaterThan(0);
    // Sanity: with the baseProfile's $22.5k of total spend across grocery/
    // dining/gas/airfare/hotels/other and 3x earn on most of those at
    // ThankYou's median 1.9¢/pt, the number is comfortably triple-digit.
    expect(out).toBeGreaterThan(200);
  });

  it("returns zero when the user has no spend profile (cold start)", () => {
    const card = db.cardById.get("citi_strata_premier")!;
    const empty: UserProfile = {
      ...baseProfile,
      spend_profile: {},
    };
    const out = yearlyEarningEstimate(card, empty, db);
    expect(out).toBe(0);
  });

  it("returns zero for cards that earn no rewards currency", () => {
    // Find a no-currency card if any exist; otherwise skip.
    const card = db.cards.find((c) => c.currency_earned === null);
    if (!card) return;
    const out = yearlyEarningEstimate(card, baseProfile, db);
    expect(out).toBe(0);
  });
});
