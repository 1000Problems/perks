"use client";

// Adaptive Hero region.
//
// Render priority (top → bottom):
//   1. ValueThesisHero — when the card has a `value_thesis` block. Always
//      wins; this is the celebration / orientation block the redesign
//      anchored on (TASK-card-page-redesign).
//   2. HotHero — high data depth: top 3 ranked money-finds with primary
//      action tiles. Only rendered when no value_thesis exists.
//   3. WarmHero — partial data depth: progress bar + 1-2 quick wins.
//      Only rendered when no value_thesis exists.
//   4. null — cold-state users with no value_thesis see no hero; the
//      catalog groups carry the page on their own. (The legacy
//      ColdHero "answer 3 questions" panel was removed; it duplicated
//      the Brands & Trips settings page.)

import type { ScoredFind } from "@/lib/engine/moneyFind";
import type { HeroSummary } from "@/lib/engine/heroState";
import type { PlayGroupId } from "@/lib/data/loader";
import type { WalletCardHeld } from "@/lib/profile/types";
import { fmt } from "@/lib/utils/format";
import { ValueThesisHero } from "./ValueThesisHero";

type EcosystemLine = {
  text: string;
  show_if_holds_any: string[];
};

type ValueThesis = {
  headline: string;
  net_af_line: string;
  structural_edge: string;
  ecosystem_line?: EcosystemLine;
};

interface Props {
  summary: HeroSummary;
  topFinds: ScoredFind[];
  valueThesis?: ValueThesis;
  groupedFinds: Map<PlayGroupId, ScoredFind[]>;
  cardsHeld: WalletCardHeld[];
}

export function HeroAdaptive({
  summary,
  topFinds,
  valueThesis,
  groupedFinds,
  cardsHeld,
}: Props) {
  if (valueThesis) {
    return (
      <ValueThesisHero
        thesis={valueThesis}
        groupedFinds={groupedFinds}
        cardsHeld={cardsHeld}
      />
    );
  }

  if (summary.state === "hot") {
    return (
      <section className="hero-adaptive" data-state="hot">
        <HotHero topFinds={topFinds} />
      </section>
    );
  }

  if (summary.state === "warm") {
    return (
      <section className="hero-adaptive" data-state="warm">
        <WarmHero summary={summary} topFinds={topFinds} />
      </section>
    );
  }

  // Cold state without a value_thesis — render no hero. The page
  // proceeds straight to the catalog groups.
  return null;
}

function WarmHero({
  summary,
  topFinds,
}: {
  summary: HeroSummary;
  topFinds: ScoredFind[];
}) {
  const pct = Math.round(summary.dataDepth * 100);
  return (
    <div className="hero-warm">
      <div className="hero-headline-eyebrow">Finding money on this card</div>
      <h2 className="hero-headline">
        {summary.catalogAnswered} of {summary.catalogTotal} answered. Keep going.
      </h2>
      <div className="hero-progress">
        <div className="hero-progress-fill" style={{ width: `${pct}%` }} />
      </div>
      {topFinds.length > 0 && (
        <div className="hero-quick-wins">
          {topFinds.slice(0, 2).map((f) => (
            <QuickWinTile key={f.play.id} find={f} />
          ))}
        </div>
      )}
    </div>
  );
}

function HotHero({ topFinds }: { topFinds: ScoredFind[] }) {
  return (
    <div className="hero-hot">
      <div className="hero-headline-eyebrow">Top money-finds</div>
      <h2 className="hero-headline">
        Three highest-ROI moves on this card right now
      </h2>
      <div className="hero-top-finds">
        {topFinds.slice(0, 3).map((f) => (
          <QuickWinTile key={f.play.id} find={f} prominent />
        ))}
      </div>
    </div>
  );
}

function QuickWinTile({
  find,
  prominent = false,
}: {
  find: ScoredFind;
  prominent?: boolean;
}) {
  return (
    <div className="quick-win" data-prominent={prominent ? "true" : "false"}>
      <div className="quick-win-headline">{find.play.headline}</div>
      {find.personalSentence && (
        <div className="quick-win-personal">{find.personalSentence}</div>
      )}
      <div className="quick-win-value">
        {find.valueUsd != null && find.valueUsd > 0 && (
          <span className="num">{fmt.usd(find.valueUsd)}</span>
        )}
        {find.valueRange && (
          <span className="num">
            {fmt.usd(find.valueRange[0])}–{fmt.usd(find.valueRange[1])}
          </span>
        )}
      </div>
    </div>
  );
}
