"use client";

// Live deadlines strip. Renders only when the card has at least one
// time-bound mechanic within 90 days of `today`. v0 deadlines are
// hardcoded per card_id; future iterations will derive these from
// play.expires_at on the card's plays block (TASK-strata-audit-v0).

interface Deadline {
  text: string;
  date: string; // YYYY-MM-DD
}

const HARDCODED: Record<string, Deadline[]> = {
  citi_strata_premier: [
    { text: "Citi point-sharing closes", date: "2026-05-17" },
    { text: "Choice Privileges 1:2 → 1:1.5 transfer ratio drop", date: "2026-04-19" },
  ],
  citi_double_cash: [
    { text: "Citi point-sharing closes", date: "2026-05-17" },
  ],
  citi_custom_cash: [
    { text: "Citi point-sharing closes", date: "2026-05-17" },
  ],
};

function daysUntil(iso: string, today: Date): number {
  const target = new Date(iso + "T00:00:00Z");
  const t0 = new Date(today.toISOString().slice(0, 10) + "T00:00:00Z");
  return Math.round((target.getTime() - t0.getTime()) / (1000 * 60 * 60 * 24));
}

interface Props {
  cardId: string;
  today?: Date;
}

export function DeadlinesStrip({ cardId, today = new Date() }: Props) {
  const list = HARDCODED[cardId] ?? [];
  const upcoming = list
    .map((d) => ({ ...d, days: daysUntil(d.date, today) }))
    .filter((d) => d.days >= 0 && d.days <= 90)
    .sort((a, b) => a.days - b.days);

  if (upcoming.length === 0) return null;

  return (
    <div className="deadlines">
      <span className="deadlines-label">Live</span>
      <div className="deadlines-list">
        {upcoming.map((d, i) => (
          <span key={i} className="deadlines-item">
            <strong>{d.text}</strong>
            <span className="days">
              — {d.days === 0 ? "today" : `${d.days} day${d.days === 1 ? "" : "s"} left`}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
