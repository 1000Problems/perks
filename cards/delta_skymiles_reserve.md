# Amex Delta SkyMiles Reserve

`card_id`: delta_skymiles_reserve
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "delta_skymiles_reserve",
  "name": "Amex Delta SkyMiles Reserve Card",
  "issuer": "Amex",
  "network": "Amex",
  "card_type": "personal",
  "category": ["airline_cobrand", "premium_travel"],
  "annual_fee_usd": 650,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "excellent",
  "currency_earned": "delta_skymiles",

  "earning": [
    {"category": "delta_purchases", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "hotels_via_delta_stays", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": 80000,
    "spend_required_usd": 6000,
    "spend_window_months": 6,
    "estimated_value_usd": 1100
  },

  "annual_credits": [
    {"name": "Delta Stays credit", "value_usd": 200, "type": "specific", "expiration": "annual_anniversary", "ease_of_use": "medium"},
    {"name": "Resy dining credit", "signal_id": "dining_credit", "value_usd": 240, "type": "specific", "expiration": "monthly", "ease_of_use": "medium"},
    {"name": "Rideshare credit", "value_usd": 120, "type": "specific", "expiration": "monthly", "ease_of_use": "easy"}
  ],

  "ongoing_perks": [
    {"name": "Delta Sky Club access", "signal_id": "lounge_access", "value_estimate_usd": 695, "category": "lounge_access", "notes": "When flying Delta same-day; standalone Delta One bookings extended; capped at 15 visits/yr unless $75k spend"},
    {"name": "Centurion Lounge access (when flying Delta on Reserve)", "signal_id": "lounge_access", "value_estimate_usd": null, "category": "lounge_access"},
    {"name": "Free first checked bag", "signal_id": "free_checked_bag", "value_estimate_usd": 240, "category": "airline_perk"},
    {"name": "Companion certificate (domestic + Caribbean/Central America)", "value_estimate_usd": 400, "category": "airline_perk"},
    {"name": "First Class upgrade priority increase", "value_estimate_usd": null, "category": "elite_perk"},
    {"name": "MQD boost", "value_estimate_usd": null, "category": "elite_status"},
    {"name": "20% off inflight", "value_estimate_usd": null, "category": "airline_perk"}
  ],

  "transfer_partners_inherited_from": null,

  "issuer_rules": ["Amex once-per-lifetime SUB"],

  "best_for": ["Delta_loyalist_with_lounge_use", "couple_with_companion_cert"],
  "synergies_with": ["amex_platinum", "delta_skymiles_business_reserve"],
  "competing_with_in_wallet": ["amex_platinum_for_centurion", "delta_skymiles_platinum"],

  "breakeven_logic_notes": "AF $650. Sky Club access alone ~$695 standalone. Companion cert + Sky Club covers AF. Realistic for users hitting Sky Clubs 8+ times/year on Delta-flown days.",

  "recently_changed": true,
  "recently_changed_date": "2024-01",
  "data_freshness": "2026-05-01",
  "sources": ["https://www.americanexpress.com/us/credit-cards/card/delta-skymiles-reserve-amex/"]
}
```

## programs.json entry
See `delta_skymiles_gold.md`.

## issuer_rules.json entry
See `amex_gold.md`.

## perks_dedup.json entries
See `delta_skymiles_gold.md`.

## destination_perks.json entries
See `delta_skymiles_gold.md`.

## RESEARCH_NOTES.md entries
- 2024 changes restricted Sky Club access to 15 visits/yr unless $75k spend.
- Companion certificate now extends to Caribbean/Central America on Reserve.
