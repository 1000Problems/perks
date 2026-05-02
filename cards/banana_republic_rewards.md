# Banana Republic Rewards

`card_id`: banana_republic_rewards
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "banana_republic_rewards",
  "name": "Banana Republic Rewards Credit Card",
  "issuer": "Barclays",
  "network": "Closed-loop / Visa",
  "card_type": "personal",
  "category": ["retail_cobrand", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "fair_to_good",
  "currency_earned": "gap_inc_rewards",

  "earning": [
    {"category": "gap_family_brands", "rate_pts_per_dollar": 5, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {"amount_pts": null, "spend_required_usd": null, "spend_window_months": null, "estimated_value_usd": 30},

  "annual_credits": [],
  "ongoing_perks": [],
  "transfer_partners_inherited_from": null,
  "issuer_rules": ["Barclays 6/24"],

  "best_for": ["banana_republic_loyalists"],
  "synergies_with": ["old_navy_navyist", "gap_good_rewards", "athleta_rewards"],
  "competing_with_in_wallet": ["old_navy_navyist"],

  "breakeven_logic_notes": "No AF. Same Gap Inc Rewards system.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://bananarepublic.gap.com/customerService/info.do?cid=1101729"]
}
```

## programs.json / issuer_rules / perks_dedup / destination_perks
See `old_navy_navyist.md`.

## RESEARCH_NOTES.md entries
- Same family card.
