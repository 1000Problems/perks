# US Bank Shopper Cash Rewards

`card_id`: us_bank_shopper_cash_rewards
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "us_bank_shopper_cash_rewards",
  "name": "US Bank Shopper Cash Rewards Visa Signature",
  "issuer": "US Bank",
  "network": "Visa Signature",
  "card_type": "personal",
  "category": ["tiered_cashback", "no_af_cashback"],
  "annual_fee_usd": 95,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 3,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "us_bank_cashback",

  "earning": [
    {"category": "user_choice_two_retailers_6pct", "rate_pts_per_dollar": 6, "cap_per_quarter_usd": 1500, "notes": "Pick 2 of: Amazon, Target, Walmart, Apple, Macy's, Nordstrom, Best Buy, etc. 6% on first $1,500/quarter combined."},
    {"category": "wholesale_clubs_kids_apparel_dept_stores", "rate_pts_per_dollar": 3, "cap_per_quarter_usd": 1500},
    {"category": "everything_else", "rate_pts_per_dollar": 1.5, "cap_usd_per_year": null}
  ],

  "signup_bonus": {"amount_pts": 25000, "spend_required_usd": 2000, "spend_window_months": 4, "estimated_value_usd": 250},

  "annual_credits": [],
  "ongoing_perks": [],
  "transfer_partners_inherited_from": null,
  "issuer_rules": ["USB 30-day rule"],

  "best_for": ["online_shopper_with_$6k_plus_at_specific_retailers"],
  "synergies_with": [],
  "competing_with_in_wallet": ["us_bank_cash_plus", "boa_customized_cash"],

  "breakeven_logic_notes": "AF $95. 6% on $1,500/quarter = $90/quarter = $360/yr ceiling per retailer. Two retailers can yield $720/yr ceiling. AF justified for users who max categories.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.usbank.com/credit-cards/shopper-cash-rewards-visa-signature-credit-card.html"]
}
```

## programs.json / issuer_rules / perks_dedup / destination_perks
None unique. See `us_bank_altitude_reserve.md` for issuer rules.

## RESEARCH_NOTES.md entries
- 3% FX. Domestic-only.
- Stack with Cap One Walmart at Walmart for higher effective rate, etc.
