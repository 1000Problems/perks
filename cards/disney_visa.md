# Chase Disney Visa Card

`card_id`: disney_visa
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "disney_visa",
  "name": "Chase Disney Visa Card",
  "issuer": "Chase",
  "network": "Visa",
  "card_type": "personal",
  "category": ["retail_cobrand", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 3,
  "credit_score_required": "good",
  "currency_earned": "disney_rewards",

  "earning": [
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null, "notes": "1% Disney Rewards Dollars"}
  ],

  "signup_bonus": {
    "amount_pts": null,
    "spend_required_usd": null,
    "spend_window_months": null,
    "estimated_value_usd": 200,
    "notes": "Often $200 statement credit"
  },

  "annual_credits": [],

  "ongoing_perks": [
    {"name": "10% off select Disney store/online purchases", "value_estimate_usd": null, "category": "lifestyle"},
    {"name": "Disney character meet-and-greet at parks", "value_estimate_usd": null, "category": "lifestyle"},
    {"name": "Special financing on Disney vacations", "value_estimate_usd": null, "category": "financing"}
  ],

  "transfer_partners_inherited_from": null,

  "issuer_rules": ["Chase 5/24"],

  "best_for": ["disney_park_family_for_perks"],
  "synergies_with": ["disney_premier_visa"],
  "competing_with_in_wallet": [],

  "breakeven_logic_notes": "No AF. 1% earning is uncompetitive. Value is in Disney park perks, not earnings.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://disneyrewards.com/cards/disney-visa-card/"]
}
```

## programs.json entry

```json
{
  "id": "disney_rewards",
  "name": "Disney Rewards Dollars",
  "type": "fixed_value",
  "issuer": "Chase",
  "earning_cards": ["disney_visa", "disney_premier_visa"],
  "fixed_redemption_cpp": 1.0,
  "transfer_partners": [],
  "sweet_spots": [],
  "redemption_constraint": "Redeem against Disney purchases at parks, store, online; cannot statement-credit",
  "sources": ["https://disneyrewards.com/"]
}
```

## issuer_rules.json entry
See `chase_sapphire_preferred.md`.

## perks_dedup.json entries
None unique.

## destination_perks.json entries

```json
{
  "disney_parks": {
    "relevant_cards": ["disney_visa", "disney_premier_visa"],
    "notes": "Disney visa cardholders get character meet-and-greets, store discounts, vacation financing. Engine: surface for users mentioning Disney trips."
  }
}
```

## RESEARCH_NOTES.md entries
- 3% FX. 1% earning. Value purely in Disney experience perks.
