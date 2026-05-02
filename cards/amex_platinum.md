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

## card_soul.credit_score

```json
{
  "band": "excellent",
  "source": "JSON-LD CreditCard schema (annualPercentageRate 29.49%) — https://www.americanexpress.com/us/credit-cards/card/platinum/",
  "confidence": "high",
  "notes": "Issuer copy uses 'Good to Excellent' funnel language but approvals skew 720+ FICO."
}
```

## card_soul.annual_credits

```json
[
  {
    "name": "Hotel Credit (FHR / Hotel Collection)",
    "face_value_usd": 600,
    "period": "split_h1_h2",
    "ease_score": 3,
    "realistic_redemption_pct": 0.65,
    "enrollment_required": true,
    "qualifying_purchases_open_ended": false,
    "expires_if_unused": true,
    "stackable_with_other_credits": false,
    "qualifying_spend": "Prepaid FHR or 2-night+ Hotel Collection bookings via Amex Travel",
    "notes": "$300 H1 + $300 H2. THC requires 2-night minimum.",
    "source": "Get up to $300 in statement credits semi-annually for up to a total of $600 in statement credits per calendar year on prepaid Fine Hotels + Resorts® or The Hotel Collection bookings through American Express Travel — https://www.americanexpress.com/us/credit-cards/card/platinum/",
    "confidence": "high"
  },
  {
    "name": "Resy Dining Credit",
    "face_value_usd": 400,
    "period": "quarterly",
    "ease_score": 3,
    "realistic_redemption_pct": 0.70,
    "enrollment_required": true,
    "qualifying_purchases_open_ended": false,
    "expires_if_unused": true,
    "stackable_with_other_credits": false,
    "qualifying_spend": "U.S. Resy restaurants",
    "notes": "$100/quarter; harder outside top-30 metros.",
    "source": "Resy Credit, you can get up to $100 in statement credits each quarter after you use the Platinum Card to make eligible purchases with Resy — issuer page",
    "confidence": "high"
  },
  {
    "name": "Digital Entertainment Credit",
    "face_value_usd": 300,
    "period": "monthly",
    "ease_score": 3,
    "realistic_redemption_pct": 0.65,
    "enrollment_required": true,
    "qualifying_purchases_open_ended": false,
    "expires_if_unused": true,
    "stackable_with_other_credits": false,
    "qualifying_spend": "Disney+, Disney Bundle, ESPN+, Hulu, NYT, Paramount+, Peacock, WSJ, YouTube Premium, YouTube TV",
    "notes": "$25/month; eligible-partner subset only.",
    "source": "$300 Digital Entertainment Credit … Get up to $25 in statement credits each month after you pay for eligible purchases with the Platinum Card — issuer page",
    "confidence": "high"
  },
  {
    "name": "Uber Cash",
    "face_value_usd": 200,
    "period": "monthly",
    "ease_score": 5,
    "realistic_redemption_pct": 0.95,
    "enrollment_required": false,
    "qualifying_purchases_open_ended": false,
    "expires_if_unused": true,
    "stackable_with_other_credits": false,
    "qualifying_spend": "U.S. Uber rides + Uber Eats",
    "notes": "$15/mo + $20 December bonus. Basic Card Member only.",
    "source": "Receive $15 in Uber Cash each month, plus a bonus $20 in December after adding your card to your Uber account — issuer page",
    "confidence": "high"
  },
  {
    "name": "Uber One Credit",
    "face_value_usd": 120,
    "period": "monthly",
    "ease_score": 4,
    "realistic_redemption_pct": 0.85,
    "enrollment_required": true,
    "qualifying_purchases_open_ended": false,
    "expires_if_unused": true,
    "stackable_with_other_credits": false,
    "qualifying_spend": "Auto-renewing Uber One membership",
    "notes": "$10/month for Uber One subscription.",
    "source": "Up to $120 Uber One Credit … purchase an auto-renewing Uber One membership with the Card — issuer page",
    "confidence": "high"
  },
  {
    "name": "Airline Incidental Credit",
    "face_value_usd": 200,
    "period": "calendar_year",
    "ease_score": 2,
    "realistic_redemption_pct": 0.55,
    "enrollment_required": true,
    "qualifying_purchases_open_ended": false,
    "expires_if_unused": true,
    "stackable_with_other_credits": false,
    "qualifying_spend": "One selected airline; baggage / flight-change / inflight food / lounge day passes (gift cards no longer eligible)",
    "notes": "Locked to one carrier per calendar year.",
    "source": "$200 Airline Credit. Earn up to $200 in statement credits per year with one select qualifying airline — issuer page",
    "confidence": "high"
  },
  {
    "name": "CLEAR+ Membership Credit",
    "face_value_usd": 209,
    "period": "calendar_year",
    "ease_score": 5,
    "realistic_redemption_pct": 0.95,
    "enrollment_required": false,
    "qualifying_purchases_open_ended": false,
    "expires_if_unused": false,
    "stackable_with_other_credits": false,
    "qualifying_spend": "CLEAR+ membership",
    "notes": "Auto-renewing.",
    "source": "Get up to $209 in statement credits per year for a CLEAR+ membership — issuer page",
    "confidence": "high"
  },
  {
    "name": "Walmart+ Monthly Membership",
    "face_value_usd": 155,
    "period": "monthly",
    "ease_score": 5,
    "realistic_redemption_pct": 0.90,
    "enrollment_required": true,
    "qualifying_purchases_open_ended": false,
    "expires_if_unused": true,
    "stackable_with_other_credits": false,
    "qualifying_spend": "Walmart+ subscription ($12.95/mo)",
    "notes": "Covers full Walmart+ subscription each month.",
    "source": "Cover the cost of a $12.95 monthly Walmart+ membership with a statement credit — issuer page",
    "confidence": "high"
  },
  {
    "name": "Lululemon Credit",
    "face_value_usd": 300,
    "period": "quarterly",
    "ease_score": 3,
    "realistic_redemption_pct": 0.65,
    "enrollment_required": true,
    "qualifying_purchases_open_ended": false,
    "expires_if_unused": true,
    "stackable_with_other_credits": false,
    "qualifying_spend": "lululemon stores or lululemon.com (U.S.)",
    "notes": "$75/quarter. NEW post-2025-09-29 refresh.",
    "source": "$300 Lululemon Credit … Earn up to $75 back each quarter in statement credits for eligible purchases at Lululemon stores or Lululemon.com in the U.S. — FrequentMiler /amxplat/ + issuer page",
    "confidence": "high"
  },
  {
    "name": "Equinox Credit",
    "face_value_usd": 300,
    "period": "calendar_year",
    "ease_score": 1,
    "realistic_redemption_pct": 0.30,
    "enrollment_required": true,
    "qualifying_purchases_open_ended": false,
    "expires_if_unused": true,
    "stackable_with_other_credits": false,
    "qualifying_spend": "Equinox digital or club membership (auto-renewing)",
    "notes": "Restored to $300 fixed post-refresh; previously variable.",
    "source": "$300 Equinox Credit … Earn up to $300 back per year in statement credits for a digital or club membership at Equinox — FrequentMiler /amxplat/ + issuer page",
    "confidence": "high"
  },
  {
    "name": "SoulCycle At-Home Bike Credit",
    "face_value_usd": 300,
    "period": "calendar_year",
    "ease_score": 1,
    "realistic_redemption_pct": 0.10,
    "enrollment_required": true,
    "qualifying_purchases_open_ended": false,
    "expires_if_unused": true,
    "stackable_with_other_credits": false,
    "qualifying_spend": "SoulCycle at-home bike (Equinox membership required first)",
    "notes": "One-time-feeling. NEW post-2025-09-29 refresh.",
    "source": "$300 SoulCycle Credit. Must join Equinox first — FrequentMiler /amxplat/",
    "confidence": "high"
  },
  {
    "name": "Saks Fifth Avenue Credit",
    "face_value_usd": 100,
    "period": "split_h1_h2",
    "ease_score": 1,
    "realistic_redemption_pct": 0.40,
    "enrollment_required": true,
    "qualifying_purchases_open_ended": false,
    "expires_if_unused": true,
    "stackable_with_other_credits": false,
    "qualifying_spend": "Saks Fifth Avenue",
    "notes": "$50 H1 + $50 H2.",
    "source": "Up to $50 in statement credits semi-annually for purchases at Saks Fifth Avenue on your Platinum Card — issuer page",
    "confidence": "high"
  },
  {
    "name": "Oura Ring Credit",
    "face_value_usd": 200,
    "period": "calendar_year",
    "ease_score": 1,
    "realistic_redemption_pct": 0.20,
    "enrollment_required": true,
    "qualifying_purchases_open_ended": false,
    "expires_if_unused": true,
    "stackable_with_other_credits": false,
    "qualifying_spend": "Oura Ring purchase via Ouraring.com",
    "notes": "One-time per cardholder unless Oura adds a recurring tier.",
    "source": "Up to $200 in statement credits when you use the Platinum Card to purchase an Oura Ring through Ouraring.com — issuer page",
    "confidence": "high"
  },
  {
    "name": "Global Entry / TSA PreCheck",
    "face_value_usd": 120,
    "period": "every_4_years",
    "ease_score": 5,
    "realistic_redemption_pct": 0.95,
    "enrollment_required": false,
    "qualifying_purchases_open_ended": false,
    "expires_if_unused": false,
    "stackable_with_other_credits": false,
    "qualifying_spend": "GE application ($120) or TSA PreCheck (up to $85)",
    "notes": "Once per 4-year cycle.",
    "source": "Receive a statement credit after you apply for Global Entry ($120) or … TSA PreCheck — issuer page",
    "confidence": "high"
  }
]
```

