"use client";

// CardHero — money-find page composition (v2 redesign).
//
// Layout (top → bottom):
//   1. Back link to /wallet/edit
//   2. Live deadlines strip (when applicable)
//   3. Identity strip — card art + name + AF + currency, with the
//      opened-at pill inline under the name.
//   4. CurrencyPanel — what the points are, what they're worth, who
//      they transfer to. Driven by card.currency_earned.
//   5. CardIntroBlock — three orientation sentences from card.card_intro.
//   6. ValueThesisHero — net-AF math + structural edge + ecosystem line
//      (when feeders are held). Chip row was removed in v2.
//   7. FeederPairBlock — always rendered when card.feeder_pair is
//      authored. State is derived from cards_held: held → "Set up
//      pooling" CTA; missing → "Add {Card}" deep-links to ?new=1.
//   8. CatalogGroup × N — Hotels, Airlines, Travel-services, Shopping,
//      Cash, Niche.
//   9. MechanicsZone — calendar-driven items only.
//  10. ManageCardDisclosure — wraps SignalsEditor (AU count, status,
//      pooling, etc.). Opening date is no longer here; the pill on the
//      identity strip is canonical.
//
// Two scenarios:
//   - Edit existing held card: hydrate from initialHeld; persist patches via debounced server actions.
//   - Add new card (?new=1): start from a draft held row; persist on "Add card" click in SignalsEditor.

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
import {
  updateUserCard,
  updateCardPlayState,
  updateUserSignalsForPlay,
} from "@/lib/profile/actions";
import { fmt } from "@/lib/utils/format";
import {
  ALL_GROUPS,
  findsByGroup,
  isGroupSkipped,
  scoreFinds,
  type FindStatus,
} from "@/lib/engine/moneyFind";
import type { PlayGroupId } from "@/lib/data/loader";
import type { SignalState } from "@/lib/profile/server";
import { DeadlinesStrip } from "./DeadlinesStrip";
import { OpenedAtPill } from "./OpenedAtPill";
import { CurrencyPanel } from "./CurrencyPanel";
import { CardIntroBlock } from "./CardIntroBlock";
import { ValueThesisHero } from "./ValueThesisHero";
import { FeederPairBlock } from "./FeederPairBlock";
import { CatalogGroup } from "./CatalogGroup";
import { MechanicsZone } from "./MechanicsZone";
import { ManageCardDisclosure } from "./ManageCardDisclosure";
import { SignalsEditor, type CardPatch } from "./SignalsEditor";

interface Props {
  cardId: string;
  serializedDb: SerializedDb;
  profile: UserProfile;
  initialHeld: WalletCardHeld | null;
  initialPlayState: CardPlayState[];
  isNew: boolean;
  // Phase 4: serialized signal map (Phase 3 storage merged with
  // auto-derived holdings server-side). Reconstructed as a Map and
  // threaded into engine calls. Optional for backward compat with
  // any caller that hasn't been wired yet.
  userSignals?: Record<string, SignalState>;
}

const DEBOUNCE_MS = 500;

const FIND_STATUS_TO_PLAY: Record<FindStatus, CardPlayState["state"]> = {
  using: "got_it",
  going_to: "want_it",
  skip: "skip",
  unset: "unset",
};

