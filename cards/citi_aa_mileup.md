# Citi AAdvantage MileUp

`card_id`: citi_aa_mileup
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "citi_aa_mileup",
  "name": "Citi AAdvantage MileUp Card",
  "issuer": "Citi",
  "network": "Mastercard",
  "card_type": "personal",
  "category": ["airline_cobrand", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 3,
  "credit_score_required": "good",
  "currency_earned": "aa_aadvantage",

  "earning": [
    {"category": "grocery_supermarket", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "american_airlines_purchases", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": 10000,
    "spend_required_usd": 500,
    "spend_window_months": 3,
    "estimated_value_usd": 150,
    "notes": "Plus $50 statement credit in some offers"
  },

  "annual_credits": [],

  "ongoing_perks": [
    {"name": "25% back on inflight purchases", "value_estimate_usd": null, "category": "airline_perk"},
    {"name": "Loyalty Points contribute toward AA elite status", "value_estimate_usd": null, "category": "elite_status"}
  ],

  "transfer_partners_inherited_from": null,

  "issuer_rules": ["Citi AA 48-month bonus rule"],

  "best_for": ["no_AF_AA_starter_with_grocery_2x"],
  "synergies_with": ["citi_aa_platinum"],
  "competing_with_in_wallet": ["citi_aa_platinum"],

  "breakeven_logic_notes": "No AF. No bag perk. Engine: rare to recommend over Platinum which has Y1-waived AF + bag.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.citi.com/credit-cards/citi-aadvantage-mileup-credit-card"]
}
```

## programs.json entry
See `citi_aa_platinum.md`.

## issuer_rules.json entry
See `citi_strata_premier.md`.

## perks_dedup.json entries
None unique.

## destination_perks.json entries
See `citi_aa_platinum.md`.

## RESEARCH_NOTES.md entries
- 3% FX. Domestic only. Limited utility.
