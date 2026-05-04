"use client";

// Signals editor — the cluster-stack body of the per-card edit panel.
// Extracted from EditPanel.tsx so the new card-hero page can compose it
// alongside the value-content sections without duplicating the
// identity strip, found-money tile, or deadlines bar (those live at
// the top of the hero page).
//
// Persistence and patch dispatch are owned by the parent (CardHero or
// EditWalletClient).

import { useMemo, type ReactNode } from "react";
import type { Card, CardDatabase } from "@/lib/data/loader";
import type { SpendCategoryId } from "@/lib/data/types";
import type {
  CardPlayState,
  UserProfile,
  WalletCardHeld,
} from "@/lib/profile/types";
import { fmt } from "@/lib/utils/format";
import { MONTH_LABELS, parseYM } from "@/lib/utils/openedAt";
import {
  Cluster,
  Field,
  PillGroup,
  Stepper,
  Toggle,
  YesNo,
} from "./primitives";
import { CategoryPicker } from "./CategoryPicker";

export type CardPatch = Partial<Omit<WalletCardHeld, "card_id">>;

interface Props {
  card: Card;
  held: WalletCardHeld;
  profile: UserProfile;
  db: CardDatabase;
  playState: CardPlayState[];
  isNew: boolean;
  onPatch: (patch: CardPatch) => void;
  onPlayStateChange: (
    playId: string,
    state: { state: CardPlayState["state"]; claimed_at?: string | null },
  ) => void;
  onCancel: () => void;
  onRemove: () => void;
  onSave: () => void;
  /** When true, layout collapses for narrow viewports (full-width clusters). */
  compact?: boolean;
}

export function SignalsEditor({
  card,
  held,
  profile,
  playState,
  isNew,
  onPatch,
  onPlayStateChange,
  onCancel,
  onRemove,
  onSave,
  compact = false,
}: Props) {
  const fee = card.annual_fee_usd ?? 0;
  const isPoolEligible = Boolean(card.is_pool_spoke);
  const isCobrand = Boolean(card.is_cobrand);
  const acceptsCategory =
    Array.isArray(card.accepts_pinned_category) &&
    card.accepts_pinned_category.length > 0;

  const creditPlayIds = useMemo(
    () => card.annual_credits.map((c, i) => playIdForCredit(c, i)),
    [card],
  );
  const playStateMap = useMemo(() => {
    const m = new Map<string, CardPlayState>();
    for (const p of playState) m.set(p.play_id, p);
    return m;
  }, [playState]);

  const [openYear, openMonth] = parseYM(held.opened_at);
  const today = useMemo(() => new Date(), []);

  const afNext = useMemo(() => {
    if (!fee || !openYear || !openMonth) return null;
    const candidate = new Date(today.getFullYear(), openMonth - 1, 1);
    if (candidate <= today) candidate.setFullYear(today.getFullYear() + 1);
    return candidate;
  }, [fee, openYear, openMonth, today]);
  const afDays = afNext
    ? Math.ceil((afNext.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const recommendedCategories = useMemo<SpendCategoryId[]>(() => {
    return Object.entries(profile.spend_profile ?? {})
      .filter(([, v]) => (v ?? 0) > 0)
      .sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0))
      .slice(0, 3)
      .map(([k]) => k as SpendCategoryId);
  }, [profile.spend_profile]);

  const closingRiskPoints =
    held.card_status_v2 === "considering_close" &&
    (card.currency_earned ?? "").toLowerCase().includes("thankyou");

  const claimedCount = card.annual_credits.reduce((n, _, i) => {
    const id = creditPlayIds[i];
    return playStateMap.get(id)?.state === "got_it" ? n + 1 : n;
  }, 0);
  const claimedValue = card.annual_credits.reduce((s, c, i) => {
    const id = creditPlayIds[i];
    if (playStateMap.get(id)?.state !== "got_it") return s;
    return s + (c.value_usd ?? 0);
  }, 0);

  const numbers = enumerateClusters({
    annualFee: fee > 0,
    hasCredits: card.annual_credits.length > 0,
    acceptsCategory,
    isPoolEligible,
    isCobrand,
  });

  const defaultOpen = !compact;

  return (
    <div className="signals-editor">
      <div className="signals-editor-head">
        <div className="eyebrow">Your card · signals</div>
        <h2 className="signals-editor-title">
          Tell us how you use this card
        </h2>
        <p className="signals-editor-sub">
          Every answer tightens the audit math. Nothing here is required.
        </p>
      </div>

      <div className="cluster-stack">
        <Cluster
          num={numbers.opening}
          title="Card details"
          sub="Sign-up bonus and nickname. Opened date lives at the top of the page."
          defaultOpen={defaultOpen}
        >
          <div className="row-grid">
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

        {fee > 0 && (
          <Cluster
            num={numbers.fee!}
            title="Annual fee schedule"
            sub={`${fmt.usd(fee)}/yr · auto-computed from opening date`}
            defaultOpen={defaultOpen}
          >
            <div className="af-row">
              {afNext ? (
                <div className="af-chip">
                  <div>
                    <div className="label">Next fee</div>
                    <div className="date">
                      {MONTH_LABELS[afNext.getMonth()]} {afNext.getDate()},{" "}
                      {afNext.getFullYear()}
                    </div>
                  </div>
                  <div className="countdown">
                    {afDays} day{afDays === 1 ? "" : "s"}
                  </div>
                </div>
              ) : (
                <div className="af-empty">
                  Set an opening date to estimate your next fee.
                </div>
              )}
            </div>
          </Cluster>
        )}

        <Cluster
          num={numbers.aus}
          title="Authorized users"
          sub="AU spend earns into your primary points balance."
          defaultOpen={defaultOpen}
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

        {numbers.credits && (
          <Cluster
            num={numbers.credits}
            title="Already-claimed benefits this year"
            sub={`${claimedCount} of ${card.annual_credits.length} claimed`}
            defaultOpen={defaultOpen}
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

        {numbers.category && (
          <Cluster
            num={numbers.category}
            title="5x category"
            sub="Pick the category you'll earn 5x in (up to $500/mo)."
            defaultOpen={defaultOpen}
          >
            <CategoryPicker
              options={(card.accepts_pinned_category ?? []) as SpendCategoryId[]}
              value={(held.pinned_category ?? null) as SpendCategoryId | null}
              onChange={(v) => onPatch({ pinned_category: v ?? undefined })}
              recommended={recommendedCategories}
            />
          </Cluster>
        )}

        {numbers.pooling && (
          <Cluster
            num={numbers.pooling}
            title="Point pooling"
            sub="Pooled to a premium card preserves your transfer ratio."
            defaultOpen={defaultOpen}
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

        {numbers.cobrand && (
          <Cluster
            num={numbers.cobrand}
            title="Elite & cobrand activity"
            sub="Unlocks status-tied perks in the audit."
            defaultOpen={defaultOpen}
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

        <Cluster
          num={numbers.status}
          title="Status"
          sub="What's the state of this card in your wallet?"
          defaultOpen={defaultOpen}
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

      <div className="panel-footer">
        <button type="button" className="remove-link" onClick={onRemove}>
          Remove from wallet
        </button>
        <div className="panel-footer-actions">
          <button type="button" className="btn" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary" onClick={onSave}>
            {isNew ? "Add card" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── helpers ──────────────────────────────────────────────────────────────

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

export type { ReactNode };
