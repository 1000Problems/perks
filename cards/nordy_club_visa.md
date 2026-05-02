# Nordy Club Visa Signature

`card_id`: nordy_club_visa
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "nordy_club_visa",
  "name": "The Nordy Club Visa Signature Credit Card",
  "issuer": "TD Bank (Nordstrom co-brand)",
  "network": "Visa Signature",
  "card_type": "personal",
  "category": ["retail_cobrand", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "nordy_club_points",

  "earning": [
    {"category": "nordstrom_brands_inc_rack", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 2, "cap_usd_per_year": null}
  ],

  "signup_bonus": {"amount_pts": null, "spend_required_usd": null, "spend_window_months": null, "estimated_value_usd": 60, "notes": "$60 Nordstrom Note on first purchase"},

  "annual_credits": [],
  "ongoing_perks": [
    {"name": "Triple points days, alterations and tailoring credits", "value_estimate_usd": null, "category": "lifestyle"}
  ],
  "transfer_partners_inherited_from": null,
  "issuer_rules": [],

  "best_for": ["nordstrom_loyalists_seeking_card_usable_outside"],
  "synergies_with": ["nordstrom_credit"],
  "competing_with_in_wallet": ["nordstrom_credit"],

  "breakeven_logic_notes": "No AF, 0% FX, 2% baseline. Better outside-Nordstrom rate than other store-brand cards.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.nordstrom.com/nordstrom-credit-card"]
}
```

## programs.json entry
Closed-loop Nordy Club points; redeemable as Nordstrom Notes.

## issuer_rules / perks_dedup / destination_perks
None unique.

## RESEARCH_NOTES.md entries
- 2% non-Nordstrom rate is the highest among major store-brand Visa cards.
