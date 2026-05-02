# Capital One Quicksilver Secured

`card_id`: capital_one_quicksilver_secured
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "capital_one_quicksilver_secured",
  "name": "Capital One Quicksilver Secured Cash Rewards",
  "issuer": "Capital One",
  "network": "Mastercard",
  "card_type": "personal",
  "category": ["secured", "credit_building"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "limited_or_rebuilding",
  "secured_deposit_required": "$200_minimum",
  "currency_earned": "capital_one_cashback",

  "earning": [
    {"category": "everything_else", "rate_pts_per_dollar": 1.5, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": null,
    "spend_required_usd": null,
    "spend_window_months": null,
    "estimated_value_usd": null
  },

  "annual_credits": [],

  "ongoing_perks": [
    {"name": "Path to upgrade to unsecured Quicksilver after responsible use", "value_estimate_usd": null, "category": "credit_building"}
  ],

  "transfer_partners_inherited_from": null,

  "issuer_rules": ["Capital One 1-per-month"],

  "best_for": ["building_credit_with_existing_negative_history", "secured_card_with_actual_rewards"],
  "synergies_with": ["capital_one_quicksilver"],
  "competing_with_in_wallet": ["discover_it_secured", "capital_one_platinum_secured"],

  "breakeven_logic_notes": "No AF; secured deposit refundable. Earning 1.5% is rare for secured cards.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.capitalone.com/credit-cards/quicksilver-secured/"]
}
```

## programs.json entry
See `capital_one_savor.md` for capital_one_cashback.

## issuer_rules.json entry
See `capital_one_venture_x.md`.

## perks_dedup.json entries
None unique.

## destination_perks.json entries
None.

## RESEARCH_NOTES.md entries
- One of the few secured cards earning rewards beyond 1%.
- Capital One graduates secured-to-unsecured conversion automatically after 6+ months of responsible use, refunding deposit.
