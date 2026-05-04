# TASK: User-editable program cpps + Strata page header positioning + remove inline feeder-pair block

> Replace the read-only YOUR POINTS panel with three editable cpp values per program (cash, travel portal, typical transfer), persist overrides per-user, wire them through the engine. While we're in the same file, lift `card_intro.positioning` into the identity header below the meta line, delete `CardIntroBlock`, and stop rendering the YOUR HIGHEST-LEVERAGE NEXT CARD panel — it belongs on `/recommendations`, not on the per-card detail page.

## Context

CLAUDE.md was just rewritten from "Conservative cpp" to "User-driven cpp" (commit on this branch). The new doctrine: each currency program (Citi TY, Amex MR, Chase UR, etc.) ships with default cpps and is user-overridable per program. Bank transferables carry three values — cash, portal, transfer — airline/hotel programs carry one. Overrides live on the program (keyed by `program_id`), never on the card, so editing Citi TY's transfer value on the Strata page propagates to every Citi TY card in the wallet.

The engine already has a `redemption_style` ladder in `lib/engine/scoring.ts` (`resolveLoyaltyCpp`). Default style is `"transfers"`, which picks `median_redemption_cpp` first. v1 keeps that ladder intact and feeds it via user overrides — when a user edits "Typical transfer" to 2.2¢ for Citi TY, the engine reads 2.2¢ instead of the program's shipped 1.9¢ median. No `redemption_style` UI in this TASK.

The header move is bundled because it shares the same render tree and the user already signed off on placement (Cowork conversation 2026-05-04): positioning text goes under the meta line, both lines stay, header gets one extra line.

The feeder-pair removal is bundled for the same reason — same render tree, same conversation. The card detail page is "the card you have"; cross-card recommendations belong on `/recommendations`. The `feeder_pair` data on `cards/*.md` is the source of truth and stays untouched; only the inline render call disappears. A follow-on TASK will wire `feeder_pair` into the rec engine so missing feeders surface on `/recommendations`.

## Requirements

### 1. Header — move `positioning` into the identity strip and delete `CardIntroBlock`

In `components/wallet-v2/CardHero.tsx` (`<header className="card-hero-identity">`, around line 327):

- After `<div className="card-hero-meta">…</div>` (line 338-345) and before `<OpenedAtPill />`, render `card.card_intro?.positioning` as a paragraph with class `card-hero-positioning`. When `card.card_intro` is undefined, render nothing — no fallback copy.
- Remove the `<CardIntroBlock card={card} />` line (around line 364) and the import.
- Delete `components/wallet-v2/CardIntroBlock.tsx`.
- Add a `.card-hero-positioning` rule to `app/wallet-edit-v2.css`: muted color (use the same gray as `.card-hero-meta`), same font size as the meta line or one step smaller, max-width 60ch so the line doesn't run wider than the body copy below.

The other two `card_intro` fields (`differentiator`, `ecosystem_role`) stay in the schema and the markdown — they're still consumed elsewhere. Don't touch the schema.

### 2. Migration `db/migrations/0007_point_value_overrides.sql`

```sql
-- 0007_point_value_overrides.sql
-- Per-user per-program cpp overrides. New doctrine in CLAUDE.md:
-- "User-driven cpp." Each currency program has overridable values for
-- cash, travel portal, and transfer/redemption. Engine reads overrides
-- via getEffectiveProgram() and feeds them into resolveLoyaltyCpp's
-- existing ladder.
--
-- Bank transferable currencies use all three columns. Airline/hotel
-- programs only populate transfer_cpp (the redemption value). The app
-- layer is responsible for not exposing irrelevant rows in the UI;
-- the table itself is permissive.

create table perks_point_value_overrides (
  user_id uuid not null references perks_users(id) on delete cascade,
  program_id text not null,
  cash_cpp numeric(5,3),
  portal_cpp numeric(5,3),
  transfer_cpp numeric(5,3),
  updated_at timestamptz not null default now(),
  primary key (user_id, program_id),
  check (cash_cpp is null or (cash_cpp >= 0.5 and cash_cpp <= 5)),
  check (portal_cpp is null or (portal_cpp >= 0.5 and portal_cpp <= 5)),
  check (transfer_cpp is null or (transfer_cpp >= 0.5 and transfer_cpp <= 5))
);

create index perks_point_value_overrides_user_idx
  on perks_point_value_overrides(user_id);

create trigger trg_perks_point_value_overrides_updated
  before update on perks_point_value_overrides
  for each row execute function set_updated_at();
```

