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

  // BoA cards land on claret (their brand red); Costco's wholesale-club
  // cash card lands on bronze (warm, distinct from the Citi graphite).
  // Kept narrow so adding one card doesn't reshuffle existing variants.
  if (card.id === "costco_anywhere_visa") return "art-bronze";
  if (card.issuer === "Bank of America") return "art-claret";

  switch (card.issuer) {
    case "Chase": return "art-navy";
    case "Amex": return "art-platinum";
    case "Citi": return "art-graphite";
    case "Capital One": return "art-skyblue";
    default: return "art-graphite";
  }
}
