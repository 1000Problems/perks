"use client";

// The rich per-card edit panel. Renders the conditional clusters that
// apply to a card's metadata (claimed credits, point pooling, 5x
// category picker, cobrand activity, status). Persistence is debounced
// + flush-on-blur via the parent hook (useEditCardState in
// EditWalletClient.tsx).

import { useMemo, type ReactNode } from "react";
import { CardArt } from "@/components/perks/CardArt";
import { variantForCard } from "@/lib/cardArt";
import type { Card, CardDatabase } from "@/lib/data/loader";
import type { SpendCategoryId } from "@/lib/data/types";
import type {
  CardPlayState,
  UserProfile,
  WalletCardHeld,
} from "@/lib/profile/types";
import { computeFoundMoneyV2 } from "@/lib/engine/foundMoney";
import { fmt } from "@/lib/utils/format";
import { Cluster, Field, PillGroup, Stepper, Toggle, YesNo } from "./primitives";
import { FoundMoneyTile } from "./FoundMoneyTile";
import { DeadlinesStrip } from "./DeadlinesStrip";
import { CategoryPicker } from "./CategoryPicker";

const MONTH = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Patch type the panel emits up to its parent. Parent merges into the
// held-card row and persists via updateUserCard.
export type CardPatch = Partial<Omit<WalletCardHeld, "card_id">>;

interface Props {
  card: Card;
  held: WalletCardHeld;            // current persisted state
  profile: UserProfile;
  db: CardDatabase;
  // Optional initial play-state hydration. Currently unused at this
  // depth (Scenario-1 add never has prior play state); the audit page
  // will read from this when the deep card view ships.
  initialPlayState?: CardPlayState[];
  isNew: boolean;                  // true when adding for Scenario 1
  mobile?: boolean;
  onPatch: (patch: CardPatch) => void;
  onPlayStateChange: (
    playId: string,
    state: { state: CardPlayState["state"]; claimed_at?: string | null },
  ) => void;
  onClose: () => void;
  onRemove: () => void;
  onSave: () => void;
}

