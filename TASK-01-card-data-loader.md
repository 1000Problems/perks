# TASK: Card data loader with Zod validation

> Replace the hand-written stub data with a real JSON loader that validates incoming research data against Zod schemas at app startup.

## Context

Scaffolding ships with `lib/data/stub.ts` containing 3 wallet cards and 5 recommendation cards as plain TypeScript. The research pass produces real JSON files under `data/`. We want a single loader the rest of the app imports from, with Zod validation that fails loudly if the JSON is malformed. The engine (built in later tasks) consumes a validated `CardDatabase` object; it never touches raw JSON.

## Requirements

1. Define Zod schemas in `lib/data/schema.ts` for every JSON file produced by `RESEARCH_PROMPT_FOR_CODE.md`: `cards.json`, `programs.json`, `issuer_rules.json`, `perks_dedup.json`, `destination_perks.json`.
2. Create `lib/data/loader.ts` that reads each file at module load, parses with the schema, and exports a typed `CardDatabase` object combining all five.
3. Update `lib/data/types.ts` to derive types from the Zod schemas using `z.infer<>` rather than redeclaring them.
4. Update `lib/data/stub.ts` to re-export from `loader.ts` if the JSON files exist; otherwise keep its current hand-written values as fallback (so the app still runs before the research pass completes).
5. If validation fails, throw with a clear message naming the file and the path within it that broke.

## Implementation Notes

- Read the JSON files using `import` statements with the `with { type: "json" }` attribute (Next 15 + TS 5.6 supports this), not `fs.readFile` — the loader runs at module load time, not request time.
- Schemas should mirror the shape described in `RESEARCH_PROMPT_FOR_CODE.md` exactly. If a field there is `string | null`, the schema is `z.string().nullable()`.
- For unions like `value: number | "unlocks"` in `NewPerk`, use `z.union([z.number(), z.literal("unlocks")])`.
- Keep `lib/data/types.ts` as the single source of truth for types. Components import types from there, not from `schema.ts`.
- The `WALLET_BEST_RATES` derivation currently in `stub.ts` is a per-user computation, not a database property. Move it to `lib/engine/wallet.ts` (a stub file you'll fill in TASK-03). For now the rec page still uses the value from stub, so leave the export accessible.
- Sample expected schema for cards (illustrative, not complete):
  ```ts
  const Card = z.object({
    id: z.string(),
    name: z.string(),
    issuer: z.string(),
    network: z.string(),
    card_type: z.enum(["personal", "business"]),
    annual_fee_usd: z.number(),
    earning: z.array(EarningRule),
    signup_bonus: SignupBonus,
    annual_credits: z.array(AnnualCredit),
    // ... see RESEARCH_PROMPT_FOR_CODE.md for full shape
  });
  ```

## Do Not Change

- `app/**` — no UI changes in this task
- `components/**` — no component changes
- `lib/supabase/**`, `lib/auth/**`, `middleware.ts` — auth is settled
- `lib/engine/**` — engine is built in later tasks
- `package.json` — no new dependencies; Zod is already installed

## Acceptance Criteria

- [ ] `npm run typecheck` passes with zero errors
- [ ] `npm run build` passes with zero errors
- [ ] If `data/cards.json` is missing or malformed, the build fails with a Zod error that names the file and the bad field
- [ ] If `data/cards.json` is present and valid, `import { CARDS } from "@/lib/data/loader"` returns a typed array
- [ ] `lib/data/stub.ts` still exports `SPEND_CATEGORIES`, `WALLET_CARDS`, `RECOMMEND_CARDS`, `WALLET_BEST_RATES` so the rec panel keeps working
- [ ] `git diff` shows changes only in `lib/data/**`

## Verification

1. `npm run typecheck`
2. `npm run build`
3. Visit `/recommendations` in dev — page renders with the same content as before
4. Temporarily corrupt `data/cards.json` (rename a required field) and confirm the build fails with a useful error
