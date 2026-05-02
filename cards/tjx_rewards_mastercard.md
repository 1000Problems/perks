# TJX Rewards Mastercard

`card_id`: tjx_rewards_mastercard
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "tjx_rewards_mastercard",
  "name": "TJX Rewards Mastercard",
  "issuer": "Synchrony",
  "network": "Mastercard",
  "card_type": "personal",
  "category": ["retail_cobrand", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 3,
  "credit_score_required": "good",
  "currency_earned": "tjx_rewards",

  "earning": [
    {"category": "tjx_brands_tj_maxx_marshalls_homegoods_homesense_sierra", "rate_pts_per_dollar": 5, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {"amount_pts": null, "spend_required_usd": null, "spend_window_months": null, "estimated_value_usd": 10, "notes": "Often 10% off first day"},

  "annual_credits": [],
  "ongoing_perks": [],
  "transfer_partners_inherited_from": null,
  "issuer_rules": [],

  "best_for": ["tj_maxx_marshalls_loyalists"],
  "synergies_with": [],
  "competing_with_in_wallet": ["tjx_rewards_credit_card"],

  "breakeven_logic_notes": "No AF. 5% at TJX brands. Mastercard version earns 1% elsewhere; closed-loop earns 0%.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://tjxrewards.com/"]
}
```

## programs.json entry
Closed-loop TJX Rewards.

## issuer_rules / perks_dedup / destination_perks
None unique.

## RESEARCH_NOTES.md entries
- 3% FX. Domestic only.
