// Server-side eligibility evaluator types.
// Pure-function-friendly: every input the evaluator needs lives in
// RulesContext. The loader fills it; the evaluator never touches DB.

export type RuleType =
  | "x_in_y"
  | "max_apps_per_period"
  | "max_open_cards_with_issuer"
  | "once_per_lifetime"
  | "once_per_product_family"
  | "velocity_2_3_4"
  | "credit_score_floor"
  | "invite_only"
  | "existing_relationship_required"
  | "informal";

export type RuleSeverity = "block" | "warn" | "inform";
export type Verdict = "green" | "yellow" | "red";
export type CreditScoreBand =
  | "building" | "fair" | "good" | "very_good" | "excellent" | "unknown";

export interface RuleRow {
  id: string;
  rule_type: RuleType;
  severity: RuleSeverity;
  description: string | null;
  config: Record<string, unknown>;
  origin: "issuer" | "card_specific";
}

export interface UserCardRow {
  card_id: string;
  status: "held" | "closed_in_past_year" | "closed_long_ago";
  opened_at: Date | null;
  closed_at: Date | null;
  bonus_received: boolean;
  card_type: "personal" | "business" | "secured" | "student";
  issuer_id: string;
}

export interface UserSelfReportedRow {
  credit_score_band: CreditScoreBand;
  household_income_band: string | null;
  has_business_income: boolean | null;
  state_code: string | null;
}

export interface UserMembershipRow {
  membership_key: string;
  active: boolean;
}

export interface UserExistingStatusRow {
  status_key: string;
  active: boolean;
}

export interface UserStateSnapshot {
  user_cards: UserCardRow[];
  self_reported: UserSelfReportedRow | null;
  memberships: UserMembershipRow[];
  existing_status: UserExistingStatusRow[];
}

export interface CardForRules {
  id: string;
  display_name: string;
  issuer_id: string;
  card_type: "personal" | "business" | "secured" | "student";
}

export interface ProductFamilyContext {
  family_id: string;
  member_card_ids: string[];
}

export interface RulesContext {
  today: Date;
  card: CardForRules;
  user_state: UserStateSnapshot;
  applicable_rules: RuleRow[];
  product_family: ProductFamilyContext | null;
}

export interface Reason {
  rule_id: string;
  rule_type: RuleType;
  severity: RuleSeverity;
  message: string;
  evidence: Record<string, unknown>;
}

export interface EligibilityResult {
  verdict: Verdict;
  reasons: Reason[];
}
