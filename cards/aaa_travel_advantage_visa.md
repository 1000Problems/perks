# AAA Travel Advantage Visa Signature

`card_id`: aaa_travel_advantage_visa
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "aaa_travel_advantage_visa",
  "name": "AAA Travel Advantage Visa Signature Card",
  "issuer": "Bread Financial",
  "network": "Visa Signature",
  "card_type": "personal",
  "category": ["tiered_cashback", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good",
  "currency_earned": "bread_cashback",
  "membership_required": "AAA membership",

  "earning": [
    {"category": "gas_ev", "rate_pts_per_dollar": 5, "cap_usd_per_year": null},
    {"category": "travel_aaa", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "grocery", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {"amount_pts": null, "spend_required_usd": null, "spend_window_months": null, "estimated_value_usd": null},

  "annual_credits": [],
  "ongoing_perks": [],
  "transfer_partners_inherited_from": null,
  "issuer_rules": ["AAA membership required"],

  "best_for": ["aaa_member_road_warrior"],
  "synergies_with": ["aaa_daily_advantage_visa"],
  "competing_with_in_wallet": [],

  "breakeven_logic_notes": "No AF. 5% gas uncapped is class-leading.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.breadfinancial.com/en/products-services/credit-cards/aaa-travel-advantage.html"]
}
```

## programs.json / issuer_rules / perks_dedup / destination_perks
None unique.

## RESEARCH_NOTES.md entries
- Best uncapped gas rate available.
