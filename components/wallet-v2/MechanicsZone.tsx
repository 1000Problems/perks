"use client";

// Calendar-driven items only. AF clock, SUB eligibility window,
// devaluation deadlines, points-at-risk if closed. Everything here has
// a date attached and changes meaning as the date approaches.

import { useMemo } from "react";
import type { Card } from "@/lib/data/loader";
import type { WalletCardHeld } from "@/lib/profile/types";
import { fmt } from "@/lib/utils/format";

const MONTH = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

interface Mechanic {
  label: string;
  detail: string;
  countdownDays: number | null;
  tone: "default" | "warn" | "neg";
}

interface Props {
  card: Card;
  held: WalletCardHeld;
  today?: Date;
}

function daysUntil(iso: string, today: Date): number {
  const t = new Date(iso + "T00:00:00Z");
  const t0 = new Date(today.toISOString().slice(0, 10) + "T00:00:00Z");
  return Math.round((t.getTime() - t0.getTime()) / (1000 * 60 * 60 * 24));
}

export function MechanicsZone({ card, held, today = new Date() }: Props) {
  const mechanics = useMemo<Mechanic[]>(() => {
    const list: Mechanic[] = [];
    const fee = card.annual_fee_usd ?? 0;

    // Annual-fee clock.
    if (fee > 0 && held.opened_at) {
      const [y, m] = held.opened_at.split("-").map(Number);
      if (y && m) {
        const next = new Date(today.getFullYear(), m - 1, 1);
        if (next <= today) next.setFullYear(today.getFullYear() + 1);
        const days = Math.ceil(
          (next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
        );
        list.push({
          label: `Next $${fee} fee posts ${MONTH[next.getMonth()]} ${next.getFullYear()}`,
          detail:
            days <= 60
              ? "Call retention 30–60 days before — typical $50–100 offer."
              : "Use this window to claim any remaining annual credits.",
          countdownDays: days,
          tone: days <= 60 ? "warn" : "default",
        });
      }
    }

    // Time-bound plays from card_plays with expires_at within 90 days.
    for (const p of card.card_plays ?? []) {
      if (!p.expires_at) continue;
      const days = daysUntil(p.expires_at, today);
      if (days < 0 || days > 90) continue;
      list.push({
        label: p.headline,
        detail: p.mechanism_md.split(/\n/)[0] ?? "",
        countdownDays: days,
        tone: days <= 14 ? "neg" : "warn",
      });
    }

    // Closing-the-card warning when status_v2 = considering_close.
    if (held.card_status_v2 === "considering_close") {
      const isThankYou = (card.currency_earned ?? "")
        .toLowerCase()
        .includes("thankyou");
      if (isThankYou) {
        list.push({
          label: "You're considering closing — points die in 60 days",
          detail:
            "Move TY points to your Strata Premier or transfer to a partner before closing.",
          countdownDays: null,
          tone: "neg",
        });
      }
    }

    return list.sort(
      (a, b) =>
        (a.countdownDays ?? Infinity) - (b.countdownDays ?? Infinity),
    );
  }, [card, held, today]);

  if (mechanics.length === 0) return null;

  return (
    <section className="mechanics-zone">
      <header className="hero-section-head">
        <span className="eyebrow">Calendar</span>
        <h2 className="hero-section-title">Things with a clock on them</h2>
      </header>
      <div className="mechanic-list">
        {mechanics.map((m, i) => (
          <div key={i} className="mechanic-row" data-tone={m.tone}>
            <div className="mechanic-body">
              <div className="mechanic-label">{m.label}</div>
              <div className="mechanic-detail">{m.detail}</div>
            </div>
            {m.countdownDays != null && (
              <div className="mechanic-countdown mono">
                {m.countdownDays === 0
                  ? "today"
                  : `${m.countdownDays} ${m.countdownDays === 1 ? "day" : "days"}`}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// Silence unused-format import in some build configs.
void fmt;
