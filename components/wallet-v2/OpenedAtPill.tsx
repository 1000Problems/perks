"use client";

// OpenedAtPill — the inline "Got it Apr 2024" / "When did you get this card?"
// affordance that sits under the card name in the identity strip.
//
// Two states:
//   - opened_at set → "Got it {Mon YYYY}" with a button that opens the picker
//   - opened_at null → primary nudge "When did you get this card?"
//
// The picker is a small inline month/year select pair. Persistence flows
// through the parent's onChange (CardHero's handlePatch). We don't own
// state beyond the open/closed toggle.

import { useEffect, useRef, useState } from "react";
import {
  MONTH_LABELS,
  formatMonYear,
  parseYM,
  setYM,
} from "@/lib/utils/openedAt";

interface Props {
  /** Canonical YYYY-MM-01 string, or undefined when unset. */
  openedAt: string | undefined;
  /** Called with the new YYYY-MM-01 string. Parent persists. */
  onChange: (next: string) => void;
}

export function OpenedAtPill({ openedAt, onChange }: Props) {
  const [editing, setEditing] = useState(false);
  const [year, month] = parseYM(openedAt);
  const today = new Date();
  const ref = useRef<HTMLDivElement | null>(null);

  // Click-outside closes the picker. Avoids a sticky open state when the
  // user clicks elsewhere on the page.
  useEffect(() => {
    if (!editing) return;
    function onDocClick(e: MouseEvent) {
      if (!ref.current) return;
      if (e.target instanceof Node && !ref.current.contains(e.target)) {
        setEditing(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [editing]);

  const display = formatMonYear(openedAt);

  function commitMonth(m: number) {
    const y = year ?? today.getFullYear();
    onChange(setYM(openedAt, y, m));
  }

  function commitYear(y: number) {
    const m = month ?? today.getMonth() + 1;
    onChange(setYM(openedAt, y, m));
  }

  if (editing) {
    return (
      <div className="opened-at-pill" data-state="editing" ref={ref}>
        <span className="opened-at-label">Opened</span>
        <select
          className="opened-at-select"
          value={month ?? ""}
          onChange={(e) => commitMonth(Number(e.target.value))}
          aria-label="Opening month"
        >
          <option value="" disabled>
            Month
          </option>
          {MONTH_LABELS.map((m, i) => (
            <option key={m} value={i + 1}>
              {m}
            </option>
          ))}
        </select>
        <select
          className="opened-at-select"
          value={year ?? ""}
          onChange={(e) => commitYear(Number(e.target.value))}
          aria-label="Opening year"
        >
          <option value="" disabled>
            Year
          </option>
          {Array.from({ length: 12 }).map((_, i) => {
            const y = today.getFullYear() - i;
            return (
              <option key={y} value={y}>
                {y}
              </option>
            );
          })}
        </select>
        <button
          type="button"
          className="opened-at-done"
          onClick={() => setEditing(false)}
        >
          Done
        </button>
      </div>
    );
  }

  if (display) {
    return (
      <button
        type="button"
        className="opened-at-pill"
        data-state="set"
        onClick={() => setEditing(true)}
        aria-label={`Opened ${display}. Click to edit.`}
      >
        <span className="opened-at-label">Got it</span>
        <span className="opened-at-value">{display}</span>
        <span className="opened-at-edit" aria-hidden>
          ✎
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      className="opened-at-pill"
      data-state="empty"
      onClick={() => setEditing(true)}
    >
      When did you get this card?
    </button>
  );
}
