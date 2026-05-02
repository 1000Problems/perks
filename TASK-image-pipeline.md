# TASK: Image pipeline — storage, ingestion, processor, synthetic renderer, admin UI

> Stand up the end-to-end image system: where card art is stored, how it gets uploaded, how it's processed into the size variants the schema expects, the universal-fallback synthetic SVG, and an admin UI to upload and approve real art per card. Replaces the CSS-variant placeholder in `lib/cardArt.ts`.

## Context

`TASK-db-schema-foundation` defines the four image tables (`card_image_assets`, `card_image_files`, `card_image_default`, `card_synthetic_specs`) but leaves storage, ingestion, processing, and rendering for this TASK. Today, `lib/cardArt.ts` returns a CSS variant string — there are no actual images anywhere in the repo, no `public/card-art/` directory, no upload path. The recommendation panel renders gradient swatches.

The soul doc (§image system) and the schema imply a **synthetic-default + real-art-per-card** model. Synthetic is universal coverage (we always have something to render); real art is collected manually for the cards we care about most. This TASK builds both halves and the wiring.

Storage decision: Neon doesn't host blobs. Use a separate object store. Cloudflare R2 (S3-compatible, no egress fees) is the cheapest fit for a card-recommender that will get hammered at the marketing-page level. Vercel Blob is the easiest if we want to avoid a second vendor — accept the price. Either works; this TASK assumes **Cloudflare R2** (cheaper, the long-term bet) and notes the swap points if Vercel Blob is chosen instead.

## Requirements

1. **R2 bucket setup (one-time, manual, documented).**
   - One bucket: `perks-card-art-prod` (and `perks-card-art-dev` for previews).
   - Public read via a Cloudflare Worker or R2 public bucket URL — assets are served at `https://card-art.perks.<domain>/<key>`.
   - Write access: a single R2 API token with object-write scope. Token stored as `R2_ACCESS_KEY_ID` and `R2_SECRET_ACCESS_KEY` env vars; the bucket name in `R2_BUCKET`; the public base URL in `R2_PUBLIC_BASE`.
   - Document the setup steps in `docs/IMAGE_PIPELINE.md` (new file). Don't paste real keys anywhere.

2. **Synthetic SVG renderer.**
   - Create `lib/images/synthetic.ts` exporting `renderSynthetic(spec: SyntheticSpec): string` — pure function, returns SVG markup.
   - `SyntheticSpec` matches the schema's `card_synthetic_specs` row shape: `{ background_color, accent_color, network_logo_slug, issuer_name_short, card_name_short, currency_short }`.
   - The output SVG is dimensionally consistent (`viewBox="0 0 1080 680"` — credit card 1.586:1 ratio at 1080px width). Uses inline fonts only; no external font fetch. Renders the issuer name top-left, card name center, network logo bottom-right (logos as inline SVG paths, one per network — Visa, Mastercard, Amex, Discover, Diners — committed to `lib/images/network-logos.ts`).
   - Renders identically server-side and client-side. No `Math.random()`; no `Date.now()`.
   - Unit test in `tests/images/synthetic.test.ts`: snapshot test against three fixture specs (a Visa Signature, an Amex transferable, a Mastercard cobrand). Determinism is the contract.

3. **Image processor.**
   - Create `scripts/process-image.ts` — a CLI that takes a single source PNG/JPG/AVIF, generates the seven size variants from the `image_size_label` enum (`thumb` 96px, `card` 360px, `hero` 720px, `og` 1200px, plus the three retina @2× sizes), and uploads each as `webp` + `avif` + `jpeg` to R2 under the key pattern `cards/{card_id}/{role}/{size_label}.{format}`.
   - Records in DB: one `card_image_assets` row per source image (with `card_id`, `role`, `status='active'`), and one `card_image_files` row per generated variant (with `format`, `size_label`, `width_px`, `height_px`, `bytes`, `sha256`, `url`).
   - Uses `sharp` (already a common Next.js dep; add if not present). AVIF quality 50, WebP quality 80, JPEG quality 85 — these are the defaults that minimize bytes without visible artifacts at card sizes; document in the script header.
   - Idempotent: if a `card_image_files` row with the same `(asset_id, format, size_label)` exists and the source `sha256` matches, skip the upload. The R2 PUT is conditional via `If-None-Match`.
   - Sets `card_image_default` to point at this asset for the given role (`front` by default) when `--set-default` is passed.

