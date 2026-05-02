# Amex Marriott Bonvoy Brilliant

`card_id`: marriott_bonvoy_brilliant
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "marriott_bonvoy_brilliant",
  "name": "Amex Marriott Bonvoy Brilliant Card",
  "issuer": "Amex",
  "network": "Amex",
  "card_type": "personal",
  "category": ["hotel_cobrand", "premium_travel"],
  "annual_fee_usd": 650,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "excellent",
  "currency_earned": "marriott_bonvoy",

  "earning": [
    {"category": "marriott_bonvoy_purchases", "rate_pts_per_dollar": 6, "cap_usd_per_year": null},
    {"category": "flights_amex_travel_or_direct", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "restaurants_worldwide", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 2, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": 95000,
    "spend_required_usd": 6000,
    "spend_window_months": 6,
    "estimated_value_usd": 750
  },

  "annual_credits": [
    {"name": "Free Night Award (85,000 pts)", "value_usd": 600, "type": "specific", "expiration": "annual_anniversary", "ease_of_use": "medium"},
    {"name": "Dining credit", "value_usd": 300, "type": "specific", "expiration": "monthly", "ease_of_use": "medium", "notes": "$25/month at restaurants worldwide"}
  ],

  "ongoing_perks": [
    {"name": "Marriott Platinum Elite status", "value_estimate_usd": null, "category": "hotel_status", "notes": "Includes lounge access, room upgrades, late checkout"},
    {"name": "25 elite-night credits per year", "value_estimate_usd": null, "category": "elite_status_acceleration"},
    {"name": "Priority Pass Select", "value_estimate_usd": null, "category": "lounge_access"},
    {"name": "Trip cancellation/interruption", "value_estimate_usd": null, "category": "travel_protection"},
    {"name": "Premium auto rental optional enrollment", "value_estimate_usd": null, "category": "travel_protection_optional"}
  ],

  "transfer_partners_inherited_from": "marriott_bonvoy",

  "issuer_rules": [
    "Amex once-per-lifetime SUB",
    "Marriott 24-month bonus rule across Marriott family cards (Chase + Amex)"
  ],

  "best_for": ["Marriott_Platinum_status_pursuit", "couple_using_85k_Free_Night_at_luxury_property"],
  "synergies_with": ["marriott_bonvoy_boundless", "marriott_bonvoy_business"],
  "competing_with_in_wallet": ["marriott_bonvoy_bountiful"],

  "breakeven_logic_notes": "AF $650 less 85k Free Night ($600 at luxury property) less $300 dining = -$250. AF easily negated for users redeeming Free Night at luxury property.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.americanexpress.com/us/credit-cards/card/marriott-bonvoy-brilliant-amex/"]
}
```

## programs.json entry
See `marriott_bonvoy_boundless.md`.

## issuer_rules.json entry
See `amex_gold.md`.

## perks_dedup.json entries

```json
[
  {
    "perk": "marriott_platinum_elite",
    "card_ids": ["marriott_bonvoy_brilliant"],
    "value_if_unique_usd": null,
    "value_if_duplicate_usd": 0,
    "notes": "Supersedes Marriott Gold from Amex Plat. Engine should detect and not double-count."
  },
  {
    "perk": "priority_pass_select",
    "card_ids": ["marriott_bonvoy_brilliant"],
    "value_if_unique_usd": 469,
    "value_if_duplicate_usd": 0
  }
]
```

## destination_perks.json entries
See `marriott_bonvoy_boundless.md`.

## RESEARCH_NOTES.md entries
- 85k Free Night cert covers Ritz-Carlton off-peak, JW Marriott premium properties.
- Marriott 24-month rule prevents holding both Brilliant and Bountiful with bonus eligibility.
