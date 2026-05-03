# Hawaiian Airlines Bank of Hawaii World Elite Mastercard

`card_id`: hawaiian_boh_world_elite
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "hawaiian_boh_world_elite",
  "name": "Hawaiian Airlines Bank of Hawaii World Elite Mastercard",
  "issuer": "Barclays / Bank of Hawaii",
  "network": "Mastercard World Elite",
  "card_type": "personal",
  "category": ["airline_cobrand"],
  "annual_fee_usd": 99,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "alaska_atmos_rewards",
  "currency_earned_notes": "Post-Alaska/Hawaiian merger, points consolidate into Atmos Rewards",

  "earning": [
    {"category": "hawaiian_alaska_purchases", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "dining_grocery", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {"amount_pts": 60000, "spend_required_usd": 2000, "spend_window_months": 90, "estimated_value_usd": 750},

  "annual_credits": [{"name": "$100 Hawaiian companion discount after first purchase + AF payment", "value_usd": 100, "type": "specific", "expiration": "annual_anniversary", "ease_of_use": "medium"}],

  "ongoing_perks": [
    {"name": "Free first checked bag", "signal_id": "free_checked_bag", "value_estimate_usd": 240, "category": "airline_perk"},
    {"name": "Boarding priority", "value_estimate_usd": null, "category": "airline_perk"}
  ],

  "transfer_partners_inherited_from": "alaska_atmos_rewards",

  "issuer_rules": ["Barclays 6/24"],

  "best_for": ["hawaii_resident_or_frequent_visitor"],
  "synergies_with": ["alaska_airlines_visa", "atmos_rewards_summit", "atmos_rewards_ascent"],
  "competing_with_in_wallet": ["alaska_airlines_visa"],

  "breakeven_logic_notes": "AF $99. Companion discount + free bag covers AF for any HI traveler with companion.",

  "recently_changed": true,
  "recently_changed_date": "2025 merger transition",
  "data_freshness": "2026-05-01",
  "sources": ["https://www.boh.com/personal/credit-cards/hawaiian-airlines-credit-cards"]
}
```

## programs.json entry
See `alaska_airlines_visa.md` for alaska_atmos_rewards.

## issuer_rules.json entry
See `jetblue_plus.md` for Barclays.

## perks_dedup.json entries
None unique.

## destination_perks.json entries
See `alaska_airlines_visa.md`.

## RESEARCH_NOTES.md entries
- Bank of Hawaii is the local issuing bank; Barclays is the underlying processor.
- Post-Hawaiian/Alaska merger, miles transition to Atmos Rewards.
