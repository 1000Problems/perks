# Costco Anywhere Visa

`card_id`: costco_anywhere_visa
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "costco_anywhere_visa",
  "name": "Costco Anywhere Visa Card by Citi",
  "issuer": "Citi",
  "network": "Visa",
  "card_type": "personal",
  "category": ["retail_cobrand", "tiered_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "costco_cashback",
  "membership_required": "Costco membership",

  "earning": [
    {"category": "gas_and_ev_charging_worldwide", "rate_pts_per_dollar": 4, "cap_usd_per_year": 7000},
    {"category": "restaurants_worldwide", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "travel_worldwide", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "costco_purchases", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": null,
    "spend_required_usd": null,
    "spend_window_months": null,
    "estimated_value_usd": null,
    "notes": "No traditional SUB on Costco card"
  },

  "annual_credits": [],

  "ongoing_perks": [
    {"name": "Annual cash-back reward (issued as voucher each Feb)", "value_estimate_usd": null, "category": "rewards_payout"},
    {"name": "Auto rental CDW (secondary)", "value_estimate_usd": null, "category": "travel_protection"}
  ],

  "transfer_partners_inherited_from": null,

  "issuer_rules": ["Citi 8/65", "Costco membership required"],

  "best_for": ["Costco_member_with_$7k_plus_annual_gas_spend"],
  "synergies_with": ["citi_strata_premier", "citi_double_cash"],
  "competing_with_in_wallet": [],

  "breakeven_logic_notes": "No AF (Costco membership separately required). 4% on first $7k gas = $280/yr ceiling. 2% Costco at $5k spend = $100. Total cash back potential ~$400-500/yr for active Costco family.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.citi.com/credit-cards/citi-costco-anywhere-visa-credit-card"]
}
```

## programs.json entry

```json
{
  "id": "costco_cashback",
  "name": "Costco Cash Reward (annual voucher)",
  "type": "fixed_value",
  "issuer": "Citi (for Costco)",
  "earning_cards": ["costco_anywhere_visa"],
  "fixed_redemption_cpp": 1.0,
  "transfer_partners": [],
  "sweet_spots": [],
  "redemption_constraint": "Annual voucher mailed in February; redeemable at Costco warehouses for cash or merchandise. Cannot be statement-credited.",
  "sources": ["https://www.citi.com/"]
}
```

## issuer_rules.json entry
See `citi_strata_premier.md`.

## perks_dedup.json entries
None unique.

## destination_perks.json entries
None.

## RESEARCH_NOTES.md entries

- **Visa-only at Costco**: Costco accepts only Visa. Engine should highlight this when user mentions Costco. Cap One Venture X (Visa) and Capital One Quicksilver (Mastercard at point of sale, but Quicksilver Mastercard not accepted at Costco) are alternatives.
- **Annual voucher**: Cannot be earned/used outside this constraint. Engine should flag delayed redemption (vs monthly statement credit cards).
- **Membership**: Cannot apply without Costco membership.
