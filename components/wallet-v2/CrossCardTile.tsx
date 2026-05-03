"use client";

// Page-level cross-card recommendation tile. Lives below the catalog
// and the mechanics zone. Gated until ≥5 catalog rows have been
// answered — until then we show a "tell us more" prompt instead of
// premature recs.
//
// Real recommendation generation is a follow-up TASK. v0 returns an
// empty array; the tile renders the empty state.

import type { Card } from "@/lib/data/loader";

interface Props {
  card: Card;
  catalogAnswered: number;
}

const GATE_THRESHOLD = 5;

export function CrossCardTile({ card: _card, catalogAnswered }: Props) {
  const ready = catalogAnswered >= GATE_THRESHOLD;

  return (
    <section className="cross-card-tile">
      <header className="hero-section-head">
        <span className="eyebrow">For your wallet</span>
        <h2 className="hero-section-title">
          {ready
            ? "Cards that fit how you use this one"
            : "We need a few more answers before we can recommend"}
        </h2>
      </header>
      {ready ? (
        <div className="cross-card-empty">
          <p>
            Specific recommendations will appear here once the
            recommender is wired in (TASK follow-up).
          </p>
        </div>
      ) : (
        <div className="cross-card-empty">
          <p>
            Mark {GATE_THRESHOLD - catalogAnswered} more rows above as
            <em> using</em>, <em>going to</em>, or <em>not for me</em> — then
            we can suggest cards that pair with your real usage.
          </p>
        </div>
      )}
    </section>
  );
}
