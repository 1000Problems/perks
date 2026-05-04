"use client";

// ValueThesisHero — the celebration block at the top of the per-card
// money-find page.
//
// Three concrete dollar-anchored lines: net AF math, structural edge,
// and an optional ecosystem play that only renders when the user
// already holds one of the listed sibling cards. The legacy section-
// chip row was removed in the v2 redesign — catalog headers below
// preview each section with their own content; the chips were
// duplication that masqueraded as navigation.

import type { WalletCardHeld } from "@/lib/profile/types";

type EcosystemLine = {
  text: string;
  show_if_holds_any: string[];
};

interface Props {
  thesis: {
    headline: string;
    net_af_line: string;
    structural_edge: string;
    ecosystem_line?: EcosystemLine;
  };
  cardsHeld: WalletCardHeld[];
}

export function ValueThesisHero({ thesis, cardsHeld }: Props) {
  const heldIds = new Set(cardsHeld.map((h) => h.card_id));
  const showEcosystem =
    thesis.ecosystem_line != null &&
    thesis.ecosystem_line.show_if_holds_any.some((id) => heldIds.has(id));

  return (
    <section className="hero-adaptive value-thesis-hero" data-state="thesis">
      <div className="value-thesis-body">
        <div className="hero-headline-eyebrow">{thesis.headline}</div>
        <p className="value-thesis-line">{thesis.net_af_line}</p>
        <p className="value-thesis-line">{thesis.structural_edge}</p>
        {showEcosystem && thesis.ecosystem_line && (
          <p className="value-thesis-line value-thesis-line-ecosystem">
            {thesis.ecosystem_line.text}
          </p>
        )}
      </div>
    </section>
  );
}
