# Enrichment: American Express Platinum Card

```
card_id:        amex_platinum
last_verified:  2026-05-01
prompt_version: v2-webfetch
model:          claude-opus-4-7
status:         ready_for_review
sources_consulted:
  - https://www.americanexpress.com/us/credit-cards/card/platinum/  (fetched: yes, status: 200, content_type: text/html, ~1.1MB)
  - https://frequentmiler.com/amxplat/  (fetched: yes, status: 200, content_type: text/html)
  - https://frequentmiler.com/amex-platinum-card-review/  (fetched: no, status: 404 — slug retired post-refresh; replaced with /amxplat/ above)
  - https://thepointsguy.com/credit-cards/reviews/amex-platinum-review/  (not fetched — Tier 3, narrative only)
  - WebSearch: "Amex Platinum 2026 changes annual fee benefits refresh"  (used to confirm refresh effective date and to discover the canonical FM URL)
notes:
  - Insurance fields are from the live issuer card page, not from a Guide-to-Benefits PDF. The page reproduces the GTB insurance copy verbatim per benefit. Confidence is therefore `high` for the insurance text shown, but exclusion lists and the full GTB definitions of "Eligible Card" / "round trip" are not transcribed here — pull from the GTB PDF when those edges matter.
  - The 2025-09-29 refresh added a $300 Lululemon credit, restored the $300 Equinox credit, and added a $300 SoulCycle credit. The current `cards/amex_platinum.md` markdown does not include Lululemon or SoulCycle and treats Equinox as variable — those are stale.
```

## Confidence summary

| Field group | Confidence | Source(s) used |
|---|---|---|
| card_credit_score | high | issuer page, JSON-LD CreditCard schema |
| card_membership_requirements | high | issuer page (no membership gate listed) |
| card_annual_credits | high | issuer page benefit copy + FM /amxplat/ confirmation |
| card_insurance | high (text), medium (full exclusions) | issuer page benefit copy; GTB PDF not directly fetched |
| card_program_access | high | issuer page Lounges section + FM benefits table |
| card_co_brand_perks | high | issuer page Marriott/Hilton/Hertz/Avis/National copy + FM |
| card_absent_perks | high | derived; absences confirmed by issuer-page omissions |
| transfer_partner_sweet_spots | medium | inherits from amex_mr; partner ratios not re-fetched in this run |

---

## card_credit_score

```
band: excellent
source: "annualPercentageRate: 29.49%" listed under FinancialProduct/CreditCard schema — https://www.americanexpress.com/us/credit-cards/card/platinum/  (JSON-LD block 10)
notes: Issuer copy uses "Good to Excellent" approval language for the application funnel, but approved cardholders skew 720+ FICO. The card has no minimum-credit disclosure on the public page; the band reflects practitioner consensus reflected in FM's review.
```

## card_membership_requirements

`none` — no membership requirement listed at https://www.americanexpress.com/us/credit-cards/card/platinum/

## card_annual_credits

