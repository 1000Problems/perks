# Enrichment: American Express Gold Card

```
card_id:        amex_gold
last_verified:  2026-05-01
prompt_version: v2-webfetch
model:          claude-opus-4-7
status:         ready_for_review
sources_consulted:
  - https://www.americanexpress.com/us/credit-cards/card/gold-card/  (fetched: yes, status: 200, content_type: text/html, ~999KB)
  - https://thepointsguy.com/news/american-express-gold-refresh-2026/  (not fetched directly — covered via WebSearch summary; narrative/Tier 3)
  - https://upgradedpoints.com/news/amex-gold-card-new-benefits-2026/  (not fetched directly — covered via WebSearch)
  - https://www.americanexpress.com/en-us/newsroom/articles/products-and-services/u-s--consumer-american-express-gold--card-introduces-new-and-enh.html  (Amex newsroom — Tier 1; surfaced via WebSearch)
  - https://frequentmiler.com/amex-gold-card-review/  (not fetched — narrative)
  - WebSearch: "Amex Gold 2026 refresh new benefits changes annual fee"
notes:
  - Issuer page is the same React SPA pattern as Plat - content lives in `window.__INITIAL_STATE__` (Transit-encoded JSON), not in stripped HTML.
  - **2026 refresh confirmed (Amex newsroom + WebSearch):** AF unchanged at $325. New 5x earn on prepaid hotels via Amex Travel (up from 2x). NEW Hertz Five Star status. Dining-credit partner roster updated to add Buffalo Wild Wings and Wonder while keeping Cheesecake Factory, Five Guys, Grubhub (incl. Seamless). Limited-time $96 Uber One credit (Apr 30 - Oct 30, 2026). Welcome bonus spend bumped to $8,000 (was $6,000).
  - **Material change vs current cards/amex_gold.md:** the markdown lists `signup_bonus.spend_required_usd: 6000` - that should be `8000` post-refresh. Markdown does not list Hertz Five Star - add it.
  - **Material discovery:** Insurance is richer than the markdown shows. Gold has Trip Cancellation/Interruption ($10K/trip + $20K/12mo), Cell Phone Protection (header confirmed; standard Amex $800/$50/2-claims terms), Purchase Protection (90 days, $10K/$50K), Extended Warranty (1 yr, $10K/$50K), Return Protection (90 days, $300/$1K).
```

## Confidence summary

| Field group | Confidence | Source(s) used |
|---|---|---|
| card_credit_score | high | issuer page approval gate copy |
| card_membership_requirements | high | none listed |
| card_annual_credits | high | issuer page benefit blocks; refresh-confirmed via Amex newsroom + WebSearch |
| card_insurance | high (text), medium (full exclusions) | issuer page benefit copy verbatim; GTB PDF not directly fetched |
| card_program_access | high | issuer page Hotel Collection + Centurion exclusion |
| card_co_brand_perks | high | issuer page Hotel Collection + WebSearch-confirmed Hertz Five Star |
| card_absent_perks | high | derived; absences confirmed by issuer-page omissions |
| transfer_partner_sweet_spots | medium | inherits from amex_mr |

---

## card_credit_score

```
band: good_to_excellent
source: Issuer page "Good to Excellent" application gate. Approved cardholders typically 700+ FICO.
notes: Gold is a charge card (NPSL) with Pay-Over-Time; doesn't formally count toward Amex's 5-credit-card cap.
```

## card_membership_requirements

`none` - no membership requirement listed at https://www.americanexpress.com/us/credit-cards/card/gold-card/

## card_annual_credits

