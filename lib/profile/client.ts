"use client";

// Optimistic-update profile hook. Holds a server-seeded profile in
// state, exposes an `update` function that takes either a partial or a
// (prev) => next shape, and persists with a 500ms debounce so slider
// drags don't hammer the database.

import { useCallback, useEffect, useRef, useState } from "react";
import type { UserProfile } from "./types";
import { updateProfile } from "./actions";

const DEBOUNCE_MS = 500;

type Updater = Partial<UserProfile> | ((prev: UserProfile) => Partial<UserProfile>);

export interface UseProfileApi {
  profile: UserProfile;
  update: (updater: Updater) => void;
  // Force any pending debounced write to flush immediately. Returns
  // when the write completes — call before navigating away from the
  // form so the next page reads the freshest profile.
  flushNow: () => Promise<void>;
  saving: boolean;
  error: string | null;
}

export function useProfile(initial: UserProfile): UseProfileApi {
  const [profile, setProfile] = useState<UserProfile>(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pendingRef = useRef<Partial<UserProfile> | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flush = useCallback(async () => {
    const payload = pendingRef.current;
    pendingRef.current = null;
    if (!payload) return;
    setSaving(true);
    setError(null);
    const result = await updateProfile(payload);
    setSaving(false);
    if (!result.ok) setError(result.error ?? "update_failed");
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

  const flushNow = useCallback(async () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    await flush();
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

  return { profile, update, flushNow, saving, error };
}
