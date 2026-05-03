"use client";

// Wallet-edit-v2 page shell. Two-pane on desktop (search + list on the
// left, edit panel on the right), full-screen sheet stack on mobile.
// State is local + optimistic; persistence runs through the
// updateUserCard / updateCardPlayState server actions with a 500ms
// debounce. flushNow runs on Save / Cancel / unmount so writes never
// drop.
//
// Two scenarios both use this component:
//   1) Add a new card → search returns matches → onPick opens the
//      panel hydrated with empty state; "Add card" persists via
//      updateUserCard (status='held') and the row joins the list.
//   2) Edit existing → click row → panel opens hydrated from the held
//      card row; saves merge into the same row.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { fromSerialized, type SerializedDb } from "@/lib/data/serialized";
import type { Card } from "@/lib/data/loader";
import type {
  CardPlayState,
  UserProfile,
  WalletCardHeld,
} from "@/lib/profile/types";
import { computeFoundMoneyV2 } from "@/lib/engine/foundMoney";
import { updateUserCard, updateCardPlayState } from "@/lib/profile/actions";
import { fmt } from "@/lib/utils/format";
import { EditPanel, type CardPatch } from "./EditPanel";
import { WalletListRow } from "./WalletListRow";
import { SearchBar } from "./SearchBar";
import { EmptyState } from "./EmptyState";

interface Props {
  initialProfile: UserProfile;
  serializedDb: SerializedDb;
  initialPlayStateByCard: Record<string, CardPlayState[]>;
}

const DEBOUNCE_MS = 500;