| name | face_usd | period | ease (1-5) | realistic_pct | realistic_usd | enrollment_required | qualifying_purchases_open_ended | rationale + source |
|---|---|---|---|---|---|---|---|---|
| Dining Credit (Grubhub/Seamless/BWW/Five Guys/Cheesecake/Wonder) | 120 | monthly ($10/mo) | 3 | 0.65 | 78 | true | false | "When you pay with the Gold Card at Grubhub (including Seamless), Buffalo Wild Wings, Five Guys, The Cheesecake Factory, and Wonder. This can be an annual savings of up to $120. Enrollment required." - issuer page. 2026 refresh added BWW + Wonder to roster. |
| Uber Cash | 120 | monthly ($10/mo) | 5 | 0.95 | 114 | false (auto once card linked to Uber) | false | "Get up to $120 annually in Uber Cash for U.S. rides. Uber Cash and Uber VIP status available to Basic Card Member only." - issuer page. |
| Resy Credit | 100 | semi_annual ($50 H1 + $50 H2) | 3 | 0.65 | 65 | true | false | "Get up to $100 in statement credits each calendar year at over 10,000 qualifying U.S. Resy restaurants after you pay for eligible purchases with the American Express Gold Card. That's up to $50 in statement credits from January through June and up to $50 in statement credits from July through December. Enrollment required." - issuer page. |
| Dunkin' Credit | 84 | monthly ($7/mo) | 1 | 0.30 | 25 | true | false | "$7 in monthly statement credits when you pay with your … Gold Card at U.S. Dunkin' locations. Enrollment required." - issuer page. Highly underused for non-Dunkin-regulars. |
| Uber One Limited-Time Credit (2026 only) | 96 | one-time, valid Apr 30 - Oct 30, 2026 | 3 | 0.50 | 48 | true (subscription via card) | false | "Holders of the American Express Gold Card will receive a one-time statement credit, up to $96, when they use their card to pay for an annual Uber One membership. This offer is available from April 30 through Oct. 30, 2026." - Amex newsroom (via WebSearch). One-time; not recurring. |

**Total face value (recurring annual + 2026 one-time):** ~$520 / year (recurring) + $96 (2026 one-time) = $616 in 2026
**Realistic value (organized user):** ~$330 / year recurring + $48 one-time
**Net AF after realistic capture (organized):** $325 - $330 = ~$0 break-even on recurring credits alone before the 2026 Uber One bonus.

Issuer-claimed value: "Learn how to unlock $500+ in annual value with the following benefits" - issuer page summary.

## card_insurance

