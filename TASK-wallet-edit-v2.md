# TASK: Wallet Edit v2 — Persisted Rich Card Editor

> Ship the redesigned `/wallet/edit` page with persistence for the new per-card signals (nickname, AUs, pool status, claimed credits, status, etc.) — feature-flagged, backward-compatible.

## Context

We're shifting from a thin "edit your wallet" form (opened-date + bonus-received only) to a rich per-card editor where every signal the user provides tightens the audit math downstream. The redesign came back from Claude Design as a working HTML/JSX prototype: two-pane layout (wallet list + edit panel), a found-money tile per card, conditional clusters per card-type (claimed credits, point pooling, 5x category picker, cobrand activity, status), live deadlines strip, mobile sheet stack.

This TASK ships the full editor with persistence. The new fields are additive — old code reading `WalletCardHeld` continues to work because every new column is optional. Behind a feature flag so it can ship without disturbing the live onboarding flow.

The play-state side (per-credit `claimed/want_it/skip` tristate per card) is part of this TASK because the prototype already models it. The audit-page and `computeAudit` engine are TASK-001's territory and ship independently.

## Requirements

1. **Database migration.** Add a `db/migrations/0005_wallet_v2.sql` that extends `user_cards` with eight nullable columns (nickname, authorized_users, pool_status, pinned_category, elite_reached, activity_threshold_met, card_status, found_money_cached_usd) and creates a new `user_card_play_state` table for the per-credit/play tristate. All optional. Backward-compatible: existing reads return `null` for any unset column.

2. **Type and server-action extensions.** Extend `WalletCardHeld` in `lib/engine/types.ts` with the new optional fields and add a new `CardPlayState` type. Extend `updateUserCard()` in `lib/profile/actions.ts` to accept (and persist) any subset of the new fields. Add a new `updateCardPlayState(cardId, playId, state)` server action that upserts a `user_card_play_state` row.

3. **New route + components.** Create `app/(app)/wallet/edit/page.tsx` (server component, auth-gated by the existing `(app)/layout.tsx`) that renders a new `<EditWallet>` client component. Build the components from the design prototype, rewritten as TS using existing primitives (`CardArt`, `variantForCard`). Components live in `components/wallet-v2/`. List of files specified under *Implementation Notes*.

4. **CSS.** Append the design prototype's component-specific CSS to a new file `app/wallet-edit-v2.css`, imported only on the new route. Base tokens (paper, ink, pos, neg, art-* variants) already live in `app/globals.css` — do not duplicate. Any missing card-art variants the prototype uses (`art-graphite`, `art-claret`, `art-mint`, `art-bronze`) get added to `lib/cardArt.ts`'s variant set.

5. **Feature flag + settings wiring.** Gate `/wallet/edit` behind `NEXT_PUBLIC_WALLET_EDIT_V2=1` (returns 404 via `notFound()` when off). When the flag is on, the existing settings page link that currently goes to `/onboarding/cards?from=settings` updates to point at `/wallet/edit`. The onboarding `/onboarding/cards` route stays untouched and continues to work for new-user flow.

## Implementation Notes

### Files to create

- `db/migrations/0005_wallet_v2.sql` — migration (schema below).
- `app/(app)/wallet/edit/page.tsx` — server component route.
- `app/wallet-edit-v2.css` — component-specific CSS.
- `components/wallet-v2/EditWallet.tsx` — top-level client component (the page shell).
- `components/wallet-v2/EditPanel.tsx` — the rich edit panel (heart of the redesign).
- `components/wallet-v2/Cluster.tsx` — collapsible cluster container.
- `components/wallet-v2/FoundMoneyTile.tsx` — the value-range tile.
- `components/wallet-v2/DeadlinesStrip.tsx` — live deadlines banner.
- `components/wallet-v2/WalletListRow.tsx` — list item.
- `components/wallet-v2/SearchBar.tsx` — autocomplete search for adding cards.
- `components/wallet-v2/EmptyState.tsx` — first-card prompt.
- `components/wallet-v2/MobileSheet.tsx` — full-screen sheet wrapper for mobile.
- `components/wallet-v2/CategoryPicker.tsx` — Custom Cash 5x picker (renders only for the matching cards).
- `components/wallet-v2/Stepper.tsx`, `Toggle.tsx`, `YesNo.tsx` — small primitives if not already present.

### Files to modify

- `lib/engine/types.ts` — extend `WalletCardHeld` (additions only); add `CardPlayState`.
- `lib/profile/actions.ts` — extend `updateUserCard`; add `updateCardPlayState`.
- `lib/profile/server.ts` — extend the read path so `getCurrentProfile()` returns the new fields. Add a sibling `getCurrentCardPlayState(cardId)` that reads from `user_card_play_state`.
- `lib/cardArt.ts` — add any missing variant names.
- `app/(app)/settings/page.tsx` — update the wallet-edit link to point to `/wallet/edit` when the flag is on.

### Migration (paste into `db/migrations/0005_wallet_v2.sql`)

