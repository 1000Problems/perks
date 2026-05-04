# TASK: Plays declare which signals they reveal (Phase 2 of signal-first architecture)

> Add `reveals_signals` and `requires_signals` to PlaySchema. Migrate the existing `card_plays` (currently only `citi_strata_premier.md`) to populate them. Build-script validates every signal reference against the catalog from Phase 1.

## Context

Phase 1 shipped the signal catalog (35 signals under `signals/*.md`, exposed on `CardDatabase.signals`). Phase 2 is the contract between plays and the catalog: each play declares which signals it *reveals* when the user clicks "Got it" (or "On my list"), and which signals must be confirmed for the play's value to count.

This phase deliberately does NOT wire the engine — `computeFoundMoneyV2` and `scoreCard` continue to ignore the new fields. Phase 4 will read them. Shipping the schema + migration + validation now means Phase 4 has clean data to consume from day one and we discover signal-catalog gaps before they become user-visible.

Scope is smaller than expected: a grep of `cards/*.md` shows only `citi_strata_premier.md` has a `## card_plays` section today. The other 238 cards are still in the legacy AnnualCredit / OngoingPerk model. Migration of the legacy entries to plays is out of scope for Phase 2 — it's a separate, bigger workstream. Phase 2 is the schema + validation infrastructure plus the one-card migration that proves it works.

## Requirements

1. **Extend `PlaySchema`** in `scripts/lib/schemas.ts` with two new fields, both `z.array(z.string()).default([])`:
   - `reveals_signals` — signal ids the play surfaces. Got-it on this play sets these signals to `confirmed`; On-my-list sets them to `interested`; Not-for-me sets them to `dismissed`.
   - `requires_signals` — signal ids that must be `confirmed` for this play's value to count in the engine. Empty array means the play counts unconditionally.

2. **Build-script validation** in `scripts/build-card-db.ts`: after both cards and signals are loaded, walk every play in every card and assert that each id in `reveals_signals` and `requires_signals` exists in `db.signalById`. Fail with a clear error naming the card, play id, and unknown signal id.

3. **Migrate `cards/citi_strata_premier.md`**: add `reveals_signals` (and `requires_signals` where applicable) to every play in the `## card_plays` section. Mapping table below.

4. **Document signal-catalog gaps**: any play that has no satisfying signal in the catalog gets `reveals_signals: []` plus a one-line note in the card's research notes explaining what signal would be needed. Surface the full list in the PR description — those become Phase 2.5 catalog additions.

5. **No engine wiring, no UI changes, no other card edits.** The legacy `requires_signal_id` inside `value_model` (used today by `fixed_credit` plays) stays in place — Phase 4 will deprecate it. Add `requires_signals` *alongside* it so the new system has the data when it's wired.

## Implementation Notes

**Schema delta** — extend `PlaySchema` in `scripts/lib/schemas.ts:135-153`:

```ts
export const PlaySchema = z.object({
  id: z.string(),
  group: PlayGroup,
  headline: z.string(),
  personalization_template: z.string(),
  value_model: PlayValueModel,
  question: PlayQuestion,
  prerequisites: z.object({
    cards_held_any_of: z.array(z.string()).default([]),
    cards_held_all_of: z.array(z.string()).default([]),
    profile_signals: z.array(z.string()).default([]),
  }).default({ cards_held_any_of: [], cards_held_all_of: [], profile_signals: [] }),
  action_label: z.string().optional(),
  mechanism_md: z.string(),
  how_to_md: z.string(),
  conditions_md: z.string().optional(),
  expires_at: IsoDate.optional(),
  source_urls: z.array(Url).default([]),
  // NEW — Phase 2 of signal-first architecture.
  // reveals_signals: which catalog signals the user implicitly confirms by
  //   marking this play "Got it". On-my-list maps to "interested" on the
  //   same set; Not-for-me maps to "dismissed".
  // requires_signals: signals that must be `confirmed` for this play's value
  //   to count in the engine (Phase 4). Empty = unconditional.
  reveals_signals: z.array(z.string()).default([]),
  requires_signals: z.array(z.string()).default([]),
});
```

