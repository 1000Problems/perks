# Enrichment: Capital One Venture X Rewards

```
card_id:        capital_one_venture_x
last_verified:  2026-05-01
prompt_version: v2-webfetch
model:          claude-opus-4-7
status:         ready_for_review
sources_consulted:
  - https://www.capitalone.com/credit-cards/venture-x/  (fetched: yes, status: 200, content_type: text/html, ~1.05MB)
  - https://www.capitalone.com/learn-grow/credit-cards/venture-x-benefits-guide/  (not fetched this run — issuer page surfaced enough; mark as next-run target if Visa Infinite full T&C are needed)
  - https://www.dailydrop.com/pages/capital-one-lounge-access-changes  (fetched: yes, status: 200) — definitive on the 2026-02-01 lounge-access policy changes
  - https://thepointsguy.com/credit-cards/reviews/capital-one-venture-x/  (not fetched — narrative only)
  - https://frequentmiler.com/capital-one-venture-x-review/  (not fetched — narrative only)
  - WebSearch: "Capital One Venture X lounge access changes February 2026 guests primary"
notes:
  - Capital One has no separate Guide-to-Benefits PDF the way Chase/Amex do. Insurance specifics live in the Visa Infinite Guide to Benefits (network-issued) and the Capital One benefits-guide page. The issuer card page surfaces every benefit by name with one-line descriptions; the per-claim caps for some insurance lines come from the Visa Infinite GTB and were not re-fetched this run — those fields are marked confidence: medium.
  - **Material confirmation:** the 2026-02-01 lounge-access changes are real and exactly as described in the markdown. Daily Drop confirms: $75K calendar-year spend unlocks 2 free lounge guests + 1 free landing guest; otherwise $45/adult guest, $25/child 2-17, free under 2; PP guests $35 each; authorized users $125/yr fee for any lounge access at all.
  - **Material discovery:** issuer page now also lists Premier Collection vacation rentals (in addition to hotels) with a $100 experience credit per booking. Markdown only mentions hotel-side benefits.
  - The card page does not surface a separate $75K spend benefit beyond the lounge-access unlock — unlike Chase Sapphire Reserve. For Venture X, $75K = lounge guests only.
```

## Confidence summary

| Field group | Confidence | Source(s) used |
|---|---|---|
| card_credit_score | high | issuer page application gate ("excellent credit") |
| card_membership_requirements | high | none listed at https://www.capitalone.com/credit-cards/venture-x/ |
| card_annual_credits | high | issuer page footnote-anchored copy |
| card_insurance | medium | issuer page benefit copy + Visa Infinite GTB inheritance (not re-fetched) |
| card_program_access | high | issuer page Lounge + Premier/Lifestyle Collection copy + Daily Drop policy table |
| card_co_brand_perks | high | issuer page Hertz copy + Premier/Lifestyle Collection copy |
| card_absent_perks | high | issuer page omissions |
| transfer_partner_sweet_spots | medium | inherits from capital_one_miles; partner ratios from existing markdown not re-fetched this run |

---

## card_credit_score

```
band: excellent
source: Issuer page application funnel uses "excellent credit" as the screening tier; APR ranges and approval data corroborate. — https://www.capitalone.com/credit-cards/venture-x/
notes: Capital One historically pulls multiple bureaus and does not strictly enforce a 5/24-equivalent — it has its own 1-card-per-month informal cadence. Approval skew is upper-tier prime FICO.
```

## card_membership_requirements

`none` — no membership requirement listed at https://www.capitalone.com/credit-cards/venture-x/

## card_annual_credits

