import { redirect } from "next/navigation";
import type { Route } from "next";
import { RecPanelDesktop } from "@/components/recommender/RecPanelDesktop";
import { RecPanelMobile } from "@/components/recommender/RecPanelMobile";
import {
  getCurrentProfile,
  getCurrentUserId,
  getUserSignals,
} from "@/lib/profile/server";
import { loadCardDatabase } from "@/lib/data/loader";
import { toSerialized } from "@/lib/data/serialized";
import {
  deriveHoldingSignals,
  mergeSignals,
} from "@/lib/engine/holdingSignals";
import { loadEngineVerdicts } from "@/lib/rules/serverEligibility";

export default async function RecommendationsPage() {
  let profile;
  let userId: string;
  try {
    [profile, userId] = await Promise.all([
      getCurrentProfile(),
      getCurrentUserId(),
    ]);
  } catch {
    redirect("/login" as Route);
  }
  // Onboarding gate — credit band first, then spend.
  if (profile.credit_score_band == null) {
    redirect("/onboarding/credit" as Route);
  }
  const hasSpend =
    Object.values(profile.spend_profile ?? {}).some((v) => (v ?? 0) > 0);
  if (!hasSpend && (profile.cards_held?.length ?? 0) === 0) {
    redirect("/onboarding/spend" as Route);
  }
  const db = loadCardDatabase();
  const serializedDb = toSerialized(db);

  // Server-side eligibility via the catalog-driven rules engine. When
  // RULES_ENGINE=client (or migrations haven't run), this returns null
  // and the rec panel falls back to the legacy in-engine path.
  const cardIds = db.cards.map((c) => c.id);
  const eligibilityOverrides = await loadEngineVerdicts(userId, cardIds);

  // Phase 4: load + merge signals server-side. rankCards in the panel
  // uses these to apply a +10% boost to candidate cards with plays
  // revealing user's "On my list" intents.
  const userSignals = await getUserSignals(userId);
  const merged = mergeSignals(
    userSignals,
    deriveHoldingSignals(profile.cards_held),
  );
  const userSignalsObject = Object.fromEntries(merged);

  return (
    <>
      <div className="hidden md:block">
        <RecPanelDesktop
          profile={profile}
          serializedDb={serializedDb}
          eligibilityOverrides={eligibilityOverrides}
          userSignals={userSignalsObject}
        />
      </div>
      <div className="block md:hidden">
        <RecPanelMobile
          profile={profile}
          serializedDb={serializedDb}
          eligibilityOverrides={eligibilityOverrides}
          userSignals={userSignalsObject}
        />
      </div>
    </>
  );
}
