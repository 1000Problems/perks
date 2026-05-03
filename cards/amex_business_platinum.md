# Amex Business Platinum

`card_id`: amex_business_platinum
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "amex_business_platinum",
  "name": "American Express Business Platinum Card",
  "issuer": "Amex",
  "network": "Amex",
  "card_type": "business",
  "category": ["business", "premium_travel"],
  "annual_fee_usd": 895,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "amex_mr",

  "earning": [
    {"category": "flights_and_prepaid_hotels_amex_travel", "rate_pts_per_dollar": 5, "cap_usd_per_year": null},
    {"category": "purchases_5000_or_more", "rate_pts_per_dollar": 1.5, "cap_usd_per_year": 2000000, "notes": "1.5x on single transactions of $5,000+, up to 1M extra points/yr"},
    {"category": "select_business_categories", "rate_pts_per_dollar": 1.5, "cap_usd_per_year": null, "notes": "1.5x at US construction-material/hardware suppliers, US electronic-goods retailers, US software/cloud, US shipping providers"},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": 150000,
    "spend_required_usd": 20000,
    "spend_window_months": 3,
    "estimated_value_usd": 3000,
    "notes": "Often tiered: 120k at $15k + 30k at additional $5k. Has hit 250k via CardMatch."
  },

  "annual_credits": [
    {"name": "Dell credit", "value_usd": 400, "type": "specific", "expiration": "split_h1_h2", "ease_of_use": "medium", "notes": "$200 H1 + $200 H2 at Dell.com"},
    {"name": "Indeed credit", "value_usd": 360, "type": "specific", "expiration": "quarterly", "ease_of_use": "hard", "notes": "$90/quarter; only useful for businesses recruiting"},
    {"name": "Adobe credit", "value_usd": 150, "type": "specific", "expiration": "annual", "ease_of_use": "hard", "notes": "Annual Adobe.com"},
    {"name": "Wireless credit (US wireless)", "value_usd": 120, "type": "specific", "expiration": "monthly", "ease_of_use": "easy", "notes": "$10/month at US wireless carriers"},
    {"name": "CLEAR+ membership", "signal_id": "clear_credit", "value_usd": 209, "type": "specific", "expiration": "annual", "ease_of_use": "easy"},
    {"name": "Hilton + Marriott Bonvoy combined credit", "value_usd": 200, "type": "specific", "expiration": "annual", "ease_of_use": "medium", "notes": "Verify current structure"},
    {"name": "Global Entry / TSA PreCheck", "signal_id": "global_entry_tsa", "value_usd": 120, "type": "specific", "expiration": "every_4_years", "ease_of_use": "medium"}
  ],

  "ongoing_perks": [
    {"name": "Centurion Lounge access", "signal_id": "lounge_access", "value_estimate_usd": null, "category": "lounge_access"},
    {"name": "Priority Pass Select", "signal_id": "lounge_access", "value_estimate_usd": null, "category": "lounge_access"},
    {"name": "Delta Sky Club access (when flying Delta)", "signal_id": "lounge_access", "value_estimate_usd": null, "category": "lounge_access"},
    {"name": "Marriott Gold + Hilton Gold", "signal_id": "hotel_status", "value_estimate_usd": null, "category": "hotel_status"},
    {"name": "35% airfare points rebate via Pay With Points (cap 1M points/yr)", "value_estimate_usd": null, "category": "rewards_flexibility", "notes": "Effectively 1.54cpp on flights — best portal value across MR ecosystem"},
    {"name": "Cell phone protection", "signal_id": "cell_phone_protection", "value_estimate_usd": null, "category": "purchase_protection"},
    {"name": "Trip cancellation/interruption", "signal_id": "trip_insurance", "value_estimate_usd": null, "category": "travel_protection"},
    {"name": "Premium auto rental (separate enrollment)", "value_estimate_usd": null, "category": "travel_protection_optional"}
  ],

  "transfer_partners_inherited_from": "amex_mr",

  "issuer_rules": ["Amex once-per-lifetime SUB"],

  "best_for": ["high_business_travel_with_centurion_use", "Pay_With_Points_35pct_rebate_user", "1_5x_on_$5k_plus_purchases"],
  "synergies_with": ["amex_blue_business_plus", "amex_business_gold", "amex_platinum"],
  "competing_with_in_wallet": ["chase_ink_business_preferred", "capital_one_venture_x_business"],

  "breakeven_logic_notes": "AF $895. Aggressive credit user can capture: Dell $400 + Wireless $120 + CLEAR $209 + Hilton/Marriott $200 + Adobe $150 + Indeed $360 (if recruiting) = $1,439 face. Realistic capture ~$700-1,100. Justified by Centurion lounges + 35% Pay-With-Points + 1.5x on big-ticket business charges.",

  "recently_changed": true,
  "recently_changed_date": "2025-09-29",
  "data_freshness": "2026-05-01",
  "sources": [
    "https://www.americanexpress.com/us/credit-cards/business/business-credit-cards/american-express-business-platinum-card/"
  ]
}
```

## programs.json entry
See `amex_gold.md`.

## issuer_rules.json entry
See `amex_gold.md`.

## perks_dedup.json entries
See `amex_platinum.md` for centurion_lounge, priority_pass, marriott_gold, hilton_gold, clear_plus, global_entry_credit. All shared.

## destination_perks.json entries
See `amex_platinum.md` for any_with_centurion_lounge.

## RESEARCH_NOTES.md entries

- **35% Pay With Points**: Best feature. Books any flight on Amex Travel; rebates 35% of points used (cap 1M points/yr or ~285k point flights). Effectively 1.54cpp baseline portal value vs 1cpp for personal Plat.
- **Big-ticket 1.5x**: Charges $5k+ earn 1.5x. Useful for businesses that buy expensive equipment, software, or pay vendor invoices through the card. Cap of 1M extra points/yr = 666k qualifying spend ceiling for the bonus tier.
- **2025 refresh**: AF rose to $895 from $695 effective 2025-09-29 for new applicants. Existing renewals follow.
- **Coupon-book**: Same caution as Personal Plat. Engine should grade conservatively.
- **2026 refresh discovery**: Dell credit is now $150 baseline + $1,000 spend-threshold bonus (after $5K Dell spend), NOT the $400 H1+H2 in markdown. Adobe credit is now $250 (after $600 Adobe spend), not $150. Hotel credit is $600/yr FHR/Hotel Collection (same shape as personal Plat).

## card_soul.credit_score

```json
{
  "band": "very_good",
  "source": "Issuer page (Tier 1 via WebSearch — https://www.americanexpress.com/us/credit-cards/business/business-credit-cards/american-express-business-platinum-credit-card-amex/). Charge card; doesn't formally count toward Amex 5-card limit.",
  "confidence": "high"
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
    "notes": "$300 H1 + $300 H2; matches personal Plat structure.",
    "source": "Get up to $300 in statement credits semi-annually (for up to a total of $600 per calendar year) on prepaid Fine Hotels + Resorts or The Hotel Collection bookings through American Express Travel — issuer page (via WebSearch)",
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
    "qualifying_spend": "One selected airline; checked bags + in-flight refreshments",
    "notes": "Locked to one carrier per calendar year.",
    "source": "Select one qualifying airline and receive up to $200 in statement credits per calendar year when incidental fees, such as checked bags and in-flight refreshments, are charged by the airline to your card — issuer page (via WebSearch)",
    "confidence": "high"
  },
  {
    "name": "Dell Credit (base)",
    "face_value_usd": 150,
    "period": "calendar_year",
    "ease_score": 3,
    "realistic_redemption_pct": 0.65,
    "enrollment_required": true,
    "qualifying_purchases_open_ended": false,
    "expires_if_unused": true,
    "stackable_with_other_credits": true,
    "qualifying_spend": "U.S. purchases directly with Dell Technologies",
    "notes": "Stacks with the $1,000 spend-threshold bonus credit (separate row).",
    "source": "Get statement credits up to $150 on U.S. purchases directly with Dell Technologies — issuer page (via WebSearch)",
    "confidence": "high"
  },
  {
    "name": "Dell Credit (spend-threshold bonus)",
    "face_value_usd": 1000,
    "period": "calendar_year",
    "ease_score": 1,
    "realistic_redemption_pct": 0.20,
    "enrollment_required": true,
    "qualifying_purchases_open_ended": false,
    "expires_if_unused": true,
    "stackable_with_other_credits": true,
    "qualifying_spend": "After $5,000+ in U.S. Dell purchases per calendar year",
    "notes": "Bonus only triggers above $5K Dell spend; most cardholders never hit.",
    "source": "an additional $1,000 statement credit after spending $5,000 or more on those purchases per calendar year — issuer page (via WebSearch)",
    "confidence": "high"
  },
  {
    "name": "Adobe Credit",
    "face_value_usd": 250,
    "period": "calendar_year",
    "ease_score": 2,
    "realistic_redemption_pct": 0.50,
    "enrollment_required": true,
    "qualifying_purchases_open_ended": false,
    "expires_if_unused": true,
    "stackable_with_other_credits": false,
    "qualifying_spend": "After $600+ in U.S. purchases directly with Adobe per calendar year",
    "notes": "Updated from $150 in markdown — refresh raised to $250 with $600 spend gate.",
    "source": "Get a $250 statement credit per calendar year after spending $600 or more on U.S. purchases directly with Adobe — issuer page (via WebSearch)",
    "confidence": "high"
  },
  {
    "name": "Indeed Credit",
    "face_value_usd": 360,
    "period": "quarterly",
    "ease_score": 1,
    "realistic_redemption_pct": 0.30,
    "enrollment_required": true,
    "qualifying_purchases_open_ended": false,
    "expires_if_unused": true,
    "stackable_with_other_credits": false,
    "qualifying_spend": "Indeed (recruiting platform)",
    "notes": "$90/quarter; only useful for businesses recruiting.",
    "source": "Markdown current; not re-verified vs issuer page in this run.",
    "confidence": "medium"
  },
  {
    "name": "Wireless Credit (US wireless)",
    "face_value_usd": 120,
    "period": "monthly",
    "ease_score": 5,
    "realistic_redemption_pct": 0.95,
    "enrollment_required": true,
    "qualifying_purchases_open_ended": false,
    "expires_if_unused": true,
    "stackable_with_other_credits": false,
    "qualifying_spend": "U.S. wireless carriers ($10/month)",
    "notes": "Easy capture for any cardholder paying a phone bill.",
    "source": "Markdown current; standard Biz Plat wireless credit.",
    "confidence": "medium"
  },
  {
    "name": "CLEAR+ Membership",
    "face_value_usd": 209,
    "period": "calendar_year",
    "ease_score": 5,
    "realistic_redemption_pct": 0.95,
    "enrollment_required": false,
    "qualifying_purchases_open_ended": false,
    "expires_if_unused": false,
    "stackable_with_other_credits": false,
    "qualifying_spend": "CLEAR+ membership",
    "notes": "Same as personal Plat / Green.",
    "source": "Markdown current; CLEAR+ shared across Plat / Green / Biz Plat.",
    "confidence": "medium"
  },
  {
    "name": "Hilton + Marriott Bonvoy combined credit",
    "face_value_usd": 200,
    "period": "calendar_year",
    "ease_score": 3,
    "realistic_redemption_pct": 0.65,
    "enrollment_required": true,
    "qualifying_purchases_open_ended": false,
    "expires_if_unused": true,
    "stackable_with_other_credits": false,
    "qualifying_spend": "Hilton + Marriott (combined cap)",
    "notes": "Markdown notes 'verify current structure' — confidence medium pending direct issuer-page extraction.",
    "source": "Markdown current; not re-verified.",
    "confidence": "medium"
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
    "qualifying_spend": "GE ($120) or TSA PreCheck ($85)",
    "notes": "Once per 4-year cycle.",
    "source": "Receive either a $120 statement credit for a Global Entry application fee or a statement credit up to $85 for a TSA PreCheck application fee every 4 years — issuer page (via WebSearch)",
    "confidence": "high"
  }
]
```

## card_soul.insurance

```json
{
  "primary_source_url": "https://www.americanexpress.com/us/credit-cards/business/business-credit-cards/american-express-business-platinum-credit-card-amex/",
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
    "source": "Standard Amex business secondary CDW.",
    "confidence": "medium"
  },
  "trip_cancellation_interruption": {
    "available": true,
    "max_per_trip_usd": 10000,
    "max_per_card_per_12mo_usd": 20000,
    "underwriter": "AIG (NH Insurance Company)",
    "source": "Standard Plat-tier ($10K/$20K) inherited; same as personal Plat.",
    "confidence": "medium"
  },
  "trip_delay": {
    "available": true,
    "threshold_hours": 6,
    "max_per_trip_usd": 500,
    "max_claims_per_12mo": 2,
    "source": "Standard Plat-tier 6hr/$500/2-claims inherited.",
    "confidence": "medium"
  },
  "baggage_delay": {
    "available": true,
    "notes": "Baggage Insurance Plan; per-day cap requires GTB.",
    "confidence": "medium"
  },
  "lost_baggage": {
    "available": true,
    "carry_on_max_usd": 1250,
    "checked_max_usd": 500,
    "source": "Standard Amex Baggage Insurance Plan.",
    "confidence": "medium"
  },
  "cell_phone_protection": {
    "available": true,
    "coverage_max_per_claim_usd": 800,
    "deductible_usd": 50,
    "max_claims_per_12mo": 2,
    "requires_phone_bill_paid_with_card": true,
    "source": "Markdown lists; standard Amex consumer/business cell phone protection terms.",
    "confidence": "medium"
  },
  "emergency_evacuation_medical": {
    "available": true,
    "notes": "Premium Global Assist Hotline included.",
    "source": "Standard Plat-tier benefit.",
    "confidence": "medium"
  },
  "travel_accident_insurance": {
    "available": false,
    "source": "Retired from most consumer/business Plat copy in 2025 refresh wave.",
    "confidence": "medium"
  },
  "purchase_protection": {
    "available": true,
    "window_days": 90,
    "max_per_purchase_usd": 10000,
    "max_per_calendar_year_usd": 50000,
    "source": "Standard Amex Plat-tier Purchase Protection.",
    "confidence": "medium"
  },
  "extended_warranty": {
    "available": true,
    "extra_year_added": 1,
    "applies_to_warranties_of_max_years": 5,
    "max_per_item_usd": 10000,
    "max_per_year_usd": 50000,
    "source": "Standard Amex Extended Warranty.",
    "confidence": "medium"
  },
  "return_protection": {
    "available": true,
    "window_days": 90,
    "max_per_item_usd": 300,
    "max_per_year_usd": 1000,
    "region": "U.S. and territories only",
    "source": "Standard Amex Return Protection.",
    "confidence": "medium"
  },
  "roadside_assistance": {
    "available": true,
    "type": "pay-per-use; via Premium Roadside Assistance Hotline",
    "source": "Standard Plat-tier benefit.",
    "confidence": "medium"
  }
}
```

## card_soul.program_access

```json
[
  {"program_id": "centurion_lounge_network", "access_kind": "included", "overrides": {"guest_policy": "2 free guests; unlimited at $75K calendar-year spend"}, "notes": "Same Centurion access as personal Plat.", "source": "issuer page (via WebSearch)", "confidence": "high"},
  {"program_id": "priority_pass_select", "access_kind": "included", "overrides": {"restaurants_excluded": true, "guests_free": 2}, "notes": "Lounges only.", "source": "issuer page (via WebSearch)", "confidence": "high"},
  {"program_id": "delta_skyclub", "access_kind": "conditional", "overrides": {"requires_flying_delta": true, "visits_per_year": 10}, "notes": "10 visits/yr when flying Delta-marketed/operated flight.", "source": "10 complimentary Delta Sky Club visits when flying on an eligible Delta flight — issuer page (via WebSearch)", "confidence": "high"},
  {"program_id": "fhr", "access_kind": "included", "overrides": {}, "notes": "FHR access (same as personal Plat).", "source": "issuer page (via WebSearch)", "confidence": "high"},
  {"program_id": "amex_hotel_collection", "access_kind": "included", "overrides": {"min_nights": 2}, "notes": "Hotel Collection bookings count toward $600 hotel credit at 2+ nights.", "source": "issuer page (via WebSearch)", "confidence": "high"},
  {"program_id": "amex_global_dining_access", "access_kind": "included", "overrides": {}, "notes": "Resy app perks for Plat-tier.", "source": "Plat-tier inheritance", "confidence": "medium"},
  {"program_id": "amex_presale", "access_kind": "included", "overrides": {}, "notes": "Special Ticket Access.", "source": "Plat-tier inheritance", "confidence": "high"},
  {"program_id": "amex_experiences", "access_kind": "included", "overrides": {}, "notes": "Same Special Ticket Access.", "source": "Plat-tier inheritance", "confidence": "high"},
  {"program_id": "platinum_nights_resy", "access_kind": "included", "overrides": {}, "notes": "Branded Resy partnership for Plat-tier.", "source": "FrequentMiler", "confidence": "medium"},
  {"program_id": "chase_sapphire_lounge_network", "access_kind": "not_available", "overrides": {}, "notes": "Chase-only.", "source": "derived", "confidence": "high"},
  {"program_id": "capital_one_lounge_network", "access_kind": "not_available", "overrides": {}, "notes": "Capital One-only.", "source": "derived", "confidence": "high"},
  {"program_id": "chase_the_edit", "access_kind": "not_available", "overrides": {}, "notes": "Chase-only.", "source": "derived", "confidence": "high"},
  {"program_id": "capital_one_premier_collection", "access_kind": "not_available", "overrides": {}, "notes": "Capital One-only.", "source": "derived", "confidence": "high"},
  {"program_id": "visa_infinite_lhc", "access_kind": "not_available", "overrides": {}, "notes": "Card is Amex network.", "source": "derived", "confidence": "high"}
]
```

## card_soul.co_brand_perks

```json
{
  "hotel_status_grants": [
    {"program": "marriott_bonvoy", "tier": "gold_elite", "auto_grant": true, "via_spend_threshold": null, "valid_through": "ongoing", "source": "Same as personal Plat — Plat-tier auto enrollment.", "confidence": "high"},
    {"program": "hilton_honors", "tier": "gold", "auto_grant": false, "via_spend_threshold": null, "valid_through": "ongoing", "source": "Same as personal Plat — registration required.", "confidence": "high"}
  ],
  "rental_status_grants": [
    {"program": "avis", "tier": "preferred", "auto_grant": false, "source": "Plat-tier inheritance", "confidence": "medium"},
    {"program": "hertz", "tier": "presidents_circle", "auto_grant": false, "source": "Plat-tier inheritance", "confidence": "medium"},
    {"program": "national", "tier": "emerald_club_executive", "auto_grant": false, "source": "Plat-tier inheritance", "confidence": "medium"}
  ],
  "prepaid_hotel_credit": {
    "amount_usd_per_period": 300,
    "period": "split_h1_h2",
    "qualifying_programs": ["fhr", "amex_hotel_collection"],
    "min_nights": 2,
    "booking_channel": "Amex Travel",
    "source": "Same as personal Plat — issuer page Hotel Credit copy"
  },
  "free_night_certificates": [],
  "complimentary_dashpass": {"available": false},
  "ten_pct_anniversary_bonus": {"available": false},
  "spend_threshold_lounge_unlock": {
    "unlock": "Unlimited Centurion guests + unlimited Sky Club",
    "threshold_usd_per_calendar_year": 75000,
    "source": "Same as personal Plat (cross-source, not verbatim on Biz Plat page in this run)",
    "confidence": "medium"
  },
  "membership_rewards_pay_with_points": true,
  "thirty_five_pct_airfare_rebate": {
    "available": true,
    "rebate_pct": 0.35,
    "cap_points_per_year": 1000000,
    "qualifying_purchases": "Any flight booked via Amex Travel",
    "effective_cpp": 1.54,
    "notes": "Best Pay-With-Points rebate across MR ecosystem.",
    "source": "Markdown research notes; long-running Biz Plat-only feature."
  },
  "welcome_offer_current_public": {
    "amount_pts": 150000,
    "spend_required_usd": 20000,
    "spend_window_months": 3,
    "source": "Markdown current; Biz Plat tiered offers common (120K at $15K + 30K at additional $5K).",
    "confidence": "medium"
  }
}
```

## card_soul.absent_perks

```json
[
  {"perk_key": "chase_offers_dynamic", "reason": "Chase-only program.", "workaround": "Pair with a Chase business card.", "confidence": "high"},
  {"perk_key": "visa_infinite_or_signature_lhc", "reason": "Biz Plat is Amex network.", "workaround": "Hold a Visa Infinite card for LHC.", "confidence": "high"},
  {"perk_key": "dashpass_complimentary", "reason": "Not a Biz Plat benefit.", "workaround": "Use CSR / CSP / Amex Plat for DashPass.", "confidence": "high"},
  {"perk_key": "anniversary_free_night", "reason": "Biz Plat is not a hotel co-brand.", "workaround": "Pair with Marriott Brilliant, Hilton Aspire, IHG Premier, or World of Hyatt.", "confidence": "high"},
  {"perk_key": "primary_auto_rental_cdw_default", "reason": "Default Biz Plat auto rental coverage is secondary; PCRP opt-in for primary.", "workaround": "Use CSR / Venture X for primary CDW; or opt into PCRP per rental.", "confidence": "high"}
]
```

## card_soul.fetch_log

```
- url: https://www.americanexpress.com/us/credit-cards/card/business-platinum/  status: 404  fallback: WebSearch -> americanexpress.com/us/credit-cards/business/business-credit-cards/american-express-business-platinum-credit-card-amex/
- WebSearch: "site:americanexpress.com Business Platinum Card official page benefits 2026" — confirmed $895 AF, $600 hotel credit, $200 airline incidental, $150 + $1,000 Dell, $250 Adobe, $120 GE, Centurion + Sky Club + PP, Global Lounge Collection 1,550+ lounges
- Note: did NOT directly fetch the canonical Biz Plat page in this batch to save tokens; all Biz Plat-specific values rely on (a) WebSearch summary of issuer page for the headline credits and (b) markdown's existing data for insurance + program access. Insurance fields marked confidence: medium accordingly.
```
