# TASK: Server-side rules engine — eligibility evaluator over catalog + user state

> Replace the in-engine `lib/engine/eligibility.ts` with a catalog-driven evaluator that reads `issuer_rules`, `card_specific_rules`, `card_rule_refs`, `product_families`, and the relational `user_cards` + `user_self_reported` tables, and emits `{verdict: green|yellow|red, reasons: Reason[]}` per card. Pure function over an explicit context — DB access happens in a thin loader that wraps the function.

## Context

Today's eligibility lives in `lib/engine/eligibility.ts` and runs in the browser against `db.issuerRulesByIssuer` plus the `cards_held` JSONB. It hard-codes Chase 5/24, Amex once-per-lifetime, Citi 8/65/95, Capital One 1-per-month, BoA 2/3/4, and the Sapphire 48-month rule as TypeScript switch arms. Adding a new rule means a code change.

`TASK-db-schema-foundation` defined a generalized rules schema — `rule_type` enum, JSONB `config`, CHECK constraints enforcing the discriminated union, `card_rule_refs` linking cards to issuer rules, `card_specific_rules` for per-card overrides, `product_families` for once-per-family logic. The data shape is built; nothing reads from it yet.

This TASK builds the evaluator. It is **server-side** (per the schema TASK's locked decision) because the rules will eventually need to query things that aren't in the browser bundle (large card-history tables, future credit-bureau-style integrations). The browser keeps a stale view; the server is the truth.

The evaluator stays pure. DB access is one input — the loader fetches the user's state and the relevant rule rows, packs them into a `RulesContext`, and hands the context to the evaluator. The evaluator never touches the DB.

## Requirements

1. **Define the context shape.**
   Create `lib/rules/types.ts` exporting:
   ```ts
   export type Verdict = "green" | "yellow" | "red";

   export interface Reason {
     rule_id: string;             // matches issuer_rules.id or card_specific_rules.id
     rule_type: RuleType;         // enum from schema
     severity: "block" | "warn" | "inform";
     message: string;             // human-readable, one line, for the EligibilityChip
     evidence: Record<string, unknown>; // structured backing — counts, dates, family members
   }

   export interface RulesContext {
     today: Date;
     card: CardRow;               // the card we're evaluating
     user_state: UserStateSnapshot;
     applicable_rules: RuleRow[]; // pre-filtered: only rules that reference this card or its issuer
     product_family: ProductFamilyRow | null;
   }

   export interface UserStateSnapshot {
     user_cards: UserCardRow[];   // held + closed_in_past_year + closed_long_ago
     self_reported: UserSelfReportedRow | null; // credit score band, household income, etc.
     memberships: UserMembershipRow[];
     existing_status: UserExistingStatusRow[];  // brokerage tier, military, etc.
   }
   ```

2. **Implement the pure evaluator.**
   Create `lib/rules/evaluate.ts` exporting:
   ```ts
   export function evaluate(ctx: RulesContext): { verdict: Verdict; reasons: Reason[] };
   ```
   For every rule in `ctx.applicable_rules`, dispatch on `rule_type` and produce zero or more `Reason` rows. Aggregate verdict: `red` if any reason has `severity='block'`, `yellow` if any `severity='warn'`, `green` otherwise.

3. **Implement at minimum every `rule_type` enum variant.**
   - `x_in_y` — count cards in `ctx.user_state.user_cards` matching the rule's `scope` (e.g., "personal_credit_cards") opened within `window_months`. Compare to `limit`. At limit → red. At limit−1 → yellow with a note.
   - `max_apps_per_period` — same shape, scoped to applications (any card open in the period regardless of issuer or held/closed status).
   - `max_open_cards_with_issuer` — count `held` cards from `ctx.card.issuer_id`. At limit → red.
   - `once_per_lifetime` — held or closed-in-past-year on the same `cards.id` → red. Closed-long-ago → green for SUB-eligibility purposes (Amex relaxed this in 2023; rule config should encode the effective policy).
   - `once_per_product_family` — read `ctx.product_family`. If any member with the same `family_id` was opened within the rule's `lookback_months` → red. Self-evidence: a Sapphire Reserve in the wallet blocks a Sapphire Preferred SUB.
   - `velocity_2_3_4` — BoA's pattern: max 2 BoA cards per 2 months, 3 per 12 months, 4 per 24 months. Encoded as three overlapping `x_in_y` configs in the rule's JSONB; evaluate each.
   - `credit_score_floor` — read `ctx.user_state.self_reported?.credit_score_band`. If below the floor → yellow with a note ("Reported credit band is `fair`; this card typically requires `excellent`"). Never red — a self-reported band is too soft to block on.
   - `invite_only` — yellow with the message "Invite-only — apply via [pathway]" pulled from `card_invite_pathways`. Never block. The user may have an invite we don't see.
   - `existing_relationship_required` — read `ctx.user_state.memberships` and `ctx.user_state.existing_status`. If the required membership is present → green. If not → red with the specific membership the user lacks.
   - `informal` — yellow informational only, message from the rule's config. Never affects verdict on its own.

4. **Build the loader.**
   Create `lib/rules/load.ts` exporting:
   ```ts
   export async function loadRulesContext(opts: {
     userId: string;
     cardId: string;
     today?: Date;
   }): Promise<RulesContext>;
   ```
   Uses `lib/db.ts` (the postgres-js client) to fetch:
   - The card row from `cards`.
   - All `issuer_rules` rows for that card's issuer, joined through `card_rule_refs` to filter to ones that actually apply to this card.
   - All `card_specific_rules` rows for this card.
   - The card's product family (if any) and all members.
   - The user's `user_cards`, `user_self_reported`, `user_memberships`, `user_existing_status`.
   - All in one round-trip when possible (one query with CTEs, or a small batch using `Promise.all`).

5. **Add a batch evaluator.**
   For the rec panel which evaluates dozens of cards at once, expose:
   ```ts
   export async function evaluateBatch(opts: {
     userId: string;
     cardIds: string[];
     today?: Date;
   }): Promise<Record<string, { verdict: Verdict; reasons: Reason[] }>>;
   ```
   Implementation: load user state once, load all candidate cards' rules in one query keyed by `card_id IN (…)`, build a context per card, run the evaluator per card. Don't N+1.

6. **Wire into the rec page (server component).**
   - In `app/(app)/recommendations/page.tsx`, replace the call to `evaluateEligibility` (the in-engine version) with `evaluateBatch`. The verdict + reasons populate `EligibilityChip` props.
   - The in-engine `lib/engine/eligibility.ts` stays around for now as a fallback path — gated by an env flag `RULES_ENGINE=server|client`. Default to `server`. Remove the in-engine path in a follow-on TASK once the server path is verified in production.

7. **Tests.**
   - `tests/rules/evaluate.test.ts` — one test per `rule_type` variant. Pure-function tests; build a `RulesContext` fixture by hand, call `evaluate`, assert verdict + reasons. No DB.
   - `tests/rules/load.test.ts` — integration test: spin up a `pg-mem` (or test container) with the migrations applied, seed a fixture user + a fixture card with rules, call `loadRulesContext`, assert the returned context is shaped correctly.
   - `tests/rules/evaluateBatch.test.ts` — sanity test for the batch path with three cards and a moderately-rich user state.

## Implementation Notes

### Why server-side

Three reasons:
1. **Bundle size.** Shipping all 241 cards' rule rows + every product family + every JSONB rule config to the browser is wasteful when only a few are evaluated per request.
2. **Future-proofing.** Some rules will eventually need data the browser doesn't have (e.g., a soft credit-pull integration, a CardPointers feed of user offers). Putting the evaluator on the server now means no rewrite later.
3. **Truth.** The user can hand-edit `cards_held` in the browser. The verdict the marketing page shows ("you'd be eligible for this") needs to come from the server's view of state, not whatever the client sent up.

### Why pure evaluator + thin loader

Same pattern as the existing engine. Keeps the test surface small. You can hand-craft a `RulesContext` and exercise every `rule_type` variant without ever touching Postgres. The loader is a separate file so its DB queries can be swapped, mocked, or paginated independently.

### Date handling

`today` is injected. The loader passes `new Date()` by default; tests pass fixed dates. No `Date.now()` inside `evaluate`. Time-based comparisons (`window_months`, `lookback_months`) compute the threshold date by subtracting from `today`.

### Severity vs. verdict aggregation

`block` → red. `warn` → yellow. `inform` → green (purely informational). Verdict is the strongest severity present. Always include every reason in the output, even ones below the chosen severity — the UI can render them as detail.

### Once-per-lifetime nuance

The Amex policy as of 2023+ is "once per lifetime per product, but a card closed long ago doesn't count for SUB purposes" — this is the practical reading the community has settled on. Encode it in the rule's JSONB config: `{ "scope": "same_card_id", "exclude_status": ["closed_long_ago"] }`. The evaluator reads the config; the policy can be edited in DB without a code change.

### Product family resolution

`product_families` defines named groups (e.g., `chase_sapphire_family` → Sapphire Preferred + Sapphire Reserve + JPM Reserve; `amex_platinum_family` → consumer Plat + Schwab Plat + Morgan Stanley Plat + Business Plat). `product_family_members` is the junction. The evaluator looks up the family for the candidate card, then checks the user's `user_cards` for any member of that family within the rule's lookback.

### Performance budget

Batch evaluation of 30 candidate cards against a 5-card wallet should complete in <50ms total DB time (one query for user state, one keyed query for rules, all in parallel). The evaluator itself is in-memory and trivial — microseconds. Don't add a cache on day one; add one if metrics show the rec page is bound by rules eval.

### Where the eligibility cache goes

The schema TASK explicitly defers `eligibility_verdicts` (the cache table). Don't build it here. The pure evaluator + batch loader is fast enough for v1; adding caching is a measured optimization, not a default.

## Do Not Change

- `lib/engine/eligibility.ts` — keep functional during the transition. The env flag `RULES_ENGINE` controls which path runs.
- `lib/engine/scoring.ts`, `lib/engine/ranking.ts`, `lib/engine/types.ts` — scoring and ranking are unchanged.
- The catalog and user-state tables — read-only from this TASK.
- `cards/*.md` — markdown is not the source of truth for rules anymore once the migration TASK lands. This TASK reads from DB only.
- `lib/data/loader.ts` — the JSON-loader path stays as a fallback for the rest of the engine.
- `lib/auth/**`, `lib/db.ts`, `middleware.ts` — auth is settled.
- `app/(app)/recommendations/page.tsx` is touched ONLY at the call-site for `evaluateBatch`; no other refactor.

## Acceptance Criteria

- [ ] `lib/rules/types.ts`, `lib/rules/evaluate.ts`, `lib/rules/load.ts` exist with the signatures above.
- [ ] One test per `rule_type` variant passes in `tests/rules/evaluate.test.ts`.
- [ ] `tests/rules/load.test.ts` passes — `loadRulesContext` returns the expected shape against a seeded test DB.
- [ ] `tests/rules/evaluateBatch.test.ts` passes — three cards, mixed verdicts, single round-trip.
- [ ] Rec page renders eligibility chips driven by the server evaluator when `RULES_ENGINE=server` (the default). The in-engine path still works when `RULES_ENGINE=client`.
- [ ] `npm run typecheck && npm run build && npm run test` all pass.
- [ ] Adding a new `issuer_rules` row in DB (e.g., a new Citi velocity rule) is reflected in the next page load — no code change required.
- [ ] `git diff --stat` shows changes only in: `lib/rules/`, `tests/rules/`, `app/(app)/recommendations/page.tsx` (one-line call-site change), `package.json` only if `pg-mem` was added as a devDep.

## Verification

1. With the schema applied, `cards` populated, and a user seeded with three held cards (`chase_sapphire_preferred` opened 6 months ago, `amex_platinum` opened 18 months ago, `capital_one_venture_x` opened 3 months ago):
   - `loadRulesContext({userId, cardId: 'chase_sapphire_reserve'})` returns a context with the Sapphire family rule active.
   - `evaluate(ctx)` returns `red` with a reason citing `once_per_product_family` and the held Sapphire Preferred.
2. Same user, evaluate `chase_freedom_unlimited` — returns `yellow` with a reason citing `5/24` (the user is at 3/24 — close, not over). Adjust the test's `today` so the user is at 5/24, re-evaluate — `red`.
3. Evaluate `centurion_card` — `yellow` with the `invite_only` reason. Never red.
4. Evaluate `usaa_eagle_navigator` for a user with no `user_memberships.usaa_eligible` row — `red` with `existing_relationship_required` reason.
5. Add a new `issuer_rules` row directly via `psql`: a Citi 1-in-48-months rule for the Strata Premier. Without restarting the app, request the rec page — verdict for Strata Premier reflects the new rule. (This is the load-bearing test for the catalog-driven design.)
6. With `RULES_ENGINE=client`, the rec page falls back to the in-engine evaluator and matches its prior behavior. Toggle to `server`, reload — verdicts now come from the new path.
7. Network tab on the rec page: a single round-trip for batch eligibility evaluation, not one per card.

If the verdicts disagree between the in-engine and server paths for any card with rules expressible in both systems, that's a data or evaluator bug — surface it before declaring the task complete.
