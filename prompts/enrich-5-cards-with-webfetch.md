# Prompt — re-enrich 5 priority credit cards with WebFetch grounding

> Paste this entire document into a new Claude session that has WebFetch, WebSearch, Read, and Write tools available. The session will produce 5 grounded enrichment reports under `/Users/angel/1000Problems/perks/enrichment-reports/`, overwriting the previous training-data-based versions. Do NOT generate any field value from training data — every claim must cite a fetched source.

---

## Goal

You are enriching five credit-card records in the catalog at `/Users/angel/1000Problems/perks/`. The catalog uses a Postgres schema (see `db/migrations/0001_init_catalog.sql` etc.) that supports rich "soul perks" data — structured insurance, ease-of-redemption scoring, transfer-partner sweet-spot tags, network-inherited benefits, absent-perks-explicit. The existing markdown at `cards/<card_id>.md` has the basics; your job is to ground the missing structured fields against authoritative sources and write a per-card enrichment report.

A previous session generated reports from training data. Those are flawed. You will replace them with grounded, citation-bearing reports.

## Hard rules — read every one before starting

1. **No fallback to training data, ever.** If WebFetch fails for a source, the field stays NULL with `confidence: no_source` and the failure is logged in the report. Do not guess from memory. Do not interpolate from "what these cards usually have." If a value is not in a fetched source, it does not appear in the report.

2. **Every populated field must carry a citation.** Either a quoted excerpt or a `[source_url + paragraph_locator]` reference. Reports that lack citations will be rejected.

3. **Source hierarchy (locked):**
   1. Issuer's official card page (chase.com, americanexpress.com, capitalone.com) — canonical for terms, fees, earn rates, dates, listed credits.
   2. Issuer's Guide-to-Benefits PDF — canonical for insurance specifics. PDFs at `chase.com/content/dam/cs-asset/pdf/credit-cards/...` and similar.
   3. Frequent Miler comparison tables — cross-check insurance values and transfer ratios.
   4. The Points Guy / OMAAT / Upgraded Points — narrative confirmation only, not numerical truth.
   5. Reddit / forums — anecdotal, never authoritative.

4. **When sources conflict:** trust the issuer page or GTB PDF. Log the disagreement in the report's `notes` field. Do not split the difference.

5. **Confidence per field group, marked honestly:**
   - `high` = direct fetch from issuer page or GTB PDF, value quoted verbatim
   - `medium` = fetched from Tier 2 source (Frequent Miler, etc.) without issuer confirmation
   - `low` = inferred from related fields, or fetched source was ambiguous
   - `no_source` = WebFetch failed, value is NULL

6. **PDFs.** Some Guide-to-Benefits documents are PDFs. If WebFetch returns the PDF as readable text, use it. If WebFetch can't extract the PDF (binary blob, error, empty response), fall back to the issuer's HTML benefits page and mark insurance fields `confidence: medium`. Do not invent insurance values.

7. **Halt-on-failure for the run.** If you cannot fetch the issuer's primary card page for a given card, mark that card `status: blocked` in its report and move on. Do not produce a partial report based on Tier 2 sources alone.

8. **Date discipline.** Today is 2026-05-01. Mark each report with `last_verified: 2026-05-01`. If a fetched source has a "last updated" date older than 2024-01-01, flag the source as potentially stale.

## The five cards

Each line: `card_id` | issuer card page | secondary sources to cross-check.

