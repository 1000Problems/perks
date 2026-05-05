"use client";

// RecurringCreditCard — the per-event (per-stay / per-booking) credit
// row introduced for v3 of the card page. Distinct from annual_credits
// (calendar-year cap) and ongoing_perks (passive). Drives the Reserve
// $100 Experience Credit on Citi Strata Premier; future home for Amex
// FHR amenity, Capital One Premier Collection $100, Hyatt anniversary
// nights, etc.
//
// Frequency is captured as a categorical bucket (0 / 1-2 / 3-5 / 6+),
// persisted via a synthetic CardPlayState row keyed
// `recurring_freq:{credit_id}` with the bucket label stored in `notes`.
// The page's existing onPlayStateChange handler in CardHero handles
// the round-trip identically to the group-skip rows (also synthetic
// playIds — see handleToggleGroupSkip).

import { useState } from "react";
import type { CardPlayState } from "@/lib/profile/types";
import { fmt } from "@/lib/utils/format";

export type FrequencyBucket = "0" | "1-2" | "3-5" | "6+";

const BUCKETS: { value: FrequencyBucket; label: string; midpoint: number }[] = [
  { value: "0", label: "0", midpoint: 0 },
  { value: "1-2", label: "1–2", midpoint: 1.5 },
  { value: "3-5", label: "3–5", midpoint: 4 },
  { value: "6+", label: "6+", midpoint: 7 },
];

const DEFAULT_BUCKET: FrequencyBucket = "1-2";

interface RecurringCredit {
  id: string;
  name: string;
  headline: string;
  event_label: string;
  value_per_event_usd: number;
  max_events_per_year: number | null;
  passive_companions: string[];
  stacks_with: string[];
  stack_caveats: string[];
  exclusions: string;
  where_to_book_url?: string;
  source: {
    url: string;
    type: string;
    label?: string;
    verified_at?: string;
  };
}

interface Props {
  credit: RecurringCredit;
  /** Median cpp on the card's program — drives the stacking-math earn line. */
  cppForStackMath: number;
  /** Existing playState row, if any, with bucket label persisted in notes. */
  existing: CardPlayState | undefined;
  /**
   * Called when the user picks a bucket. CardHero writes through to its
   * existing playState path with playId = `recurring_freq:{credit.id}`.
   */
  onPickBucket: (creditId: string, bucket: FrequencyBucket) => void;
}

