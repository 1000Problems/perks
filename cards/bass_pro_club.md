# Bass Pro Shops CLUB Mastercard

`card_id`: bass_pro_club
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "bass_pro_club",
  "name": "Bass Pro Shops CLUB Mastercard",
  "issuer": "Capital One",
  "network": "Mastercard",
  "card_type": "personal",
  "category": ["retail_cobrand", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good",
  "currency_earned": "cabelas_club_points",

  "earning": [
    {"category": "cabelas_bass_pro", "rate_pts_per_dollar": 5, "cap_usd_per_year": null},
    {"category": "gas_grocery", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {"amount_pts": null, "spend_required_usd": null, "spend_window_months": null, "estimated_value_usd": null},

  "annual_credits": [],
  "ongoing_perks": [],
  "transfer_partners_inherited_from": null,
  "issuer_rules": ["Capital One 1-per-month"],

  "best_for": ["bass_pro_loyalist"],
  "synergies_with": ["cabelas_club"],
  "competing_with_in_wallet": ["cabelas_club"],

  "breakeven_logic_notes": "Same as Cabela's CLUB.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.basspro.com/shop/en/club-card"]
}
```

See `cabelas_club.md` for shared sections.
