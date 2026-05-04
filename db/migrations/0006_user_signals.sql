-- 0006_user_signals.sql
-- Phase 3 of signal-first architecture (TASK-signals-catalog-phase3.md).
--
-- Global per-user signal table: one row per (user, signal) regardless
-- of which card revealed it. Phase 1 catalog (signals/*.md) defines the
-- valid signal_id values; the build script enforces references at
-- compile time, so we don't add a foreign key here (signals are static
-- markdown, not a DB table).
--
-- Dual-write target through Phase 4: writes happen alongside
-- user_card_play_state. After Phase 4 cutover, user_card_play_state
-- keeps claimed_at / notes for per-card calendar facts only; the state
-- field becomes deprecated.

create type signal_state as enum ('confirmed', 'interested', 'dismissed');

create table perks_user_signals (
  user_id uuid not null references perks_users(id) on delete cascade,
  signal_id text not null,
  state signal_state not null,
  -- Traceability: which card+play caused the most recent write. Helps
  -- explain "where did this fact come from?" in the future signals
  -- dashboard. Both nullable to leave room for non-play sources later
  -- (auto-confirmed holdings, system-derived intents from trips_planned).
  source_card_id text,
  source_play_id text,
  recorded_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, signal_id)
);

create index perks_user_signals_user_idx
  on perks_user_signals(user_id);

-- set_updated_at() trigger function established in earlier migration.
create trigger trg_perks_user_signals_updated
  before update on perks_user_signals
  for each row execute function set_updated_at();
