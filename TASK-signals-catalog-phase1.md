# TASK: Signal Catalog v1 (Phase 1 of signal-first architecture)

> Build the global signal-catalog scaffolding — markdown source, Zod schema, build pipeline integration, runtime loader. No card edits, no engine wiring, no UI.

## Context

Per the architectural design discussed with Angel on 2026-05-04, the perks engine is pivoting to a signal-first model. Today three parallel mechanisms capture user signals in fragmented ways the recommender can't read coherently:

- `cards_held` per-card facts
- `perk_opt_ins[]` global flags
- `user_card_play_state` per-card-per-play tristate ("Got it" / "On my list" / "Not for me")

The third one is architecturally orphaned — written to the DB by `MoneyFindRow.tsx`, never consumed by `lib/engine/scoring.ts` or `lib/engine/foundMoney.ts`. The fix is to introduce **signals** as a first-class global concept: a user clicks "Got it" on Strata Premier's dining credit and the system records the global fact `claims.dining_credit.standard = confirmed`, which then informs every card's value math and the recommender's scoring.

Phase 1 ships only the catalog scaffolding. Every later phase (markdown migration, `user_signals` table, engine wiring, dual-gauge UI, On-My-List page) depends on this artifact existing and being typed. Doing it as a separate phase de-risks the rest — phases 2+ can be reviewed against a fixed catalog.

Key design decisions Angel signed off on:

- Catalog cap ~50 signals, hand-curated and reviewable. Start at 30–40.
- Behavior signals (`claims.*`, `transfers.*`), intent signals (`intents.*`), and holding-derived signals (`holdings.*`) all live in the same catalog, distinguished by a `type` field.
- Source format mirrors `cards/*.md` — one markdown file per signal, JSON fenced block plus free-form notes.

## Requirements

1. **Create `signals/` directory** at repo root with 30–40 starter markdown files, one per signal. Use the existing `signal_id` values in `cards/*.md` AnnualCredit / OngoingPerk entries as the spine — every existing `signal_id` should map to at least one signal in the catalog.

2. **Add `SignalSchema` and exported `Signal` type** to `scripts/lib/schemas.ts`. Schema and rationale below.

3. **Extend `scripts/build-card-db.ts`** to read `signals/*.md`, validate, and write `data/signals.json` (sorted by id). Bump `data/manifest.json` to include a `signals` count. Fail the build with a clear error on duplicate ids or invalid id format.

4. **Extend `lib/data/loader.ts`** to expose `signals: Signal[]` and `signalById: Map<string, Signal>` on `CardDatabase`. Defense-in-depth Zod re-validation on read, mirroring the existing `cards.json` / `programs.json` read pattern. Update `ManifestSchema.counts` to include `signals`.

5. **No card markdown edits, no engine wiring, no UI changes.** Phase 1 ships a typed, validated catalog plus a manifest count. Nothing else.

## Implementation Notes

**Signal schema** — add to `scripts/lib/schemas.ts`:

```ts
const SignalType = z.enum(["behavior", "intent", "holding"]);
const SignalDecay = z.enum(["never", "annual", "trip_bound"]);
const EvidenceStrength = z.enum(["weak", "medium", "strong"]);

export const SignalSchema = z.object({
  // dotted lowercase, e.g. "claims.dining_credit.standard"
  id: z.string().regex(
    /^[a-z][a-z0-9_]*(\.[a-z0-9_]+)+$/,
    "expected lowercase dotted id like claims.dining_credit.standard",
  ),
  type: SignalType,
  // never  = behavior signals (lifetime habits)
  // annual = credit-claim signals that reset each calendar year
  // trip_bound = intent signals tied to a planned trip; expire when trip
  //              completes or is removed
  decay: SignalDecay.default("never"),
  label: z.string(),       // human-readable, shown in signals dashboard
  prompt: z.string(),      // question form, used when asking the user directly
  implies: z.array(z.string()).default([]),  // free-form notes; not consumed by code yet
  evidence_strength: EvidenceStrength.default("medium"),
  // card_ids whose plays will reveal this signal in Phase 2.
  source_card_examples: z.array(z.string()).default([]),
  notes: z.string().optional(),
});

export type Signal = z.output<typeof SignalSchema>;
```