```
amex_platinum
  primary:    https://www.americanexpress.com/us/credit-cards/card/platinum/
  benefits:   https://www.americanexpress.com/us/credit-cards/card/platinum/?intlink=us-amex-cardshop-premium-platinum-card-MainBenefits
  cross-check: https://thepointsguy.com/credit-cards/reviews/amex-platinum-review/
  cross-check: https://frequentmiler.com/amex-platinum-card-review/

chase_sapphire_reserve
  primary:    https://creditcards.chase.com/rewards-credit-cards/sapphire/reserve
  benefits:   https://account.chase.com/sapphire/reserve/benefits
  gtb_pdf:    https://www.chase.com/content/dam/cs-asset/pdf/credit-cards/sapphire-reserve-guide-to-benefits.pdf
  cross-check: https://thepointsguy.com/credit-cards/chase-sapphire-reserve-credits/
  cross-check: https://frequentmiler.com/chase-sapphire-reserve-review/

capital_one_venture_x
  primary:    https://www.capitalone.com/credit-cards/venture-x/
  benefits:   https://www.capitalone.com/learn-grow/credit-cards/venture-x-benefits-guide/
  cross-check: https://thepointsguy.com/credit-cards/reviews/capital-one-venture-x/
  cross-check: https://www.dailydrop.com/pages/capital-one-lounge-access-changes
  cross-check: https://frequentmiler.com/capital-one-venture-x-review/

amex_gold
  primary:    https://www.americanexpress.com/us/credit-cards/card/gold-card/
  cross-check: https://thepointsguy.com/news/american-express-gold-refresh-2026/
  cross-check: https://upgradedpoints.com/news/amex-gold-card-new-benefits-2026/
  cross-check: https://frequentmiler.com/amex-gold-card-review/

chase_sapphire_preferred
  primary:    https://creditcards.chase.com/rewards-credit-cards/sapphire/preferred
  gtb_pdf:    https://www.chase.com/content/dam/cs-asset/pdf/credit-cards/sapphire-preferred-guide-to-benefits.pdf
  cross-check: https://thepointsguy.com/credit-cards/chase-sapphire-preferred-current-offer/
  cross-check: https://upgradedpoints.com/credit-cards/reviews/chase-sapphire-preferred-card/
  cross-check: https://frequentmiler.com/chase-sapphire-preferred-review/
```

If a URL listed above 404s or redirects, search for the current canonical URL via WebSearch. Do not fall through to training data.

## Workflow per card

```
1. Read /Users/angel/1000Problems/perks/cards/<card_id>.md
   → captures known basics, current sources list, breakeven_logic_notes
   → preserves what's already correct

2. WebFetch the issuer primary URL
   → if it returns clean HTML/text: extract annual fee, foreign tx fee,
     earn rates with caps, every listed annual credit with terms, every
     listed perk, signup bonus current offer
   → if 404 / blocked / empty: WebSearch "<card_name> official page"
     and try the top-result canonical URL
   → if still failing: card status = blocked, write blocked report, move on

3. WebFetch the Guide-to-Benefits PDF (Chase cards) or benefits HTML page
   → extract every insurance coverage_kind: auto_rental_cdw, trip_delay,
     trip_cancellation_interruption, baggage_delay, lost_baggage,
     cell_phone_protection, emergency_evacuation, travel_accident,
     purchase_protection, extended_warranty, return_protection,
     roadside_assistance
   → for each: structured config matching the soul-doc §2.5 shape
     (coverage_type, coverage_max_usd, threshold_hours, exclusions, etc.)
   → if a coverage is NOT mentioned anywhere in the GTB: emit
     {available: false, source: "absent from <gtb_url>"}
   → if PDF extraction fails: fall back to issuer's benefits HTML page,
     mark insurance fields confidence: medium

4. WebFetch one cross-check source (Frequent Miler preferred)
   → confirm insurance values
   → confirm transfer-partner ratios (for cards earning transferable points)
   → log conflicts in the `Conflicts` section of the report

5. WebSearch "<card_name> 2026 changes" (or "2025 refresh")
   → catch recent revisions
   → especially: AF changes, credit additions/removals, transfer-partner
     cuts, lounge-access policy changes

6. Compose the enrichment report (template below) at:
   /Users/angel/1000Problems/perks/enrichment-reports/<card_id>.md
   → overwrite the existing training-data-based version
   → every populated field carries a citation
   → every NULL or absent field has a justification
```

## Output report template (use exactly this structure)

```markdown
# Enrichment: <Card Name>

​```
card_id:        <card_id>
last_verified:  2026-05-01
prompt_version: v2-webfetch
model:          <your model id>
status:         ready_for_review | blocked
sources_consulted:
  - <url> (fetched: yes/no, status: 200/4xx/5xx, content_type: html/pdf/other)
  - <url> ...
