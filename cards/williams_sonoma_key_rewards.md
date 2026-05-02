# Williams Sonoma Key Rewards Visa

`card_id`: williams_sonoma_key_rewards
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "williams_sonoma_key_rewards",
  "name": "Williams Sonoma Key Rewards Visa",
  "issuer": "Capital One",
  "network": "Visa",
  "card_type": "personal",
  "category": ["retail_cobrand", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good",
  "currency_earned": "key_rewards",

  "earning": [
    {"category": "key_rewards_brands_ws_pb_we_etc", "rate_pts_per_dollar": 5, "cap_usd_per_year": null, "notes": "5% back at WS, Pottery Barn, West Elm, Mark & Graham"},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {"amount_pts": null, "spend_required_usd": null, "spend_window_months": null, "estimated_value_usd": 50, "notes": "Reward on first purchase"},

  "annual_credits": [],
  "ongoing_perks": [],
  "transfer_partners_inherited_from": null,
  "issuer_rules": ["Capital One 1-per-month"],

  "best_for": ["WS_PB_WE_brand_loyalists"],
  "synergies_with": ["pottery_barn_key_rewards", "west_elm_key_rewards"],
  "competing_with_in_wallet": ["pottery_barn_key_rewards"],

  "breakeven_logic_notes": "No AF. 5% across all 4 Key Rewards brands. Same Key Rewards system across all 3 cards.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.williams-sonoma.com/customer-service/credit-card.html"]
}
```

## programs.json entry

```json
{
  "id": "key_rewards",
  "name": "Williams Sonoma Key Rewards",
  "type": "fixed_value",
  "issuer": "Capital One",
  "earning_cards": ["williams_sonoma_key_rewards", "pottery_barn_key_rewards", "west_elm_key_rewards"],
  "fixed_redemption_cpp": 1.0,
  "redemption_constraint": "Redeemable across WS, PB, WE, Mark & Graham brands",
  "transfer_partners": [],
  "sweet_spots": [],
  "sources": ["https://www.williams-sonoma.com/"]
}
```

## issuer_rules / perks_dedup / destination_perks
See `capital_one_venture_x.md` for issuer rules.

## RESEARCH_NOTES.md entries
- Engine: treat WS/PB/WE Key Rewards cards as functionally identical; co-branding is the only difference.
