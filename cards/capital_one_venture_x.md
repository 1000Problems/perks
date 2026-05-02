# Capital One Venture X Rewards

`card_id`: capital_one_venture_x
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "capital_one_venture_x",
  "name": "Capital One Venture X Rewards Credit Card",
  "issuer": "Capital One",
  "network": "Visa Infinite",
  "card_type": "personal",
  "category": ["premium_travel"],
  "annual_fee_usd": 395,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "excellent",
  "currency_earned": "capital_one_miles",

  "earning": [
    {"category": "hotels_and_rentals_capital_one_travel", "rate_pts_per_dollar": 10, "cap_usd_per_year": null},
    {"category": "flights_and_vacation_rentals_capital_one_travel", "rate_pts_per_dollar": 5, "cap_usd_per_year": null},
    {"category": "capital_one_entertainment", "rate_pts_per_dollar": 5, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 2, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": 75000,
    "spend_required_usd": 4000,
    "spend_window_months": 3,
    "estimated_value_usd": 1300,
    "notes": "Has hit 100k via CardMatch. Standard 75k. No lifetime rule but Capital One has 48-month rule on some products."
  },

  "annual_credits": [
    {"name": "Capital One Travel credit", "value_usd": 300, "type": "specific", "expiration": "annual_anniversary", "ease_of_use": "easy", "notes": "Effectively cash equivalent for travel; uses point-and-cash redemption"},
    {"name": "10,000 anniversary bonus miles", "value_usd": 200, "type": "rewards", "expiration": "annual", "ease_of_use": "easy", "notes": "Auto-credited each anniversary; valued at ~2cpp"},
    {"name": "Global Entry / TSA PreCheck credit", "value_usd": 120, "type": "specific", "expiration": "every_4_years", "ease_of_use": "medium"}
  ],

  "ongoing_perks": [
    {"name": "Priority Pass Select (primary only post-Feb-2026)", "value_estimate_usd": 469, "category": "lounge_access", "notes": "1,300+ PP lounges. Authorized users no longer get free access automatically post 2026-02-01."},
    {"name": "Capital One Lounge access (primary only post-Feb-2026)", "value_estimate_usd": null, "category": "lounge_access", "notes": "Lounges at IAD, DFW, DEN, LAS, JFK, BWI, etc."},
    {"name": "Plaza Premium Lounge access", "value_estimate_usd": null, "category": "lounge_access"},
    {"name": "Hertz President's Circle status", "value_estimate_usd": null, "category": "rental_status"},
    {"name": "Premier collection hotel benefits", "value_estimate_usd": null, "category": "hotel_perk", "notes": "$100 experience credit, daily breakfast, early check-in/late checkout, room upgrade"},
    {"name": "Cell phone protection", "value_estimate_usd": null, "category": "purchase_protection", "notes": "$800/claim, $50 deductible, 2 claims/12mo"},
    {"name": "Trip cancellation/interruption", "value_estimate_usd": null, "category": "travel_protection"},
    {"name": "Trip delay reimbursement", "value_estimate_usd": null, "category": "travel_protection", "notes": "6+ hour delay, $500/ticket"},
    {"name": "Primary auto rental CDW", "value_estimate_usd": null, "category": "travel_protection"},
    {"name": "Lost luggage reimbursement", "value_estimate_usd": null, "category": "travel_protection"},
    {"name": "$75k spend unlocks complimentary guest lounge access for that calendar year", "value_estimate_usd": null, "category": "lounge_access_bonus", "notes": "Post 2026-02-01 policy"}
  ],

  "transfer_partners_inherited_from": "capital_one_miles",

  "issuer_rules": [
    "Capital One 1-card-per-issuer-per-month informal limit",
    "Capital One 48-month no-bonus rule on some product re-applications",
    "Capital One pulls all 3 credit bureaus historically (now Experian for many apps)"
  ],

  "best_for": ["high_value_at_$395_AF_with_$300_credit", "Hertz_renters", "Priority_Pass_primary_only"],
  "synergies_with": ["capital_one_savor", "capital_one_venture", "capital_one_quicksilver"],
  "competing_with_in_wallet": ["chase_sapphire_reserve", "amex_platinum"],

  "breakeven_logic_notes": "AF $395 less $300 Capital One Travel credit (easy) less 10k anniv miles ($200 at 2cpp) = -$105 net AF. Best objective value-for-AF among premium cards. PP value depends on whether user travels with companion (post-Feb-2026 policy hurts couples).",

  "recently_changed": true,
  "recently_changed_date": "2026-02-01",
  "data_freshness": "2026-05-01",
  "sources": [
    "https://www.capitalone.com/credit-cards/venture-x/",
    "https://www.dailydrop.com/pages/capital-one-lounge-access-changes",
    "https://thepointsguy.com/credit-cards/reviews/capital-one-venture-x/"
  ]
}
```

## programs.json entry (capital_one_miles)

```json
{
  "id": "capital_one_miles",
  "name": "Capital One Miles",
  "type": "transferable",
  "issuer": "Capital One",
  "earning_cards": [
    "capital_one_venture_x",
    "capital_one_venture",
    "capital_one_venture_one",
    "capital_one_venture_x_business",
    "capital_one_spark_miles",
    "capital_one_spark_miles_select"
  ],
  "fixed_redemption_cpp": 0.5,
  "fixed_redemption_cpp_notes": "0.5cpp via cash/statement credit",
  "portal_redemption_cpp": 1.0,
  "portal_redemption_cpp_notes": "1cpp via Purchase Eraser / portal",
  "transfer_partners": [
    {"partner": "Air Canada Aeroplan", "ratio": "1:1", "type": "airline", "min_transfer": 1000, "notes": null},
    {"partner": "Air France-KLM Flying Blue", "ratio": "1:1", "type": "airline", "min_transfer": 1000, "notes": null},
    {"partner": "Avianca LifeMiles", "ratio": "1:1", "type": "airline", "min_transfer": 1000, "notes": null},
    {"partner": "British Airways Avios", "ratio": "1:1", "type": "airline", "min_transfer": 1000, "notes": null},
    {"partner": "Cathay Pacific Asia Miles", "ratio": "1:1", "type": "airline", "min_transfer": 1000, "notes": null},
    {"partner": "Emirates Skywards", "ratio": "2:1.5", "type": "airline", "min_transfer": 1000, "notes": "Less favorable"},
    {"partner": "Etihad Guest", "ratio": "1:1", "type": "airline", "min_transfer": 1000, "notes": null},
    {"partner": "EVA Infinity MileageLands", "ratio": "1:1", "type": "airline", "min_transfer": 1000, "notes": null},
    {"partner": "Finnair Plus", "ratio": "1:1", "type": "airline", "min_transfer": 1000, "notes": null},
    {"partner": "Qantas Frequent Flyer", "ratio": "1:1", "type": "airline", "min_transfer": 1000, "notes": null},
    {"partner": "Singapore KrisFlyer", "ratio": "1:1", "type": "airline", "min_transfer": 1000, "notes": null},
    {"partner": "Turkish Miles & Smiles", "ratio": "1:1", "type": "airline", "min_transfer": 1000, "notes": "Famous for $7.5k-equivalent United domestic awards"},
    {"partner": "Virgin Red", "ratio": "1:1", "type": "airline", "min_transfer": 1000, "notes": null},
    {"partner": "Aeromexico Rewards", "ratio": "1:1", "type": "airline", "min_transfer": 1000, "notes": null},
    {"partner": "Choice Privileges", "ratio": "1:1", "type": "hotel", "min_transfer": 1000, "notes": null},
    {"partner": "Accor Live Limitless", "ratio": "2:1", "type": "hotel", "min_transfer": 1000, "notes": null},
    {"partner": "Wyndham Rewards", "ratio": "1:1", "type": "hotel", "min_transfer": 1000, "notes": null}
  ],
  "sweet_spots": [
    {"description": "Turkish Miles & Smiles United domestic 7.5k-12.5k one-way, transcon for 12.5k", "value_estimate_usd": "~5-8cpp", "source": "https://thepointsguy.com/guide/turkish-miles-smiles-sweet-spots/"},
    {"description": "Avianca LifeMiles Star Alliance partners (US-Europe biz ~63k one-way)", "value_estimate_usd": "~5-6cpp", "source": "https://www.avianca.com/us/en/lifemiles/"},
    {"description": "Wyndham 7,500-pt Vacasa rentals", "value_estimate_usd": "~3-5cpp", "source": "https://www.wyndhamhotels.com/wyndham-rewards/redeem"},
    {"description": "Accor 1:1 Iberostar / Fairmont for off-peak luxury", "value_estimate_usd": "~3cpp", "source": null}
  ],
  "sources": [
    "https://www.capitalone.com/learn-grow/more-than-money/transferring-miles-to-airlines/",
    "https://thepointsguy.com/guide/maximizing-capital-one-miles/"
  ]
}
```

## issuer_rules.json entry (Capital One)

```json
{
  "issuer": "Capital One",
  "rules": [
    {
      "id": "capital_one_one_per_month",
      "name": "1 Capital One credit card per month",
      "description": "Approves at most one personal Capital One card every ~30 days.",
      "applies_to": "capital_one_personal",
      "official": false
    },
    {
      "id": "capital_one_2_personal_card_max",
      "name": "Personal credit card cap",
      "description": "Capital One generally limits cardholders to 2 personal Capital One credit cards open at one time. Co-brand cards (Walmart, Costco, BJ's outside CO portfolio) often counted separately.",
      "applies_to": "capital_one_personal",
      "official": false
    },
    {
      "id": "capital_one_48_month_bonus_rule",
      "name": "48-month bonus rule (some products)",
      "description": "Some Capital One products require 48 months between bonus receipts. Less consistently enforced than Chase's Sapphire rule.",
      "applies_to": "selected_capital_one_products",
      "official": false
    },
    {
      "id": "capital_one_3_bureau_pull",
      "name": "Multi-bureau pull",
      "description": "Capital One historically pulled all 3 credit bureaus on every application. Now typically Experian for many apps but variability remains.",
      "applies_to": "capital_one_all_cards",
      "official": false
    }
  ]
}
```

## perks_dedup.json entries

```json
[
  {
    "perk": "priority_pass_primary",
    "card_ids": ["capital_one_venture_x"],
    "value_if_unique_usd": 469,
    "value_if_duplicate_usd": 0,
    "notes": "Post 2026-02-01: primary cardholder only by default, no free guests/AUs. Less couple-friendly than CSR PP."
  },
  {
    "perk": "global_entry_credit",
    "card_ids": ["capital_one_venture_x"],
    "value_if_unique_usd": 120,
    "value_if_duplicate_usd": 0
  },
  {
    "perk": "cell_phone_protection",
    "card_ids": ["capital_one_venture_x"],
    "value_if_unique_usd": 80,
    "value_if_duplicate_usd": 0,
    "notes": "$50 deductible, $800 per claim. Stronger than CSR's per-claim if user files often."
  }
]
```

## destination_perks.json entries

```json
{
  "anywhere_with_united_routes": {
    "airline_routes_strong": ["United via Turkish Miles & Smiles transfer"],
    "relevant_cards": ["capital_one_venture_x (Cap One Miles to Turkish)"],
    "notes": "Most US flyers' best Cap One sweet spot: Turkish 7,500 mi for sub-2hr United; 12,500 mi for transcon. United domestic for ~$1.30-2 in fare equivalent."
  }
}
```

## RESEARCH_NOTES.md entries

- **2026-02-01 lounge changes**: Major impact for couples/families. Authorized users ($125 each) no longer get free Priority Pass; primary loses free PP guests. To restore guest access: spend $75k on card in calendar year.
- **Capital One Travel credit ease**: Easy unless user is forced to book through CO Travel only. Booking penetrates Hyatt/Marriott elite stays through partner inventory; engine should weight as easy for non-elite users, medium for elite-status seekers.
- **Anniversary 10k miles**: Engine valuation: 10k Cap One miles ≈ $200 at 2cpp via best transfer; engine should not double-count the anniversary bonus and the SUB structure.
- **48-month rule**: Less aggressively enforced than Chase Sapphire rule. Verify on application.
