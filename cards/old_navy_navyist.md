# Old Navy Navyist Rewards

`card_id`: old_navy_navyist
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "old_navy_navyist",
  "name": "Old Navy Navyist Rewards Credit Card",
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
    {"category": "old_navy_gap_br_athleta", "rate_pts_per_dollar": 5, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null, "notes": "Visa version only"}
  ],

  "signup_bonus": {"amount_pts": null, "spend_required_usd": null, "spend_window_months": null, "estimated_value_usd": 30},

  "annual_credits": [],

  "ongoing_perks": [{"name": "Birthday gift", "value_estimate_usd": null, "category": "lifestyle"}],

  "transfer_partners_inherited_from": null,

  "issuer_rules": ["Barclays 6/24"],

  "best_for": ["gap_family_brand_shoppers"],
  "synergies_with": ["gap_good_rewards", "banana_republic_rewards", "athleta_rewards"],
  "competing_with_in_wallet": [],

  "breakeven_logic_notes": "No AF. 5% at Old Navy/Gap/BR/Athleta is competitive for brand loyalists.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://oldnavy.gap.com/customerService/info.do?cid=1101727"]
}
```

## programs.json entry

```json
{
  "id": "gap_inc_rewards",
  "name": "Gap Inc Rewards (Old Navy / Gap / BR / Athleta)",
  "type": "fixed_value",
  "issuer": "Barclays",
  "earning_cards": ["old_navy_navyist", "gap_good_rewards", "banana_republic_rewards", "athleta_rewards"],
  "fixed_redemption_cpp": 1.0,
  "transfer_partners": [],
  "sweet_spots": [],
  "redemption_constraint": "Redeemable as Gap Cash across Old Navy/Gap/BR/Athleta",
  "sources": ["https://oldnavy.gap.com/"]
}
```

## issuer_rules / perks_dedup / destination_perks
None unique. See `jetblue_plus.md` for Barclays.

## RESEARCH_NOTES.md entries
- Gap Cash redeemable across all 4 Gap Inc brands.
- Visa version earns 1% on non-Gap purchases; closed-loop earns 0%.
