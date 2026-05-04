// Phase 4 tests — scoreCard signal-interest bonus on candidate cards
// with card_plays.

import { describe, it, expect } from "vitest";
import { scoreCard } from "@/lib/engine/scoring";
import { loadCardDatabase } from "@/lib/data/loader";
import type {
  ScoringOptions,
  UserProfile,
  WalletCardHeld,
} from "@/lib/engine/types";
import type { SignalState } from "@/lib/profile/server";

const db = loadCardDatabase();

const opts: ScoringOptions = {
  creditsMode: "realistic",
  subAmortizeMonths: 24,
};

const profile: UserProfile = {
  spend_profile: { groceries: 6000, dining: 4000, other: 8000 },
  brands_used: [],
  cards_held: [],
  trips_planned: [],
  preferences: {},
  credit_score_band: "very_good",
};

const wallet: WalletCardHeld[] = [];

describe("scoreCard — signal-interest bonus", () => {
  // Strata Premier is the only card with card_plays today.
  const cardId = "citi_strata_premier";
  const card = db.cardById.get(cardId)!;

  it("backwards-compatible: 5-arg call (no signals) returns same score as empty Map", () => {
    const noArg = scoreCard(card, profile, wallet, db, opts);
    const emptyMap = scoreCard(card, profile, wallet, db, opts, new Map());
    expect(noArg.deltaOngoing).toBe(emptyMap.deltaOngoing);
    expect(noArg.deltaYear1).toBe(emptyMap.deltaYear1);
  });

  it("interested signals on a card with card_plays raise deltaOngoing", () => {
    const baseline = scoreCard(card, profile, wallet, db, opts, new Map());
    const withInterest = scoreCard(
      card,
      profile,
      wallet,
      db,
      opts,
      new Map<string, SignalState>([
        ["intents.aspires_japan", "interested"],
        ["transfers.to_aadvantage", "interested"],
      ]),
    );
    expect(withInterest.deltaOngoing).toBeGreaterThan(baseline.deltaOngoing);
  });

  it("confirmed signals do NOT add the interest boost (only interested does)", () => {
    const baseline = scoreCard(card, profile, wallet, db, opts, new Map());
    const allConfirmed = scoreCard(
      card,
      profile,
      wallet,
      db,
      opts,
      new Map<string, SignalState>([
        ["intents.aspires_japan", "confirmed"],
        ["transfers.to_aadvantage", "confirmed"],
      ]),
    );
    // Confirmed routes plays into confirmed_from_signals_usd, which the
    // interest-bonus formula does not multiply. So the bonus is zero.
    // The deltaOngoing may match baseline exactly OR rise slightly via
    // other paths — but it should NOT show the interest-bonus line item.
    const interestLine = allConfirmed.breakdown.find((b) =>
      b.label.startsWith("On your list"),
    );
    expect(interestLine).toBeUndefined();
    // We don't assert exact equality with baseline because confirmed
    // signals can interact with other parts of the engine; we only
    // assert that the interest-bonus line is absent.
    expect(allConfirmed.deltaOngoing).toBeGreaterThanOrEqual(baseline.deltaOngoing);
  });

  it("a candidate without card_plays gets no signal bonus regardless of signals", () => {
    const noPlaysCardId = "chase_freedom_unlimited";
    const noPlaysCard = db.cardById.get(noPlaysCardId)!;
    expect((noPlaysCard.card_plays ?? []).length).toBe(0);

    const baseline = scoreCard(noPlaysCard, profile, wallet, db, opts, new Map());
    const withSignals = scoreCard(
      noPlaysCard,
      profile,
      wallet,
      db,
      opts,
      new Map<string, SignalState>([
        ["intents.aspires_japan", "interested"],
        ["transfers.to_aadvantage", "confirmed"],
      ]),
    );
    expect(withSignals.deltaOngoing).toBe(baseline.deltaOngoing);
    expect(withSignals.deltaYear1).toBe(baseline.deltaYear1);
  });
});
