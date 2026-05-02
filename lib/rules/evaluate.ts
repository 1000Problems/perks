// Pure evaluator. (RulesContext) → {verdict, reasons[]}. No I/O.
// Every rule_type variant has a handler. New variants get a new handler
// + a new switch arm; the rule's config JSONB shape is enforced by the
// CHECK constraint in 0002_init_eligibility.sql.

import type {
  CreditScoreBand,
  EligibilityResult,
  Reason,
  RuleRow,
  RuleSeverity,
  RuleType,
  RulesContext,
  UserCardRow,
  Verdict,
} from "./types";

const SEVERITY_RANK: Record<RuleSeverity, number> = { inform: 0, warn: 1, block: 2 };
const SEVERITY_TO_VERDICT: Record<RuleSeverity, Verdict> = {
  inform: "green", warn: "yellow", block: "red",
};
const BAND_RANK: Record<CreditScoreBand, number> = {
  building: 0, fair: 1, good: 2, very_good: 3, excellent: 4, unknown: -1,
};

export function evaluate(ctx: RulesContext): EligibilityResult {
  const reasons: Reason[] = [];

  for (const rule of ctx.applicable_rules) {
    const r = applyRule(rule, ctx);
    if (r) reasons.push(...r);
  }

  // Verdict = highest severity present (block > warn > inform).
  let max: RuleSeverity = "inform";
  for (const r of reasons) {
    if (SEVERITY_RANK[r.severity] > SEVERITY_RANK[max]) max = r.severity;
  }
  const verdict: Verdict = reasons.length ? SEVERITY_TO_VERDICT[max] : "green";
  return { verdict, reasons };
}

function applyRule(rule: RuleRow, ctx: RulesContext): Reason[] | null {
  const handlers: Record<RuleType, (rule: RuleRow, ctx: RulesContext) => Reason[] | null> = {
    x_in_y: handleXInY,
    max_apps_per_period: handleMaxApps,
    max_open_cards_with_issuer: handleMaxOpenWithIssuer,
    once_per_lifetime: handleOncePerLifetime,
    once_per_product_family: handleOncePerFamily,
    velocity_2_3_4: handleVelocity,
    credit_score_floor: handleCreditFloor,
    invite_only: handleInviteOnly,
    existing_relationship_required: handleRelationshipRequired,
    informal: handleInformal,
  };
  return handlers[rule.rule_type](rule, ctx);
}

// ── Handlers ───────────────────────────────────────────────────────────

function handleXInY(rule: RuleRow, ctx: RulesContext): Reason[] | null {
  const cfg = rule.config as { limit: number; window_months: number; counts?: string[]; scope?: string };
  const limit = cfg.limit;
  const cutoff = monthsAgo(ctx.today, cfg.window_months);
  const matches = ctx.user_state.user_cards.filter((u) => {
    if (cfg.scope === "personal_credit_cards" && u.card_type !== "personal") return false;
    if (cfg.scope === "any") {
      // any
    }
    if (!u.opened_at) return false;
    return u.opened_at >= cutoff;
  });
  if (matches.length >= limit) {
    return [reason(rule, "block", `${matches.length}/${limit} new cards in ${cfg.window_months} months`,
      { count: matches.length, limit, window_months: cfg.window_months, examples: examples(matches) })];
  }
  if (matches.length === limit - 1) {
    return [reason(rule, "warn", `At ${matches.length}/${limit} — risky`,
      { count: matches.length, limit })];
  }
  return null;
}

function handleMaxApps(rule: RuleRow, ctx: RulesContext): Reason[] | null {
  const cfg = rule.config as { limit: number; window_months?: number; scope: string };
  const window = cfg.window_months ?? 1;
  const cutoff = monthsAgo(ctx.today, window);
  const apps = ctx.user_state.user_cards.filter((u) => u.opened_at && u.opened_at >= cutoff);
  if (apps.length >= cfg.limit) {
    return [reason(rule, "block", `${apps.length}/${cfg.limit} apps in ${window} month(s)`,
      { count: apps.length, limit: cfg.limit })];
  }
  return null;
}

function handleMaxOpenWithIssuer(rule: RuleRow, ctx: RulesContext): Reason[] | null {
  const cfg = rule.config as { limit: number };
  const sameIssuer = ctx.user_state.user_cards.filter(
    (u) => u.status === "held" && u.issuer_id === ctx.card.issuer_id,
  );
  if (sameIssuer.length >= cfg.limit) {
    return [reason(rule, "block", `Already at ${sameIssuer.length} ${ctx.card.issuer_id} cards (limit ${cfg.limit})`,
      { count: sameIssuer.length, limit: cfg.limit })];
  }
  return null;
}

