# Holland America Line Rewards Visa

`card_id`: holland_america_visa
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "holland_america_visa",
  "name": "Holland America Line Rewards Visa Card",
  "issuer": "Barclays",
  "network": "Visa",
  "card_type": "personal",
  "category": ["cruise_cobrand", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good",
  "currency_earned": "hal_rewards",

  "earning": [
    {"category": "hal_purchases", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {"amount_pts": null, "spend_required_usd": null, "spend_window_months": null, "estimated_value_usd": 100},

  "annual_credits": [],
  "ongoing_perks": [],
  "transfer_partners_inherited_from": null,
  "issuer_rules": ["Barclays 6/24"],

  "best_for": ["holland_america_cruisers"],
  "synergies_with": ["princess_cruises_visa", "carnival_world_mastercard"],
  "competing_with_in_wallet": [],

  "breakeven_logic_notes": "No AF.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://cards.barclaycardus.com/banking/cards/holland-america-line-rewards-visa-card/"]
}
```

See `princess_cruises_visa.md` for class context.
