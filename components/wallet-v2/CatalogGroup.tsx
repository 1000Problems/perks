"use client";

// One group in the catalog. Header has the group label, a $value
// summary (sum of visible rows' valueUsd), and a group-level skip
// toggle. When skipped, body collapses to a single "show hidden N"
// reveal — but rows the user explicitly marked using/going_to stay
// surfaced above the collapse.

import { useState } from "react";
import type { ScoredFind, FindStatus } from "@/lib/engine/moneyFind";
import { GROUP_LABELS } from "@/lib/engine/moneyFind";
import type { PlayGroupId } from "@/lib/data/loader";
import { fmt } from "@/lib/utils/format";
import { MoneyFindRow } from "./MoneyFindRow";
import type { PerkSource } from "./perkSource";

interface Props {
  group: PlayGroupId;
  finds: ScoredFind[];
  skipped: boolean;
  onToggleGroupSkip: () => void;
  onMarkFind: (playId: string, status: FindStatus) => void;
  onProbeClick: (promptId: string) => void;
  /** Optional per-card map of play.id → source citation. */
  /** Renders an inline ⓘ link next to the row's title when present. */
  playSourceMap?: Map<string, PerkSource>;
}

export function CatalogGroup({
  group,
  finds,
  skipped,
  onToggleGroupSkip,
  onMarkFind,
  onProbeClick,
  playSourceMap,
}: Props) {
  const [showHidden, setShowHidden] = useState(false);
  const visibleFinds = finds.filter((f) => f.visible);
  const valueSum = visibleFinds.reduce((s, f) => {
    if (f.valueUsd != null) return s + f.valueUsd;
    if (f.valueRange != null) return s + f.valueRange[0]; // conservative
    return s;
  }, 0);

  // When skipped: keep rows the user explicitly opted into; hide the rest.
  const explicitlyKept = visibleFinds.filter(
    (f) => f.status === "using" || f.status === "going_to",
  );
  const otherFinds = visibleFinds.filter(
    (f) => f.status !== "using" && f.status !== "going_to",
  );

  if (visibleFinds.length === 0 && !skipped) return null;

  return (
    <section
      className="catalog-group"
      data-skipped={skipped ? "true" : "false"}
    >
      <header className="catalog-group-head">
        <div>
          <h2 className="catalog-group-label">{GROUP_LABELS[group]}</h2>
          {valueSum > 0 && !skipped && (
            <div className="catalog-group-summary">
              ~{fmt.usd(valueSum)} in opportunities
            </div>
          )}
          {skipped && (
            <div className="catalog-group-summary muted">
              Skipped — {otherFinds.length} hidden
            </div>
          )}
        </div>
        <button
          type="button"
          className="catalog-group-skip"
          onClick={onToggleGroupSkip}
        >
          {skipped ? "Unskip group" : "Not interested"}
        </button>
      </header>

      <div className="catalog-group-body">
        {skipped ? (
          <>
            {explicitlyKept.length > 0 && (
              <>
                <div className="catalog-group-kept-label">
                  But you said yes to these:
                </div>
                {explicitlyKept.map((f) => (
                  <MoneyFindRow
                    key={f.play.id}
                    find={f}
                    onMark={(s) => onMarkFind(f.play.id, s)}
                    onProbeClick={onProbeClick}
                    source={playSourceMap?.get(f.play.id)}
                  />
                ))}
              </>
            )}
            {otherFinds.length > 0 && (
              <button
                type="button"
                className="catalog-group-show-hidden"
                onClick={() => setShowHidden((v) => !v)}
              >
                {showHidden
                  ? "Hide skipped items"
                  : `Show ${otherFinds.length} hidden`}
              </button>
            )}
            {showHidden &&
              otherFinds.map((f) => (
                <MoneyFindRow
                  key={f.play.id}
                  find={f}
                  onMark={(s) => onMarkFind(f.play.id, s)}
                  onProbeClick={onProbeClick}
                  source={playSourceMap?.get(f.play.id)}
                />
              ))}
          </>
        ) : (
          visibleFinds.map((f) => (
            <MoneyFindRow
              key={f.play.id}
              find={f}
              onMark={(s) => onMarkFind(f.play.id, s)}
              onProbeClick={onProbeClick}
              source={playSourceMap?.get(f.play.id)}
            />
          ))
        )}
      </div>
    </section>
  );
}