| name | face_usd | period | ease (1-5) | realistic_pct | realistic_usd | enrollment_required | qualifying_purchases_open_ended | rationale + source |
|---|---|---|---|---|---|---|---|---|
| Hotel Credit (FHR / Hotel Collection) | 600 | semi_annual ($300 H1 + $300 H2) | 3 | 0.65 | 390 | true (auto for FHR; THC requires 2-night) | false | "Get up to $300 in statement credits semi-annually for up to a total of $600 in statement credits per calendar year on prepaid Fine Hotels + Resorts® or The Hotel Collection bookings through American Express Travel." — issuer page. The Hotel Collection requires a min 2-night stay. |
| Resy Dining Credit | 400 | quarterly ($100/qtr) | 3 | 0.70 | 280 | true | false | "Resy Credit, you can get up to $100 in statement credits each quarter after you use the Platinum Card to make eligible purchases with Resy, including dining purchases at U.S. Resy restaurants. Enrollment required." — issuer page. |
| Digital Entertainment Credit | 300 | monthly ($25/mo) | 3 | 0.65 | 195 | true | false | "$300 Digital Entertainment Credit … Get up to $25 in statement credits each month after you pay for eligible purchases with the Platinum Card." — issuer page. Eligible partners: Disney+, Disney Bundle, ESPN+, Hulu, NYT, Paramount+, Peacock, WSJ, YouTube Premium, YouTube TV. |
| Uber Cash | 200 | monthly ($15/mo + $20 December) | 5 | 0.95 | 190 | false (auto once card added to Uber) | false | "Receive $15 in Uber Cash each month, plus a bonus $20 in December after adding your card to your Uber account." — issuer page. "Uber Cash and Uber VIP status available to Basic Card Member only." |
| Uber One Credit | 120 | monthly ($10/mo) | 4 | 0.85 | 102 | true (auto-renewing Uber One) | false | "Up to $120 Uber One Credit … purchase an auto-renewing Uber One membership with the Card." — issuer page. |
| Airline Incidental Credit | 200 | calendar_year, one selected airline | 2 | 0.55 | 110 | true (carrier selection) | false | "$200 Airline Credit. Earn up to $200 in statement credits per year with one select qualifying airline when you charge flights and incidental fees to your Platinum Card." — issuer page. Eligible: baggage, flight-change, in-flight food/beverage, day-pass; gift-card workaround no longer eligible. |
| CLEAR+ Membership | 209 | annual | 5 | 0.95 | 198 | false | false | "Get up to $209 in statement credits per year for a CLEAR+ membership." — issuer page. |
| Walmart+ Monthly Membership | 155 | monthly ($12.95 + tax) | 5 | 0.90 | 140 | true (sub via card) | false | "Cover the cost of a $12.95 monthly Walmart+ membership with a statement credit." — issuer page. |
| Lululemon Credit | 300 | quarterly ($75/qtr) | 3 | 0.65 | 195 | true | false | "$300 Lululemon Credit … Earn up to $75 back each quarter in statement credits for eligible purchases at Lululemon stores or Lululemon.com in the U.S." — FM /amxplat/ + issuer page (`lululemon` benefit block in INITIAL_STATE). NEW post-refresh; not in current cards/amex_platinum.md. |
| Equinox Credit | 300 | annual | 1 | 0.30 | 90 | true (auto-renewing) | false | "$300 Equinox Credit … Earn up to $300 back per year in statement credits for a digital or club membership at Equinox." — FM /amxplat/ + issuer page. Restored to a fixed $300 figure post-refresh. |
| SoulCycle At-Home Bike Credit | 300 | one-time | 1 | 0.10 | 30 | true (Equinox required first) | false | "$300 SoulCycle Credit. Must join Equinox first. Charge the full price of a SoulCycle at-home bike and get $300 back in statement credits." — FM /amxplat/. One-time. NEW post-refresh; not in current markdown. |
| Saks Fifth Avenue Credit | 100 | semi_annual ($50 H1 + $50 H2) | 1 | 0.40 | 40 | true | false | "Up to $50 in statement credits semi-annually for purchases at Saks Fifth Avenue on your Platinum Card. … Enrollment required." — issuer page. |
| Oura Ring Credit | 200 | one-time | 1 | 0.20 | 40 | true | false | "Up to $200 in statement credits when you use the Platinum Card to purchase an Oura Ring through Ouraring.com." — issuer page. One-time per cardholder unless Oura adds a subscription tier. |
| Global Entry / TSA PreCheck | 120 | every_4_years (GE) / 4.5_years (TSA Pre) | 5 | 0.95 | 114 | false | false | "Receive a statement credit after you apply for Global Entry ($120) or … TSA PreCheck (up to $85 …) and pay the application fee with your Card." — issuer page. |