## card_soul.insurance

```json
{
  "primary_source_url": "https://www.americanexpress.com/us/credit-cards/card/platinum/",
  "gtb_pdf_url": null,
  "auto_rental_cdw": {
    "available": true,
    "coverage_type": "secondary",
    "coverage_max_usd": null,
    "domestic": true,
    "international": true,
    "liability_included": false,
    "exclusions": ["exotic_cars", "antiques", "trucks", "motorcycles", "expensive_classics"],
    "notes": "Default is secondary. Premium Car Rental Protection (PCRP) is opt-in $12.25-$24.95 per rental for primary coverage.",
    "source": "This product provides secondary coverage and does not include liability coverage — issuer page",
    "confidence": "medium"
  },
  "trip_cancellation_interruption": {
    "available": true,
    "max_per_trip_usd": 10000,
    "max_per_card_per_12mo_usd": 20000,
    "underwriter": "New Hampshire Insurance Company, an AIG Company",
    "source": "Trip Cancellation and Interruption Insurance can help reimburse your non-refundable expenses purchased with the same Eligible Card, up to $10,000 per trip and up to $20,000 per Eligible Card per 12 consecutive month period — issuer page",
    "confidence": "high"
  },
  "trip_delay": {
    "available": true,
    "threshold_hours": 6,
    "max_per_ticket_usd": 500,
    "max_claims_per_12mo": 2,
    "underwriter": "AIG (NH Insurance Company)",
    "source": "If a round-trip is paid for entirely with your Eligible Card and a covered reason delays your trip more than 6 hours, Trip Delay Insurance can help reimburse certain additional expenses … up to $500 per trip, maximum 2 claims per Eligible Card per 12 consecutive month period — issuer page",
    "confidence": "high"
  },
  "baggage_delay": {
    "available": false,
    "source": "Not surfaced as a standalone benefit on issuer page; covered under historical Baggage Insurance Plan but not extracted in this run.",
    "confidence": "no_source"
  },
  "lost_baggage": {
    "available": false,
    "source": "Not surfaced on issuer page; covered under historical Baggage Insurance Plan but not extracted this run.",
    "confidence": "no_source"
  },
  "cell_phone_protection": {
    "available": true,
    "coverage_max_per_claim_usd": 800,
    "deductible_usd": 50,
    "max_claims_per_12mo": 2,
    "requires_phone_bill_paid_with_card": true,
    "enrollment_required": false,
    "source": "You can be reimbursed, the lesser of, your costs to repair or replace your damaged or Stolen cell phone for a maximum of up to $800 per claim with a limit of 2 approved claims per 12-month period when your cell phone line is listed on a wireless bill and the prior month's wireless bill was paid by an Eligible Card Account. A $50 deductible will apply to each approved claim — issuer page",
    "confidence": "high"
  },
  "emergency_evacuation_medical": {
    "available": true,
    "notes": "Premium Global Assist Hotline included. Per-incident dollar cap requires GTB PDF.",
    "source": "Premium Global Assist Hotline — issuer page benefit list",
    "confidence": "medium"
  },
  "travel_accident_insurance": {
    "available": false,
    "source": "Not listed in the 2026 benefit set on issuer page. Amex retired standalone TAI from most consumer Plat copy in the 2025 refresh.",
    "confidence": "medium"
  },
  "purchase_protection": {
    "available": true,
    "window_days": 90,
    "max_per_purchase_usd": 10000,
    "max_per_calendar_year_usd": 50000,
    "covers": ["accidental_damage", "theft", "loss"],
    "source": "Purchase Protection can help protect Covered Purchases for up to 90 days from the Covered Purchase date made on your Eligible Card when they're accidentally damaged, stolen, or lost. Up to $10,000 per Covered Purchase, up to $50,000 per calendar year — issuer page",
    "confidence": "high"
  },
  "extended_warranty": {
    "available": true,
    "extra_year_added": 1,
    "applies_to_warranties_of_max_years": 5,
    "max_per_item_usd": 10000,
    "max_per_year_usd": 50000,
    "source": "Extended Warranty can provide up to one extra year added to the Original Manufacturer's Warranty. Applies to warranties of 5 years or less. Coverage is up to the actual amount charged to your Eligible Card for the item up to a maximum of $10,000; not to exceed $50,000 per Card Member account per calendar year — issuer page",
    "confidence": "high"
  },
  "return_protection": {
    "available": true,
    "window_days": 90,
    "max_per_item_usd": 300,
    "max_per_year_usd": 1000,
    "region": "U.S. and territories only",
    "source": "Return Protection, you may return eligible purchases to American Express if the seller won't take them back up to 90 days from the date of purchase. American Express may refund the full purchase price excluding shipping and handling, up to $300 per item, up to a maximum of $1,000 per calendar year per Card account — issuer page",
    "confidence": "high"
  },
  "roadside_assistance": {
    "available": true,
    "type": "pay-per-use; arrange via Premium Roadside Assistance Hotline",
    "notes": "First-N free events per year requires GTB confirmation.",
    "source": "Premium Roadside Assistance Hotline — issuer page benefit list",
    "confidence": "medium"
  }
}
```

