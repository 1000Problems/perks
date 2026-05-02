# Amex Delta SkyMiles Platinum

`card_id`: delta_skymiles_platinum
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "delta_skymiles_platinum",
  "name": "Amex Delta SkyMiles Platinum Card",
  "issuer": "Amex",
  "network": "Amex",
  "card_type": "personal",
  "category": ["airline_cobrand", "mid_tier_travel"],
  "annual_fee_usd": 350,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "delta_skymiles",

  "earning": [
    {"category": "delta_purchases", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "us_supermarkets", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "restaurants_worldwide", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "hotels_via_delta_stays", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": 60000,
    "spend_required_usd": 3000,
    "spend_window_months": 6,
    "estimated_value_usd": 750
  },

  "annual_credits": [
    {"name": "Delta Stays credit", "value_usd": 150, "type": "specific", "expiration": "annual_anniversary", "ease_of_use": "medium"},
    {"name": "Resy dining credit", "value_usd": 240, "type": "specific", "expiration": "monthly", "ease_of_use": "medium", "notes": "$20/month"},
    {"name": "Rideshare credit", "value_usd": 120, "type": "specific", "expiration": "monthly", "ease_of_use": "easy", "notes": "$10/month select rideshare"}
  ],

  "ongoing_perks": [
    {"name": "Free first checked bag", "value_estimate_usd": 240, "category": "airline_perk"},
    {"name": "Priority boarding (Zone 5)", "value_estimate_usd": null, "category": "airline_perk"},
    {"name": "Companion certificate (domestic, after annual renewal)", "value_estimate_usd": 250, "category": "airline_perk", "notes": "Eligible domestic main-cabin round trip; certificate is the differentiator"},
    {"name": "20% off inflight purchases", "value_estimate_usd": null, "category": "airline_perk"},
    {"name": "MQD boost: 1 MQD per $20 spent", "value_estimate_usd": null, "category": "elite_status", "notes": "Updated post-Delta-elite-overhaul"}
  ],

  "transfer_partners_inherited_from": null,

  "issuer_rules": ["Amex once-per-lifetime SUB"],

  "best_for": ["Delta_loyalist_who_uses_companion_certificate", "Delta_status_seeker_via_MQD_boost"],
  "synergies_with": ["delta_skymiles_reserve", "amex_platinum"],
  "competing_with_in_wallet": ["delta_skymiles_gold", "delta_skymiles_reserve"],

  "breakeven_logic_notes": "AF $350. Companion certificate is the headline benefit — typically worth $200-500 if used. With certificate + Delta Stays + Resy + rideshare credits, total face value $750+, realistic capture $400-550.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.americanexpress.com/us/credit-cards/card/delta-skymiles-platinum-amex/"]
}
```

## programs.json entry
See `delta_skymiles_gold.md`.

## issuer_rules.json entry
See `amex_gold.md`.

## perks_dedup.json entries
See `delta_skymiles_gold.md` for free_checked_bag_delta.

## destination_perks.json entries
See `delta_skymiles_gold.md` for delta_hubs.

## RESEARCH_NOTES.md entries
- Companion certificate is the sole reason most users hold this card; verify domestic-only restriction and Main-Cabin restriction at recommendation time.
