-- 0001_init_catalog.sql
-- Catalog tables: issuers, networks, programs, transfer_partners,
-- sweet_spots, destinations, cards, plus card-* child tables.
-- No RLS; queries are scoped server-side per session.

-- ── Enums ──────────────────────────────────────────────────────────────

create type card_type as enum ('personal', 'business', 'secured', 'student');

create type program_type as enum (
  'transferable', 'cobrand_airline', 'cobrand_hotel', 'fixed_value',
  'luxury_hotel', 'dining', 'lounge_network', 'entertainment', 'advisor'
);

create type credit_score_band as enum (
  'building', 'fair', 'good', 'very_good', 'excellent', 'unknown'
);

create type credit_period as enum (
  'calendar_year', 'anniversary_year', 'monthly', 'quarterly',
  'split_h1_h2', 'every_4_years', 'every_5_years'
);

-- ── Trigger: keep updated_at fresh ─────────────────────────────────────

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ── Issuers ────────────────────────────────────────────────────────────

create table issuers (
  id text primary key,
  display_name text not null,
  brand_color text,
  data_freshness date,
  last_verified date default current_date,
  sources jsonb not null default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger trg_issuers_updated before update on issuers
  for each row execute function set_updated_at();

-- ── Networks ───────────────────────────────────────────────────────────

create table networks (
  id text primary key,
  display_name text not null,
  extends_network_id text references networks(id),
  concierge_phone text,
  data_freshness date,
  last_verified date default current_date,
  sources jsonb not null default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger trg_networks_updated before update on networks
  for each row execute function set_updated_at();

-- ── Programs ───────────────────────────────────────────────────────────

create table programs (
  id text primary key,
  display_name text not null,
  type program_type not null,
  issuer_id text references issuers(id),
  fixed_redemption_cpp numeric(5,3),
  portal_redemption_cpp numeric(5,3),
  portal_redemption_cpp_notes text,
  property_count_approx integer,
  booking_channel_url text,
  min_nights smallint,
  config jsonb not null default '{}'::jsonb,
  data_freshness date,
  last_verified date default current_date,
  sources jsonb not null default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger trg_programs_updated before update on programs
  for each row execute function set_updated_at();

-- ── Transfer partners ──────────────────────────────────────────────────

create table transfer_partners (
  id text primary key,
  display_name text not null,
  partner_type text not null check (partner_type in ('airline', 'hotel', 'other')),
  data_freshness date,
  last_verified date default current_date,
  sources jsonb not null default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger trg_transfer_partners_updated before update on transfer_partners
  for each row execute function set_updated_at();

-- ── Program ↔ Transfer partner join ────────────────────────────────────

create table program_transfer_partners (
  program_id text not null references programs(id) on delete cascade,
  partner_id text not null references transfer_partners(id) on delete cascade,
  ratio_in smallint not null default 1,
  ratio_out smallint not null default 1,
  transfer_time text,
  fuel_surcharge_risk text,
  notes text,
  sweet_spots text[] not null default '{}',
  primary key (program_id, partner_id)
);

-- ── Sweet spots (controlled vocab) ─────────────────────────────────────

create table sweet_spots (
  id text primary key,
  description text not null,
  value_estimate_usd numeric(7,2),
  source text
);

-- ── Destinations + relevance ───────────────────────────────────────────

create table destinations (
  id text primary key,
  display_name text not null,
  region text
);

create table destination_relevance (
  destination_id text not null references destinations(id) on delete cascade,
  applies_to_type text not null check (applies_to_type in ('card', 'program', 'transfer_partner')),
  applies_to_id text not null,
  relevance_score smallint not null default 1,
  notes text,
  primary key (destination_id, applies_to_type, applies_to_id)
);

-- ── Cards ──────────────────────────────────────────────────────────────

create table cards (
  id text primary key,
  display_name text not null,
  issuer_id text not null references issuers(id),
  network_id text references networks(id),
  card_type card_type not null,
  annual_fee_usd numeric(7,2),
  annual_fee_first_year_waived boolean default false,
  foreign_tx_fee_pct numeric(5,3),
  credit_score_required text,
  currency_earned text references programs(id),
  membership_required text,
  co_brand_partner text,
  closed_to_new_apps boolean default false,
  recently_changed boolean default false,
  breakeven_logic_notes text,
  data_freshness date,
  last_verified date default current_date,
  sources jsonb not null default '[]'::jsonb,
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger trg_cards_updated before update on cards
  for each row execute function set_updated_at();

create index cards_issuer_idx on cards(issuer_id);
create index cards_network_idx on cards(network_id);
create index cards_currency_idx on cards(currency_earned);

-- ── Card child tables ──────────────────────────────────────────────────

create table card_categories (
  card_id text not null references cards(id) on delete cascade,
  category text not null,
  primary key (card_id, category)
);

create table card_earning (
  id bigserial primary key,
  card_id text not null references cards(id) on delete cascade,
  category text not null,
  rate_pts_per_dollar numeric(5,2),
  cap_usd_per_year numeric(10,2),
  notes text
);

create index card_earning_card_idx on card_earning(card_id);

create table card_signup_bonuses (
  id bigserial primary key,
  card_id text not null references cards(id) on delete cascade,
  amount_pts numeric(10,2),
  spend_required_usd numeric(10,2),
  spend_window_months smallint,
  estimated_value_usd numeric(10,2),
  notes text,
  effective_from date,
  effective_to date
  -- `is_current` was originally a generated stored column using
  -- current_date, but Postgres requires generated stored expressions to
  -- be IMMUTABLE and current_date is STABLE. Callers compute the flag
  -- on read (effective_to is null or effective_to > current_date).
);

create index card_signup_bonuses_card_idx on card_signup_bonuses(card_id);

create table card_annual_credits (
  id bigserial primary key,
  card_id text not null references cards(id) on delete cascade,
  name text not null,
  face_value_usd numeric(7,2),
  realistic_redemption_pct numeric(3,2),
  realistic_value_usd numeric(7,2) generated always as
    (face_value_usd * realistic_redemption_pct) stored,
  ease_score smallint check (ease_score between 1 and 5),
  period credit_period,
  enrollment_required boolean,
  qualifying_purchases_open_ended boolean,
  expires_if_unused boolean default true,
  stackable_with_other_credits boolean default false,
  qualifying_spend text,
  notes text
);

create index card_annual_credits_card_idx on card_annual_credits(card_id);

create table card_program_access (
  card_id text not null references cards(id) on delete cascade,
  program_id text not null references programs(id) on delete cascade,
  access_kind text,
  overrides jsonb not null default '{}'::jsonb,
  notes text,
  primary key (card_id, program_id)
);

create index card_program_access_card_idx on card_program_access(card_id);
create index card_program_access_program_idx on card_program_access(program_id);

create table card_co_brand_perks (
  id bigserial primary key,
  card_id text not null references cards(id) on delete cascade,
  perk_kind text not null,
  config jsonb not null default '{}'::jsonb,
  notes text
);

create index card_co_brand_perks_card_idx on card_co_brand_perks(card_id);

create table card_insurance (
  id bigserial primary key,
  card_id text not null references cards(id) on delete cascade,
  coverage_kind text not null,
  config jsonb not null default '{}'::jsonb,
  primary_source_url text
);

create unique index card_insurance_kind_uniq on card_insurance(card_id, coverage_kind);

create table card_absent_perks (
  card_id text not null references cards(id) on delete cascade,
  perk_key text not null,
  reason text,
  workaround text,
  primary key (card_id, perk_key)
);

-- ── Perks dedup taxonomy ───────────────────────────────────────────────

create table perks_dedup (
  id text primary key,
  display_name text not null,
  category text,
  description text
);

-- ── Network default perks (resolution helper for soul §2.8) ────────────

create table network_default_perks (
  id bigserial primary key,
  network_id text not null references networks(id) on delete cascade,
  perk_kind text not null,
  config jsonb not null default '{}'::jsonb,
  notes text
);

create index network_default_perks_network_idx on network_default_perks(network_id);
