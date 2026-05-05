# TASK: Ingest the World Elite Mastercard research into citi_strata_premier

> Take the research JSON, save it to the repo for future diffing, and translate it into 11 new `card_plays` entries and a 4-row "disabled by issuer" block on the Citi Strata Premier card. Render the disabled block at the bottom of Section 2 (`ProvenanceSection`).

## Context

The network research run produced an authoritative inventory of Mastercard World Elite benefits and a card-level overlay for `citi_strata_premier`. Section 2 is currently sparse (4 rows). The research surfaces 11 benefits we don't have yet and 4 benefits Mastercard advertises that Citi explicitly does not enable on this card. We agreed earlier that "Network advertises, issuer doesn't enable" is part of what makes Section 2 distinct from Section 1.

This TASK is the first end-to-end ingest. It also establishes the file layout and disabled-row UI pattern the next research runs will reuse.

## Requirements

1. Save the research output verbatim to `cards/_NETWORK_RESEARCH/world_elite_mastercard_2026-05-05.json`. This is canonical input — tracked in git so future runs diff against it.
2. Add a new optional field to `CardSchema` in `scripts/lib/schemas.ts`:
   ```ts
   disabled_network_benefits: z.array(
     z.object({
       id: z.string(),
       name: z.string(),
       reason: z.string(),
       evidence_url: z.string().url(),
     }),
   ).optional().default([]),
   ```
3. Migrate `cards/citi_strata_premier.md`:
   - Add 11 new entries to `card_plays[]`, all tagged `provided_by: "network"`. List below.
   - Add a `disabled_network_benefits` block with 4 entries (cell phone, travel accident, baggage delay, Priority Pass). Skip `mc_easy_savings` — small-business benefit not relevant to consumer comparison.
4. Modify `components/wallet-v2/ProvenanceSection.tsx` to accept an optional `disabled` prop and render a small block at the bottom of the section body when present. Block has its own header ("Network advertises, issuer doesn't enable") and one row per disabled benefit (name + reason + evidence link).
5. In `CardHero.tsx`, pass `card.disabled_network_benefits` to the network `<ProvenanceSection>` (Section 2 only — issuer section gets nothing).
6. CSS rules under `.provenance-section .disabled-block` — visually muted, distinct from the catalog rows, mobile-friendly.

## Implementation Notes

### Plays to add (11)

All `provided_by: "network"`. Source URLs and notes come straight from the research JSON. For each, set:
- `group` per the mapping below
- `question` per the type
- `value_model` per the kind
- `prerequisites: { profile_signals: [], cards_held_any_of: [], cards_held_all_of: [] }`
- `reveals_signals: []`, `requires_signals: []` (no new signals; out of scope)

```
mc_zero_liability        → group: niche,           value: system_mechanic, question: set_up
mc_id_theft_protection   → group: niche,           value: system_mechanic, question: set_up
mc_global_service        → group: travel_services, value: system_mechanic, question: set_up
mc_public_transit_tap_go → group: credits,         value: fixed_credit ($30/yr, calendar_year), question: claimed_this_year, expires_at: 2027-12-31
mc_music_entertainment_presale → group: niche,     value: system_mechanic, question: have_done_this
mc_travel_lifestyle_services → group: travel_services, value: system_mechanic, question: set_up
mc_concierge_service     → group: travel_services, value: system_mechanic, question: set_up
mc_airport_concierge     → group: travel_services, value: system_mechanic, question: have_done_this
mc_golf                  → group: niche,           value: system_mechanic, question: have_done_this
mc_priceless_experiences → group: niche,           value: system_mechanic, question: have_done_this
mc_lyft_airport_10pct    → group: travel_services, value: system_mechanic, question: set_up
```

For `mc_public_transit_tap_go` (the only one with a $ value), use:
```json
"value_model": {"kind": "fixed_credit", "value_usd": 30, "period": "calendar_year", "requires_signal_id": null}
```

For each `mechanism_md` and `how_to_md`, paraphrase from the research's `notes` field — don't copy verbatim, but preserve every concrete fact (dollar limits, percentages, expiry dates, enrollment URLs, exclusions). Do NOT invent values. Do NOT restate marketing language.

For `headline` and `personalization_template`: keep them short, declarative, dollar-anchored where applicable. Match the tone of existing plays in the file (e.g. "$3/mo on Peacock — $36/yr if you stream"). Examples:
- `mc_public_transit_tap_go`: headline "Tap your Strata Premier on transit — $2.50 back monthly" / personalization "$2.50 back when you tap to pay $10+ at MBTA, CTA, NJ Transit, PATH, SEPTA, WMATA, DART, or Miami-Dade in a calendar month."

`expires_at` is set ONLY where the research provides a concrete date (mc_public_transit_tap_go: 2027-12-31, mc_music_entertainment_presale: 2027-03-31). Leave the field absent on all others.

`source_urls` should be a single-element array with the deep-link URL from the research JSON's `source.url` field for that benefit.

### Disabled block (4 entries)

Add directly to the card markdown (after `card_plays`, before `community_plays`):

```
## disabled_network_benefits

```json
[
  { "id": "mc_cell_phone_protection",   "name": "Cell phone protection", "reason": "...", "evidence_url": "..." },
  { "id": "mc_travel_accident_insurance", "name": "Travel accident insurance", "reason": "...", "evidence_url": "..." },
  { "id": "mc_baggage_delay",            "name": "Baggage delay reimbursement", "reason": "...", "evidence_url": "..." },
  { "id": "mc_priority_pass",            "name": "Priority Pass lounge access", "reason": "...", "evidence_url": "..." }
]
```

Pull `name` and `reason` from the research JSON's `card_overlays[0].disabled_or_not_offered[]`. Trim the reason to one short sentence — the research version is verbose, the UI needs a tooltip-length string.

### Parser wiring

The markdown parser already handles `community_plays` via a `## community_plays\n` regex; mirror that for `## disabled_network_benefits\n` in:
- `scripts/lib/parse.ts` — add to `SECTION_KEYS`, parse, and propagate
- `scripts/build-card-db.ts` — merge into the card object before Zod validation

