# Enrichment: Chase Sapphire Preferred Card

```
card_id:        chase_sapphire_preferred
last_verified:  2026-05-01
prompt_version: v2-webfetch
model:          claude-opus-4-7
status:         ready_for_review
sources_consulted:
  - https://creditcards.chase.com/rewards-credit-cards/sapphire/preferred  (fetched: yes, status: 200, content_type: text/html, ~999KB)
  - https://www.chase.com/content/dam/cs-asset/pdf/credit-cards/sapphire-preferred-guide-to-benefits.pdf  (fetched: no, status: 404 - that path no longer exists)
  - https://static.chasecdn.com/content/services/structured-document/document.en.pdf/card/benefits-center/product-benefits-guide-pdf/BGC11387_v2.pdf  (fetched: yes, status: 200, content_type: application/pdf - WebFetch text encoding mangled the binary; pdftotext rejected it as corrupt)
  - https://www.chase.com/personal/credit-cards/education/rewards-benefits/how-does-credit-card-cell-phone-protection-work  (fetched: yes, status: 200; reused from CSR run) - confirms CSP is NOT in Chase's cell-phone-protection card list
  - https://wallethub.com/answers/cc/chase-sapphire-preferred-cell-phone-protection-1000387-2140694744/  (fetched: yes, status: 200) - independent confirmation
  - https://thepointsguy.com/credit-cards/chase-sapphire-preferred-current-offer/  (not fetched; narrative)
  - https://upgradedpoints.com/credit-cards/reviews/chase-sapphire-preferred-card/  (not fetched; narrative)
  - https://frequentmiler.com/chase-sapphire-preferred-review/  (not fetched; narrative)
  - WebSearch: "Chase Sapphire Preferred Guide to Benefits PDF 2026 trip delay cell phone"
notes:
  - Issuer marketing page at creditcards.chase.com surfaces earning rates, Hotel Credit, DashPass, and lifestyle perks clearly but is comparatively LIGHT on insurance details vs the CSR page (which transcribes the GTB Travel & Purchase Protection block verbatim). For CSP, insurance fields below come from the WebSearch summary of the Chase GTB PDF + the BGC11387_v2 PDF (binary-corrupt via WebFetch but cited by independent sources) + Chase's published cell-phone education page (used to confirm absence).
  - **No material change to current cards/chase_sapphire_preferred.md.** The markdown is broadly accurate. Refinements: confirm Trip Delay 12-hour threshold (was already in markdown), refine Purchase Protection to $500/$50K, confirm Travel Accident $500K, and confirm absence of cell phone protection.
  - **Material additions discovered:** $10/month DashPass grocery/retail promo for DashPass members through 12/31/2027 (not in markdown). Points Boost (up to 2x portal redemption on select flights/hotels). Free DashPass for 12 months requires activation by 12/31/2027.
  - **2026 refresh status:** CSP did not get a major refresh - annual fee held at $95 throughout 2025. The CSR refresh (June 2025) restructured CSR but did not affect CSP earning rates or credits. Markdown's `recently_changed: false` is correct.
```

## Confidence summary

| Field group | Confidence | Source(s) used |
|---|---|---|
| card_credit_score | high | issuer page approval gate |
| card_membership_requirements | high | none listed |
| card_annual_credits | high | issuer page Hotel Credit + DashPass |
| card_insurance | medium | issuer page light on details; details cross-referenced via WebSearch GTB summary + WalletHub + Chase education page |
| card_program_access | high | issuer page benefit list |
| card_co_brand_perks | high | issuer page Hyatt cross-references + DashPass |
| card_absent_perks | high | issuer page omissions + Chase's own cell-phone education page (CSP not listed) |
| transfer_partner_sweet_spots | medium | inherits from chase_ur |

---

## card_credit_score

```
band: good_to_excellent
source: Issuer page application screen + Chase published terms; CSP is the entry-point Sapphire card and Chase markets it to "good to excellent" credit.
notes: Chase 5/24 rule applies; CSP is among the most 5/24-sensitive Chase products since Sapphire family is the lead-gen card.
```

