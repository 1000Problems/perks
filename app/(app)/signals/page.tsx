// /signals — Phase 5 of signal-first architecture.
//
// Read-only transparency view: every signal in the catalog grouped by
// namespace, showing the user's current state plus where it came from.
// Auto-derived holdings.* signals are clearly distinguished from
// user-clicked ones. Editing happens on the per-card hero page; this
// view focuses on letting the user see what the system knows.

import { redirect } from "next/navigation";
import {
  getCurrentProfile,
  getCurrentUserId,
  getUserSignalsWithSource,
  type UserSignalRow,
} from "@/lib/profile/server";
import { loadCardDatabase } from "@/lib/data/loader";
import { deriveHoldingSignals } from "@/lib/engine/holdingSignals";
import {
  SignalsDashboardClient,
  type DashboardSignal,
} from "@/components/signals/SignalsDashboardClient";
import "@/app/wallet-edit-v2.css";

export const dynamic = "force-dynamic";

export default async function SignalsDashboardPage() {
  let profile;
  let userId: string;
  try {
    profile = await getCurrentProfile();
    userId = await getCurrentUserId();
  } catch {
    redirect("/login");
  }

  const db = loadCardDatabase();
  const userSignals: Map<string, UserSignalRow> =
    await getUserSignalsWithSource(userId);
  const holdingSignals = deriveHoldingSignals(profile.cards_held);

  // Pre-shape the catalog into the flat structure the client renders.
  // Keeps the client free of catalog/signal-state plumbing — it just
  // groups and renders.
  const signals: DashboardSignal[] = db.signals.map((sig) => {
    const userRow = userSignals.get(sig.id);
    const isAutoConfirmed = holdingSignals.has(sig.id);
    let sourceCardName: string | null = null;
    if (userRow?.source_card_id) {
      sourceCardName =
        db.cardById.get(userRow.source_card_id)?.name ?? null;
    }
    return {
      id: sig.id,
      label: sig.label,
      prompt: sig.prompt,
      type: sig.type,
      decay: sig.decay,
      userState: userRow?.state ?? null,
      autoConfirmed: isAutoConfirmed,
      sourceCardId: userRow?.source_card_id ?? null,
      sourcePlayId: userRow?.source_play_id ?? null,
      sourceCardName,
    };
  });

  return <SignalsDashboardClient signals={signals} />;
}
