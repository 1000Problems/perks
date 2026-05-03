-- 0005_wallet_v2.sql
-- Extends user_cards with rich per-card signals captured by the
-- /wallet/edit redesign. All columns are nullable for backward compat —
-- existing reads of user_cards continue to work; old onboarding flow
-- still writes only the legacy four fields.
--
-- Adds user_card_play_state for the per-card per-play tristate that
-- powers the audit page's checkboxes (claimed credits, "going to" intent,
-- etc.).
--
-- The pre-existing user_cards.status column (held / closed_in_past_year /
-- closed_long_ago) represents *whether* the card is in the wallet. The
-- new card_status_v2 column is orthogonal — it represents the user's
-- relationship to the card while it's held (active / considering closing
-- / downgraded / closed). Two different axes, deliberately not merged.

create type pool_status as enum ('yes', 'not_yet', 'unknown');
create type card_status_v2 as enum ('active', 'considering_close', 'downgraded', 'closed');
create type play_state as enum ('got_it', 'want_it', 'skip', 'unset');

alter table user_cards
  add column nickname text,
  add column authorized_users smallint,
  add column pool_status pool_status,
  add column pinned_category text,
  add column elite_reached boolean,
  add column activity_threshold_met boolean,
  add column card_status_v2 card_status_v2,
  add column found_money_cached_usd integer,
  add column signals_filled smallint,
  add column signals_total smallint;

create table user_card_play_state (
  user_id uuid not null references perks_users(id) on delete cascade,
  card_id text not null references cards(id),
  play_id text not null,
  state play_state not null default 'unset',
  claimed_at date,
  notes text,
  updated_at timestamptz default now(),
  primary key (user_id, card_id, play_id)
);

create index user_card_play_state_user_card_idx
  on user_card_play_state(user_id, card_id);

create trigger trg_user_card_play_state_updated
  before update on user_card_play_state
  for each row execute function set_updated_at();