| name | face_usd | period | ease (1-5) | realistic_pct | realistic_usd | enrollment_required | qualifying_purchases_open_ended | rationale + source |
|---|---|---|---|---|---|---|---|---|
| Capital One Travel Credit | 300 | annual_anniversary_year | 5 | 0.95 | 285 | false | true (any Capital One Travel booking) | "Receive a $300 annual Capital One Travel credit" — issuer page. Cash-flexible against any Capital One Travel booking; the easiest premium-card travel credit on the market. |
| Anniversary Bonus Miles | 200 (10,000 miles ~ 2c each) | annual_anniversary | 5 | 1.00 | 200 | false (auto) | n/a | "10,000 miles anniversary bonus … starting on your first anniversary" — issuer page. Capital One values these at $100 (1cpp via portal) but transfer-partner valuation is ~$200 (2cpp). |
| Global Entry / TSA PreCheck | 120 | every_4_years | 5 | 0.95 | 114 | false | false | Visa Infinite-tier benefit + Capital One-listed; "Global Entry or TSA PreCheck application fee credit" — issuer page Global Entry block. |

**Total face value:** $620 / year (treating anniversary miles at 2cpp transfer value).
**Realistic value (organized user):** ~$599 / year.
**Net AF after realistic capture:** $395 - $599 = ~-$204 in net value. Far and away the easiest premium-card AF to break even on.

> Note: The issuer page does NOT surface additional credits beyond these three. Unlike CSR/Plat, there is no coupon-book of monthly/quarterly subscriptions. This is by design and is the card's main pitch.

## card_insurance

```yaml
auto_rental_cdw:
  coverage_type: primary
  coverage_max_usd: 75000
  domestic: true
  international: true
  liability_included: false
  exclusions: [exotic_cars, antiques, off_road, motorcycles, large_passenger_vans, certain_make_exclusions]
  source: "Auto rental collision coverage. Get reimbursed for damage or theft when you pay for a rental car with the Venture X card" — issuer page Visa Infinite block; per-claim cap inherited from Visa Infinite GTB (not re-fetched).
  confidence: medium

trip_cancellation_interruption:
  available: true
  max_per_trip_usd: 5000
  notes: "Visa Infinite-tier; covers nonrefundable expenses when trip canceled/interrupted by covered reasons."
  source: Issuer page lists Trip Cancellation/Interruption as a Visa Infinite benefit; cap inherited.
  confidence: medium

trip_delay:
  available: true
  threshold_hours: 6
  max_per_ticket_usd: 500
  source: Issuer page surfaces Trip Delay as a benefit; threshold and cap inherited from Visa Infinite GTB.
  confidence: medium

baggage_delay:
  available: true
  threshold_hours: 6
  max_per_day_usd: 100
  max_days: 5
  source: Visa Infinite GTB inheritance.
  confidence: medium

lost_baggage:
  available: true
  max_per_trip_usd: 3000
  source: "Lost Luggage" Visa Infinite benefit, inherited.
  confidence: medium

cell_phone_protection:
  available: true
  coverage_max_per_claim_usd: 800
  deductible_usd: 50
  max_claims_per_12mo: 2
  requires_phone_bill_paid_with_card: true
  source: "Cell Phone Protection. Protect your cell phone every time you pay your bill with your Venture X card" — issuer page. Per-claim cap, deductible, and frequency from Capital One published terms (not surfaced verbatim in the marketing snippet — confidence high for existence, medium for precise caps).
  confidence: medium

emergency_evacuation_medical:
  available: true
  max_usd: 1000000
  source: Visa Infinite GTB inheritance.
  confidence: medium

travel_accident_insurance:
  available: true
  max_usd: 1000000
  source: Visa Infinite-tier inherited.
  confidence: medium

purchase_protection:
  available: false
  source: "Purchase Protection not listed on issuer page benefit grid; Capital One has historically NOT included Purchase Protection on Venture X (long-running gap noted by FrequentMiler/TPG). Markdown lists this as one of the absent perks already."
  confidence: high

extended_warranty:
  available: true
  notes: "Visa Infinite Extended Warranty Protection — extends manufacturer warranty by up to one year; inherited from Visa Infinite."
  source: Visa Infinite inheritance.
  confidence: medium

return_protection:
  available: false
  source: Not listed on issuer page; Visa Infinite does not standardly include Return Protection.
  confidence: medium

roadside_assistance:
  available: true
  type: "Visa Infinite Roadside Dispatch — pay-per-event"
  source: Visa Infinite inheritance.
  confidence: medium

primary_source_url: https://www.capitalone.com/credit-cards/venture-x/
benefits_guide_url: https://www.capitalone.com/learn-grow/credit-cards/venture-x-benefits-guide/
visa_infinite_gtb_inherited: true
```

