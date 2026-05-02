# TASK: User profile read/write to Supabase

> Hook layer that reads the current user's profile on first render and persists changes back with a debounced write.

## Context

The `profiles` table (created via the SQL in README.md) has one row per user with JSON columns for `spend_profile`, `brands_used`, `cards_held`, `trips_planned`, `preferences`. Onboarding writes to these. The recommendation page reads from them. We need a clean read/write hook so onboarding screens don't each reinvent it.

## Requirements

1. Create `lib/profile/server.ts` exporting `getCurrentProfile()` for server components — reads the row for the current authenticated user, throws if not authenticated.
2. Create `lib/profile/client.ts` exporting `useProfile()` — a client hook that:
   - Reads initial state from a server-passed prop (no client-side fetch on mount)
   - Returns `{ profile, update, saving, error }`
   - `update` accepts a partial UserProfile and merges + persists with a 500ms debounce
3. Create `lib/profile/types.ts` defining `UserProfile` matching the `profiles` table JSON columns:
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
4. The `update` function performs an optimistic update — local state changes immediately, the network write happens after debounce. If the write fails, surface the error and roll back.
5. Wire the recommendation page (`app/(app)/recommendations/page.tsx`) to fetch the profile server-side and pass it to `RecPanelDesktop` as a prop. The component is currently a client component using stub data — preserve its interface but accept a `profile` prop.

## Implementation Notes

- Use `lib/supabase/server.ts` for server reads. Use `lib/supabase/client.ts` for client writes.
- Server read shape:
  ```ts
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();
  ```
- Profile rows are created at signup (see `lib/auth/actions.ts`). If `getCurrentProfile()` returns null, the user signed up but the insert failed — return a default empty `UserProfile` rather than throwing.
- Debounce with a small `setTimeout` + `useRef` pattern. Don't pull in `lodash` for this.
- The `update` function should accept either a partial object or a function `(prev) => next` like React's setState.
- The middleware refreshes the auth cookie; the server client just reads from cookies — no extra wiring needed.
- Don't change the auth pages or actions. They already create the profile row on signup.

## Do Not Change

- `lib/auth/**`, `middleware.ts`, `lib/supabase/**` — auth and Supabase clients are settled
- `app/login/**`, `app/signup/**` — auth pages stay as-is
- `lib/engine/**` — engine takes profile as input but doesn't read/write it
- `lib/data/**` — card database is separate from user profile
- `components/recommender/RecPanelDesktop.tsx` — extend with a new optional `profile` prop, but don't rewrite the component (TASK-09 does that)

## Acceptance Criteria

- [ ] `npm run typecheck && npm run build` pass
- [ ] Visiting `/recommendations` while authenticated reads the profile from Supabase server-side
- [ ] Visiting `/recommendations` while unauthenticated still redirects to `/login` (existing behavior)
- [ ] Calling `update({ spend_profile: { ... } })` from a client component triggers a Supabase write within 1 second (debounce)
- [ ] Failed writes leave the local state unchanged and expose an `error` value
- [ ] `git diff` shows changes only in `lib/profile/**`, `app/(app)/recommendations/page.tsx`, and a small prop addition in `components/recommender/RecPanelDesktop.tsx`

## Verification

1. `npm run typecheck && npm run build`
2. Sign up a fresh user, land on onboarding (TASK-06 wires it up — for now just confirm `/recommendations` loads)
3. In Supabase dashboard, manually set `spend_profile` to `{ "dining": 9999 }` — refresh `/recommendations`, confirm the page reads that value (will require minor wiring inside the rec panel)