`set_updated_at()` is already defined in an earlier migration (used by `perks_user_signals`); reuse, don't redefine.

### 3. Loader + server actions

In `lib/profile/server.ts`, add a cached loader matching the `getUserSignals` pattern (lines 259–277). Soft-fails on missing table the same way (`isUndefinedTableError`):

```ts
export interface ProgramCppOverride {
  cash_cpp: number | null;
  portal_cpp: number | null;
  transfer_cpp: number | null;
}

export const getProgramCppOverrides = cache(
  async (userId: string): Promise<Map<string, ProgramCppOverride>> => { ... }
);
```

In `lib/profile/actions.ts`, add two server actions:

```ts
"use server";
export async function setProgramCppOverride(
  programId: string,
  field: "cash_cpp" | "portal_cpp" | "transfer_cpp",
  value: number | null,
): Promise<void>

export async function resetProgramCppOverrides(
  programId: string,
): Promise<void>
```

`set` upserts a single column for `(user_id, program_id)` (other columns preserved on conflict). Validate `value` is `null` or in `[0.5, 5]` server-side; throw on out-of-range. `reset` deletes the row. Both call `revalidatePath("/wallet/cards/[id]", "page")` so the engine re-runs with new values. Match the dual-write / soft-fail pattern at lines 348–388 — both actions must no-op gracefully if the table is missing.

### 4. Engine wiring — `getEffectiveProgram` helper, options pass-through

New file `lib/engine/programOverrides.ts`:

```ts
import type { Program } from "@/lib/data/loader";
import type { ProgramCppOverride } from "@/lib/profile/server";

// Overlay a user's per-program overrides onto the program's shipped
// cpp fields. Only fields with a non-null override are replaced; the
// rest fall through to defaults. Mapping:
//   cash_cpp     → (no engine field today; held for future use)
//   portal_cpp   → portal_redemption_cpp
//   transfer_cpp → median_redemption_cpp
export function applyProgramOverride(
  program: Program,
  override: ProgramCppOverride | undefined,
): Program { ... }
```

In `lib/engine/scoring.ts` `classifyEarning` (line 146): change the program lookup so it consults `options.programOverrides` (a `Map<string, ProgramCppOverride>`) and runs the result through `applyProgramOverride` before passing to `resolveLoyaltyCpp`. Add `programOverrides` to the engine's `ScoreOptions` (or wherever the existing `redemptionStyle` option is declared in `lib/engine/types.ts`).

Threading: every call site that builds engine options needs to load `programOverrides` once and pass it in. Audit:
- `app/(app)/wallet/cards/[id]/page.tsx` (already loads `userSignals`; mirror the same pattern)
- `app/(app)/recommendations/page.tsx` (or wherever the rec engine is invoked)
- `app/(app)/wallet/edit/page.tsx`
- `lib/engine/foundMoney.ts` if it computes cpp directly

Tests: extend the existing engine integration test in `tests/` (the one that loads the real card DB per CLAUDE.md) with a new test that sets a `programOverrides` map for `citi_thankyou` with `transfer_cpp = 2.5` and asserts the Strata Premier score moves accordingly.

### 5. `CurrencyPanel` rewrite

Replace `components/wallet-v2/CurrencyPanel.tsx` with an editable version. New props:

```ts
interface Props {
  card: Card;
  program: Program | undefined;
  /** User's stored override for this program (may be empty). */
  override: ProgramCppOverride | null;
  /** Program's shipped defaults — needed so the UI can show "default 1.9¢" */
  /** hints alongside user-edited values. */
  defaults: { cash: number | null; portal: number | null; transfer: number | null };
  /** "transferable" → 3 rows, "loyalty" → 1 row, "fixed" → 1 read-only row. */
  programType: "transferable" | "loyalty" | "fixed";
}
```

`programType` is derived server-side from `program.kind` + presence of transfer_partners. Pass it down rather than re-deriving in client.

Render:

- Eyebrow: `YOUR POINTS PORTAL`
- Heading: `{program.name}` (e.g., "Citi ThankYou Rewards")
- Sub-copy: `"This card earns into your {program.name} balance. Edits below propagate to every {program.short_name} card in your wallet."` Use `program.short_name` if available, else `program.name`.
- Editable values box. Three rows for `transferable`, one row for `loyalty`. For `fixed`, render a single read-only row with a "fixed by issuer" tag.
  - Row label (left): `Cash` / `Citi travel portal` / `Typical transfer` for transferables; `Redemption` for loyalty. Use `{program.issuer} travel portal` for the portal row label.
  - Input (center): controlled `<input type="number" step="0.1" min="0.5" max="5">` rendering the current effective value (override ?? default). Suffix `¢ / pt`.
  - Default hint (right): when a user override is set and differs from the default, show `default {default}¢` in muted text. When no override is set, show nothing.
  - Headline badge (right of headline row): the row whose cpp the engine actually uses gets a small `used for scoring` pill. Determined by mirroring `resolveLoyaltyCpp`'s logic in the client: in `transfers` style (the v1 default), `transfer_cpp > portal_cpp > cash_cpp`. For `loyalty` programs the single row always has the badge.
- `Reset to defaults` link below the box, only rendered when at least one override is set. Calls `resetProgramCppOverrides(program.id)`.
- Below the box: keep the partners count line and the airline-partner tag row exactly as today.
- Drop the `ecosystemLine` prop and the unlock paragraph entirely — that copy will move to `/recommendations` along with the feeder-pair render (see Requirement 6). Don't carry it forward inside `CurrencyPanel`.

Saving: on input blur or 600ms debounce after change, call `setProgramCppOverride(program.id, field, value)`. Optimistic update: write the new value into local state immediately, fall back if the server action throws. On `null`/empty input, clear that column (`setProgramCppOverride(program.id, field, null)`).

Validation: input bounds 0.5–5, but the server is the source of truth. Show a small inline error if the server rejects.

Pass `defaults` from the page server component by reading `program.median_redemption_cpp`, `portal_redemption_cpp`, and (for cash) `1` — programs don't ship a separate `cash_cpp` field, but the cash row's default is always 1¢ for transferables (statement-credit floor).

Mobile: same component, inputs full-width, default hint wraps under the input.

### 6. Stop rendering `FeederPairBlock` on the card detail page

In `components/wallet-v2/CardHero.tsx`, remove the `<FeederPairBlock … />` JSX block and its `{card.feeder_pair && …}` guard. Remove the `import { FeederPairBlock } from "./FeederPairBlock";` line.

Do **not** delete `components/wallet-v2/FeederPairBlock.tsx`. The component will be reused on `/recommendations` in the follow-on TASK. Leave the file, the props, and any tests intact.

Do **not** touch the `feeder_pair` schema in `scripts/lib/schemas.ts`. Do **not** edit any `cards/*.md` `feeder_pair` entries. The data is the source of truth and stays exactly as it is.

The visual effect: the YOUR HIGHEST-LEVERAGE NEXT CARD panel disappears from `/wallet/cards/citi_strata_premier` (and every other card detail page). Whatever sits below it (Earning, Credits, Airlines, etc.) snaps up against the YOUR POINTS panel.

## Implementation Notes