export function EditPanel({
  card,
  held,
  profile,
  db,
  initialPlayState,
  isNew,
  mobile = false,
  onPatch,
  onPlayStateChange,
  onClose,
  onRemove,
  onSave,
}: Props) {
  // ── derived state ───────────────────────────────────────────────────
  const fee = card.annual_fee_usd ?? 0;
  const isPoolEligible = Boolean(card.is_pool_spoke);
  const isCobrand = Boolean(card.is_cobrand);
  const acceptsCategory =
    Array.isArray(card.accepts_pinned_category) &&
    card.accepts_pinned_category.length > 0;

  // Hydrate the per-credit claimed state. We map over annual_credits in
  // the card definition and pull the matching CardPlayState row by
  // play_id. Play IDs use the credit's signal_id when available, else
  // a slugified name.
  const creditPlayIds = useMemo(
    () =>
      card.annual_credits.map((c, i) => playIdForCredit(c, i)),
    [card],
  );
  const playStateMap = useMemo(() => {
    const m = new Map<string, CardPlayState>();
    for (const p of initialPlayState ?? []) m.set(p.play_id, p);
    return m;
  }, [initialPlayState]);

  // ── parsed opening ───────────────────────────────────────────────────
  const [openYear, openMonth] = parseYM(held.opened_at);
  const today = useMemo(() => new Date(), []);

  // ── annual fee schedule ─────────────────────────────────────────────
  const afNext = useMemo(() => {
    if (!fee || !openYear || !openMonth) return null;
    const candidate = new Date(today.getFullYear(), openMonth - 1, 1);
    if (candidate <= today) candidate.setFullYear(today.getFullYear() + 1);
    return candidate;
  }, [fee, openYear, openMonth, today]);
  const afDays = afNext
    ? Math.ceil((afNext.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    : null;

  // ── found-money math (recomputed locally as user edits) ─────────────
  const fm = useMemo(
    () => computeFoundMoneyV2(card, held, profile, db),
    [card, held, profile, db],
  );

  // ── category picker recommendation (top spend categories) ───────────
  const recommendedCategories = useMemo<SpendCategoryId[]>(() => {
    const entries = Object.entries(profile.spend_profile ?? {})
      .filter(([, v]) => (v ?? 0) > 0)
      .sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0))
      .slice(0, 3);
    return entries.map(([k]) => k as SpendCategoryId);
  }, [profile.spend_profile]);

  // ── close-warning callout (Citi: closing kills points) ──────────────
  const closingRiskPoints =
    held.card_status_v2 === "considering_close" &&
    (card.currency_earned ?? "").toLowerCase().includes("thankyou");

  // ── credits cluster: per-credit toggle ──────────────────────────────
  const claimedCount = card.annual_credits.reduce((n, _, i) => {
    const id = creditPlayIds[i];
    return playStateMap.get(id)?.state === "got_it" ? n + 1 : n;
  }, 0);
  const claimedValue = card.annual_credits.reduce((s, c, i) => {
    const id = creditPlayIds[i];
    if (playStateMap.get(id)?.state !== "got_it") return s;
    return s + (c.value_usd ?? 0);
  }, 0);

  // ── cluster numbering — keeps "01", "02"… stable across renders ────
  const numbers = enumerateClusters({
    annualFee: fee > 0,
    hasCredits: card.annual_credits.length > 0,
    acceptsCategory,
    isPoolEligible,
    isCobrand,
  });

  return (
    <div className={mobile ? "mobile-sheet" : "edit-pane"}>
      {mobile && (
        <div className="mobile-sheet-head">
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={onClose}
            aria-label="back"
          >
            ←
          </button>
          <div className="mobile-sheet-title">
            <div className="name">{card.name}</div>
            <div className="iss">{card.issuer}</div>
          </div>
        </div>
      )}

      <div className={mobile ? "mobile-sheet-body" : "edit-pane-scroll"}>
        <DeadlinesStrip cardId={card.id} today={today} />

        <Identity card={card} />

        <div className="fm-tile-wrap">
          <FoundMoneyTile value={fm} />
        </div>

        <div className="cluster-stack">
          {/* 01 — Opening details */}
          <Cluster
            num={numbers.opening}
            title="Opening details"
            sub="Drives 5/24, 48-month rules"
            defaultOpen={!mobile}
          >
            <div className="row-grid">
              <Field label="Opened" hint="Month and year you opened the card.">
                <div className="ym">
                  <select
                    className="select-input"
                    value={openMonth ?? ""}
                    onChange={(e) =>
                      onPatch({
                        opened_at: setYM(
                          held.opened_at,
                          openYear ?? today.getFullYear(),
                          Number(e.target.value),
                        ),
                      })
                    }
                  >
                    <option value="" disabled>
                      Month
                    </option>
                    {MONTH.map((m, i) => (
                      <option key={m} value={i + 1}>
                        {m}
                      </option>
                    ))}
                  </select>
                  <select
                    className="select-input"
                    value={openYear ?? ""}
                    onChange={(e) =>
                      onPatch({
                        opened_at: setYM(
                          held.opened_at,
                          Number(e.target.value),
                          openMonth ?? today.getMonth() + 1,
                        ),
                      })
                    }
                  >
                    <option value="" disabled>
                      Year
                    </option>
                    {Array.from({ length: 10 }).map((_, i) => {
                      const y = today.getFullYear() - i;
                      return (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </Field>
              <Field
                label="Got the sign-up bonus?"
                hint="If no, we'll factor remaining welcome value into the audit."
              >
                <YesNo
                  value={held.bonus_received ?? null}
                  onChange={(v) => onPatch({ bonus_received: v })}
                />
              </Field>
              <Field
                label="Nickname (optional)"
                full
                hint="Useful when you have two of the same card."
              >
                <input
                  className="input"
                  type="text"
                  placeholder="e.g. 'Travel main'"
                  value={held.nickname ?? ""}
                  onChange={(e) =>
                    onPatch({ nickname: e.target.value || undefined })
                  }
                />
              </Field>
            </div>
          </Cluster>

          {/* 02 — Annual fee schedule */}
          {fee > 0 && (
            <Cluster
              num={numbers.fee!}
              title="Annual fee schedule"
              sub={`${fmt.usd(fee)}/yr · auto-computed from opening date`}
              defaultOpen={!mobile}
            >
              <div className="af-row">
                {afNext ? (
                  <div className="af-chip">
                    <div>
                      <div className="label">Next fee</div>
                      <div className="date">
                        {MONTH[afNext.getMonth()]} {afNext.getDate()},{" "}
                        {afNext.getFullYear()}
                      </div>
                    </div>
                    <div className="countdown">
                      {afDays} day{afDays === 1 ? "" : "s"}
                    </div>
                  </div>
                ) : (
                  <div className="af-empty">Set an opening date to estimate your next fee.</div>
                )}
              </div>
            </Cluster>
          )}

          {/* Authorized users */}
          <Cluster
            num={numbers.aus}
            title="Authorized users"
            sub="AU spend earns into your primary points balance."
            defaultOpen={!mobile}
          >
            <div className="aus-row">
              <Stepper
                value={held.authorized_users ?? 0}
                onChange={(v) => onPatch({ authorized_users: v })}
                min={0}
                max={5}
              />
              <div className="aus-hint">
                Some perks (like the $100 hotel credit) can be used by AUs but don&apos;t grant a separate one.
              </div>
            </div>
          </Cluster>

          {/* Already-claimed benefits */}
          {numbers.credits && (
            <Cluster
              num={numbers.credits}
              title="Already-claimed benefits this year"
              sub={`${claimedCount} of ${card.annual_credits.length} claimed`}
              defaultOpen={!mobile}
              right={
                <span className="value-tag t-pos">
                  {fmt.usd(claimedValue)} captured
                </span>
              }
            >
              <div className="body-sub">
                Tap to mark claimed. Adding a date sharpens the audit math.
              </div>
              {card.annual_credits.map((c, i) => {
                const playId = creditPlayIds[i];
                const ps = playStateMap.get(playId);
                const claimed = ps?.state === "got_it";
                return (
                  <div
                    key={playId}
                    className="toggle-row"
                    data-claimed={claimed ? "true" : "false"}
                  >
                    <div className="toggle-row-body">
                      <div className="ttl">{c.name}</div>
                      <div className="sub">
                        {fmt.usd(c.value_usd ?? 0)}/yr
                        {c.notes ? ` · ${c.notes}` : ""}
                      </div>
                    </div>
                    <div className="toggle-row-right">
                      {claimed && ps?.claimed_at && (
                        <span className="claimed-date">
                          claimed {ps.claimed_at}
                        </span>
                      )}
                      <Toggle
                        on={claimed}
                        onChange={(next) =>
                          onPlayStateChange(playId, {
                            state: next ? "got_it" : "unset",
                            claimed_at: next ? todayIso() : null,
                          })
                        }
                        ariaLabel={`Mark ${c.name} claimed`}
                      />
                    </div>
                  </div>
                );
              })}
            </Cluster>
          )}

          {/* 5x category picker (Custom Cash) */}
          {numbers.category && (
            <Cluster
              num={numbers.category}
              title="5x category"
              sub="Pick the category you'll earn 5x in (up to $500/mo)."
              defaultOpen={!mobile}
            >
              <CategoryPicker
                options={(card.accepts_pinned_category ?? []) as SpendCategoryId[]}
                value={(held.pinned_category ?? null) as SpendCategoryId | null}
                onChange={(v) => onPatch({ pinned_category: v ?? undefined })}
                recommended={recommendedCategories}
              />
            </Cluster>
          )}

          {/* Point pooling (pool-eligible spokes) */}
          {numbers.pooling && (
            <Cluster
              num={numbers.pooling}
              title="Point pooling"
              sub="Pooled to a premium card preserves your transfer ratio."
              defaultOpen={!mobile}
            >
              <Field
                label="Is this card pooled to your premium card?"
                hint="Pooling no-AF Citi points to the Strata Premier preserves the 1:1 transfer ratio (vs 1:0.7 unpooled)."
              >
                <PillGroup
                  value={held.pool_status ?? "unknown"}
                  onChange={(v) => onPatch({ pool_status: v })}
                  options={[
                    { value: "yes", label: "Yes" },
                    { value: "not_yet", label: "Not yet" },
                    { value: "unknown", label: "Don't know" },
                  ]}
                />
              </Field>
            </Cluster>
          )}

          {/* Elite + cobrand activity */}
          {numbers.cobrand && (
            <Cluster
              num={numbers.cobrand}
              title="Elite & cobrand activity"
              sub="Unlocks status-tied perks in the audit."
              defaultOpen={!mobile}
            >
              <div className="toggle-row">
                <div className="toggle-row-body">
                  <div className="ttl">Elite status reached this year?</div>
                  <div className="sub">
                    Counts toward annual perks and lounge access valuation.
                  </div>
                </div>
                <div className="toggle-row-right">
                  <Toggle
                    on={Boolean(held.elite_reached)}
                    onChange={(v) => onPatch({ elite_reached: v })}
                    ariaLabel="Elite status reached"
                  />
                </div>
              </div>
              <div className="toggle-row">
                <div className="toggle-row-body">
                  <div className="ttl">Required activity threshold met?</div>
                  <div className="sub">
                    e.g. $7K spend for the anniversary night.
                  </div>
                </div>
                <div className="toggle-row-right">
                  <Toggle
                    on={Boolean(held.activity_threshold_met)}
                    onChange={(v) => onPatch({ activity_threshold_met: v })}
                    ariaLabel="Activity threshold met"
                  />
                </div>
              </div>
            </Cluster>
          )}

          {/* Status */}
          <Cluster
            num={numbers.status}
            title="Status"
            sub="What's the state of this card in your wallet?"
            defaultOpen={!mobile}
          >
            <PillGroup
              value={held.card_status_v2 ?? "active"}
              onChange={(v) => onPatch({ card_status_v2: v })}
              options={[
                { value: "active", label: "Active", sub: "Earning + spending" },
                {
                  value: "considering_close",
                  label: "Considering closing",
                  sub: "On the bubble",
                  tone: "warn",
                },
                {
                  value: "downgraded",
                  label: "Downgraded",
                  sub: "Product-changed",
                },
                {
                  value: "closed",
                  label: "Closed",
                  sub: "Account closed",
                  tone: "neg",
                },
              ]}
            />
            {closingRiskPoints && (
              <div className="callout callout-warn">
                <span className="callout-icon" aria-hidden>
                  ⚠
                </span>
                <div>
                  Closing a Citi card deletes its earned ThankYou points — even when pooled.
                  Move points to your Strata Premier or burn them before closing.
                </div>
              </div>
            )}
          </Cluster>
        </div>
      </div>

      {!mobile && (
        <div className="panel-footer">
          <button type="button" className="remove-link" onClick={onRemove}>
            Remove from wallet
          </button>
          <div className="panel-footer-actions">
            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>
            <button type="button" className="btn btn-primary" onClick={onSave}>
              {isNew ? "Add card" : "Save changes"}
            </button>
          </div>
        </div>
      )}

      {mobile && (
        <div className="mobile-sheet-foot">
          <button type="button" className="btn" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary" onClick={onSave}>
            {isNew ? "Add card" : "Save"}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Identity strip ───────────────────────────────────────────────────────

function Identity({ card }: { card: Card }) {
  const fee = card.annual_fee_usd ?? 0;
  return (
    <div className="identity">
      <CardArt
        variant={variantForCard(card)}
        name={card.name}
        issuer={card.issuer}
        network={card.network ?? undefined}
        size="lg"
      />
      <div className="identity-body">
        <div className="identity-name num">{card.name}</div>
        <div className="identity-meta">
          {card.issuer} · {card.network ?? ""} ·{" "}
          {fee === 0 ? "No annual fee" : `${fmt.usd(fee)}/yr annual fee`}
        </div>
        <div className="identity-stats">
          <div>
            <div className="stat">Currency</div>
            <div className="val">{card.currency_earned ?? "Cash back"}</div>
          </div>
          {card.network && (
            <div>
              <div className="stat">Network</div>
              <div className="val">{card.network}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── helpers ────────────────────────────────────────────────────────────

function parseYM(iso: string | undefined): [number | null, number | null] {
  if (!iso) return [null, null];
  const [y, m] = iso.split("-").map(Number);
  return [Number.isFinite(y) ? y : null, Number.isFinite(m) ? m : null];
}

function setYM(prev: string | undefined, year: number, month: number): string {
  // Keep day=01; we don't care about exact day for opened_at.
  const mm = String(month).padStart(2, "0");
  return `${year}-${mm}-01`;
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function playIdForCredit(
  c: { signal_id?: string | null; name: string },
  i: number,
): string {
  if (c.signal_id) return `credit:${c.signal_id}`;
  return `credit:${slug(c.name)}:${i}`;
}

function slug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
}

interface ClusterFlags {
  annualFee: boolean;
  hasCredits: boolean;
  acceptsCategory: boolean;
  isPoolEligible: boolean;
  isCobrand: boolean;
}

interface ClusterNumbers {
  opening: string;
  fee?: string;
  aus: string;
  credits?: string;
  category?: string;
  pooling?: string;
  cobrand?: string;
  status: string;
}

function enumerateClusters(f: ClusterFlags): ClusterNumbers {
  const labels: string[] = ["opening"];
  if (f.annualFee) labels.push("fee");
  labels.push("aus");
  if (f.hasCredits) labels.push("credits");
  if (f.acceptsCategory) labels.push("category");
  if (f.isPoolEligible) labels.push("pooling");
  if (f.isCobrand) labels.push("cobrand");
  labels.push("status");

  const out = {} as Record<string, string>;
  labels.forEach((k, i) => {
    out[k] = String(i + 1).padStart(2, "0");
  });
  return out as unknown as ClusterNumbers;
}

// Quiet unused-vars lint when ReactNode is not directly returned.
export type { ReactNode };