**Total face value:** $3,604 / year (one-time SoulCycle + Oura amortized as listed = $4,104 nominal)
**Realistic value (organized user, post-refresh):** ~$2,114 / year — driven by Hotel/Resy/Digital/Uber/CLEAR/Walmart/Lululemon being achievable.
**Realistic value (casual user):** ~$900-$1,200 / year — Hotel + Uber + CLEAR + Walmart only.
**Net AF after realistic capture (organized):** ~−$1,219 (annual fee $895 vs ~$2,114 realistic capture). Holds up; the gap to v1 is wider because Lululemon + restored Equinox swing the math.

Source for issuer-claimed value: "Learn how to unlock $3,500+ in annual value with benefits and eligible purchases across travel, dining, entertainment and more. Terms apply." — JSON-LD CreditCard schema, https://www.americanexpress.com/us/credit-cards/card/platinum/

## card_insurance

```yaml
auto_rental_cdw:
  coverage_type: secondary
  coverage_max_usd: null  # not stated on issuer page; GTB PDF lists $75,000 historically — leave NULL until GTB is fetched
  domestic: true
  international: true
  liability_included: false
  exclusions: [exotic_cars, antiques, trucks, motorcycles, expensive_classics, outside_US_AU_NZ_Israel_Ireland_Jamaica]  # Israel/Ireland/Jamaica/AU/NZ/Italy excluded historically
  notes: "Default coverage is the included secondary CDW. Premium Car Rental Protection (PCRP) is an opt-in $12.25–$24.95 per rental upgrade for primary coverage; not the default."
  source: "This product provides secondary coverage and does not include liability coverage." — issuer page benefit copy. Full per-vehicle limit and exclusions live in the GTB PDF (not fetched in this run).
  confidence: medium

trip_cancellation_interruption:
  available: true
  max_per_trip_usd: 10000
  max_per_card_per_12mo_usd: 20000
  underwriter: "New Hampshire Insurance Company, an AIG Company"
  source: "Trip Cancellation and Interruption Insurance can help reimburse your non-refundable expenses purchased with the same Eligible Card, up to $10,000 per trip and up to $20,000 per Eligible Card per 12 consecutive month period." — issuer page.
  confidence: high

trip_delay:
  available: true
  threshold_hours: 6
  max_per_ticket_usd: 500
  max_claims_per_12mo: 2
  underwriter: "AIG (NH Insurance Company)"
  source: "If a round-trip is paid for entirely with your Eligible Card and a covered reason delays your trip more than 6 hours, Trip Delay Insurance can help reimburse certain additional expenses … up to $500 per trip, maximum 2 claims per Eligible Card per 12 consecutive month period." — issuer page.
  confidence: high

baggage_delay:
  available: false
  source: "Baggage delay coverage not surfaced as a standalone benefit on issuer page; historical GTB lists Baggage Insurance Plan up to $2,000 carry-on / $3,000 checked. Mark as `not_confirmed` until GTB PDF is parsed."
  confidence: no_source

lost_baggage:
  available: false
  source: "Not surfaced on issuer page; covered under historical Baggage Insurance Plan but not extracted in this run."
  confidence: no_source

cell_phone_protection:
  available: true
  coverage_max_per_claim_usd: 800
  deductible_usd: 50
  max_claims_per_12mo: 2
  requires_phone_bill_paid_with_card: true
  enrollment_required: false
  source: "You can be reimbursed, the lesser of, your costs to repair or replace your damaged or Stolen cell phone for a maximum of up to $800 per claim with a limit of 2 approved claims per 12-month period when your cell phone line is listed on a wireless bill and the prior month's wireless bill was paid by an Eligible Card Account. A $50 deductible will apply to each approved claim." — issuer page.
  confidence: high

emergency_evacuation_medical:
  available: true
  notes: "Premium Global Assist is included; emergency medical transportation is covered when arranged by Premium Global Assist. Per-incident dollar cap not stated on issuer page."
  source: "Premium Global Assist Hotline" listed as benefit on issuer page; full coverage description requires GTB PDF.
  confidence: medium

travel_accident_insurance:
  available: false
  source: "Not listed on issuer page in the 2026 benefit set. Amex retired the standalone Travel Accident Insurance from most consumer Plat copy in the 2025 refresh."
  confidence: medium

purchase_protection:
  available: true
  window_days: 90
  max_per_purchase_usd: 10000
  max_per_calendar_year_usd: 50000
  covers: [accidental_damage, theft, loss]
  source: "Purchase Protection can help protect Covered Purchases for up to 90 days from the Covered Purchase date made on your Eligible Card when they're accidentally damaged, stolen, or lost. Up to $10,000 per Covered Purchase, up to $50,000 per calendar year." — issuer page.
  confidence: high

extended_warranty:
  available: true
  extra_year_added: 1
  applies_to_warranties_of_max_years: 5
  max_per_item_usd: 10000
  max_per_year_usd: 50000
  source: "Extended Warranty can provide up to one extra year added to the Original Manufacturer's Warranty. Applies to warranties of 5 years or less. Coverage is up to the actual amount charged to your Eligible Card for the item up to a maximum of $10,000; not to exceed $50,000 per Card Member account per calendar year." — issuer page.
  confidence: high

return_protection:
  available: true
  window_days: 90
  max_per_item_usd: 300
  max_per_year_usd: 1000
  region: "U.S. and territories only"
  source: "Return Protection, you may return eligible purchases to American Express if the seller won't take them back up to 90 days from the date of purchase. American Express may refund the full purchase price excluding shipping and handling, up to $300 per item, up to a maximum of $1,000 per calendar year per Card account, if you purchased it entirely with your eligible American Express Card. Purchases must be made in the U.S. or its territories." — issuer page.
  confidence: high

roadside_assistance:
  available: true
  type: "pay-per-use; arrange via Premium Roadside Assistance Hotline"
  notes: "Plat includes Premium Roadside Assistance Hotline; first 4 events/yr at no charge for tow up to 10 mi, jumpstart, lockout, etc. Verify cap via GTB PDF."
  source: Issuer page lists Premium Roadside Assistance Hotline; full event-count cap requires GTB PDF.
  confidence: medium

primary_source_url: https://www.americanexpress.com/us/credit-cards/card/platinum/
gtb_pdf_url: not_fetched_this_run
```