## card_membership_requirements

`none` - no membership requirement listed at https://creditcards.chase.com/rewards-credit-cards/sapphire/preferred

## card_annual_credits

| name | face_usd | period | ease (1-5) | realistic_pct | realistic_usd | enrollment_required | qualifying_purchases_open_ended | rationale + source |
|---|---|---|---|---|---|---|---|---|
| Chase Travel Hotel Credit | 50 | account_anniversary_year | 4 | 0.85 | 43 | false | false (Chase Travel hotel only) | "$50 Annual Chase Travel Hotel Credit" - issuer page. Must book hotel through Chase Travel. |
| 10% Anniversary Points Bonus | variable | annual_anniversary | 5 | 1.00 | n/a (depends on prior year spend) | false (auto) | n/a | "each account anniversary you'll earn bonus points equal to 10% of your total purchases made the previous year" - issuer page. Worth $50/yr at $5,000 prior spend valued at 1cpp; ~$100/yr at $10K spend. |
| DashPass Membership | 120 | annual (12 months activation, through 12/31/2027) | 4 | 0.85 | 102 | true (DashPass activation) | false | "Get a complimentary DashPass membership, a $120 value for 12 months." - issuer page. Activate by 12/31/2027. |
| DashPass Grocery/Retail Monthly Promo | 120 | monthly ($10/mo, through 12/31/2027) | 3 | 0.65 | 78 | true (DashPass active) | false | "Plus, DashPass members get a $10 promo each month ($120 annually) to save on groceries, retail orders, and more through December 31, 2027." - issuer page. Not in current markdown. |

**Total face value:** ~$290+ / year (excluding the variable 10% anniversary bonus)
**Realistic value (organized user, $5K prior-year spend baseline):** ~$273 / year recurring
**Net AF after realistic capture:** $95 - $273 = ~-$178 in net value. Easy break-even.

## card_insurance

