"use client";

// CardIntroBlock — three short paragraphs that orient the reader before
// the value-thesis math. Each sentence has a job:
//   - positioning: what the card is in plain English
//   - differentiator: the one thing it does better than competitors
//   - ecosystem_role: how it pairs with the rest of the user's wallet
//
// When card_intro is undefined on the card, render nothing.

import type { Card } from "@/lib/data/loader";

interface Props {
  card: Card;
}

export function CardIntroBlock({ card }: Props) {
  const intro = card.card_intro;
  if (!intro) return null;
  return (
    <section className="card-intro-block" aria-label="What this card is">
      <p className="card-intro-line">{intro.positioning}</p>
      <p className="card-intro-line">{intro.differentiator}</p>
      <p className="card-intro-line">{intro.ecosystem_role}</p>
    </section>
  );
}