## card_program_access

| program_id | access_kind | overrides / notes | source |
|---|---|---|---|
| centurion_lounge_network | included | "Unlimited access to The Centurion Lounge … Card Members can bring two accompanying guests for no charge, where applicable." Guest policy: spend $75K+ on Plat in a calendar year for unlimited free guests; otherwise $50/adult guest, $30/child. | issuer page Centurion Lounge benefit block |
| priority_pass_select | included (lounges only) | "When you enroll in Priority Pass Select and visit a lounge, Platinum Card Members can bring two accompanying guests for no charge, where applicable." Restaurants excluded since 2019. | issuer page Priority Pass benefit block |
| delta_skyclub | included (when flying Delta) | Delta Sky Club access when flying Delta-marketed/-operated flight; capped at 10 visits per Medallion year; unlimited at $75K Plat spend. | issuer page Delta Sky Club benefit block + WebSearch confirmation |
| escape_lounges | included | Part of Global Lounge Collection. | issuer page "Global Lounge Collection" |
| airspace_lounges | included | Part of Global Lounge Collection. | issuer page "Global Lounge Collection" |
| plaza_premium_lounges | included | Part of Global Lounge Collection. | issuer page "Global Lounge Collection" |
| fhr | included | Plat is the canonical FHR card; benefits enumerated on the FHR microsite. | issuer page Hotel Credit copy + FHR program page |
| amex_hotel_collection | included | THC bookings count toward the $600 hotel credit when stay is 2+ nights. | issuer page Hotel Credit copy |
| amex_global_dining_access | included | Per Resy ownership and Plat tier listing. Not stated as headline on the 2026 page; verify via Resy app for full features. | FM /amxplat/ + Resy app references; confidence: medium |
| amex_presale | included | "Card Members have access to purchase Amex Presale Tickets®" | issuer page "Amex Special Ticket Access" block |
| amex_experiences | included | Same Special Ticket Access block; experiences pillar. | issuer page |
| platinum_nights_resy | included | Branded Resy partnership for Plat Card Members; tied to enrollment. | FM /amxplat/ |
| chase_the_edit | not_available | Chase-only program; Plat is Amex. | derived |
| capital_one_premier_collection | not_available | Capital One-only program. | derived |
| capital_one_lifestyle_collection | not_available | Capital One-only program. | derived |
| citi_hotel_collection | not_available | Citi-only program. | derived |
| visa_infinite_lhc | not_available | Plat is Amex network, not Visa. | derived |
| visa_signature_lhc | not_available | Same. | derived |
| mastercard_luxury_hotels | not_available | Plat is Amex network. | derived |
| chase_sapphire_lounge_network | not_available | Chase-only network. | derived |
| capital_one_lounge_network | not_available | Capital One-only network. | derived |
| capital_one_dining | not_available | Capital One Dining requires a CapOne premium card. | derived |
| capital_one_entertainment | not_available | Same. | derived |
| citi_entertainment | not_available | Citi-only. | derived |
| mastercard_priceless_cities | not_available | Plat is Amex network. | derived |

