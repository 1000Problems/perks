// EarningSection — official-source earning rates for the per-card page.
// Reads card.earning[] (post-v3 enrichment with official_text /
// exclusions / source) and renders one EarningRateRow per entry. Sits
// above the catalog groups; the previous in-catalog earn rows
// (earn_dining_3x, etc.) are filtered out at the CardHero level so
// rates aren't shown twice.

import type { Card, Program } from "@/lib/data/loader";
import { EarningRateRow } from "./EarningRateRow";

interface Props {
  card: Card;
  program: Program | undefined;
}

export function EarningSection({ card, program }: Props) {
  if (!card.earning || card.earning.length === 0) return null;
  const programName = program?.name ?? "rewards";
  return (
    <section className="earning-section" aria-label="Earning rates">
      <div className="earning-section-head">
        <span className="eyebrow">Earning</span>
        <h2 className="earning-section-title">
          What this card pays on every dollar
        </h2>
        <p className="earning-section-sub">
          Official rates from the {card.issuer} card terms. Tap a row to
          see exclusions.
        </p>
      </div>
      <div className="earning-section-body">
        {card.earning.map((entry, i) => (
          <EarningRateRow
            key={`${entry.category}-${i}`}
            entry={entry}
            programName={programName}
          />
        ))}
      </div>
    </section>
  );
}
