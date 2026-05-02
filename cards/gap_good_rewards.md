# Gap Good Rewards

`card_id`: gap_good_rewards
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "gap_good_rewards",
  "name": "Gap Good Rewards Credit Card",
  "issuer": "Barclays",
  "network": "Closed-loop / Visa (varies)",
  "card_type": "personal",
  "category": ["retail_cobrand", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "fair_to_good",
  "currency_earned": "gap_inc_rewards",

  "earning": [
    {"category": "gap_family_brands", "rate_pts_per_dollar": 5, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null, "notes": "Visa version only"}
  ],

  "signup_bonus": {"amount_pts": null, "spend_required_usd": null, "spend_window_months": null, "estimated_value_usd": 30},

  "annual_credits": [],
  "ongoing_perks": [],
  "transfer_partners_inherited_from": null,

  "issuer_rules": ["Barclays 6/24"],

  "best_for": ["gap_brand_loyalists"],
  "synergies_with": ["old_navy_navyist", "banana_republic_rewards", "athleta_rewards"],
  "competing_with_in_wallet": ["old_navy_navyist"],

  "breakeven_logic_notes": "No AF. Functionally identical to Old Navy Navyist with same Gap Inc Rewards.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.gap.com/customerService/info.do?cid=1101728"]
}
```

## programs.json / issuer_rules
See `old_navy_navyist.md`.

## perks_dedup / destination_perks
None unique.

## RESEARCH_NOTES.md entries
- Engine: treat all four Gap Inc cards as functionally equivalent; differentiator is co-branding only.