​```

## Confidence summary

| Field group | Confidence | Source(s) used |
|---|---|---|
| card_credit_score | high/medium/low/no_source | <url> |
| card_membership_requirements | ... | <url> |
| card_annual_credits | ... | <url> |
| card_insurance | ... | <url + GTB excerpt> |
| card_program_access | ... | <url> |
| card_co_brand_perks | ... | <url> |
| card_absent_perks | ... | (derived; no source needed) |
| transfer_partner_sweet_spots | ... | <issuer transfer page url> |

---

## card_credit_score

​```
band: <building | fair | good | very_good | excellent | unknown>
source: "<quoted excerpt from issuer page>" — <url>
notes: <optional>
​```

## card_membership_requirements

YAML list of membership requirements with sources, or `none` with citation
"no membership requirement listed at <url>".

## card_annual_credits

For each credit: a markdown table row with these columns. Cite the source URL
in the rationale or in a separate `source` column.

| name | face_usd | period | ease_score (1-5) | realistic_pct (0.30-0.95) | realistic_usd | enrollment_required | qualifying_purchases_open_ended | rationale + source |

ease_score heuristic (locked):
- 5: cash-flexible (Venture X $300 travel, any travel booking)
- 4: broad merchant where most cardholders already spend (Walmart+, Uber)
- 3: specific brand still useful (DoorDash, Resy in big metros)
- 2: narrow category with friction (Amex airline incidental)
- 1: coupon book (Saks $50, Peloton $10/mo, Equinox)

realistic_pct mapping default (override per credit if rationale supports):
- ease_score 5 → 0.95
- ease_score 4 → 0.85
- ease_score 3 → 0.65
- ease_score 2 → 0.50
- ease_score 1 → 0.30

Total face value: $X / year
Total realistic value: $Y / year (organized user)

## card_insurance

For each coverage_kind in the canonical 12, emit a YAML block. If absent:
`available: false` with citation "<kind> not listed at <gtb_url>".

​```yaml
auto_rental_cdw:
  coverage_type: primary | secondary
  coverage_max_usd: <number>
  domestic: true | false
  international: true | false
  exclusions: [...]
  source: "<quoted excerpt>" — <gtb_url or benefits_url>
trip_cancellation_interruption: ...
trip_delay:
  threshold_hours: <number>
  max_per_ticket_usd: <number>
  source: ...
baggage_delay: ...
lost_baggage: ...
cell_phone_protection:
  coverage_max_per_claim_usd: <number>
  deductible_usd: <number>
  max_claims_per_year: <number>
  requires_phone_bill_paid_with_card: true
  source: ...
emergency_evacuation_medical: ...
travel_accident_insurance: ...
purchase_protection: ...
extended_warranty: ...
return_protection: ...
roadside_assistance: ...

primary_source_url: <gtb_pdf_url or benefits_html_url>
​```

## card_program_access

Markdown table:

| program_id | access_kind | overrides / notes | source |

Programs to consider (controlled vocabulary from the schema):
- fhr (Amex Fine Hotels + Resorts)
- amex_hotel_collection (Amex THC)
- chase_the_edit
- capital_one_premier_collection
- capital_one_lifestyle_collection
- citi_hotel_collection
- visa_infinite_lhc
- visa_signature_lhc
- mastercard_luxury_hotels
- centurion_lounge_network
- priority_pass_select
- chase_sapphire_lounge_network
- capital_one_lounge_network
- delta_skyclub
- escape_lounges, airspace_lounges, plaza_premium_lounges
- amex_global_dining_access
- platinum_nights_resy
- capital_one_dining
- amex_presale, amex_experiences
- capital_one_entertainment
- citi_entertainment
- mastercard_priceless_cities

Mark `not_available` with a one-line citation/reason for major programs the card does NOT have (especially Centurion-vs-PP, Edit-vs-FHR, Visa-Infinite-vs-Signature distinctions).

## card_co_brand_perks

​```yaml
hotel_status_grants:
  - program: marriott_bonvoy | hilton_honors | ihg_one_rewards | world_of_hyatt | etc.
    tier: <enum>
    auto_grant: true | false
    via_spend_threshold: <number or null>
    valid_through: <date or "ongoing">
    source: ...