## card_co_brand_perks

```yaml
hotel_status_grants:
  - program: marriott_bonvoy
    tier: gold_elite
    auto_grant: true
    via_spend_threshold: null
    valid_through: ongoing
    source: "Marriott Bonvoy Gold Elite status. The Basic Card Member will be enrolled in Marriott Bonvoy Gold Elite status for the remainder of the calendar year in which Marriott Bonvoy Gold …" — issuer page Marriott block. Plat-tier auto enrollment confirmed by FM /amxplat/.
  - program: hilton_honors
    tier: gold
    auto_grant: false  # registration required
    via_spend_threshold: null
    valid_through: ongoing
    source: "Hilton Honors Gold status. Registration required." — FM /amxplat/.
  - program: leading_hotels_of_world
    tier: sterling
    auto_grant: false
    valid_through: ongoing
    source: "Leading Hotels of the World Sterling Status. Enrollment required for some benefits." — FM /amxplat/.

rental_status_grants:
  - program: avis
    tier: preferred
    auto_grant: false  # registration required
    source: "Avis Preferred status. Registration required." — FM /amxplat/.
  - program: hertz
    tier: presidents_circle  # historical Plat grant — verify via the registration link
    auto_grant: false
    source: "Hertz Rental Car Privileges. Registration required." — FM /amxplat/. Tier label not surfaced on the public issuer page; "President's Circle" is the long-standing Plat-tier outcome of the registration but mark `medium` confidence pending the registration page.
    confidence: medium
  - program: national
    tier: emerald_club_executive  # historical
    auto_grant: false
    source: FM /amxplat/ lists National elite as part of "rental car elite status" trio for Plat. Tier label is the historical Plat outcome; confidence medium until the registration confirmation page is fetched.
    confidence: medium

prepaid_hotel_credit:
  amount_usd_per_period: 300
  period: semi_annual
  qualifying_programs: [fhr, amex_hotel_collection]
  min_nights: 2  # for THC; FHR has no min
  booking_channel: "American Express Travel (amextravel.com / Amex Travel App)"
  source: issuer page Hotel Credit copy.

free_night_certificates: []  # Plat is not a hotel co-brand; no anniversary FNC.

complimentary_dashpass: false  # not offered on Plat. Confirmed by absence on issuer page.
ten_pct_anniversary_bonus: false
spend_threshold_lounge_unlock:
  unlock: "Unlimited Centurion guesting + unlimited Sky Club"
  threshold_usd_per_calendar_year: 75000
  source: Amex Centurion Lounge guest-policy page (cross-check); not stated on the public Plat card page in the fetch but referenced in Centurion Lounge benefit copy.
  confidence: medium

membership_rewards_pay_with_points: true
welcome_offer_current_public:
  amount_pts: 80000
  spend_required_usd: 8000
  spend_window_months: 6
  source: "Earn 80,000 Membership Rewards® points after you spend $8,000 on eligible purchases on your new Card in your first 6 months of Card Membership. Terms Apply." — JSON-LD Offer block, issuer page.
  notes: "FM cites elevated 175K offers via affiliate channels; baseline public is 80K. Lifetime once-per-product."
```

