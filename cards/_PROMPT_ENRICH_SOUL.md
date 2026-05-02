# Prompt — enrich a single card with WebFetch-grounded soul data

Paste everything below this line into a fresh Claude session that has WebFetch, WebSearch, Read, and Write tools available. Then on the line that says `ENRICH THIS CARD`, write the `card_id` (e.g. `amex_business_platinum`). Claude will produce ~6 markdown soul sections appended to `cards/<card_id>.md`. The build script will Zod-validate them; the migrate script will fan them out into the Postgres `card_*` child tables.

> **Companion docs to read once before running, if you haven't:**
> - `docs/SOUL_SCHEMA_PROPOSAL.md` — the section-by-section schema spec
> - `enrichment-reports/amex_platinum.md` — a fully worked v2 example
> - `cards/amex_platinum.md` — the same card after soul integration (lines 180+)

---

## Mission

Produce 6 new markdown sections to append to the bottom of `cards/<card_id>.md`. Each section contains a single `\`\`\`json` fenced block. Every populated field carries a `source` (quoted excerpt + URL) and a `confidence` (one of `high | medium | low | no_source`). No training-data fabrication: if WebFetch fails for a source, the field is `null`/`available: false` with `confidence: no_source` and the failure is logged in the fetch_log.

Sections to produce, in order:

```
## card_soul.credit_score        — JSON object
## card_soul.annual_credits      — JSON array
## card_soul.insurance           — JSON object keyed by coverage_kind
## card_soul.program_access      — JSON array
## card_soul.co_brand_perks      — JSON object
## card_soul.absent_perks        — JSON array
## card_soul.fetch_log           — fenced ``` (not json) block, free-form
```

## Hard rules

1. **No fallback to training data, ever.** Every populated field cites a fetched URL. If a field can't be sourced, it's `null` with `confidence: no_source`.
2. **Source hierarchy (locked):**
   1. Issuer's official card page (chase.com, americanexpress.com, capitalone.com)
   2. Issuer's Guide-to-Benefits PDF
   3. Frequent Miler comparison tables / Doctor of Credit
   4. The Points Guy / OMAAT / Upgraded Points (narrative confirmation only)
   5. Reddit / forums (anecdotal, never authoritative)
3. **Confidence enum:**
   - `high` = direct fetch from Tier 1 source, value quoted verbatim
   - `medium` = fetched from Tier 2 source without issuer confirmation; or per-claim caps inherited from Visa/Mastercard network GTB
   - `low` = inferred from related fields; or fetched source ambiguous
   - `no_source` = fetch failed; value is null
4. **PDFs:** Chase GTB PDFs return binary-corrupt via WebFetch text mode. Fall back to issuer HTML benefits page or Tier 2 sources, mark `confidence: medium`.
5. **Halt-on-failure for the run.** If you cannot fetch the issuer's primary card page, mark `status: blocked` and stop on this card; do not produce a partial soul block from Tier 2 sources alone.
6. **Date discipline.** Today is the date in your env block. If a fetched source has a "last updated" date older than 2024-01-01, flag the source as potentially stale.
7. **Cross-check.** When sources conflict, trust the issuer page or GTB PDF. Log the disagreement in `fetch_log`.
8. **Append, don't replace.** The existing `cards.json entry` block stays. Soul sections go at the bottom, after `## RESEARCH_NOTES.md entries`.

## Workflow per card

```
1. Read cards/<card_id>.md
   → captures known basics, current sources list, breakeven_logic_notes
2. WebFetch the issuer primary card URL
   → if 404 / blocked: WebSearch "<card_name> official page" + try canonical
   → if still failing: status: blocked, write blocked report, stop
3. WebFetch the GTB PDF (Chase) or benefits HTML page (Amex/Cap One)
   → if PDF mangled: fall back to issuer benefits HTML, mark confidence: medium
4. WebFetch one cross-check (Frequent Miler preferred)
   → confirm insurance values
   → catch refresh-driven changes
5. WebSearch "<card_name> 2026 changes" — catch recent revisions
6. Compose the 6 soul sections.
7. Append to cards/<card_id>.md.
8. Validate locally (the user will run npm run cards:build):
   → every JSON block parses
   → every populated field has a source + confidence
   → fetch_log enumerates every WebFetch call
```

## Section schemas

