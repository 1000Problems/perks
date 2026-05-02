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
    // Cash vs loyalty currency. When omitted in markdown the build script
    // derives it from `type` and `transfer_partners` — see
    // scripts/build-card-db.ts. Loader sees a populated value every time.
    kind: z.enum(["cash", "loyalty"]).optional(),
    fixed_redemption_cpp: z.number().nullable().optional(),
    portal_redemption_cpp: z.number().nullable().optional(),
    portal_redemption_cpp_notes: z.string().nullable().optional(),
    transfer_partners: z.array(TransferPartner).default([]),
    // Card IDs that, when present in the wallet, unlock loyalty-mode
    // earning for every card in this program. Empty list means "every
    // earning card unlocks transfers" (cobrand currencies, plus fully
    // open transferable currencies like Capital One Miles and Bilt). For
    // gated currencies (chase_ur, amex_mr, citi_thankyou) this is the
    // strict subset of cards that grant transfer access — e.g. CSP/CSR/IBP
    // for chase_ur. CFU/CFF/CFR earn UR but do not appear in this list,
    // so they earn cash unless the wallet contains a Sapphire/Ink Preferred.
    transfer_unlock_card_ids: z.array(z.string()).default([]),
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

// ── card_soul.* (rich enrichment, optional per card) ───────────────────
//
// See docs/SOUL_SCHEMA_PROPOSAL.md for the full design. These sections
// are additive: cards without soul stay valid. The migrate script
// prefers soul data when present and falls back to the basic shapes
// (annual_credits, ongoing_perks) above.

const Confidence = z.enum(["high", "medium", "low", "no_source"]);
const CreditScoreBand = z.enum([
  "building",
  "fair",
  "good",
  "very_good",
  "excellent",
  "unknown",
]);
const CreditPeriod = z.enum([
  "calendar_year",
  "anniversary_year",
  "monthly",
  "quarterly",
  "split_h1_h2",
  "every_4_years",
  "every_5_years",
]);

// Coverage kinds — must match the controlled vocab the migrate script
// fans out to perks_card_insurance rows. Adding a new kind: extend this
// enum AND the SOUL_SCHEMA_PROPOSAL.md doc.
const CoverageKind = z.enum([
  "auto_rental_cdw",
  "trip_cancellation_interruption",
  "trip_delay",
  "baggage_delay",
  "lost_baggage",
  "cell_phone_protection",
  "emergency_evacuation_medical",
  "emergency_medical_dental",
  "travel_accident_insurance",
  "purchase_protection",
  "extended_warranty",
  "return_protection",
  "roadside_assistance",
]);

export const SoulCreditScoreSchema = z.object({
  band: CreditScoreBand,
  source: z.string().optional(),
  confidence: Confidence.default("medium"),
  notes: z.string().optional(),
});

export const SoulAnnualCreditSchema = z.object({
  name: z.string(),
  face_value_usd: z.number().nullable(),
  period: CreditPeriod.optional(),
  ease_score: z.number().int().min(1).max(5),
  realistic_redemption_pct: z.number().min(0).max(1),
  enrollment_required: z.boolean().optional(),
  qualifying_purchases_open_ended: z.boolean().optional(),
  expires_if_unused: z.boolean().optional().default(true),
  stackable_with_other_credits: z.boolean().optional().default(false),
  qualifying_spend: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  source: z.string().optional(),
  confidence: Confidence.default("medium"),
});

// One coverage block. Per-coverage-kind fields are open (different
// kinds have different shapes — trip_delay has threshold_hours,
// auto_rental_cdw has coverage_type, etc). The whole inner object lands
// in the Postgres `config` jsonb column verbatim.
const SoulCoverageBlockSchema = z
  .object({
    available: z.boolean(),
    source: z.string().optional(),
    confidence: Confidence.default("medium"),
    notes: z.string().optional(),
  })
  .passthrough();

// Top-level: keys are CoverageKind values. Two reserved sibling keys
// (primary_source_url, gtb_pdf_url) are URL strings, not coverage blocks.
export const SoulInsuranceSchema = z.object({
  primary_source_url: z.string().nullable().optional(),
  gtb_pdf_url: z.string().nullable().optional(),
  // The below are all optional; cards may have any subset documented.
  auto_rental_cdw: SoulCoverageBlockSchema.optional(),
  trip_cancellation_interruption: SoulCoverageBlockSchema.optional(),
  trip_delay: SoulCoverageBlockSchema.optional(),
  baggage_delay: SoulCoverageBlockSchema.optional(),
  lost_baggage: SoulCoverageBlockSchema.optional(),
  cell_phone_protection: SoulCoverageBlockSchema.optional(),
  emergency_evacuation_medical: SoulCoverageBlockSchema.optional(),
  emergency_medical_dental: SoulCoverageBlockSchema.optional(),
  travel_accident_insurance: SoulCoverageBlockSchema.optional(),
  purchase_protection: SoulCoverageBlockSchema.optional(),
  extended_warranty: SoulCoverageBlockSchema.optional(),
  return_protection: SoulCoverageBlockSchema.optional(),
  roadside_assistance: SoulCoverageBlockSchema.optional(),
});

