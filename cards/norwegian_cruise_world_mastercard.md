# Norwegian Cruise Line World Mastercard

`card_id`: norwegian_cruise_world_mastercard
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "norwegian_cruise_world_mastercard",
  "name": "Norwegian Cruise Line World Mastercard",
  "issuer": "Bank of America",
  "network": "Mastercard World",
  "card_type": "personal",
  "category": ["cruise_cobrand", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 3,
  "credit_score_required": "good",
  "currency_earned": "ncl_points",

  "earning": [
    {"category": "ncl_purchases_dining_grocery", "rate_pts_per_dollar": 3, "cap_usd_per_year": null, "notes": "Verify category structure"},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {"amount_pts": null, "spend_required_usd": null, "spend_window_months": null, "estimated_value_usd": 100},

  "annual_credits": [],
  "ongoing_perks": [],
  "transfer_partners_inherited_from": null,
  "issuer_rules": ["BoA 2/3/4"],

  "best_for": ["norwegian_cruise_loyalists"],
  "synergies_with": [],
  "competing_with_in_wallet": [],

  "breakeven_logic_notes": "No AF. Niche cruise card.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.bankofamerica.com/credit-cards/products/norwegian-cruise-line-credit-card/"]
}
```

## programs.json / issuer_rules / perks_dedup / destination_perks
None unique. See `boa_premium_rewards.md`.

## RESEARCH_NOTES.md entries
- 3% FX. Niche.