```sql
-- 0005_wallet_v2.sql
-- Extends user_cards with rich per-card signals captured by the
-- /wallet/edit redesign. All columns are nullable for backward compat.
-- Adds user_card_play_state for the per-card per-play tristate that
-- powers the audit page's checkboxes.

create type pool_status as enum ('yes', 'not_yet', 'unknown');
create type card_status_v2 as enum ('active', 'considering_close', 'downgraded', 'closed');
create type play_state as enum ('got_it', 'want_it', 'skip', 'unset');

alter table user_cards
  add column nickname text,
  add column authorized_users smallint,
  add column pool_status pool_status,
  add column pinned_category text,
  add column elite_reached boolean,
  add column activity_threshold_met boolean,
  add column card_status_v2 card_status_v2,
  add column found_money_cached_usd integer,
  add column signals_filled smallint,
  add column signals_total smallint;

create table user_card_play_state (
  user_id uuid not null references perks_users(id) on delete cascade,
  card_id text not null references cards(id),
  play_id text not null,
  state play_state not null default 'unset',
  claimed_at date,
  notes text,
  updated_at timestamptz default now(),
  primary key (user_id, card_id, play_id)
);

create index user_card_play_state_user_card_idx
  on user_card_play_state(user_id, card_id);
create trigger trg_user_card_play_state_updated
  before update on user_card_play_state
  for each row execute function set_updated_at();
```

The pre-existing `user_cards.status` column (held / closed_in_past_year / closed_long_ago) is left alone — it represents *whether* the card is in the wallet. The new `card_status_v2` represents the user's relationship to it (active / considering_close / etc.) and is orthogonal.

### Type additions (paste into `lib/engine/types.ts`)

```ts
export interface WalletCardHeld {
  card_id: string;
  opened_at: string;        // existing
  bonus_received: boolean;  // existing

  // new — all optional, backward-compatible
  nickname?: string;
  authorized_users?: number;
  pool_status?: "yes" | "not_yet" | "unknown";
  pinned_category?: SpendCategoryId;
  elite_reached?: boolean;
  activity_threshold_met?: boolean;
  card_status_v2?: "active" | "considering_close" | "downgraded" | "closed";

  // cached audit metadata (server fills these on save; UI reads them)
  found_money_cached_usd?: number;
  signals_filled?: number;
  signals_total?: number;
}

export interface CardPlayState {
  card_id: string;
  play_id: string;
  state: "got_it" | "want_it" | "skip" | "unset";
  claimed_at?: string;  // YYYY-MM-DD, set when state="got_it" and play is a claimable credit
  notes?: string;
}
```

### Server action signatures (paste into `lib/profile/actions.ts`)

```ts
export async function updateUserCard(
  cardId: string,
  patch: Partial<Omit<WalletCardHeld, "card_id">>,
): Promise<UpdateResult>;

export async function updateCardPlayState(
  cardId: string,
  playId: string,
  state: Pick<CardPlayState, "state" | "claimed_at" | "notes">,
): Promise<UpdateResult>;
```

`updateUserCard` should perform a single dynamic UPDATE that only sets the columns present in the patch. `updateCardPlayState` upserts via `INSERT ... ON CONFLICT (user_id, card_id, play_id) DO UPDATE SET ...`.

### Page composition

`app/(app)/wallet/edit/page.tsx` is a server component:

```ts
export default async function WalletEditPage() {
  if (process.env.NEXT_PUBLIC_WALLET_EDIT_V2 !== "1") notFound();
  const profile = await getCurrentProfile();
  const db = loadCardDatabase();
  return <EditWallet
    initialProfile={profile}
    serializedDb={toSerialized(db)}
  />;
}
```

`<EditWallet>` mirrors the prototype's `WalletPage`:
- Header bar (use existing app header — do not rebuild from prototype).
- Two-pane grid on desktop, single-column with mobile sheet on viewport ≤ 768px.
- Left pane: search bar + wallet list rows.
- Right pane: edit panel for the selected card, or `EmptyEdit` placeholder when none selected.

`<EditPanel>` is the heart. Hydrates from the held card's row, renders all clusters, persists changes through `updateUserCard` + `updateCardPlayState` server actions. The conditional cluster logic from the prototype (Custom Cash → category picker, pool-eligible → pool cluster, cobrand → elite cluster) maps onto card metadata: tag the card db with `accepts_pinned_category: SpendCategoryId[]` (subset of the 10 Citi-spec categories for Custom Cash; null for everything else), `is_pool_spoke: bool`, `is_cobrand: bool`. Add these as optional fields on `CardSchema` in `scripts/lib/schemas.ts`. For the v2 launch, populate them on `cards/citi_custom_cash.md`, `cards/citi_double_cash.md`, `cards/costco_anywhere_visa.md`, and the airline cobrand cards we already have.

### Save semantics

