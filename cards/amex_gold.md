# American Express Gold Card

`card_id`: amex_gold
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "amex_gold",
  "name": "American Express Gold Card",
  "issuer": "Amex",
  "network": "Amex",
  "card_type": "personal",
  "category": ["mid_tier_travel", "dining_grocery"],
  "annual_fee_usd": 325,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "amex_mr",

  "earning": [
    {"category": "restaurants_worldwide", "rate_pts_per_dollar": 4, "cap_usd_per_year": 50000, "notes": "4x up to $50k/yr, then 1x"},
    {"category": "us_supermarkets", "rate_pts_per_dollar": 4, "cap_usd_per_year": 25000, "notes": "4x up to $25k/yr, then 1x"},
    {"category": "flights_direct_or_amex_travel", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "prepaid_hotels_amex_travel", "rate_pts_per_dollar": 5, "cap_usd_per_year": null, "notes": "Added in 2026 refresh"},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": 60000,
    "spend_required_usd": 6000,
    "spend_window_months": 6,
    "estimated_value_usd": 1200,
    "notes": "Has hit 75k-100k via CardMatch and elevated public offers; standard 60k. Lifetime once-per-product."
  },

  "annual_credits": [
    {"name": "Dining credit (Grubhub/Seamless/Buffalo Wild Wings/Five Guys/Cheesecake Factory/Wonder)", "value_usd": 120, "type": "specific", "expiration": "monthly", "ease_of_use": "medium", "notes": "$10/month, must enroll"},
    {"name": "Uber Cash", "value_usd": 120, "type": "specific", "expiration": "monthly", "ease_of_use": "easy", "notes": "$10/month, US Uber rides or Uber Eats"},
    {"name": "Resy credit", "value_usd": 100, "type": "specific", "expiration": "split_h1_h2", "ease_of_use": "medium", "notes": "$50 H1 + $50 H2; in-person dining at US Resy restaurants"},
    {"name": "Dunkin' credit", "value_usd": 84, "type": "specific", "expiration": "monthly", "ease_of_use": "hard", "notes": "$7/month at Dunkin'; only valuable if you frequent Dunkin'"}
  ],

  "ongoing_perks": [
    {"name": "Baggage insurance", "value_estimate_usd": null, "category": "travel_protection"},
    {"name": "Trip delay insurance", "value_estimate_usd": null, "category": "travel_protection", "notes": "12+ hour delay, $300 per trip"},
    {"name": "Secondary auto rental CDW", "value_estimate_usd": null, "category": "travel_protection"},
    {"name": "Purchase protection", "value_estimate_usd": null, "category": "purchase_protection"},
    {"name": "Hotel Collection benefits on 2-night+ prepaid stays", "value_estimate_usd": null, "category": "hotel_perk", "notes": "$100 hotel credit + room upgrade when available"}
  ],

  "transfer_partners_inherited_from": "amex_mr",

  "issuer_rules": [
    "Amex once-per-lifetime SUB rule per card product",
    "Pay-Over-Time on Gold (charge card with NPSL)"
  ],

  "best_for": ["heavy_dining_and_grocery", "MR_currency_anchor", "Hilton_or_Delta_transfer_users"],
  "synergies_with": ["amex_platinum", "amex_business_gold", "amex_business_platinum"],
  "competing_with_in_wallet": ["chase_sapphire_preferred", "capital_one_savor", "citi_strata_premier"],

  "breakeven_logic_notes": "AF $325. Realistic credit capture: Uber Cash $120 (easy) + Dining partners $120 (medium, ~$80 capture) + Resy $100 (medium, ~$70 capture) + Dunkin' $84 (hard, near-zero unless user) = ~$270 effective. Net AF $55-75. Beats CSP only if user spends >$10k combined dining + US grocery; otherwise CSP wins on lower AF.",

  "recently_changed": true,
  "recently_changed_date": "2025-09-29",
  "data_freshness": "2026-05-01",
  "sources": [
    "https://www.americanexpress.com/us/credit-cards/card/gold-card/",
    "https://thepointsguy.com/news/american-express-gold-refresh-2026/",
    "https://upgradedpoints.com/news/amex-gold-card-new-benefits-2026/"
  ]
}
```

## programs.json entry (amex_mr)

```json
{
  "id": "amex_mr",
  "name": "American Express Membership Rewards",
  "type": "transferable",
  "issuer": "Amex",
  "earning_cards": [
    "amex_gold",
    "amex_platinum",
    "amex_green",
    "amex_business_gold",
    "amex_business_platinum",
    "amex_blue_business_plus",
    "amex_business_green"
  ],
  "fixed_redemption_cpp": 0.6,
  "portal_redemption_cpp": 1.0,
  "portal_redemption_cpp_notes": "1cpp on flights via AmexTravel for Platinum/Business Platinum; lower for other cards. Pay With Points highly variable.",
  "transfer_partners": [
    {"partner": "Delta SkyMiles", "ratio": "1:1", "type": "airline", "min_transfer": 1000, "notes": null},
    {"partner": "Air Canada Aeroplan", "ratio": "1:1", "type": "airline", "min_transfer": 1000, "notes": null},
    {"partner": "Air France-KLM Flying Blue", "ratio": "1:1", "type": "airline", "min_transfer": 1000, "notes": null},
    {"partner": "ANA Mileage Club", "ratio": "1:1", "type": "airline", "min_transfer": 1000, "notes": null},
    {"partner": "British Airways Avios", "ratio": "1:1", "type": "airline", "min_transfer": 1000, "notes": null},
    {"partner": "Cathay Pacific Asia Miles", "ratio": "1:1", "type": "airline", "min_transfer": 1000, "notes": null},
    {"partner": "Emirates Skywards", "ratio": "1:1", "type": "airline", "min_transfer": 1000, "notes": null},
    {"partner": "Etihad Guest", "ratio": "1:1", "type": "airline", "min_transfer": 1000, "notes": null},
    {"partner": "Iberia Plus", "ratio": "1:1", "type": "airline", "min_transfer": 1000, "notes": null},
    {"partner": "JetBlue TrueBlue", "ratio": "250:200", "type": "airline", "min_transfer": 1000, "notes": "1.25:1 ratio, less favorable"},
    {"partner": "Singapore KrisFlyer", "ratio": "1:1", "type": "airline", "min_transfer": 1000, "notes": null},
    {"partner": "Virgin Atlantic Flying Club", "ratio": "1:1", "type": "airline", "min_transfer": 1000, "notes": null},
    {"partner": "Aer Lingus AerClub", "ratio": "1:1", "type": "airline", "min_transfer": 1000, "notes": null},
    {"partner": "Avianca LifeMiles", "ratio": "1:1", "type": "airline", "min_transfer": 1000, "notes": null},
    {"partner": "Qatar Privilege Club", "ratio": "1:1", "type": "airline", "min_transfer": 1000, "notes": null},
    {"partner": "Hilton Honors", "ratio": "1:2", "type": "hotel", "min_transfer": 1000, "notes": "Generally poor value"},
    {"partner": "Marriott Bonvoy", "ratio": "1:1", "type": "hotel", "min_transfer": 1000, "notes": null},
    {"partner": "Choice Privileges", "ratio": "1:1", "type": "hotel", "min_transfer": 1000, "notes": null}
  ],
  "sweet_spots": [
    {"description": "ANA round-the-world business class via Mileage Club partners (~125-180k)", "value_estimate_usd": "~5-7cpp", "source": "https://www.ana.co.jp/en/us/amc/"},
    {"description": "Virgin Atlantic Flying Club ANA business class to Japan ~95-120k r/t", "value_estimate_usd": "~5-7cpp", "source": "https://thepointsguy.com/guide/virgin-atlantic-flying-club-sweet-spots/"},
    {"description": "Avianca LifeMiles Star Alliance partners (US-Europe biz ~63k one-way)", "value_estimate_usd": "~5-6cpp", "source": "https://www.avianca.com/us/en/lifemiles/"},
    {"description": "Air France-KLM Flying Blue Promo Awards monthly", "value_estimate_usd": "~2-3cpp", "source": "https://www.flyingblue.com/"},
    {"description": "Aeroplan stopovers on Star Alliance awards", "value_estimate_usd": "~2-4cpp", "source": "https://www.aircanada.com/aeroplan/"}
  ],
  "sources": [
    "https://www.americanexpress.com/us/rewards/membership-rewards/",
    "https://thepointsguy.com/guide/maximizing-american-express-membership-rewards/"
  ]
}
```

## issuer_rules.json entry (Amex)

```json
{
  "issuer": "Amex",
  "rules": [
    {
      "id": "amex_once_per_lifetime",
      "name": "Once-per-lifetime SUB rule",
      "description": "Per card product (Gold, Platinum, Business Platinum, etc.), Amex limits the welcome bonus to once per lifetime per card_id. Pop-up message during application warns when ineligible. Variant: some product upgrades reset eligibility but reliably so.",
      "applies_to": "all_amex_cards_with_SUB",
      "official": true
    },
    {
      "id": "amex_no_app_velocity_rule",
      "name": "No formal velocity rule",
      "description": "Unlike Chase, Amex has no documented X/Y rule. However, very rapid applications (3+ in a week) can trigger fraud holds.",
      "applies_to": "all_amex_cards",
      "official": false
    },
    {
      "id": "amex_5_card_limit",
      "name": "5-card credit-card limit",
      "description": "Amex limits applicants to a maximum of 5 traditional credit cards (not charge cards) at one time. Cap'd reasonably soft on charge cards.",
      "applies_to": "amex_credit_cards",
      "official": true
    },
    {
      "id": "amex_2_apps_in_90_days",
      "name": "2/90 application velocity",
      "description": "Limit of 2 Amex card approvals in any 90-day rolling window for personal cards.",
      "applies_to": "amex_personal_cards",
      "official": false
    }
  ]
}
```

## perks_dedup.json entries

```json
[
  {
    "perk": "uber_cash",
    "card_ids": ["amex_gold", "amex_platinum"],
    "value_if_unique_usd": 120,
    "value_if_duplicate_usd": 0,
    "notes": "Both Gold ($120/yr) and Platinum ($200/yr Uber Cash + $35 Uber One) credit Uber on the same Uber account. Engine should not double-count if user holds both."
  },
  {
    "perk": "resy_credit",
    "card_ids": ["amex_gold"],
    "value_if_unique_usd": 100,
    "value_if_duplicate_usd": 0
  }
]
```

## destination_perks.json entries

```json
{
  "japan_tokyo": {
    "airline_routes_strong": ["ANA via Virgin Atlantic transfer (US-NRT/HND biz)"],
    "relevant_cards": ["amex_gold (MR transfer to Virgin Atlantic for ANA biz)"],
    "notes": "ANA biz class US-Tokyo is the iconic MR sweet spot. Requires Virgin Atlantic transfer at 1:1, 95-120k roundtrip biz."
  },
  "europe_paris_amsterdam": {
    "airline_routes_strong": ["Air France-KLM via Flying Blue Promo"],
    "relevant_cards": ["amex_gold (MR transfer to Flying Blue)"],
    "notes": "Flying Blue Promo Awards run monthly with 20-50% off; Air France-KLM Promo Rewards from US gateway cities can hit 25-35k one-way economy."
  }
}
```

## RESEARCH_NOTES.md entries

- **2025 refresh**: AF rose to $325 from $250 effective for new applicants 2025-09-29; existing cardholders move to new pricing/benefits at first renewal post-refresh. New benefits include Resy credit doubling, Dunkin' added.
- **Coupon-book grade**: Gold has crossed into Amex Plat-style coupon territory. Engine should aggressively discount face value for the Dining partners credit ($120) and Dunkin' ($84) for users who don't frequent those merchants.
- **Hilton 1:2 transfer**: A trap; never transfer MR to Hilton at 1:2. Amex points are worth more than Hilton points.
- **JetBlue 1.25:1**: Also unfavorable; transfer for redemption only when JetBlue mileage runs are demonstrably better.
- **Once-per-lifetime**: User who has held Gold (or its predecessor Premier Rewards Gold) before may not earn a new SUB. Pop-up message confirms eligibility before submitting.
