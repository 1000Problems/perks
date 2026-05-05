# TASK: Community Plays section on /wallet/cards/[id]

> Pull the 13 sweet-spot / wallet-hack plays out of the mixed catalog and render them in a dedicated "From the community" section on the per-card hero page. Card-level data only (no Section 1/2 reorg yet). Pilot card: `citi_strata_premier`.

## Context

Today the per-card page mixes Citi-issued benefits, Mastercard network benefits, and community-discovered plays in the same `CatalogGroup` blocks. We're splitting them into three sections by source-of-truth so each can be updated on its own cadence and so the recommender can weight them differently. This TASK ships only the third section. Sections 1 (Citi) and 2 (Mastercard) stay as-is for now.

The recommender currently scores everything in `card_plays[]` uniformly. After this task, community plays live in a separate array and the engine reads both — so projected rewards math is unchanged, but the recommender can later filter or weight community plays separately.

## Requirements

1. Add `community_plays: PlaySchema[]` as a new optional top-level field on the card schema, defaulting to `[]`. Reuse `PlaySchema` verbatim — no new shape.
2. Migrate the 13 plays listed below from `cards/citi_strata_premier.md`'s `card_plays[]` block into a new `community_plays[]` block in the same file. Preserve every field of each play exactly (id, headline, mechanism_md, source_urls, reveals_signals, etc.). One data fix during the move: change "UR pts" → "TY pts" in the `hyatt_park_tokyo` headline and personalization template (Citi → Hyatt is 1:1).
3. The engine's `scoreFinds` (and any caller that reads `card.card_plays`) must score plays from both arrays so the projected-rewards header doesn't drop after the migration. Concatenate, don't replace.
4. New client component `CommunityPlaysSection.tsx` renders the Section 3 block with two sub-stacks: **Good redemptions** (plays whose `value_model.kind === "transfer_redemption"`) and **Wallet plays** (everything else — `system_mechanic`, `niche_play`). Section header reads "From the community" with a sub-line "How holders actually use this card". Reuse the existing `MoneyFindRow` component for each row so interaction parity with the catalog is preserved.
5. Insert `<CommunityPlaysSection>` in `CardHero.tsx` between the last `CatalogGroup` and `<MechanicsZone>`. Only render when `card.community_plays.length > 0`.

## Implementation Notes

### Plays to move (13 total)

From `cards/citi_strata_premier.md` `card_plays[]`, move these entries by `id`:

Transfer redemptions (8): `hyatt_park_tokyo`, `jal_biz_tokyo`, `ana_biz_virgin`, `lh_first_avianca`, `united_domestic_turkish`, `etihad_backdoor`, `royal_air_maroc`, `jetblue_mint_qatar`

Wallet plays (5): `trifecta_pool`, `ty_sharing_window`, `retention_call`, `fed_tax_payment`, `curve_fx_hack`

Leave the other ~14 plays in `card_plays[]` untouched. They'll be reorged into Sections 1 and 2 in a follow-up TASK.

### Schema (`scripts/lib/schemas.ts`)

Find the card object schema (the one that contains `card_plays: z.array(PlaySchema)...`). Add directly below it:

```ts
community_plays: z.array(PlaySchema).default([]),
```

No other schema changes. Don't add a discriminator field — the two sub-stacks are derived from `value_model.kind` at render time.

### Build script (`scripts/build-card-db.ts`)

The build already round-trips the parsed card object to `data/cards.json`. Adding the new field to the schema should pick it up automatically — verify by running `npm run cards:build` and grepping the output:

```bash
grep -A2 '"community_plays"' data/cards.json | head -30
```

### Loader (`lib/data/loader.ts` and `lib/data/serialized.ts`)

The `Card` type is inferred from the Zod schema, so `community_plays` should appear automatically. Verify the serialized round-trip in `serialized.ts` — if the file uses explicit field allow-lists for `toSerialized`/`fromSerialized`, add `community_plays` to them. If it spreads the whole card, no change.

### Engine wiring (`lib/engine/moneyFind.ts`)

`scoreFinds` reads `card.card_plays`. Change the source to read both arrays:

```ts
const allPlays = [...card.card_plays, ...(card.community_plays ?? [])];
```

Do this once at the top of `scoreFinds`. Don't add I/O, don't introduce `Date.now()`, don't re-architect — engine purity is non-negotiable per `CLAUDE.md`. Search the engine for any other reads of `card.card_plays` (`grep -rn "card_plays" lib/engine/`) and apply the same concatenation pattern at each site.

### Component (`components/wallet-v2/CommunityPlaysSection.tsx`)

Pattern-match against `CatalogGroup.tsx`. The new component:

- Takes the same props shape as `CatalogGroup` (finds, playState, onMarkFind, onProbeClick, cardId, playSourceMap, perkFlags) plus a card or community_plays array.
- Internally splits finds into the two sub-stacks by `find.play.value_model.kind`.
- Renders one section header per sub-stack with a count and a total opportunity-value summary (sum of `find.dollarsPerYear`, formatted via `fmt.usd`).
- Each row is a `MoneyFindRow` — same props as today.

