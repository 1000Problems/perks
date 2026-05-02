# Amex Hilton Honors Surpass

`card_id`: hilton_honors_surpass
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "hilton_honors_surpass",
  "name": "Amex Hilton Honors Surpass Card",
  "issuer": "Amex",
  "network": "Amex",
  "card_type": "personal",
  "category": ["hotel_cobrand"],
  "annual_fee_usd": 150,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "hilton_honors",

  "earning": [
    {"category": "hilton_purchases", "rate_pts_per_dollar": 12, "cap_usd_per_year": null},
    {"category": "us_dining_supermarkets_gas", "rate_pts_per_dollar": 6, "cap_usd_per_year": null},
    {"category": "online_retail_us", "rate_pts_per_dollar": 4, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 3, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": 130000,
    "spend_required_usd": 3000,
    "spend_window_months": 6,
    "estimated_value_usd": 650
  },

  "annual_credits": [
    {"name": "Hilton Resort credit", "value_usd": 200, "type": "specific", "expiration": "split_h1_h2", "ease_of_use": "medium", "notes": "$50/quarter at participating Hilton resorts"},
    {"name": "Free Night Reward after $15k spend", "value_usd": 350, "type": "spend_threshold", "expiration": "annual_anniversary", "ease_of_use": "hard"}
  ],

  "ongoing_perks": [
    {"name": "Hilton Gold status", "value_estimate_usd": null, "category": "hotel_status", "notes": "Includes 80% room bonus, room upgrades, daily food/beverage credit at most US properties"},
    {"name": "10 Priority Pass visits per year", "value_estimate_usd": null, "category": "lounge_access"},
    {"name": "Diamond status with $40k spend", "value_estimate_usd": null, "category": "elite_status_acceleration"}
  ],

  "transfer_partners_inherited_from": null,

  "issuer_rules": [
    "Amex once-per-lifetime SUB"
  ],

  "best_for": ["Hilton_loyalist_with_Gold_status_value", "$50_quarterly_resort_credit_user"],
  "synergies_with": ["amex_platinum_for_Gold_match"],
  "competing_with_in_wallet": ["hilton_honors_aspire", "hilton_honors_business"],

  "breakeven_logic_notes": "AF $150 less $200 resort credit (medium) = -$50. Free Night cert at $15k spend is bonus.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.americanexpress.com/us/credit-cards/card/hilton-honors-surpass-amex/"]
}
```

## programs.json entry (hilton_honors)

```json
{
  "id": "hilton_honors",
  "name": "Hilton Honors",
  "type": "cobrand_hotel",
  "issuer": "Hilton",
  "earning_cards": ["hilton_honors", "hilton_honors_surpass", "hilton_honors_aspire", "hilton_honors_business"],
  "fixed_redemption_cpp": 0.5,
  "transfer_partners_notes": "Receives transfers from Amex MR (1:2 — generally bad value). Earn directly via Hilton stays and co-brand cards.",
  "sweet_spots": [
    {"description": "5th-night-free on award stays for Gold/Diamond members", "value_estimate_usd": "~+25%", "source": null},
    {"description": "Premium properties booked off-peak", "value_estimate_usd": "~0.6cpp", "source": null}
  ],
  "sources": ["https://www.hilton.com/en/honors/"]
}
```

## issuer_rules.json entry
See `amex_gold.md`.

## perks_dedup.json entries

```json
[
  {
    "perk": "hilton_gold",
    "card_ids": ["hilton_honors_surpass", "hilton_honors_business", "amex_platinum"],
    "value_if_unique_usd": null,
    "value_if_duplicate_usd": 0,
    "notes": "Don't double-count. Aspire grants Diamond, which supersedes Gold."
  }
]
```

## destination_perks.json entries

```json
{
  "hilton_global": {
    "hotel_chains_strong": ["Hilton, Conrad, Waldorf Astoria, DoubleTree, Hampton, Embassy Suites"],
    "relevant_cards": ["hilton_honors_surpass", "hilton_honors_aspire", "hilton_honors_business"]
  }
}
```

## RESEARCH_NOTES.md entries
- Hilton Free Night certs are the highest-value Hilton currency; redeem at premium properties for outsized value.
