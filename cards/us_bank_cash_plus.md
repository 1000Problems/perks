# US Bank Cash+

`card_id`: us_bank_cash_plus
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "us_bank_cash_plus",
  "name": "US Bank Cash+ Visa Signature",
  "issuer": "US Bank",
  "network": "Visa Signature",
  "card_type": "personal",
  "category": ["tiered_cashback", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 3,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "us_bank_cashback",

  "earning": [
    {"category": "user_choice_5pct_category_1", "rate_pts_per_dollar": 5, "cap_per_quarter_usd": 2000, "notes": "Choose 1 of 12 categories quarterly: gas, electronics, dept stores, sporting goods, fast food, etc. 5% on first $2k/quarter."},
    {"category": "user_choice_5pct_category_2", "rate_pts_per_dollar": 5, "cap_per_quarter_usd": 2000, "notes": "Same selection structure"},
    {"category": "user_choice_2pct_unlimited", "rate_pts_per_dollar": 2, "cap_usd_per_year": null, "notes": "Choose 1 of: gas/EV, restaurants, grocery"},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {"amount_pts": 20000, "spend_required_usd": 1000, "spend_window_months": 4, "estimated_value_usd": 200},

  "annual_credits": [],

  "ongoing_perks": [],

  "transfer_partners_inherited_from": null,

  "issuer_rules": ["USB 30-day rule", "USB relationship-preferred"],

  "best_for": ["category_chaser_with_specific_spend_buckets", "USB_customer_with_predictable_quarterly_spend"],
  "synergies_with": ["us_bank_smartly", "us_bank_altitude_reserve"],
  "competing_with_in_wallet": ["chase_freedom_flex", "boa_customized_cash"],

  "breakeven_logic_notes": "No AF. 5% on 2 categories with $2k/quarter cap = $400/yr ceiling per category = $800/yr total. Best if user has high-spend categories matching offered bonuses.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.usbank.com/credit-cards/cash-plus-visa-signature-credit-card.html"]
}
```

## programs.json entry
See `us_bank_smartly.md`.

## issuer_rules.json entry
See `us_bank_altitude_reserve.md`.

## perks_dedup.json entries
None unique.

## destination_perks.json entries
None.

## RESEARCH_NOTES.md entries
- 3% FX. Domestic only.
- Best card for user-selected 5% on niche categories not covered by other rotating cards (e.g. fast food, electronics, sporting goods).