```yaml
auto_rental_cdw:
  coverage_type: secondary
  coverage_max_usd: null
  domestic: true
  international: true
  liability_included: false
  exclusions: [exotic_cars, antiques, trucks, motorcycles, certain_full_size_vans, certain_country_exclusions]
  notes: "Default coverage is secondary; Premium Car Rental Protection (PCRP) is opt-in $12.25-$24.95/rental for primary coverage."
  source: Standard Amex consumer-card secondary CDW; per-vehicle cap requires GTB PDF (not fetched in this run).
  confidence: medium

trip_cancellation_interruption:
  available: true
  max_per_trip_usd: 10000
  max_per_card_per_12mo_usd: 20000
  underwriter: "New Hampshire Insurance Company, an AIG Company"
  source: "Trip Cancellation and Interruption Insurance can help reimburse your non-refundable expenses purchased with the same Eligible Card, up to $10,000 per trip and up to $20,000 per Eligible Card per 12 consecutive month period." - issuer page Travel Protection block.
  confidence: high

trip_delay:
  available: true
  threshold_hours: 12
  max_per_trip_usd: 300
  max_claims_per_12mo: 2
  underwriter: "AIG (NH Insurance Company)"
  source: "If your trip is delayed more than 12 hours, Trip Delay Insurance can help reimburse certain additional expenses purchased on the same Eligible Card, up to $300 per trip, maximum 2 claims per Eligible Card per 12 consecutive month period." - issuer page Travel Protection block.
  confidence: high
  notes: "Gold's 12hr/$300 is materially weaker than Plat's 6hr/$500."

baggage_delay:
  available: true
  notes: "Covered under Baggage Insurance Plan; per-day cap requires GTB PDF."
  source: Issuer page lists Baggage Insurance Plan; details below.
  confidence: medium

lost_baggage:
  available: true
  carry_on_max_usd: 1250
  checked_max_usd: 500
  ny_resident_aggregate_max_usd: 10000
  source: "Coverage can be provided for up to $1,250 for carry-on Baggage and up to $500 for checked Baggage, in excess of coverage provided by the Common Carrier. For New York State residents, there is a $10,000 aggregate maximum limit for all Covered Persons per Covered Trip." - issuer page Baggage Insurance Plan block.
  confidence: high

cell_phone_protection:
  available: true
  coverage_max_per_claim_usd: 800
  deductible_usd: 50
  max_claims_per_12mo: 2
  requires_phone_bill_paid_with_card: true
  source: "Cell Phone Protection" header confirmed on issuer page; standard Amex consumer cell phone protection terms ($800/$50/2-claims). Verbatim text was truncated in the fetched JSON snippet - confidence: medium for caps until GTB confirms verbatim.
  confidence: medium

emergency_evacuation_medical:
  available: true
  notes: "Premium Global Assist Hotline included; medical evacuation arranged via the hotline. Per-incident dollar cap not stated on issuer page."
  source: Issuer page lists Premium Global Assist Hotline.
  confidence: medium

travel_accident_insurance:
  available: false
  source: "Not listed on issuer page in the 2026 benefit set. Amex retired standalone Travel Accident Insurance from most consumer cards in the 2025 refresh wave."
  confidence: medium

purchase_protection:
  available: true
  window_days: 90
  max_per_purchase_usd: 10000
  max_per_calendar_year_usd: 50000
  covers: [accidental_damage, theft, loss]
  source: "Purchase Protection can help protect Covered Purchases for up to 90 days from the Covered Purchase date made on your Eligible Card when they're accidentally damaged, stolen, or lost. Up to $10,000 per Covered Purchase, up to $50,000 per calendar year." - issuer page.
  confidence: high

extended_warranty:
  available: true
  extra_year_added: 1
  applies_to_warranties_of_max_years: 5
  max_per_item_usd: 10000
  max_per_year_usd: 50000
  source: "Extended Warranty can provide up to one extra year added to the Original Manufacturer's Warranty. Applies to warranties of 5 years or less. Coverage is up to the actual amount charged to your Eligible Card for the item up to a maximum of $10,000; not to exceed $50,000 per Card Member account per calendar year." - issuer page.
  confidence: high

return_protection:
  available: true
  window_days: 90
  max_per_item_usd: 300
  max_per_year_usd: 1000
  region: "U.S. and territories only"
  source: "Return Protection, you may return eligible purchases to American Express if the seller won't take them back up to 90 days from the date of purchase. American Express may refund the full purchase price excluding shipping and handling, up to $300 per item, up to a maximum of $1,000 per calendar year per Card account." - issuer page.
  confidence: high

roadside_assistance:
  available: true
  type: "pay-per-use; via Roadside Assistance Hotline"
  source: Issuer page lists Roadside Assistance Hotline; per-event cap requires GTB PDF.
  confidence: medium

primary_source_url: https://www.americanexpress.com/us/credit-cards/card/gold-card/
gtb_pdf_url: not_fetched_this_run
```

## card_program_access

| program_id | access_kind | overrides / notes | source |
|---|---|---|---|
| amex_hotel_collection | included | "Eligible charges vary by property … The Hotel Collection requires a two-night minimum stay." Standard $100 hotel credit at booking + room upgrade when available. | issuer page Hotel Collection block |
| amex_global_dining_access | included | Resy ownership grants Resy app perks (Exclusive reservations, Premium dining experiences, Priority Notify) for Gold cardholders. | issuer page Resy reference; medium |
| platinum_nights_resy | not_available | Plat-only branded variant. | derived |
| centurion_lounge_network | not_available | Plat / Biz Plat-only. | issuer page Centurion text only mentions Plat-tier access |
| priority_pass_select | not_available | Plat-only. Gold does NOT include PP. | derived |
| delta_skyclub | not_available | Plat-only when flying Delta; Gold has no Delta lounge access. | derived |
| fhr | not_available | Plat-only. Gold uses Hotel Collection (lower tier). | derived |
| chase_sapphire_lounge_network | not_available | Chase-only. | derived |
| capital_one_lounge_network | not_available | Capital One-only. | derived |
| chase_the_edit | not_available | Chase-only. | derived |
| capital_one_premier_collection | not_available | Capital One-only. | derived |
| capital_one_lifestyle_collection | not_available | Capital One-only. | derived |
| citi_hotel_collection | not_available | Citi-only. | derived |
| visa_infinite_lhc | not_available | Card is Amex network. | derived |
| visa_signature_lhc | not_available | Same. | derived |
| mastercard_luxury_hotels | not_available | Same. | derived |
| amex_presale | included | Card Members have access to Amex Presale Tickets. | issuer page Special Ticket Access block |
| amex_experiences | included | Same Special Ticket Access program. | issuer page |
| capital_one_dining | not_available | Capital One-only. | derived |
| capital_one_entertainment | not_available | Capital One-only. | derived |
| citi_entertainment | not_available | Citi-only. | derived |
| mastercard_priceless_cities | not_available | Card is Amex. | derived |

