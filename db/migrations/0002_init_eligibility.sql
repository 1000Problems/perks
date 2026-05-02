-- 0002_init_eligibility.sql
-- Issuer rules, card-specific overrides, product families, prequal,
-- credit-score floors, and other eligibility metadata.

create type rule_type as enum (
  'x_in_y', 'max_apps_per_period', 'max_open_cards_with_issuer',
  'once_per_lifetime', 'once_per_product_family', 'velocity_2_3_4',
  'credit_score_floor', 'invite_only', 'existing_relationship_required',
  'informal'
);

create type verdict as enum ('green', 'yellow', 'red');

create type rule_severity as enum ('block', 'warn', 'inform');

-- ── Issuer rules (one row per named rule) ──────────────────────────────

create table issuer_rules (
  id text primary key,
  issuer_id text not null references issuers(id) on delete cascade,
  display_name text not null,
  rule_type rule_type not null,
  severity rule_severity not null default 'block',
  description text,
  config jsonb not null default '{}'::jsonb,
  data_freshness date,
  last_verified date default current_date,
  sources jsonb not null default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint issuer_rule_config_shape check (
    case rule_type
      when 'x_in_y' then
        config ? 'limit' and config ? 'window_months' and
        config ? 'counts' and config ? 'scope'
      when 'max_apps_per_period' then
        config ? 'limit' and config ? 'scope'
      when 'once_per_product_family' then
        config ? 'family' and config ? 'lookback_months'
      else true
    end
  )
);

create trigger trg_issuer_rules_updated before update on issuer_rules
  for each row execute function set_updated_at();

-- ── Card → rule references (which rules apply to which cards) ──────────

create table card_rule_refs (
  card_id text not null references cards(id) on delete cascade,
  rule_id text not null references issuer_rules(id) on delete cascade,
  notes text,
  primary key (card_id, rule_id)
);

create index card_rule_refs_card_idx on card_rule_refs(card_id);

-- ── Card-specific rules (overrides + per-card-only rules) ──────────────

create table card_specific_rules (
  id bigserial primary key,
  card_id text not null references cards(id) on delete cascade,
  rule_type rule_type not null,
  severity rule_severity not null default 'block',
  description text,
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint card_specific_rule_config_shape check (
    case rule_type
      when 'x_in_y' then
        config ? 'limit' and config ? 'window_months' and
        config ? 'counts' and config ? 'scope'
      when 'max_apps_per_period' then
        config ? 'limit' and config ? 'scope'
      when 'once_per_product_family' then
        config ? 'family' and config ? 'lookback_months'
      else true
    end
  )
);

create index card_specific_rules_card_idx on card_specific_rules(card_id);
create trigger trg_card_specific_rules_updated before update on card_specific_rules
  for each row execute function set_updated_at();

-- ── Product families ───────────────────────────────────────────────────

create table product_families (
  id text primary key,
  display_name text not null,
  description text
);

create table product_family_members (
  family_id text not null references product_families(id) on delete cascade,
  card_id text not null references cards(id) on delete cascade,
  primary key (family_id, card_id)
);

-- ── Card credit-score floors ───────────────────────────────────────────

create table card_credit_score (
  card_id text primary key references cards(id) on delete cascade,
  band credit_score_band not null default 'unknown',
  notes text
);

-- ── Card membership requirements ───────────────────────────────────────

create table card_membership_requirements (
  card_id text not null references cards(id) on delete cascade,
  membership_key text not null,
  required boolean not null default true,
  notes text,
  primary key (card_id, membership_key)
);

-- ── Card business requirements ─────────────────────────────────────────

create table card_business_requirements (
  card_id text primary key references cards(id) on delete cascade,
  needs_business_income boolean not null default true,
  notes text
);

-- ── Card invite pathways ───────────────────────────────────────────────

create table card_invite_pathways (
  card_id text not null references cards(id) on delete cascade,
  pathway text not null,
  notes text,
  primary key (card_id, pathway)
);

-- ── Card prequal availability ──────────────────────────────────────────

create table card_prequal (
  card_id text primary key references cards(id) on delete cascade,
  url text,
  soft_pull boolean default true,
  notes text
);

-- ── Card geographic restrictions ───────────────────────────────────────

create table card_geographic_restrictions (
  card_id text not null references cards(id) on delete cascade,
  restriction_kind text not null,
  details text,
  primary key (card_id, restriction_kind)
);