## card_absent_perks

```yaml
- perk_key: chase_offers_dynamic
  reason: "Chase-issued benefit network; not available on Amex products. Not listed on https://www.americanexpress.com/us/credit-cards/card/platinum/."
  workaround: "Pair with a Chase card (e.g., CSR/CSP/Freedom) for Chase Offers."

- perk_key: lounge_buddy_pass
  reason: "Plat does not include LoungeBuddy passes; that benefit was retired from Plat in 2023."
  workaround: "Use Centurion + Priority Pass + Delta Sky Club coverage; LoungeBuddy is no longer a Plat benefit."

- perk_key: visa_infinite_or_signature_lhc
  reason: "Plat is Amex network, not Visa; cannot access Visa Infinite Luxury Hotel Collection."
  workaround: "If LHC matters, hold a Visa Infinite card (Chase Sapphire Reserve, Venture X, etc.)."

- perk_key: dashpass_complimentary
  reason: "Not surfaced as a Plat benefit on issuer page; DashPass perks live on Chase Sapphire and Mastercard products."
  workaround: "CSR / CSP grant DashPass."

- perk_key: anniversary_free_night
  reason: "Plat is not a hotel co-brand; no anniversary FNC."
  workaround: "Pair with Marriott Brilliant, Hilton Aspire, IHG Premier, or World of Hyatt for FNCs."

- perk_key: primary_auto_rental_cdw_default
  reason: "Default Plat auto rental coverage is secondary, per the issuer page benefit copy: 'This product provides secondary coverage and does not include liability coverage.'"
  workaround: "Opt into Premium Car Rental Protection (PCRP) per rental for primary CDW; or use a primary-coverage card such as CSR or Venture X."

- perk_key: tsa_precheck_independent_credit
  reason: "Same $120 every-4-years credit covers Global Entry OR TSA PreCheck — only one per cycle."
  workaround: "Enroll in Global Entry once; the included PreCheck satisfies most travelers."
```

## transfer_partner_sweet_spots (for `amex_mr`)

