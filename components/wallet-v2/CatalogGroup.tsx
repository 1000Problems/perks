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
import type { ResolvedSource } from "./perkSource";
import type { PerkFlag } from "@/lib/profile/server";

interface Props {
  group: PlayGroupId;
  finds: ScoredFind[];
  skipped: boolean;
  onToggleGroupSkip: () => void;
  onMarkFind: (playId: string, status: FindStatus) => void;
  onProbeClick: (promptId: string) => void;
  /** Card id needed by the perk-flag actions inside MoneyFindRow's */
  /** ⓘ popover. */
  cardId: string;
  /** Optional per-card map of play.id → resolved source + perk identity. */
  playSourceMap?: Map<string, ResolvedSource>;
  /** Optional per-card map of perk_name → user's open flag. */
  perkFlags?: Map<string, PerkFlag>;
  /** Optional inline source link rendered in the group head. */
  /** Editorial layout — derived in CardHero from the first row's */
  /** resolved source. When omitted, the head omits the link. */
  groupSourceUrl?: string;
  groupSourceLabel?: string;
}

export function CatalogGroup({
  group,
  finds,
  skipped,
  onToggleGroupSkip,
  onMarkFind,
  onProbeClick,
  cardId,
  playSourceMap,
  perkFlags,
  groupSourceUrl,
  groupSourceLabel,
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
        <div className="catalog-group-head-l">
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
          {groupSourceUrl && (
            <a
              className="catalog-group-source"
              href={groupSourceUrl}
              target="_blank"
              rel="noreferrer"
            >
              {groupSourceLabel ?? "source"}
              <span aria-hidden="true" style={{ marginLeft: 3 }}>↗</span>
            </a>
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
                {explicitlyKept.map((f) => {
                  const rs = playSourceMap?.get(f.play.id);
                  return (
                    <MoneyFindRow
                      key={f.play.id}
                      find={f}
                      onMark={(s) => onMarkFind(f.play.id, s)}
                      onProbeClick={onProbeClick}
                      cardId={cardId}
                      resolvedSource={rs}
                      myFlag={
                        rs ? (perkFlags?.get(rs.perkName) ?? null) : null
                      }
                    />
                  );
                })}
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
              otherFinds.map((f) => {
                const rs = playSourceMap?.get(f.play.id);
                return (
                  <MoneyFindRow
                    key={f.play.id}
                    find={f}
                    onMark={(s) => onMarkFind(f.play.id, s)}
                    onProbeClick={onProbeClick}
                    cardId={cardId}
                    resolvedSource={rs}
                    myFlag={
                      rs ? (perkFlags?.get(rs.perkName) ?? null) : null
                    }
                  />
                );
              })}
          </>
        ) : (
          visibleFinds.map((f) => {
            const rs = playSourceMap?.get(f.play.id);
            return (
              <MoneyFindRow
                key={f.play.id}
                find={f}
                onMark={(s) => onMarkFind(f.play.id, s)}
                onProbeClick={onProbeClick}
                cardId={cardId}
                resolvedSource={rs}
                myFlag={
                  rs ? (perkFlags?.get(rs.perkName) ?? null) : null
                }
              />
            );
          })
        )}
      </div>
    </section>
  );
}
