# American Express Platinum Card

`card_id`: amex_platinum
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "amex_platinum",
  "name": "American Express Platinum Card",
  "issuer": "Amex",
  "network": "Amex",
  "card_type": "personal",
  "category": ["premium_travel"],
  "annual_fee_usd": 895,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "excellent",
  "currency_earned": "amex_mr",

  "earning": [
    {"category": "flights_direct_or_amex_travel", "rate_pts_per_dollar": 5, "cap_usd_per_year": 500000, "notes": "5x up to $500k/yr"},
    {"category": "prepaid_hotels_amex_travel", "rate_pts_per_dollar": 5, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": 80000,
    "spend_required_usd": 8000,
    "spend_window_months": 6,
    "estimated_value_usd": 1600,
    "notes": "Public 80k baseline; CardMatch and elevated public offers have hit 175k. Lifetime once-per-product."
  },

  "annual_credits": [
    {"name": "Fine Hotels + Resorts / Hotel Collection credit", "value_usd": 600, "type": "specific", "expiration": "split_h1_h2", "ease_of_use": "medium", "notes": "$300 H1 + $300 H2; prepaid via AmexTravel; Hotel Collection requires 2-night minimum"},
    {"name": "Resy dining credit", "value_usd": 400, "type": "specific", "expiration": "quarterly", "ease_of_use": "medium", "notes": "$100/quarter at US Resy restaurants; enrollment required"},
    {"name": "Digital Entertainment credit", "value_usd": 300, "type": "specific", "expiration": "monthly", "ease_of_use": "medium", "notes": "$25/month; Paramount+, YouTube Premium/TV, Disney+/Hulu/ESPN+, NYT, Peacock, WSJ"},
    {"name": "Uber Cash", "value_usd": 200, "type": "specific", "expiration": "monthly", "ease_of_use": "easy", "notes": "$15/month + $20 December bonus; US Uber/Uber Eats"},
    {"name": "Uber One credit", "value_usd": 120, "type": "specific", "expiration": "monthly", "ease_of_use": "medium", "notes": "$10/month for Uber One auto-renewing membership"},
    {"name": "Airline incidental fee credit", "value_usd": 200, "type": "specific", "expiration": "calendar_year", "ease_of_use": "medium", "notes": "One pre-selected airline; checked bags / inflight food / seat upgrades"},
    {"name": "CLEAR+ membership credit", "value_usd": 209, "type": "specific", "expiration": "annual", "ease_of_use": "easy", "notes": "Auto-renewing CLEAR+"},
    {"name": "Walmart+ monthly credit", "value_usd": 155, "type": "specific", "expiration": "monthly", "ease_of_use": "easy", "notes": "$12.95/month covers full Walmart+ subscription"},
    {"name": "Saks Fifth Avenue credit", "value_usd": 100, "type": "specific", "expiration": "split_h1_h2", "ease_of_use": "hard", "notes": "$50 H1 + $50 H2"},
    {"name": "Oura Ring credit", "value_usd": 200, "type": "specific", "expiration": "annual", "ease_of_use": "hard", "notes": "Only if user buys an Oura Ring; not recurring"},
    {"name": "Global Entry / TSA PreCheck credit", "value_usd": 120, "type": "specific", "expiration": "every_4_years", "ease_of_use": "medium"}
  ],

  "ongoing_perks": [
    {"name": "Centurion Lounge access", "value_estimate_usd": null, "category": "lounge_access"},
    {"name": "Priority Pass Select", "value_estimate_usd": null, "category": "lounge_access", "notes": "Excludes restaurants since 2019"},
    {"name": "Delta Sky Club access (when flying Delta)", "value_estimate_usd": null, "category": "lounge_access"},
    {"name": "Global Lounge Collection 1,550+ lounges", "value_estimate_usd": 850, "category": "lounge_access"},
    {"name": "Marriott Gold Elite status", "value_estimate_usd": null, "category": "hotel_status"},
    {"name": "Hilton Gold status", "value_estimate_usd": null, "category": "hotel_status"},
    {"name": "Avis Preferred Plus / Hertz Five Star / National Executive status", "value_estimate_usd": null, "category": "rental_status"},
    {"name": "Trip cancellation/interruption", "value_estimate_usd": null, "category": "travel_protection"},
    {"name": "Trip delay insurance", "value_estimate_usd": null, "category": "travel_protection", "notes": "6+ hour delay, $500/trip"},
    {"name": "Premium auto rental (separate enrollment, $25-30 per rental)", "value_estimate_usd": null, "category": "travel_protection_optional"},
    {"name": "Cell phone protection", "value_estimate_usd": null, "category": "purchase_protection", "notes": "$800/claim, $50 deductible"},
    {"name": "Equinox digital credit (limited time / variable)", "value_estimate_usd": null, "category": "lifestyle"}
  ],

  "transfer_partners_inherited_from": "amex_mr",

  "issuer_rules": [
    "Amex once-per-lifetime SUB",
    "Amex 2-in-90-days personal velocity",
    "Amex 5-credit-card limit (Platinum is charge card, doesn't count)"
  ],

  "best_for": ["centurion_lounge_user", "FHR_hotel_credit_methodical_user", "Delta_loyalist_with_status_match"],
  "synergies_with": ["amex_gold", "amex_blue_business_plus", "delta_amex_cards_for_status_match"],
  "competing_with_in_wallet": ["chase_sapphire_reserve", "capital_one_venture_x"],

  "breakeven_logic_notes": "AF $895. Total face-value credits exceed $2,800 but realistic capture for an organized user is ~$1,200-1,600 depending on Walmart+/Uber/CLEAR/Hotel-credit usage. Casual user captures $400-700. Justified primarily for: (a) Centurion Lounge frequent users, (b) people who would buy FHR/Hotel Collection anyway, (c) users seeking instant Marriott/Hilton Gold + status pyramid.",

  "recently_changed": true,
  "recently_changed_date": "2025-09-29",
  "data_freshness": "2026-05-01",
  "sources": [
    "https://www.americanexpress.com/us/credit-cards/card/platinum/",
    "https://thepointsguy.com/credit-cards/reviews/amex-platinum-review/",
    "https://upgradedpoints.com/credit-cards/reviews/american-express-platinum-card/benefits/",
    "https://www.cnbc.com/select/amex-platinum-card-2025-changes/"
  ]
}
```

## programs.json entry

See `amex_gold.md` for canonical amex_mr entry.

## issuer_rules.json entry

See `amex_gold.md` for canonical Amex issuer_rules.

## perks_dedup.json entries

```json
[
  {
    "perk": "centurion_lounge",
    "card_ids": ["amex_platinum", "amex_business_platinum"],
    "value_if_unique_usd": 500,
    "value_if_duplicate_usd": 0,
    "notes": "Same access whether holding personal or business Plat. Don't double count."
  },
  {
    "perk": "priority_pass_select_no_restaurants",
    "card_ids": ["amex_platinum"],
    "value_if_unique_usd": 200,
    "value_if_duplicate_usd": 0,
    "notes": "Lower value than CSR PP because no restaurants. Engine: prefer CSR PP if user holds both."
  },
  {
    "perk": "global_entry_credit",
    "card_ids": ["amex_platinum"],
    "value_if_unique_usd": 120,
    "value_if_duplicate_usd": 0,
    "notes": "Only one GE credit useful per 4-yr cycle across all cards."
  },
  {
    "perk": "uber_cash",
    "card_ids": ["amex_platinum"],
    "value_if_unique_usd": 200,
    "value_if_duplicate_usd": 80,
    "notes": "Stacks with Gold's $120 Uber Cash to a degree but only one card-linked Uber account; engine: cap combined Uber Cash at higher of the two unless user maintains separate Uber accounts."
  },
  {
    "perk": "marriott_gold_status",
    "card_ids": ["amex_platinum", "marriott_bonvoy_brilliant"],
    "value_if_unique_usd": null,
    "value_if_duplicate_usd": 0,
    "notes": "Marriott Gold via multiple cards is redundant; Brilliant grants Platinum, which supersedes Gold."
  },
  {
    "perk": "hilton_gold_status",
    "card_ids": ["amex_platinum", "hilton_honors_surpass", "hilton_honors_business"],
    "value_if_unique_usd": null,
    "value_if_duplicate_usd": 0
  },
  {
    "perk": "clear_plus",
    "card_ids": ["amex_platinum", "amex_green", "amex_business_platinum"],
    "value_if_unique_usd": 209,
    "value_if_duplicate_usd": 0
  },
  {
    "perk": "walmart_plus",
    "card_ids": ["amex_platinum"],
    "value_if_unique_usd": 155,
    "value_if_duplicate_usd": 0
  }
]
```

## destination_perks.json entries

```json
{
  "any_with_centurion_lounge": {
    "relevant_cards": ["amex_platinum", "amex_business_platinum"],
    "notes": "DFW, JFK, LAX, MIA, LAS, SFO, ATL, IAH, PHL, SEA, DEN, BOS, CLT, NYC LGA, plus international. Major value driver for Plat AF justification."
  }
}
```

## RESEARCH_NOTES.md entries

- **2025 refresh**: AF rose to $895 from $695 effective for new applicants 2025-09-29. Existing cardholders renew into new pricing at first anniversary post-refresh.
- **Coupon-book**: Quintessential. Engine should aggressively grade individual credits.
- **Saks $100**: Long-running but consistently low capture. Mark as `hard` ease.
- **Equinox**: Used to be $300; now a digital-only / variable credit. Verify current state at recommendation time.
- **Oura $200**: New 2025 addition. One-time-feeling credit unless Oura starts a subscription model that resets.
- **Status match path**: Marriott/Hilton Gold from Plat is often used as the entry point for status challenges. Engine could surface this synergy.
- **Premium Auto Rental Protection**: Optional separate enrollment per rental, ~$25-30 per rental period, primary CDW. Not the default rental coverage.
