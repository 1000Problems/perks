// Two-pillar value split for the recommendation hero.
//
// Replaces the single combined "+$X net / year" headline with two
// numbers side-by-side: SPEND (the floor — earned automatically when
// you spend) and PERKS (the upside — only realises if you claim it).
// Splitting them stops a card with $0 spend impact and $1k of optional
// insurance from masquerading as a +$1k recommendation.
//
// Variants:
//   - "list"  compact, used in the ranked card list (right column)
//   - "hero"  larger, used in the drill-in detail panel
//
// Fee is rendered as a small negative subtotal beneath. Year-1 SUB
// (when view === "year1") shows as a tiny third badge so the year-1
// view doesn't double-count or hide it.

import type { CardScoreComponents } from "@/lib/engine/types";
import { fmt } from "@/lib/utils/format";

type Variant = "list" | "list-stacked" | "hero";
type View = "ongoing" | "year1";

interface Props {
  components: CardScoreComponents;
  view: View;
  variant: Variant;
}

const SIZES: Record<Variant, { num: number; label: number; sub: number; gap: number }> = {
  // Side-by-side, full row right rail (desktop list).
  list: { num: 22, label: 9.5, sub: 10, gap: 14 },
  // Vertically stacked, label inline with the number — used on mobile
  // where horizontal width is at a premium.
  "list-stacked": { num: 18, label: 9.5, sub: 9.5, gap: 4 },
  // Big hero version for the detail panel.
  hero: { num: 36, label: 10.5, sub: 11, gap: 24 },
};

export function ValuePillars({ components, view, variant }: Props) {
  const { spendOngoing, perksOngoing, feeOngoing, subYear1 } = components;
  const sz = SIZES[variant];
  const showSub = view === "year1" && subYear1 > 0;
  const showFee = feeOngoing < 0;
  const isList = variant === "list" || variant === "list-stacked";
  const align = isList ? "flex-end" : "flex-start";

  // Stacked variant: each pillar is one row, label inline with number.
  if (variant === "list-stacked") {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 4,
          fontFamily: "var(--font-mono), ui-monospace, monospace",
        }}
      >
        <PillarInline
          label="SPEND"
          value={spendOngoing}
          numSize={sz.num}
          labelSize={sz.label}
          tone="confident"
        />
        <PillarInline
          label="PERKS"
          value={perksOngoing}
          numSize={sz.num}
          labelSize={sz.label}
          tone="conditional"
          captionRight={perksOngoing > 0 ? "if claimed" : undefined}
          captionSize={sz.sub}
        />
        {(showFee || showSub) && (
          <div
            style={{
              display: "flex",
              gap: 8,
              fontSize: sz.sub,
              color: "var(--ink-3)",
              marginTop: 2,
            }}
          >
            {showSub && (
              <span style={{ color: "var(--ink-2)" }}>
                +${subYear1.toLocaleString()} y1
              </span>
            )}
            {showFee && (
              <span style={{ color: "var(--neg)" }}>
                −${Math.abs(feeOngoing).toLocaleString()} fee
              </span>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: align,
        gap: isList ? 4 : 8,
      }}
    >
      <div
        style={{
          display: "flex",
          gap: sz.gap,
          alignItems: "baseline",
          // On the list variant, right-align so the pillars hug the row's
          // right edge; on the hero, left-align under the card name.
          justifyContent: isList ? "flex-end" : "flex-start",
        }}
      >
        <Pillar
          label="SPEND"
          value={spendOngoing}
          captionTop="from spending"
          numSize={sz.num}
          labelSize={sz.label}
          subSize={sz.sub}
          // Spend is the floor: confident green.
          tone="confident"
        />
        <Pillar
          label="PERKS"
          value={perksOngoing}
          captionTop="if claimed"
          numSize={sz.num}
          labelSize={sz.label}
          subSize={sz.sub}
          // Perks are conditional: muted green so the eye doesn't
          // mistake $1k of insurance for $1k in the bank.
          tone="conditional"
        />
      </div>

      {(showFee || showSub) && (
        <div
          style={{
            display: "flex",
            gap: 10,
            fontSize: sz.sub,
            color: "var(--ink-3)",
            fontFamily: "var(--font-mono), ui-monospace, monospace",
            // Match the row of pillars above so the captions don't
            // drift left or right of them.
            justifyContent: isList ? "flex-end" : "flex-start",
            width: isList ? "100%" : undefined,
          }}
        >
          {showSub && (
            <span style={{ color: "var(--ink-2)" }}>
              +${subYear1.toLocaleString()} SUB y1
            </span>
          )}
          {showFee && (
            <span style={{ color: "var(--neg)" }}>
              −${Math.abs(feeOngoing).toLocaleString()} fee
            </span>
          )}
        </div>
      )}
    </div>
  );
}

interface PillarInlineProps {
  label: string;
  value: number;
  numSize: number;
  labelSize: number;
  tone: "confident" | "conditional";
  captionRight?: string;
  captionSize?: number;
}

// Single-row pillar used in the stacked variant: "SPEND  +$247".
function PillarInline({
  label,
  value,
  numSize,
  labelSize,
  tone,
  captionRight,
  captionSize,
}: PillarInlineProps) {
  const numColor = value === 0
    ? "var(--ink-4)"
    : tone === "confident"
    ? "var(--pos)"
    : "var(--ink-2)";
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
      <span
        style={{
          fontSize: labelSize,
          color: "var(--ink-4)",
          letterSpacing: "0.08em",
        }}
      >
        {label}
      </span>
      <span
        className="num"
        style={{
          fontSize: numSize,
          color: numColor,
          fontWeight: 400,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value > 0 ? "+" : ""}
        {fmt.usd(value)}
      </span>
      {captionRight && (
        <span
          style={{
            fontSize: captionSize ?? 10,
            color: "var(--ink-3)",
          }}
        >
          {captionRight}
        </span>
      )}
    </div>
  );
}

interface PillarProps {
  label: string;
  value: number;
  captionTop: string;
  numSize: number;
  labelSize: number;
  subSize: number;
  tone: "confident" | "conditional";
}

function Pillar({
  label,
  value,
  captionTop,
  numSize,
  labelSize,
  subSize,
  tone,
}: PillarProps) {
  // Confident pillar uses --pos; conditional pillar dims toward --ink-2
  // so it reads as "soft income" without going so far that the user
  // dismisses real perk value.
  const numColor = value === 0
    ? "var(--ink-4)"
    : tone === "confident"
    ? "var(--pos)"
    : "var(--ink-2)";
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        minWidth: 0,
      }}
    >
      <span
        style={{
          fontSize: labelSize,
          color: "var(--ink-4)",
          fontFamily: "var(--font-mono), ui-monospace, monospace",
          letterSpacing: "0.08em",
          lineHeight: 1,
          marginBottom: 4,
        }}
      >
        {label}
      </span>
      <span
        className="num"
        style={{
          fontSize: numSize,
          color: numColor,
          lineHeight: 1,
          fontWeight: 400,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value > 0 ? "+" : ""}
        {fmt.usd(value)}
      </span>
      <span
        style={{
          fontSize: subSize,
          color: "var(--ink-3)",
          marginTop: 4,
          fontFamily: "var(--font-mono), ui-monospace, monospace",
          lineHeight: 1.2,
          // When perks/spend is zero, soften the caption so it doesn't
          // read like a value claim. ("if claimed" next to $0 looks odd.)
          opacity: value === 0 ? 0.55 : 1,
        }}
      >
        {value === 0 ? "—" : captionTop}
      </span>
    </div>
  );
}
