// scripts/process-image.ts
// Take a source PNG/JPG/AVIF, generate seven size × three format variants,
// upload each to R2, write rows in card_image_assets + card_image_files,
// optionally pin as default for the role.
//
// Usage:
//   npm run images:process -- \
//     --card amex_platinum --role front \
//     --source ./tmp/source.png --set-default

import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { sql } from "../lib/db";
import { getStorage } from "../lib/images/storage";

type Role = "front" | "back" | "marketing" | "lifestyle";
type SizeLabel = "thumb" | "card" | "hero" | "og" | "retina_thumb" | "retina_card" | "retina_hero";
type Format = "avif" | "webp" | "jpeg";

interface SizeSpec {
  label: SizeLabel;
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

interface ProcessOpts {
  cardId: string;
  role: Role;
  sourcePath: string;
  setDefault: boolean;
}

function parseArgs(): ProcessOpts {
  const args = process.argv.slice(2);
  const get = (flag: string) => {
    const i = args.indexOf(flag);
    return i >= 0 ? args[i + 1] : undefined;
  };
  const cardId = get("--card");
  const role = (get("--role") ?? "front") as Role;
  const sourcePath = get("--source");
  const setDefault = args.includes("--set-default");
  if (!cardId || !sourcePath) {
    throw new Error("required: --card <id> --source <path> [--role front|back|...] [--set-default]");
  }
  return { cardId, role, sourcePath, setDefault };
}

async function processImage(opts: ProcessOpts): Promise<void> {
  const sharp = (await import("sharp")).default;
  const storage = getStorage();
  if (!storage.available()) {
    throw new Error("R2 not configured. See lib/images/storage.ts for required env vars.");
  }

  const sourceBytes = readFileSync(opts.sourcePath);
  const sourceSha = sha256(sourceBytes);

  const meta = await sharp(sourceBytes).metadata();
  if (!meta.width || !meta.height || meta.width < 1440 || meta.height < 907) {
    throw new Error(
      `Source must be at least 1440×907 (got ${meta.width}×${meta.height}). ` +
      `Card art is generated up to retina_hero (1440px); upscaling produces visible artifacts.`,
    );
  }

  // Idempotency by source sha — if an asset with this sha already exists
  // for the (card, role), reuse it instead of re-uploading.
  const existing = await sql<{ id: number }[]>`
    select id from card_image_assets
    where card_id = ${opts.cardId} and role = ${opts.role}
      and source_sha256 = ${sourceSha} and status = 'active'
    limit 1
  `;

  let assetId: number;
  if (existing[0]) {
    assetId = existing[0].id;
    console.log(`asset ${assetId} already exists for sha ${sourceSha.slice(0, 8)}… reusing`);
  } else {
    const inserted = await sql<{ id: number }[]>`
      insert into card_image_assets (card_id, role, status, source_sha256, uploaded_by)
      values (${opts.cardId}, ${opts.role}, 'active', ${sourceSha}, ${process.env.USER ?? "cli"})
      returning id
    `;
    assetId = inserted[0].id;
    console.log(`created asset ${assetId} for ${opts.cardId}/${opts.role}`);
  }

  const formats: Format[] = ["avif", "webp", "jpeg"];

  for (const size of SIZES) {
    for (const fmt of formats) {
      const key = `cards/${opts.cardId}/${opts.role}/${size.label}.${fmt}`;
      const existsFile = await sql<{ id: number }[]>`
        select id from card_image_files
        where asset_id = ${assetId} and format = ${fmt} and size_label = ${size.label}
      `;
      if (existsFile[0]) {
        console.log(`  ${size.label}/${fmt}  exists`);
        continue;
      }
      const buf = await renderVariant(sharp, sourceBytes, size, fmt);
      const fileSha = sha256(buf);
      const { url } = await storage.put({
        key,
        body: buf,
        contentType: contentTypeFor(fmt),
      });
      await sql`
        insert into card_image_files (
          asset_id, format, size_label, width_px, height_px, bytes, sha256, url
        ) values (
          ${assetId}, ${fmt}, ${size.label}, ${size.width}, ${size.height},
          ${buf.length}, ${fileSha}, ${url}
        )
      `;
      console.log(`  ${size.label}/${fmt}  ${buf.length} B → ${url}`);
    }
  }

  if (opts.setDefault) {
    const col = ({
      front: "front_asset_id",
      back: "back_asset_id",
      hero: "hero_asset_id",
      marketing: "front_asset_id",
      lifestyle: "front_asset_id",
    } as const)[opts.role];
    await sql`
      insert into card_image_default (card_id, ${sql(col)})
      values (${opts.cardId}, ${assetId})
      on conflict (card_id) do update set
        ${sql(col)} = ${assetId},
        updated_at = now()
    `;
    console.log(`pinned asset ${assetId} as default ${opts.role} for ${opts.cardId}`);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SharpFactory = any;

async function renderVariant(
  sharp: SharpFactory,
  source: Uint8Array,
  size: SizeSpec,
  fmt: Format,
): Promise<Uint8Array> {
  const pipeline = sharp(source).resize(size.width, size.height, { fit: "cover" });
  if (fmt === "avif") return pipeline.avif({ quality: 50 }).toBuffer();
  if (fmt === "webp") return pipeline.webp({ quality: 80 }).toBuffer();
  return pipeline.jpeg({ quality: 85, mozjpeg: true }).toBuffer();
}

function contentTypeFor(f: Format): string {
  return f === "avif" ? "image/avif" : f === "webp" ? "image/webp" : "image/jpeg";
}

function sha256(b: Uint8Array): string {
  return createHash("sha256").update(b).digest("hex");
}

const cliOpts = parseArgs();
processImage(cliOpts)
  .catch((e) => {
    console.error("process-image failed:", e);
    process.exit(1);
  })
  .finally(() => sql.end());
