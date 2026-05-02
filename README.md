# perks

Credit card recommendation engine. Tells users the single best next card to add to their wallet given how they actually spend.

## Stack

Next.js 15 (App Router) · TypeScript · Tailwind · Supabase · Vercel.

See `docs/ARCHITECTURE.md` for the full architecture and `docs/DESIGN_BRIEF.md` for the design intent.

## Local development

```bash
npm install
cp .env.local.example .env.local
# fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
npm run dev
```

Open http://localhost:3000.

## Supabase setup (one-time)

In your Supabase project dashboard:

1. **Authentication → Providers → Email**: turn off "Confirm email." We don't verify emails for v1.
2. **SQL Editor**: run the snippet below to create the `profiles` table and lock it down with row-level security so each user can only read/write their own row.

```sql
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  spend_profile jsonb not null default '{}'::jsonb,
  brands_used jsonb not null default '[]'::jsonb,
  cards_held jsonb not null default '[]'::jsonb,
  trips_planned jsonb not null default '[]'::jsonb,
  preferences jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "users can read own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

create policy "users can update own profile" on public.profiles
  for update using (auth.uid() = id);
```

The auth flow uses "account name + password" UX. The user types `bob123`; we store it as `bob123@perks.local` in Supabase. Invisible to the user. If they type something email-shaped (`bob@gmail.com`), it's used as-is.

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