rental_status_grants:
  - program: hertz | avis | national | etc.
    tier: <enum>
    auto_grant: true | false
    source: ...

prepaid_hotel_credit:
  amount_usd_per_period: <number>
  period: semi_annual | annual | calendar_year
  qualifying_programs: [<list>]
  min_nights: <number>
  booking_channel: <url or service name>
  source: ...

free_night_certificates:  # mostly hotel co-brands
  - trigger: anniversary
    value_cap_currency: <points or usd>
    value_cap_threshold: <number>
    topup_allowed: true | false
    valid_property_brands: [<list>]
    expires_after_months: <number>
    source: ...

complimentary_dashpass: ... (CSP/CSR pattern)
ten_pct_anniversary_bonus: ... (CSP pattern)
spend_threshold_lounge_unlock: ... (Venture X 2026 pattern)
​```

## card_absent_perks

YAML list. Each entry: `{perk_key, reason, workaround}`. The reason cites
which fetched source confirmed the absence (e.g., "not listed at <url>" or
"explicitly excluded per <url>").

Aim for the 5-8 most-confused absences per card. Examples:
- For Amex Plat: no chase_offers_dynamic, no fhr-or-thc-substitute-on-Visa
- For CSR: no fhr_or_thc_access (Amex-only programs), no centurion_lounge_access
- For Venture X: no hotel_elite_status_grant, no purchase_protection
- For Amex Gold: no priority_pass, no cell_phone_protection, no centurion_lounge
- For CSP: no lounge_access_at_all, no cell_phone_protection

## transfer_partner_sweet_spots (for `currency_earned`)

Markdown table:

| partner_id | sweet_spot_tags (controlled vocab) | notes | source |

Controlled-vocab sweet-spot tags to use (don't invent new ones unless
necessary):
- hyatt_cat_1_4_3500_to_15000
- hyatt_aspirational_park_hyatt
- united_excursionist_perk
- united_economy_partner_redemptions
- sw_companion_pass_when_eligible
- aeroplan_distance_chart_transcon
- aeroplan_stopover_award
- ba_short_haul_aa_partner
- ba_iberia_off_peak
- iberia_off_peak_us_madrid_biz_34k
- va_ana_first_business_to_japan
- va_delta_one_us_eu_off_peak
- va_transatlantic_economy_15k
- ana_round_world_business
- lifemiles_us_europe_biz_63k
- lifemiles_star_alliance_partners
- fb_promo_awards_monthly
- fb_premium_economy_us_eu
- turkish_united_domestic_7500
- turkish_transcon_12500
- turkish_europe_biz_45000
- cathay_first_class_to_asia
- singapore_first_class_to_asia
- wyndham_vacasa_7500
- accor_iberostar_off_peak
- transfer_avoid_low_value_ratio (for partners that look 1:1 but aren't worth it)

Source per row: the issuer's transfer-partner page (americanexpress.com/...,
chase.com/..., capitalone.com/...) plus optional Frequent Miler / TPG
guide URL.

## Conflicts found between sources

YAML list. For each conflict: `{field, sources, values, resolution}`.

Example:
​```yaml
- field: cell_phone_protection.max_per_claim_usd
  sources:
    - https://www.chase.com/.../sapphire-reserve-guide-to-benefits.pdf: 1000
    - https://thepointsguy.com/csr-credits/: 800
  values: [1000, 800]
  resolution: trust_issuer  # GTB PDF wins per source hierarchy
  applied_value: 1000
