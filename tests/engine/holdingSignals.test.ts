// Phase 4 tests — auto-derived holding signals from wallet contents.

import { describe, it, expect } from "vitest";
import {
  HOLDING_RULES,
  deriveHoldingSignals,
  mergeSignals,
} from "@/lib/engine/holdingSignals";
import type { WalletCardHeld } from "@/lib/engine/types";
import type { SignalState } from "@/lib/profile/server";

const heldOf = (...ids: string[]): WalletCardHeld[] =>
  ids.map((id) => ({ card_id: id, opened_at: "2024-01-01", bonus_received: false }));

describe("HOLDING_RULES", () => {
  it("covers each holdings.* signal exactly once", () => {
    const ids = Object.keys(HOLDING_RULES);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id.startsWith("holdings.")).toBe(true);
    }
  });

  it("thank_you_feeder fires on Citi cashback feeder cards", () => {
    expect(HOLDING_RULES["holdings.thank_you_feeder"](new Set(["citi_double_cash"]))).toBe(true);
    expect(HOLDING_RULES["holdings.thank_you_feeder"](new Set(["citi_custom_cash"]))).toBe(true);
    expect(HOLDING_RULES["holdings.thank_you_feeder"](new Set(["amex_gold"]))).toBe(false);
    expect(HOLDING_RULES["holdings.thank_you_feeder"](new Set())).toBe(false);
  });

  it("amex_mr_feeder fires on BBP or Green", () => {
    expect(HOLDING_RULES["holdings.amex_mr_feeder"](new Set(["amex_blue_business_plus"]))).toBe(true);
    expect(HOLDING_RULES["holdings.amex_mr_feeder"](new Set(["amex_green"]))).toBe(true);
    expect(HOLDING_RULES["holdings.amex_mr_feeder"](new Set(["amex_platinum"]))).toBe(false);
  });

  it("ultimate_rewards_feeder fires on Freedom Unlimited or Flex", () => {
    expect(HOLDING_RULES["holdings.ultimate_rewards_feeder"](new Set(["chase_freedom_unlimited"]))).toBe(true);
    expect(HOLDING_RULES["holdings.ultimate_rewards_feeder"](new Set(["chase_freedom_flex"]))).toBe(true);
    expect(HOLDING_RULES["holdings.ultimate_rewards_feeder"](new Set(["chase_sapphire_preferred"]))).toBe(false);
  });

  it("capital_one_miles_feeder fires on Quicksilver or SavorOne", () => {
    expect(HOLDING_RULES["holdings.capital_one_miles_feeder"](new Set(["capital_one_quicksilver"]))).toBe(true);
    expect(HOLDING_RULES["holdings.capital_one_miles_feeder"](new Set(["capital_one_savor_one"]))).toBe(true);
    expect(HOLDING_RULES["holdings.capital_one_miles_feeder"](new Set(["capital_one_venture"]))).toBe(false);
  });
});

describe("deriveHoldingSignals", () => {
  it("returns empty for an empty wallet", () => {
    expect(deriveHoldingSignals([])).toEqual(new Map());
  });

  it("auto-confirms thank_you_feeder when wallet contains Citi Double Cash", () => {
    const out = deriveHoldingSignals(heldOf("citi_double_cash"));
    expect(out.get("holdings.thank_you_feeder")).toBe("confirmed");
    // Other holdings rules don't fire.
    expect(out.has("holdings.amex_mr_feeder")).toBe(false);
    expect(out.has("holdings.ultimate_rewards_feeder")).toBe(false);
    expect(out.has("holdings.capital_one_miles_feeder")).toBe(false);
  });

  it("fires multiple holdings simultaneously when applicable", () => {
    const out = deriveHoldingSignals(
      heldOf("citi_double_cash", "amex_green", "chase_freedom_unlimited"),
    );
    expect(out.get("holdings.thank_you_feeder")).toBe("confirmed");
    expect(out.get("holdings.amex_mr_feeder")).toBe("confirmed");
    expect(out.get("holdings.ultimate_rewards_feeder")).toBe("confirmed");
    expect(out.has("holdings.capital_one_miles_feeder")).toBe(false);
  });

  it("does not fire on non-feeder cards in the same family", () => {
    const out = deriveHoldingSignals(heldOf("citi_strata_premier"));
    expect(out.has("holdings.thank_you_feeder")).toBe(false);
  });
});

describe("mergeSignals", () => {
  it("user-clicked signals win over auto-derived", () => {
    const user = new Map<string, SignalState>([
      ["holdings.thank_you_feeder", "dismissed"],
    ]);
    const derived = new Map<string, "confirmed">([
      ["holdings.thank_you_feeder", "confirmed"],
    ]);
    const out = mergeSignals(user, derived);
    expect(out.get("holdings.thank_you_feeder")).toBe("dismissed");
  });

  it("auto-derived fills gaps the user has not opined on", () => {
    const user = new Map<string, SignalState>([
      ["claims.dining_credit.standard", "confirmed"],
    ]);
    const derived = new Map<string, "confirmed">([
      ["holdings.thank_you_feeder", "confirmed"],
    ]);
    const out = mergeSignals(user, derived);
    expect(out.get("claims.dining_credit.standard")).toBe("confirmed");
    expect(out.get("holdings.thank_you_feeder")).toBe("confirmed");
    expect(out.size).toBe(2);
  });

  it("returns an empty map for two empty inputs", () => {
    expect(mergeSignals(new Map(), new Map()).size).toBe(0);
  });
});
