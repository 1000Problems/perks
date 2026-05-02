# perks

Credit card recommendation engine. Tells users the single best next card to add to their wallet given how they actually spend.

## Stack

Next.js 15 (App Router) · TypeScript · Tailwind · Postgres (Neon) · Vercel.

See `ARCHITECTURE.md` for the full architecture and `DESIGN_BRIEF_FOR_CLAUDE_DESIGNER.md` for the design intent.

## Local development

```bash
npm install
cp .env.local.example .env.local
# fill in DATABASE_URL with the pooled Neon connection string
npm run dev
```

Open http://localhost:3000.

## Database setup (one-time)

The auth and profile tables are namespaced with `perks_` so the project can share a Postgres instance with other apps. Run this SQL once against your Neon database (Neon dashboard → SQL Editor, or psql):

```sql
create table if not exists perks_users (
  id uuid primary key default gen_random_uuid(),
  account text unique not null,
  password_hash text not null,
  created_at timestamptz not null default now()
);

create table if not exists perks_sessions (
  id text primary key,
  user_id uuid not null references perks_users(id) on delete cascade,
  expires_at timestamptz not null
);

create index if not exists perks_sessions_user_id_idx on perks_sessions(user_id);

create table if not exists perks_profiles (
  user_id uuid primary key references perks_users(id) on delete cascade,
  spend_profile jsonb not null default '{}'::jsonb,
  brands_used jsonb not null default '[]'::jsonb,
  cards_held jsonb not null default '[]'::jsonb,
  trips_planned jsonb not null default '[]'::jsonb,
  preferences jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

The auth flow uses an "account name + password" UX. Account names are stored literally — letters, numbers, dots, dashes, underscores, 3-64 chars. Passwords are hashed with Node's built-in scrypt (no native bindings, runs anywhere). Sessions are random 32-byte tokens; only the SHA-256 hash is stored in `perks_sessions`, so a leaked snapshot of that table can't be used to impersonate users. Default session lifetime is 30 days.

## Environment

- `DATABASE_URL` — the pooled Neon connection string (must end with `?sslmode=require`). Set in `.env.local` for dev and in the Vercel project's environment variables for production.

That's the only env var the app needs in this stage.

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
  auth/                   AuthShell, AuthForm
lib/
  auth/                   Server actions, session, password hashing
  data/                   Card database loader + types
  engine/                 Recommendation engine (pure TS, runs in browser)
  utils/                  Formatters, helpers
  db.ts                   Postgres client
data/                     Static card JSON (filled by research pass)
```

## Status

Scaffolding plus auth working end to end against Neon Postgres. The recommendation engine, profile persistence, and the full card database are TASK files for Claude Code, written after the research pass completes.