```yaml
auto_rental_cdw:
  coverage_type: primary
  coverage_max_usd: 60000
  domestic: true
  international: true
  liability_included: false
  exclusions: [exotic_cars, antiques, off_road, motorcycles, large_passenger_vans, certain_make_exclusions]
  source: Standard CSP Visa Signature Auto Rental CDW per Chase GTB; per-vehicle cap inherited from GTB (not directly verified in this run).
  confidence: medium

trip_cancellation_interruption:
  available: true
  max_per_traveler_usd: 10000
  max_per_trip_usd: 20000
  source: Chase GTB inherits same trip cancellation/interruption tier on CSP as CSR ($10K/$20K). Existing markdown notes the same. Not surfaced verbatim on issuer marketing page.
  confidence: medium

trip_delay:
  available: true
  threshold_hours: 12
  max_per_traveler_usd: 500
  trigger_alt: "or requires an overnight stay"
  source: Chase GTB CSP trip delay terms; markdown documents this correctly. WebSearch summary confirms structure.
  confidence: medium

baggage_delay:
  available: true
  threshold_hours: 6
  max_per_day_usd: 100
  max_days: 5
  source: "The baggage delay benefit applies if your baggage is delayed or misdirected for more than six hours and for each additional twenty-four hour period your baggage is delayed after the initial delay … with a maximum benefit of $100 per day up to a maximum of five days." - WebSearch summary of Chase GTB.
  confidence: medium

lost_baggage:
  available: true
  max_per_traveler_usd: 3000
  source: "lost luggage reimbursement providing up to $3,000 per covered traveler for the cost to repair or replace checked or carry-on baggage that is lost, damaged or stolen during a covered trip." - WebSearch summary of Chase GTB.
  confidence: medium

cell_phone_protection:
  available: false
  source: |
    "The Chase Sapphire Preferred does not offer cell phone insurance." - https://wallethub.com/answers/cc/chase-sapphire-preferred-cell-phone-protection-1000387-2140694744/. Confirmed by Chase's own cell-phone-protection education page, which lists Chase Freedom Flex, Chase Ink Business Preferred, and Chase Ink Business Premier as the cell-phone-protection cards and omits CSP - https://www.chase.com/personal/credit-cards/education/rewards-benefits/how-does-credit-card-cell-phone-protection-work. The CSP issuer marketing page makes no mention of it.
  confidence: high
  notes: "Markdown is correct in not listing cell phone protection."

emergency_evacuation_medical:
  available: false
  source: Not surfaced on issuer page; CSP-tier Chase travel insurance does not include emergency evacuation/transportation coverage (that's a CSR-level benefit).
  confidence: medium

emergency_medical_dental:
  available: false
  source: Not on CSP per Chase's CSR/CSP comparison.
  confidence: medium

travel_accident_insurance:
  available: true
  max_usd: 500000
  trigger: "when you pay for your air, bus, train or cruise transportation with your card"
  source: "travel accident insurance with up to $500,000 in accidental death or dismemberment coverage when you pay for your air, bus, train or cruise transportation with your card" - WebSearch summary of Chase GTB.
  confidence: medium

purchase_protection:
  available: true
  window_days: 120
  ny_resident_window_days: 90
  max_per_item_usd: 500
  max_per_year_usd: 50000
  source: Markdown's listed terms ($500/claim, $50K/account, 120 days) are CSP-tier standard; CSR has $10K/item caps, CSP has $500/item caps. Confidence: medium pending GTB PDF confirmation.
  confidence: medium

extended_warranty:
  available: true
  extra_year_added: 1
  applies_to_warranties_of_max_years: 3
  source: Standard CSP Visa Signature Extended Warranty - extends manufacturer warranty by 1 year on warranties of 3 years or less.
  confidence: medium

return_protection:
  available: false
  source: Not listed for CSP; Return Protection is a CSR-tier benefit.
  confidence: medium

roadside_assistance:
  available: true
  type: "pay-per-use; via Roadside Dispatch (Visa Signature)"
  source: Visa Signature inheritance.
  confidence: medium

primary_source_url: https://creditcards.chase.com/rewards-credit-cards/sapphire/preferred
gtb_pdf_url: https://static.chasecdn.com/content/services/structured-document/document.en.pdf/card/benefits-center/product-benefits-guide-pdf/BGC11387_v2.pdf
notes: "The GTB PDF was fetched (status 200) but binary-corrupted by WebFetch text mode; pdftotext rejected it. Insurance values use the WebSearch GTB summary as Tier 2 source per prompt rule 6 (mark medium confidence)."
```

## card_program_access

| program_id | access_kind | overrides / notes | source |
|---|---|---|---|
| chase_the_edit | not_available (no Edit credit on CSP) | The Edit is a CSR-only benefit. CSP cardholders can BOOK at The Edit via Chase Travel but get no $500 Edit credit. | derived |
| points_boost_redemption | included (CSP version) | "Up to 2X on Select Flights and Hotels through Chase Travel with Points Boost" - issuer page. | issuer page Points Boost block |
| visa_signature_lhc | included | CSP is Visa Signature - Visa Signature Hotel Collection / Luxury Hotel Collection benefits available at the Visa Signature tier. | derived from network status |
| visa_infinite_lhc | not_available | CSP is Visa Signature, NOT Visa Infinite. CSR is Visa Infinite. | derived |
| chase_sapphire_lounge_network | not_available | Chase Sapphire Lounge access is a CSR-only benefit. | derived |
| priority_pass_select | not_available | Priority Pass is a CSR-only Chase benefit. | derived |
| centurion_lounge_network | not_available | Amex-only. | derived |
| capital_one_lounge_network | not_available | Capital One-only. | derived |
| delta_skyclub | not_available | Amex-Delta only. | derived |
| fhr | not_available | Amex-only. | derived |
| amex_hotel_collection | not_available | Amex-only. | derived |
| capital_one_premier_collection | not_available | Capital One-only. | derived |
| capital_one_lifestyle_collection | not_available | Capital One-only. | derived |
| citi_hotel_collection | not_available | Citi-only. | derived |
| amex_global_dining_access | not_available | Amex-only. | derived |
| platinum_nights_resy | not_available | Amex Plat-only. | derived |
| amex_presale | not_available | Amex-only. | derived |
| amex_experiences | not_available | Amex-only. | derived |
| capital_one_dining | not_available | Capital One-only. | derived |
| capital_one_entertainment | not_available | Capital One-only. | derived |
| citi_entertainment | not_available | Citi-only. | derived |
| mastercard_priceless_cities | not_available | Card is Visa, not Mastercard. | derived |

