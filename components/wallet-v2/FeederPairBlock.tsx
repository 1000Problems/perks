"use client";

// FeederPairBlock — always rendered when the card has authored a
// feeder_pair. Two states:
//
//   missing: at least one feeder card_id is absent from cards_held →
//            show value_when_missing copy and an "Add {Card}" button
//            per missing feeder, deep-linking into /wallet/cards/{id}?new=1
//   held:    every feeder is in the wallet → show value_when_held copy
//            and a single "Set up pooling" CTA that smooth-scrolls to
//            the trifecta_pool catalog row.
//
// The block is the page's seat for "you're missing a high-leverage card"
// — it's the only cross-card hint that survives on the per-card page.
// Generic recommendations still belong on /recommendations.

import type { Route } from "next";
import Link from "next/link";
import type { CardDatabase } from "@/lib/data/loader";
import type { WalletCardHeld } from "@/lib/profile/types";

interface Props {
  pair: {
    feeder_card_ids: string[];
    pair_role: "currency_pooler" | "category_specialist" | "annual_credit_stacker";
    value_when_held: string;
    value_when_missing: string;
    recommendation_priority: "first" | "high" | "normal";
  };
  cardsHeld: WalletCardHeld[];
  db: CardDatabase;
}

export function FeederPairBlock({ pair, cardsHeld, db }: Props) {
  const heldIds = new Set(cardsHeld.map((h) => h.card_id));
  const missing = pair.feeder_card_ids.filter((id) => !heldIds.has(id));
  const allHeld = missing.length === 0;

  return (
    <section
      className="feeder-pair-block"
      data-state={allHeld ? "held" : "missing"}
      aria-label="Pair this card"
    >
      <div className="feeder-pair-head">
        <span className="eyebrow">
          {allHeld ? "Your wallet pair" : "Your highest-leverage next card"}
        </span>
      </div>
      <p className="feeder-pair-line">
        {allHeld ? pair.value_when_held : pair.value_when_missing}
      </p>
      <div className="feeder-pair-actions">
        {allHeld ? (
          <button
            type="button"
            className="btn btn-primary"
            onClick={scrollToPool}
          >
            Set up pooling
          </button>
        ) : (
          missing.map((id) => {
            const c = db.cardById.get(id);
            const name = c?.name ?? id;
            return (
              <Link
                key={id}
                href={`/wallet/cards/${id}?new=1` as Route}
                className="btn btn-primary"
              >
                Add {name}
              </Link>
            );
          })
        )}
      </div>
    </section>
  );
}

// Smooth-scroll to the pooling row in the catalog. The MoneyFindRow
// for trifecta_pool carries data-play-id; we look it up by attribute
// rather than wiring a ref through the entire catalog tree.
function scrollToPool() {
  const el = document.querySelector('[data-play-id="trifecta_pool"]');
  if (el && "scrollIntoView" in el) {
    (el as HTMLElement).scrollIntoView({ behavior: "smooth", block: "center" });
  }
}
