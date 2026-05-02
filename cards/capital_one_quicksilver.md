# Capital One Quicksilver Rewards

`card_id`: capital_one_quicksilver
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "capital_one_quicksilver",
  "name": "Capital One Quicksilver Cash Rewards",
  "issuer": "Capital One",
  "network": "Mastercard World",
  "card_type": "personal",
  "category": ["flat_rate_cashback", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "capital_one_cashback",

  "earning": [
    {"category": "hotels_rentals_capital_one_travel", "rate_pts_per_dollar": 5, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1.5, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": 20000,
    "spend_required_usd": 500,
    "spend_window_months": 3,
    "estimated_value_usd": 200
  },

  "annual_credits": [],

  "ongoing_perks": [
    {"name": "Auto rental CDW (secondary)", "value_estimate_usd": null, "category": "travel_protection"}
  ],

  "transfer_partners_inherited_from": null,

  "issuer_rules": ["Capital One 1-per-month", "Capital One 2-personal-card-max"],

  "best_for": ["no_AF_simple_1_5_pct_cashback", "Costco_alternative_to_VentureX"],
  "synergies_with": ["capital_one_venture_x"],
  "competing_with_in_wallet": ["chase_freedom_unlimited", "citi_double_cash", "wells_fargo_active_cash"],

  "breakeven_logic_notes": "No AF; 1.5% beats 1% but loses to 2% (Citi DC, WF Active Cash) and 1.5% UR-pairable (CFU). Useful primarily as Costco backup for Mastercard acceptance, but Costco only takes Visa so this point is moot.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.capitalone.com/credit-cards/quicksilver/"]
}
```

## programs.json entry
See `capital_one_savor.md` for capital_one_cashback.

## issuer_rules.json entry
See `capital_one_venture_x.md`.

## perks_dedup.json entries
None unique.

## destination_perks.json entries
None.

## RESEARCH_NOTES.md entries

- **0% FX** + Mastercard worldwide acceptance makes Quicksilver a reasonable secondary international backup for non-bonus spend.
- **Quicksilver Secured / Student variants** exist as separate products (file separately).