- **`Program` schema doesn't change.** No new fields on the program — overrides override existing `median_redemption_cpp` / `portal_redemption_cpp`. Cash override has no engine effect in v1 (engine never uses cash cpp directly except as the `cash_only` style fallback, which isn't user-selectable yet); the column exists in the table to support a future redemption-style picker without another migration.
- **`redemption_style` stays default `"transfers"`.** Don't expose a picker. The whole TASK assumes that style.
- **`isUndefinedTableError` import** lives in `lib/profile/server.ts` already; reuse.
- **`ScoreOptions`/`RankOptions` type** — find the existing options type in `lib/engine/types.ts` and add `programOverrides?: Map<string, ProgramCppOverride>` as optional. Engine treats undefined as empty map.
- **Pure-engine rule.** `applyProgramOverride` returns a new Program object (don't mutate). No `Date.now()`, no I/O.
- **Re-run on UI change.** Engine already does this on every render. After save, `revalidatePath` on the card page is enough — the server component re-loads the override map and the engine re-scores.
- **Display unit.** Match existing `formatCpp`: `1¢` for whole values, `1.9¢` for one decimal. Inputs use raw numbers (`1.9`) without the cent symbol.
- **The "used for scoring" badge wording.** Confirmed copy: `used for scoring`. Lowercase, small caps via CSS optional.

## Do Not Change

- **`scripts/lib/schemas.ts`** — no schema changes in this TASK. The `card_intro` shape stays. No new program fields.
- **`cards/*.md`** — no markdown edits. All cpp data flows through the existing program defaults plus user overrides.
- **`lib/engine/scoring.ts` `resolveLoyaltyCpp` ladder logic** — keep the three-style ladder as-is. Only change is that `program` arrives with overrides already applied via `applyProgramOverride`.
- **`OpenedAtPill`, `DeadlinesStrip`, `ValueThesisHero`, `CatalogGroup`** and any other component below the header. Out of scope.
- **`components/wallet-v2/FeederPairBlock.tsx`** — file stays. Only the render call from `CardHero.tsx` and its import are removed. The component will be reused on `/recommendations`.
- **`feeder_pair` schema in `scripts/lib/schemas.ts`** and **all `cards/*.md` `feeder_pair` entries** — leave alone. Data is the source of truth for the follow-on rec wiring.
- **`ManageCardDisclosure` and the YOUR CARD · SIGNALS settings panel.** Separate redesign, separate TASK.
- **Existing migrations 0001–0006** — append-only, never modify.
- **`perks_user_signals`** schema and queries — leave alone, this is a separate table.
- **`differentiator` and `ecosystem_role`** fields in `card_intro` — they may be consumed by `/recommendations` or other surfaces. Don't strip them.

## Acceptance Criteria

- [ ] `npm run build` passes with zero errors.
- [ ] `npm run typecheck` passes.
- [ ] `npm run lint` passes.
- [ ] `npm test` passes including the new override-aware engine test.
- [ ] On `/wallet/cards/citi_strata_premier`, the positioning sentence "Citi's $95 mid-tier travel card with broad 3x earn…" appears inside the identity header, between the meta line and the GOT IT pill, in muted text.
- [ ] `CardIntroBlock.tsx` is deleted; no references remain.
- [ ] On the same page, the YOUR POINTS panel shows three editable rows (Cash, Citi travel portal, Typical transfer) with the headline `used for scoring` badge on the Typical transfer row by default.
- [ ] The YOUR HIGHEST-LEVERAGE NEXT CARD panel no longer renders on `/wallet/cards/citi_strata_premier` (or any other card detail page). `FeederPairBlock.tsx` still exists in the repo and still type-checks.
- [ ] Editing Typical transfer to 2.2 and tabbing out: input persists across reload, the Earning section dollar figures recompute upward.
- [ ] Loading `/wallet/cards/citi_premier` shows the same 2.2¢ in the transfer row — overrides propagate by program, not by card.
- [ ] Loading `/wallet/cards/amex_gold` shows Amex MR with its untouched defaults — overrides are scoped to a single program.
- [ ] Clicking `Reset to defaults` clears the override row and the panel returns to shipped values.
- [ ] Inputting a value outside 0.5–5 is rejected (client validation message + server rejection).
- [ ] `git diff` touches only files listed under Implementation Notes plus the new files declared in this TASK.

## Verification

1. `npm run cards:build && npm run build` — zero errors.
2. `npm run typecheck && npm run lint && npm test`.
3. Apply migration `0007_point_value_overrides.sql` to the dev DB and confirm the table exists with the three numeric columns and the bounds checks.
4. In the dev app, walk through the acceptance criteria scenario on Strata Premier → Citi Premier → Amex Gold and verify scoping behavior.
5. `git diff --stat` — confirm changes are confined to: `db/migrations/0007_point_value_overrides.sql`, `lib/profile/server.ts`, `lib/profile/actions.ts`, `lib/engine/programOverrides.ts`, `lib/engine/scoring.ts`, `lib/engine/types.ts`, `components/wallet-v2/CurrencyPanel.tsx`, `components/wallet-v2/CardHero.tsx`, `app/wallet-edit-v2.css`, `app/(app)/wallet/cards/[id]/page.tsx` (and the recommendations / wallet-edit pages if they invoke the engine), one engine test file, and the deletion of `components/wallet-v2/CardIntroBlock.tsx`.