## card_soul.program_access

```json
[
  {
    "program_id": "centurion_lounge_network",
    "access_kind": "included",
    "overrides": {"guest_policy": "2 free guests; unlimited at $75K calendar-year spend; otherwise $50/adult, $30/child"},
    "notes": "Unlimited access; guest policy unlocks at $75K spend.",
    "source": "Unlimited access to The Centurion Lounge — issuer page",
    "confidence": "high"
  },
  {
    "program_id": "priority_pass_select",
    "access_kind": "included",
    "overrides": {"restaurants_excluded": true, "guests_free": 2},
    "notes": "Lounges only; restaurants excluded since 2019.",
    "source": "When you enroll in Priority Pass Select … Platinum Card Members can bring two accompanying guests for no charge — issuer page",
    "confidence": "high"
  },
  {
    "program_id": "delta_skyclub",
    "access_kind": "conditional",
    "overrides": {"requires_flying_delta": true, "visits_per_year": 10, "unlimited_at_spend_usd": 75000},
    "notes": "10 visits/yr when flying Delta-marketed/operated flight; unlimited at $75K Plat spend.",
    "source": "Delta Sky Club access (when flying Delta) — issuer page",
    "confidence": "high"
  },
  {
    "program_id": "fhr",
    "access_kind": "included",
    "overrides": {},
    "notes": "Plat is the canonical FHR card.",
    "source": "Hotel Credit copy + FHR program page — issuer page",
    "confidence": "high"
  },
  {
    "program_id": "amex_hotel_collection",
    "access_kind": "included",
    "overrides": {"min_nights": 2},
    "notes": "Hotel Collection bookings count toward the $600 hotel credit at 2+ nights.",
    "source": "Hotel Credit copy — issuer page",
    "confidence": "high"
  },
  {
    "program_id": "amex_global_dining_access",
    "access_kind": "included",
    "overrides": {},
    "notes": "Resy ownership + Plat tier; verify via Resy app for full features.",
    "source": "FrequentMiler /amxplat/ + Resy references — issuer page",
    "confidence": "medium"
  },
  {
    "program_id": "platinum_nights_resy",
    "access_kind": "included",
    "overrides": {},
    "notes": "Branded Resy partnership for Plat Card Members.",
    "source": "FrequentMiler /amxplat/",
    "confidence": "medium"
  },
  {
    "program_id": "amex_presale",
    "access_kind": "included",
    "overrides": {},
    "notes": "Card Members access Amex Presale Tickets.",
    "source": "Amex Special Ticket Access block — issuer page",
    "confidence": "high"
  },
  {
    "program_id": "amex_experiences",
    "access_kind": "included",
    "overrides": {},
    "notes": "Same Special Ticket Access block.",
    "source": "issuer page",
    "confidence": "high"
  },
  {"program_id": "chase_the_edit", "access_kind": "not_available", "overrides": {}, "notes": "Chase-only program.", "source": "derived", "confidence": "high"},
  {"program_id": "capital_one_premier_collection", "access_kind": "not_available", "overrides": {}, "notes": "Capital One-only.", "source": "derived", "confidence": "high"},
  {"program_id": "capital_one_lifestyle_collection", "access_kind": "not_available", "overrides": {}, "notes": "Capital One-only.", "source": "derived", "confidence": "high"},
  {"program_id": "citi_hotel_collection", "access_kind": "not_available", "overrides": {}, "notes": "Citi-only.", "source": "derived", "confidence": "high"},
  {"program_id": "visa_infinite_lhc", "access_kind": "not_available", "overrides": {}, "notes": "Plat is Amex network.", "source": "derived", "confidence": "high"},
  {"program_id": "chase_sapphire_lounge_network", "access_kind": "not_available", "overrides": {}, "notes": "Chase-only.", "source": "derived", "confidence": "high"},
  {"program_id": "capital_one_lounge_network", "access_kind": "not_available", "overrides": {}, "notes": "Capital One-only.", "source": "derived", "confidence": "high"}
]
```

