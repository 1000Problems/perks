# TASK: Eligibility engine

> Pure function that decides whether a user is eligible for a given card based on their wallet history and the issuer's rules.

## Context

Issuer application rules are real friction: Chase 5/24 denies applications when 5+ new accounts opened in 24 months; Amex once-per-lifetime locks out the SUB if you've held that exact product before; Citi 8/65/95 limits ThankYou family applications. The recommendation panel renders an `EligibilityChip` (green/yellow/red) for each card — the engine fills in the actual status using rules from `data/issuer_rules.json` and the user's `cards_held`.

## Requirements

1. Create `lib/engine/eligibility.ts` exporting one pure function:
   ```ts
   export function evaluateEligibility(
     card: Card,
     wallet: WalletCardHeld[],
     db: CardDatabase,
     today: Date,
   ): { status: "green" | "yellow" | "red"; note: string };
   ```
2. Implement at minimum: Chase 5/24, Amex once-per-lifetime per product, Citi 8/65/95 family rules, Capital One 1-per-month, Bank of America 2/3/4 and 7/12, Sapphire 48-month rule. Use rule definitions from `db.issuerRulesByIssuer.get(card.issuer)`.
3. Return a one-line `note` for the EligibilityChip — `"Eligible · 2/24"`, `"At 4/24 — risky"`, `"Once-per-lifetime risk — verify"`, `"Business card — needs business income"`.
4. Yellow status is for borderline cases (e.g., 4/24 on a Chase card, ambiguous Amex SUB clawback window). Red is for definite denials. Green is the default when no rule applies negatively.
5. Add unit tests in `tests/engine/eligibility.test.ts` covering: clean wallet, 4/24 Chase yellow, 5/24 Chase red, Amex held-before red, business card flag yellow.

## Implementation Notes

- Pure function. No imports from `lib/auth/**`, `next/**`, or any I/O API.
- `Card` type comes from `@/lib/data/loader`. `CardDatabase` too.
- `WalletCardHeld` shape:
  ```ts
  { card_id: string; opened_at: string; bonus_received: boolean }
  ```
  This matches what `lib/profile/types.ts` will define in TASK-05. For now, define it in `lib/engine/types.ts` and TASK-05 can re-export from there.
- The `today` parameter is for testability — production callers pass `new Date()`, tests pass fixed dates.
- 5/24 logic: count personal-credit cards opened by the user in the last 24 months. Resolve the card's network/type via `db.cardById.get(held.card_id)?.card_type`. Business cards from most issuers don't count toward 5/24 (some flagged exceptions); the issuer rules JSON includes which cards count via the `applies_to` field.
- Once-per-lifetime: check if `wallet` contains a card with the same `card_id` and `bonus_received: true`.
- Tests run with Vitest. Add Vitest as a devDep and an `npm run test` script if not already there.

## Do Not Change

- `app/**` — no UI yet
- `components/**` — EligibilityChip already accepts the right shape
- `lib/data/**`, `scripts/**` — data layer is settled (TASK-01 done)
- `lib/auth/**`, `lib/db.ts`, `middleware.ts` — auth is settled
- `lib/engine/scoring.ts` and `lib/engine/ranking.ts` — these are TASK-03 and TASK-04
- Card markdown files in `cards/` — only edit if you find a real data error

## Acceptance Criteria

- [ ] `npm run typecheck` passes
- [ ] `npm run build` passes (which runs `cards:build` first)
- [ ] `npm run test` passes (after adding Vitest)
- [ ] All five test cases listed in Requirement 5 pass
- [ ] `evaluateEligibility` is a pure function — no I/O, no `Date.now()` inside (uses the `today` parameter)
- [ ] `git diff` shows changes only in `lib/engine/eligibility.ts`, `lib/engine/types.ts`, `tests/engine/eligibility.test.ts`, `package.json` (vitest dep + script), `vitest.config.ts` if needed

## Verification

1. `npm run typecheck && npm run build && npm run test`
2. Manually score Chase Sapphire Preferred against a fixture wallet at 4/24 — expect yellow status, note like "At 4/24 — risky."
3. Tests cover green/yellow/red branches separately.
