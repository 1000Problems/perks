"use client";

// Onboarding step 1: capture the user's self-reported credit band.
// Six options matching the Postgres credit_score_band enum. Drives
// which cards we surface as risky vs approvable in the recommender.
//
// We never pull credit. The number stays on the user's account row.

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateCreditBand } from "@/lib/profile/actions";
import type { CreditScoreBand } from "@/lib/profile/types";

interface Option {
  band: CreditScoreBand;
  label: string;
  hint: string;
}

const OPTIONS: Option[] = [
  { band: "excellent", label: "Excellent", hint: "800 or higher" },
  { band: "very_good", label: "Very good", hint: "740 – 799" },
  { band: "good", label: "Good", hint: "670 – 739" },
  { band: "fair", label: "Fair", hint: "580 – 669" },
  { band: "building", label: "Building credit", hint: "Below 580 or no credit history yet" },
  { band: "unknown", label: "I'm not sure", hint: "Skip — we'll show all options" },
];

interface Props {
  initialBand: CreditScoreBand | null;
}

export function CreditForm({ initialBand }: Props) {
  const router = useRouter();
  const [selected, setSelected] = useState<CreditScoreBand | null>(initialBand);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleContinue() {
    if (!selected) {
      setError("Pick one to continue.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const res = await updateCreditBand(selected);
      if (!res.ok) {
        setError("Couldn't save — try again.");
        return;
      }
      router.push("/onboarding/spend");
    });
  }

  return (
    <div>
      <p
        style={{
          fontSize: 13,
          color: "var(--ink-2)",
          lineHeight: 1.55,
          maxWidth: 600,
          marginTop: 0,
        }}
      >
        Drives which cards we recommend. We never pull your credit. The answer
        stays on your account, and you can change it any time.
      </p>

      <div
        role="radiogroup"
        aria-label="Credit score band"
        style={{
          marginTop: 18,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {OPTIONS.map((opt) => {
          const isSelected = selected === opt.band;
          return (
            <button
              key={opt.band}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => setSelected(opt.band)}
              style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr",
                gap: 14,
                alignItems: "center",
                padding: "14px 18px",
                borderRadius: 12,
                border: `1px solid ${isSelected ? "var(--ink)" : "var(--rule)"}`,
                background: isSelected ? "var(--paper-2)" : "var(--paper)",
                cursor: "pointer",
                textAlign: "left",
                fontFamily: "inherit",
                color: "inherit",
                transition: "border-color 80ms, background 80ms",
              }}
            >
              <span
                aria-hidden
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 999,
                  border: `1.5px solid ${isSelected ? "var(--ink)" : "var(--rule-2)"}`,
                  background: "var(--paper)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {isSelected && (
                  <span
                    style={{
                      width: 9,
                      height: 9,
                      borderRadius: 999,
                      background: "var(--ink)",
                    }}
                  />
                )}
              </span>
              <span style={{ minWidth: 0 }}>
                <span style={{ display: "block", fontSize: 14, fontWeight: 500 }}>
                  {opt.label}
                </span>
                <span style={{ display: "block", fontSize: 12.5, color: "var(--ink-3)", marginTop: 2 }}>
                  {opt.hint}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 36,
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 12,
        }}
      >
        {error && (
          <span style={{ fontSize: 12, color: "var(--neg)" }}>
            {error}
          </span>
        )}
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleContinue}
          disabled={isPending || !selected}
        >
          {isPending ? "Saving…" : "Continue →"}
        </button>
      </div>
    </div>
  );
}
