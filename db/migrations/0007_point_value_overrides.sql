-- 0007_point_value_overrides.sql
-- Per-user per-program cpp overrides. CLAUDE.md doctrine:
-- "User-driven cpp." Each currency program ships with default cpps and
-- is overridable per user. Bank transferable currencies use all three
-- columns; airline/hotel programs only populate transfer_cpp. The app
-- layer is responsible for not exposing irrelevant rows in the UI;
-- the table itself is permissive.
--
-- Engine reads overrides via lib/engine/programOverrides.ts and feeds
-- them into the loyalty cpp ladder. Editing a program's transfer cpp
-- on one card's detail page propagates to every card in the wallet
-- that earns the same program — overrides are scoped to (user,
-- program), never to (user, card).

create table perks_point_value_overrides (
  user_id uuid not null references perks_users(id) on delete cascade,
  program_id text not null,
  cash_cpp numeric(5,3),
  portal_cpp numeric(5,3),
  transfer_cpp numeric(5,3),
  updated_at timestamptz not null default now(),
  primary key (user_id, program_id),
  check (cash_cpp is null or (cash_cpp >= 0.5 and cash_cpp <= 5)),
  check (portal_cpp is null or (portal_cpp >= 0.5 and portal_cpp <= 5)),
  check (transfer_cpp is null or (transfer_cpp >= 0.5 and transfer_cpp <= 5))
);

create index perks_point_value_overrides_user_idx
  on perks_point_value_overrides(user_id);

-- set_updated_at() trigger function established in earlier migration.
create trigger trg_perks_point_value_overrides_updated
  before update on perks_point_value_overrides
  for each row execute function set_updated_at();
