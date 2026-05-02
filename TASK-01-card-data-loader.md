# TASK 01: Card data loader — DONE

**Status:** Complete. This file is kept for historical context. No work to do here.

## Summary of what's in place

The original plan was for Code to write Zod schemas and a JSON loader. That work was completed before the handoff. Specifically:

- **Source of truth:** `cards/{card_id}.md` markdown files. Each contains six labeled JSON fenced blocks (`cards.json entry`, `programs.json entry`, `issuer_rules.json entry`, `perks_dedup.json entries`, `destination_perks.json entries`) plus a free-form research notes section.
- **Compiler:** `scripts/build-card-db.ts` (run via `tsx`). Globs `cards/*.md`, validates each block with Zod, merges with anchor-card semantics, writes `data/*.json` and regenerates the `## Completed` section of `cards/AllCards.md`.
- **Schemas:** `scripts/lib/schemas.ts`. Imported by both the compiler and the runtime loader. Lenient on `null` for optional fields.
- **Runtime loader:** `lib/data/loader.ts`. `loadCardDatabase()` reads `data/*.json`, re-validates with Zod, returns a typed `CardDatabase` object with O(1) lookup maps (`cardById`, `programById`, `issuerRulesByIssuer`). Cached in module scope.
- **Auto-build hooks:** `npm run dev` and `npm run build` invoke `npm run cards:build` first via `predev` and `prebuild`. `data/` is gitignored.

## What this means for downstream tasks

Wherever a later task says "load the card database" or "use cards.json," do this:

```ts
import { loadCardDatabase } from "@/lib/data/loader";
import type { Card, Program } from "@/lib/data/loader";

const db = loadCardDatabase();
const csp = db.cardById.get("chase_sapphire_preferred");
```

If the engine needs a field that isn't in the schema, follow this order:
1. Add the field to `scripts/lib/schemas.ts`
2. Add the field to whichever card markdown files need it
3. Run `npm run cards:build`
4. Run `npm run typecheck`

Do not write to `data/*.json` directly — those files are generated.

## What's NOT covered by this task

- Spend categories (`SPEND_CATEGORIES` constant) live in `lib/data/stub.ts` — those are app-domain values, not card-database values, and stay there. TASK-06 may relocate them to `lib/categories.ts` if convenient.
- The user's wallet (held cards) is a profile concern, not a database concern. Profile data lives in Postgres via `lib/profile/*` (created in TASK-05).
