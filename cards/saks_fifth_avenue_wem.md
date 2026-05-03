# Saks Fifth Avenue World Elite Mastercard

`card_id`: saks_fifth_avenue_wem
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "saks_fifth_avenue_wem",
  "name": "Saks Fifth Avenue World Elite Mastercard", "signal_id": "saks_credit",
  "issuer": "Capital One",
  "network": "Mastercard World Elite",
  "card_type": "personal",
  "category": ["retail_cobrand"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "saks_rewards",

  "earning": [
    {"category": "saks_purchases", "rate_pts_per_dollar": 4, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {"amount_pts": null, "spend_required_usd": null, "spend_window_months": null, "estimated_value_usd": 25, "notes": "$25 reward on first Saks purchase"},

  "annual_credits": [],
  "ongoing_perks": [],
  "transfer_partners_inherited_from": null,
  "issuer_rules": ["Capital One 1-per-month"],

  "best_for": ["luxury_saks_shoppers"],
  "synergies_with": [],
  "competing_with_in_wallet": [],

  "breakeven_logic_notes": "No AF. 4% Saks earnings only meaningful for high-spend luxury shoppers.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.saksfifthavenue.com/c/customer-service/saks-credit-card"]
}
```

## programs.json / issuer_rules / perks_dedup / destination_perks
See `capital_one_venture_x.md` for issuer rules. Otherwise none unique.

## RESEARCH_NOTES.md entries
- Closed-loop reward redemption.