**Markdown format** — one file per signal. Example `signals/claims.dining_credit.standard.md`:

````markdown
# claims.dining_credit.standard

User actively claims dining credits up to ~$300/year face value (Amex
Gold-class, Strata Premier hotel/dining bundle, Capital One Savor's
dining credit).

## signals.json entry

```json
{
  "id": "claims.dining_credit.standard",
  "type": "behavior",
  "decay": "annual",
  "label": "Claims dining credits",
  "prompt": "Do you actively claim dining credits when your card offers them?",
  "implies": [
    "User is engaged with credit-claim mechanics",
    "Annualized dining-credit-class plays can be valued at face, not haircut"
  ],
  "evidence_strength": "strong",
  "source_card_examples": ["amex_gold", "citi_strata_premier", "capital_one_savor"]
}
```

## Notes

Triggered by "Got it" on plays whose value_model is fixed_credit and
whose credit class is dining. Decays annually because the credit resets
each calendar year.
````

**Parsing.** The existing `parseCardMarkdown` in `scripts/lib/parse.ts` extracts JSON blocks by following the `## <label>` heading. Use the same primitive — extract the block under `## signals.json entry`. If the helper is too card-specific, factor a generic `extractLabeledJsonBlock(md, label)` and use it for both signals and the existing card sections.

**Starter signal seed list.** Build the seed by greppping every `signal_id:` value in `cards/*.md` (search for `"signal_id":` JSON fields under AnnualCredit and OngoingPerk entries) and clustering them into the four namespaces. Aim for 30–40 — don't pad. Each signal in v1 must correspond to a real value-math or recommendation distinction. Suggested namespace coverage:

- **claims.*** (10–14 signals) — dining, airline_incidental, hotel_credit (portal vs FHR), travel_credit, streaming, equinox, saks, clear, peloton, uber, walmart_plus, dell, etc.
- **transfers.*** (5–8 signals) — to_aadvantage, to_hyatt, to_united_via_smiles, to_virgin_atlantic, to_air_france_klm, to_avianca_lifemiles
- **behaviors.*** (4–6 signals) — uses_lounges_priority_pass, uses_lounges_centurion, uses_cell_phone_protection, uses_purchase_protection, uses_extended_warranty
- **intents.*** (4–6 signals) — aspires_japan, aspires_europe_business, aspires_premium_hotel, plans_family_trip, plans_road_trip
- **holdings.*** (3–5 signals) — thank_you_feeder, amex_mr_feeder, ultimate_rewards_feeder, capital_one_miles_feeder, marriott_brand_loyalty

Total: ~30–40. Tune within that range. Document any conscious omissions in the corresponding cluster file's notes.

**Build pipeline integration** — in `scripts/build-card-db.ts`, mirror the existing card load pattern:

```ts
function listSignalFiles(): string[] {
  const dir = join(ROOT, "signals");
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .sort();
}

// In main(), after building cards/programs/etc:
const signals: Signal[] = [];
const seenIds = new Set<string>();
for (const file of listSignalFiles()) {
  const md = readFileSync(join(ROOT, "signals", file), "utf8");
  const block = extractLabeledJsonBlock(md, "signals.json entry");
  const parsed = SignalSchema.parse(block);
  if (seenIds.has(parsed.id)) {
    err(`duplicate signal id "${parsed.id}" in signals/${file}`);
  }
  seenIds.add(parsed.id);
  signals.push(parsed);
}
signals.sort((a, b) => a.id.localeCompare(b.id));
writeFileSync(
  join(DATA_DIR, "signals.json"),
  JSON.stringify(signals, null, 2),
);
manifest.counts.signals = signals.length;
log(`wrote ${signals.length} signals to data/signals.json`);
```

The final `[cards]` summary log line should include `, ${signals.length} signals` so the build output matches today's style.

**Loader integration** (`lib/data/loader.ts`):

