# TASK: User profile read/write to Postgres

> Hook layer that reads the current user's profile on first render and persists changes back with a debounced server action.

## Context

The `perks_profiles` table (created via the SQL in README.md) has one row per user with JSON columns for `spend_profile`, `brands_used`, `cards_held`, `trips_planned`, `preferences`. Onboarding writes to these. The recommendation page reads from them. We need a clean read/write hook so onboarding screens don't each reinvent it.

## Requirements

1. Create `lib/profile/server.ts` exporting `getCurrentProfile()` for server components — reads the row for the currently authenticated user (via `getCurrentUser()` from `lib/auth/session.ts`), returns the typed `UserProfile` or throws if not authenticated.
2. Create `lib/profile/actions.ts` (`"use server"`) exporting `updateProfile(partial: Partial<UserProfile>)` — merges into the existing row using `jsonb_set` or full-row replacement, only allowed for the current user.
3. Create `lib/profile/client.ts` exporting `useProfile(initial: UserProfile)` — a client hook that:
   - Holds local optimistic state seeded with the server-provided initial profile
   - Returns `{ profile, update, saving, error }`
   - `update` accepts a partial UserProfile, merges, and calls `updateProfile()` server action with a 500ms debounce
4. Create `lib/profile/types.ts` defining `UserProfile`:
   ```ts
   interface UserProfile {
     spend_profile: Partial<Record<SpendCategoryId, number>>;
     brands_used: string[];
     cards_held: WalletCardHeld[];
     trips_planned: { destination: string; month?: string }[];
     preferences: { creditsMode?: "realistic" | "face"; viewMode?: "ongoing" | "year1" };
   }
   interface WalletCardHeld {
     card_id: string;
     opened_at: string;       // ISO date
     bonus_received: boolean;
   }
   ```
5. Wire `app/(app)/recommendations/page.tsx` to fetch the profile server-side and pass it to `RecPanelDesktop` as a prop.

## Implementation Notes

- DB access goes through the `sql` template-tag client at `lib/db.ts`. Pattern:
  ```ts
  const rows = await sql<{ spend_profile: ... }[]>`
    select spend_profile, brands_used, cards_held, trips_planned, preferences
    from perks_profiles where user_id = ${user.id} limit 1
  `;
  ```
- For `updateProfile`, do a single UPDATE with the merged JSON. Don't fan out into one query per column. Example:
  ```ts
  await sql`
    update perks_profiles
       set spend_profile = ${sql.json(merged.spend_profile)},
           brands_used   = ${sql.json(merged.brands_used)},
           cards_held    = ${sql.json(merged.cards_held)},
           trips_planned = ${sql.json(merged.trips_planned)},
           preferences   = ${sql.json(merged.preferences)},
           updated_at    = now()
     where user_id = ${user.id}
  `;
  ```
- The signup action already inserts an empty `perks_profiles` row when the user is created. If `getCurrentProfile()` somehow finds no row, return a default empty `UserProfile` — don't throw.
- Debounce with a small `setTimeout` + `useRef` pattern. Don't pull in lodash.
- `update` should accept either a partial object or a function `(prev) => next` like React's setState.
- Server actions automatically have access to the session cookie via `getCurrentUser()`. No extra wiring.

## Do Not Change

- `lib/auth/**`, `middleware.ts` — auth is settled
- `lib/db.ts` — client wrapper is settled
- `app/login/**`, `app/signup/**` — auth pages stay as-is
- `lib/engine/**` — engine takes profile as input but doesn't read/write it
- `lib/data/**` — card database is separate from user profile
- `components/recommender/RecPanelDesktop.tsx` — extend with a new optional `profile` prop, but don't rewrite the component (TASK-09 does that)

## Acceptance Criteria

- [ ] `npm run typecheck && npm run build` pass
- [ ] Visiting `/recommendations` while authenticated reads the profile from Postgres server-side
- [ ] Visiting `/recommendations` while unauthenticated still redirects to `/login`
- [ ] Calling `update({ spend_profile: { ... } })` from a client component triggers an UPDATE within 1 second (visible in Neon's query logs)
- [ ] Failed updates leave local state unchanged and expose an `error` value
- [ ] `git diff` shows changes only in `lib/profile/**`, `app/(app)/recommendations/page.tsx`, and a small prop addition in `components/recommender/RecPanelDesktop.tsx`

## Verification

1. `npm run typecheck && npm run build`
2. Sign up a fresh user, land on onboarding, confirm the row exists in Neon (`select * from perks_profiles`)
3. Manually update `spend_profile` directly in Neon (`update perks_profiles set spend_profile = '{"dining": 9999}'::jsonb where user_id = ...`), refresh `/recommendations`, confirm the page reads the new value
