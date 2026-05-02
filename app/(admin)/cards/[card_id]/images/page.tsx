import { notFound } from "next/navigation";
import { sql } from "@/lib/db";
import { uploadCardImage, markAssetBroken, setDefaultAsset } from "./actions";

interface AssetRow {
  id: number;
  role: string;
  status: string;
  created_at: Date;
  source_sha256: string | null;
}

interface CardRow {
  id: string;
  display_name: string;
}

interface DefaultRow {
  front_asset_id: number | null;
  back_asset_id: number | null;
  marketing_asset_id: number | null;
}

export default async function AdminCardImages({
  params,
}: {
  params: Promise<{ card_id: string }>;
}) {
  const { card_id } = await params;
  const cards = await sql<CardRow[]>`
    select id, display_name from cards where id = ${card_id} limit 1
  `;
  if (!cards[0]) notFound();
  const card = cards[0];
  const assets = await sql<AssetRow[]>`
    select id, role, status, created_at, source_sha256
    from card_image_assets
    where card_id = ${card_id}
    order by created_at desc
  `;
  const defaults = await sql<DefaultRow[]>`
    select front_asset_id, back_asset_id, marketing_asset_id
    from card_image_default where card_id = ${card_id}
    limit 1
  `;
  const def = defaults[0] ?? { front_asset_id: null, back_asset_id: null, marketing_asset_id: null };

  return (
    <section>
      <h1>{card.display_name}</h1>
      <p className="dim">card_id: <code>{card.id}</code></p>

      <h2>Upload</h2>
      <form
        action={uploadCardImage.bind(null, card.id)}
        encType="multipart/form-data"
        className="upload-form"
      >
        <label>
          Source (PNG/JPG, ≥ 1440×907)
          <input name="source" type="file" accept="image/png,image/jpeg" required />
        </label>
        <label>
          Role
          <select name="role" defaultValue="front">
            <option value="front">front</option>
            <option value="back">back</option>
            <option value="marketing">marketing</option>
            <option value="lifestyle">lifestyle</option>
          </select>
        </label>
        <label>
          <input name="set_default" type="checkbox" defaultChecked /> Set as default for role
        </label>
        <button type="submit">Process and upload</button>
      </form>

      <h2>Existing assets ({assets.length})</h2>
      <ul className="asset-list">
        {assets.map((a) => {
          const isDefault =
            (a.role === "front" && def.front_asset_id === a.id) ||
            (a.role === "back" && def.back_asset_id === a.id) ||
            (a.role === "marketing" && def.marketing_asset_id === a.id);
          return (
            <li key={a.id}>
              <code>#{a.id}</code> · {a.role} · {a.status}
              {isDefault ? <strong> · DEFAULT</strong> : null}
              {" "}
              <span className="dim">
                {a.created_at.toISOString().slice(0, 10)} · {a.source_sha256?.slice(0, 8) ?? "—"}
              </span>
              <span className="actions">
                {!isDefault && a.status === "active" ? (
                  <form action={setDefaultAsset.bind(null, card.id, a.id, a.role)}>
                    <button type="submit">Set default</button>
                  </form>
                ) : null}
                {a.status === "active" ? (
                  <form action={markAssetBroken.bind(null, card.id, a.id)}>
                    <button type="submit">Mark broken</button>
                  </form>
                ) : null}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
