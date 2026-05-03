// User-profile types backed by the perks_profiles row. Engine consumes
// the same shape — we re-export from lib/engine/types for convenience.

import type { SpendCategoryId } from "@/lib/data/types";
import type {
  CardPlayState,
  CreditScoreBand,
  UserProfile,
  WalletCardHeld,
} from "@/lib/engine/types";

export type { UserProfile, WalletCardHeld, CardPlayState, CreditScoreBand };
export type { SpendCategoryId };