function hostnameOf(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

function midpointFor(bucket: FrequencyBucket): number {
  return BUCKETS.find((b) => b.value === bucket)?.midpoint ?? 0;
}

export function RecurringCreditCard({
  credit,
  cppForStackMath,
  existing,
  onPickBucket,
}: Props) {
  const [stackingOpen, setStackingOpen] = useState(false);
  const persistedBucket = (existing?.notes ?? null) as FrequencyBucket | null;
  const [touched, setTouched] = useState(persistedBucket !== null);
  const selected: FrequencyBucket = persistedBucket ?? DEFAULT_BUCKET;
  const projectedValue = Math.round(
    midpointFor(selected) * credit.value_per_event_usd,
  );
  const sourceLabel = credit.source.label ?? hostnameOf(credit.source.url);

  // Stacking math example ($500 reference stay).
  const referenceStay = 500;
  const earnPoints = referenceStay * 10; // 10× CitiTravel earn — anchored here for v1.
  const earnUsd = (earnPoints * cppForStackMath) / 100;
  const annualHotelBenefit = 100;
  const reserveCredit = credit.value_per_event_usd;
  const breakfastValue = 60;
  const effectiveCost =
    referenceStay - annualHotelBenefit - reserveCredit - earnUsd;
  const savings = referenceStay - effectiveCost;

  return (
    <div className="recurring-credit-card">
      <div className="recurring-credit-head">
        <h3 className="recurring-credit-headline">{credit.headline}</h3>
        <p className="recurring-credit-cadence">
          {credit.max_events_per_year === null
            ? "Repeats — no annual cap"
            : `Up to ${credit.max_events_per_year} per year`}
        </p>
      </div>

      <div className="recurring-credit-frequency">
        <div className="recurring-credit-frequency-prompt">
          How many {credit.event_label}s per year?
        </div>
        <div className="recurring-credit-frequency-chips">
          {BUCKETS.map((b) => (
            <button
              key={b.value}
              type="button"
              className="recurring-credit-frequency-chip"
              data-selected={touched && selected === b.value ? "true" : "false"}
              onClick={() => {
                setTouched(true);
                onPickBucket(credit.id, b.value);
              }}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      <div className="recurring-credit-projected">
        {touched ? (
          <>
            <span className="recurring-credit-projected-label">Projected</span>
            <span className="recurring-credit-projected-value">
              {fmt.usd(projectedValue)}/year
            </span>
          </>
        ) : (
          <span className="recurring-credit-projected-prompt">
            Pick how often to see your projected value
          </span>
        )}
      </div>

      {credit.passive_companions.length > 0 && (
        <div className="recurring-credit-companions">
          <div className="recurring-credit-companions-eyebrow">
            Each {credit.event_label} also includes:
          </div>
          <ul className="recurring-credit-companions-list">
            {credit.passive_companions.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="recurring-credit-stacking">
        <button
          type="button"
          className="recurring-credit-stacking-toggle"
          onClick={() => setStackingOpen((v) => !v)}
          aria-expanded={stackingOpen}
        >
          {stackingOpen ? "Hide stacking math" : "Show stacking math"}
        </button>
        {stackingOpen && (
          <div className="recurring-credit-stacking-body">
            <p className="recurring-credit-stacking-eyebrow">
              Your first {fmt.usd(referenceStay)} {credit.event_label} this
              year is worth:
            </p>
            <table className="recurring-credit-stacking-table">
              <tbody>
                <tr>
                  <td>{fmt.usd(referenceStay)} hotel charge</td>
                  <td>{fmt.usd(referenceStay)}</td>
                </tr>
                <tr>
                  <td>− $100 Annual Hotel Benefit (one-time/year)</td>
                  <td>−{fmt.usd(annualHotelBenefit)}</td>
                </tr>
                <tr>
                  <td>− ${reserveCredit} Reserve Experience Credit (per stay)</td>
                  <td>−{fmt.usd(reserveCredit)}</td>
                </tr>
                <tr>
                  <td>+ Breakfast (~${breakfastValue} value), upgrade, Wi-Fi, check-in/out</td>
                  <td>free</td>
                </tr>
                <tr>
                  <td>
                    + 10× earn on {fmt.usd(referenceStay)} ={" "}
                    {earnPoints.toLocaleString()} pts ×{" "}
                    {cppForStackMath.toFixed(1)}¢
                  </td>
                  <td>+{fmt.usd(earnUsd)}</td>
                </tr>
                <tr className="recurring-credit-stacking-total">
                  <td>Effective cost</td>
                  <td>{fmt.usd(Math.max(0, effectiveCost))}</td>
                </tr>
                <tr className="recurring-credit-stacking-savings">
                  <td>You save</td>
                  <td>{fmt.usd(savings)}</td>
                </tr>
              </tbody>
            </table>
            {credit.stack_caveats.length > 0 && (
              <ul className="recurring-credit-stacking-caveats">
                {credit.stack_caveats.map((c, i) => (
                  <li key={i}>
                    <em>Verify: </em>
                    {c}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <div className="recurring-credit-footer">
        <p className="recurring-credit-source">
          <a
            href={credit.source.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Source: {sourceLabel}
          </a>
          {credit.source.verified_at && (
            <span className="recurring-credit-source-verified">
              {" · verified "}
              {credit.source.verified_at}
            </span>
          )}
        </p>
        {credit.where_to_book_url && (
          <a
            className="recurring-credit-cta"
            href={credit.where_to_book_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Find Reserve hotels →
          </a>
        )}
      </div>

      {credit.exclusions && (
        <p className="recurring-credit-exclusions">{credit.exclusions}</p>
      )}
    </div>
  );
}