## card_program_access

| program_id | access_kind | overrides / notes | source |
|---|---|---|---|
| capital_one_lounge_network | included (primary cardholder) | "Capital One Lounges Venture X primary cardholders can enjoy access to Capital One Lounge and Landing locations." | issuer page Capital One Lounges block |
| priority_pass_select | included (primary cardholder, lounges only) | "Venture X primary cardholders can enjoy access to 1,300+ participating lounges worldwide from Priority Pass" — Priority Pass Select Membership; enrollment required. | issuer page Priority Pass block |
| plaza_premium_lounges | inherited via PP | If listed in cardholder's PP app. | medium |
| capital_one_premier_collection | included | "Premier Collection hotel experience credit will be applied at checkout by hotel to qualifying charges up to $100 USD or the local currency equivalent." Plus daily breakfast for two, complimentary Wi-Fi, room upgrades when available, early check-in, late checkout. Vacation rental version: $100 experience credit per booking + Wi-Fi + ECI/LCO. | issuer page Premier Collection block |
| capital_one_lifestyle_collection | included | "Lifestyle Collection hotel experience credit will be applied at checkout by hotel to qualifying charges up to $50 USD or the local currency equivalent." Plus Wi-Fi, room upgrades when available, ECI/LCO. (No breakfast — that's Premier-only.) | issuer page Lifestyle Collection block |
| visa_infinite_lhc | included | Card is Visa Infinite — Visa Infinite Luxury Hotel Collection benefits available. | derived from network status |
| chase_sapphire_lounge_network | not_available | Chase-only network. | derived |
| centurion_lounge_network | not_available | Amex-only. | derived |
| delta_skyclub | not_available | Amex-Delta only. | derived |
| fhr | not_available | Amex-only program. | derived |
| amex_hotel_collection | not_available | Amex-only. | derived |
| chase_the_edit | not_available | Chase-only. | derived |
| capital_one_dining | included | Cap One has its own dining-network program; available to Venture X cardholders for select restaurants. | medium |
| capital_one_entertainment | included (5x earn) | "Plus earn 5X miles on Capital One Entertainment purchases." | issuer page earning block |
| amex_global_dining_access | not_available | Amex-only. | derived |
| platinum_nights_resy | not_available | Amex Platinum-only. | derived |
| amex_presale | not_available | Amex-only. | derived |
| amex_experiences | not_available | Amex-only. | derived |
| citi_entertainment | not_available | Citi-only. | derived |
| mastercard_priceless_cities | not_available | Card is Visa, not Mastercard. | derived |

## card_co_brand_perks

```yaml
hotel_status_grants: []  # Venture X does NOT grant any hotel co-brand status (no Hilton Gold, no Marriott Gold, no IHG Platinum, no Hyatt Explorist).

rental_status_grants:
  - program: hertz
    tier: presidents_circle
    auto_grant: false
    source: "Venture X cardholders must enroll in the Hertz Gold+ status upgrade through the unique Benefits Tab link found within the Capital One website or mobile app after logging in. … directly in or request an upgrade to Hertz President's Circle status" — issuer page Hertz block.
    notes: "Venture/VentureOne/Savor/Quicksilver/Spark Miles cardholders enroll in Hertz Five Star (downgrade tier); Venture X gets the upgrade-to-President's-Circle path."

prepaid_hotel_credit: null

premier_collection_experience_credit:
  amount_usd_per_booking: 100
  applied_at: "checkout by hotel for hotel bookings; at booking by host for vacation rentals"
  qualifying_program: capital_one_premier_collection
  min_nights: null
  booking_channel: "Capital One Travel"
  ancillary_perks: [daily_breakfast_for_two_hotels_only, complimentary_wifi, room_upgrade_if_available, early_checkin, late_checkout]
  source: "Premier Collection hotel experience credit will be applied at checkout by hotel to qualifying charges up to $100 USD" + "daily breakfast for two (for Premier Collection bookings only), complimentary Wi-Fi, and (when available) room upgrades, early check-in and late checkout" — issuer page.

lifestyle_collection_experience_credit:
  amount_usd_per_booking: 50
  applied_at: "checkout by hotel"
  qualifying_program: capital_one_lifestyle_collection
  booking_channel: "Capital One Travel"
  ancillary_perks: [complimentary_wifi, room_upgrade_if_available, early_checkin, late_checkout]
  source: "Lifestyle Collection hotel experience credit will be applied at checkout by hotel to qualifying charges up to $50 USD" — issuer page.

free_night_certificates: []

complimentary_dashpass: false
ten_pct_anniversary_bonus: false

spend_threshold_lounge_unlock:
  unlock: "2 free lounge guests + 1 free landing guest (Priority Pass guest access remains paid: $35/guest)"
  threshold_usd_per_calendar_year: 75000
  effective_date: 2026-02-01
  source: "Free guest access is no longer available unless you spend $75,000 or more in the prior calendar year. If you hit that threshold, you'll get two free guests for Lounges and one for Landings." — https://www.dailydrop.com/pages/capital-one-lounge-access-changes
  notes: "$75K spend window starts 2025 calendar year; guest access in 2026 requires hitting $75K in 2025."

authorized_user_lounge_fee:
  fee_usd_per_year: 125
  fee_applies_per: authorized_user
  effective_date: 2026-02-01
  source: "Authorized users on the Venture X will no longer get free lounge access. You'll have to pay $125 per year (per user) to keep that perk." — Daily Drop.
  notes: "Without paying $125/AU/yr, AUs get NO lounge access at all (not even paid-guest level)."

guest_pricing_fallback:
  capital_one_lounge_or_landing:
    adult_18plus_usd: 45
    child_2_to_17_usd: 25
    under_2: free
  priority_pass:
    per_guest_usd: 35
    notes: "Priority Pass complimentary guest access is removed entirely; even if cardholder hits $75K spend, PP guests are still $35 each."
  source: Daily Drop.

welcome_offer_current_public:
  amount_pts: 75000
  spend_required_usd: 4000
  spend_window_months: 3
  source: "Enjoy premium travel benefits with 75,000 bonus miles" — issuer page header copy.

additional_cardholders:
  fee_per_au: 0
  max_aus: 4
  source: Daily Drop comparison table.
```

## card_absent_perks

```yaml
- perk_key: hotel_elite_status_grant
  reason: "Venture X grants no hotel elite status (no Hilton Gold, Marriott Gold, IHG Platinum, Hyatt Explorist). The hotel value-add is the Premier/Lifestyle Collection per-booking experience benefits, not a status grant."
  workaround: "Pair with Amex Plat (Hilton + Marriott Gold), CSR (IHG Platinum + Hyatt Explorist at $75K), or a hotel co-brand for true elite status."

- perk_key: purchase_protection
  reason: "Not listed on issuer page benefit grid; Capital One has historically NOT included Purchase Protection on Venture X."
  workaround: "Pair with CSR or Plat for Purchase Protection coverage."

- perk_key: return_protection
  reason: "Not listed on issuer page; Visa Infinite does not standardly include Return Protection."
  workaround: "Use CSR or Amex Plat for Return Protection."

- perk_key: complimentary_dashpass
  reason: "Not surfaced as a Venture X benefit on issuer page."
  workaround: "Pair with CSR / CSP for DashPass."

- perk_key: amex_global_dining_access_resy
  reason: "Amex-only program."
  workaround: "Use Capital One Dining for the Cap One ecosystem analog."

- perk_key: anniversary_free_night
  reason: "Venture X is not a hotel co-brand."
  workaround: "Pair with Marriott Brilliant, Hilton Aspire, IHG Premier, or World of Hyatt for FNCs."

- perk_key: free_authorized_user_lounge_access
  reason: "As of 2026-02-01, AUs no longer get free lounge access; $125/AU/yr fee required. Source: Daily Drop."
  workaround: "Either pay $125/AU/yr per AU, or have AUs pay per-visit guest fees ($45/adult Cap One Lounge, $35 PP)."
```

## transfer_partner_sweet_spots (for `capital_one_miles`)

| partner_id | sweet_spot_tags | notes | source |
|---|---|---|---|
| turkish_miles_smiles | [turkish_united_domestic_7500, turkish_transcon_12500, turkish_europe_biz_45000] | The single best Cap One sweet spot — United domestic shorts at 7,500 mi, transcon at 12,500 mi, Europe biz at 45,000 mi. | https://thepointsguy.com/guide/turkish-miles-smiles-sweet-spots/ — partner ratios in current markdown; not re-fetched this run; medium |
| avianca_lifemiles | [lifemiles_us_europe_biz_63k, lifemiles_star_alliance_partners] | Star Alliance partners with no fuel surcharges. | Same; medium |
| air_canada_aeroplan | [aeroplan_distance_chart_transcon, aeroplan_stopover_award] | Distance chart + free stopover. | Same; medium |
| british_airways | [ba_short_haul_aa_partner, ba_iberia_off_peak] | Short-haul AA + Iberia off-peak. | Same; medium |
| iberia | [iberia_off_peak_us_madrid_biz_34k] | Iberia off-peak US-MAD biz at 34K. | Same; medium |
| air_france_klm_flying_blue | [fb_promo_awards_monthly, fb_premium_economy_us_eu] | Promo Rewards + PE US-EU. | Same; medium |
| singapore_krisflyer | [singapore_first_class_to_asia] | KrisFlyer Saver F. | Same; medium |
| cathay_asia_miles | [cathay_first_class_to_asia] | Cathay First to HKG. | Same; medium |
| qantas_frequent_flyer | [transfer_avoid_low_value_ratio] | Mostly poor outside specific Oneworld redemptions. | medium |
| emirates_skywards | [transfer_avoid_low_value_ratio] | 2:1.5 ratio + high YQ; rarely worth it. | Existing markdown notes "Less favorable" 2:1.5 ratio. |
| wyndham_rewards | [wyndham_vacasa_7500] | Wyndham 7,500-pt Vacasa rentals. | Existing markdown sweet-spot. |
| accor_live_limitless | [accor_iberostar_off_peak] | Accor 2:1 — only useful for off-peak Iberostar/Fairmont. | Existing markdown sweet-spot. |
| choice_privileges | [transfer_avoid_low_value_ratio] | 1:1; rarely the best play vs Wyndham. | medium |

## Conflicts found between sources

```yaml
- field: card_co_brand_perks.spend_threshold_lounge_unlock
  sources:
    - cards/capital_one_venture_x.md (current): notes "$75k spend unlocks complimentary guest lounge access for that calendar year" — partial; doesn't break out PP vs Cap One Lounge
    - https://www.dailydrop.com/pages/capital-one-lounge-access-changes: $75K unlocks 2 free Cap One Lounge guests + 1 free Landing guest; PP guest access still costs $35/guest even at $75K spend
  values: ["unlocks guest lounge access broadly", "unlocks Cap One Lounge guests only; PP guests stay $35"]
  resolution: trust_independent_authority
  applied_value: "$75K unlocks Cap One Lounge/Landing guests only; PP remains $35/guest"

- field: signup_bonus.amount_pts
  sources:
    - cards/capital_one_venture_x.md (current): {amount_pts: 75000, spend_required_usd: 4000, spend_window_months: 3}
    - https://www.capitalone.com/credit-cards/venture-x/: 75,000 bonus miles header (offer details footnote-anchored)
  values: [75000, 75000]
  resolution: agree
  applied_value: 75000 / $4000 / 3 months

- field: anniversary_bonus_miles_value
  sources:
    - cards/capital_one_venture_x.md (current): valued at "~2cpp" -> $200
    - issuer page: bonus = "10,000 miles" valued by Capital One marketing as $100 (1cpp via portal)
  values: [200, 100]
  resolution: keep_both_views
  applied_value: 200 (via partner transfer); 100 (via portal)
```

## Diff vs current markdown (cards/capital_one_venture_x.md)

```yaml
new_fields_populated:
  - card_co_brand_perks.lifestyle_collection_experience_credit: $50/booking + Wi-Fi/ECI/LCO/upgrade
  - card_co_brand_perks.premier_collection_experience_credit (vacation_rentals): $100 experience credit at booking via host
  - card_co_brand_perks.guest_pricing_fallback: $45 adult / $25 child 2-17 / under-2 free for Cap One Lounges; $35 PP guest
  - card_co_brand_perks.authorized_user_lounge_fee: $125/AU/yr for any lounge access post-2026-02-01
  - card_co_brand_perks.additional_cardholders.max_aus: 4
  - card_program_access.capital_one_entertainment: 5x earn confirmed
  - card_absent_perks.purchase_protection (now structured)

fields_refined:
  - card_co_brand_perks.spend_threshold_lounge_unlock: now correctly notes Cap One Lounge guest unlock ONLY; PP guests stay paid
  - card_program_access.priority_pass_select: confirmed primary-only

conflicts_left_unresolved:
  - card_insurance per-claim caps (auto rental, trip delay, lost luggage, etc.) - confidence medium pending direct fetch of capitalone.com/learn-grow/credit-cards/venture-x-benefits-guide/ + Visa Infinite GTB

existing_markdown_data_preserved_verbatim:
  - annual_fee_usd: 395
  - foreign_tx_fee_pct: 0
  - earning rates: 10x hotels/rentals via Cap One Travel, 5x flights/vacation rentals via Cap One Travel, 5x Capital One Entertainment, 2x else
  - currency_earned: capital_one_miles
  - issuer_rules: 1-card-per-month, 2-personal-card max informal, 48-month bonus rule on some products, multi-bureau pull
  - signup_bonus: 75K / $4K / 3 months
  - $300 Capital One Travel credit
  - 10,000 anniversary miles
  - $120 Global Entry/TSA PreCheck credit
  - Hertz President's Circle (enroll via Cap One Benefits Tab)
  - Cell phone protection (existence)
  - Auto Rental Collision Damage (Visa Infinite primary)
  - Trip cancellation/interruption + Trip delay + Lost luggage (Visa Infinite tier)
  - Capital One miles transfer partner table
  - Sweet spots: Turkish, LifeMiles, Wyndham Vacasa, Accor 2:1
```

## Fetch log

```
- url: https://www.capitalone.com/credit-cards/venture-x/
  status: 200
  content_type: text/html
  bytes_received: ~999,731 (truncated at 1MB ceiling)
  fetched_at: 2026-05-01

- url: https://www.dailydrop.com/pages/capital-one-lounge-access-changes
  status: 200
  content_type: text/html
  bytes_received: ~155,115
  fetched_at: 2026-05-01
  used_for: definitive 2026-02-01 lounge-access policy details ($75K threshold, $125 AU fee, $45/$25/$35 guest pricing)

- WebSearch: "Capital One Venture X lounge access changes February 2026 guests primary"
  status: ok
  used_for: discovering Daily Drop article + cross-source confirmation
```