4. **Bulk synthetic seed step.**
   - Create `scripts/seed-synthetic-images.ts` that, for every card in `cards`, ensures a `card_synthetic_specs` row exists derived from the card's metadata (issuer color, network, name).
   - Maintain an `lib/images/issuer-colors.ts` lookup: `Record<issuer_slug, { background, accent }>` — Chase navy, Amex platinum, Citi graphite, Capital One sky, BoA red, Wells Fargo gold, Synchrony orange, etc. Hand-curated; small file.
   - Idempotent: if the synthetic spec already exists for a card and the source fields match, skip. If the issuer color lookup changes, the next run updates the row.
   - Does NOT upload anything — synthetic SVGs are rendered on-the-fly at request time from the spec. The renderer is the source of truth; the row is just config.

5. **Admin upload UI.**
   - New route `app/(admin)/cards/[card_id]/images/page.tsx`. Auth-gated to a single admin account name (env var `ADMIN_ACCOUNT_NAME` — checked server-side; on mismatch, return 404, not 403, to keep the path quiet).
   - UI: drag-and-drop a PNG/JPG, preview at `card` size, three buttons — Save as front, Save as back, Save as marketing. Hits a server action that runs the processor with the appropriate role.
   - Lists existing `card_image_assets` rows for the card with thumbnails. Each row has "Set as default" and "Mark broken" buttons. "Mark broken" sets `status='broken'` and triggers the renderer to fall back to the next-newest asset, or to synthetic.
   - No public route. Not linked from the main app navigation.

