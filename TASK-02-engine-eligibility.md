# TASK: Eligibility engine

> Pure function that decides whether a user is eligible for a given card based on their wallet history and the card's issuer rules.

## Context

Issuer application rules are real friction. Chase 5/24 denies applications when 5+ new accounts opened in 24 months. Amex once-per-lifetime locks out the SUB if you've held that exact product before. Citi 8/65/95 limits ThankYou family applications. We need to compute eligibility from the user's `cards_held` history and the rules in `data/issuer_rules.json`. The recommendation panel already renders an `EligibilityChip` (green/yellow/red) for each card — the engine fills in the actual status.

## Requirements

1. Create `lib/engine/eligibility.ts` exporting one pure function:
   ```ts
   export function evaluateEligibility(
     card: Card,
     wallet: WalletCardHeld[],
     rules: IssuerRules,
     today: Date,
   ): { status: "green" | "yellow" | "red"; note: string };
   ```
2. Implement at minimum: Chase 5/24, Amex once-per-lifetime per product, Citi 8/65/95 family rules, Capital One 1-per-month, Bank of America 2/3/4 and 7/12.
3. Return a one-line `note` suitable for the EligibilityChip — `"Eligible · 2/24"`, `"At 4/24 — risky"`, `"Once-per-lifetime risk — verify"`, `"Business card — needs business income"`.
4. Yellow status is for borderline cases (e.g., 4/24 on a Chase card, ambiguous Amex SUB clawback window). Red is for definite denials. Green is the default when no rule applies negatively.
5. Add unit tests in `tests/engine/eligibility.test.ts` covering: clean wallet, 4/24 Chase yellow, 5/24 Chase red, Amex held-before red, business card flag yellow.

## Implementation Notes

- Pure function. No imports from `lib/supabase/**`, `next/**`, or any Node-only API.
- Inputs are plain data: a card record, an array of held cards each with `issuer`, `name`, `opened_at` (ISO date), `bonus_received`, and the rules object loaded by TASK-01.
- The `today` parameter is for testability — production callers pass `new Date()`, tests pass fixed dates.
- 5/24 logic: count personal-network cards opened by the user in the last 24 months. Business cards from Chase, Amex, Citi, Cap One generally don't count toward 5/24 (some flagged exceptions). Treat the rules JSON as authoritative — `data/issuer_rules.json` includes which cards count.
- Once-per-lifetime: check if `wallet` contains a card with the same `id` and `bonus_received: true`.
- Use Zod-derived types from `lib/data/types.ts`. Don't redefine.
- Tests run with whatever runner Code picks — Vitest preferred, suggest adding it to devDeps in this task. If Vitest is added, also add an `npm run test` script.

## Do Not Change

- `app/**` — no UI yet
- `components/**` — EligibilityChip already accepts the right shape
- `lib/data/**` — TASK-01 owns the schemas
- `lib/supabase/**`, `lib/auth/**` — settled
- `lib/engine/scoring.ts` and `ranking.ts` — these are TASK-03 and TASK-04

## Acceptance Criteria

- [ ] `npm run typecheck` passes
- [ ] `npm run build` passes
- [ ] `npm run test` passes (after adding Vitest)
- [ ] All five test cases listed in Requirement 5 pass
- [ ] `evaluateEligibility` is a pure function — no I/O, no `Date.now()` inside (uses the `today` parameter)
- [ ] `git diff` shows changes only in `lib/engine/eligibility.ts`, `tests/engine/eligibility.test.ts`, `package.json` (vitest dep + script), `vitest.config.ts` if needed

## Verification

1. `npm run typecheck && npm run build && npm run test`
2. Inspect a sample call manually in a REPL or scratch file — output matches expectations for a Chase Sapphire Preferred against a wallet at 4/24
3. Tests cover green/yellow/red branches separately
