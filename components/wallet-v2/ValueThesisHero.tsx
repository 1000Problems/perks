"use client";

// ValueThesisHero — the celebration block at the top of the per-card
// money-find page. Replaces the old cold-prompts panel.
//
// Three concrete dollar-anchored lines (net AF math, structural edge,
// and an optional ecosystem play that only shows when the user holds
// one of the listed sibling cards), then a single non-interactive row
// of section chips that previews each catalog group with its $value
// total. The chip row orients the reader to what's below without
// stealing the click.

import type { PlayGroupId } from "@/lib/data/loader";
import type { ScoredFind } from "@/lib/engine/moneyFind";
import { ALL_GROUPS, GROUP_LABELS } from "@/lib/engine/moneyFind";
import type { WalletCardHeld } from "@/lib/profile/types";
import { fmt } from "@/lib/utils/format";

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
  groupedFinds: Map<PlayGroupId, ScoredFind[]>;
  cardsHeld: WalletCardHeld[];
}

function sumGroupValue(finds: ScoredFind[]): number {
  return finds
    .filter((f) => f.visible)
    .reduce((s, f) => {
      if (f.valueUsd != null) return s + f.valueUsd;
      if (f.valueRange != null) return s + f.valueRange[0]; // conservative
      return s;
    }, 0);
}

export function ValueThesisHero({ thesis, groupedFinds, cardsHeld }: Props) {
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

      <div className="value-thesis-chips" aria-label="Sections below">
        {ALL_GROUPS.map((group) => {
          const finds = groupedFinds.get(group) ?? [];
          if (finds.length === 0) return null;
          const total = sumGroupValue(finds);
          return (
            <div key={group} className="value-thesis-chip">
              <span className="value-thesis-chip-label">
                {GROUP_LABELS[group]}
              </span>
              {total > 0 && (
                <span className="value-thesis-chip-value">
                  {fmt.usd(total)}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
