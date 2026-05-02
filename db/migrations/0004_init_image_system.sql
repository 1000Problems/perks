-- 0004_init_image_system.sql
-- Card image assets, generated size/format files, default selection,
-- and synthetic specs (the universal-fallback SVG renderer's input).

create type image_role as enum ('front', 'back', 'marketing', 'lifestyle');

create type image_size_label as enum (
  'thumb', 'card', 'hero', 'og',
  'retina_thumb', 'retina_card', 'retina_hero'
);

create type image_format as enum ('avif', 'webp', 'jpeg', 'png');

create type image_status as enum ('active', 'superseded', 'broken');

-- ── Image assets (one per uploaded source) ─────────────────────────────

create table card_image_assets (
  id bigserial primary key,
  card_id text not null references cards(id) on delete cascade,
  role image_role not null default 'front',
  status image_status not null default 'active',
  source_sha256 text,
  uploaded_by text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index card_image_assets_card_role_status_idx
  on card_image_assets(card_id, role, status);
create trigger trg_card_image_assets_updated before update on card_image_assets
  for each row execute function set_updated_at();

-- ── Generated image files (size × format variants per asset) ───────────

create table card_image_files (
  id bigserial primary key,
  asset_id bigint not null references card_image_assets(id) on delete cascade,
  format image_format not null,
  size_label image_size_label not null,
  width_px integer not null,
  height_px integer not null,
  bytes integer not null,
  sha256 text not null,
  url text not null,
  created_at timestamptz default now()
);

create unique index card_image_files_uniq
  on card_image_files(asset_id, format, size_label);

-- ── Default image per (card, role) ─────────────────────────────────────

create table card_image_default (
  card_id text primary key references cards(id) on delete cascade,
  front_asset_id bigint references card_image_assets(id) on delete set null,
  back_asset_id bigint references card_image_assets(id) on delete set null,
  marketing_asset_id bigint references card_image_assets(id) on delete set null,
  updated_at timestamptz default now()
);

create trigger trg_card_image_default_updated before update on card_image_default
  for each row execute function set_updated_at();

-- ── Synthetic specs (the universal SVG fallback) ───────────────────────

create table card_synthetic_specs (
  card_id text primary key references cards(id) on delete cascade,
  background_color text not null,
  accent_color text not null,
  text_color text not null default '#FFFFFF',
  network_logo_slug text,
  issuer_name_short text not null,
  card_name_short text not null,
  currency_short text,
  updated_at timestamptz default now()
);

create trigger trg_card_synthetic_specs_updated before update on card_synthetic_specs
  for each row execute function set_updated_at();