**Build-script validation** — add a pass after `loadSignals(db)` in `scripts/build-card-db.ts:main()`:

```ts
function validateSignalReferences(db: DB): void {
  const known = new Set(db.signals.map((s) => s.id));
  for (const card of db.cards) {
    for (const play of card.card_plays ?? []) {
      for (const sig of play.reveals_signals) {
        if (!known.has(sig)) {
          err(`cards/${card.id}.md: play "${play.id}" reveals_signals references unknown signal "${sig}"`);
        }
      }
      for (const sig of play.requires_signals) {
        if (!known.has(sig)) {
          err(`cards/${card.id}.md: play "${play.id}" requires_signals references unknown signal "${sig}"`);
        }
      }
    }
  }
}

// In main(), after loadSignals(db):
validateSignalReferences(db);
```

**Migration table** for `cards/citi_strata_premier.md` `## card_plays` section. Apply each row by editing the play's JSON to add the two arrays. Where the table says "[]", add the empty array explicitly so the field is present. Where it says "—" under requires_signals, omit (defaults to []).

| play id | reveals_signals | requires_signals | rationale |
|---|---|---|---|
| `hyatt_park_tokyo` | `["transfers.to_hyatt", "intents.aspires_japan", "intents.aspires_premium_hotel"]` | — | Hyatt transfer + Japan intent + premium hotel intent — all real signals revealed |
| `vacasa_wyndham` | `[]` | — | No catalog match (Wyndham/vacation rental). Add `transfers.to_wyndham` and `intents.plans_family_trip` candidates to Phase 2.5 list. |
| `hotel_credit_100` | `["claims.hotel_credit.portal"]` | `["claims.hotel_credit.portal"]` | Portal-channel \$100 hotel credit — capture-gated on the user actually claiming it. Replaces legacy `requires_signal_id: "hotel_credit"`. |
| `luxury_hotels_breakfast` | `["intents.aspires_premium_hotel"]` | `["intents.aspires_premium_hotel"]` | Mastercard Luxury portal benefits — only relevant for premium hotel travelers. Replaces legacy `requires_signal_id: "luxury_hotel_traveler"`. |
| `jal_biz_tokyo` | `["transfers.to_aadvantage", "intents.aspires_japan"]` | — | AAdvantage transfer + Japan intent |
| `ana_biz_virgin` | `["transfers.to_virgin_atlantic", "intents.aspires_japan"]` | — | Virgin Atlantic transfer + Japan intent |
| `lh_first_avianca` | `["transfers.to_avianca_lifemiles", "intents.aspires_europe_business"]` | — | LifeMiles + Europe biz intent |
| `united_domestic_turkish` | `["transfers.to_united_via_smiles"]` | — | Turkish-Smiles transfer signal |
| `etihad_backdoor` | `["intents.aspires_europe_business"]` | — | No `transfers.to_etihad` signal yet — Etihad is niche; flag for Phase 2.5 if it earns a slot |
| `royal_air_maroc` | `[]` | — | No Morocco-aspiration signal, no Etihad transfer signal. Both candidates for Phase 2.5. |
| `jetblue_mint_qatar` | `["intents.aspires_europe_business"]` | — | Europe biz intent. No `transfers.to_qatar_avios` signal — flag for Phase 2.5. |
| `trip_delay` | `[]` | — | No `behaviors.has_filed_trip_delay` signal yet. Add to Phase 2.5 list. |
| `trip_cancel` | `[]` | — | No `behaviors.has_filed_trip_cancel` signal yet. Add to Phase 2.5 list. |
| `rental_cdw` | `[]` | — | No rental-coverage usage signal. Add `behaviors.uses_rental_cdw` to Phase 2.5. |
| `fx_zero` | `[]` | — | Mechanic, not a behavior. Skip. |
| `ext_warranty` | `["behaviors.uses_extended_warranty"]` | — | Direct match in catalog |
| `purchase_protection` | `["behaviors.uses_purchase_protection"]` | — | Direct match in catalog |

**Mapping discipline.** Default to *fewer* signals per play, not more. If a play could plausibly reveal 5 signals, pick the 1-2 strongest. Over-tagging dilutes the signal-state inference Phase 4 relies on — every "Got it" should map to facts the system can confidently assert about the user.