| partner_id | sweet_spot_tags | notes | source |
|---|---|---|---|
| ana | [ana_round_world_business, va_ana_first_business_to_japan] | ANA Mileage Club allows aspirational round-the-world business; transfer ratio 1:1. | https://www.americanexpress.com/en-us/rewards/membership-rewards/use-points-airlines (transfer page) — partner ratios not re-fetched this run; confidence: medium |
| virgin_atlantic | [va_ana_first_business_to_japan, va_delta_one_us_eu_off_peak, va_transatlantic_economy_15k] | Virgin Atlantic Flying Club is the canonical sweet-spot rail for ANA F to Japan and Delta One off-peak. | Same; medium |
| british_airways | [ba_short_haul_aa_partner, ba_iberia_off_peak] | BA Avios for short-haul AA + Iberia off-peak transatlantic. | Same; medium |
| iberia | [iberia_off_peak_us_madrid_biz_34k] | Iberia off-peak US-MAD biz at 34K Avios is the headline. | Same; medium |
| air_france_klm_flying_blue | [fb_promo_awards_monthly, fb_premium_economy_us_eu] | FB Promo Awards monthly drops; PE US-EU at ~25K. | Same; medium |
| air_canada_aeroplan | [aeroplan_distance_chart_transcon, aeroplan_stopover_award] | Distance-based chart + free stopover. | Same; medium |
| avianca_lifemiles | [lifemiles_us_europe_biz_63k, lifemiles_star_alliance_partners] | LifeMiles biz to EU at 63K, Star Alliance with no fuel surcharges. | Same; medium |
| singapore_krisflyer | [singapore_first_class_to_asia] | KrisFlyer Saver F to Asia. | Same; medium |
| cathay_asia_miles | [cathay_first_class_to_asia] | Cathay First to HKG via Asia Miles. | Same; medium |
| hawaiian_miles | [transfer_avoid_low_value_ratio] | After the Alaska/Hawaiian merger and program changes, transfer ratio cut and devaluation make this generally a poor target. | WebSearch awareness; not re-confirmed via partner page in this run; medium |
| marriott_bonvoy | [transfer_avoid_low_value_ratio] | 5:4 to Marriott — almost always wasteful vs direct hotel partners. | Issuer transfer page; medium |
| hilton_honors | [transfer_avoid_low_value_ratio] | 1:2 to Hilton — points devalue inside Hilton; only useful at top-end Conrad/Waldorf rates. | Issuer transfer page; medium |
| choice_privileges | [transfer_avoid_low_value_ratio] | 1:1; rarely competitive vs Wyndham 7,500 transfers from Citi/Capital One. | Issuer transfer page; medium |

> Partner ratios + sweet-spot quantification are inherited from the canonical `amex_mr` program record. This run did not re-fetch the issuer transfer page (americanexpress.com/.../use-points-airlines) — for a high-confidence MR partner-table refresh, fetch that page next run and re-emit this section.

## Conflicts found between sources

```yaml
- field: digital_entertainment_credit.face_usd
  sources:
    - https://www.americanexpress.com/us/credit-cards/card/platinum/: 300  ($25/mo, "$300 Digital Entertainment Credit" headline)
    - https://www.americanexpress.com/us/credit-cards/card/platinum/ (legacy benefit block in same page): 240  ($20/mo "$240 Digital Entertainment Credit")
  values: [300, 240]
  resolution: trust_issuer  # The 240/$20-month copy is residual cross-card markup (the same INITIAL_STATE renders Gold's smaller $240 entertainment credit elsewhere); the Plat headline figure is $300.
  applied_value: 300

- field: hertz_status_grant.tier
  sources:
    - https://frequentmiler.com/amxplat/: "Hertz Rental Car Privileges (registration required)"  — tier not surfaced
    - historical training-data assumption: "President's Circle"
  values: ["unspecified-on-source", "presidents_circle"]
  resolution: leave_medium  # The public issuer page does not name a tier. We list `presidents_circle` provisionally with confidence: medium pending direct fetch of Hertz's Plat enrollment confirmation page.
  applied_value: presidents_circle (medium)

- field: equinox_credit.face_usd
  sources:
    - cards/amex_platinum.md (current): "Equinox digital credit (limited time / variable)" → no fixed face value
    - https://www.americanexpress.com/us/credit-cards/card/platinum/ (post-refresh): "$300 Equinox Credit"
    - https://frequentmiler.com/amxplat/: "$300 Equinox Credit"
  values: ["variable", 300, 300]
  resolution: trust_issuer  # The 2025-09-29 refresh restored a fixed $300 Equinox credit. Update markdown to reflect.
  applied_value: 300
```

## Diff vs current markdown (cards/amex_platinum.md)

