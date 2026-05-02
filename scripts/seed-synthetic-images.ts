// scripts/seed-synthetic-images.ts
// Ensure every card has a card_synthetic_specs row. Idempotent — fields
// derive from issuer color + card metadata, so re-running picks up palette
// edits or display-name changes.

import { sql } from "../lib/db";
import { paletteFor } from "../lib/images/issuer-colors";

interface CardRow {
  id: string;
  display_name: string;
  issuer_id: string;
  issuer_display: string;
  network_id: string | null;
  currency_earned: string | null;
}

async function fetchCards(): Promise<CardRow[]> {
  return sql<CardRow[]>`
    select c.id, c.display_name, c.issuer_id,
           i.display_name as issuer_display,
           c.network_id, c.currency_earned
    from cards c
    join issuers i on i.id = c.issuer_id
    order by c.id
  `;
}

function shortName(name: string): string {
  // Trim qualifiers most cards include redundantly: "Visa Signature Card",
  // "Credit Card", "Mastercard". The synthetic art has its own logo — the
  // network words are noise in the title.
  return name
    .replace(/\b(visa|mastercard|amex|american express|discover)\b/gi, "")
    .replace(/\b(card|credit|signature|infinite|world elite|world)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function shortIssuer(name: string): string {
  return name.replace(/\bBank of\b/gi, "BoA").trim();
}

async function seedOne(c: CardRow): Promise<"inserted" | "updated"> {
  const palette = paletteFor(c.issuer_id);
  const exists = await sql<{ card_id: string }[]>`
    select card_id from card_synthetic_specs where card_id = ${c.id}
  `;
  await sql`
    insert into card_synthetic_specs (
      card_id, background_color, accent_color, text_color,
      network_logo_slug, issuer_name_short, card_name_short, currency_short
    ) values (
      ${c.id}, ${palette.background}, ${palette.accent}, ${palette.text ?? "#FFFFFF"},
      ${c.network_id}, ${shortIssuer(c.issuer_display)}, ${shortName(c.display_name) || c.display_name},
      ${c.currency_earned}
    )
    on conflict (card_id) do update set
      background_color = excluded.background_color,
      accent_color = excluded.accent_color,
      text_color = excluded.text_color,
      network_logo_slug = excluded.network_logo_slug,
      issuer_name_short = excluded.issuer_name_short,
      card_name_short = excluded.card_name_short,
      currency_short = excluded.currency_short,
      updated_at = now()
  `;
  return exists.length ? "updated" : "inserted";
}

async function main() {
  const cards = await fetchCards();
  console.log(`Seeding synthetic specs for ${cards.length} cards…`);
  let inserted = 0;
  let updated = 0;
  for (const c of cards) {
    const r = await seedOne(c);
    if (r === "inserted") inserted++;
    else updated++;
  }
  console.log(`Inserted ${inserted}, updated ${updated}.`);
}

main()
  .catch((e) => {
    console.error("seed-synthetic-images failed:", e);
    process.exit(1);
  })
  .finally(() => sql.end());
