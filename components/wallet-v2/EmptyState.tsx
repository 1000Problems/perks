"use client";

// Empty wallet — first-card prompt. Three example chips for fast pickup.

import { CardArt } from "@/components/perks/CardArt";
import { variantForCard } from "@/lib/cardArt";
import type { Card } from "@/lib/data/loader";

const EXAMPLE_IDS = [
  "chase_sapphire_preferred",
  "amex_gold",
  "citi_strata_premier",
];

interface Props {
  catalog: Card[];
  onPick: (card: Card) => void;
}

export function EmptyState({ catalog, onPick }: Props) {
  const examples = EXAMPLE_IDS.map((id) =>
    catalog.find((c) => c.id === id),
  ).filter((c): c is Card => Boolean(c));

  return (
    <div className="empty-wallet">
      <div className="empty-headline num">Add your first card</div>
      <p className="empty-body">
        We&apos;ll surface every credit, multiplier, and sweet-spot waiting
        for you. Start with one — or pick a familiar one below.
      </p>
      {examples.length > 0 && (
        <div className="empty-examples">
          {examples.map((c) => (
            <button
              key={c.id}
              type="button"
              className="ex-card"
              onClick={() => onPick(c)}
            >
              <CardArt
                variant={variantForCard(c)}
                issuer={c.issuer}
                network={c.network ?? undefined}
                size="md"
              />
              <div className="ex-name">{c.name}</div>
              <div className="ex-iss">{c.issuer}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