## card_soul.co_brand_perks

```json
{
  "hotel_status_grants": [
    {
      "program": "marriott_bonvoy",
      "tier": "gold_elite",
      "auto_grant": true,
      "via_spend_threshold": null,
      "valid_through": "ongoing",
      "source": "Marriott Bonvoy Gold Elite status. The Basic Card Member will be enrolled in Marriott Bonvoy Gold Elite status — issuer page",
      "confidence": "high"
    },
    {
      "program": "hilton_honors",
      "tier": "gold",
      "auto_grant": false,
      "via_spend_threshold": null,
      "valid_through": "ongoing",
      "source": "Hilton Honors Gold status. Registration required — FrequentMiler /amxplat/",
      "confidence": "high"
    },
    {
      "program": "leading_hotels_of_world",
      "tier": "sterling",
      "auto_grant": false,
      "via_spend_threshold": null,
      "valid_through": "ongoing",
      "source": "Leading Hotels of the World Sterling Status. Enrollment required for some benefits — FrequentMiler /amxplat/",
      "confidence": "medium"
    }
  ],
  "rental_status_grants": [
    {
      "program": "avis",
      "tier": "preferred",
      "auto_grant": false,
      "source": "Avis Preferred status. Registration required — FrequentMiler /amxplat/",
      "confidence": "high"
    },
    {
      "program": "hertz",
      "tier": "presidents_circle",
      "auto_grant": false,
      "source": "Hertz Rental Car Privileges. Registration required — FrequentMiler /amxplat/. Tier label not surfaced on public page; long-standing Plat-tier outcome.",
      "confidence": "medium",
      "notes": "Verify tier on Hertz registration page next run."
    },
    {
      "program": "national",
      "tier": "emerald_club_executive",
      "auto_grant": false,
      "source": "FrequentMiler /amxplat/ — National listed in rental car elite trio for Plat. Tier label is historical Plat outcome.",
      "confidence": "medium"
    }
  ],
  "prepaid_hotel_credit": {
    "amount_usd_per_period": 300,
    "period": "split_h1_h2",
    "qualifying_programs": ["fhr", "amex_hotel_collection"],
    "min_nights": 2,
    "booking_channel": "American Express Travel (amextravel.com / Amex Travel App)",
    "source": "issuer page Hotel Credit copy"
  },
  "free_night_certificates": [],
  "complimentary_dashpass": {"available": false, "source": "Not offered on Plat. Confirmed by absence on issuer page."},
  "ten_pct_anniversary_bonus": {"available": false, "source": "Not offered."},
  "spend_threshold_lounge_unlock": {
    "unlock": "Unlimited Centurion guesting + unlimited Sky Club",
    "threshold_usd_per_calendar_year": 75000,
    "source": "Centurion Lounge guest policy + Delta Sky Club Plat-tier policy (cross-source; not verbatim on Plat card page in this fetch)",
    "confidence": "medium"
  },
  "welcome_offer_current_public": {
    "amount_pts": 80000,
    "spend_required_usd": 8000,
    "spend_window_months": 6,
    "source": "Earn 80,000 Membership Rewards® points after you spend $8,000 on eligible purchases on your new Card in your first 6 months of Card Membership — JSON-LD Offer block, issuer page",
    "notes": "FM cites elevated 175K via affiliate channels; baseline public is 80K. Lifetime once-per-product."
  }
}
```