```ts
import { SignalSchema } from "../../scripts/lib/schemas";
type ParsedSignal = z.output<typeof SignalSchema>;

const ManifestSchema = z.object({
  compiled_at: z.string(),
  counts: z.object({
    cards: z.number(),
    programs: z.number(),
    issuers: z.number(),
    perks_dedup: z.number(),
    destinations: z.number(),
    signals: z.number(),  // NEW
  }),
});

export interface CardDatabase {
  // ...existing fields
  signals: ParsedSignal[];
  signalById: Map<string, ParsedSignal>;
}

// In loadCardDatabase():
const signals = readJSON("signals.json", z.array(SignalSchema)) as ParsedSignal[];
// ...
signalById: new Map(signals.map((s) => [s.id, s])),
```

Re-export the `Signal` type from the loader for downstream convenience, same pattern as `Card`.

## Do Not Change

- `cards/*.md` — Phase 2 will edit these to add `reveals_signals` to plays. Phase 1 only reads them indirectly via the existing build path.
- `lib/engine/*` (`scoring.ts`, `ranking.ts`, `eligibility.ts`, `foundMoney.ts`, `moneyFind.ts`, `perkSignals.ts`, `brandAffinity.ts`, `heroState.ts`, `types.ts`) — no engine wiring this phase. The signal catalog is loaded but not consumed.
- `lib/profile/*` — no profile or DB schema changes. The `user_signals` table arrives in Phase 3.
- `components/**` — no UI changes. The catalog isn't user-visible yet.
- `app/**` — no page changes.
- `data/*.json` — these are generated outputs (gitignored). Edit only the markdown sources and the build script.
- The existing `signal_id` field on `AnnualCredit` and `OngoingPerk` schemas — leave as-is. Phase 2 maps these to the new catalog; Phase 1 must not refactor them.
- `lib/auth/*`, `lib/db.ts`, session/cookie code — orthogonal, don't touch.
- `scripts/lib/parse.ts` — touch only if you need to factor `extractLabeledJsonBlock`. Keep all existing card-parsing behavior identical (run `verify-cards-soul-parity.ts` after if you change it).

## Acceptance Criteria

- [ ] `signals/` directory exists with 30+ markdown files, each containing a valid `signals.json entry` block
- [ ] `npm run cards:build` exits 0 and the summary line includes a signals count (e.g. `wrote 239 cards, 44 programs, ..., 35 signals`)
- [ ] `data/signals.json` exists, is a sorted array, and every entry passes `SignalSchema.parse`
- [ ] `data/manifest.json` includes `counts.signals` matching the array length
- [ ] `npm run typecheck` passes — `loadCardDatabase().signals` and `loadCardDatabase().signalById.get("claims.dining_credit.standard")` are correctly typed without `any` casts
- [ ] `npm run build` passes
- [ ] `npm test` passes (existing engine tests must still pass; signals are not yet wired)
- [ ] `git diff --stat` shows changes ONLY in `signals/`, `scripts/lib/schemas.ts`, `scripts/build-card-db.ts`, `lib/data/loader.ts`, and (optionally) `scripts/lib/parse.ts`. No engine, profile, component, or page diffs.
- [ ] Build script fails with a clear error if two signals share an id (test by duplicating one and re-running)
- [ ] Build script fails with a clear regex error if a signal id is malformed (e.g. `Claims.Dining`)

## Verification

1. Run `npm run cards:build` — confirm new signals counter in output, no errors
2. `cat data/signals.json | jq 'length'` — confirm 30+
3. `cat data/manifest.json | jq '.counts.signals'` — confirm matches above
4. `npm run typecheck && npm run build && npm test` — all green
5. `git diff --stat` — verify the protected paths are untouched
6. Negative test: copy one signal markdown to a new filename, leave the id identical, run `cards:build` — must fail with "duplicate signal id"
7. Negative test: edit one signal id to `Foo.bar` (capital), run `cards:build` — must fail with the regex message
8. Open `signals/claims.dining_credit.standard.md` (or whichever exists) in the editor — confirm the markdown is human-readable and well-formatted, not a wall of JSON

## Handoff back to Cowork

When complete, leave a short note in the PR description summarizing:
- Final signal count and namespace breakdown (e.g. "12 claims, 7 transfers, 5 behaviors, 5 intents, 4 holdings")
- Any signals that were considered but cut, and why
- Any `signal_id` values found in `cards/*.md` that didn't map cleanly to a signal — these become Phase 2 questions

Phase 2 (card markdown migration to add `reveals_signals` to plays) will be a separate TASK.