**See `docs/SOUL_SCHEMA_PROPOSAL.md` for the full spec.** Summary:

- `card_soul.credit_score` — `{band, source, confidence, notes}`. `band ∈ building|fair|good|very_good|excellent|unknown`.
- `card_soul.annual_credits` — array of credits with `name, face_value_usd, period, ease_score (1-5), realistic_redemption_pct (0-1), enrollment_required, qualifying_purchases_open_ended, expires_if_unused, stackable_with_other_credits, qualifying_spend, notes, source, confidence`. `period ∈ calendar_year|anniversary_year|monthly|quarterly|split_h1_h2|every_4_years|every_5_years`.
- `card_soul.insurance` — object keyed by `coverage_kind` (controlled vocab: `auto_rental_cdw, trip_cancellation_interruption, trip_delay, baggage_delay, lost_baggage, cell_phone_protection, emergency_evacuation_medical, emergency_medical_dental, travel_accident_insurance, purchase_protection, extended_warranty, return_protection, roadside_assistance`). Each block has `available: bool, source, confidence` plus per-coverage-kind fields (e.g. trip_delay has `threshold_hours, max_per_ticket_usd`). Plus sibling top-level fields `primary_source_url, gtb_pdf_url`.
- `card_soul.program_access` — array of `{program_id, access_kind, overrides, notes, source, confidence}`. `access_kind ∈ included|not_available|inherited_via_pp|spend_unlock|conditional`. **Include `not_available` rows for the major programs the card explicitly lacks** (Centurion vs PP, Edit vs FHR, Visa Infinite vs Signature, etc).
- `card_soul.co_brand_perks` — object with named groups: `hotel_status_grants[], rental_status_grants[], prepaid_hotel_credit, free_night_certificates[], complimentary_dashpass, ten_pct_anniversary_bonus, spend_threshold_lounge_unlock, welcome_offer_current_public, additional_cardholders, points_boost_redemption, …`. New groups can be added — the migrate script fans out.
- `card_soul.absent_perks` — array of `{perk_key, reason, workaround, confidence}`. Aim for 5-8 most-confused absences per card.
- `card_soul.fetch_log` — non-JSON fenced block. List every URL fetched with status, content type, bytes, fallbacks used. Free-form.

## ease_score heuristic (locked)

```
5 — cash-flexible (Venture X $300 travel; Chase $300 anniversary travel; broad merchant credit)
4 — broad merchant where most cardholders already spend (Walmart+, Uber, DashPass)
3 — specific brand still useful (Resy in major metros, Lululemon, DoorDash promos)
2 — narrow category with friction (Amex airline incidental locked to one carrier)
1 — coupon book (Saks $50, Peloton $10/mo, Equinox, Oura ring one-time, SoulCycle bike)
```

## realistic_pct mapping default (override per credit if rationale supports)

```
ease_score 5 → 0.95
ease_score 4 → 0.85
ease_score 3 → 0.65
ease_score 2 → 0.50
ease_score 1 → 0.30
```

## Verification gate before declaring complete

For the card, before the soul block is considered done:

1. Every populated field has a source citation (URL + quote/excerpt) or is explicitly marked `confidence: no_source` with reason.
2. The issuer URL was fetched with status 200.
3. Insurance fields either cite a GTB PDF or the issuer benefits HTML page; `confidence: medium` when only the latter.
4. `fetch_log` enumerates every WebFetch call.
5. The 6 JSON blocks all parse (run a quick `node -e` check or `npm run cards:build` to validate via Zod).
6. No claim sourced from "training" or "general knowledge."

If a check fails, fix before considering the card done. Update `cards/_SOUL_STATUS.md` to mark this card `merged` (or `drafted` if you want human review first).

## What you are NOT doing in this prompt

- Not editing the `cards.json entry` JSON block (that's the basics; soul is additive).
- Not editing other cards.
- Not writing to the Postgres database directly (the user runs `npm run db:migrate-cards` to push).
- Not enriching transfer_partner sweet spots — those live on `program_transfer_partners.sweet_spots` and are program-scoped, not card-scoped. A separate "program enrichment" pass handles them.

## Begin

ENRICH THIS CARD: <fill in card_id>

Read `cards/<card_id>.md` first to understand current state. Then start with the issuer's primary card URL fetch.