**Editing the markdown.** The `## card_plays` section in `citi_strata_premier.md` is a single JSON array. Each play is one object on (mostly) one line. Add the two new keys at the end of each object, before the closing `}`. Keep the existing field order untouched; insert at the end so diffs are clean.

**Phase 2.5 candidates.** Maintain a running list in the PR description. Based on the table above, candidates surfaced so far:
- `transfers.to_wyndham`
- `transfers.to_etihad`
- `transfers.to_qatar_avios`
- `intents.aspires_morocco` (or generalize: `intents.aspires_north_africa`?)
- `behaviors.has_filed_trip_delay`
- `behaviors.has_filed_trip_cancel`
- `behaviors.uses_rental_cdw`

Don't add these to the catalog as part of Phase 2. Phase 2.5 will batch-add after the migration of more cards' plays surfaces enough demand to set the right granularity.

## Do Not Change

- `lib/engine/*` — Phase 4 wires the engine. Phase 2 only changes the schema and validates references. The engine continues to read the legacy `requires_signal_id` inside `value_model.fixed_credit` and ignore the new fields.
- `lib/profile/*` — no profile or DB schema changes. `user_signals` table arrives in Phase 3.
- `components/**` and `app/**` — no UI changes. The catalog and the new fields are not yet user-visible.
- `signals/*.md` — Phase 1 catalog. Don't add new signals as part of Phase 2; route gaps to the Phase 2.5 list in the PR description.
- The legacy `requires_signal_id` field inside `value_model.fixed_credit` — leave in place. Phase 4 will deprecate it after `requires_signals` proves out.
- `data/*.json` — derived. Edit markdown sources only.
- The other 238 cards (everything in `cards/` except `citi_strata_premier.md`) — they have no `card_plays` section yet. Phase 2 does not add plays to them; that's a separate workstream.
- Auth, session, routing — orthogonal.

## Acceptance Criteria

- [ ] `npm run cards:build` exits 0; signal-reference validation runs as part of the build
- [ ] `cards/citi_strata_premier.md` `## card_plays` section: every play object has both `reveals_signals` and `requires_signals` keys (defaulted to `[]` where the migration table says so)
- [ ] `npm run typecheck` clean — `Card.card_plays[i].reveals_signals` is typed as `string[]`
- [ ] `npm test` clean — engine tests still pass (engine ignores the new fields)
- [ ] Negative test: edit one signal id in `reveals_signals` to a non-existent value (e.g. `"transfers.to_nonsense"`) and rerun `cards:build` — must fail with a clear error naming the card, play, and unknown signal
- [ ] Negative test: same for `requires_signals`
- [ ] `git diff --stat` shows changes ONLY in `scripts/lib/schemas.ts`, `scripts/build-card-db.ts`, and `cards/citi_strata_premier.md`
- [ ] PR description lists the Phase 2.5 catalog candidates surfaced during migration

## Verification

1. `npm run cards:build` — confirm no errors, manifest unchanged in shape
2. `cat data/cards.json | jq '.[] | select(.id=="citi_strata_premier") | .card_plays[] | {id, reveals_signals, requires_signals}'` — every play shows both arrays
3. `npm run typecheck` — clean
4. `npm test` — clean (95 tests still passing)
5. Negative test (reveals): introduce `"transfers.to_nonsense"` into `hyatt_park_tokyo.reveals_signals`, rerun `cards:build`, confirm clear error → revert
6. Negative test (requires): introduce `"claims.fake_thing"` into `hotel_credit_100.requires_signals`, rerun, confirm clear error → revert
7. `git diff --stat` — only the three expected files
8. PR description includes the Phase 2.5 candidate list

## Handoff back to Cowork

When complete, leave a PR-description note covering:
- Final Phase 2.5 catalog-candidate list (likely 5-8 entries based on the migration table)
- Any plays where the migration table felt wrong — i.e., where Code's judgment differed from the table and which way it ruled
- Any schema-level surprises (e.g. did Zod default-handling work as expected when adding the new fields)

Phase 3 (user_signals table + write path) is the next TASK. Phase 4 (engine reads signals) follows.
