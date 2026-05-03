# Amex Delta SkyMiles Blue

`card_id`: delta_skymiles_blue
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "delta_skymiles_blue",
  "name": "Amex Delta SkyMiles Blue Card",
  "issuer": "Amex",
  "network": "Amex",
  "card_type": "personal",
  "category": ["airline_cobrand", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "delta_skymiles",

  "earning": [
    {"category": "delta_purchases", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "restaurants_worldwide", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": 10000,
    "spend_required_usd": 1000,
    "spend_window_months": 6,
    "estimated_value_usd": 120
  },

  "annual_credits": [],

  "ongoing_perks": [
    {"name": "20% off inflight purchases", "value_estimate_usd": null, "category": "airline_perk"}
  ],

  "transfer_partners_inherited_from": null,

  "issuer_rules": ["Amex once-per-lifetime SUB"],

  "best_for": ["no_AF_delta_starter"],
  "synergies_with": ["delta_skymiles_gold"],
  "competing_with_in_wallet": ["delta_skymiles_gold"],

  "breakeven_logic_notes": "No AF. No bag perk. Engine should rarely surface — Gold ($150 AF, Y1 free) supersedes for occasional Delta flyers.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.americanexpress.com/us/credit-cards/card/delta-skymiles-blue/"],

  "is_cobrand": true
}
```

## programs.json entry
See `delta_skymiles_gold.md`.

## issuer_rules.json entry
See `amex_gold.md`.

## perks_dedup.json entries
None unique.

## destination_perks.json entries
See `delta_skymiles_gold.md`.

## RESEARCH_NOTES.md entries
- Entry-tier no-AF Delta. Limited utility.
