"use client";

// One row in the catalog. Renders a clickbait headline, a personalization
// sentence, a $value chip (or a probe prompt when value depends on a
// missing signal), the item-appropriate question + tristate chips, and
// an expand-on-click panel with mechanism / how-to / source.

import { useState } from "react";
import type { ScoredFind, FindStatus } from "@/lib/engine/moneyFind";
import { fmt } from "@/lib/utils/format";

interface Props {
  find: ScoredFind;
  onMark: (status: FindStatus) => void;
  onProbeClick?: (promptId: string) => void; // open the cold prompt inline
}

const QUESTION_LABELS: Record<string, { question: string; chips: { value: FindStatus; label: string }[] }> = {
  spending_here: {
    question: "Spending here regularly?",
    chips: [
      { value: "using", label: "Yes — already" },
      { value: "going_to", label: "I should" },
      { value: "skip", label: "Not me" },
    ],
  },
  claimed_this_year: {
    question: "Claimed this year?",
    chips: [
      { value: "using", label: "Done" },
      { value: "going_to", label: "Going to" },
      { value: "skip", label: "Skip it" },
    ],
  },
  have_done_this: {
    question: "Done this redemption?",
    chips: [
      { value: "using", label: "Done it" },
      { value: "going_to", label: "On my list" },
      { value: "skip", label: "Not for me" },
    ],
  },
  have_filed_claim: {
    question: "Happen to you / filed a claim?",
    chips: [
      { value: "using", label: "Filed" },
      { value: "going_to", label: "Need to file" },
      { value: "skip", label: "Hasn't happened" },
    ],
  },
  set_up: {
    question: "Set up?",
    chips: [
      { value: "using", label: "Set up" },
      { value: "going_to", label: "I'll do it" },
      { value: "skip", label: "Skip it" },
    ],
  },
};

export function MoneyFindRow({ find, onMark, onProbeClick }: Props) {
  const [expanded, setExpanded] = useState(false);
  const { play, status, valueUsd, valueRange, personalSentence, needsProbe, probeQuestion } = find;
  const q = QUESTION_LABELS[play.question] ?? QUESTION_LABELS.set_up;

  return (
    <article
      className="money-find-row"
      data-status={status}
      data-skipped={find.groupSkipped ? "true" : "false"}
    >
      <header className="money-find-head" onClick={() => setExpanded((v) => !v)}>
        <div className="money-find-headline-wrap">
          <h3 className="money-find-headline">{play.headline}</h3>
          {personalSentence && (
            <p className="money-find-personal">{personalSentence}</p>
          )}
        </div>
        <ValueChip
          valueUsd={valueUsd}
          valueRange={valueRange}
          needsProbe={needsProbe}
        />
      </header>

      {needsProbe && probeQuestion && (
        <button
          type="button"
          className="money-find-probe"
          onClick={(e) => {
            e.stopPropagation();
            const m = play.personalization_template.match(/\{cold:([^}]+)\}/);
            if (m && onProbeClick) onProbeClick(m[1]);
          }}
        >
          {probeQuestion} → tap to answer
        </button>
      )}

      <div className="money-find-question">
        <span className="question-text">{q.question}</span>
        <div className="money-find-tristate">
          {q.chips.map((c) => (
            <button
              key={c.value}
              type="button"
              className="status-chip"
              data-active={status === c.value ? "true" : "false"}
              data-tone={c.value}
              onClick={() => onMark(c.value === status ? "unset" : c.value)}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {expanded && (
        <div className="money-find-expand">
          <Section title="How it works" body={play.mechanism_md} />
          <Section title="What to do" body={play.how_to_md} />
          {play.conditions_md && (
            <Section title="Conditions" body={play.conditions_md} />
          )}
          {play.action_label && (
            <button type="button" className="btn btn-primary money-find-cta">
              {play.action_label}
            </button>
          )}
          {play.source_urls.length > 0 && (
            <div className="money-find-sources">
              {play.source_urls.map((u, i) => (
                <a key={i} href={u} target="_blank" rel="noreferrer">
                  source ↗
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </article>
  );
}

function ValueChip({
  valueUsd,
  valueRange,
  needsProbe,
}: {
  valueUsd: number | null;
  valueRange: [number, number] | null;
  needsProbe: boolean;
}) {
  if (needsProbe) {
    return (
      <div className="money-find-value money-find-value-probe">
        <span>?</span>
        <small>tell us</small>
      </div>
    );
  }
  if (valueRange) {
    return (
      <div className="money-find-value">
        <span className="num">
          {fmt.usd(valueRange[0])}–{fmt.usd(valueRange[1])}
        </span>
        <small>cash equivalent</small>
      </div>
    );
  }
  if (valueUsd != null && valueUsd > 0) {
    return (
      <div className="money-find-value">
        <span className="num">{fmt.usd(valueUsd)}</span>
        <small>per year</small>
      </div>
    );
  }
  return null;
}

function Section({ title, body }: { title: string; body: string }) {
  // Body is markdown-ish — render newlines as breaks and escape HTML.
  return (
    <div className="money-find-section">
      <div className="eyebrow">{title}</div>
      <div className="money-find-section-body">
        {body.split(/\n+/).map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
    </div>
  );
}
