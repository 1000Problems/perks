# TASK: Pre-launch security hardening — auth timing, error leaks, input validation, CSRF

> Four small fixes flagged by code review that need to land before the site takes real signups: close the login timing side-channel, stop leaking Postgres errors to the client, validate server-action inputs at the boundary, and pin the session cookie's CSRF posture.

## Context

Code review surfaced four security items in the auth and profile-action surface. None is exploitable in dev, all are cheap, and together they shore up the boundary the site exposes once it accepts user accounts. The four are independent enough to land in any order but cohesive enough to ship as one PR.

The site is pre-launch with no production users. There's no migration concern; behavior changes are visible only in dev/test.

## Requirements

### 1. Login timing — kill the account-enumeration side-channel

`lib/auth/actions.ts:108` calls `verifyPassword(password, "scrypt$32768$8$1$AAAA$AAAA")` when the account doesn't exist. The dummy hash decodes (4 base64 chars → 3 bytes) and `verifyPassword` does run a scrypt pass against it with realistic N/r/p params, so the timing is *roughly* matched today. The problem is brittleness: the dummy has a 3-byte salt and 3-byte expected key instead of the production 16/64. A future tightening of `verifyPassword` (e.g. rejecting non-16-byte salts) would silently turn this into a fast-fail and re-open the side-channel. The dummy should be bit-identical in shape to a real hash so refactors can't accidentally regress.

Fix: precompute a realistic dummy hash once at module-load time and use it for every missing-account login attempt.

```ts
// lib/auth/actions.ts (top of file, after imports)
const DUMMY_HASH_PROMISE = hashPassword("not-a-real-password-only-for-timing-equalization");

// in loginAction(), replace the existing branch:
if (!user) {
  const dummy = await DUMMY_HASH_PROMISE;
  await verifyPassword(password, dummy);
  return { error: "Wrong account or password." };
}
```

The `DUMMY_HASH_PROMISE` resolves once per server process; subsequent calls await the cached resolved value. The first request after a cold start eats one extra scrypt run — acceptable given the security trade.

### 2. Postgres error detail — strip `detail` from `UpdateResult` returns

`lib/profile/actions.ts:164,202,237` all return `{ ok: false, error, detail: msg }` to the client where `msg` is the raw Postgres error text. Postgres helpfully includes things like `Key (account)=(angel) already exists` or constraint names referencing internal table structure. The structured `error` code is sufficient for the client to render copy; the detail string belongs in server logs only.

Fix: drop the `detail` field from the returned `UpdateResult` in all three actions (`updateProfile`, `updateUserCard`, `updateCreditBand`). Keep the `console.error("[profile:update] failed:", msg)` so the operator still sees the cause server-side. Also remove `detail?: string` from the `UpdateResult` interface so no caller accidentally forwards it.

`lib/profile/client.ts` may format the friendly copy off the `error` code — verify it doesn't rely on `detail` first. If it does, preserve the call sites by reading from the code instead.

### 3. `updateUserCard` — Zod-validate at the action boundary

