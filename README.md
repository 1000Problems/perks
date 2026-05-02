# perks

Credit card recommendation engine. Tells users the single best next card to add to their wallet given how they actually spend.

## Stack

Next.js 15 (App Router) · TypeScript · Tailwind · Supabase · Vercel.

See `ARCHITECTURE.md` for the full architecture and `DESIGN_BRIEF_FOR_CLAUDE_DESIGNER.md` for the design intent.

## Local development

```bash
npm install
cp .env.local.example .env.local
# fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
npm run dev
```

Open http://localhost:3000.

## Folder layout

```
app/                      Next.js App Router
  (marketing)/            Public landing pages
  (app)/                  Auth-gated app routes
    recommendations/      Hero — top 5 cards to add
    onboarding/           Spend profile, brands, cards
    trips/                Trip planner
  login/, signup/         Auth pages
components/
  perks/                  Visual primitives (CardArt, EligibilityChip, etc.)
  recommender/            Rec panel and its parts
lib/
  data/                   Card database loader + types
  engine/                 Recommendation engine (pure TS, runs in browser)
  supabase/               Auth + DB clients
  utils/                  Formatters, helpers
data/                     Static card JSON (filled by research pass)
```

## Status

Scaffolding only. The recommendation engine, Supabase persistence, and the full card database are TASK files for Claude Code, written after the research pass completes.
