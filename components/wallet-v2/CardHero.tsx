"use client";

// CardHero — the per-card hero page.
//
// Layout (top → bottom):
//   1. Back link to /wallet/edit
//   2. Identity strip + 3-pillar found-money tile
//   3. Live deadlines strip (when applicable)
//   4. Earning multipliers grid
//   5. Statement credits + ongoing perks
//   6. Transfer partners (if program has them)
//   7. Sweet spots (if program has them)
//   8. Sign-up bonus + issuer rules
//   9. Signals editor (the cluster stack)
//
// Two scenarios:
//   - Edit existing held card: hydrate from initialHeld, save patches via
//     server actions with debounce.
//   - Add new card (?new=1): start with a draft held row, persist on
//     "Add card" click.

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import { CardArt } from "@/components/perks/CardArt";
import { variantForCard } from "@/lib/cardArt";
import { fromSerialized, type SerializedDb } from "@/lib/data/serialized";
import type {
  CardPlayState,
  UserProfile,
  WalletCardHeld,
} from "@/lib/profile/types";
import { computeFoundMoneyV2 } from "@/lib/engine/foundMoney";
import {
  updateUserCard,
  updateCardPlayState,
} from "@/lib/profile/actions";
import { fmt } from "@/lib/utils/format";
import { FoundMoneyTile } from "./FoundMoneyTile";
import { DeadlinesStrip } from "./DeadlinesStrip";
import { SignalsEditor, type CardPatch } from "./SignalsEditor";
import {
  EarningGrid,
  CreditsAndPerks,
  TransferPartners,
  SweetSpots,
  IssuerRulesSection,
} from "./HeroSections";

interface Props {
  cardId: string;
  serializedDb: SerializedDb;
  profile: UserProfile;
  initialHeld: WalletCardHeld | null;
  initialPlayState: CardPlayState[];
  isNew: boolean;
}

const DEBOUNCE_MS = 500;

