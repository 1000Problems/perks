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
  "transfer_unlock_card_ids": [
    "amex_gold",
    "amex_platinum",
    "amex_green",
    "amex_business_gold",
    "amex_business_platinum",
    "amex_blue_business_plus",
    "amex_platinum_schwab",
    "amex_platinum_morgan_stanley"
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
- **2026 spring refresh**: Hertz Five Star (NEW), $96 Uber One LTO Apr-Oct 2026, dining-credit roster updated (BWW + Wonder added), welcome bonus spend bumped to $8K from $6K.

## card_soul.credit_score

```json
{
  "band": "very_good",
  "source": "Issuer page 'Good to Excellent' application gate. Approved cardholders typically 700+ FICO. — https://www.americanexpress.com/us/credit-cards/card/gold-card/",
  "confidence": "high",
  "notes": "Gold is a charge card (NPSL); doesn't formally count toward Amex 5-credit-card cap."
}
```

## card_soul.annual_credits

```json
[
  {
    "name": "Dining Credit (Grubhub/Seamless/BWW/Five Guys/Cheesecake/Wonder)",
    "face_value_usd": 120,
    "period": "monthly",
    "ease_score": 3,
    "realistic_redemption_pct": 0.65,
    "enrollment_required": true,
    "qualifying_purchases_open_ended": false,
    "expires_if_unused": true,
    "stackable_with_other_credits": false,
    "qualifying_spend": "Grubhub (incl Seamless), Buffalo Wild Wings, Five Guys, The Cheesecake Factory, Wonder",
    "notes": "$10/month. 2026 refresh added BWW + Wonder.",
    "source": "When you pay with the Gold Card at Grubhub (including Seamless), Buffalo Wild Wings, Five Guys, The Cheesecake Factory, and Wonder. This can be an annual savings of up to $120. Enrollment required. — issuer page",
    "confidence": "high"
  },
  {
    "name": "Uber Cash",
    "face_value_usd": 120,
    "period": "monthly",
    "ease_score": 5,
    "realistic_redemption_pct": 0.95,
    "enrollment_required": false,
    "qualifying_purchases_open_ended": false,
    "expires_if_unused": true,
    "stackable_with_other_credits": false,
    "qualifying_spend": "U.S. Uber rides + Uber Eats",
    "notes": "$10/month; Basic Card Member only.",
    "source": "Get up to $120 annually in Uber Cash for U.S. rides — issuer page",
    "confidence": "high"
  },
  {
    "name": "Resy Credit",
    "face_value_usd": 100,
    "period": "split_h1_h2",
    "ease_score": 3,
    "realistic_redemption_pct": 0.65,
    "enrollment_required": true,
    "qualifying_purchases_open_ended": false,
    "expires_if_unused": true,
    "stackable_with_other_credits": false,
    "qualifying_spend": "U.S. Resy restaurants (10,000+ qualifying)",
    "notes": "$50 H1 + $50 H2.",
    "source": "Get up to $100 in statement credits each calendar year at over 10,000 qualifying U.S. Resy restaurants … $50 H1 + $50 H2 — issuer page",
    "confidence": "high"
  },
  {
    "name": "Dunkin' Credit",
    "face_value_usd": 84,
    "period": "monthly",
    "ease_score": 1,
    "realistic_redemption_pct": 0.30,
    "enrollment_required": true,
    "qualifying_purchases_open_ended": false,
    "expires_if_unused": true,
    "stackable_with_other_credits": false,
    "qualifying_spend": "U.S. Dunkin' locations",
    "notes": "$7/month; underused for non-Dunkin-regulars.",
    "source": "$7 in monthly statement credits when you pay with your Gold Card at U.S. Dunkin' locations — issuer page",
    "confidence": "high"
  },
  {
    "name": "Uber One Limited-Time Credit (2026 only)",
    "face_value_usd": 96,
    "period": "calendar_year",
    "ease_score": 3,
    "realistic_redemption_pct": 0.50,
    "enrollment_required": true,
    "qualifying_purchases_open_ended": false,
    "expires_if_unused": true,
    "stackable_with_other_credits": false,
    "qualifying_spend": "Annual Uber One membership",
    "notes": "One-time, valid Apr 30 - Oct 30 2026.",
    "source": "Holders of the American Express Gold Card will receive a one-time statement credit, up to $96, when they use their card to pay for an annual Uber One membership. This offer is available from April 30 through Oct. 30, 2026. — Amex newsroom (via WebSearch)",
    "confidence": "high"
  }
]
```

## card_soul.insurance

```json
{
  "primary_source_url": "https://www.americanexpress.com/us/credit-cards/card/gold-card/",
  "gtb_pdf_url": null,
  "auto_rental_cdw": {
    "available": true,
    "coverage_type": "secondary",
    "coverage_max_usd": null,
    "domestic": true,
    "international": true,
    "liability_included": false,
    "exclusions": ["exotic_cars", "antiques", "trucks", "motorcycles"],
    "notes": "Default secondary; PCRP opt-in for primary.",
    "source": "Standard Amex consumer secondary CDW; per-vehicle cap requires GTB PDF.",
    "confidence": "medium"
  },
  "trip_cancellation_interruption": {
    "available": true,
    "max_per_trip_usd": 10000,
    "max_per_card_per_12mo_usd": 20000,
    "underwriter": "New Hampshire Insurance Company, an AIG Company",
    "source": "Trip Cancellation and Interruption Insurance can help reimburse your non-refundable expenses … up to $10,000 per trip and up to $20,000 per Eligible Card per 12 consecutive month period — issuer page",
    "confidence": "high"
  },
  "trip_delay": {
    "available": true,
    "threshold_hours": 12,
    "max_per_trip_usd": 300,
    "max_claims_per_12mo": 2,
    "underwriter": "AIG (NH Insurance Company)",
    "notes": "Gold's 12hr/$300 is materially weaker than Plat's 6hr/$500.",
    "source": "If your trip is delayed more than 12 hours, Trip Delay Insurance can help reimburse … up to $300 per trip, maximum 2 claims per Eligible Card per 12 consecutive month period — issuer page",
    "confidence": "high"
  },
  "baggage_delay": {
    "available": true,
    "notes": "Baggage Insurance Plan; per-day cap requires GTB PDF.",
    "source": "issuer page Baggage Insurance Plan reference",
    "confidence": "medium"
  },
  "lost_baggage": {
    "available": true,
    "carry_on_max_usd": 1250,
    "checked_max_usd": 500,
    "ny_resident_aggregate_max_usd": 10000,
    "source": "Coverage can be provided for up to $1,250 for carry-on Baggage and up to $500 for checked Baggage … For New York State residents, there is a $10,000 aggregate maximum limit — issuer page",
    "confidence": "high"
  },
  "cell_phone_protection": {
    "available": true,
    "coverage_max_per_claim_usd": 800,
    "deductible_usd": 50,
    "max_claims_per_12mo": 2,
    "requires_phone_bill_paid_with_card": true,
    "source": "Cell Phone Protection — header confirmed on issuer page; standard Amex consumer terms ($800/$50/2-claims).",
    "confidence": "medium"
  },
  "emergency_evacuation_medical": {
    "available": true,
    "notes": "Premium Global Assist Hotline included.",
    "source": "issuer page Premium Global Assist reference",
    "confidence": "medium"
  },
  "travel_accident_insurance": {
    "available": false,
    "source": "Not listed in 2026 benefit set on issuer page. Amex retired standalone TAI from most consumer cards in 2025 refresh wave.",
    "confidence": "medium"
  },
  "purchase_protection": {
    "available": true,
    "window_days": 90,
    "max_per_purchase_usd": 10000,
    "max_per_calendar_year_usd": 50000,
    "source": "Purchase Protection can help protect Covered Purchases for up to 90 days … Up to $10,000 per Covered Purchase, up to $50,000 per calendar year — issuer page",
    "confidence": "high"
  },
  "extended_warranty": {
    "available": true,
    "extra_year_added": 1,
    "applies_to_warranties_of_max_years": 5,
    "max_per_item_usd": 10000,
    "max_per_year_usd": 50000,
    "source": "Extended Warranty can provide up to one extra year added to the Original Manufacturer's Warranty. Applies to warranties of 5 years or less — issuer page",
    "confidence": "high"
  },
  "return_protection": {
    "available": true,
    "window_days": 90,
    "max_per_item_usd": 300,
    "max_per_year_usd": 1000,
    "region": "U.S. and territories only",
    "source": "Return Protection … up to $300 per item, up to a maximum of $1,000 per calendar year per Card account — issuer page",
    "confidence": "high"
  },
  "roadside_assistance": {
    "available": true,
    "type": "pay-per-use; via Roadside Assistance Hotline",
    "source": "issuer page Roadside Assistance Hotline reference",
    "confidence": "medium"
  }
}
```

## card_soul.program_access

```json
[
  {"program_id": "amex_hotel_collection", "access_kind": "included", "overrides": {"min_nights": 2, "credit_usd": 100}, "notes": "$100 hotel credit at booking + room upgrade when available.", "source": "issuer page Hotel Collection block", "confidence": "high"},
  {"program_id": "amex_global_dining_access", "access_kind": "included", "overrides": {}, "notes": "Resy ownership grants Resy app perks for Gold cardholders.", "source": "issuer page Resy reference", "confidence": "medium"},
  {"program_id": "amex_presale", "access_kind": "included", "overrides": {}, "notes": "Card Members access Amex Presale Tickets.", "source": "issuer page Special Ticket Access block", "confidence": "high"},
  {"program_id": "amex_experiences", "access_kind": "included", "overrides": {}, "notes": "Same Special Ticket Access program.", "source": "issuer page", "confidence": "high"},
  {"program_id": "platinum_nights_resy", "access_kind": "not_available", "overrides": {}, "notes": "Plat-only branded variant.", "source": "derived", "confidence": "high"},
  {"program_id": "centurion_lounge_network", "access_kind": "not_available", "overrides": {}, "notes": "Plat / Biz Plat-only.", "source": "derived", "confidence": "high"},
  {"program_id": "priority_pass_select", "access_kind": "not_available", "overrides": {}, "notes": "Plat-only on Amex consumer side.", "source": "derived", "confidence": "high"},
  {"program_id": "delta_skyclub", "access_kind": "not_available", "overrides": {}, "notes": "Plat / Reserve / Biz Plat-only.", "source": "derived", "confidence": "high"},
  {"program_id": "fhr", "access_kind": "not_available", "overrides": {}, "notes": "Plat-only. Gold uses Hotel Collection.", "source": "derived", "confidence": "high"},
  {"program_id": "chase_sapphire_lounge_network", "access_kind": "not_available", "overrides": {}, "notes": "Chase-only.", "source": "derived", "confidence": "high"},
  {"program_id": "capital_one_lounge_network", "access_kind": "not_available", "overrides": {}, "notes": "Capital One-only.", "source": "derived", "confidence": "high"},
  {"program_id": "chase_the_edit", "access_kind": "not_available", "overrides": {}, "notes": "Chase-only.", "source": "derived", "confidence": "high"},
  {"program_id": "visa_infinite_lhc", "access_kind": "not_available", "overrides": {}, "notes": "Card is Amex network.", "source": "derived", "confidence": "high"}
]
```

## card_soul.co_brand_perks

```json
{
  "hotel_status_grants": [],
  "rental_status_grants": [
    {"program": "hertz", "tier": "five_star", "auto_grant": false, "via_spend_threshold": null, "valid_through": "ongoing", "source": "This is an all-new benefit to the Amex Gold: complimentary Hertz Five Star status — Amex newsroom 2026 refresh announcement (via WebSearch)", "confidence": "high"}
  ],
  "prepaid_hotel_credit": {
    "amount_usd_per_period": 100,
    "period": "calendar_year",
    "qualifying_programs": ["amex_hotel_collection"],
    "min_nights": 2,
    "booking_channel": "Amex Travel",
    "source": "issuer page Hotel Collection block; $100 hotel credit toward eligible on-property charges + room upgrade when available"
  },
  "free_night_certificates": [],
  "complimentary_dashpass": {"available": false},
  "ten_pct_anniversary_bonus": {"available": false},
  "spend_threshold_lounge_unlock": null,
  "membership_rewards_pay_with_points": true,
  "welcome_offer_current_public": {
    "amount_pts": 60000,
    "spend_required_usd": 8000,
    "spend_window_months": 6,
    "source": "Amex newsroom + WebSearch confirm 2026 refresh raised the spend requirement to $8,000 (33% increase from $6,000).",
    "notes": "Lifetime once-per-product. CardMatch / elevated public offers have hit 75K-100K.",
    "confidence": "high"
  },
  "additional_cards": {
    "fee_first_5": 0,
    "fee_per_card_after_5": 35,
    "source": "Additional Cards (up to the first 5) have a $0 annual fee. The annual fee for the sixth or more Additional Card is $35 each. — issuer page footnote"
  },
  "uber_one_2026_limited_time_credit": {
    "available": true,
    "max_usd": 96,
    "window": "April 30, 2026 - October 30, 2026",
    "source": "Holders of the American Express Gold Card will receive a one-time statement credit, up to $96, when they use their card to pay for an annual Uber One membership — Amex newsroom"
  }
}
```

## card_soul.absent_perks

```json
[
  {"perk_key": "priority_pass_select", "reason": "Gold does not include Priority Pass. PP is a Plat-tier benefit on Amex consumer side.", "workaround": "Pair with Amex Plat or CSR for PP access.", "confidence": "high"},
  {"perk_key": "centurion_lounge_access", "reason": "Centurion Lounges are Plat / Biz Plat only.", "workaround": "Pair with Amex Plat (or Biz Plat).", "confidence": "high"},
  {"perk_key": "delta_skyclub", "reason": "Plat / Reserve / Biz Plat-only when flying Delta.", "workaround": "Use Amex Plat or Delta Reserve.", "confidence": "high"},
  {"perk_key": "hotel_status_grant", "reason": "Gold grants no hotel elite status.", "workaround": "Pair with Plat for Marriott + Hilton Gold; or use a hotel co-brand.", "confidence": "high"},
  {"perk_key": "clear_plus_credit", "reason": "Clear+ credit is on Plat / Green; not Gold.", "workaround": "Hold Plat for CLEAR+, or Green if you only need CLEAR+ + transit-protection.", "confidence": "high"},
  {"perk_key": "global_entry_credit", "reason": "Gold does not include the GE/TSA-PreCheck credit.", "workaround": "Pair with Plat or any premium card with GE credit.", "confidence": "high"},
  {"perk_key": "fhr", "reason": "FHR is Plat / Biz Plat-only. Gold uses Hotel Collection (lower tier; 2-night minimum).", "workaround": "Use Hotel Collection on Gold; or pair with Plat for FHR.", "confidence": "high"}
]
```

## card_soul.fetch_log

```
- url: https://www.americanexpress.com/us/credit-cards/card/gold-card/  status: 200  bytes: ~999K
- WebSearch: "Amex Gold 2026 refresh new benefits changes annual fee" — confirmed Hertz Five Star, dining-partner roster, $96 Uber One LTO, $8K spend bump
- Amex newsroom (Tier 1 via WebSearch): https://www.americanexpress.com/en-us/newsroom/articles/products-and-services/u-s--consumer-american-express-gold--card-introduces-new-and-enh.html
```