## card_co_brand_perks

```yaml
hotel_status_grants: []  # CSP grants no hotel co-brand status. (CSR grants IHG Platinum + Hyatt Explorist at $75K spend.)

rental_status_grants: []  # CSP grants no rental status. (CSR has Hertz President's Circle.)

prepaid_hotel_credit:
  amount_usd_per_period: 50
  period: account_anniversary_year
  qualifying_programs: [chase_travel]
  min_nights: null
  booking_channel: "Chase Travel"
  source: "$50 Annual Chase Travel Hotel Credit" - issuer page.

free_night_certificates: []

complimentary_dashpass:
  available: true
  through: "12/31/2027"
  value_usd: 120
  source: "Get a complimentary DashPass membership, a $120 value for 12 months." - issuer page. Activate by 12/31/2027.

dashpass_grocery_retail_promo:
  available: true
  amount_usd_per_month: 10
  through: "12/31/2027"
  qualifying: "DashPass-active members; groceries, retail orders, and more"
  source: "Plus, DashPass members get a $10 promo each month ($120 annually) to save on groceries, retail orders, and more through December 31, 2027." - issuer page. Not in current markdown.

ten_pct_anniversary_bonus:
  available: true
  rate: 0.10
  base: "total purchases made the previous year"
  source: "each account anniversary you'll earn bonus points equal to 10% of your total purchases made the previous year" - issuer page.

spend_threshold_lounge_unlock: null

points_boost_redemption:
  available: true
  notes: "Up to 2x value on select flights and hotels through Chase Travel via Points Boost. CSP-tier multiplier is per-offer; not the standard 1.25cpp portal floor."
  source: "Up to 2X on Select Flights and Hotels through Chase Travel with Points Boost" - issuer page.

welcome_offer_current_public:
  amount_pts: 75000
  spend_required_usd: 5000
  spend_window_months: 3
  source: "Earn 75,000 bonus points after you spend $5,000 on purchases in the first 3 months from account opening" - issuer page.
  notes: "Has hit 80K and 100K in past public offers. 60K is the long-running baseline; 75K is the current elevated offer."
```

## card_absent_perks

```yaml
- perk_key: cell_phone_protection
  reason: |
    CSP does not include cell phone protection. Chase's own education page lists only Freedom Flex, Ink Business Preferred, and Ink Business Premier as the cell-phone-protection cards (https://www.chase.com/personal/credit-cards/education/rewards-benefits/how-does-credit-card-cell-phone-protection-work). WalletHub independently confirms (https://wallethub.com/answers/cc/chase-sapphire-preferred-cell-phone-protection-1000387-2140694744/).
  workaround: "Pair with Chase Freedom Flex (free, no AF) for cell phone coverage; or Wells Fargo Autograph Journey."

- perk_key: lounge_access_at_all
  reason: "CSP includes no lounge access of any kind - no Priority Pass, no Sapphire Lounge, no Centurion. CSR is the entry-tier Chase card with lounge access."
  workaround: "Upgrade to CSR for Sapphire Lounges + PP; or pair with Amex Plat / Cap One Venture X."

- perk_key: emergency_evacuation_medical
  reason: "CSP-tier travel insurance does not include emergency evacuation/transportation. CSR has $100K Emergency Evac."
  workaround: "Use CSR for emergency evac coverage; or buy travel insurance for high-risk trips."

- perk_key: return_protection
  reason: "Return Protection is a CSR-tier benefit only."
  workaround: "Use CSR or Amex Plat for Return Protection."

- perk_key: hotel_status_grant
  reason: "CSP grants no hotel co-brand status."
  workaround: "Hold a hotel co-brand for Hilton/Marriott/IHG/Hyatt status; or upgrade to CSR for IHG Platinum + Hyatt Explorist (at $75K spend)."

- perk_key: anniversary_free_night
  reason: "CSP is not a hotel co-brand; no anniversary FNC."
  workaround: "Pair with World of Hyatt, Marriott Brilliant, Hilton Aspire, or IHG Premier for FNCs."

- perk_key: pay_yourself_back
  reason: "Pay Yourself Back was retired/restructured for CSP; no longer surfaced as a benefit on the issuer page."
  workaround: "Use Points Boost or transfer-partner redemptions for above-cash value."
```

