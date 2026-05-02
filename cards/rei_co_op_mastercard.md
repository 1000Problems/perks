# REI Co-op Mastercard

`card_id`: rei_co_op_mastercard
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "rei_co_op_mastercard",
  "name": "REI Co-op Mastercard",
  "issuer": "Capital One (transitioned from US Bank)",
  "network": "Mastercard",
  "card_type": "personal",
  "category": ["retail_cobrand"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good",
  "currency_earned": "rei_dividend",
  "membership_required": "REI Co-op membership",

  "earning": [
    {"category": "rei_purchases", "rate_pts_per_dollar": 5, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1.5, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": null,
    "spend_required_usd": null,
    "spend_window_months": null,
    "estimated_value_usd": 100,
    "notes": "$100 REI bonus card"
  },

  "annual_credits": [],

  "ongoing_perks": [
    {"name": "REI Co-op Member dividend (10% back on most REI purchases)", "value_estimate_usd": null, "category": "rewards_modifier"}
  ],

  "transfer_partners_inherited_from": null,

  "issuer_rules": ["Capital One 1-per-month"],

  "best_for": ["REI_member_with_outdoor_gear_spend"],
  "synergies_with": [],
  "competing_with_in_wallet": [],

  "breakeven_logic_notes": "No AF. 5% REI + 10% Co-op dividend = effective ~15% return on REI gear. 1.5% on everything else is mediocre.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.rei.com/membership/credit-card"]
}
```

## programs.json entry
Closed-loop REI dividend.

## issuer_rules.json entry
See `capital_one_venture_x.md`.

## perks_dedup.json entries
None unique.

## destination_perks.json entries
None.

## RESEARCH_NOTES.md entries
- 10% Co-op dividend is REI's loyalty program, separate from card earning.
