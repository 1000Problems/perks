# Chase Sapphire Preferred Card

`card_id`: chase_sapphire_preferred
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "chase_sapphire_preferred",
  "name": "Chase Sapphire Preferred Card",
  "issuer": "Chase",
  "network": "Visa",
  "card_type": "personal",
  "category": ["mid_tier_travel"],
  "annual_fee_usd": 95,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "chase_ur",

  "earning": [
    {"category": "travel_chase_portal", "rate_pts_per_dollar": 5, "cap_usd_per_year": null, "notes": "Chase Travel; excludes hotel purchases that earn the $50 hotel credit"},
    {"category": "dining", "rate_pts_per_dollar": 3, "cap_usd_per_year": null, "notes": "Includes eligible delivery and takeout"},
    {"category": "online_grocery", "rate_pts_per_dollar": 3, "cap_usd_per_year": null, "notes": "Excludes Walmart, Target, wholesale clubs"},
    {"category": "streaming_select", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "travel_other", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": 75000,
    "spend_required_usd": 5000,
    "spend_window_months": 3,
    "estimated_value_usd": 1500,
    "notes": "Current public offer as of 2026-05; valued at ~2cpp via Hyatt transfers"
  },

  "annual_credits": [
    {"name": "Chase Travel hotel credit", "value_usd": 50, "type": "specific", "expiration": "annual_anniversary", "ease_of_use": "medium", "notes": "Must book hotel through Chase Travel"}
  ],

  "ongoing_perks": [
    {"name": "10% anniversary points bonus", "value_estimate_usd": null, "category": "rewards_boost", "notes": "10% of prior-year purchase points each anniversary"},
    {"name": "Trip cancellation/interruption insurance", "value_estimate_usd": null, "category": "travel_protection", "notes": "Up to $10,000/person, $20,000/trip"},
    {"name": "Primary auto rental CDW", "value_estimate_usd": null, "category": "travel_protection"},
    {"name": "Trip delay reimbursement", "value_estimate_usd": null, "category": "travel_protection", "notes": "12+ hour delay or overnight, up to $500/ticket"},
    {"name": "Baggage delay insurance", "value_estimate_usd": null, "category": "travel_protection", "notes": "$100/day up to 5 days after 6-hour delay"},
    {"name": "Lost luggage reimbursement", "value_estimate_usd": null, "category": "travel_protection"},
    {"name": "DoorDash DashPass", "value_estimate_usd": 120, "category": "lifestyle", "notes": "Complimentary through Dec 31 2027 with DoorDash account activation"},
    {"name": "Purchase protection", "value_estimate_usd": null, "category": "purchase_protection", "notes": "120 days, $500/claim, $50,000/account"},
    {"name": "Extended warranty", "value_estimate_usd": null, "category": "purchase_protection"},
    {"name": "1:1 point transfers to airline/hotel partners", "value_estimate_usd": null, "category": "rewards_flexibility"}
  ],

  "transfer_partners_inherited_from": "chase_ur",

  "issuer_rules": [
    "Chase 5/24: denied if 5+ new personal-credit cards opened in last 24 months",
    "Sapphire family bonus eligibility: cannot earn SUB if currently hold any Sapphire card or have received a Sapphire SUB in last 48 months"
  ],

  "best_for": ["dining_and_travel_balance", "first_transferable_points_card", "international_travel_no_FX_fee", "Hyatt_transfer_value"],
  "synergies_with": ["chase_freedom_unlimited", "chase_freedom_flex", "chase_ink_business_preferred", "chase_ink_business_unlimited", "chase_ink_business_cash"],
  "competing_with_in_wallet": ["amex_gold", "capital_one_venture", "citi_strata_premier"],

  "breakeven_logic_notes": "AF $95, less $50 hotel credit (medium ease) = ~$45 effective. Beats 2% flat-rate card on combined dining+travel+online-grocery once category spend exceeds ~$5k/yr at 2cpp valuation; gap widens at higher Hyatt transfer valuations.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": [
    "https://creditcards.chase.com/rewards-credit-cards/sapphire/preferred",
    "https://thepointsguy.com/credit-cards/chase-sapphire-preferred-current-offer/",
    "https://upgradedpoints.com/credit-cards/reviews/chase-sapphire-preferred-card/welcome-offer-eligibility-changes/"
  ]
}
```

## programs.json entry (chase_ur)

```json
{
  "id": "chase_ur",
  "name": "Chase Ultimate Rewards",
  "type": "transferable",
  "issuer": "Chase",
  "earning_cards": [
    "chase_sapphire_preferred",
    "chase_sapphire_reserve",
    "chase_freedom_unlimited",
    "chase_freedom_flex",
    "chase_freedom_rise",
    "chase_ink_business_preferred",
    "chase_ink_business_cash",
    "chase_ink_business_unlimited",
    "chase_ink_business_premier"
  ],
  "transfer_unlock_card_ids": [
    "chase_sapphire_preferred",
    "chase_sapphire_reserve",
    "chase_ink_business_preferred"
  ],
  "fixed_redemption_cpp": 1.0,
  "portal_redemption_cpp": 1.25,
  "portal_redemption_cpp_notes": "1.25cpp on Sapphire Preferred / Ink Business Preferred via Chase Travel; Sapphire Reserve has shifted to a different points-and-cash redemption model post-2025 refresh",
  "transfer_partners": [
    {"partner": "United MileagePlus", "ratio": "1:1", "type": "airline", "min_transfer": 1000, "notes": null},
    {"partner": "Southwest Rapid Rewards", "ratio": "1:1", "type": "airline", "min_transfer": 1000, "notes": null},
    {"partner": "British Airways Avios", "ratio": "1:1", "type": "airline", "min_transfer": 1000, "notes": null},
    {"partner": "Air Canada Aeroplan", "ratio": "1:1", "type": "airline", "min_transfer": 1000, "notes": null},
    {"partner": "Air France-KLM Flying Blue", "ratio": "1:1", "type": "airline", "min_transfer": 1000, "notes": null},
    {"partner": "Virgin Atlantic Flying Club", "ratio": "1:1", "type": "airline", "min_transfer": 1000, "notes": null},
    {"partner": "Singapore KrisFlyer", "ratio": "1:1", "type": "airline", "min_transfer": 1000, "notes": null},
    {"partner": "Emirates Skywards", "ratio": "1:1", "type": "airline", "min_transfer": 1000, "notes": null},
    {"partner": "Aer Lingus AerClub", "ratio": "1:1", "type": "airline", "min_transfer": 1000, "notes": null},
    {"partner": "Iberia Plus", "ratio": "1:1", "type": "airline", "min_transfer": 1000, "notes": null},
    {"partner": "JetBlue TrueBlue", "ratio": "1:1", "type": "airline", "min_transfer": 1000, "notes": null},
    {"partner": "World of Hyatt", "ratio": "1:1", "type": "hotel", "min_transfer": 1000, "notes": "Best-value Chase UR transfer partner"},
    {"partner": "Marriott Bonvoy", "ratio": "1:1", "type": "hotel", "min_transfer": 1000, "notes": null},
    {"partner": "IHG One Rewards", "ratio": "1:1", "type": "hotel", "min_transfer": 1000, "notes": null}
  ],
  "sweet_spots": [
    {"description": "Hyatt Cat 1-4 free night 3,500-15,000 points (off-peak/standard)", "value_estimate_usd": "~3-5cpp", "source": "https://www.hyatt.com/info/world-of-hyatt-award-chart"},
    {"description": "Virgin Atlantic Flying Club ANA business class to Japan ~95-120k pts r/t", "value_estimate_usd": "~5-7cpp", "source": "https://thepointsguy.com/guide/virgin-atlantic-flying-club-sweet-spots/"},
    {"description": "Aeroplan stopovers on Star Alliance awards (5k stopover fee)", "value_estimate_usd": "~2-4cpp", "source": "https://www.aircanada.com/aeroplan/"},
    {"description": "Air France-KLM Flying Blue Promo Awards (monthly 20-50% off)", "value_estimate_usd": "~2-3cpp", "source": "https://www.flyingblue.com/"}
  ],
  "sources": [
    "https://creditcards.chase.com/rewards-credit-cards/ultimate-rewards",
    "https://thepointsguy.com/guide/maximizing-chase-ultimate-rewards/"
  ]
}
```

## issuer_rules.json entry (Chase)

```json
{
  "issuer": "Chase",
  "rules": [
    {
      "id": "chase_5_24",
      "name": "5/24 rule",
      "description": "Application denied if applicant has opened 5 or more cards across any issuer on personal credit in the last 24 months. Business cards from most issuers (including Chase) do not count toward the 5/24 count, but Chase business cards still pull personal credit and are subject to 5/24 themselves.",
      "applies_to": "all_personal_and_business_cards",
      "official": false,
      "notes": "Not in card terms but consistently enforced; verified via thousands of data points"
    },
    {
      "id": "sapphire_48_month",
      "name": "Sapphire family 48-month bonus rule",
      "description": "Cannot earn signup bonus on any Sapphire-family card if currently hold any Sapphire card OR received a Sapphire bonus in the last 48 months",
      "applies_to": ["chase_sapphire_preferred", "chase_sapphire_reserve"],
      "official": true
    },
    {
      "id": "ink_velocity",
      "name": "Ink approval velocity",
      "description": "Chase typically allows a new Ink Business card every ~90 days for established cardholders. Faster approval cadence has been documented but is not guaranteed.",
      "applies_to": "chase_ink_business_family",
      "official": false
    }
  ]
}
```

## perks_dedup.json entries contributed by this card

```json
[
  {
    "perk": "doordash_dashpass",
    "card_ids": ["chase_sapphire_preferred"],
    "value_if_unique_usd": 120,
    "value_if_duplicate_usd": 0,
    "notes": "Through 2027-12-31. Same membership across all Chase, Amex Platinum, Mastercard credit cards offering it."
  },
  {
    "perk": "primary_cdw_rental",
    "card_ids": ["chase_sapphire_preferred"],
    "value_if_unique_usd": "use_based",
    "value_if_duplicate_usd": "use_based",
    "notes": "Stacks at instance level (you choose which card to bill)."
  }
]
```

## destination_perks.json entries this card relevant to

```json
{
  "anywhere_with_hyatt": {
    "hotel_chains_strong": ["Hyatt"],
    "relevant_cards": ["chase_sapphire_preferred (UR transfer to Hyatt)"],
    "notes": "Best-known UR sweet spot. Cat 1-4 free-night certs and 3,500-15,000 point award nights at Andaz Scottsdale, Park Hyatt St. Kitts, Alila Ventana Big Sur deliver outsized value vs portal redemption."
  },
  "international_no_fx_fee": {
    "relevant_cards": ["chase_sapphire_preferred"],
    "notes": "0% foreign transaction fee + Visa network acceptance + primary CDW make CSP a default international travel card."
  }
}
```

## RESEARCH_NOTES.md entries for this card

- **2026 SUB level**: 75,000 pts / $5,000 spend / 3 months. This is elevated vs the long-running 60k baseline. Has periodically hit 80k and 100k in past public offers; expect reversion to 60k baseline at any time.
- **Sapphire Reserve refresh impact**: After the 2025 CSR refresh, the 1.25cpp portal redemption appears to have been preserved on CSP / Ink Preferred but is no longer the model on CSR itself. Verify before quoting.
- **Hyatt valuation**: Common valuations of UR at 2cpp lean heavily on Hyatt transfers. If user does not stay at Hyatt, realistic UR valuation drops to ~1.25-1.5cpp via portal/airline transfers for economy.
- **DashPass expiry**: Currently advertised through Dec 31 2027. Chase has extended this multiple times.
- **Once-per-product clarification**: The "48-month" rule is the eligibility window post-bonus-receipt. User can downgrade CSR → CSP without triggering the rule, but cannot earn a new Sapphire SUB.

## card_soul.credit_score

```json
{
  "band": "very_good",
  "source": "Issuer page application screen — https://creditcards.chase.com/rewards-credit-cards/sapphire/preferred. CSP is the entry-point Sapphire card.",
  "confidence": "high",
  "notes": "Chase 5/24 rule applies; CSP is the most 5/24-sensitive Chase product."
}
```

## card_soul.annual_credits

```json
[
  {
    "name": "Chase Travel Hotel Credit",
    "face_value_usd": 50,
    "period": "anniversary_year",
    "ease_score": 4,
    "realistic_redemption_pct": 0.85,
    "enrollment_required": false,
    "qualifying_purchases_open_ended": false,
    "expires_if_unused": true,
    "stackable_with_other_credits": false,
    "qualifying_spend": "Hotel booking via Chase Travel",
    "notes": "Must book through Chase Travel.",
    "source": "$50 Annual Chase Travel Hotel Credit — issuer page",
    "confidence": "high"
  },
  {
    "name": "DashPass Membership",
    "face_value_usd": 120,
    "period": "calendar_year",
    "ease_score": 4,
    "realistic_redemption_pct": 0.85,
    "enrollment_required": true,
    "qualifying_purchases_open_ended": false,
    "expires_if_unused": false,
    "stackable_with_other_credits": false,
    "qualifying_spend": "DashPass membership (through 12/31/2027)",
    "notes": "12-month complimentary DashPass.",
    "source": "Get a complimentary DashPass membership, a $120 value for 12 months — issuer page",
    "confidence": "high"
  },
  {
    "name": "DashPass Grocery/Retail Monthly Promo",
    "face_value_usd": 120,
    "period": "monthly",
    "ease_score": 3,
    "realistic_redemption_pct": 0.65,
    "enrollment_required": true,
    "qualifying_purchases_open_ended": false,
    "expires_if_unused": true,
    "stackable_with_other_credits": false,
    "qualifying_spend": "DoorDash groceries, retail orders, etc (through 12/31/2027)",
    "notes": "$10/month for active DashPass members. NEW finding — not in current markdown.",
    "source": "Plus, DashPass members get a $10 promo each month ($120 annually) to save on groceries, retail orders, and more through December 31, 2027 — issuer page",
    "confidence": "high"
  }
]
```

## card_soul.insurance

```json
{
  "primary_source_url": "https://creditcards.chase.com/rewards-credit-cards/sapphire/preferred",
  "gtb_pdf_url": "https://static.chasecdn.com/content/services/structured-document/document.en.pdf/card/benefits-center/product-benefits-guide-pdf/BGC11387_v2.pdf",
  "auto_rental_cdw": {
    "available": true,
    "coverage_type": "primary",
    "coverage_max_usd": 60000,
    "domestic": true,
    "international": true,
    "liability_included": false,
    "exclusions": ["exotic_cars", "antiques", "off_road", "motorcycles", "large_passenger_vans"],
    "source": "Standard CSP Visa Signature Auto Rental CDW per Chase GTB",
    "confidence": "medium"
  },
  "trip_cancellation_interruption": {
    "available": true,
    "max_per_traveler_usd": 10000,
    "max_per_trip_usd": 20000,
    "source": "Chase GTB inherits same trip cancellation/interruption tier on CSP as CSR ($10K/$20K). Markdown notes the same.",
    "confidence": "medium"
  },
  "trip_delay": {
    "available": true,
    "threshold_hours": 12,
    "max_per_traveler_usd": 500,
    "trigger_alt": "or requires an overnight stay",
    "source": "Chase GTB CSP trip delay terms; markdown documents 12hr correctly.",
    "confidence": "medium"
  },
  "baggage_delay": {
    "available": true,
    "threshold_hours": 6,
    "max_per_day_usd": 100,
    "max_days": 5,
    "source": "The baggage delay benefit applies if your baggage is delayed or misdirected for more than six hours … with a maximum benefit of $100 per day up to a maximum of five days — WebSearch summary of Chase GTB",
    "confidence": "medium"
  },
  "lost_baggage": {
    "available": true,
    "max_per_traveler_usd": 3000,
    "source": "lost luggage reimbursement providing up to $3,000 per covered traveler — WebSearch summary of Chase GTB",
    "confidence": "medium"
  },
  "cell_phone_protection": {
    "available": false,
    "source": "The Chase Sapphire Preferred does not offer cell phone insurance. — https://wallethub.com/answers/cc/chase-sapphire-preferred-cell-phone-protection-1000387-2140694744/. Confirmed by Chase's education page (CSP omitted from cell-phone-protection list).",
    "confidence": "high",
    "notes": "Markdown is correct in not listing cell phone protection."
  },
  "emergency_evacuation_medical": {
    "available": false,
    "source": "Not on CSP per CSP/CSR comparison; Emergency Evac is CSR-tier only.",
    "confidence": "medium"
  },
  "emergency_medical_dental": {
    "available": false,
    "source": "CSR-only.",
    "confidence": "medium"
  },
  "travel_accident_insurance": {
    "available": true,
    "max_usd": 500000,
    "trigger": "when you pay for your air, bus, train or cruise transportation with your card",
    "source": "travel accident insurance with up to $500,000 in accidental death or dismemberment coverage — WebSearch summary of Chase GTB",
    "confidence": "medium"
  },
  "purchase_protection": {
    "available": true,
    "window_days": 120,
    "ny_resident_window_days": 90,
    "max_per_item_usd": 500,
    "max_per_year_usd": 50000,
    "source": "CSP-tier ($500/item caps). Confidence medium pending GTB PDF confirmation.",
    "confidence": "medium"
  },
  "extended_warranty": {
    "available": true,
    "extra_year_added": 1,
    "applies_to_warranties_of_max_years": 3,
    "source": "Standard CSP Visa Signature Extended Warranty — extends manufacturer warranty by 1 year on warranties of 3 years or less.",
    "confidence": "medium"
  },
  "return_protection": {
    "available": false,
    "source": "Not listed for CSP; Return Protection is CSR-tier only.",
    "confidence": "medium"
  },
  "roadside_assistance": {
    "available": true,
    "type": "pay-per-use; via Roadside Dispatch (Visa Signature)",
    "source": "Visa Signature inheritance",
    "confidence": "medium"
  }
}
```

## card_soul.program_access

```json
[
  {"program_id": "points_boost_redemption", "access_kind": "included", "overrides": {"max_multiplier": 2}, "notes": "Up to 2x via Chase Travel Points Boost.", "source": "Up to 2X on Select Flights and Hotels through Chase Travel with Points Boost — issuer page", "confidence": "high"},
  {"program_id": "visa_signature_lhc", "access_kind": "included", "overrides": {}, "notes": "CSP is Visa Signature.", "source": "derived from network status", "confidence": "high"},
  {"program_id": "chase_the_edit", "access_kind": "not_available", "overrides": {}, "notes": "The Edit credit is CSR-only; CSP cardholders can BOOK at The Edit but get no $500 credit.", "source": "derived", "confidence": "high"},
  {"program_id": "visa_infinite_lhc", "access_kind": "not_available", "overrides": {}, "notes": "CSP is Visa Signature, not Visa Infinite.", "source": "derived", "confidence": "high"},
  {"program_id": "chase_sapphire_lounge_network", "access_kind": "not_available", "overrides": {}, "notes": "CSR-only.", "source": "derived", "confidence": "high"},
  {"program_id": "priority_pass_select", "access_kind": "not_available", "overrides": {}, "notes": "CSR-only Chase benefit.", "source": "derived", "confidence": "high"},
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
  "prepaid_hotel_credit": {
    "amount_usd_per_period": 50,
    "period": "anniversary_year",
    "qualifying_programs": ["chase_travel"],
    "min_nights": null,
    "booking_channel": "Chase Travel",
    "source": "$50 Annual Chase Travel Hotel Credit — issuer page"
  },
  "free_night_certificates": [],
  "complimentary_dashpass": {"available": true, "through": "12/31/2027", "value_usd": 120, "source": "Get a complimentary DashPass membership, a $120 value for 12 months. … when you activate by 12/31/2027 — issuer page"},
  "dashpass_grocery_retail_promo": {"amount_usd_per_month": 10, "through": "12/31/2027", "source": "DashPass members get a $10 promo each month ($120 annually) to save on groceries, retail orders, and more through December 31, 2027 — issuer page"},
  "ten_pct_anniversary_bonus": {"available": true, "rate": 0.10, "base": "total purchases made the previous year", "source": "each account anniversary you'll earn bonus points equal to 10% of your total purchases made the previous year — issuer page"},
  "spend_threshold_lounge_unlock": null,
  "points_boost_redemption": {"available": true, "max_multiplier": 2, "source": "Up to 2X on Select Flights and Hotels through Chase Travel with Points Boost — issuer page"},
  "welcome_offer_current_public": {
    "amount_pts": 75000,
    "spend_required_usd": 5000,
    "spend_window_months": 3,
    "source": "Earn 75,000 bonus points after you spend $5,000 on purchases in the first 3 months from account opening — issuer page",
    "notes": "Has hit 80K and 100K in past public offers."
  }
}
```

## card_soul.absent_perks

```json
[
  {"perk_key": "cell_phone_protection", "reason": "CSP does not include cell phone protection. Chase's education page lists Freedom Flex / Ink Business Preferred / Ink Business Premier; CSP omitted. WalletHub independently confirms.", "workaround": "Pair with Chase Freedom Flex (no AF) or Wells Fargo Autograph Journey.", "confidence": "high"},
  {"perk_key": "lounge_access_at_all", "reason": "CSP includes no lounge access — no Priority Pass, no Sapphire Lounge.", "workaround": "Upgrade to CSR for Sapphire Lounges + PP; or pair with Amex Plat / Cap One Venture X.", "confidence": "high"},
  {"perk_key": "emergency_evacuation_medical", "reason": "CSP-tier travel insurance does not include emergency evacuation; CSR has $100K Emergency Evac.", "workaround": "Use CSR; or buy travel insurance for high-risk trips.", "confidence": "medium"},
  {"perk_key": "return_protection", "reason": "CSR-tier benefit only.", "workaround": "Use CSR or Amex Plat.", "confidence": "medium"},
  {"perk_key": "hotel_status_grant", "reason": "CSP grants no hotel co-brand status.", "workaround": "Hold a hotel co-brand; or upgrade to CSR for IHG Platinum + Hyatt Explorist (at $75K spend).", "confidence": "high"},
  {"perk_key": "anniversary_free_night", "reason": "CSP is not a hotel co-brand.", "workaround": "Pair with World of Hyatt, Marriott Brilliant, Hilton Aspire, or IHG Premier.", "confidence": "high"},
  {"perk_key": "pay_yourself_back", "reason": "Retired/restructured for CSP; no longer surfaced.", "workaround": "Use Points Boost or transfer-partner redemptions.", "confidence": "medium"}
]
```

## card_soul.fetch_log

```
- url: https://creditcards.chase.com/rewards-credit-cards/sapphire/preferred  status: 200  bytes: ~999K
- url: https://www.chase.com/content/dam/cs-asset/pdf/credit-cards/sapphire-preferred-guide-to-benefits.pdf  status: 404  fallback: WebSearch -> static.chasecdn.com BGC11387_v2.pdf
- url: https://static.chasecdn.com/content/services/structured-document/document.en.pdf/card/benefits-center/product-benefits-guide-pdf/BGC11387_v2.pdf  status: 200  pdf_extract: failed (binary mangled)
- url: https://www.chase.com/personal/credit-cards/education/rewards-benefits/how-does-credit-card-cell-phone-protection-work  status: 200  used_for: confirming CSP absent from cell-phone-protection list
- url: https://wallethub.com/answers/cc/chase-sapphire-preferred-cell-phone-protection-1000387-2140694744/  status: 200  used_for: independent cell-phone-protection absence
- WebSearch: "Chase Sapphire Preferred Guide to Benefits PDF 2026 trip delay cell phone"
```