6. **CardArt component rewire.**
   - Replace `lib/cardArt.ts` with `lib/images/resolve.ts` exporting `resolveCardImage(card_id, size, role='front', format='auto'): { url: string; type: 'real' | 'synthetic' }`.
   - Resolution order: real default for `(card_id, role, status='active')` → real most-recent active for the role → synthetic from `card_synthetic_specs`. If even the synthetic spec is missing (shouldn't happen post-seed), throw — that's a data error worth surfacing loudly.
   - `format='auto'` picks the best format the requesting client supports (AVIF if Accept includes it, else WebP, else JPEG). Implementation: read `Accept` header in a server component or pass an explicit format from the client.
   - New React component `components/perks/CardArt.tsx` (replace the existing one) that takes `cardId` and `size` and renders either an `<img>` (real) or an inline `<svg>` (synthetic from `renderSynthetic()` at render time).
   - Server component by default. The synthetic path is just inlined SVG; no client JS required.
   - Update every existing import of `lib/cardArt.ts` to `lib/images/resolve.ts` and update component prop names. The CSS-variant strings (`art-navy` etc.) go away.

7. **Tests.**
   - `tests/images/synthetic.test.ts` — three snapshot tests per Requirement 2.
   - `tests/images/resolve.test.ts` — fixture DB rows, assert resolver returns the right URL/type for each lookup case (default real, fallback to most-recent, fallback to synthetic, asset marked broken).
   - `tests/scripts/process-image.test.ts` — feed a 1080×680 fixture PNG, assert seven variants land in a temp directory (mock the R2 client), assert DB rows are created idempotently.

## Implementation Notes

### Why R2 over Vercel Blob

R2: $0.015/GB-month storage, **zero egress**, S3 SDK works as-is. Card art will be hammered by anonymous browsers — egress is the dominant cost at scale and Vercel Blob charges for it. The downside is one more vendor dashboard. Decision: worth it.

If the team would rather not run a second vendor, swap `@aws-sdk/client-s3` (configured for R2 endpoint) for `@vercel/blob`. The swap is contained to `lib/images/storage.ts` (a thin wrapper this TASK should create). Don't let the storage choice leak into the processor or the resolver.

### Where the synthetic renders

The synthetic SVG is rendered fresh on every request. It's small (~3KB inlined), deterministic, and cacheable at the CDN edge by URL. There's no value in pre-rendering and storing — the spec row IS the cached form. This is intentional.

### Image sizes

The schema's `image_size_label` enum has seven values. The processor generates all seven from one source. Source must be ≥1440×907 (twice the `hero` size) to avoid upscaling. Reject smaller sources at upload time with a clear error.

### Sharp + Vercel

`sharp` is the standard Next.js image processor. Vercel ships it in the runtime; locally it needs `npm install sharp`. Add to dependencies (not devDependencies) so the admin route works in production.

### Format negotiation

Browsers in 2026: AVIF support is universal except old Safari. WebP is universal. Defaulting to AVIF with WebP fallback at the `<picture>` level is the right call. The resolver returns one URL by default; if a caller wants `<picture>`, they call `resolveCardImage()` three times (one per format) and assemble. Don't build a fancy `<picture>` helper unless the marketing pages need one.

### Admin auth

Reuse the existing cookie-session auth from `lib/auth/`. The admin gate is one extra check in `app/(admin)/layout.tsx`: load the user, compare `account_name` to `ADMIN_ACCOUNT_NAME`, redirect to `/` if mismatch. No separate admin auth system, no role table for v1.

### What this TASK does NOT do

- It does not collect real art. That's a separate editorial pass. Once the admin UI lands, the admin uploads images at their own pace.
- It does not generate marketing or lifestyle images. Those are deferred — only `front` role is wired in the resolver's primary fallback chain.
- It does not build an OG image generator for social sharing. Possibly a follow-on if the marketing pages need it.
- It does not delete broken images from R2 — `status='broken'` just hides them from the resolver; the bytes stay until a janitor TASK lands.

## Do Not Change

- `cards/*.md` — image data is stored in DB, not in markdown.
- `data/*.json` — JSON output path is unaffected by this TASK.
- `lib/data/loader.ts`, `lib/engine/**` — engine doesn't touch images.
- `lib/auth/**`, `lib/db.ts`, `middleware.ts` — auth is settled.
- The catalog tables (cards, programs, etc.) — read-only from this TASK.
- The image migrations from `TASK-db-schema-foundation` — applied as-is.
- `app/(app)/**` and `app/(marketing)/**` — only update imports of `cardArt`; no other UI changes.
- The recommendation engine output — image resolution is render-time, not engine-time.
- The synthetic renderer's SVG output once shipped — snapshot tests pin it. Changes need a deliberate snapshot update with reviewer approval.

## Acceptance Criteria

- [ ] `lib/images/synthetic.ts` exists; snapshot tests pass for three fixture cards.
- [ ] `lib/images/resolve.ts` replaces `lib/cardArt.ts`; all import sites updated; `npm run typecheck` and `npm run build` pass.
- [ ] `npm run images:seed-synthetic` populates `card_synthetic_specs` for every card in `cards` with no errors.
- [ ] `npm run images:process -- --card amazon_prime_visa --role front --source ./tmp/sample.png --set-default` uploads seven variants to R2, creates the `card_image_assets` row, creates seven `card_image_files` rows, sets `card_image_default.front_asset_id`. Re-running with the same source is a no-op (idempotency).
- [ ] Admin UI at `/admin/cards/amazon_prime_visa/images` works for the `ADMIN_ACCOUNT_NAME` user; returns 404 for everyone else.
- [ ] The recommendation panel (`components/recommender/RecPanelDesktop.tsx`) renders a real image for cards that have one and a synthetic SVG for cards that don't, with no layout shift.
- [ ] Network tab shows AVIF for Chrome, WebP for old Safari, JPEG for the prehistoric. Sizes are appropriate (the rec panel uses `card` size — ≤30KB AVIF; the marketing hero uses `hero` size).
- [ ] All three test files pass.
- [ ] `git diff --stat` shows changes only in: `lib/images/`, `components/perks/CardArt.tsx`, `app/(admin)/`, `scripts/process-image.ts`, `scripts/seed-synthetic-images.ts`, `tests/images/`, `tests/scripts/process-image.test.ts`, `package.json`, `package-lock.json`, `docs/IMAGE_PIPELINE.md`. Plus updated import sites for `cardArt` → `images/resolve` (mostly in `components/`).

## Verification

1. From a clean DB with the schema applied and cards migrated: `npm run images:seed-synthetic`. Confirm row count in `card_synthetic_specs` matches `SELECT count(*) FROM cards`.
2. Hit `/admin/cards/amex_platinum/images` as the admin user. Drag a sample PNG. Save as front. Confirm seven `card_image_files` rows land for that asset; confirm the URLs return the bytes.
3. Mark the asset broken from the admin UI. Reload the recommendation panel showing Amex Platinum. Confirm it falls back to the synthetic SVG.
4. Set a different active asset as default. Reload — confirm the new default renders.
5. Open the rec panel in DevTools, throttle to "Slow 3G". Confirm the `card`-size variant under 30KB lands first; no layout shift; synthetic SVGs render instantly because they're inlined.
6. `npm run typecheck && npm run build && npm run test` — all pass.
7. `git status` — file list matches the acceptance criterion above.

If R2 isn't set up yet, the processor and admin UI fail at upload time with a clear error referencing the missing env vars. Synthetic + resolver still work end-to-end. That's the expected state during initial dev.
