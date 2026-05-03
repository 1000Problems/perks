"use client";

// Adaptive Hero region. Three states based on data depth:
//   cold — render up to 3 cold-prompt question chips
//   warm — running progress + 1-2 quick wins
//   hot  — top 3 ranked money-finds with primary actions

import type { ColdPrompt } from "@/lib/data/loader";
import type { ScoredFind } from "@/lib/engine/moneyFind";
import type { HeroSummary } from "@/lib/engine/heroState";
import { fmt } from "@/lib/utils/format";

interface Props {
  summary: HeroSummary;
  coldPrompts: ColdPrompt[];
  coldAnswers: Record<string, string>;
  topFinds: ScoredFind[];
  onAnswerColdPrompt: (promptId: string, answer: string) => void;
}

export function HeroAdaptive({
  summary,
  coldPrompts,
  coldAnswers,
  topFinds,
  onAnswerColdPrompt,
}: Props) {
  return (
    <section
      className="hero-adaptive"
      data-state={summary.state}
    >
      {summary.state === "cold" && (
        <ColdHero
          prompts={coldPrompts}
          coldAnswers={coldAnswers}
          onAnswer={onAnswerColdPrompt}
        />
      )}
      {summary.state === "warm" && (
        <WarmHero summary={summary} topFinds={topFinds} />
      )}
      {summary.state === "hot" && <HotHero topFinds={topFinds} />}
    </section>
  );
}

function ColdHero({
  prompts,
  coldAnswers,
  onAnswer,
}: {
  prompts: ColdPrompt[];
  coldAnswers: Record<string, string>;
  onAnswer: (promptId: string, answer: string) => void;
}) {
  if (prompts.length === 0) return null;
  return (
    <div className="hero-cold">
      <div className="hero-headline-eyebrow">Find money on this card</div>
      <h2 className="hero-headline">
        Answer 3 quick questions to start finding money
      </h2>
      <p className="hero-sub">
        Each answer unlocks specific opportunities for you below — usually
        worth several hundred dollars.
      </p>
      <div className="cold-prompts">
        {prompts.map((p) => {
          const current = coldAnswers[p.id] ?? null;
          return (
            <div key={p.id} className="cold-prompt">
              <div className="cold-prompt-question">{p.question}</div>
              <div className="cold-prompt-chips">
                {p.answer_chips.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    className="status-chip"
                    data-active={current === c.value ? "true" : "false"}
                    onClick={() => onAnswer(p.id, c.value)}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
              <div className="cold-prompt-unlock">
                Unlocks ~{fmt.usd(p.unlocks_value_estimate_usd)} of opportunities
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
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
