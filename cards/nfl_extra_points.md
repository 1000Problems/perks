# NFL Extra Points Credit Card

`card_id`: nfl_extra_points
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "nfl_extra_points",
  "name": "NFL Extra Points Credit Card",
  "issuer": "Barclays",
  "network": "Visa Signature",
  "card_type": "personal",
  "category": ["retail_cobrand", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good",
  "currency_earned": "nfl_extra_points",

  "earning": [
    {"category": "nfl_purchases", "rate_pts_per_dollar": 4, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {"amount_pts": null, "spend_required_usd": null, "spend_window_months": null, "estimated_value_usd": 100},

  "annual_credits": [],
  "ongoing_perks": [{"name": "Team-specific designs and rewards", "value_estimate_usd": null, "category": "lifestyle"}],
  "transfer_partners_inherited_from": null,
  "issuer_rules": ["Barclays 6/24"],

  "best_for": ["nfl_team_loyalists"],
  "synergies_with": [],
  "competing_with_in_wallet": [],

  "breakeven_logic_notes": "No AF. Niche.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://cards.barclaycardus.com/banking/cards/nfl-extra-points-credit-card/"]
}
```

## programs.json / issuer_rules / perks_dedup / destination_perks
None unique.

## RESEARCH_NOTES.md entries
- Affinity card; sports fans only.