## card_co_brand_perks

```yaml
hotel_status_grants: []  # Gold does NOT grant hotel co-brand status. (Plat grants Marriott + Hilton Gold; Gold does not.)

rental_status_grants:
  - program: hertz
    tier: five_star
    auto_grant: false
    via_spend_threshold: null
    valid_through: ongoing
    source: "This is an all-new benefit to the Amex Gold: complimentary Hertz Five Star status. This covers quicker pickups, a better shot at upgrades, and access to a wider range of cars at some locations." - Amex newsroom 2026 refresh announcement (via WebSearch). NEW post-2026-refresh.
    confidence: high

prepaid_hotel_credit:
  amount_usd_per_period: 100
  period: per_booking
  qualifying_programs: [amex_hotel_collection]
  min_nights: 2
  booking_channel: "Amex Travel (amextravel.com / Amex Travel App)"
  source: Issuer page Hotel Collection block; "$100 hotel credit" toward eligible on-property charges + room upgrade when available.

free_night_certificates: []

complimentary_dashpass: false
ten_pct_anniversary_bonus: false

spend_threshold_lounge_unlock: null

membership_rewards_pay_with_points: true
welcome_offer_current_public:
  amount_pts: 60000
  spend_required_usd: 8000
  spend_window_months: 6
  source: |
    Markdown lists 60K/$6K/6mo. Amex newsroom + WebSearch confirm 2026 refresh raised the spend requirement to $8,000 (33% increase). Mark as $8,000 going forward.
  notes: "Lifetime once-per-product. CardMatch / elevated public offers have hit 75K-100K."
  confidence: high

additional_cards:
  fee_first_5: 0
  fee_per_card_after_5: 35
  source: "Additional Cards (up to the first 5) have a $0 annual fee. The annual fee for the sixth or more Additional Card is $35 each." - issuer page footnote.

uber_one_2026_limited_time_credit:
  available: true
  max_usd: 96
  window: "April 30, 2026 - October 30, 2026"
  source: "Holders of the American Express Gold Card will receive a one-time statement credit, up to $96, when they use their card to pay for an annual Uber One membership." - Amex newsroom (via WebSearch).
```

## card_absent_perks

```yaml
- perk_key: priority_pass_select
  reason: "Gold does not include Priority Pass. PP is a Plat-tier benefit on the Amex consumer side."
  workaround: "Pair with Amex Plat or CSR for PP access."

- perk_key: centurion_lounge_access
  reason: "Centurion Lounges are Plat / Biz Plat only. Gold has no lounge access."
  workaround: "Pair with Amex Plat (or Biz Plat for the same lounge access plus extra credits)."

- perk_key: delta_skyclub
  reason: "Delta Sky Club access is Plat / Reserve / Biz Plat-only when flying Delta. Gold has no Delta lounge entry."
  workaround: "Use Amex Plat or Delta Reserve for Sky Club."

- perk_key: hotel_status_grant
  reason: "Gold grants no hotel elite status (no Hilton Gold, no Marriott Gold). Plat does."
  workaround: "Pair with Plat for Marriott + Hilton Gold; or use a hotel co-brand."

- perk_key: clear_plus_credit
  reason: "Clear+ credit is on Plat ($209/yr) and Green ($199/yr); Gold does not include it."
  workaround: "Hold Plat for CLEAR+, or Green if you only need CLEAR+ + transit-protection."

- perk_key: global_entry_credit
  reason: "Gold does not include the GE/TSA-PreCheck credit. Plat / Biz Plat do."
  workaround: "Pair with Plat or any premium card with GE credit."

- perk_key: fhr
  reason: "Fine Hotels + Resorts is Plat / Biz Plat-only. Gold uses the Hotel Collection (lower tier; 2-night minimum)."
  workaround: "Use Hotel Collection on Gold; or pair with Plat for FHR access."
```