## transfer_partner_sweet_spots (for `chase_ur`)

| partner_id | sweet_spot_tags | notes | source |
|---|---|---|---|
| world_of_hyatt | [hyatt_cat_1_4_3500_to_15000, hyatt_aspirational_park_hyatt] | The single best Chase UR sweet spot. CSP at 1cpp portal makes Hyatt transfers ~3-5cpp effective. | https://www.chase.com/personal/credit-cards/ultimate-rewards (transfer page); inherited from chase_ur record; medium |
| united_mileageplus | [united_excursionist_perk, united_economy_partner_redemptions] | Excursionist Perk + partner economy. | Same; medium |
| southwest_rapid_rewards | [sw_companion_pass_when_eligible] | Companion Pass at 135K SW points / calendar year. | Same; medium |
| air_canada_aeroplan | [aeroplan_distance_chart_transcon, aeroplan_stopover_award] | Distance chart + free stopover. | Same; medium |
| british_airways | [ba_short_haul_aa_partner, ba_iberia_off_peak] | Short-haul AA + Iberia off-peak. | Same; medium |
| iberia | [iberia_off_peak_us_madrid_biz_34k] | Iberia off-peak US-MAD biz at 34K. | Same; medium |
| air_france_klm_flying_blue | [fb_promo_awards_monthly, fb_premium_economy_us_eu] | Promo Rewards + PE US-EU. | Same; medium |
| virgin_atlantic | [va_ana_first_business_to_japan, va_delta_one_us_eu_off_peak, va_transatlantic_economy_15k] | ANA F to Japan + Delta One off-peak. | Same; medium |
| singapore_krisflyer | [singapore_first_class_to_asia] | KrisFlyer Saver F. | Same; medium |
| emirates_skywards | [transfer_avoid_low_value_ratio] | High YQ/fees. | Same; medium |
| jetblue_trueblue | [transfer_avoid_low_value_ratio] | Revenue-based. | Same; medium |
| marriott_bonvoy | [transfer_avoid_low_value_ratio] | 1:1 but devalued. | Same; medium |
| ihg_one_rewards | [transfer_avoid_low_value_ratio] | 1:1; only useful at peak. | Same; medium |
| aer_lingus_aerclub | [ba_short_haul_aa_partner] | Niche Oneworld redemption value. | medium |

## Conflicts found between sources

```yaml
- field: card_annual_credits.dashpass_grocery_retail_monthly_promo
  sources:
    - cards/chase_sapphire_preferred.md (current): not present
    - https://creditcards.chase.com/rewards-credit-cards/sapphire/preferred: "DashPass members get a $10 promo each month ($120 annually) to save on groceries, retail orders, and more through December 31, 2027"
  values: [absent, present]
  resolution: trust_issuer
  applied_value: present (added to enrichment)

- field: signup_bonus.amount_pts
  sources:
    - cards/chase_sapphire_preferred.md (current): 75000
    - https://creditcards.chase.com/rewards-credit-cards/sapphire/preferred: 75,000 bonus points
  values: [75000, 75000]
  resolution: agree
  applied_value: 75000 / $5000 / 3 months

- field: card_insurance.cell_phone_protection
  sources:
    - cards/chase_sapphire_preferred.md (current): not listed (correct absence)
    - WalletHub + Chase education page: confirmed absent
  values: [absent, absent]
  resolution: agree
  applied_value: absent (with confidence: high)
```

## Diff vs current markdown (cards/chase_sapphire_preferred.md)

