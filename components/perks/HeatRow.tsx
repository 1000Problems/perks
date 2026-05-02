import type { SpendCategory } from "@/lib/data/types";
import { fmt, heatColor, heatTextColor } from "@/lib/utils/format";

interface Props {
  category: SpendCategory;
  rate: number;
  from: string;
  ratesNew?: number;
}

export function HeatRow({ category, rate, from, ratesNew }: Props) {
  const bg = heatColor(rate);
  const txt = heatTextColor(rate);
  const newBg = ratesNew !== undefined ? heatColor(ratesNew) : null;
  const winning = ratesNew !== undefined && ratesNew > rate;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "110px 1fr 56px",
        alignItems: "center",
        gap: 10,
        padding: "6px 0",
      }}
    >
      <div
        style={{
          fontSize: 12,
          color: "var(--ink-2)",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span style={{ color: "var(--ink-4)", fontSize: 11, width: 10, textAlign: "center" }}>
          {category.icon}
        </span>
        {category.label}
      </div>
      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
        <div
          className="hm-cell"
          style={{
            background: bg,
            color: txt,
            height: 22,
            flex: 1,
            opacity: ratesNew !== undefined ? 0.55 : 1,
          }}
        >
          {fmt.pct(rate)}
        </div>
        {ratesNew !== undefined && newBg !== null && (
          <>
            <span
              style={{
                color: "var(--ink-4)",
                fontSize: 10,
                fontFamily: "var(--font-mono), ui-monospace, monospace",
              }}
            >
              →
            </span>
            <div
              className="hm-cell"
              style={{
                background: newBg,
                color: txt,
                height: 22,
                flex: 1,
                outline: winning ? "1.5px solid var(--pos)" : "none",
                outlineOffset: -1.5,
                fontWeight: winning ? 600 : 500,
              }}
            >
              {fmt.pct(ratesNew)}
            </div>
          </>
        )}
      </div>
      <div
        style={{
          fontSize: 10.5,
          color: "var(--ink-3)",
          fontFamily: "var(--font-mono), ui-monospace, monospace",
          textAlign: "right",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {from}
      </div>
    </div>
  );
}
