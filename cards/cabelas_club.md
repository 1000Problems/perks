# Cabela's CLUB Mastercard

`card_id`: cabelas_club
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "cabelas_club",
  "name": "Cabela's CLUB Mastercard",
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
    {"category": "cabelas_bass_pro", "rate_pts_per_dollar": 5, "cap_usd_per_year": null, "notes": "5% at Cabela's, Bass Pro, related brands"},
    {"category": "gas_grocery", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {"amount_pts": null, "spend_required_usd": null, "spend_window_months": null, "estimated_value_usd": null},

  "annual_credits": [],
  "ongoing_perks": [],
  "transfer_partners_inherited_from": null,
  "issuer_rules": ["Capital One 1-per-month"],

  "best_for": ["cabelas_bass_pro_outdoor_loyalist"],
  "synergies_with": ["bass_pro_club"],
  "competing_with_in_wallet": ["bass_pro_club"],

  "breakeven_logic_notes": "No AF. 5% at Cabela's/Bass Pro is competitive for outdoor enthusiasts.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.cabelas.com/category/club-card/"]
}
```

## programs.json entry

```json
{
  "id": "cabelas_club_points",
  "name": "Cabela's/Bass Pro CLUB Points",
  "type": "fixed_value",
  "issuer": "Capital One",
  "earning_cards": ["cabelas_club", "bass_pro_club"],
  "fixed_redemption_cpp": 1.0,
  "redemption_constraint": "Redeemable at Cabela's, Bass Pro, related brands",
  "transfer_partners": [],
  "sweet_spots": [],
  "sources": ["https://www.cabelas.com/"]
}
```

## issuer_rules / perks_dedup / destination_perks
None unique.

## RESEARCH_NOTES.md entries
- Same brand family — Cabela's and Bass Pro are owned by same parent. Engine: treat as identical.