```yaml
new_fields_populated:
  - card_co_brand_perks.dashpass_grocery_retail_promo: $10/month grocery/retail promo for DashPass members through 12/31/2027
  - card_co_brand_perks.points_boost_redemption: up to 2x via Chase Travel Points Boost
  - card_insurance.travel_accident_insurance: $500K AD&D
  - card_absent_perks.cell_phone_protection: structured absence with sources

fields_refined:
  - card_insurance.purchase_protection: 120 days, $500/item, $50K/yr (markdown already had close values; verify caps in GTB)
  - card_insurance.trip_delay: 12 hrs OR overnight, $500/ticket (markdown notes 12-hour threshold correctly)

conflicts_left_unresolved:
  - card_insurance per-claim caps (auto rental, trip delay, lost luggage): GTB PDF binary-corrupted; values inherited from WebSearch summary + markdown - confidence medium
  - extended_warranty applies-to-warranty-length cap: 3 yrs vs 5 yrs - CSP-tier should be 3 yrs but verify in GTB
  - emergency_evacuation_medical / emergency_medical_dental: marked absent based on CSP/CSR comparison; verify in GTB

existing_markdown_data_preserved_verbatim:
  - annual_fee_usd: 95
  - foreign_tx_fee_pct: 0
  - currency_earned: chase_ur
  - earning rates: 5x Chase Travel (excl hotels qualifying for $50 credit), 3x dining (incl delivery/takeout), 3x online grocery (excl Walmart/Target/wholesale), 3x select streaming, 2x other travel, 1x else
  - 5x Lyft through 9/30/2027, 5x Peloton equipment >=$150 through 12/31/2027 (verified on issuer page)
  - signup_bonus: 75K / $5K / 3 months
  - issuer_rules: Chase 5/24, Sapphire 48-month
  - $50 Annual Chase Travel Hotel Credit
  - 10% anniversary points bonus (on prior-year purchases)
  - DashPass through 12/31/2027
  - Trip Cancellation/Interruption $10K/person, $20K/trip
  - Trip Delay 12+ hours / $500 per ticket
  - Primary Auto Rental CDW
  - Baggage Delay $100/day x 5 days after 6-hour delay
  - Lost Luggage Reimbursement
  - Purchase Protection (120 days, $500/claim, $50K/account)
  - Extended Warranty
  - 1:1 transfers to airline/hotel partners
  - chase_ur transfer partner table + Hyatt sweet spot
```

## Fetch log

```
- url: https://creditcards.chase.com/rewards-credit-cards/sapphire/preferred
  status: 200
  content_type: text/html
  bytes_received: ~999,997 (truncated at 1MB ceiling)
  fetched_at: 2026-05-01

- url: https://www.chase.com/content/dam/cs-asset/pdf/credit-cards/sapphire-preferred-guide-to-benefits.pdf
  status: 404
  fetched_at: 2026-05-01
  fallback: WebSearch -> static.chasecdn.com BGC11387_v2.pdf

- url: https://static.chasecdn.com/content/services/structured-document/document.en.pdf/card/benefits-center/product-benefits-guide-pdf/BGC11387_v2.pdf
  status: 200
  content_type: application/pdf
  bytes_received: ~1,596,036 (raw response)
  fetched_at: 2026-05-01
  pdftotext_result: "Couldn't read xref table" - WebFetch text mode mangled binary stream
  fallback_for_insurance_values: WebSearch summary of GTB

- url: https://www.chase.com/personal/credit-cards/education/rewards-benefits/how-does-credit-card-cell-phone-protection-work
  status: 200 (reused from CSR run)
  used_for: confirming CSP is NOT among Chase's cell-phone-protection cards

- url: https://wallethub.com/answers/cc/chase-sapphire-preferred-cell-phone-protection-1000387-2140694744/
  status: 200
  used_for: independent confirmation of cell-phone-protection absence

- WebSearch: "Chase Sapphire Preferred Guide to Benefits PDF 2026 trip delay cell phone"
  status: ok
  used_for: discovering BGC11387_v2 PDF + GTB benefit summary (trip delay, lost luggage $3K, travel accident $500K)
```