Sub-stack copy:
- "Good redemptions" — eyebrow "TRANSFER SWEET SPOTS" — sub-line "Where Citi ThankYou points punch above 1¢."
- "Wallet plays" — eyebrow "PROCESS TACTICS" — sub-line "Setup tricks holders use to squeeze more out of the card."

Empty sub-stacks render nothing (no header, no zero-state).

### Page composition (`components/wallet-v2/CardHero.tsx`)

After the `ALL_GROUPS.map(...)` block (line ~493) and before `<MechanicsZone>` (line ~495), add:

```tsx
{card.community_plays && card.community_plays.length > 0 && (
  <CommunityPlaysSection
    card={card}
    finds={finds /* already includes community plays after engine change */}
    playState={playState}
    onMarkFind={handleMarkFind}
    onProbeClick={handleProbeClick}
    cardId={cardId}
    playSourceMap={playSourceMap}
    perkFlags={perkFlags}
  />
)}
```

The `finds` array will already contain the community plays' scored rows after the engine change in step 3. Filter to only community plays inside `CommunityPlaysSection` by intersecting against the `community_plays` ids:

```ts
const communityIds = new Set(card.community_plays.map(p => p.id));
const communityFinds = finds.filter(f => communityIds.has(f.play.id));
```

### Styles (`app/card-hero-redesign.css`)

Add a `.community-plays-section` block scoped under `.card-hero-page` (same convention as the rest of this stylesheet — see file header comment). Match the visual rhythm of `.catalog-group` but with a subtly different background or border treatment so the section reads as distinct. Use existing CSS variables — don't introduce new colors.

### Sourcing tech debt — explicitly out of scope

Three plays (`retention_call`, `fed_tax_payment`, `curve_fx_hack`) have weak or empty `source_urls`. Don't fix them in this task — preserve the data as-is. We'll handle source rigor in a follow-up TASK once the renderer is shipping.

## Do Not Change

- `data/*.json` — gitignored, regenerated by `cards:build`. Edit markdown only.
- `cards/*.md` other than `cards/citi_strata_premier.md` — pilot card only this round.
- `lib/engine/eligibility.ts`, `lib/engine/scoring.ts`, `lib/engine/ranking.ts` — engine purity. Only `lib/engine/moneyFind.ts` gets the concatenation change.
- `lib/db.ts`, `lib/auth/*`, `lib/profile/*` — no DB or auth changes needed.
- Existing `CatalogGroup.tsx` — read it for pattern reference, do not modify.
- `RecurringValueSection.tsx`, `ValueThesisHero.tsx`, `MechanicsZone.tsx`, `ManageCardPanel.tsx` — untouched.
- `CurrencyPanel.tsx` and the "used for scoring" badge — untouched.
- The 14 plays remaining in `card_plays[]` — leave in place.
- App routes other than `/wallet/cards/[id]` — out of scope.
- `NEXT_PUBLIC_WALLET_EDIT_V2` flag — don't change gating.

## Acceptance Criteria

- [ ] `npm run cards:build` succeeds; `data/cards.json` contains a `community_plays` array of length 13 on the `citi_strata_premier` entry.
- [ ] `npm run typecheck` passes with zero errors.
- [ ] `npm run lint` passes with zero errors.
- [ ] `npm run build` passes with zero errors.
- [ ] `npm test` passes — engine tests still green after the `scoreFinds` concatenation change.
- [ ] Loading `/wallet/cards/citi_strata_premier` (with `NEXT_PUBLIC_WALLET_EDIT_V2=1`) shows a "From the community" section between the catalog groups and the calendar, containing two sub-stacks: "Good redemptions" with 8 rows and "Wallet plays" with 5 rows.
- [ ] The Park Hyatt Tokyo row reads "TY pts" (not "UR pts") in both headline and personalization.
- [ ] Projected rewards header at the top of the page does not decrease after the migration (the same plays still score, just from a different array).
- [ ] `git diff --stat` shows changes only in: `cards/citi_strata_premier.md`, `scripts/lib/schemas.ts`, `lib/engine/moneyFind.ts`, `lib/data/serialized.ts` (if needed), `components/wallet-v2/CardHero.tsx`, `components/wallet-v2/CommunityPlaysSection.tsx` (new), `app/card-hero-redesign.css`.

## Verification

1. `npm run cards:build && npm run typecheck && npm run lint && npm run build && npm test` — all green.
2. `git diff --stat` — verify scope is contained to the files listed above.
3. Spin up `npm run dev`, visit `/wallet/cards/citi_strata_premier`, confirm:
   - The new section renders between catalog and calendar.
   - The two sub-stacks contain the correct counts (8 and 5).
   - Marking a row "Using" / "On list" / "Skip" persists across reload (same as catalog rows).
   - The projected-rewards header value is unchanged from before the migration.
4. `grep -c '"id":' cards/citi_strata_premier.md` — total play count across both arrays should equal the pre-migration `card_plays[]` count exactly.
