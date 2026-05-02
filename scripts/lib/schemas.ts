// Zod schemas for the card database. Used both by the compiler (to
// validate markdown contributions) and by the runtime loader (defense in
// depth — catches the case where someone edits data/*.json by hand).

import { z } from "zod";

// ── shared primitives ───────────────────────────────────────────────────

const Url = z.string().url();
const IsoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "expected YYYY-MM-DD");

// ── cards.json ─────────────────────────────────────────────────────────

const EarningRule = z.object({
  category: z.string(),
  rate_pts_per_dollar: z.number().nullable(),
  cap_usd_per_year: z.number().nullable().optional(),
  notes: z.string().nullable().optional(),
});

const SignupBonus = z.object({
  amount_pts: z.number().nullable(),
  spend_required_usd: z.number().nullable(),
  spend_window_months: z.number().nullable(),
  estimated_value_usd: z.number().nullable(),
  notes: z.string().nullable().optional(),
});

const AnnualCredit = z.object({
  name: z.string(),
  value_usd: z.number().nullable().optional(),
  type: z.string().nullable().optional(),
  expiration: z.string().nullable().optional(),
  ease_of_use: z
    .enum(["easy", "medium", "hard", "coupon_book"])
    .default("medium"), // missing-grade falls back to a moderate 0.75 multiplier
  notes: z.string().nullable().optional(),
});

const OngoingPerk = z.object({
  name: z.string(),
  value_estimate_usd: z.number().nullable().optional(),
  category: z.string(),
  notes: z.string().nullable().optional(),
});

export const CardSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    issuer: z.string(),
    network: z.string().optional(),
    card_type: z.enum(["personal", "business", "secured", "student"]),
    category: z.array(z.string()),
    // null for invite-only / unknown-fee cards. Engine treats null as 0.
    annual_fee_usd: z.number().nullable(),
    annual_fee_first_year_waived: z.boolean().optional(),
    foreign_tx_fee_pct: z.number().nullable().optional(),
    credit_score_required: z.string().optional(),
    // null for no-rewards cards (secured, 0% APR builders, balance-transfer).
    currency_earned: z.string().nullable(),
    // Free-text gate that has to be satisfied before applying — Costco /
    // Amazon Prime / Sam's Club / NFCU / USAA / etc. The eligibility
    // engine cross-references this against the user's brands_used list to
    // decide whether to surface a yellow membership flag.
    membership_required: z.string().nullable().optional(),
    earning: z.array(EarningRule),
    signup_bonus: SignupBonus.optional().nullable(),
    annual_credits: z.array(AnnualCredit).default([]),
    ongoing_perks: z.array(OngoingPerk).default([]),
    transfer_partners_inherited_from: z.string().optional().nullable(),
    issuer_rules: z.array(z.string()).default([]),
    best_for: z.array(z.string()).default([]),
    synergies_with: z.array(z.string()).default([]),
    competing_with_in_wallet: z.array(z.string()).default([]),
    breakeven_logic_notes: z.string().optional(),
    recently_changed: z.boolean().optional(),
    closed_to_new_apps: z.boolean().optional(),
    data_freshness: IsoDate.optional(),
    sources: z.array(Url).default([]),
  });

export type Card = z.infer<typeof CardSchema>;

// ── programs.json ──────────────────────────────────────────────────────

const TransferPartner = z.object({
  partner: z.string(),
  ratio: z.string(),
  type: z.enum(["airline", "hotel", "other"]),
  min_transfer: z.number().nullable().optional(),
  notes: z.string().nullable().optional(),
});

const SweetSpot = z.object({
  description: z.string(),
  value_estimate_usd: z.union([z.number(), z.string(), z.null()]).optional(),
  source: z.string().nullable().optional(),
});

export const ProgramSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    type: z.string(), // commonly transferable | fixed_value | cobrand_airline | cobrand_hotel — kept open for variants
    issuer: z.string(),
    earning_cards: z.array(z.string()).default([]),
    fixed_redemption_cpp: z.number().nullable().optional(),
    portal_redemption_cpp: z.number().nullable().optional(),
    portal_redemption_cpp_notes: z.string().nullable().optional(),
    transfer_partners: z.array(TransferPartner).default([]),
    sweet_spots: z.array(SweetSpot).default([]),
    sources: z.array(Url).default([]),
  });

export type Program = z.infer<typeof ProgramSchema>;

// ── issuer_rules.json ──────────────────────────────────────────────────

const IssuerRule = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  applies_to: z.union([z.string(), z.array(z.string())]).optional(),
  official: z.boolean().optional(),
  notes: z.string().optional(),
});

export const IssuerRulesSchema = z.object({
  issuer: z.string(),
  rules: z.array(IssuerRule),
});

export type IssuerRules = z.infer<typeof IssuerRulesSchema>;

// ── perks_dedup.json ───────────────────────────────────────────────────

export const PerksDedupEntrySchema = z.object({
  perk: z.string(),
  card_ids: z.array(z.string()),
  value_if_unique_usd: z.union([z.number(), z.string(), z.null()]),
  value_if_duplicate_usd: z.union([z.number(), z.string(), z.null()]),
  notes: z.string().nullable().optional(),
});

export type PerksDedupEntry = z.infer<typeof PerksDedupEntrySchema>;

// ── destination_perks.json ─────────────────────────────────────────────

export const DestinationPerkSchema = z.object({
  hotel_chains_strong: z.array(z.string()).optional(),
  airline_routes_strong: z.array(z.string()).optional(),
  relevant_cards: z.array(z.string()),
  notes: z.string().optional(),
});

export type DestinationPerk = z.infer<typeof DestinationPerkSchema>;
