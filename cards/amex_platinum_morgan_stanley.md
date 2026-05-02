# Amex Platinum for Morgan Stanley

`card_id`: amex_platinum_morgan_stanley
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "amex_platinum_morgan_stanley",
  "name": "American Express Platinum Card for Morgan Stanley",
  "issuer": "Amex (with Morgan Stanley brokerage relationship)",
  "network": "Amex",
  "card_type": "personal",
  "category": ["premium_travel", "investment_cobrand"],
  "annual_fee_usd": 895,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "excellent",
  "currency_earned": "amex_mr",

  "earning": [
    {"category": "flights_direct_or_amex_travel", "rate_pts_per_dollar": 5, "cap_usd_per_year": 500000},
    {"category": "prepaid_hotels_amex_travel", "rate_pts_per_dollar": 5, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": 80000,
    "spend_required_usd": 8000,
    "spend_window_months": 6,
    "estimated_value_usd": 1600
  },

  "annual_credits": [
    {"name": "$695 Engagement Bonus + standard Plat credits", "value_usd": 695, "type": "specific", "expiration": "annual_anniversary", "ease_of_use": "medium", "notes": "MS-specific engagement bonus on top of standard Plat credits"},
    {"name": "Standard Amex Platinum credits", "value_usd": 2200, "type": "mixed", "expiration": "monthly_or_split", "ease_of_use": "medium"}
  ],

  "ongoing_perks": [
    {"name": "All standard Plat lounge/status perks", "value_estimate_usd": null, "category": "lounge_access"},
    {"name": "MS Reserved+ benefits", "value_estimate_usd": null, "category": "investment_perk"}
  ],

  "transfer_partners_inherited_from": "amex_mr",

  "issuer_rules": ["Amex once-per-lifetime SUB", "Requires Morgan Stanley CashPlus or other qualifying account"],

  "best_for": ["morgan_stanley_client_seeking_engagement_bonus"],
  "synergies_with": ["amex_gold"],
  "competing_with_in_wallet": ["amex_platinum", "amex_platinum_schwab"],

  "breakeven_logic_notes": "Same Plat AF/credits + $695 engagement bonus = effective AF reduction. Engine: surface for MS clients only.",

  "recently_changed": true,
  "recently_changed_date": "2025-09-29",
  "data_freshness": "2026-05-01",
  "sources": ["https://www.americanexpress.com/us/credit-cards/card/platinum-morgan-stanley/"]
}
```

## programs.json entry
See `amex_gold.md`.

## issuer_rules.json entry
See `amex_gold.md`.

## perks_dedup.json entries
See `amex_platinum.md`.

## destination_perks.json entries
See `amex_platinum.md`.

## RESEARCH_NOTES.md entries
- **$695 Engagement Bonus** is the differentiator vs personal Platinum — for MS clients, makes net AF effectively $200.
