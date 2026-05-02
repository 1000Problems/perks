// Map a card-database card → CardArt variant. Placeholder until we
// have issuer-specific art. Routes by currency_earned then issuer.

import type { Card } from "@/lib/data/loader";
import type { CardArtVariant } from "@/lib/data/types";

export function variantForCard(card: Card): CardArtVariant {
  const cur = (card.currency_earned ?? "").toLowerCase();
  if (cur.includes("ur") || cur.includes("chase")) return "art-navy";
  if (cur.includes("mr") || cur.includes("amex")) return "art-platinum";
  if (cur.includes("ty") || cur.includes("citi")) return "art-graphite";
  if (cur.includes("venture") || cur.includes("capital_one")) return "art-skyblue";
  if (cur.includes("hilton")) return "art-rust";
  if (cur.includes("marriott") || cur.includes("bonvoy")) return "art-cream";
  if (cur.includes("delta") || cur.includes("united") || cur.includes("aa")) return "art-emerald";
  if (cur.includes("hyatt")) return "art-ink";

  switch (card.issuer) {
    case "Chase": return "art-navy";
    case "Amex": return "art-platinum";
    case "Citi": return "art-graphite";
    case "Capital One": return "art-skyblue";
    case "Bank of America": return "art-emerald";
    default: return "art-graphite";
  }
}