export function EditWalletClient({
  initialProfile,
  serializedDb,
  initialPlayStateByCard,
}: Props) {
  const router = useRouter();
  const db = useMemo(() => fromSerialized(serializedDb), [serializedDb]);

  // ── wallet state — single source of truth ──────────────────────────
  const [held, setHeld] = useState<WalletCardHeld[]>(
    initialProfile.cards_held ?? [],
  );
  const [playStateByCard, setPlayStateByCard] = useState<
    Record<string, CardPlayState[]>
  >(initialPlayStateByCard);

  // ── selection state ────────────────────────────────────────────────
  const [activeId, setActiveId] = useState<string | null>(null);
  // When the user clicks "Add" on a search match, we add a *draft* held
  // row that's not yet persisted. activeId points to it; "Save" persists.
  // Until then, "Cancel" removes the draft from the in-memory list.
  const [draftIds, setDraftIds] = useState<Set<string>>(new Set());

  // ── mobile detection ───────────────────────────────────────────────
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // ── debounced persistence per card ─────────────────────────────────
  const pendingPatchRef = useRef<Map<string, CardPatch>>(new Map());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flushPatches = useCallback(async (): Promise<boolean> => {
    const pending = pendingPatchRef.current;
    if (pending.size === 0) return true;
    const writes = Array.from(pending.entries()).map(async ([cardId, patch]) => {
      const result = await updateUserCard({
        card_id: cardId,
        status: "held",
        ...patch,
      });
      return result.ok;
    });
    pendingPatchRef.current = new Map();
    const results = await Promise.all(writes);
    return results.every(Boolean);
  }, []);

  const queuePatch = useCallback(
    (cardId: string, patch: CardPatch) => {
      const current = pendingPatchRef.current.get(cardId) ?? {};
      pendingPatchRef.current.set(cardId, { ...current, ...patch });
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        void flushPatches();
      }, DEBOUNCE_MS);
    },
    [flushPatches],
  );

  // Flush on unmount so navigating away doesn't drop a pending write.
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      void flushPatches();
    };
  }, [flushPatches]);

  // ── derived ────────────────────────────────────────────────────────
  const heldIds = useMemo(() => new Set(held.map((h) => h.card_id)), [held]);
  const cardById = db.cardById;
  const activeHeld = activeId ? held.find((h) => h.card_id === activeId) ?? null : null;
  const activeCard = activeId ? cardById.get(activeId) ?? null : null;
  const activeIsDraft = activeId ? draftIds.has(activeId) : false;

  const totalFound = useMemo(() => {
    let s = 0;
    for (const h of held) {
      if (h.found_money_cached_usd != null) {
        s += h.found_money_cached_usd;
        continue;
      }
      const c = cardById.get(h.card_id);
      if (!c) continue;
      s += computeFoundMoneyV2(c, h, initialProfile, db).point;
    }
    return s;
  }, [held, cardById, initialProfile, db]);

  const totalFee = useMemo(() => {
    let s = 0;
    for (const h of held) {
      const c = cardById.get(h.card_id);
      if (!c) continue;
      s += c.annual_fee_usd ?? 0;
    }
    return s;
  }, [held, cardById]);

  // ── handlers ───────────────────────────────────────────────────────

  // Pick a search-result card → add a draft held row + open the panel.
  function handlePick(card: Card) {
    if (heldIds.has(card.id)) {
      setActiveId(card.id);
      return;
    }
    const today = new Date();
    const m = String(today.getMonth() + 1).padStart(2, "0");
    const draft: WalletCardHeld = {
      card_id: card.id,
      opened_at: `${today.getFullYear()}-${m}-01`,
      bonus_received: true,
      card_status_v2: "active",
    };
    setHeld((prev) => [draft, ...prev]);
    setDraftIds((prev) => new Set([...prev, card.id]));
    setActiveId(card.id);
  }

  function handlePatch(cardId: string, patch: CardPatch) {
    setHeld((prev) =>
      prev.map((h) => (h.card_id === cardId ? { ...h, ...patch } : h)),
    );
    // Drafts: hold persistence until "Add card" is clicked.
    if (!draftIds.has(cardId)) {
      queuePatch(cardId, patch);
    }
  }

  function handlePlayStateChange(
    cardId: string,
    playId: string,
    patch: { state: CardPlayState["state"]; claimed_at?: string | null },
  ) {
    // Optimistic local update.
    setPlayStateByCard((prev) => {
      const list = prev[cardId] ?? [];
      const idx = list.findIndex((p) => p.play_id === playId);
      const next: CardPlayState = {
        card_id: cardId,
        play_id: playId,
        state: patch.state,
      };
      if (patch.claimed_at) next.claimed_at = patch.claimed_at;
      const newList =
        idx >= 0
          ? list.map((p, i) => (i === idx ? next : p))
          : [...list, next];
      return { ...prev, [cardId]: newList };
    });
    // Persist immediately (small + idempotent; user expects feedback).
    if (!draftIds.has(cardId)) {
      void updateCardPlayState(cardId, playId, {
        state: patch.state,
        claimed_at: patch.claimed_at ?? undefined,
      });
    }
  }

  async function handleSave(cardId: string) {
    // Force-flush any pending patches first.
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    const isDraft = draftIds.has(cardId);
    if (isDraft) {
      // First save — INSERT the held row with all the in-memory fields.
      const h = held.find((x) => x.card_id === cardId);
      if (h) {
        await updateUserCard({
          card_id: cardId,
          status: "held",
          opened_at: h.opened_at,
          bonus_received: h.bonus_received,
          ...(h.nickname != null ? { nickname: h.nickname } : {}),
          ...(h.authorized_users != null ? { authorized_users: h.authorized_users } : {}),
          ...(h.pool_status != null ? { pool_status: h.pool_status } : {}),
          ...(h.pinned_category != null ? { pinned_category: h.pinned_category } : {}),
          ...(h.elite_reached != null ? { elite_reached: h.elite_reached } : {}),
          ...(h.activity_threshold_met != null ? { activity_threshold_met: h.activity_threshold_met } : {}),
          ...(h.card_status_v2 != null ? { card_status_v2: h.card_status_v2 } : {}),
        });
        // Persist any play-state we accumulated locally.
        const ps = playStateByCard[cardId] ?? [];
        await Promise.all(
          ps.map((p) =>
            updateCardPlayState(cardId, p.play_id, {
              state: p.state,
              claimed_at: p.claimed_at,
            }),
          ),
        );
      }
      setDraftIds((prev) => {
        const next = new Set(prev);
        next.delete(cardId);
        return next;
      });
    } else {
      await flushPatches();
    }
    router.refresh();
    setActiveId(null);
  }

  function handleCancel(cardId: string) {
    if (draftIds.has(cardId)) {
      // Discard the draft.
      setHeld((prev) => prev.filter((h) => h.card_id !== cardId));
      setDraftIds((prev) => {
        const next = new Set(prev);
        next.delete(cardId);
        return next;
      });
      setPlayStateByCard((prev) => {
        const next = { ...prev };
        delete next[cardId];
        return next;
      });
    }
    setActiveId(null);
  }

  async function handleRemove(cardId: string) {
    if (!confirm("Remove this card from your wallet?")) return;
    await updateUserCard({
      card_id: cardId,
      status: "closed_long_ago",
      closed_at: new Date().toISOString().slice(0, 10),
    });
    setHeld((prev) => prev.filter((h) => h.card_id !== cardId));
    setActiveId(null);
    router.refresh();
  }

  // ── render ─────────────────────────────────────────────────────────

  const showEmpty = held.length === 0 && !activeId;

  return (
    <div className="wallet-edit-page">
      <div className="page-head">
        <div>
          <h1>Edit your wallet</h1>
          <p className="sub">
            Every signal you fill in tightens the audit math. Nothing here is required — but more answers means we find more money.
          </p>
        </div>
        {!showEmpty && (
          <div className="wallet-stats">
            <div>
              <div className="stat">Found this year</div>
              <div className="val t-pos num">+{fmt.usd(totalFound)}</div>
            </div>
            <div>
              <div className="stat">Annual fees</div>
              <div className="val num">−{fmt.usd(totalFee)}</div>
            </div>
          </div>
        )}
      </div>

      {showEmpty ? (
        <EmptyState catalog={db.cards} onPick={handlePick} />
      ) : (
        <div className={mobile ? "mobile-pane" : "pane-grid"}>
          <div className="list-pane">
            <SearchBar
              catalog={db.cards}
              heldIds={heldIds}
              onPick={handlePick}
            />
            <div className="list-head">
              <span className="eyebrow">
                Wallet · {held.length} card{held.length === 1 ? "" : "s"}
              </span>
              <span className="list-head-hint">tap to edit</span>
            </div>
            <div className="list-rows">
              {held.map((h) => {
                const c = cardById.get(h.card_id);
                if (!c) return null;
                const fm = computeFoundMoneyV2(c, h, initialProfile, db);
                return (
                  <WalletListRow
                    key={h.card_id}
                    card={c}
                    held={h}
                    found={fm}
                    active={activeId === h.card_id}
                    onClick={() => setActiveId(h.card_id)}
                  />
                );
              })}
            </div>
          </div>

          {!mobile && (
            <div className="edit-pane-wrap">
              {activeCard && activeHeld ? (
                <EditPanel
                  card={activeCard}
                  held={activeHeld}
                  profile={initialProfile}
                  db={db}
                  initialPlayState={playStateByCard[activeCard.id] ?? []}
                  isNew={activeIsDraft}
                  mobile={false}
                  onPatch={(p) => handlePatch(activeCard.id, p)}
                  onPlayStateChange={(playId, state) =>
                    handlePlayStateChange(activeCard.id, playId, state)
                  }
                  onClose={() => handleCancel(activeCard.id)}
                  onRemove={() => handleRemove(activeCard.id)}
                  onSave={() => handleSave(activeCard.id)}
                />
              ) : (
                <EmptyEdit />
              )}
            </div>
          )}
        </div>
      )}

      {mobile && activeCard && activeHeld && (
        <div className="mobile-sheet-overlay">
          <EditPanel
            card={activeCard}
            held={activeHeld}
            profile={initialProfile}
            db={db}
            initialPlayState={playStateByCard[activeCard.id] ?? []}
            isNew={activeIsDraft}
            mobile
            onPatch={(p) => handlePatch(activeCard.id, p)}
            onPlayStateChange={(playId, state) =>
              handlePlayStateChange(activeCard.id, playId, state)
            }
            onClose={() => handleCancel(activeCard.id)}
            onRemove={() => handleRemove(activeCard.id)}
            onSave={() => handleSave(activeCard.id)}
          />
        </div>
      )}
    </div>
  );
}

function EmptyEdit() {
  return (
    <div className="empty-edit">
      <div className="empty-edit-headline num">Pick a card to edit</div>
      <div className="empty-edit-body">
        Tap any card on the left to surface the signals that drive its audit math.
      </div>
    </div>
  );
}
