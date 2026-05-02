# Bank of America Customized Cash Rewards

`card_id`: boa_customized_cash
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "boa_customized_cash",
  "name": "Bank of America Customized Cash Rewards",
  "issuer": "Bank of America",
  "network": "Visa",
  "card_type": "personal",
  "category": ["tiered_cashback", "no_af_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 3,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "boa_points",

  "earning": [
    {"category": "user_choice_3pct_category", "rate_pts_per_dollar": 3, "cap_usd_per_year": null, "cap_combined_per_quarter_usd": 2500, "notes": "Choose 1 of: gas/EV/online-shopping/dining/travel/drugstores/home-improvement. 3% cap shared with 2% grocery/wholesale-club for $2,500/quarter combined."},
    {"category": "grocery_and_wholesale_club", "rate_pts_per_dollar": 2, "cap_combined_per_quarter_usd": 2500},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "earning_modifier_preferred_rewards": "75% bonus at Platinum Honors: 3% becomes 5.25%, 2% becomes 3.5%.",

  "signup_bonus": {
    "amount_pts": 20000,
    "spend_required_usd": 1000,
    "spend_window_months": 3,
    "estimated_value_usd": 200
  },

  "annual_credits": [],

  "ongoing_perks": [
    {"name": "Auto rental CDW (secondary)", "value_estimate_usd": null, "category": "travel_protection"}
  ],

  "transfer_partners_inherited_from": null,

  "issuer_rules": ["BoA 2/3/4", "BoA 7/12 (informal)", "Preferred Rewards bonus"],

  "best_for": ["multi_card_stacking_at_platinum_honors", "online_shopping_5_25_pct_at_PH"],
  "synergies_with": ["boa_premium_rewards", "boa_premium_rewards_elite"],
  "competing_with_in_wallet": ["chase_freedom_flex", "citi_custom_cash"],

  "breakeven_logic_notes": "No AF; 3-card stack at Platinum Honors = $30k/yr at 5.25% = $1,575. Engine should weight heavily for users with $100k+ at BoA/Merrill.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.bankofamerica.com/credit-cards/customized-cash-rewards-credit-card/"]
}
```

## programs.json entry
See `boa_premium_rewards.md`.

## issuer_rules.json entry
See `boa_premium_rewards.md`.

## perks_dedup.json entries
None unique.

## destination_perks.json entries
None.

## RESEARCH_NOTES.md entries

- **Stacking strategy**: Power users hold 3+ Customized Cash with different category selections. BoA does not strictly limit duplicates. Caps reset quarterly.
- **Online shopping category**: Includes Amazon, eBay, Walmart.com, Target.com — broadest no-AF online cashback category at PH tiers.
- **3% FX**: Domestic only.
