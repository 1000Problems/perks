// CardArrivalHero — the moment-of-arrival hero strip at the top of
// /wallet/cards/[id]. Reads the user's spend profile against the card's
// earning rules at the program's median cpp via the engine's
// yearlyEarningEstimate helper, then renders a large dollar number
// with a one-line subline.
//
// Two states:
//   - cold start (no spend profile) → "—" with a prompt subline
//   - populated → "$X,XXX in projected rewards from your spend"
//
// Server-renderable. The math is pure — no client interactivity here.
// The strip sits between BackLink and DeadlinesStrip in CardHero.

import type { Card, CardDatabase } from "@/lib/data/loader";
import type { UserProfile } from "@/lib/profile/types";
import { yearlyEarningEstimate } from "@/lib/engine/cardValue";
import { fmt } from "@/lib/utils/format";

interface Props {
  card: Card;
  profile: UserProfile;
  db: CardDatabase;
  isNew: boolean;
}

function hasAnySpend(profile: UserProfile): boolean {
  for (const v of Object.values(profile.spend_profile)) {
    if ((v ?? 0) > 0) return true;
  }
  return false;
}

export function CardArrivalHero({ card, profile, db, isNew }: Props) {
  const populated = hasAnySpend(profile);
  const value = populated ? yearlyEarningEstimate(card, profile, db) : 0;
  const showColdState = !populated || value <= 0;

  const subline = (() => {
    if (showColdState) {
      return "Add your spend to see projected rewards.";
    }
    return isNew
      ? "projected rewards if you add this card"
      : "projected rewards from your spend";
  })();

  return (
    <section
      className="card-arrival-hero"
      data-state={showColdState ? "cold" : "populated"}
      aria-label="Projected annual rewards"
    >
      <div className="card-arrival-hero-number">
        {showColdState ? "—" : fmt.usd(value)}
      </div>
      <div className="card-arrival-hero-subline">{subline}</div>
    </section>
  );
}