export function CardHero({
  cardId,
  serializedDb,
  profile,
  initialHeld,
  initialPlayState,
  isNew,
  userSignals: userSignalsProp,
}: Props) {
  const router = useRouter();
  const db = useMemo(() => fromSerialized(serializedDb), [serializedDb]);
  const card = db.cardById.get(cardId);

  // Phase 4: signal map reconstructed once. The hero page itself
  // doesn't render a card-level gauge today (the wallet row does, via
  // computeFoundMoneyV2), so the value is held here for any future
  // hero-page consumer (Phase 5's dual-gauge work). Keeping the prop
  // wired now means Phase 5 can read it without re-plumbing the page.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const signals = useMemo(
    () => new Map(Object.entries(userSignalsProp ?? {})) as Map<string, SignalState>,
    [userSignalsProp],
  );

  const today = useMemo(() => new Date(), []);
  const todayIso = today.toISOString().slice(0, 10);

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
    if (isNew) return true;
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

  function writePlayState(
    playId: string,
    state: CardPlayState["state"],
    extras: { claimed_at?: string | null; notes?: string | null } = {},
  ) {
    setPlayState((prev) => {
      const idx = prev.findIndex((p) => p.play_id === playId);
      const next: CardPlayState = {
        card_id: cardId,
        play_id: playId,
        state,
      };
      if (extras.claimed_at) next.claimed_at = extras.claimed_at;
      if (extras.notes) next.notes = extras.notes;
      if (state === "unset") {
        return idx >= 0 ? prev.filter((_, i) => i !== idx) : prev;
      }
      return idx >= 0
        ? prev.map((p, i) => (i === idx ? next : p))
        : [...prev, next];
    });
    if (!isNew) {
      // Phase 3 dual-write: legacy per-play row PLUS global signal upsert
      // via the play's reveals_signals. updateUserSignalsForPlay is a
      // no-op for synthetic ids (group:*, cold:*) and for plays whose
      // reveals_signals is empty.
      void updateCardPlayState(cardId, playId, {
        state,
        claimed_at: extras.claimed_at ?? undefined,
        notes: extras.notes ?? undefined,
      });
      void updateUserSignalsForPlay(cardId, playId, state);
    }
  }

  function handleMarkFind(playId: string, status: FindStatus) {
    const dbState = FIND_STATUS_TO_PLAY[status];
    const claimed_at = status === "using" ? todayIso : null;
    writePlayState(playId, dbState, { claimed_at });
  }

  function handleToggleGroupSkip(group: PlayGroupId) {
    const playId = `group:${group}`;
    const currentlySkipped = isGroupSkipped(playState, group);
    writePlayState(playId, currentlySkipped ? "unset" : "skip");
  }

  function handleProbeClick(promptId: string) {
    // Scroll to the cold prompt in the Hero region.
    const el = document.querySelector(
      `.cold-prompt[data-prompt-id="${promptId}"]`,
    );
    if (el && "scrollIntoView" in el) {
      (el as HTMLElement).scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  // ── persistence on Save / Cancel / Remove for the SignalsEditor ────

  async function handleSave() {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (isNew) {
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
      // Phase 3 dual-write across the bulk save path used when a brand
      // new card is being added. Same play state lands in both tables
      // so the engine cutover in Phase 4 already has the data.
      await Promise.all(
        playState.flatMap((p) => [
          updateCardPlayState(cardId, p.play_id, {
            state: p.state,
            claimed_at: p.claimed_at,
            notes: p.notes,
          }),
          updateUserSignalsForPlay(cardId, p.play_id, p.state),
        ]),
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
      closed_at: todayIso,
    });
    router.push("/wallet/edit" as Route);
  }

  // ── derived data for rendering ─────────────────────────────────────

  const finds = useMemo(
    () => (card ? scoreFinds(card, profile, playState, db, todayIso) : []),
    [card, profile, playState, db, todayIso],
  );

  const groupedFinds = useMemo(() => findsByGroup(finds), [finds]);

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
  const program = card.currency_earned
    ? db.programById.get(card.currency_earned)
    : undefined;
  const ecosystemLineText = card.value_thesis?.ecosystem_line?.text;

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
            {card.currency_earned
              ? ` · earns ${db.programById.get(card.currency_earned)?.name ?? card.currency_earned}`
              : ""}
          </div>
          <OpenedAtPill
            openedAt={held.opened_at}
            onChange={(next) => handlePatch({ opened_at: next })}
          />
          {isNew && (
            <div className="hero-new-badge">
              Adding to your wallet — fill in below and save.
            </div>
          )}
        </div>
      </header>

      <CurrencyPanel
        card={card}
        program={program}
        ecosystemLine={ecosystemLineText}
      />

      <CardIntroBlock card={card} />

      {card.value_thesis && (
        <ValueThesisHero
          thesis={card.value_thesis}
          cardsHeld={profile.cards_held ?? []}
        />
      )}

      {card.feeder_pair && (
        <FeederPairBlock
          pair={card.feeder_pair}
          cardsHeld={profile.cards_held ?? []}
          db={db}
        />
      )}

      {ALL_GROUPS.map((group) => {
        const groupFinds = groupedFinds.get(group) ?? [];
        if (groupFinds.length === 0) return null;
        return (
          <CatalogGroup
            key={group}
            group={group}
            finds={groupFinds}
            skipped={isGroupSkipped(playState, group)}
            onToggleGroupSkip={() => handleToggleGroupSkip(group)}
            onMarkFind={handleMarkFind}
            onProbeClick={handleProbeClick}
          />
        );
      })}

      <MechanicsZone card={card} held={held} today={today} />

      <ManageCardDisclosure>
        <SignalsEditor
          card={card}
          held={held}
          profile={profile}
          db={db}
          playState={playState}
          isNew={isNew}
          onPatch={handlePatch}
          onPlayStateChange={(playId, state) =>
            writePlayState(playId, state.state, {
              claimed_at: state.claimed_at,
            })
          }
          onCancel={handleCancel}
          onRemove={handleRemove}
          onSave={handleSave}
        />
      </ManageCardDisclosure>
    </main>
  );
}