​```

## Diff vs current markdown

YAML or short-bullet list:
- New fields populated (not in markdown)
- Fields refined (override markdown's existing data)
- Conflicts left unresolved (need human review)
- Existing markdown data preserved verbatim

## Fetch log

Append the WebFetch results for transparency:

​```
- url: https://www.americanexpress.com/us/credit-cards/card/platinum/
  status: 200
  content_type: text/html
  fetched_at: 2026-05-01T12:34:56Z
  bytes_received: 421000
- url: https://www.chase.com/.../sapphire-reserve-guide-to-benefits.pdf
  status: 200
  content_type: application/pdf
  extracted_text_length: 18500
  fetched_at: ...
- url: https://www.dailydrop.com/pages/capital-one-lounge-access-changes
  status: 404
  fetched_at: ...
  fallback: WebSearch "capital one lounge access 2026 changes"
  fallback_url_used: <discovered_url>
​```
```

## Verification gate before declaring complete

For each of the 5 cards, before the report is considered done:

1. Every populated field has a source citation (URL + quote/excerpt) in the report.
2. `sources_consulted` lists at least one issuer URL with `fetched: yes, status: 200`.
3. Insurance fields either have a GTB PDF citation OR are explicitly marked `confidence: medium` with the benefits HTML URL.
4. The `Fetch log` section enumerates every WebFetch call made for that card.
5. The `Conflicts found` section is present (empty list is fine; missing section is not).
6. No claim in any field group is sourced from "training" or "general knowledge."

If a verification check fails, fix the report before moving to the next card.

## Final summary

After all 5 reports are written, append a summary at `/Users/angel/1000Problems/perks/enrichment-reports/RUN_SUMMARY_v2.md`:

```markdown
# Run summary — 2026-05-XX (v2 webfetch-grounded)

## Per-card outcomes
- amex_platinum: ready_for_review | blocked
- chase_sapphire_reserve: ...
- capital_one_venture_x: ...
- amex_gold: ...
- chase_sapphire_preferred: ...

## Aggregate stats
- Cards completed: X / 5
- Cards blocked: X / 5
- Total WebFetch calls: X
- Failed fetches: X
- Conflicts surfaced: X

## Material differences vs v1 (training-data) reports
- <list of values that changed in v2 because real source disagreed with training>

## Recommendations for next batch
- Which Tier 1 sources work cleanly via WebFetch
- Which need browser automation or a PDF-extraction script fallback
- Whether the GTB PDFs are scrape-able or whether we need to download → pdftotext → re-prompt
```

## Background context (read once, don't ask follow-ups)

The catalog is at `/Users/angel/1000Problems/perks/`. Each card lives in `cards/<card_id>.md` with embedded JSON blocks (cards.json entry, programs.json entry, etc.). The new Postgres schema lives in `db/migrations/0001_init_catalog.sql` through `0004_init_image_system.sql`. The schema supports: `card_annual_credits` (with `ease_score`, `realistic_redemption_pct`, generated `realistic_value_usd`), `card_insurance` (with `coverage_kind` + `config jsonb`), `card_program_access`, `card_co_brand_perks`, `card_absent_perks`, `program_transfer_partners` with sweet-spot tag arrays, etc. Read the migration files if you need exact column names.

The methodology comes from a "soul doc" at `/Users/angel/Library/Application Support/Claude/local-agent-mode-sessions/.../uploads/perksSoul_*.md` — but you don't need to read it; the structure is captured in the report template above.

Project rules from `/Users/angel/1000Problems/perks/CLAUDE.md`:
- Grounded, humanlike writing — concrete facts, varied sentence structures, no LLM patterns
- Save tokens aggressively — no filler
- Never expose API keys or secrets — env var names only

## What you are NOT doing in this run

- Not writing to the Postgres database. The reports are markdown only.
- Not editing the source markdown at `cards/<card_id>.md`.
- Not generating image data, eligibility rules, or pricing models.
- Not enriching cards beyond the five listed above.
- Not fetching every URL transitively — only the ones listed per card plus targeted WebSearch for fallbacks.

## Begin

Start with `amex_platinum`. Work through the five cards in the order listed. Pause after each card to verify the report meets the verification gate before moving to the next. After all five, write `RUN_SUMMARY_v2.md` and stop.
