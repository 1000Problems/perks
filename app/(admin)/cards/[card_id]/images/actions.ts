"use server";

// Server actions for the image admin UI. All gated by the admin layout —
// any reach here implies the user is in ADMIN_ACCOUNT_NAME.

import { createHash } from "node:crypto";
import { revalidatePath } from "next/cache";
import { sql } from "@/lib/db";
import { getStorage } from "@/lib/images/storage";

type Role = "front" | "back" | "marketing" | "lifestyle";
type Format = "avif" | "webp" | "jpeg";

interface SizeSpec {
  label: "thumb" | "card" | "hero" | "og" | "retina_thumb" | "retina_card" | "retina_hero";
  width: number;
  height: number;
}

const SIZES: SizeSpec[] = [
  { label: "thumb",        width: 96,   height: 60 },
  { label: "card",         width: 360,  height: 227 },
  { label: "hero",         width: 720,  height: 454 },
  { label: "og",           width: 1200, height: 756 },
  { label: "retina_thumb", width: 192,  height: 121 },
  { label: "retina_card",  width: 720,  height: 454 },
  { label: "retina_hero",  width: 1440, height: 907 },
];

function sha256(b: Uint8Array): string {
  return createHash("sha256").update(b).digest("hex");
}

function defaultColumnFor(role: Role): "front_asset_id" | "back_asset_id" | "marketing_asset_id" {
  if (role === "back") return "back_asset_id";
  if (role === "marketing") return "marketing_asset_id";
  return "front_asset_id";
}

export async function uploadCardImage(cardId: string, formData: FormData): Promise<void> {
  const file = formData.get("source");
  const role = (formData.get("role") as Role) ?? "front";
  const setDefault = formData.get("set_default") === "on";
  if (!(file instanceof File)) throw new Error("missing source");

  const buf = new Uint8Array(await file.arrayBuffer());
  const sourceSha = sha256(buf);

  const sharp = (await import("sharp")).default;
  const meta = await sharp(buf).metadata();
  if (!meta.width || !meta.height || meta.width < 1440 || meta.height < 907) {
    throw new Error(`source too small: ${meta.width}×${meta.height} (need ≥ 1440×907)`);
  }

  const storage = getStorage();
  if (!storage.available()) throw new Error("R2 storage not configured (R2_* env vars)");

  const existing = await sql<{ id: number }[]>`
    select id from card_image_assets
    where card_id = ${cardId} and role = ${role} and source_sha256 = ${sourceSha} and status = 'active'
    limit 1
  `;
  let assetId: number;
  if (existing[0]) {
    assetId = existing[0].id;
  } else {
    const inserted = await sql<{ id: number }[]>`
      insert into card_image_assets (card_id, role, status, source_sha256, uploaded_by)
      values (${cardId}, ${role}, 'active', ${sourceSha}, 'admin')
      returning id
    `;
    assetId = inserted[0].id;
  }

  for (const size of SIZES) {
    const formats: Format[] = ["avif", "webp", "jpeg"];
    for (const fmt of formats) {
      const exists = await sql<{ id: number }[]>`
        select id from card_image_files
        where asset_id = ${assetId} and format = ${fmt} and size_label = ${size.label}
      `;
      if (exists[0]) continue;
      const pipeline = sharp(buf).resize(size.width, size.height, { fit: "cover" });
      const out =
        fmt === "avif" ? await pipeline.avif({ quality: 50 }).toBuffer()
        : fmt === "webp" ? await pipeline.webp({ quality: 80 }).toBuffer()
        : await pipeline.jpeg({ quality: 85, mozjpeg: true }).toBuffer();
      const key = `cards/${cardId}/${role}/${size.label}.${fmt}`;
      const { url } = await storage.put({
        key,
        body: out,
        contentType: fmt === "avif" ? "image/avif" : fmt === "webp" ? "image/webp" : "image/jpeg",
      });
      await sql`
        insert into card_image_files (
          asset_id, format, size_label, width_px, height_px, bytes, sha256, url
        ) values (
          ${assetId}, ${fmt}, ${size.label}, ${size.width}, ${size.height},
          ${out.length}, ${sha256(out)}, ${url}
        )
      `;
    }
  }

  if (setDefault) {
    const col = defaultColumnFor(role);
    await sql`
      insert into card_image_default (card_id, ${sql(col)})
      values (${cardId}, ${assetId})
      on conflict (card_id) do update set
        ${sql(col)} = ${assetId},
        updated_at = now()
    `;
  }

  revalidatePath(`/admin/cards/${cardId}/images`);
}

export async function markAssetBroken(cardId: string, assetId: number): Promise<void> {
  await sql`
    update card_image_assets set status = 'broken'
    where id = ${assetId} and card_id = ${cardId}
  `;
  // If this was the default for any role, clear it.
  await sql`
    update card_image_default set
      front_asset_id = case when front_asset_id = ${assetId} then null else front_asset_id end,
      back_asset_id  = case when back_asset_id  = ${assetId} then null else back_asset_id  end,
      hero_asset_id  = case when hero_asset_id  = ${assetId} then null else hero_asset_id  end,
      updated_at = now()
    where card_id = ${cardId}
  `;
  revalidatePath(`/admin/cards/${cardId}/images`);
}

export async function setDefaultAsset(
  cardId: string,
  assetId: number,
  role: string,
): Promise<void> {
  const col = defaultColumnFor(role as Role);
  await sql`
    insert into card_image_default (card_id, ${sql(col)})
    values (${cardId}, ${assetId})
    on conflict (card_id) do update set
      ${sql(col)} = ${assetId},
      updated_at = now()
  `;
  revalidatePath(`/admin/cards/${cardId}/images`);
}