export const SoulProgramAccessEntrySchema = z.object({
  program_id: z.string(),
  access_kind: z.enum([
    "included",
    "not_available",
    "inherited_via_pp",
    "spend_unlock",
    "conditional",
  ]),
  overrides: z.record(z.unknown()).optional().default({}),
  notes: z.string().optional(),
  source: z.string().optional(),
  confidence: Confidence.default("medium"),
});

const HotelStatusGrantSchema = z.object({
  program: z.string(),
  tier: z.string(),
  auto_grant: z.boolean(),
  via_spend_threshold: z.number().nullable().optional(),
  valid_through: z.union([z.string(), z.null()]).optional(),
  source: z.string().optional(),
  confidence: Confidence.default("medium"),
});

const RentalStatusGrantSchema = z.object({
  program: z.string(),
  tier: z.string(),
  auto_grant: z.boolean(),
  source: z.string().optional(),
  confidence: Confidence.default("medium"),
  notes: z.string().optional(),
});

// Co-brand perks live in a single object keyed by named perk groups.
// The migrate script fans this out — each top-level key becomes one
// or more perk_kind rows in card_co_brand_perks. `passthrough` keeps
// us flexible for new groups added in future enrichment passes.
export const SoulCoBrandPerksSchema = z
  .object({
    hotel_status_grants: z.array(HotelStatusGrantSchema).optional(),
    rental_status_grants: z.array(RentalStatusGrantSchema).optional(),
    prepaid_hotel_credit: z.record(z.unknown()).nullable().optional(),
    free_night_certificates: z.array(z.record(z.unknown())).optional(),
    complimentary_dashpass: z.record(z.unknown()).nullable().optional(),
    ten_pct_anniversary_bonus: z.record(z.unknown()).nullable().optional(),
    spend_threshold_lounge_unlock: z.record(z.unknown()).nullable().optional(),
    welcome_offer_current_public: z.record(z.unknown()).nullable().optional(),
    additional_cardholders: z.record(z.unknown()).nullable().optional(),
    membership_rewards_pay_with_points: z.boolean().optional(),
    points_boost_redemption: z.record(z.unknown()).nullable().optional(),
    dashpass_grocery_retail_promo: z.record(z.unknown()).nullable().optional(),
    premier_collection_experience_credit: z.record(z.unknown()).nullable().optional(),
    lifestyle_collection_experience_credit: z.record(z.unknown()).nullable().optional(),
    authorized_user_lounge_fee: z.record(z.unknown()).nullable().optional(),
    guest_pricing_fallback: z.record(z.unknown()).nullable().optional(),
    uber_one_2026_limited_time_credit: z.record(z.unknown()).nullable().optional(),
    additional_cards: z.record(z.unknown()).nullable().optional(),
  })
  .passthrough();

export const SoulAbsentPerkSchema = z.object({
  perk_key: z.string(),
  reason: z.string(),
  workaround: z.string().optional(),
  confidence: Confidence.default("medium"),
});

// The full bundle. Each field optional; a card with only credit_score
// populated is still a valid soul block.
export const SoulSchema = z.object({
  credit_score: SoulCreditScoreSchema.optional(),
  annual_credits: z.array(SoulAnnualCreditSchema).optional(),
  insurance: SoulInsuranceSchema.optional(),
  program_access: z.array(SoulProgramAccessEntrySchema).optional(),
  co_brand_perks: SoulCoBrandPerksSchema.optional(),
  absent_perks: z.array(SoulAbsentPerkSchema).optional(),
  fetch_log: z.string().optional(), // free-form, not persisted
});

export type SoulCreditScore = z.infer<typeof SoulCreditScoreSchema>;
export type SoulAnnualCredit = z.infer<typeof SoulAnnualCreditSchema>;
export type SoulInsurance = z.infer<typeof SoulInsuranceSchema>;
export type SoulProgramAccessEntry = z.infer<typeof SoulProgramAccessEntrySchema>;
export type SoulCoBrandPerks = z.infer<typeof SoulCoBrandPerksSchema>;
export type SoulAbsentPerk = z.infer<typeof SoulAbsentPerkSchema>;
export type Soul = z.infer<typeof SoulSchema>;