export function CardHero({
  cardId,
  serializedDb,
  profile,
  initialHeld,
  initialPlayState,
  isNew,
}: Props) {
  const router = useRouter();
  const db = useMemo(() => fromSerialized(serializedDb), [serializedDb]);
  const card = db.cardById.get(cardId);

  // Bootstrap held state. For new-card mode (Scenario 1) we initialize a
  // sensible draft — opened this month, bonus received, status active.
  const today = useMemo(() => new Date(), []);
  const [held, setHeld] = useState<WalletCardHeld>(() => {
    if (initialHeld) return initialHeld;
    const m = String(today.getMonth() + 1).padStart(2, "0");
    return {
      card_id: cardId,
      opened_at: `${today.getFullYear()}-${m}-01`,
      bonus_received: true,
      card_status_v2: "active",
    };
  });

  const [playState, setPlayState] = useState<CardPlayState[]>(initialPlayState);

  // ── debounced patch persistence ────────────────────────────────────
  const pendingRef = useRef<CardPatch>({});
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flushPatch = useCallback(async (): Promise<boolean> => {
    const patch = pendingRef.current;
    pendingRef.current = {};
    if (Object.keys(patch).length === 0) return true;
    if (isNew) {
      // For drafts, accumulate locally; final write happens on Save.
      return true;
    }
    const result = await updateUserCard({
      card_id: cardId,
      status: "held",
      ...patch,
    });
    return result.ok;
  }, [cardId, isNew]);

  const queuePatch = useCallback(
    (patch: CardPatch) => {
      pendingRef.current = { ...pendingRef.current, ...patch };
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        void flushPatch();
      }, DEBOUNCE_MS);
    },
    [flushPatch],
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      void flushPatch();
    };
  }, [flushPatch]);

  // ── handlers ───────────────────────────────────────────────────────

  function handlePatch(patch: CardPatch) {
    setHeld((prev) => ({ ...prev, ...patch }));
    queuePatch(patch);
  }

  function handlePlayStateChange(
    playId: string,
    patch: { state: CardPlayState["state"]; claimed_at?: string | null },
  ) {
    setPlayState((prev) => {
      const idx = prev.findIndex((p) => p.play_id === playId);
      const next: CardPlayState = {
        card_id: cardId,
        play_id: playId,
        state: patch.state,
      };
      if (patch.claimed_at) next.claimed_at = patch.claimed_at;
      return idx >= 0
        ? prev.map((p, i) => (i === idx ? next : p))
        : [...prev, next];
    });
    if (!isNew) {
      void updateCardPlayState(cardId, playId, {
        state: patch.state,
        claimed_at: patch.claimed_at ?? undefined,
      });
    }
  }

  async function handleSave() {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (isNew) {
      // First save — INSERT the held row with all the in-memory fields.
      await updateUserCard({
        card_id: cardId,
        status: "held",
        opened_at: held.opened_at,
        bonus_received: held.bonus_received,
        ...(held.nickname != null ? { nickname: held.nickname } : {}),
        ...(held.authorized_users != null ? { authorized_users: held.authorized_users } : {}),
        ...(held.pool_status != null ? { pool_status: held.pool_status } : {}),
        ...(held.pinned_category != null ? { pinned_category: held.pinned_category } : {}),
        ...(held.elite_reached != null ? { elite_reached: held.elite_reached } : {}),
        ...(held.activity_threshold_met != null ? { activity_threshold_met: held.activity_threshold_met } : {}),
        ...(held.card_status_v2 != null ? { card_status_v2: held.card_status_v2 } : {}),
      });
      // Persist any play-state we accumulated locally.
      await Promise.all(
        playState.map((p) =>
          updateCardPlayState(cardId, p.play_id, {
            state: p.state,
            claimed_at: p.claimed_at,
          }),
        ),
      );
    } else {
      await flushPatch();
    }
    router.push("/wallet/edit" as Route);
  }

  function handleCancel() {
    router.push("/wallet/edit" as Route);
  }

  async function handleRemove() {
    if (!confirm("Remove this card from your wallet?")) return;
    await updateUserCard({
      card_id: cardId,
      status: "closed_long_ago",
      closed_at: new Date().toISOString().slice(0, 10),
    });
    router.push("/wallet/edit" as Route);
  }

  // ── render ─────────────────────────────────────────────────────────

  if (!card) {
    return (
      <main className="card-hero-page">
        <div className="card-hero-error">
          <h1>Card not found</h1>
          <p>
            We don&apos;t have <code>{cardId}</code> in our catalog yet.
          </p>
          <Link href={"/wallet/edit" as Route} className="btn">
            ← Back to wallet
          </Link>
        </div>
      </main>
    );
  }

  const fee = card.annual_fee_usd ?? 0;
  const fm = computeFoundMoneyV2(card, held, profile, db);

  return (
    <main className="card-hero-page">
      <Link href={"/wallet/edit" as Route} className="back-link">
        ← Wallet
      </Link>

      <DeadlinesStrip cardId={cardId} today={today} />

      <header className="card-hero-identity">
        <CardArt
          variant={variantForCard(card)}
          name={card.name}
          issuer={card.issuer}
          network={card.network ?? undefined}
          size="xl"
        />
        <div className="card-hero-identity-body">
          <div className="eyebrow">{card.issuer}</div>
          <h1 className="card-hero-name">{held.nickname || card.name}</h1>
          <div className="card-hero-meta">
            {card.network ?? ""}
            {card.network ? " · " : ""}
            {fee === 0 ? "No annual fee" : `${fmt.usd(fee)}/yr annual fee`}
            {card.currency_earned ? ` · earns ${prettyProgram(card.currency_earned, db)}` : ""}
          </div>
          {isNew && (
            <div className="hero-new-badge">
              Adding to your wallet — fill in details below and save.
            </div>
          )}
        </div>
      </header>

      <div className="card-hero-fm">
        <FoundMoneyTile value={fm} />
      </div>

      <EarningGrid card={card} />
      <CreditsAndPerks card={card} />
      <TransferPartners card={card} db={db} />
      <SweetSpots card={card} db={db} />
      <IssuerRulesSection card={card} db={db} />

      <SignalsEditor
        card={card}
        held={held}
        profile={profile}
        db={db}
        playState={playState}
        isNew={isNew}
        onPatch={handlePatch}
        onPlayStateChange={handlePlayStateChange}
        onCancel={handleCancel}
        onRemove={handleRemove}
        onSave={handleSave}
      />
    </main>
  );
}

function prettyProgram(programId: string, db: ReturnType<typeof fromSerialized>): string {
  return db.programById.get(programId)?.name ?? programId;
}