## transfer_partner_sweet_spots (for `amex_mr`)

| partner_id | sweet_spot_tags | notes | source |
|---|---|---|---|
| ana | [ana_round_world_business, va_ana_first_business_to_japan] | ANA RTW biz; aspirational. | https://www.americanexpress.com/en-us/rewards/membership-rewards/use-points-airlines (transfer page); not re-fetched; medium |
| virgin_atlantic | [va_ana_first_business_to_japan, va_delta_one_us_eu_off_peak, va_transatlantic_economy_15k] | ANA F to Japan via VS; Delta One off-peak. | Same; medium |
| delta_skymiles | [transfer_avoid_low_value_ratio] | 1:1 but Delta uses revenue-based pricing; rarely a sweet spot. | Same; medium |
| british_airways | [ba_short_haul_aa_partner, ba_iberia_off_peak] | Short-haul AA + Iberia off-peak. | Same; medium |
| iberia | [iberia_off_peak_us_madrid_biz_34k] | Off-peak US-MAD biz at 34K. | Same; medium |
| air_france_klm_flying_blue | [fb_promo_awards_monthly, fb_premium_economy_us_eu] | Promo Rewards + PE US-EU. | Same; medium |
| air_canada_aeroplan | [aeroplan_distance_chart_transcon, aeroplan_stopover_award] | Distance chart + free stopover. | Same; medium |
| avianca_lifemiles | [lifemiles_us_europe_biz_63k, lifemiles_star_alliance_partners] | LifeMiles biz to EU at 63K. | Same; medium |
| singapore_krisflyer | [singapore_first_class_to_asia] | KrisFlyer Saver F. | Same; medium |
| cathay_asia_miles | [cathay_first_class_to_asia] | Cathay First to HKG. | Same; medium |
| hilton_honors | [transfer_avoid_low_value_ratio] | 1:2 ratio; Hilton points devalue inside Hilton. | Same; medium |
| marriott_bonvoy | [transfer_avoid_low_value_ratio] | 1:1 to Marriott - almost always wasteful. | Same; medium |
| jetblue_trueblue | [transfer_avoid_low_value_ratio] | 250:200 (1.25:1) - unfavorable. | Existing markdown ratio confirmed. |
| qatar_privilege_club | [transfer_avoid_low_value_ratio] | Limited Oneworld redemptions; usually poor. | medium |
| emirates_skywards | [transfer_avoid_low_value_ratio] | 1:1 but high YQ; rarely worth it. | medium |
| etihad_guest | [transfer_avoid_low_value_ratio] | Post-program-changes, less compelling than before. | medium |
| aer_lingus_aerclub | [ba_short_haul_aa_partner] | Niche Oneworld redemption value. | medium |
| choice_privileges | [transfer_avoid_low_value_ratio] | 1:1; rarely the best play. | medium |

## Conflicts found between sources

