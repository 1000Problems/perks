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
  "transfer_unlock_card_ids": [
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

## card_soul.credit_score

```json
{
  "band": "excellent",
  "source": "Issuer page application funnel — https://www.capitalone.com/credit-cards/venture-x/",
  "confidence": "high"
}
```

## card_soul.annual_credits

```json
[
  {
    "name": "Capital One Travel Credit",
    "face_value_usd": 300,
    "period": "anniversary_year",
    "ease_score": 5,
    "realistic_redemption_pct": 0.95,
    "enrollment_required": false,
    "qualifying_purchases_open_ended": true,
    "expires_if_unused": true,
    "stackable_with_other_credits": false,
    "qualifying_spend": "Any Capital One Travel booking",
    "notes": "Easiest premium-card travel credit on the market.",
    "source": "Receive a $300 annual Capital One Travel credit — issuer page",
    "confidence": "high"
  },
  {
    "name": "Anniversary Bonus Miles",
    "face_value_usd": 200,
    "period": "anniversary_year",
    "ease_score": 5,
    "realistic_redemption_pct": 1.00,
    "enrollment_required": false,
    "qualifying_purchases_open_ended": false,
    "expires_if_unused": false,
    "stackable_with_other_credits": false,
    "qualifying_spend": null,
    "notes": "10,000 miles auto-credited; valued at ~2cpp via partner transfers ($200), $100 via portal.",
    "source": "10,000 miles anniversary bonus … starting on your first anniversary — issuer page",
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
    "qualifying_spend": "GE or TSA PreCheck application",
    "notes": "Once per 4-year cycle.",
    "source": "Global Entry or TSA PreCheck application fee credit — issuer page",
    "confidence": "high"
  }
]
```

## card_soul.insurance

```json
{
  "primary_source_url": "https://www.capitalone.com/credit-cards/venture-x/",
  "gtb_pdf_url": null,
  "auto_rental_cdw": {
    "available": true,
    "coverage_type": "primary",
    "coverage_max_usd": 75000,
    "domestic": true,
    "international": true,
    "liability_included": false,
    "exclusions": ["exotic_cars", "antiques", "off_road", "motorcycles", "large_passenger_vans"],
    "source": "Auto rental collision coverage. Get reimbursed for damage or theft when you pay for a rental car with the Venture X card — issuer page Visa Infinite block",
    "confidence": "medium"
  },
  "trip_cancellation_interruption": {
    "available": true,
    "max_per_trip_usd": 5000,
    "source": "Visa Infinite-tier; issuer page lists Trip Cancellation/Interruption — cap inherited from Visa Infinite GTB.",
    "confidence": "medium"
  },
  "trip_delay": {
    "available": true,
    "threshold_hours": 6,
    "max_per_ticket_usd": 500,
    "source": "Visa Infinite GTB inheritance; issuer page surfaces Trip Delay benefit name.",
    "confidence": "medium"
  },
  "baggage_delay": {
    "available": true,
    "threshold_hours": 6,
    "max_per_day_usd": 100,
    "max_days": 5,
    "source": "Visa Infinite GTB inheritance.",
    "confidence": "medium"
  },
  "lost_baggage": {
    "available": true,
    "max_per_trip_usd": 3000,
    "source": "Visa Infinite Lost Luggage benefit, inherited.",
    "confidence": "medium"
  },
  "cell_phone_protection": {
    "available": true,
    "coverage_max_per_claim_usd": 800,
    "deductible_usd": 50,
    "max_claims_per_12mo": 2,
    "requires_phone_bill_paid_with_card": true,
    "source": "Cell Phone Protection. Protect your cell phone every time you pay your bill with your Venture X card — issuer page",
    "confidence": "medium"
  },
  "emergency_evacuation_medical": {
    "available": true,
    "max_usd": 1000000,
    "source": "Visa Infinite GTB inheritance.",
    "confidence": "medium"
  },
  "travel_accident_insurance": {
    "available": true,
    "max_usd": 1000000,
    "source": "Visa Infinite-tier inherited.",
    "confidence": "medium"
  },
  "purchase_protection": {
    "available": false,
    "source": "Not listed on issuer page benefit grid; Capital One has historically NOT included Purchase Protection on Venture X.",
    "confidence": "high"
  },
  "extended_warranty": {
    "available": true,
    "extra_year_added": 1,
    "source": "Visa Infinite Extended Warranty Protection inheritance.",
    "confidence": "medium"
  },
  "return_protection": {
    "available": false,
    "source": "Not listed on issuer page; Visa Infinite does not standardly include Return Protection.",
    "confidence": "medium"
  },
  "roadside_assistance": {
    "available": true,
    "type": "Visa Infinite Roadside Dispatch — pay-per-event",
    "source": "Visa Infinite inheritance.",
    "confidence": "medium"
  }
}
```

## card_soul.program_access

```json
[
  {"program_id": "capital_one_lounge_network", "access_kind": "included", "overrides": {"primary_only_post_2026_02_01": true}, "notes": "Cap One Lounges + Landings.", "source": "Capital One Lounges Venture X primary cardholders can enjoy access to Capital One Lounge and Landing locations — issuer page", "confidence": "high"},
  {"program_id": "priority_pass_select", "access_kind": "included", "overrides": {"primary_only_post_2026_02_01": true, "lounges": "1,300+"}, "notes": "Lounges only; restaurants excluded per network-wide PP policy.", "source": "Venture X primary cardholders can enjoy access to 1,300+ participating lounges worldwide from Priority Pass — issuer page", "confidence": "high"},
  {"program_id": "capital_one_premier_collection", "access_kind": "included", "overrides": {"experience_credit_usd": 100, "breakfast_for_two": true}, "notes": "Premier Collection hotels + vacation rentals.", "source": "Premier Collection hotel experience credit will be applied at checkout by hotel to qualifying charges up to $100 — issuer page", "confidence": "high"},
  {"program_id": "capital_one_lifestyle_collection", "access_kind": "included", "overrides": {"experience_credit_usd": 50}, "notes": "Lifestyle Collection — no breakfast benefit.", "source": "Lifestyle Collection hotel experience credit will be applied at checkout by hotel to qualifying charges up to $50 — issuer page", "confidence": "high"},
  {"program_id": "visa_infinite_lhc", "access_kind": "included", "overrides": {}, "notes": "Card is Visa Infinite.", "source": "derived from network status", "confidence": "high"},
  {"program_id": "capital_one_entertainment", "access_kind": "included", "overrides": {"earn_5x": true}, "notes": "5x miles on Capital One Entertainment purchases.", "source": "Plus earn 5X miles on Capital One Entertainment purchases — issuer page", "confidence": "high"},
  {"program_id": "capital_one_dining", "access_kind": "included", "overrides": {}, "notes": "Cap One Dining program.", "source": "Capital One Dining program page", "confidence": "medium"},
  {"program_id": "centurion_lounge_network", "access_kind": "not_available", "overrides": {}, "notes": "Amex-only.", "source": "derived", "confidence": "high"},
  {"program_id": "chase_sapphire_lounge_network", "access_kind": "not_available", "overrides": {}, "notes": "Chase-only.", "source": "derived", "confidence": "high"},
  {"program_id": "delta_skyclub", "access_kind": "not_available", "overrides": {}, "notes": "Amex-Delta only.", "source": "derived", "confidence": "high"},
  {"program_id": "fhr", "access_kind": "not_available", "overrides": {}, "notes": "Amex-only.", "source": "derived", "confidence": "high"},
  {"program_id": "amex_hotel_collection", "access_kind": "not_available", "overrides": {}, "notes": "Amex-only.", "source": "derived", "confidence": "high"},
  {"program_id": "chase_the_edit", "access_kind": "not_available", "overrides": {}, "notes": "Chase-only.", "source": "derived", "confidence": "high"},
  {"program_id": "amex_global_dining_access", "access_kind": "not_available", "overrides": {}, "notes": "Amex-only.", "source": "derived", "confidence": "high"}
]
```

## card_soul.co_brand_perks

```json
{
  "hotel_status_grants": [],
  "rental_status_grants": [
    {"program": "hertz", "tier": "presidents_circle", "auto_grant": false, "source": "Venture X cardholders must enroll in the Hertz Gold+ status upgrade through the unique Benefits Tab … directly in or request an upgrade to Hertz President's Circle status — issuer page", "confidence": "high"}
  ],
  "premier_collection_experience_credit": {
    "amount_usd_per_booking": 100,
    "applied_at": "checkout by hotel for hotels; at booking by host for vacation rentals",
    "qualifying_program": "capital_one_premier_collection",
    "booking_channel": "Capital One Travel",
    "ancillary_perks": ["daily_breakfast_for_two_hotels_only", "complimentary_wifi", "room_upgrade_if_available", "early_checkin", "late_checkout"],
    "source": "Premier Collection hotel experience credit will be applied at checkout by hotel to qualifying charges up to $100 — issuer page"
  },
  "lifestyle_collection_experience_credit": {
    "amount_usd_per_booking": 50,
    "applied_at": "checkout by hotel",
    "qualifying_program": "capital_one_lifestyle_collection",
    "booking_channel": "Capital One Travel",
    "ancillary_perks": ["complimentary_wifi", "room_upgrade_if_available", "early_checkin", "late_checkout"],
    "source": "Lifestyle Collection hotel experience credit will be applied at checkout by hotel to qualifying charges up to $50 — issuer page"
  },
  "free_night_certificates": [],
  "complimentary_dashpass": {"available": false},
  "ten_pct_anniversary_bonus": {"available": false},
  "spend_threshold_lounge_unlock": {
    "unlock": "2 free Cap One Lounge guests + 1 free Landing guest (PP guests stay $35 each)",
    "threshold_usd_per_calendar_year": 75000,
    "effective_date": "2026-02-01",
    "source": "Free guest access is no longer available unless you spend $75,000 or more in the prior calendar year. If you hit that threshold, you'll get two free guests for Lounges and one for Landings — https://www.dailydrop.com/pages/capital-one-lounge-access-changes"
  },
  "authorized_user_lounge_fee": {
    "fee_usd_per_year": 125,
    "effective_date": "2026-02-01",
    "source": "Authorized users on the Venture X will no longer get free lounge access. You'll have to pay $125 per year (per user) — Daily Drop"
  },
  "guest_pricing_fallback": {
    "capital_one_lounge_or_landing": {"adult_18plus_usd": 45, "child_2_to_17_usd": 25, "under_2": "free"},
    "priority_pass": {"per_guest_usd": 35},
    "source": "Daily Drop"
  },
  "welcome_offer_current_public": {
    "amount_pts": 75000,
    "spend_required_usd": 4000,
    "spend_window_months": 3,
    "source": "Enjoy premium travel benefits with 75,000 bonus miles — issuer page"
  },
  "additional_cardholders": {"fee_per_au": 0, "max_aus": 4, "source": "Daily Drop comparison table"}
}
```

## card_soul.absent_perks

```json
[
  {"perk_key": "hotel_elite_status_grant", "reason": "Venture X grants no hotel elite status (no Hilton Gold, Marriott Gold, IHG Platinum, Hyatt Explorist).", "workaround": "Pair with Amex Plat (Hilton+Marriott Gold), CSR (IHG Platinum + Hyatt Explorist at $75K), or a hotel co-brand.", "confidence": "high"},
  {"perk_key": "purchase_protection", "reason": "Not listed on issuer page; Capital One has historically NOT included Purchase Protection on Venture X.", "workaround": "Pair with CSR or Plat for Purchase Protection.", "confidence": "high"},
  {"perk_key": "return_protection", "reason": "Not listed; Visa Infinite does not standardly include Return Protection.", "workaround": "Use CSR or Amex Plat.", "confidence": "medium"},
  {"perk_key": "complimentary_dashpass", "reason": "Not surfaced as a Venture X benefit.", "workaround": "Pair with CSR / CSP for DashPass.", "confidence": "high"},
  {"perk_key": "anniversary_free_night", "reason": "Venture X is not a hotel co-brand.", "workaround": "Pair with Marriott Brilliant, Hilton Aspire, IHG Premier, or World of Hyatt.", "confidence": "high"},
  {"perk_key": "free_authorized_user_lounge_access", "reason": "As of 2026-02-01, AUs no longer get free lounge access; $125/AU/yr fee required.", "workaround": "Pay $125/AU/yr per AU, or have AUs pay per-visit guest fees.", "confidence": "high"}
]
```

## card_soul.fetch_log

```
- url: https://www.capitalone.com/credit-cards/venture-x/  status: 200  bytes: ~1.05MB
- url: https://www.dailydrop.com/pages/capital-one-lounge-access-changes  status: 200  bytes: ~155K  used_for: 2026-02-01 lounge policy details
- WebSearch: "Capital One Venture X lounge access changes February 2026 guests primary"
```