## card_soul.absent_perks

```json
[
  {
    "perk_key": "chase_offers_dynamic",
    "reason": "Chase-issued benefit network; not on Amex products. Not listed at https://www.americanexpress.com/us/credit-cards/card/platinum/.",
    "workaround": "Pair with a Chase card for Chase Offers.",
    "confidence": "high"
  },
  {
    "perk_key": "lounge_buddy_pass",
    "reason": "LoungeBuddy was retired from Plat in 2023.",
    "workaround": "Use Centurion + Priority Pass + Delta Sky Club coverage.",
    "confidence": "high"
  },
  {
    "perk_key": "visa_infinite_or_signature_lhc",
    "reason": "Plat is Amex network, not Visa.",
    "workaround": "Hold a Visa Infinite card (CSR, Venture X) for LHC.",
    "confidence": "high"
  },
  {
    "perk_key": "dashpass_complimentary",
    "reason": "Not surfaced as a Plat benefit on issuer page.",
    "workaround": "CSR / CSP grant DashPass.",
    "confidence": "high"
  },
  {
    "perk_key": "anniversary_free_night",
    "reason": "Plat is not a hotel co-brand; no anniversary FNC.",
    "workaround": "Pair with Marriott Brilliant, Hilton Aspire, IHG Premier, or World of Hyatt.",
    "confidence": "high"
  },
  {
    "perk_key": "primary_auto_rental_cdw_default",
    "reason": "Default Plat auto rental coverage is secondary, per issuer page: 'This product provides secondary coverage and does not include liability coverage.'",
    "workaround": "Opt into Premium Car Rental Protection (PCRP) per rental for primary CDW; or use CSR / Venture X.",
    "confidence": "high"
  },
  {
    "perk_key": "tsa_precheck_independent_credit",
    "reason": "Same $120 every-4-years credit covers Global Entry OR TSA PreCheck — only one per cycle.",
    "workaround": "Enroll in Global Entry once; included PreCheck satisfies most travelers.",
    "confidence": "high"
  }
]
```

## card_soul.fetch_log

```
- url: https://www.americanexpress.com/us/credit-cards/card/platinum/
  status: 200
  content_type: text/html; charset=utf-8
  bytes_received: ~1,101,342
  fetched_at: 2026-05-01
  notes: Page is React SPA; content embedded in window.__INITIAL_STATE__ (Transit-encoded JSON map ~872KB) and 12 JSON-LD blocks.
- url: https://frequentmiler.com/amex-platinum-card-review/
  status: 404
  fallback: WebSearch -> https://frequentmiler.com/amxplat/
- url: https://frequentmiler.com/amxplat/
  status: 200
  bytes_received: ~533,855
- WebSearch: "Amex Platinum 2026 changes annual fee benefits refresh" — confirmed 2025-09-29 refresh, $895 AF, $3,500+ claimed value.
- WebSearch: "site:frequentmiler.com Amex Platinum review benefits" — discovered canonical FM URL /amxplat/.
```
