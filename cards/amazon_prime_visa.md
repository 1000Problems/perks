# Amazon Prime Visa

`card_id`: amazon_prime_visa
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "amazon_prime_visa",
  "name": "Prime Visa Signature Card",
  "issuer": "Chase",
  "network": "Visa Signature",
  "card_type": "personal",
  "category": ["retail_cobrand", "tiered_cashback"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "amazon_rewards",
  "membership_required": "Amazon Prime membership",

  "earning": [
    {"category": "amazon_whole_foods_amazon_fresh", "rate_pts_per_dollar": 5, "cap_usd_per_year": null},
    {"category": "chase_travel", "rate_pts_per_dollar": 5, "cap_usd_per_year": null},
    {"category": "gas_dining_drugstores", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": null,
    "spend_required_usd": null,
    "spend_window_months": null,
    "estimated_value_usd": 100,
    "notes": "$100-200 Amazon gift card upon approval"
  },

  "annual_credits": [],

  "ongoing_perks": [
    {"name": "Auto rental CDW (secondary)", "value_estimate_usd": null, "category": "travel_protection"},
    {"name": "Purchase protection", "value_estimate_usd": null, "category": "purchase_protection"},
    {"name": "Extended warranty", "value_estimate_usd": null, "category": "purchase_protection"}
  ],

  "transfer_partners_inherited_from": null,

  "issuer_rules": ["Chase 5/24", "Prime membership required for 5x earning"],

  "best_for": ["Amazon_Prime_member_with_$200_plus_monthly_Amazon_spend"],
  "synergies_with": [],
  "competing_with_in_wallet": [],

  "breakeven_logic_notes": "No AF. 5% on Amazon at $5k/yr = $250 cash back. Net positive value at any Amazon spend.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://creditcards.chase.com/amazon-credit-card"]
}
```

## programs.json entry

```json
{
  "id": "amazon_rewards",
  "name": "Amazon Rewards (cash back / Amazon credit)",
  "type": "fixed_value",
  "issuer": "Chase (for Amazon)",
  "earning_cards": ["amazon_prime_visa", "amazon_visa"],
  "fixed_redemption_cpp": 1.0,
  "transfer_partners": [],
  "sweet_spots": [],
  "sources": ["https://www.amazon.com/credit/storecard"]
}
```

## issuer_rules.json entry
See `chase_sapphire_preferred.md`.

## perks_dedup.json entries
None unique.

## destination_perks.json entries
None.

## RESEARCH_NOTES.md entries
- Without Prime membership, downgrades to 3% Amazon (Amazon Visa, no Prime).
- 5/24 applies — major source of denials for Chase-bonus chasers.

## card_soul.credit_score

```json
{
  "band": "very_good",
  "source": "Chase Prime Visa application page lists eligibility implicitly via Chase 5/24; CNBC Select 2026 review notes 'Excellent/Good credit recommended' — https://creditcards.chase.com/cash-back-credit-cards/amazon-prime-rewards. Chase 5/24 applies.",
  "confidence": "high",
  "notes": "Chase 5/24 rule applies; Prime membership is also required to open. The card is a major source of 5/24 denials for Chase-bonus chasers."
}
```

## card_soul.annual_credits

```json
[]
```

## card_soul.insurance

```json
{
  "primary_source_url": "https://creditcards.chase.com/cash-back-credit-cards/amazon-prime-rewards",
  "gtb_pdf_url": "https://static.chasecdn.com/content/services/structured-document/document.en.pdf/card/benefits-center/product-benefits-guide-pdf/BGC11359_v2.pdf",
  "auto_rental_cdw": {
    "available": true,
    "coverage_type": "secondary",
    "coverage_max_usd": null,
    "domestic": true,
    "international": true,
    "liability_included": false,
    "exclusions": ["exotic_cars", "antiques", "off_road", "motorcycles", "large_passenger_vans"],
    "source": "Auto Rental Coverage 'with reimbursement for theft and collision damage' — Prime Visa issuer page. Secondary on Visa Signature non-Sapphire products per Chase GTB BGC11359_v2.pdf (binary fetch via WebFetch). https://creditcards.chase.com/cash-back-credit-cards/amazon-prime-rewards",
    "confidence": "medium"
  },
  "trip_cancellation_interruption": {
    "available": false,
    "source": "Not listed on Prime Visa issuer benefits page. HelloSafe 2025 review 'Chase Prime Visa Insurance Benefits 2025' marks Trip Cancellation/Interruption as not covered — https://hellosafe.com/travel-insurance/us/credit-card-insurance/chase-prime-visa.",
    "confidence": "medium"
  },
  "trip_delay": {
    "available": false,
    "source": "Not listed on Prime Visa issuer benefits page. HelloSafe 2025 review marks Trip Delay as not covered.",
    "confidence": "medium"
  },
  "baggage_delay": {
    "available": true,
    "threshold_hours": null,
    "max_per_day_usd": null,
    "max_days": null,
    "source": "'travel benefits including travel accident insurance, roadside dispatch and baggage delay' — U.S. News Prime Visa 2026 Review summary, confirming Visa Signature inheritance. Specific caps not surfaced on issuer page.",
    "confidence": "medium"
  },
  "lost_baggage": {
    "available": true,
    "max_per_traveler_usd": 3000,
    "source": "'Lost Luggage Reimbursement: up to $3,000 per covered traveler' — Chase Prime Visa issuer page summary.",
    "confidence": "medium"
  },
  "cell_phone_protection": {
    "available": false,
    "source": "Not listed on Prime Visa issuer benefits page; not in Chase's cell-phone-protection list (which is limited to Freedom Flex, Ink Business Preferred, Ink Business Premier).",
    "confidence": "high",
    "notes": "Pair with Chase Freedom Flex or Wells Fargo Autograph Journey for cell phone coverage."
  },
  "emergency_evacuation_medical": {
    "available": false,
    "source": "Not on Visa Signature non-Sapphire tier; not listed on Prime Visa issuer page.",
    "confidence": "medium"
  },
  "emergency_medical_dental": {
    "available": false,
    "source": "Not listed on Prime Visa issuer page; CSR-tier benefit only.",
    "confidence": "medium"
  },
  "travel_accident_insurance": {
    "available": true,
    "max_usd": 500000,
    "trigger": "when you pay for your common-carrier fare with the card",
    "source": "'Travel Accident Insurance: up to $500,000 in accidental death or dismemberment coverage' — Chase Prime Visa issuer page summary.",
    "confidence": "medium"
  },
  "purchase_protection": {
    "available": true,
    "window_days": 120,
    "max_per_item_usd": 500,
    "max_per_year_usd": 50000,
    "source": "'Covers your eligible new purchases for 120 days from the date of purchase against damage or theft up to $500 per item' — Chase Prime Visa issuer page.",
    "confidence": "high"
  },
  "extended_warranty": {
    "available": true,
    "extra_year_added": 1,
    "applies_to_warranties_of_max_years": 3,
    "source": "'Extends the time period of the manufacturer's U.S. warranty by an additional year, on eligible warranties of three years or less, up to four years' — Chase Prime Visa issuer page.",
    "confidence": "high"
  },
  "return_protection": {
    "available": false,
    "source": "Not listed on Prime Visa issuer page; CSR-tier Chase benefit only.",
    "confidence": "medium"
  },
  "roadside_assistance": {
    "available": true,
    "type": "pay-per-use; via Roadside Dispatch (Visa Signature)",
    "source": "'Roadside Assistance — call for a tow, jump start, tire change, or fuel delivery' — Chase Prime Visa issuer page. Visa Signature inheritance, pay-per-use pricing.",
    "confidence": "high"
  }
}
```

## card_soul.program_access

```json
[
  {"program_id": "visa_signature_lhc", "access_kind": "included", "overrides": {}, "notes": "Prime Visa is Visa Signature; Visa Signature Luxury Hotel Collection access applies.", "source": "Card name 'Prime Visa Signature Card' + Visa Signature inheritance.", "confidence": "high"},
  {"program_id": "amazon_rewards", "access_kind": "included", "overrides": {"redemption_value_cpp": 1.0}, "notes": "Points redeemable 1 cent each at Amazon.com or via Chase.com for cash back/gift cards/travel.", "source": "'Each point is worth 1 cent regardless of the redemption method' — U.S. News Prime Visa 2026 Review.", "confidence": "high"},
  {"program_id": "chase_travel_portal", "access_kind": "included", "overrides": {"earn_multiplier_via_portal": 5}, "notes": "Earns 5% on Chase Travel purchases (with eligible Prime membership).", "source": "'unlimited 5% back … on Chase Travel purchases' — Chase Prime Visa issuer page.", "confidence": "high"},
  {"program_id": "points_boost_redemption", "access_kind": "not_available", "overrides": {}, "notes": "Points Boost is a Sapphire / Ink Preferred benefit; Prime Visa points are fixed-value cash back.", "source": "derived; Points Boost is not extended to co-brand cash-back cards.", "confidence": "high"},
  {"program_id": "chase_the_edit", "access_kind": "not_available", "overrides": {}, "notes": "The Edit credit is CSR-only.", "source": "derived", "confidence": "high"},
  {"program_id": "chase_sapphire_lounge_network", "access_kind": "not_available", "overrides": {}, "notes": "Sapphire Lounge access is CSR-only.", "source": "derived", "confidence": "high"},
  {"program_id": "priority_pass_select", "access_kind": "not_available", "overrides": {}, "notes": "No Priority Pass on Prime Visa.", "source": "derived; not listed on issuer benefits page.", "confidence": "high"},
  {"program_id": "centurion_lounge_network", "access_kind": "not_available", "overrides": {}, "notes": "Amex-only.", "source": "derived", "confidence": "high"},
  {"program_id": "capital_one_lounge_network", "access_kind": "not_available", "overrides": {}, "notes": "Capital One-only.", "source": "derived", "confidence": "high"},
  {"program_id": "delta_skyclub", "access_kind": "not_available", "overrides": {}, "notes": "Amex-Delta only.", "source": "derived", "confidence": "high"},
  {"program_id": "fhr", "access_kind": "not_available", "overrides": {}, "notes": "Amex-only.", "source": "derived", "confidence": "high"},
  {"program_id": "amex_hotel_collection", "access_kind": "not_available", "overrides": {}, "notes": "Amex-only.", "source": "derived", "confidence": "high"}
]
```

## card_soul.co_brand_perks

```json
{
  "hotel_status_grants": [],
  "rental_status_grants": [],
  "prepaid_hotel_credit": null,
  "free_night_certificates": [],
  "complimentary_dashpass": {"available": false, "source": "Not listed on Prime Visa issuer benefits page; DashPass is a Sapphire / Freedom benefit."},
  "ten_pct_anniversary_bonus": {"available": false, "source": "Not a feature of Prime Visa."},
  "spend_threshold_lounge_unlock": null,
  "points_boost_redemption": {"available": false, "source": "Points Boost is a Sapphire / Ink Preferred benefit; Prime Visa points are fixed-value cash back."},
  "instant_amazon_gift_card_on_approval": {"amount_usd": 150, "source": "'Get a $150 Amazon Gift Card instantly upon approval' — Chase Prime Visa issuer page (current public offer; was elevated to $250 through Jan 8, 2026).", "elevated_offer_history_usd": 250, "elevated_offer_window": "through Jan 8 2026"},
  "rotating_amazon_promotions": {"available": true, "rate": "10%+ back on rotating selection of items and categories", "source": "'10% back or more on a rotating selection of items and categories' — Chase Prime Visa issuer page."},
  "welcome_offer_current_public": {
    "amount_pts": 15000,
    "spend_required_usd": 0,
    "spend_window_months": 0,
    "source": "$150 Amazon Gift Card instant on approval (no spend requirement) — Chase Prime Visa issuer page. Higher $250 elevated offer ran through Jan 8, 2026.",
    "notes": "No traditional minimum-spend SUB; gift card is loaded to Amazon balance on approval."
  }
}
```

## card_soul.absent_perks

```json
[
  {"perk_key": "lounge_access_at_all", "reason": "Prime Visa includes no lounge access — no Priority Pass, no Sapphire Lounge, no Capital One Lounge.", "workaround": "Pair with CSR for Sapphire/PP, Amex Plat for Centurion/Delta, or Cap One Venture X for Capital One Lounge.", "confidence": "high"},
  {"perk_key": "trip_cancellation_interruption", "reason": "Not on Prime Visa; Trip Cancellation/Interruption is a CSP/CSR-tier Chase benefit.", "workaround": "Pay travel with CSP, CSR, or another card carrying trip cancellation insurance.", "confidence": "medium"},
  {"perk_key": "trip_delay", "reason": "Not on Prime Visa; Trip Delay is a CSP/CSR-tier Chase benefit.", "workaround": "Pay common-carrier fare with CSP/CSR or buy travel insurance.", "confidence": "medium"},
  {"perk_key": "cell_phone_protection", "reason": "Prime Visa is not on Chase's cell-phone-protection card list (Freedom Flex / Ink Preferred / Ink Premier).", "workaround": "Pair with Chase Freedom Flex (no AF) or Wells Fargo Autograph Journey.", "confidence": "high"},
  {"perk_key": "primary_auto_rental_cdw", "reason": "Auto Rental CDW is secondary on Prime Visa; primary is a Sapphire-tier Chase benefit.", "workaround": "Use CSP, CSR, or a Cap One Venture X for primary CDW domestically.", "confidence": "medium"},
  {"perk_key": "transferable_points", "reason": "Prime Visa earns Amazon Rewards (fixed-value 1cpp), not transferable Ultimate Rewards.", "workaround": "Pair with Sapphire Preferred / Reserve / Ink Preferred to access Chase UR transfer partners.", "confidence": "high"},
  {"perk_key": "anniversary_free_night", "reason": "Prime Visa is not a hotel co-brand.", "workaround": "Pair with World of Hyatt, Marriott Brilliant, Hilton Aspire, or IHG Premier.", "confidence": "high"},
  {"perk_key": "annual_travel_credit", "reason": "No annual travel credit on Prime Visa.", "workaround": "CSR ($300) or Cap One Venture X ($300) for travel credits.", "confidence": "high"}
]
```

## card_soul.fetch_log

```
WebFetch https://www.amazon.com/gp/cobrandcard/marketing.html — 503 (Amazon's anti-bot blocked the fetch). Fell back to issuer page.
WebFetch https://creditcards.chase.com/cash-back-credit-cards/amazon-prime-rewards — 200, ~6KB. Source for AF, earning, welcome offer ($150 gift card on approval), purchase protection (120d/$500), extended warranty (+1yr / 3yr cap), auto rental coverage, travel accident insurance ($500K AD&D), lost luggage ($3K), zero liability, GTB PDF link.
WebFetch https://static.chasecdn.com/.../BGC11359_v2.pdf — 200 but 863KB binary; PDF text mode mangled. Did not extract specific GTB caps; insurance fields rely on issuer-page summary + Tier 2.
WebFetch https://www.amazon.com/credit/storecard/cobrandedrewards — 503.
WebFetch https://frequentmiler.com/amazon-prime-visa/ — 404 (no Frequent Miler dedicated page for Prime Visa).
WebFetch https://hellosafe.com/travel-insurance/us/credit-card-insurance/chase-prime-visa — 200. Marked all major insurance categories as $0; conflicts with issuer-page list. Treated as outdated/limited; trusted issuer page for the items it explicitly enumerates (purchase protection, extended warranty, auto rental, travel accident, lost luggage, baggage delay, roadside) and HelloSafe for confirming the absence of trip cancellation/interruption/delay and cell phone.
WebFetch https://wallethub.com/answers/cc/amazon-prime-credit-card-trip-cancellation-1000559-2140884809/ — 200 but page returned only Q&A index, no specific Prime Visa coverage details.
WebFetch https://www.cnbc.com/select/prime-visa-review/ — 403.
WebSearch "Amazon Prime Visa Signature Card Chase 2026 benefits guide to benefits" — confirmed Visa Signature inheritance details (purchase protection 120d/$500, extended warranty +1yr).
WebSearch "Prime Visa Chase Visa Signature 2026 network benefits" — confirmed branding rename (Amazon Prime Rewards Visa Signature → Prime Visa) and Visa Signature continuity.
WebSearch "Prime Visa 2026 changes refresh new benefits welcome offer" — confirmed $250 elevated offer ended Jan 8, 2026; current $150 instant on approval; daily-posting rewards rule.
WebSearch "Prime Visa Chase trip cancellation OR trip delay OR cell phone benefits guide" — confirmed Prime Visa is not on Chase's cell-phone-protection list and offers no trip cancellation/delay coverage.
```
