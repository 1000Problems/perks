# Carnival World Mastercard

`card_id`: carnival_world_mastercard
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "carnival_world_mastercard",
  "name": "Carnival World Mastercard",
  "issuer": "Barclays",
  "network": "Mastercard World",
  "card_type": "personal",
  "category": ["cruise_cobrand", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good",
  "currency_earned": "carnival_funpoints",

  "earning": [
    {"category": "carnival_purchases", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {"amount_pts": null, "spend_required_usd": null, "spend_window_months": null, "estimated_value_usd": 100},

  "annual_credits": [],
  "ongoing_perks": [],
  "transfer_partners_inherited_from": null,
  "issuer_rules": ["Barclays 6/24"],

  "best_for": ["carnival_cruisers"],
  "synergies_with": ["princess_cruises_visa", "holland_america_visa"],
  "competing_with_in_wallet": [],

  "breakeven_logic_notes": "No AF. 0% FX is a plus.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://cards.barclaycardus.com/banking/cards/carnival-world-mastercard/"]
}
```

## programs.json / issuer_rules / perks_dedup / destination_perks
None unique. See `jetblue_plus.md` for Barclays.

## RESEARCH_NOTES.md entries
- Niche cruise card. Carnival, Princess, Holland America cards share parent (Carnival Corp).