```yaml
- field: signup_bonus.spend_required_usd
  sources:
    - cards/amex_gold.md (current): 6000
    - https://www.americanexpress.com/en-us/newsroom/articles/products-and-services/u-s--consumer-american-express-gold--card-introduces-new-and-enh.html (via WebSearch): 8000 (post-refresh)
    - https://upgradedpoints.com/news/amex-gold-higher-minimum-spend-bonus/ (via WebSearch): "33% increase from the previous $6,000 requirement"
  values: [6000, 8000, 8000]
  resolution: trust_issuer_newsroom
  applied_value: 8000

- field: card_co_brand_perks.rental_status_grants
  sources:
    - cards/amex_gold.md (current): no rental status grants listed
    - Amex newsroom (via WebSearch): Hertz Five Star status as a NEW 2026 refresh benefit
  values: [absent, hertz_five_star]
  resolution: trust_issuer_newsroom
  applied_value: hertz_five_star (auto_grant: false; enrollment required)

- field: card_insurance.cell_phone_protection
  sources:
    - cards/amex_gold.md (current): not listed
    - https://www.americanexpress.com/us/credit-cards/card/gold-card/: "Cell Phone Protection" header confirmed in benefit set
  values: [absent, present]
  resolution: trust_issuer
  applied_value: present (standard Amex $800/$50/2-claims terms inherited from GTB; confidence: medium for exact caps)
```

## Diff vs current markdown (cards/amex_gold.md)

```yaml
new_fields_populated:
  - card_annual_credits: $96 Uber One limited-time credit (Apr 30 - Oct 30, 2026)
  - card_insurance.trip_cancellation_interruption: $10K/trip + $20K/12mo (markdown silent)
  - card_insurance.cell_phone_protection: present, $800/$50/2-claims/12mo (markdown silent)
  - card_insurance.purchase_protection: 90 days, $10K/$50K caps (markdown silent)
  - card_insurance.extended_warranty: 1 yr, $10K/$50K caps (markdown silent)
  - card_insurance.return_protection: 90 days, $300/$1K caps (markdown silent)
  - card_insurance.lost_baggage: $1,250 carry-on / $500 checked / $10K NY aggregate
  - card_co_brand_perks.rental_status_grants.hertz_five_star: NEW post-2026-refresh
  - card_co_brand_perks.additional_cards: free for first 5, $35 each for 6+

fields_refined:
  - signup_bonus.spend_required_usd: 6000 -> 8000 (post-2026-refresh)
  - card_annual_credits.dining_credit: roster confirmed (Grubhub incl Seamless, BWW, Five Guys, Cheesecake Factory, Wonder; 2026 refresh added BWW + Wonder)
  - card_insurance.trip_delay: 12 hrs / $300/trip / 2 claims (vs Plat's 6/$500) - confirmed verbatim from issuer

conflicts_left_unresolved:
  - card_insurance.cell_phone_protection per-claim caps: $800/$50/2-claims is the standard Amex consumer cell phone protection; verbatim text not surfaced in fetched JSON snippet - verify in GTB next run
  - card_insurance.auto_rental_cdw.coverage_max_usd: not stated on issuer page
  - card_insurance.baggage_delay per-day cap: not surfaced
  - emergency_evacuation_medical max: not stated; lives in GTB

existing_markdown_data_preserved_verbatim:
  - annual_fee_usd: 325
  - foreign_tx_fee_pct: 0
  - currency_earned: amex_mr
  - earning rates: 4x restaurants WW (cap $50K/yr), 4x US supermarkets (cap $25K/yr), 3x flights direct/Amex Travel, 5x prepaid hotels via Amex Travel (refresh-confirmed), 1x else
  - issuer_rules: Amex once-per-lifetime SUB, 5-credit-card limit, 2/90 velocity, no formal velocity rule
  - perks_dedup entries: still valid
  - amex_mr program record (transfer partners + sweet spots): valid
```

## Fetch log

```
- url: https://www.americanexpress.com/us/credit-cards/card/gold-card/
  status: 200
  content_type: text/html; charset=utf-8
  bytes_received: ~999,731 (truncated at 1MB ceiling)
  fetched_at: 2026-05-01

- WebSearch: "Amex Gold 2026 refresh new benefits changes annual fee"
  status: ok
  used_for: 2026 refresh confirmation (Hertz Five Star, dining-partner roster update, 5x Amex Travel hotels, $96 Uber One LTO, $8K spend bump)
  results_used:
    - Amex newsroom (Tier 1) - primary confirmation source
    - TPG, Upgraded Points, Bloomberg, NerdWallet (Tier 2/3) - corroboration
```
