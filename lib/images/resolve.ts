// Image resolver. Server-side only — touches Postgres.
// Resolution order:
//   1. Real default for (card, role) — `card_image_default.<role>_asset_id`
//   2. Most-recent active asset for (card, role)
//   3. Synthetic spec (rendered fresh as inline SVG)
//   4. Throw — every card should have a synthetic spec post-seed.

import "server-only";
import { sql } from "@/lib/db";
import { renderSynthetic, type SyntheticSpec } from "./synthetic";

export type ImageRole = "front" | "back" | "marketing" | "lifestyle";
export type ImageSize = "thumb" | "card" | "hero" | "og" | "retina_thumb" | "retina_card" | "retina_hero";
export type ImageFormat = "avif" | "webp" | "jpeg" | "png";

export interface ResolvedReal {
  type: "real";
  url: string;
  width_px: number;
  height_px: number;
  format: ImageFormat;
}

export interface ResolvedSynthetic {
  type: "synthetic";
  svg: string;
}

export type ResolvedImage = ResolvedReal | ResolvedSynthetic;

interface FileRow {
  url: string;
  format: ImageFormat;
  size_label: ImageSize;
  width_px: number;
  height_px: number;
}

const ROLE_TO_DEFAULT_COLUMN: Record<ImageRole, "front_asset_id" | "back_asset_id" | "marketing_asset_id"> = {
  front: "front_asset_id",
  back: "back_asset_id",
  marketing: "marketing_asset_id",
  lifestyle: "front_asset_id",  // not v1 — falls back to front
};

export async function resolveCardImage(
  cardId: string,
  size: ImageSize = "card",
  role: ImageRole = "front",
  preferredFormat: ImageFormat | "auto" = "auto",
): Promise<ResolvedImage> {
  // 1) Default-pinned asset for this role
  const defaultCol = ROLE_TO_DEFAULT_COLUMN[role];
  const defRows = await sql<{ asset_id: number | null }[]>`
    select ${sql(defaultCol)} as asset_id
    from card_image_default
    where card_id = ${cardId}
    limit 1
  `;
  const pinnedAsset = defRows[0]?.asset_id ?? null;

  if (pinnedAsset) {
    const file = await pickFile(pinnedAsset, size, preferredFormat);
    if (file) return realFromFile(file);
  }

  // 2) Most-recent active asset for (card, role)
  const recent = await sql<{ id: number }[]>`
    select id from card_image_assets
    where card_id = ${cardId} and role = ${role} and status = 'active'
    order by created_at desc limit 1
  `;
  if (recent[0]) {
    const file = await pickFile(recent[0].id, size, preferredFormat);
    if (file) return realFromFile(file);
  }

  // 3) Synthetic from spec
  const specRows = await sql<SyntheticSpecRow[]>`
    select background_color, accent_color, text_color,
           network_logo_slug, issuer_name_short, card_name_short, currency_short
      from card_synthetic_specs
     where card_id = ${cardId}
     limit 1
  `;
  const spec = specRows[0];
  if (!spec) {
    throw new Error(`No synthetic spec for card ${cardId} — run seed-synthetic-images`);
  }
  return { type: "synthetic", svg: renderSynthetic(specToInput(spec)) };
}

interface SyntheticSpecRow {
  background_color: string;
  accent_color: string;
  text_color: string;
  network_logo_slug: string | null;
  issuer_name_short: string;
  card_name_short: string;
  currency_short: string | null;
}

function specToInput(r: SyntheticSpecRow): SyntheticSpec {
  return {
    background_color: r.background_color,
    accent_color: r.accent_color,
    text_color: r.text_color,
    network_logo_slug: r.network_logo_slug,
    issuer_name_short: r.issuer_name_short,
    card_name_short: r.card_name_short,
    currency_short: r.currency_short,
  };
}

async function pickFile(
  assetId: number,
  size: ImageSize,
  preferredFormat: ImageFormat | "auto",
): Promise<FileRow | null> {
  const formats: ImageFormat[] =
    preferredFormat === "auto"
      ? ["avif", "webp", "jpeg"]
      : [preferredFormat];

  for (const f of formats) {
    const rows = await sql<FileRow[]>`
      select url, format, size_label, width_px, height_px
      from card_image_files
      where asset_id = ${assetId} and format = ${f} and size_label = ${size}
      limit 1
    `;
    if (rows[0]) return rows[0];
  }
  return null;
}

function realFromFile(f: FileRow): ResolvedReal {
  return {
    type: "real",
    url: f.url,
    width_px: f.width_px,
    height_px: f.height_px,
    format: f.format,
  };
}
