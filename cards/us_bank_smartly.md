# US Bank Smartly

`card_id`: us_bank_smartly
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "us_bank_smartly",
  "name": "US Bank Smartly Visa Signature",
  "issuer": "US Bank",
  "network": "Visa Signature",
  "card_type": "personal",
  "category": ["flat_rate_cashback", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "us_bank_cashback",

  "earning": [
    {"category": "everything_else", "rate_pts_per_dollar": 2, "cap_usd_per_year": null, "notes": "Up to 4% with US Bank Smartly Savings tiers (asset-based bonuses similar to BoA Preferred Rewards)"}
  ],

  "earning_modifier_smartly_savings": "USB Smartly Savings tiers based on combined deposit/investment balances: $5k-$50k = +0.5% (2.5% total); $50k-$100k = +1% (3%); $100k+ = +2% (4%). Verify current tier structure.",

  "signup_bonus": {
    "amount_pts": 20000,
    "spend_required_usd": 1500,
    "spend_window_months": 3,
    "estimated_value_usd": 200
  },

  "annual_credits": [],

  "ongoing_perks": [
    {"name": "Auto rental CDW (secondary)", "value_estimate_usd": null, "category": "travel_protection"}
  ],

  "transfer_partners_inherited_from": null,

  "issuer_rules": ["USB 30-day rule", "USB relationship-preferred"],

  "best_for": ["USB_savings_relationship_holders_4pct", "tech_savvy_USB_customers"],
  "synergies_with": ["us_bank_altitude_reserve", "us_bank_altitude_connect"],
  "competing_with_in_wallet": ["citi_double_cash", "wells_fargo_active_cash", "boa_unlimited_cash_rewards"],

  "breakeven_logic_notes": "No AF. At base 2%, ties Citi DC. With $100k+ at USB Smartly Savings → 4% on everything = top no-AF return ceiling.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.usbank.com/credit-cards/smartly-visa-signature-card.html"]
}
```

## programs.json entry

```json
{
  "id": "us_bank_cashback",
  "name": "US Bank Cashback (Smartly family)",
  "type": "fixed_value",
  "issuer": "US Bank",
  "earning_cards": ["us_bank_smartly"],
  "fixed_redemption_cpp": 1.0,
  "transfer_partners": [],
  "sweet_spots": [],
  "sources": ["https://www.usbank.com/"]
}
```

## issuer_rules.json entry
See `us_bank_altitude_reserve.md`.

## perks_dedup.json entries
None unique.

## destination_perks.json entries
None.

## RESEARCH_NOTES.md entries

- **Smartly Savings tiers**: Engine should ask user about USB deposit/investment balances. The 4% tier requires $100k.
- Best new no-AF flat-rate card released in years for affluent USB customers.
