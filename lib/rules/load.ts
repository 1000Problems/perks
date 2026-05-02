// Loader: pulls the data the pure evaluator needs, in as few queries as
// possible. Server-only — talks to Postgres directly via lib/db.ts.

import "server-only";
import { sql } from "@/lib/db";
import { evaluate } from "./evaluate";
import type {
  CardForRules,
  EligibilityResult,
  ProductFamilyContext,
  RuleRow,
  RulesContext,
  UserCardRow,
  UserExistingStatusRow,
  UserMembershipRow,
  UserSelfReportedRow,
  UserStateSnapshot,
} from "./types";

interface CardDbRow {
  id: string;
  display_name: string;
  issuer_id: string;
  card_type: "personal" | "business" | "secured" | "student";
}

interface UserCardDbRow {
  card_id: string;
  status: "held" | "closed_in_past_year" | "closed_long_ago";
  opened_at: Date | null;
  closed_at: Date | null;
  bonus_received: boolean;
  card_type: "personal" | "business" | "secured" | "student";
  issuer_id: string;
}

async function fetchUserState(userId: string): Promise<UserStateSnapshot> {
  const [user_cards, self_reported, memberships, existing_status] = await Promise.all([
    sql<UserCardDbRow[]>`
      select uc.card_id, uc.status, uc.opened_at, uc.closed_at, uc.bonus_received,
             c.card_type, c.issuer_id
      from user_cards uc
      join cards c on c.id = uc.card_id
      where uc.user_id = ${userId}
    `,
    sql<UserSelfReportedRow[]>`
      select credit_score_band, household_income_band, has_business_income, state_code
      from user_self_reported where user_id = ${userId}
    `,
    sql<UserMembershipRow[]>`
      select membership_key, active from user_memberships where user_id = ${userId}
    `,
    sql<UserExistingStatusRow[]>`
      select status_key, active from user_existing_status where user_id = ${userId}
    `,
  ]);
  return {
    user_cards: user_cards as UserCardRow[],
    self_reported: self_reported[0] ?? null,
    memberships,
    existing_status,
  };
}

async function fetchRulesForCards(cardIds: string[]): Promise<Map<string, RuleRow[]>> {
  const out = new Map<string, RuleRow[]>();
  if (cardIds.length === 0) return out;

  // Issuer-level rules referenced via card_rule_refs.
  const issuerRules = await sql<{
    card_id: string; id: string; rule_type: RuleRow["rule_type"];
    severity: RuleRow["severity"]; description: string | null; config: Record<string, unknown>;
  }[]>`
    select crr.card_id, ir.id, ir.rule_type, ir.severity, ir.description, ir.config
      from card_rule_refs crr
      join issuer_rules ir on ir.id = crr.rule_id
     where crr.card_id = any(${cardIds}::text[])
  `;
  for (const r of issuerRules) {
    const list = out.get(r.card_id) ?? [];
    list.push({
      id: r.id, rule_type: r.rule_type, severity: r.severity,
      description: r.description, config: r.config, origin: "issuer",
    });
    out.set(r.card_id, list);
  }

  // Card-specific rules.
  const cardRules = await sql<{
    card_id: string; id: number; rule_type: RuleRow["rule_type"];
    severity: RuleRow["severity"]; description: string | null; config: Record<string, unknown>;
  }[]>`
    select card_id, id, rule_type, severity, description, config
      from card_specific_rules
     where card_id = any(${cardIds}::text[])
  `;
  for (const r of cardRules) {
    const list = out.get(r.card_id) ?? [];
    list.push({
      id: `card_specific:${r.id}`, rule_type: r.rule_type, severity: r.severity,
      description: r.description, config: r.config, origin: "card_specific",
    });
    out.set(r.card_id, list);
  }
  return out;
}

async function fetchProductFamiliesForCards(cardIds: string[]): Promise<Map<string, ProductFamilyContext>> {
  const out = new Map<string, ProductFamilyContext>();
  if (cardIds.length === 0) return out;
  const rows = await sql<{ card_id: string; family_id: string }[]>`
    select card_id, family_id from product_family_members
    where card_id = any(${cardIds}::text[])
  `;
  if (rows.length === 0) return out;
  const familyIds = [...new Set(rows.map((r) => r.family_id))];
  const memberRows = await sql<{ family_id: string; card_id: string }[]>`
    select family_id, card_id from product_family_members
    where family_id = any(${familyIds}::text[])
  `;
  const membersByFamily = new Map<string, string[]>();
  for (const m of memberRows) {
    const list = membersByFamily.get(m.family_id) ?? [];
    list.push(m.card_id);
    membersByFamily.set(m.family_id, list);
  }
  for (const r of rows) {
    out.set(r.card_id, {
      family_id: r.family_id,
      member_card_ids: membersByFamily.get(r.family_id) ?? [],
    });
  }
  return out;
}

export interface EvaluateOpts {
  userId: string;
  cardId: string;
  today?: Date;
}

export async function loadRulesContext(opts: EvaluateOpts): Promise<RulesContext> {
  const cardRows = await sql<CardDbRow[]>`
    select id, display_name, issuer_id, card_type from cards where id = ${opts.cardId} limit 1
  `;
  if (!cardRows[0]) throw new Error(`unknown card: ${opts.cardId}`);
  const card: CardForRules = cardRows[0];

  const [user_state, rulesByCard, familiesByCard] = await Promise.all([
    fetchUserState(opts.userId),
    fetchRulesForCards([opts.cardId]),
    fetchProductFamiliesForCards([opts.cardId]),
  ]);
  return {
    today: opts.today ?? new Date(),
    card,
    user_state,
    applicable_rules: rulesByCard.get(opts.cardId) ?? [],
    product_family: familiesByCard.get(opts.cardId) ?? null,
  };
}

export async function evaluateCard(opts: EvaluateOpts): Promise<EligibilityResult> {
  const ctx = await loadRulesContext(opts);
  return evaluate(ctx);
}

export interface EvaluateBatchOpts {
  userId: string;
  cardIds: string[];
  today?: Date;
}

export async function evaluateBatch(
  opts: EvaluateBatchOpts,
): Promise<Record<string, EligibilityResult>> {
  if (opts.cardIds.length === 0) return {};
  const today = opts.today ?? new Date();
  const cardRows = await sql<CardDbRow[]>`
    select id, display_name, issuer_id, card_type
    from cards where id = any(${opts.cardIds}::text[])
  `;
  const cardById = new Map(cardRows.map((r) => [r.id, r]));

  const [user_state, rulesByCard, familiesByCard] = await Promise.all([
    fetchUserState(opts.userId),
    fetchRulesForCards(opts.cardIds),
    fetchProductFamiliesForCards(opts.cardIds),
  ]);

  const out: Record<string, EligibilityResult> = {};
  for (const cardId of opts.cardIds) {
    const card = cardById.get(cardId);
    if (!card) continue;
    const ctx: RulesContext = {
      today,
      card,
      user_state,
      applicable_rules: rulesByCard.get(cardId) ?? [],
      product_family: familiesByCard.get(cardId) ?? null,
    };
    out[cardId] = evaluate(ctx);
  }
  return out;
}
