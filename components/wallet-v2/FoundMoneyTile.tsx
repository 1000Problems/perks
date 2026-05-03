"use client";

// The found-money tile that anchors every card edit panel. Renders a
// range when signals are sparse and tightens to a point estimate as the
// user fills in fields. The headline framing is deliberate ("found
// money waiting for you") — the page's job is to motivate the user to
// fill in more signals, not to feel like paperwork.

import type { FoundMoneyV2 } from "@/lib/engine/foundMoney";
import { fmt } from "@/lib/utils/format";

interface Props {
  value: FoundMoneyV2;
}

export function FoundMoneyTile({ value }: Props) {
  const { low, high, point, signalsFilled, signalsTotal } = value;
  const safeTotal = Math.max(1, signalsTotal);
  const pct = Math.round(
    (Math.min(signalsFilled, safeTotal) / safeTotal) * 100,
  );
  const sharp = signalsFilled >= safeTotal - 2;
  return (
    <div className="fm-tile">
      <div className="fm-headline">
        This card has{" "}
        <strong>found money</strong> waiting for you
      </div>
      <div className="fm-amount num">
        {sharp ? (
          fmt.usd(point)
        ) : (
          <>
            <span className="small">{fmt.usd(low)}–</span>
            {fmt.usd(high)}
          </>
        )}
      </div>
      <div className="fm-progress" aria-hidden>
        <div className="fm-progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="fm-meta">
        <span>
          {signalsFilled} of {signalsTotal} signals filled · {pct}%
        </span>
        <span className="fm-meta-faint">tightens with every signal</span>
      </div>
    </div>
  );
}
