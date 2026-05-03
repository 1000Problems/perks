# American Express Green Card

`card_id`: amex_green
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "amex_green",
  "name": "American Express Green Card",
  "issuer": "Amex",
  "network": "Amex",
  "card_type": "personal",
  "category": ["mid_tier_travel"],
  "annual_fee_usd": 150,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "amex_mr",

  "earning": [
    {"category": "travel", "rate_pts_per_dollar": 3, "cap_usd_per_year": null, "notes": "Broad travel: airlines, hotels, cruises, car rentals, lodging, vacation rentals, campgrounds, transit, ride-share, parking, tolls"},
    {"category": "transit", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "restaurants_worldwide", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": 40000,
    "spend_required_usd": 3000,
    "spend_window_months": 6,
    "estimated_value_usd": 800,
    "notes": "Has hit 60k in elevated periods. Lifetime once-per-product."
  },

  "annual_credits": [
    {"name": "CLEAR+ membership credit", "signal_id": "clear_credit", "value_usd": 199, "type": "specific", "expiration": "annual", "ease_of_use": "easy"},
    {"name": "LoungeBuddy credit", "value_usd": 100, "type": "specific", "expiration": "annual", "ease_of_use": "hard", "notes": "Pay-per-visit lounge platform; many users never use"}
  ],

  "ongoing_perks": [
    {"name": "Trip delay insurance", "signal_id": "trip_insurance", "value_estimate_usd": null, "category": "travel_protection"},
    {"name": "Baggage insurance", "value_estimate_usd": null, "category": "travel_protection"}
  ],

  "transfer_partners_inherited_from": "amex_mr",

  "issuer_rules": ["Amex once-per-lifetime SUB", "Amex 2-in-90-days personal velocity"],

  "best_for": ["transit_heavy_users", "broad_travel_3x_definition", "MR_with_no_FX_at_$150"],
  "synergies_with": ["amex_gold", "amex_platinum"],
  "competing_with_in_wallet": ["chase_sapphire_preferred", "capital_one_venture"],

  "breakeven_logic_notes": "AF $150 less CLEAR+ $199 (easy) = negative effective AF if user uses CLEAR. If user already has CLEAR via Plat or other card, Green offers little vs CSP at lower AF.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": [
    "https://www.americanexpress.com/us/credit-cards/card/green/",
    "https://thepointsguy.com/credit-cards/reviews/amex-green-card-review/"
  ]
}
```

## programs.json entry
See `amex_gold.md`.

## issuer_rules.json entry
See `amex_gold.md`.

## perks_dedup.json entries
```json
[
  {
    "perk": "clear_plus",
    "card_ids": ["amex_green"],
    "value_if_unique_usd": 199,
    "value_if_duplicate_usd": 0,
    "notes": "Same CLEAR membership; redundant if user holds Plat or Business Plat."
  }
]
```

## destination_perks.json entries
None.

## RESEARCH_NOTES.md entries

- **Charge card with NPSL**: No Pre-Set Limit but Pay Over Time on certain charges.
- **Broad travel category**: Green's "travel" definition (transit, ride-share, tolls, parking) is wider than CSP/CSR which restrict transit/ride-share to "other travel" or specific Lyft tiles. Green is uniquely strong for urban commuters.
- **Out of fashion**: Green is the least-discussed MR card. Justified primarily for CLEAR + transit + travel definition combination.
- **CLEAR+ credit refresh**: Markdown lists $199; issuer page now lists $209 (matches Plat). Update to $209 in soul.
- **LoungeBuddy**: Markdown lists $100/yr LoungeBuddy credit. Issuer page makes no mention of it; LoungeBuddy was retired from Plat in 2023 and likely from Green too. Soul block marks as `available: false` pending direct confirmation.

## card_soul.credit_score

```json
{
  "band": "very_good",
  "source": "Issuer page funnel — https://www.americanexpress.com/us/credit-cards/card/green/",
  "confidence": "high",
  "notes": "Charge card with NPSL; Pay Over Time available."
}
```

## card_soul.annual_credits

```json
[
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
    "qualifying_spend": "CLEAR+ membership (subject to auto-renewal)",
    "notes": "Updated to $209 (was $199 on markdown).",
    "source": "You can cover the cost of a CLEAR Plus Membership with up to $209 in statement credits per calendar year after you pay for a CLEAR Plus Membership (subject to auto-renewal) with the American Express Green Card or the Platinum Card — issuer page",
    "confidence": "high"
  }
]
```

## card_soul.insurance

```json
{
  "primary_source_url": "https://www.americanexpress.com/us/credit-cards/card/green/",
  "gtb_pdf_url": null,
  "auto_rental_cdw": {
    "available": true,
    "coverage_type": "secondary",
    "coverage_max_usd": null,
    "domestic": true,
    "international": true,
    "liability_included": false,
    "exclusions": ["exotic_cars", "antiques", "trucks", "motorcycles"],
    "notes": "Standard Amex consumer secondary CDW.",
    "source": "Standard Amex consumer-card pattern; per-vehicle cap requires GTB PDF.",
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
    "notes": "Green-tier 12hr/$300 (lighter than Plat's 6hr/$500). Issuer page contains both Plat and Green/Gold tier copy; Green's trip delay is the 12hr/$300 variant.",
    "source": "delays your trip more than 12 hours, Trip Delay Insurance can help reimburse … up to $300 per trip, maximum 2 claims per Eligible Card per 12 consecutive month period — issuer page (Green/Gold-tier clause)",
    "confidence": "medium"
  },
  "baggage_delay": {
    "available": true,
    "notes": "Baggage Insurance Plan; per-day cap requires GTB.",
    "source": "Baggage Insurance Plan — issuer page",
    "confidence": "medium"
  },
  "lost_baggage": {
    "available": true,
    "carry_on_max_usd": 1250,
    "checked_max_usd": 500,
    "source": "Standard Amex Baggage Insurance Plan terms inherited (matches Gold).",
    "confidence": "medium"
  },
  "cell_phone_protection": {
    "available": true,
    "coverage_max_per_claim_usd": 800,
    "deductible_usd": 50,
    "max_claims_per_12mo": 2,
    "requires_phone_bill_paid_with_card": true,
    "source": "Cell Phone Protection — header confirmed on issuer page; standard Amex consumer terms.",
    "confidence": "medium"
  },
  "emergency_evacuation_medical": {
    "available": true,
    "notes": "Global Assist Hotline; medical evacuation arranged via hotline. Card Members are responsible for third-party costs.",
    "source": "Global Assist Hotline is available for 24/7 emergency assistance and coordination services, including medical and legal referrals, emergency cash wires, and missing luggage assistance — issuer page",
    "confidence": "high"
  },
  "travel_accident_insurance": {
    "available": false,
    "source": "Not surfaced on issuer page in 2026 benefit set.",
    "confidence": "medium"
  },
  "purchase_protection": {
    "available": true,
    "window_days": 90,
    "max_per_purchase_usd": 10000,
    "max_per_calendar_year_usd": 50000,
    "source": "Purchase Protection — header confirmed on issuer page; standard Amex consumer terms.",
    "confidence": "medium"
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
    "source": "Return Protection — header confirmed on issuer page; standard Amex consumer terms.",
    "confidence": "medium"
  },
  "roadside_assistance": {
    "available": false,
    "source": "Not surfaced on issuer page; Premium Roadside Assistance is a Plat-tier benefit. Green has Global Assist Hotline only.",
    "confidence": "medium"
  }
}
```

## card_soul.program_access

```json
[
  {"program_id": "amex_global_dining_access", "access_kind": "included", "overrides": {}, "notes": "Resy ownership extends to Green Card; basic Resy app perks.", "source": "issuer page Resy reference", "confidence": "medium"},
  {"program_id": "amex_presale", "access_kind": "included", "overrides": {}, "notes": "Card Members access Amex Presale Tickets.", "source": "issuer page Special Ticket Access", "confidence": "high"},
  {"program_id": "centurion_lounge_network", "access_kind": "not_available", "overrides": {}, "notes": "Plat / Biz Plat-only.", "source": "derived", "confidence": "high"},
  {"program_id": "priority_pass_select", "access_kind": "not_available", "overrides": {}, "notes": "Plat-only on Amex consumer side.", "source": "derived", "confidence": "high"},
  {"program_id": "delta_skyclub", "access_kind": "not_available", "overrides": {}, "notes": "Plat / Reserve / Biz Plat-only.", "source": "derived", "confidence": "high"},
  {"program_id": "fhr", "access_kind": "not_available", "overrides": {}, "notes": "Plat-only.", "source": "derived", "confidence": "high"},
  {"program_id": "amex_hotel_collection", "access_kind": "not_available", "overrides": {}, "notes": "Plat / Gold / Biz Plat-only.", "source": "derived", "confidence": "high"},
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
  "rental_status_grants": [],
  "prepaid_hotel_credit": null,
  "free_night_certificates": [],
  "complimentary_dashpass": {"available": false},
  "ten_pct_anniversary_bonus": {"available": false},
  "spend_threshold_lounge_unlock": null,
  "membership_rewards_pay_with_points": true,
  "welcome_offer_current_public": {
    "amount_pts": 40000,
    "spend_required_usd": 3000,
    "spend_window_months": 6,
    "source": "Markdown current; issuer page does not surface a verbatim 40K offer header — verify next run via WebSearch.",
    "notes": "Has hit 60K in elevated periods. Lifetime once-per-product.",
    "confidence": "medium"
  }
}
```

## card_soul.absent_perks

```json
[
  {"perk_key": "lounge_buddy_credit", "reason": "LoungeBuddy not surfaced on 2026 issuer page; Amex retired LoungeBuddy from Plat in 2023 and the Green-tier $100 credit appears to have followed. Markdown's $100 LoungeBuddy entry is likely stale.", "workaround": "Use Plat or Biz Plat for the Centurion + PP + Sky Club lounge stack.", "confidence": "medium"},
  {"perk_key": "centurion_lounge_access", "reason": "Plat / Biz Plat-only.", "workaround": "Hold Plat or Biz Plat.", "confidence": "high"},
  {"perk_key": "priority_pass_select", "reason": "Plat-only on Amex consumer side.", "workaround": "Hold Plat or pair with CSR.", "confidence": "high"},
  {"perk_key": "fhr_or_thc", "reason": "FHR is Plat-only; Hotel Collection is Plat/Gold/Biz Plat — Green not eligible.", "workaround": "Hold Plat or Gold for Hotel Collection.", "confidence": "high"},
  {"perk_key": "hotel_status_grant", "reason": "Green grants no hotel co-brand status.", "workaround": "Hold Plat for Marriott + Hilton Gold; or use a hotel co-brand.", "confidence": "high"},
  {"perk_key": "global_entry_credit", "reason": "GE/TSA-PreCheck credit is Plat / Biz Plat-only.", "workaround": "Pair with Plat or any premium card with GE credit.", "confidence": "high"},
  {"perk_key": "anniversary_free_night", "reason": "Green is not a hotel co-brand.", "workaround": "Pair with a hotel co-brand for FNCs.", "confidence": "high"}
]
```

## card_soul.fetch_log

```
- url: https://www.americanexpress.com/us/credit-cards/card/green/  status: 200  bytes: ~1.1MB  notes: React SPA, content in window.__INITIAL_STATE__
- WebSearch: "site:americanexpress.com Green Card official page benefits 2026"
```