`lib/profile/actions.ts:179` accepts an `UpdateUserCardInput` typed at compile time but unchecked at runtime. The function is reachable as a Next server action, so the client controls every field: `card_id` could be any string (the FK eventually rejects unknown ids, but that's a 400-ish round-trip that surfaces as an opaque "card_not_in_catalog" rather than an early-fail), `status` is typed but a malicious POST can put any string there and Postgres will reject it via the enum — again opaquely.

Fix: validate at the boundary with Zod before touching the database.

```ts
import { z } from "zod";

const CARD_ID_SHAPE = /^[a-z0-9_-]+$/;

const UpdateUserCardSchema = z.object({
  card_id: z.string().min(1).max(80).regex(CARD_ID_SHAPE),
  status: z.enum(["held", "closed_in_past_year", "closed_long_ago"]),
  opened_at: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
  closed_at: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
  bonus_received: z.boolean().optional(),
});

export async function updateUserCard(input: UpdateUserCardInput): Promise<UpdateResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "not_authenticated" };

  const parsed = UpdateUserCardSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "invalid_input" };
  }
  // ... rest unchanged, using parsed.data instead of input
}
```

Add `"invalid_input"` to the `UpdateResult.error` union.

While here, audit the other server actions for the same gap: `updateProfile` accepts a `Partial<UserProfile>` — its `cards_held` array entries also flow into Postgres. Worth a Zod schema on that too. `updateCreditBand` already validates against `VALID_CREDIT_BANDS`, so it's fine.

For `updateProfile`, schema:

```ts
const SpendCategoryIdSchema = z.enum([
  "groceries", "dining", "gas", "airfare", "hotels", "streaming",
  "shopping", "drugstore", "transit", "utilities", "home", "other",
]);
const WalletCardHeldSchema = z.object({
  card_id: z.string().min(1).max(80).regex(CARD_ID_SHAPE),
  opened_at: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  bonus_received: z.boolean(),
});
const UpdateProfileSchema = z.object({
  spend_profile: z.record(SpendCategoryIdSchema, z.number().min(0).max(10_000_000)).optional(),
  brands_used: z.array(z.string().min(1).max(80)).max(200).optional(),
  cards_held: z.array(WalletCardHeldSchema).max(50).optional(),
  trips_planned: z.array(z.object({
    destination: z.string().min(1).max(120),
    month: z.string().max(20).optional(),
  })).max(50).optional(),
  preferences: z.record(z.string(), z.unknown()).optional(),
});
```

Same pattern — `safeParse` at the top, return `invalid_input` on failure. Sane upper bounds on lengths so a malicious client can't DoS the database with a 10MB array.

### 4. Session cookie SameSite — verify, document, test

`lib/auth/session.ts:49` already sets `sameSite: "lax"` on the session cookie. That's the right default for CSRF protection on Next.js server actions: lax cookies are sent on top-level navigations and same-origin POSTs, but not on cross-origin form submissions. There's nothing to change in code today — the requirement is to *prove* the protection holds and lock in the assumption.

Fix: add a unit test under `tests/auth/session.test.ts` that asserts the cookie options. The test should mock `cookies()` or call `createSession` against an in-memory cookie jar and assert:
- `sameSite === "lax"` (not `"none"`, not unset)
- `httpOnly === true`
- `path === "/"`
- `secure === true` when `process.env.NODE_ENV === "production"` (the dev case is documented separately — see below)

Use whatever pattern the existing tests use for mocking Next request scope; if there isn't an established one, the test can construct cookie-option objects from the same source by exporting a `sessionCookieOptions(expiresAt)` helper from `session.ts`. The helper centralizes the option set so the test asserts against one source-of-truth, and the runtime code reads the same options.

```ts
// lib/auth/session.ts — extracted helper
export function sessionCookieOptions(expiresAt: Date) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    expires: expiresAt,
  };
}
```

`createSession` and the cookie-clear branches use the helper instead of inlining the options.

Add a short comment in `session.ts` documenting the CSRF posture:

```ts
// CSRF posture: SameSite=Lax on the session cookie is our sole CSRF
// defense. Server actions rely on this — no CSRF tokens. Lax allows
// cookies on top-level navigations + same-origin POSTs (which is what
// Next form actions are), but blocks cross-origin form submissions
// from third-party sites. If we ever need to broaden this (embedded
// SDK, OAuth callback flow, etc.), we have to add a token check here.
```

Add a section to `docs/ARCHITECTURE.md` under "Auth" mentioning the same: "CSRF protection comes from `sameSite: lax` on the session cookie. Server actions rely on this; we don't issue CSRF tokens."

### Tests

Add `tests/auth/login-timing.test.ts`:
- Time `loginAction` against a non-existent account vs an existing account with a wrong password. Assert the two timings are within 50% of each other (loose because CI is noisy). Run a few iterations and compare medians. The intent is to catch a regression where the dummy-hash branch short-circuits — not to assert sub-millisecond parity.

Add `tests/auth/session.test.ts`:
- `sessionCookieOptions(...)` returns `{ sameSite: "lax", httpOnly: true, path: "/" }`.
- `secure` is `true` when `NODE_ENV === "production"`, `false` otherwise. Mock via `vi.stubEnv("NODE_ENV", "production")`.

Update `tests/profile/actions.test.ts` (or create it if missing) to cover:
- `updateUserCard` rejects malformed `card_id`, `status`, dates → returns `{ ok: false, error: "invalid_input" }`.
- `updateProfile` rejects oversized `cards_held` (51 entries), invalid spend amounts (negative, NaN), unknown spend category keys.
- Successful updates return `{ ok: true }` with no `detail` field present.

If there's no existing `tests/profile/` directory, create it and use the same loadCardDatabase + db mocking pattern that auth tests use.

## Implementation Notes

### Files in scope

- `lib/auth/actions.ts` — module-load dummy hash, use it in loginAction
- `lib/auth/session.ts` — extract `sessionCookieOptions`, add CSRF doc comment
- `lib/profile/actions.ts` — drop `detail` from `UpdateResult`, add Zod validation in `updateUserCard` and `updateProfile`, add `"invalid_input"` to error union
- `lib/profile/client.ts` — confirm no reads of `result.detail`; remove if present (back-compat — `detail` was optional, so dropping it is non-breaking for typed callers)
- `docs/ARCHITECTURE.md` — one paragraph in the Auth section describing the CSRF posture
- `tests/auth/login-timing.test.ts` — new file
- `tests/auth/session.test.ts` — new file
- `tests/profile/actions.test.ts` — new file (or extend if exists)

### Non-goals for this TASK

- **Rate limiting** on login. Worth adding pre-launch but it's a separate problem (needs a counter store). File a follow-up.
- **CSRF tokens.** Lax SameSite is sufficient for the current architecture; tokens add complexity we don't need.
- **Argon2 migration.** Scrypt is fine; the prefix-versioned hash format already supports a future migration.
- **Profile-update race condition** (code review #7). Pre-launch single-user, defer.

## Do Not Change

- `lib/auth/password.ts` — scrypt parameters and hash format are settled.
- The shape of the cookie itself (name, expiry, hashing algorithm) — only the test extracts the options into a helper.
- `lib/db.ts`, schema migrations, or any catalog code — out of scope.
- `lib/engine/**`, recommendation logic, card data — entirely orthogonal.
- Onboarding flows, page-level components, the rec panel — only consume action results, no UI changes needed.
- The action-result `error` union codes that the UI maps to copy — adding `"invalid_input"` is purely additive; all existing codes stay.

## Acceptance Criteria

- [ ] `npm run typecheck` passes.
- [ ] `npm run lint` passes.
- [ ] `npm test` passes; new tests in `tests/auth/login-timing.test.ts`, `tests/auth/session.test.ts`, `tests/profile/actions.test.ts` all pass.
- [ ] Login against a non-existent account and a real account-with-wrong-password produce timings within 50% of each other (median over 5 trials each).
- [ ] `UpdateResult` returned from any server action contains no `detail` field.
- [ ] `updateUserCard({ card_id: "../../etc/passwd", status: "held" })` returns `{ ok: false, error: "invalid_input" }` without touching the database (assert via mock).
- [ ] `createSession` cookies always carry `sameSite: "lax"`, `httpOnly: true`, `path: "/"`. `secure` is `true` in production, `false` in dev.
- [ ] `docs/ARCHITECTURE.md` has a CSRF section documenting the SameSite assumption.
- [ ] `git diff --stat` shows changes only in: `lib/auth/actions.ts`, `lib/auth/session.ts`, `lib/profile/actions.ts`, `lib/profile/client.ts`, `docs/ARCHITECTURE.md`, three new test files.

## Verification

1. `npm run typecheck && npm run lint && npm test` — all green.
2. Manual: in `npm run dev`, hit `/login` with a non-existent account and a real account with the wrong password. Both should land on "Wrong account or password." and feel similarly slow (~80–150ms scrypt time).
3. Manual: open DevTools → Application → Cookies after login. Confirm `perks_session` shows `SameSite: Lax`, `HttpOnly: true`, `Secure: false` (dev) / `true` (prod build).
4. Manual: in DevTools console while logged in, run `fetch("/profile-action-endpoint", { method: "POST", body: '{"card_id":"x"}' })` from a tab on a different origin (e.g. an iframe pointing to perks). Cookie should not be sent — Lax blocks cross-origin POSTs.
5. `git diff --stat` matches the file list in Acceptance Criteria.
