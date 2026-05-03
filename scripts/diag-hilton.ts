import { rankCards } from "@/lib/engine/ranking";
import { loadCardDatabase } from "@/lib/data/loader";
import type { UserProfile, RankOptions } from "@/lib/engine/types";

const db = loadCardDatabase();
const profile: UserProfile = {
  spend_profile: { hotels: 4000, other: 30000 },
  brands_used: ["Hilton"],
  cards_held: [],
  trips_planned: [],
  credit_score_band: "very_good",
  preferences: {},
};
const opts: RankOptions = {
  filter: "total",
  scoring: { creditsMode: "realistic", subAmortizeMonths: 24 },
  today: new Date("2026-05-01"),
  limit: 50,
};
const r = rankCards(profile, [], db, opts);
const hiltonish = (id: string) => /hilton/i.test(id);
console.log("visible count:", r.visible.length);
console.log("Hilton visible:", r.visible.filter(v => hiltonish(v.card.id)).map(v => `${v.card.id} delta=${v.score.deltaOngoing}`));
console.log("Hilton denied:", r.denied.filter(v => hiltonish(v.card.id)).map(v => `${v.card.id} status=${v.eligibility.status} note=${v.eligibility.note}`));
