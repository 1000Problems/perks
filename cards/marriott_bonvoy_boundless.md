# Chase Marriott Bonvoy Boundless

`card_id`: marriott_bonvoy_boundless
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "marriott_bonvoy_boundless",
  "name": "Chase Marriott Bonvoy Boundless Card",
  "issuer": "Chase",
  "network": "Visa",
  "card_type": "personal",
  "category": ["hotel_cobrand"],
  "annual_fee_usd": 95,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "marriott_bonvoy",

  "earning": [
    {"category": "marriott_bonvoy_purchases", "rate_pts_per_dollar": 6, "cap_usd_per_year": null},
    {"category": "grocery_gas_dining", "rate_pts_per_dollar": 3, "cap_usd_per_year": 6000, "notes": "On first $6k/yr"},
    {"category": "everything_else", "rate_pts_per_dollar": 2, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": 100000,
    "spend_required_usd": 5000,
    "spend_window_months": 3,
    "estimated_value_usd": 800
  },

  "annual_credits": [
    {"name": "Free Night Award (35,000 pts)", "signal_id": "hotel_free_night_cert", "value_usd": 250, "type": "specific", "expiration": "annual_anniversary", "ease_of_use": "medium", "notes": "After AF posts each year"}
  ],

  "ongoing_perks": [
    {"name": "Marriott Silver Elite status", "value_estimate_usd": null, "category": "hotel_status"},
    {"name": "15 elite-night credits per year", "value_estimate_usd": null, "category": "elite_status_acceleration"},
    {"name": "Auto rental CDW (secondary)", "value_estimate_usd": null, "category": "travel_protection"}
  ],

  "transfer_partners_inherited_from": "marriott_bonvoy",

  "issuer_rules": [
    "Chase 5/24",
    "Marriott 24-month bonus rule across Marriott family cards (Chase + Amex)"
  ],

  "best_for": ["Marriott_loyalist_hitting_Free_Night_anniversary"],
  "synergies_with": ["marriott_bonvoy_brilliant", "marriott_bonvoy_business"],
  "competing_with_in_wallet": ["marriott_bonvoy_bevy", "marriott_bonvoy_bountiful"],

  "breakeven_logic_notes": "AF $95 less Free Night ($250 typical) = -$155. AF effectively negative for any Marriott user.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://creditcards.chase.com/marriott/boundless"]
}
```

## programs.json entry (marriott_bonvoy)

```json
{
  "id": "marriott_bonvoy",
  "name": "Marriott Bonvoy",
  "type": "cobrand_hotel",
  "issuer": "Marriott International",
  "earning_cards": ["marriott_bonvoy_boundless", "marriott_bonvoy_bevy", "marriott_bonvoy_bountiful", "marriott_bonvoy_brilliant", "marriott_bonvoy_business"],
  "fixed_redemption_cpp": 0.7,
  "median_redemption_cpp": 0.8,
  "median_cpp_source_url": "https://thepointsguy.com/loyalty-programs/monthly-valuations/",
  "median_cpp_as_of": "2026-05-01",
  "transfer_partners_notes": "Receives transfers from Chase UR (1:1) and Amex MR (1:1). Transfers OUT to airline programs at 3:1 + 5k bonus per 60k transferred.",
  "sweet_spots": [
    {"description": "5th-night-free on award stays", "value_estimate_usd": "~+25%", "source": null},
    {"description": "Bonvoy → United via 60k:25k+5k bonus = 30k miles per 60k pts", "value_estimate_usd": "~2cpp on UA", "source": null}
  ],
  "sources": ["https://www.marriott.com/loyalty/about/bonvoy.mi"]
}
```

## issuer_rules.json entry
See `chase_sapphire_preferred.md`.

## perks_dedup.json entries

```json
[
  {
    "perk": "marriott_silver_elite",
    "card_ids": ["marriott_bonvoy_boundless", "marriott_bonvoy_business"],
    "value_if_unique_usd": null,
    "value_if_duplicate_usd": 0
  }
]
```

## destination_perks.json entries

```json
{
  "marriott_global": {
    "hotel_chains_strong": ["Marriott (largest hotel network)"],
    "relevant_cards": ["marriott_bonvoy_boundless", "marriott_bonvoy_brilliant", "marriott_bonvoy_business"],
    "notes": "8,000+ properties across St. Regis, Ritz-Carlton, JW Marriott, etc."
  }
}
```

## RESEARCH_NOTES.md entries
- Marriott 24-month rule applies across all Marriott family cards from Chase and Amex.
- Free Night cert is 35k pts (cash value depends on dynamic pricing); upgradeable with up to 15k pts top-up.
