// Slim, RSC-safe serialization of the card database. Server components
// pass this shape across the RSC boundary; client components reconstruct
// the lookup Maps in a useMemo. Avoids shipping native Map instances
// across the boundary (which depended on React 19 flight serializer
// behavior we'd rather not rely on) and gives us a single place to slim
// the payload further if it ever grows.

import type {
  Card,
  CardDatabase,
  DestinationPerk,
  IssuerRules,
  PerksDedupEntry,
  Program,
  Signal,
} from "./loader";

export interface SerializedDb {
  cards: Card[];
  programs: Program[];
  issuerRules: IssuerRules[];
  perksDedup: PerksDedupEntry[];
  destinationPerks: Record<string, DestinationPerk>;
  signals: Signal[];
  manifest: CardDatabase["manifest"];
}

export function toSerialized(db: CardDatabase): SerializedDb {
  return {
    cards: db.cards,
    programs: db.programs,
    issuerRules: db.issuerRules,
    perksDedup: db.perksDedup,
    destinationPerks: db.destinationPerks,
    signals: db.signals,
    manifest: db.manifest,
  };
}

export function fromSerialized(s: SerializedDb): CardDatabase {
  return {
    cards: s.cards,
    programs: s.programs,
    issuerRules: s.issuerRules,
    perksDedup: s.perksDedup,
    destinationPerks: s.destinationPerks,
    signals: s.signals,
    manifest: s.manifest,
    cardById: new Map(s.cards.map((c) => [c.id, c])),
    programById: new Map(s.programs.map((p) => [p.id, p])),
    issuerRulesByIssuer: new Map(s.issuerRules.map((r) => [r.issuer, r])),
    signalById: new Map(s.signals.map((sig) => [sig.id, sig])),
  };
}