Same pattern as the community_plays wiring in TASK-community-plays-section.md. Don't add signal-reference validation for disabled entries — they have no signal references.

### ProvenanceSection changes

Add optional prop:
```ts
disabled?: { id: string; name: string; reason: string; evidence_url: string }[];
```

Render at the END of `provenance-section-body` when `disabled.length > 0`:
```tsx
<div className="provenance-disabled-block">
  <header className="provenance-disabled-head">
    <span className="eyebrow">Network advertises, issuer doesn't enable</span>
    <p className="provenance-disabled-subline">
      Mastercard publishes these for World Elite cards, but Citi doesn't activate them on this product.
    </p>
  </header>
  <ul className="provenance-disabled-list">
    {disabled.map((d) => (
      <li key={d.id} className="provenance-disabled-row">
        <div className="provenance-disabled-name">{d.name}</div>
        <div className="provenance-disabled-reason">{d.reason}</div>
        <a href={d.evidence_url} target="_blank" rel="noreferrer" className="provenance-disabled-link">
          source ↗
        </a>
      </li>
    ))}
  </ul>
</div>
```

### CardHero wiring

Pass `disabled={card.disabled_network_benefits}` to the network `ProvenanceSection`. Issuer section gets no disabled prop.

### Migration script

Use the same Node script pattern as the prior migrations — JSON-aware, function-based String.replace to dodge `$` interpolation. The script should:
1. Read the existing markdown
2. Parse `card_plays[]`
3. Append the 11 new entries (use the research JSON as the source for each entry's data)
4. Re-emit `card_plays[]` formatted one-entry-per-line
5. Insert a `## disabled_network_benefits` section block before `## community_plays`
6. Validate via `npm run cards:build`

### Signals — out of scope

Several new plays would benefit from signals that don't exist yet (`claims.transit_credit`, `intents.attends_concerts`, `intents.plays_golf`). Don't add them in this TASK — leave `signal_id: null` and `prerequisites.profile_signals: []`. The engine handles null gracefully. A follow-up TASK can extend the signal catalog.

## Do Not Change

- `data/*.json` — gitignored.
- `cards/*.md` other than `cards/citi_strata_premier.md`.
- `lib/engine/*` — engine purity.
- The 16 existing entries in `card_plays[]` — only append, don't modify their data. The 4 existing network plays (luxury_hotels_breakfast, instacart_plus, peacock_credit, lyft_monthly_credit) stay verbatim.
- `community_plays[]` — Section 3 unchanged.
- `CommunityPlaysSection.tsx`, `CatalogGroup.tsx`, `MoneyFindRow.tsx`.
- `cards/_PROMPT_NETWORK_RESEARCH.md` — the prompt itself doesn't change with this run.
- Section 1 / "From Citi" copy — only the network section gets the disabled block.

## Acceptance Criteria

- [ ] `cards/_NETWORK_RESEARCH/world_elite_mastercard_2026-05-05.json` exists with the verbatim research output.
- [ ] `npm run cards:build` passes; `data/cards.json` shows `card_plays.length === 27` on `citi_strata_premier` (16 prior + 11 new) and `disabled_network_benefits.length === 4`.
- [ ] `npm run typecheck && npm run lint && npm run build && npm test` — all green.
- [ ] On `/wallet/cards/citi_strata_premier`, Section 2 ("Built into Mastercard World Elite") now contains 14+ visible rows (the 4 prior plus 10–11 new — exact count depends on engine visibility filters; mc_id_theft_protection / mc_zero_liability / mc_global_service may be ranked low and require expanding the niche group).
- [ ] At the bottom of Section 2, a "Network advertises, issuer doesn't enable" block renders with 4 rows (cell phone, travel accident, baggage delay, Priority Pass), each with name + one-sentence reason + source link.
- [ ] Section 1 ("From Citi") and Section 3 ("From the community") are unchanged.
- [ ] Projected-rewards header at the top is unchanged or higher (the new plays add scoring opportunities; no plays are removed).
- [ ] `git diff --stat` scope: `cards/citi_strata_premier.md`, `scripts/lib/schemas.ts`, `scripts/lib/parse.ts`, `scripts/build-card-db.ts`, `components/wallet-v2/ProvenanceSection.tsx`, `components/wallet-v2/CardHero.tsx`, `app/card-hero-redesign.css`. New files: research JSON.

## Verification

1. `npm run cards:build && npm run typecheck && npm run lint && npm run build && npm test` — all green.
2. `node -e "const c=require('./data/cards.json').find(x=>x.id==='citi_strata_premier'); console.log({card_plays:c.card_plays.length, network:c.card_plays.filter(p=>p.provided_by==='network').length, disabled:c.disabled_network_benefits.length})"` returns `{ card_plays: 27, network: 15, disabled: 4 }`.
3. `npm run dev`, visit `/wallet/cards/citi_strata_premier`:
   - Section 2 shows the new rows (Concierge, Airport Concierge, Travel Lifestyle, Golf, Priceless, Transit Tap & Go, Music Presale, Lyft Airport, Zero Liability, ID Theft, Global Service) plus the 4 originals.
   - Disabled block renders at the bottom of Section 2 with 4 rows.
   - Section 1 + Section 3 visually unchanged.
