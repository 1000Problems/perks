# TASK: Split the catalog into Section 1 (Citi) and Section 2 (Mastercard)

> Pull the existing catalog apart by source-of-truth. Plays with `provided_by === "issuer"` render under "From Citi"; plays with `provided_by === "network"` render under "Built into Mastercard World Elite". Section 3 ("From the community") stays as shipped. No new data — just the split.

## Context

Today the catalog mixes Citi-issued benefits and Mastercard-network benefits in the same group blocks (Hotels, Travel services, Shopping, Cash, Credits). Users can't tell which benefits update on Citi's release cycle vs. Mastercard's, and the recommender can't weight them differently. We agreed earlier to split the page into three source-discriminated sections; Section 3 already shipped (TASK-community-plays-section.md). This TASK delivers Section 1 and Section 2.

Earning rates (currently filtered out of the catalog with no replacement) and the "fine print" block (APRs, issuer rules) are out of scope here — separate follow-ups. The Mastercard research run will populate Section 2 with Music presales, Transit Benefit, Travel Rewards, etc., and add disabled-by-issuer rows; those come in via the network-research ingest, not this TASK.

## Requirements

1. Add a new optional field `provided_by: "issuer" | "network"` to `PlaySchema` in `scripts/lib/schemas.ts`, defaulting to `"issuer"`. Same field on `community_plays` (kept for symmetry; engine doesn't read it).
2. Tag every entry in `cards/citi_strata_premier.md`'s `card_plays[]` (16 entries) with the correct `provided_by`. Of the 16: 12 are `"issuer"` (5 earning rates + hotel_credit_100, trip_delay, trip_cancel, rental_cdw, fx_zero, ext_warranty, purchase_protection); 4 are `"network"` (luxury_hotels_breakfast, instacart_plus, peacock_credit, lyft_monthly_credit).
3. New client component `ProvenanceSection.tsx` renders a labeled section containing one or more `CatalogGroup`s filtered to a single provider. Reuse `CatalogGroup` verbatim — no fork.
4. In `CardHero.tsx`, replace the single `ALL_GROUPS.map(...)` catalog block with two `<ProvenanceSection>` instances: one for issuer (eyebrow "From Citi"), one for network (eyebrow "Built into Mastercard World Elite"). Section 3 (`CommunityPlaysSection`) stays exactly where it is.
5. Network section renders nothing when there are zero network plays — no empty header.

## Implementation Notes

### Schema (`scripts/lib/schemas.ts`)

Inside `PlaySchema`, add directly under `requires_signals`:

```ts
// Section 1 (Citi) vs Section 2 (Mastercard) discriminator on the
// per-card hero page. Defaults to "issuer" — most plays document an
// issuer-promised benefit. "network" tags benefits the card-network
// (Mastercard World Elite, Visa Infinite, etc.) provides across every
// card on the network. Section 3 plays live in card.community_plays
// regardless of this field.
provided_by: z.enum(["issuer", "network"]).optional().default("issuer"),
```

No other schema changes.

### Card data (`cards/citi_strata_premier.md`)

Migration of `card_plays[]` — add `"provided_by"` to each entry. Use the same Node-script pattern as the community migration (idempotent, JSON-aware, avoids `$` interpolation issues with String.replace). Mapping:

```
"network": ["luxury_hotels_breakfast", "instacart_plus", "peacock_credit", "lyft_monthly_credit"]
"issuer":  everything else (12 entries) — explicit tag, don't rely on defaults
```

Tag explicitly even when the value matches the schema default — makes the markdown self-describing and survives schema default changes.

### Engine

No engine changes needed. The engine reads `card.card_plays` (and concatenates `card.community_plays`); `provided_by` is purely a render-layer discriminator.

### Component (`components/wallet-v2/ProvenanceSection.tsx`)

Pattern-match the existing `CommunityPlaysSection.tsx` shape — header (eyebrow + title + subline), then a body. Body iterates `ALL_GROUPS` and renders one `CatalogGroup` per non-empty group, exactly like the current loop in `CardHero.tsx`.

```tsx
interface Props {
  eyebrow: string;
  title: string;
  subline: string;
  card: Card;
  // Already filtered to a single provider
  finds: ScoredFind[];
  playState: CardPlayState[];
  onMarkFind: (playId: string, status: FindStatus) => void;
  onProbeClick: (promptId: string) => void;
  onToggleGroupSkip: (group: PlayGroupId) => void;
  cardId: string;
  playSourceMap?: Map<string, ResolvedSource>;
  perkFlags?: Map<string, PerkFlag>;
}
```

Inside, build `groupedFinds = findsByGroup(finds)` and run the same `ALL_GROUPS.map(...)` block currently in `CardHero.tsx`. Return null when `finds.length === 0` so the network section vanishes when empty.

### Page composition (`CardHero.tsx`)

Replace the existing catalog block with:

```tsx
<ProvenanceSection
  eyebrow="From Citi"
  title="What Citi promises on this card"
  subline="Documented in the card terms — credits, protections, and always-on features. Updates on Citi's release cycle."
  card={card}
  finds={issuerFinds}
  ...
/>

<ProvenanceSection
  eyebrow="Built into Mastercard World Elite"
  title="What the network adds on top"
  subline="Benefits Mastercard provides on every World Elite card. Independent of Citi's release cycle."
  card={card}
  finds={networkFinds}
  ...
/>
```

Where `issuerFinds` and `networkFinds` are derived in a `useMemo` from `catalogFinds` (the existing community-filtered finds list):

```ts
const issuerFinds = useMemo(
  () => catalogFinds.filter((f) => (f.play.provided_by ?? "issuer") === "issuer"),
  [catalogFinds],
);
const networkFinds = useMemo(
  () => catalogFinds.filter((f) => f.play.provided_by === "network"),
  [catalogFinds],
);
```

The existing `groupedFinds` memo can be removed from `CardHero` — `ProvenanceSection` does its own grouping internally.

The existing earn-rate filter (`f.play.value_model.kind !== "multiplier_on_category"`) stays inside `ProvenanceSection`'s body, not at the section level — same behavior as today.

### Eyebrow / heading copy

Section 1 eyebrow: "From Citi"
Section 1 title: "What Citi promises on this card"
Section 1 subline: "Documented in the card terms — credits, protections, and always-on features. Updates on Citi's release cycle."

Section 2 eyebrow: "Built into Mastercard World Elite"
Section 2 title: "What the network adds on top"
Section 2 subline: "Benefits Mastercard provides on every World Elite card. Independent of Citi's release cycle."

Hardcode in `CardHero.tsx` for now; the network name will be parameterized when other networks land (Visa Infinite, etc.).

### Styles (`app/card-hero-redesign.css`)

Add `.provenance-section` to the shared `margin-bottom: 48px` rule alongside `.community-plays-section`. Match the section-head typography (eyebrow / title / subline) used by `CommunityPlaysSection` so the three sections read as a series. Keep the body's `CatalogGroup` styles untouched — they live inside.

## Do Not Change

- `data/*.json` — gitignored, regenerated.
- `cards/*.md` other than `cards/citi_strata_premier.md`.
- `lib/engine/*` — engine purity, no provider-aware logic.
- `lib/db.ts`, `lib/auth/*`, `lib/profile/*`.
- `CatalogGroup.tsx` — read for reference, do not modify.
- `MoneyFindRow.tsx`, `RecurringValueSection.tsx`, `MechanicsZone.tsx`, `ManageCardPanel.tsx`, `CommunityPlaysSection.tsx`, `CurrencyPanel.tsx`, `ValueThesisHero.tsx`, `CardArrivalHero.tsx`.
- `card.community_plays` — Section 3 stays as shipped.
- The earn-rate filter on `multiplier_on_category` — keep filtering them out at the row level. Bringing earning rates back is a separate TASK.

## Acceptance Criteria

- [ ] `npm run cards:build` passes; `data/cards.json` shows `provided_by` populated on every entry of `citi_strata_premier`'s `card_plays`.
- [ ] `npm run typecheck` passes.
- [ ] `npm run lint` passes (existing CardImage warning is allowed).
- [ ] `npm run build` passes.
- [ ] `npm test` passes — engine tests unchanged.
- [ ] Loading `/wallet/cards/citi_strata_premier` (with `NEXT_PUBLIC_WALLET_EDIT_V2=1`) shows three labeled sections in this order between RecurringValueSection and the calendar:
  1. "From Citi" — contains 7 visible rows (hotel credit, trip delay, trip cancel, rental CDW, no-FX, ext warranty, purchase protection — earning rates filtered).
  2. "Built into Mastercard World Elite" — contains 4 visible rows (luxury hotels, Instacart, Peacock, Lyft).
  3. "From the community" — unchanged from prior TASK.
- [ ] Mark-find behavior still persists across reload (Using / On list / Skip chips behave the same).
- [ ] Projected-rewards header at the top of the page is unchanged from before this TASK.
- [ ] `git diff --stat` shows changes only in: `cards/citi_strata_premier.md`, `scripts/lib/schemas.ts`, `components/wallet-v2/CardHero.tsx`, `components/wallet-v2/ProvenanceSection.tsx` (new), `app/card-hero-redesign.css`.

## Verification

1. `npm run cards:build && npm run typecheck && npm run lint && npm run build && npm test` — all green.
2. `git diff --stat` — scope contained to listed files.
3. `npm run dev`, visit `/wallet/cards/citi_strata_premier`:
   - Three section headers appear in order.
   - Mark a row in each section "Using"; reload — state persists.
4. `node -e "const c=require('./data/cards.json').find(x=>x.id==='citi_strata_premier'); const p=c.card_plays.map(x=>x.provided_by); console.log({issuer:p.filter(x=>x==='issuer').length, network:p.filter(x=>x==='network').length})"` returns `{ issuer: 12, network: 4 }`.
