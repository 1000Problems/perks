"use client";

// Optimistic-update profile hook. Holds a server-seeded profile in
// state, exposes an `update` function that takes either a partial or a
// (prev) => next shape, and persists with a 500ms debounce so slider
// drags don't hammer the database.

import { useCallback, useEffect, useRef, useState } from "react";
import type { UserProfile } from "./types";
import { updateProfile, type UpdateResult } from "./actions";

const DEBOUNCE_MS = 500;

type Updater = Partial<UserProfile> | ((prev: UserProfile) => Partial<UserProfile>);

export type ProfileErrorCode = NonNullable<UpdateResult["error"]>;

// Map stable error codes to user-facing copy. Forms render this string
// directly; the underlying SQL message is logged server-side only.
export function profileErrorMessage(code: ProfileErrorCode | null): string | null {
  if (!code) return null;
  switch (code) {
    case "card_not_in_catalog":
      return "That card isn't in our catalog yet — try another, or let us know.";
    case "duplicate_card":
      return "That card is already in your wallet.";
    case "missing_table":
      return "Database isn't fully set up yet — contact support.";
    case "not_authenticated":
      return "You're signed out. Refresh and sign in again.";
    case "invalid_band":
      return "Pick a valid credit band.";
    case "update_failed":
    default:
      return "Couldn't save — try again.";
  }
}

export interface UseProfileApi {
  profile: UserProfile;
  update: (updater: Updater) => void;
  // Force any pending debounced write to flush immediately. Resolves to
  // true if there was nothing to save or the write succeeded; false if
  // the write failed (callers should NOT navigate in that case so the
  // user stays on the form to see the error). Always call before
  // navigating away.
  flushNow: () => Promise<boolean>;
  saving: boolean;
  error: ProfileErrorCode | null;
  // Raw SQL message when the server couldn't classify the error. Useful
  // for triage; the form should keep `error` as the primary signal and
  // surface this only as supplemental detail.
  errorDetail: string | null;
}

export function useProfile(initial: UserProfile): UseProfileApi {
  const [profile, setProfile] = useState<UserProfile>(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<ProfileErrorCode | null>(null);
  const [errorDetail, setErrorDetail] = useState<string | null>(null);
  const pendingRef = useRef<Partial<UserProfile> | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flush = useCallback(async (): Promise<boolean> => {
    const payload = pendingRef.current;
    pendingRef.current = null;
    if (!payload) return true;
    setSaving(true);
    setError(null);
    setErrorDetail(null);
    const result = await updateProfile(payload);
    setSaving(false);
    if (!result.ok) {
      setError(result.error ?? "update_failed");
      setErrorDetail(result.detail ?? null);
      // Re-queue the failed payload so a subsequent flushNow can retry
      // (e.g. the user fixes the issue and clicks Continue again).
      pendingRef.current = payload;
      return false;
    }
    return true;
  }, []);

  const update = useCallback(
    (updater: Updater) => {
      setProfile((prev) => {
        const partial =
          typeof updater === "function" ? updater(prev) : updater;
        const next: UserProfile = {
          spend_profile: partial.spend_profile ?? prev.spend_profile,
          brands_used: partial.brands_used ?? prev.brands_used,
          cards_held: partial.cards_held ?? prev.cards_held,
          trips_planned: partial.trips_planned ?? prev.trips_planned,
          preferences: { ...prev.preferences, ...(partial.preferences ?? {}) },
        };
        // Accumulate the partial for the debounced write.
        const acc = pendingRef.current ?? {};
        pendingRef.current = {
          spend_profile: partial.spend_profile ?? acc.spend_profile,
          brands_used: partial.brands_used ?? acc.brands_used,
          cards_held: partial.cards_held ?? acc.cards_held,
          trips_planned: partial.trips_planned ?? acc.trips_planned,
          preferences: { ...(acc.preferences ?? {}), ...(partial.preferences ?? {}) },
        };
        return next;
      });

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        void flush();
      }, DEBOUNCE_MS);
    },
    [flush],
  );

  const flushNow = useCallback(async (): Promise<boolean> => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    return await flush();
  }, [flush]);

  // Flush on unmount so navigating away doesn't drop a pending write.
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        void flush();
      }
    };
  }, [flush]);

  return { profile, update, flushNow, saving, error, errorDetail };
}