Save is **debounced + flush-on-blur** (matches the existing `useProfile` hook pattern in `lib/profile/client.ts`). Every cluster's onChange dispatches an optimistic update plus a debounced server-action call. The bottom-right "Save changes" button calls `flushNow()` and routes back to wallet list / dashboard. Cancel discards optimistic state and routes away.

For `updateCardPlayState`, the toggle row's onChange sends the patch to the server immediately (no debounce) — small, idempotent, and the user expects immediate feedback when they tick "claimed."

### Found-money number

For v2 launch, compute the displayed found-money number from card metadata (sum of `annual_credits[].value_usd × ease_of_use_factor` + estimated yearly earning at portal cpp on the user's spend profile). Stub function `computeFoundMoneyV2(card, profile)` in `lib/engine/foundMoney.ts`. Replace with the real `computeAudit` once TASK-001 lands. Range/point logic: range when `signals_filled / signals_total < 0.7`, single point otherwise. Store the cached number in `user_cards.found_money_cached_usd` on save so the wallet list rows can render quickly without re-running the engine.

### CSS

Copy the prototype's component-specific CSS (.fm-tile, .deadlines, .field-cluster, .toggle-row, .cat-pill, .status-pill, .wallet-row, .search-results, .mobile-sheet, .stepper, .ex-card, .pane-grid, .edit-pane, etc.) verbatim into `app/wallet-edit-v2.css`. Tokens (paper, ink, pos, etc.) and the .card-art rules already exist in `app/globals.css` — verify and skip any duplicate definitions. Import the CSS only from `app/(app)/wallet/edit/page.tsx` (`import "@/app/wallet-edit-v2.css";`).

### Backward compat

The existing `/onboarding/cards` flow continues to work. The old `CardsForm` reads only the four legacy fields from `WalletCardHeld` and ignores any new columns. New cards added through `/onboarding/cards` will simply have null values for all new fields — the audit page treats them as "no signals filled yet."

The existing `cards_held` jsonb column on `perks_profiles` is preserved (per the comment at the top of `0003_init_user_state.sql`). New columns are on `user_cards` only — no jsonb churn.

## Do Not Change

- `lib/engine/scoring.ts`, `lib/engine/eligibility.ts`, `lib/engine/ranking.ts` — the live recommender. New fields don't feed into it yet.
- `db/migrations/0001-0004` — no edits to existing migrations. New schema goes in `0005_wallet_v2.sql`.
- `cards_held` jsonb on `perks_profiles` — preserved untouched.
- `app/(app)/onboarding/cards/page.tsx` and `components/onboarding/CardsForm.tsx` — onboarding flow stays. Only the settings link gets repointed to `/wallet/edit`.
- `lib/db.ts`, `lib/auth/session.ts` — auth/db plumbing.
- `data/*.json` — derived from cards markdown by build script. Don't write directly.

## Acceptance Criteria

- [ ] `npm run typecheck` passes with zero errors.
- [ ] `npm run build` passes with zero errors.
- [ ] `npm test` passes (engine tests must continue to pass).
- [ ] Migration `0005_wallet_v2.sql` applies cleanly to a database that's already at 0004. Reverting (drop columns / drop table) restores prior schema.
- [ ] With `NEXT_PUBLIC_WALLET_EDIT_V2=1`, `/wallet/edit` renders the redesign for an authenticated user with at least one held card. List rows show found-money chips. Tapping a row opens the edit panel with all clusters that apply to the card's metadata.
- [ ] Editing a held card's nickname, AU count, pool status, card_status, and toggling a play_state checkbox all persist after a hard refresh.
- [ ] With `NEXT_PUBLIC_WALLET_EDIT_V2=0` or unset, `/wallet/edit` returns 404, settings link still points to the old `/onboarding/cards?from=settings` route.
- [ ] Existing onboarding flow (`/onboarding/cards`) still works for new users — adding a card persists the four legacy fields, ignores the new fields.
- [ ] Mobile viewport (≤ 768px) renders the full-screen sheet stack from the prototype, not the desktop two-pane layout.
- [ ] `git diff --stat` shows changes only in the files listed under *Implementation Notes*.

## Verification

1. Apply the migration locally: `psql $DATABASE_URL -f db/migrations/0005_wallet_v2.sql`. Confirm the new columns and table exist.
2. `npm run typecheck`, `npm run build`, `npm test` all pass.
3. Set `NEXT_PUBLIC_WALLET_EDIT_V2=1` in `.env.local`, run `npm run dev`, sign in, navigate to `/wallet/edit`. Walk through each cluster on a held Citi Strata Premier and confirm: typing a nickname, changing AU count, toggling pool status, clicking the $100 hotel claimed checkbox, picking "considering closing" status (and seeing the yellow callout). Hard-refresh and confirm every change persisted.
4. Add a new card via the search bar (e.g., Chase Sapphire Preferred). Confirm the edit panel opens with empty signals and saving creates a new `user_cards` row.
5. Toggle the flag off, confirm the route 404s and settings still works the old way.
6. `git diff --stat` and confirm no unrelated files were touched.