function handleOncePerLifetime(rule: RuleRow, ctx: RulesContext): Reason[] | null {
  const cfg = rule.config as { exclude_status?: string[] } | undefined;
  const excluded = new Set(cfg?.exclude_status ?? []);
  const match = ctx.user_state.user_cards.find(
    (u) => u.card_id === ctx.card.id && !excluded.has(u.status) && u.bonus_received,
  );
  if (match) {
    return [reason(rule, "block", "Once-per-lifetime — SUB previously received",
      { card_id: ctx.card.id, status: match.status })];
  }
  return null;
}

function handleOncePerFamily(rule: RuleRow, ctx: RulesContext): Reason[] | null {
  if (!ctx.product_family) return null;
  const cfg = rule.config as { lookback_months?: number; family: string };
  const lookback = cfg.lookback_months ?? 48;
  const cutoff = monthsAgo(ctx.today, lookback);
  const familyMembers = new Set(ctx.product_family.member_card_ids);
  const match = ctx.user_state.user_cards.find((u) => {
    if (!familyMembers.has(u.card_id)) return false;
    if (u.bonus_received) return true;
    if (!u.opened_at) return false;
    return u.opened_at >= cutoff;
  });
  if (match) {
    return [reason(rule, "block", `Held a ${cfg.family} family card recently — SUB blocked`,
      { family: cfg.family, card_id: match.card_id })];
  }
  return null;
}

function handleVelocity(rule: RuleRow, ctx: RulesContext): Reason[] | null {
  // BoA pattern: encoded as { tiers: [{limit:2,window_months:2}, ...] }
  const cfg = rule.config as { tiers: Array<{ limit: number; window_months: number }> };
  const reasons: Reason[] = [];
  for (const tier of cfg.tiers ?? []) {
    const cutoff = monthsAgo(ctx.today, tier.window_months);
    const matches = ctx.user_state.user_cards.filter(
      (u) => u.issuer_id === ctx.card.issuer_id && u.opened_at && u.opened_at >= cutoff,
    );
    if (matches.length >= tier.limit) {
      reasons.push(
        reason(rule, "block", `${matches.length}/${tier.limit} ${ctx.card.issuer_id} cards in ${tier.window_months} months`,
          { tier, count: matches.length }),
      );
    }
  }
  return reasons.length ? reasons : null;
}

function handleCreditFloor(rule: RuleRow, ctx: RulesContext): Reason[] | null {
  const cfg = rule.config as { min_band: CreditScoreBand };
  const userBand = ctx.user_state.self_reported?.credit_score_band ?? "unknown";
  if (userBand === "unknown") return null;
  if (BAND_RANK[userBand] < BAND_RANK[cfg.min_band]) {
    return [reason(rule, "warn", `Reported credit band is ${userBand}; this card typically requires ${cfg.min_band}`,
      { user_band: userBand, required: cfg.min_band })];
  }
  return null;
}

function handleInviteOnly(rule: RuleRow, _ctx: RulesContext): Reason[] | null {
  const cfg = rule.config as { pathways?: string[] } | undefined;
  const pathways = cfg?.pathways?.join(", ") ?? "private invitation";
  return [reason(rule, "warn", `Invite-only — apply via ${pathways}`,
    { pathways: cfg?.pathways ?? [] })];
}

function handleRelationshipRequired(rule: RuleRow, ctx: RulesContext): Reason[] | null {
  const cfg = rule.config as { required_membership?: string; required_status?: string };
  const membershipKey = cfg.required_membership;
  const statusKey = cfg.required_status;
  if (membershipKey) {
    const m = ctx.user_state.memberships.find((x) => x.membership_key === membershipKey && x.active);
    if (!m) {
      return [reason(rule, "block", `Requires ${membershipKey} — not on file`,
        { required: membershipKey })];
    }
  }
  if (statusKey) {
    const s = ctx.user_state.existing_status.find((x) => x.status_key === statusKey && x.active);
    if (!s) {
      return [reason(rule, "block", `Requires ${statusKey} — not on file`,
        { required: statusKey })];
    }
  }
  return null;
}

function handleInformal(rule: RuleRow, _ctx: RulesContext): Reason[] | null {
  const cfg = rule.config as { message?: string };
  return [reason(rule, "inform", cfg.message ?? rule.description ?? "Informational note", {})];
}

// ── helpers ────────────────────────────────────────────────────────────

function monthsAgo(today: Date, months: number): Date {
  const d = new Date(today);
  d.setMonth(d.getMonth() - months);
  return d;
}

function examples(rows: UserCardRow[]): string[] {
  return rows.slice(0, 3).map((r) => r.card_id);
}

function reason(
  rule: RuleRow,
  severityOverride: RuleSeverity,
  message: string,
  evidence: Record<string, unknown>,
): Reason {
  // Rule-defined severity wins for `block` rules; for `warn` and `inform`
  // handlers can soften but not escalate above the rule's own severity.
  const severity = SEVERITY_RANK[severityOverride] <= SEVERITY_RANK[rule.severity]
    ? severityOverride
    : rule.severity;
  return {
    rule_id: rule.id,
    rule_type: rule.rule_type,
    severity,
    message,
    evidence,
  };
}