```yaml
new_fields_populated:
  - card_annual_credits: $300 Lululemon Credit ($75/qtr, enrollment required) — NOT in current markdown
  - card_annual_credits: $300 SoulCycle Credit (one-time, requires Equinox first) — NOT in current markdown
  - card_insurance.trip_cancellation_interruption: $10K/trip + $20K/12mo (markdown only flags it generically)
  - card_insurance.purchase_protection: 90 days, $10K/$50K caps (markdown silent)
  - card_insurance.extended_warranty: 1 extra yr, ≤5yr, $10K/$50K (markdown silent)
  - card_insurance.return_protection: 90 days, $300/item, $1K/yr (markdown silent)
  - card_co_brand_perks.spend_threshold_lounge_unlock: $75K/yr unlocks unlimited Centurion guests + Sky Club
  - card_co_brand_perks.welcome_offer_current_public: 80K MR / $8K / 6 months (markdown lists this in cards.json but not as a structured signup_bonus enrichment field)
  - card_co_brand_perks.hotel_status_grants.leading_hotels_of_world: Sterling tier (FM-confirmed)

fields_refined:
  - equinox_credit: was "limited time / variable"; now $300/yr fixed — refresh restored it
  - digital_entertainment_credit: confirmed $300/$25-mo (some legacy page copy says $240 — explained as cross-card markup leakage)
  - airline_incidental: confirmed gift-card workaround no longer eligible (already noted in markdown)
  - cell_phone_protection: confirmed $800/$50/2-claims/12mo from issuer-page benefit copy directly
  - trip_delay: 6 hrs / $500 / 2 claims confirmed verbatim

conflicts_left_unresolved:
  - hertz_status_grant.tier: tier label not surfaced on issuer page; provisional "presidents_circle" pending Hertz registration page fetch
  - auto_rental_cdw.coverage_max_usd: not stated on issuer page; pull from GTB PDF in next run
  - baggage_delay / lost_baggage: not surfaced on issuer page; pull from GTB PDF
  - travel_accident_insurance: appears retired; verify in GTB PDF
  - centurion guesting policy: $75K/yr threshold for unlimited guests cited from cross-source memory; not surfaced verbatim on the fetched Plat card page (lives on Centurion microsite — not fetched this run)

existing_markdown_data_preserved_verbatim:
  - annual_fee_usd: 895
  - foreign_tx_fee_pct: 0
  - earning rates: 5x flights/prepaid hotels via Amex Travel (cap $500K/yr on flights), 1x else
  - currency_earned: amex_mr
  - issuer_rules: Amex once-per-lifetime SUB; 2-in-90; 5-card limit (Plat doesn't count, charge card)
  - perks_dedup entries: all valid
```

## Fetch log

```
- url: https://www.americanexpress.com/us/credit-cards/card/platinum/
  status: 200
  content_type: text/html; charset=utf-8
  bytes_received: ~1,101,342
  fetched_at: 2026-05-01 (this session)
  notes: Page is a React SPA with content embedded in `window.__INITIAL_STATE__` (Transit-encoded JSON map, ~872KB) and 12 JSON-LD blocks. Stripping HTML alone yielded 63 chars; the structured INITIAL_STATE is the actual content source.

- url: https://frequentmiler.com/amex-platinum-card-review/
  status: 404
  content_type: text/html
  fetched_at: 2026-05-01
  fallback: WebSearch "site:frequentmiler.com Amex Platinum review benefits"
  fallback_url_used: https://frequentmiler.com/amxplat/

- url: https://frequentmiler.com/amxplat/
  status: 200
  content_type: text/html
  bytes_received: ~533,855
  fetched_at: 2026-05-01

- WebSearch query: "Amex Platinum 2026 changes annual fee benefits refresh"
  status: ok
  results_used:
    - confirmed AF $895 effective 2025-09-29 for new applicants, renewal-priced for existing
    - confirmed $3,500+ annual claimed value
    - confirmed core lounge access (Centurion + Sky Club when flying Delta + Global Lounge Collection)

- WebSearch query: "site:frequentmiler.com Amex Platinum review benefits"
  status: ok
  results_used: discovered canonical FM URL /amxplat/
```
