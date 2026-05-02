-- 0003_init_user_state.sql
-- Adds relational user-state tables alongside the existing perks_profiles row.
-- perks_profiles.cards_held (jsonb) is preserved as-is and remains a
-- transitional source of truth for user-held cards. New code dual-writes to
-- both during the cutover; the read flip happens via the
-- CARDS_HELD_READ_SOURCE env flag once parity has held for one release.

create type user_card_status as enum ('held', 'closed_in_past_year', 'closed_long_ago');

-- ── User cards (relational replacement for cards_held jsonb) ───────────

create table user_cards (
  id bigserial primary key,
  user_id uuid not null references perks_users(id) on delete cascade,
  card_id text not null references cards(id),
  status user_card_status not null default 'held',
  opened_at date,
  closed_at date,
  bonus_received boolean not null default false,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create unique index user_cards_user_card_uniq on user_cards(user_id, card_id);
create index user_cards_user_status_idx on user_cards(user_id, status);
create trigger trg_user_cards_updated before update on user_cards
  for each row execute function set_updated_at();

-- ── User self-reported facts (credit band, household, etc.) ────────────

create table user_self_reported (
  user_id uuid primary key references perks_users(id) on delete cascade,
  credit_score_band credit_score_band default 'unknown',
  household_income_band text,
  has_business_income boolean,
  age_band text,
  state_code text,
  notes text,
  updated_at timestamptz default now()
);

create trigger trg_user_self_reported_updated before update on user_self_reported
  for each row execute function set_updated_at();

-- ── User memberships (military, costco, prime, etc.) ───────────────────

create table user_memberships (
  user_id uuid not null references perks_users(id) on delete cascade,
  membership_key text not null,
  active boolean not null default true,
  notes text,
  updated_at timestamptz default now(),
  primary key (user_id, membership_key)
);

-- ── User brokerage assets (Schwab/MS/Bilt status; affects Plat tiers) ──

create table user_brokerage_assets (
  user_id uuid not null references perks_users(id) on delete cascade,
  brokerage text not null,
  asset_band text,
  status_tier text,
  updated_at timestamptz default now(),
  primary key (user_id, brokerage)
);

-- ── User existing-status flags (NFCU, USAA, Bilt, etc.) ────────────────

create table user_existing_status (
  user_id uuid not null references perks_users(id) on delete cascade,
  status_key text not null,
  active boolean not null default true,
  notes text,
  updated_at timestamptz default now(),
  primary key (user_id, status_key)
);
