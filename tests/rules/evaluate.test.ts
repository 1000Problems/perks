// Pure-function tests for the eligibility evaluator. No DB, no I/O —
// every input is hand-built. One test per rule_type variant.

import { describe, it, expect } from "vitest";
import { evaluate } from "../../lib/rules/evaluate";
import type {
  CardForRules, RuleRow, RulesContext, UserCardRow, UserStateSnapshot,
} from "../../lib/rules/types";

const CARD_CSP: CardForRules = {
  id: "chase_sapphire_preferred",
  display_name: "Chase Sapphire Preferred",
  issuer_id: "chase",
  card_type: "personal",
};

function ctx(partial: Partial<RulesContext>): RulesContext {
  return {
    today: new Date("2026-05-01"),
    card: CARD_CSP,
    user_state: empty(),
    applicable_rules: [],
    product_family: null,
    ...partial,
  };
}

function empty(): UserStateSnapshot {
  return { user_cards: [], self_reported: null, memberships: [], existing_status: [] };
}

function userCard(p: Partial<UserCardRow>): UserCardRow {
  return {
    card_id: "x", status: "held", opened_at: null, closed_at: null,
    bonus_received: false, card_type: "personal", issuer_id: "chase",
    ...p,
  };
}

function rule(p: Partial<RuleRow> & Pick<RuleRow, "rule_type" | "config">): RuleRow {
  return {
    id: "r", severity: "block", description: null, origin: "issuer", ...p,
  };
}

describe("evaluate — x_in_y", () => {
  it("under limit → green", () => {
    const r = rule({
      rule_type: "x_in_y",
      config: { limit: 5, window_months: 24, counts: ["personal"], scope: "personal_credit_cards" },
    });
    const res = evaluate(ctx({ applicable_rules: [r] }));
    expect(res.verdict).toBe("green");
  });
  it("at limit-1 → yellow", () => {
    const opened = new Date("2025-06-01");
    const cards = Array.from({ length: 4 }, (_, i) =>
      userCard({ card_id: `c${i}`, opened_at: opened }),
    );
    const r = rule({
      rule_type: "x_in_y",
      config: { limit: 5, window_months: 24, counts: ["personal"], scope: "personal_credit_cards" },
    });
    const res = evaluate(ctx({
      applicable_rules: [r],
      user_state: { ...empty(), user_cards: cards },
    }));
    expect(res.verdict).toBe("yellow");
  });
  it("at limit → red", () => {
    const opened = new Date("2025-06-01");
    const cards = Array.from({ length: 5 }, (_, i) =>
      userCard({ card_id: `c${i}`, opened_at: opened }),
    );
    const r = rule({
      rule_type: "x_in_y",
      config: { limit: 5, window_months: 24, counts: ["personal"], scope: "personal_credit_cards" },
    });
    const res = evaluate(ctx({
      applicable_rules: [r],
      user_state: { ...empty(), user_cards: cards },
    }));
    expect(res.verdict).toBe("red");
  });
});

describe("evaluate — once_per_lifetime", () => {
  it("held with bonus_received → red", () => {
    const r = rule({ rule_type: "once_per_lifetime", config: {} });
    const res = evaluate(ctx({
      applicable_rules: [r],
      user_state: { ...empty(), user_cards: [userCard({ card_id: CARD_CSP.id, bonus_received: true })] },
    }));
    expect(res.verdict).toBe("red");
  });
  it("closed_long_ago + exclude → green when policy excludes long-ago", () => {
    const r = rule({
      rule_type: "once_per_lifetime",
      config: { exclude_status: ["closed_long_ago"] },
    });
    const res = evaluate(ctx({
      applicable_rules: [r],
      user_state: {
        ...empty(),
        user_cards: [userCard({ card_id: CARD_CSP.id, status: "closed_long_ago", bonus_received: true })],
      },
    }));
    expect(res.verdict).toBe("green");
  });
});

describe("evaluate — once_per_product_family", () => {
  it("recent family member with bonus → red", () => {
    const r = rule({
      rule_type: "once_per_product_family",
      config: { family: "sapphire", lookback_months: 48 },
    });
    const res = evaluate(ctx({
      applicable_rules: [r],
      product_family: { family_id: "sapphire", member_card_ids: ["chase_sapphire_reserve", "chase_sapphire_preferred"] },
      user_state: { ...empty(), user_cards: [userCard({ card_id: "chase_sapphire_reserve", bonus_received: true })] },
    }));
    expect(res.verdict).toBe("red");
  });
});

describe("evaluate — invite_only", () => {
  it("never blocks; always yellow", () => {
    const r = rule({
      rule_type: "invite_only", severity: "warn",
      config: { pathways: ["high net worth referral"] },
    });
    const res = evaluate(ctx({ applicable_rules: [r] }));
    expect(res.verdict).toBe("yellow");
  });
});

describe("evaluate — credit_score_floor", () => {
  it("below floor → yellow, never red", () => {
    const r = rule({
      rule_type: "credit_score_floor", severity: "warn",
      config: { min_band: "excellent" },
    });
    const res = evaluate(ctx({
      applicable_rules: [r],
      user_state: { ...empty(), self_reported: {
        credit_score_band: "fair", household_income_band: null,
        has_business_income: null, state_code: null,
      } },
    }));
    expect(res.verdict).toBe("yellow");
  });
});

describe("evaluate — existing_relationship_required", () => {
  it("missing membership → red", () => {
    const r = rule({
      rule_type: "existing_relationship_required",
      config: { required_membership: "usaa_eligible" },
    });
    const res = evaluate(ctx({ applicable_rules: [r] }));
    expect(res.verdict).toBe("red");
  });
  it("present membership → green", () => {
    const r = rule({
      rule_type: "existing_relationship_required",
      config: { required_membership: "usaa_eligible" },
    });
    const res = evaluate(ctx({
      applicable_rules: [r],
      user_state: { ...empty(), memberships: [{ membership_key: "usaa_eligible", active: true }] },
    }));
    expect(res.verdict).toBe("green");
  });
});

describe("evaluate — velocity_2_3_4", () => {
  it("triggers on innermost tier", () => {
    const opened = new Date("2026-04-01"); // 1 month ago vs today=2026-05-01
    const r = rule({
      rule_type: "velocity_2_3_4",
      config: { tiers: [
        { limit: 2, window_months: 2 },
        { limit: 3, window_months: 12 },
        { limit: 4, window_months: 24 },
      ] },
    });
    const cards = [
      userCard({ card_id: "boa1", opened_at: opened, issuer_id: "chase" }),
      userCard({ card_id: "boa2", opened_at: opened, issuer_id: "chase" }),
    ];
    const res = evaluate(ctx({
      applicable_rules: [r],
      user_state: { ...empty(), user_cards: cards },
    }));
    expect(res.verdict).toBe("red");
  });
});
