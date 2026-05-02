# Bilt Blue Card

`card_id`: bilt_blue
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "bilt_blue",
  "name": "Bilt Blue Card",
  "issuer": "Bilt (issued by Wells Fargo)",
  "network": "Mastercard",
  "card_type": "personal",
  "category": ["no_af_travel", "rent_rewards"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "bilt_rewards",

  "earning": [
    {"category": "rent", "rate_pts_per_dollar": 1, "cap_pts_per_year": 100000, "notes": "1x on rent up to 100k pts/yr; no transaction fee. Housing-payment earn rate scales with non-housing spend, up to 1.25x"},
    {"category": "mortgage", "rate_pts_per_dollar": 1, "cap_pts_per_year": null, "notes": "Bilt 2.0 added mortgage payments; verify enrollment requirements"},
    {"category": "dining", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "travel", "rate_pts_per_dollar": 2, "cap_usd_per_year": null, "notes": "Lyft 5x via Lyft app linkage on certain Bilt tiers"},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "earning_modifier_rent_day": "On the first of each month, all non-rent earn rates double up to 2x dining, 4x travel, 2x base. Capped at 1,000 bonus points/Rent Day on Blue.",

  "signup_bonus": {
    "amount_pts": null,
    "spend_required_usd": null,
    "spend_window_months": null,
    "estimated_value_usd": null,
    "notes": "Bilt does not run traditional SUBs. Acquisition incentives via Rent Day promotions or referral."
  },

  "annual_credits": [],

  "ongoing_perks": [
    {"name": "Cell phone protection (limited tiers)", "value_estimate_usd": null, "category": "purchase_protection"},
    {"name": "Auto rental CDW (secondary)", "value_estimate_usd": null, "category": "travel_protection"}
  ],

  "transfer_partners_inherited_from": "bilt_rewards",

  "issuer_rules": [
    "Bilt 5-transactions-per-statement-cycle requirement to earn rewards on rent",
    "Wells Fargo issues; subject to WF underwriting"
  ],

  "best_for": ["renters_paying_$1k_plus_rent", "no_AF_with_Hyatt_and_AA_transfer_access", "Hawaiian_Atmos_transfer_users"],
  "synergies_with": ["bilt_obsidian", "bilt_palladium"],
  "competing_with_in_wallet": ["chase_freedom_unlimited"],

  "breakeven_logic_notes": "No AF; rent points are pure incremental rewards (rent normally earns 0%). Engine: a renter paying $2k/mo earns 24k pts/yr at base = ~$480 at 2cpp Hyatt valuation. No other no-AF card touches this for renters.",

  "recently_changed": true,
  "recently_changed_date": "2026-01",
  "data_freshness": "2026-05-01",
  "sources": [
    "https://www.cnbc.com/select/bilt-blue-card-review/",
    "https://www.cnbc.com/select/bilt-mastercard-new-credit-cards-rewards/"
  ]
}
```

## programs.json entry (bilt_rewards)

```json
{
  "id": "bilt_rewards",
  "name": "Bilt Rewards",
  "type": "transferable",
  "issuer": "Bilt",
  "earning_cards": ["bilt_blue", "bilt_obsidian", "bilt_palladium"],
  "transfer_unlock_card_ids": ["bilt_blue", "bilt_obsidian", "bilt_palladium"],
  "fixed_redemption_cpp": 1.25,
  "fixed_redemption_cpp_notes": "Via Bilt Travel portal; 1.25cpp",
  "portal_redemption_cpp": 1.25,
  "transfer_partners": [
    {"partner": "Hyatt", "ratio": "1:1", "type": "hotel", "min_transfer": 1, "notes": null},
    {"partner": "Marriott Bonvoy", "ratio": "1:1", "type": "hotel", "min_transfer": 1, "notes": null},
    {"partner": "IHG One Rewards", "ratio": "1:1", "type": "hotel", "min_transfer": 1, "notes": null},
    {"partner": "Accor Live Limitless", "ratio": "3:1", "type": "hotel", "min_transfer": 1, "notes": null},
    {"partner": "American Airlines AAdvantage", "ratio": "1:1", "type": "airline", "min_transfer": 1, "notes": "Rare 1:1 to AA"},
    {"partner": "United MileagePlus", "ratio": "1:1", "type": "airline", "min_transfer": 1, "notes": null},
    {"partner": "Alaska Atmos Rewards", "ratio": "1:1", "type": "airline", "min_transfer": 1, "notes": "Includes legacy Hawaiian award space"},
    {"partner": "Air Canada Aeroplan", "ratio": "1:1", "type": "airline", "min_transfer": 1, "notes": null},
    {"partner": "Air France-KLM Flying Blue", "ratio": "1:1", "type": "airline", "min_transfer": 1, "notes": null},
    {"partner": "Avianca LifeMiles", "ratio": "1:1", "type": "airline", "min_transfer": 1, "notes": null},
    {"partner": "British Airways Avios", "ratio": "1:1", "type": "airline", "min_transfer": 1, "notes": null},
    {"partner": "Cathay Pacific Asia Miles", "ratio": "1:1", "type": "airline", "min_transfer": 1, "notes": null},
    {"partner": "Emirates Skywards", "ratio": "1:1", "type": "airline", "min_transfer": 1, "notes": null},
    {"partner": "Etihad Guest", "ratio": "1:1", "type": "airline", "min_transfer": 1, "notes": null},
    {"partner": "JetBlue TrueBlue", "ratio": "1:1", "type": "airline", "min_transfer": 1, "notes": null},
    {"partner": "Singapore KrisFlyer", "ratio": "1:1", "type": "airline", "min_transfer": 1, "notes": null},
    {"partner": "Turkish Miles & Smiles", "ratio": "1:1", "type": "airline", "min_transfer": 1, "notes": null},
    {"partner": "Virgin Atlantic Flying Club", "ratio": "1:1", "type": "airline", "min_transfer": 1, "notes": null}
  ],
  "sweet_spots": [
    {"description": "Hyatt Cat 1-4 free night via 1:1 transfer", "value_estimate_usd": "~3-5cpp", "source": null},
    {"description": "AA Web Specials and off-peak via 1:1 transfer", "value_estimate_usd": "~2-3cpp", "source": null},
    {"description": "Alaska Atmos to JAL/Cathay/Hawaiian", "value_estimate_usd": "~2-4cpp", "source": null},
    {"description": "Rent Day bonus multipliers on 1st of month", "value_estimate_usd": null, "source": null}
  ],
  "sources": [
    "https://www.biltrewards.com/transfer-partners",
    "https://thepointsguy.com/guide/maximizing-bilt-rewards/"
  ]
}
```

## issuer_rules.json entry (Bilt)

```json
{
  "issuer": "Bilt",
  "rules": [
    {
      "id": "bilt_5_transactions",
      "name": "5 transactions per cycle",
      "description": "Must complete 5 non-rent transactions per statement cycle to earn rewards on that cycle (including rent rewards).",
      "applies_to": "all_bilt_cards",
      "official": true
    },
    {
      "id": "bilt_no_traditional_SUB",
      "name": "No SUB",
      "description": "Bilt does not offer signup bonuses; acquisition relies on Rent Day promotions and referrals.",
      "applies_to": "all_bilt_cards",
      "official": true
    },
    {
      "id": "bilt_housing_payment_scaling",
      "name": "Housing payment scaling",
      "description": "Earn rate on rent/mortgage scales with non-housing card usage; max 1.25x rent earn requires significant non-housing spend.",
      "applies_to": "all_bilt_cards",
      "official": true
    }
  ]
}
```

## perks_dedup.json entries
None unique.

## destination_perks.json entries
See chase_sapphire_preferred.md for Hyatt sweet spot — Bilt is a second 1:1 source.

## RESEARCH_NOTES.md entries

- **Bilt 2.0 transition**: As of January 2026, Bilt restructured into 3 cards (Blue/Obsidian/Palladium). Original "Bilt Mastercard" closed to new applicants; existing holders likely product-changed.
- **Mortgage earning**: New in 2026; verify mechanics (likely capped, possibly limited to certain mortgage types).
- **Rent fee**: Always 0% transaction fee on rent — Bilt's defining feature.
- **Atmos transfer**: Alaska's new program post-Hawaiian merger; routes JAL/Cathay/Hawaiian remain accessible.
