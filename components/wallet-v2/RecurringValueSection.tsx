// RecurringValueSection — repeatable per-event credits on the per-card
// page. Reads card.recurring_credits[] (v3 schema addition) and renders
// one RecurringCreditCard per entry. Sits between EarningSection and
// FeederPairBlock in CardHero.

import type { Card, Program } from "@/lib/data/loader";
import type { CardPlayState } from "@/lib/profile/types";
import {
  RecurringCreditCard,
  type FrequencyBucket,
} from "./RecurringCreditCard";

interface Props {
  card: Card;
  program: Program | undefined;
  playState: CardPlayState[];
  onPickBucket: (creditId: string, bucket: FrequencyBucket) => void;
}

const FREQ_PLAY_PREFIX = "recurring_freq:";

export function RecurringValueSection({
  card,
  program,
  playState,
  onPickBucket,
}: Props) {
  const credits = card.recurring_credits ?? [];
  if (credits.length === 0) return null;

  // Median cpp drives the stacking math earn line. Falls back to portal
  // and then 1.0 — same fallback chain yearlyEarningEstimate uses.
  const cpp =
    program?.median_redemption_cpp ??
    program?.portal_redemption_cpp ??
    program?.fixed_redemption_cpp ??
    1;

  return (
    <section
      className="recurring-value-section"
      aria-label="Recurring credits"
    >
      <div className="recurring-value-section-head">
        <span className="eyebrow">Recurring value</span>
        <h2 className="recurring-value-section-title">
          Credits that repeat — every time you use them
        </h2>
        <p className="recurring-value-section-sub">
          Distinct from once-yearly credits. Tap a frequency to see what
          this is worth on your travel pattern.
        </p>
      </div>

      <div className="recurring-value-section-body">
        {credits.map((credit) => {
          const existing = playState.find(
            (p) => p.play_id === `${FREQ_PLAY_PREFIX}${credit.id}`,
          );
          return (
            <RecurringCreditCard
              key={credit.id}
              credit={credit}
              cppForStackMath={cpp}
              existing={existing}
              onPickBucket={onPickBucket}
            />
          );
        })}
      </div>
    </section>
  );
}
