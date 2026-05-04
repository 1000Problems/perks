-- 0008_perk_source_flags.sql
-- User reports for bad perk source URLs and stale perks
-- (TASK-perk-source-flags). One open flag per (user, card, perk);
-- refiling overwrites the previous reason/note.
--
-- The cards:check-sources validator catches HTTP failures
-- proactively. Flags catch the case the validator can't see — URL
-- still 200s but the page no longer matches what we render.
--
-- Triage flow: team uses npm run flags:list / flags:resolve to walk
-- open issues. After fixing the markdown, resolve the open flags
-- with a resolution_note describing the fix.

create type perk_flag_reason as enum (
  'link_broken',
  'info_outdated',
  'perk_removed',
  'other'
);

create table perks_source_flags (
  user_id uuid not null references perks_users(id) on delete cascade,
  card_id text not null,
  perk_kind text not null check (perk_kind in ('annual_credit', 'ongoing_perk')),
  perk_name text not null,
  reason perk_flag_reason not null,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  resolved_at timestamptz,
  resolution_note text,
  primary key (user_id, card_id, perk_name)
);

-- Partial index over open flags only — supports the most common
-- queries: "list open flags on this card" and "count open flags on
-- this perk." Resolved flags are not indexed; they're only read by
-- the resolution-history backfill (which doesn't exist yet).
create index perks_source_flags_open_idx
  on perks_source_flags(card_id, perk_name)
  where resolved_at is null;

-- set_updated_at() trigger function established in earlier migration.
create trigger trg_perks_source_flags_updated
  before update on perks_source_flags
  for each row execute function set_updated_at();
