# TASK: Money-Find Card Page (per-card hero rewrite)

> Replace the encyclopedic per-card hero with a money-finding agent: every benefit is a personalized opportunity row with a tristate question, the page learns from the user's answers, and the layout adapts to data depth.

## Context

The current `/wallet/cards/[id]` hero page (shipped in v0) reads as a card review — it lists every transfer partner, every credit, every protection. The CEO's product pivot: stop parroting the issuer's catalog. Every line item should answer two questions — *"What's $X you can grab right now, given what we know about you?"* and *"What's your relationship to this — using it, going to use it, not interested?"* — and the page itself should drive deeper signal collection so the recommender layer can operate on real usage data instead of generic spend.

This TASK rewrites the hero page around a money-find data model, an adaptive Hero region (cold → warm → hot states based on data depth), grouped catalog rows where every entry is a tristate-driven money-find, a calendar-driven Mechanics zone, and a page-level cross-card recommendation tile. Persistence reuses the existing `user_card_play_state` table — no schema migration needed.

## Requirements

1. **Card markdown schema additions** — extend `scripts/lib/schemas.ts` with a `PlaySchema` (group, headline, personalization template, value model, item question type, action) and a `ColdPromptSchema` (3 priority questions per card). Both are optional, additive arrays attached to `CardSchema`. `npm run cards:build` validates.

2. **Money-find engine** — pure functions in `lib/engine/moneyFind.ts` and `lib/engine/heroState.ts`. `scoreFinds(card, profile, playState, today) → ScoredFind[]` ranks every play for the user with personalized $value and visibility. `deriveHeroState(card, playState) → "cold" | "warm" | "hot"` plus `dataDepthRatio()`.

3. **Synthetic-play-id persistence pattern** — group-skips and cold-prompt answers reuse the existing `user_card_play_state` table via reserved `play_id` namespaces (`group:airlines`, `cold:going_to_japan`). No DB migration. New `getCurrentCardPlayState` already returns these — engines decode them via prefix check. Document the namespace convention in the engine's header comment.

4. **Hero page rewrite** — replace `components/wallet-v2/CardHero.tsx` and `HeroSections.tsx` with the new layout: adaptive `<HeroAdaptive>` zone at top, `<CatalogGroup>` × N (Hotels, Airlines, Travel-services, Shopping, Cash, Niche), `<MechanicsZone>`, `<CrossCardTile>`, `<ManageCardDisclosure>` (wraps existing SignalsEditor in a collapsed disclosure). New components live in `components/wallet-v2/`. Existing `SignalsEditor.tsx` is preserved verbatim — just rendered inside a `<details>` at the bottom.

5. **Author Strata Premier money-finds + cold prompts** — populate `cards/citi_strata_premier.md` with a `## card_plays` block (~28 entries spanning all 6 groups) and a `## cold_prompts` block (3 entries). This is the v0 proof. No other cards get authored in this TASK — they continue rendering with the legacy fallback (one-line "data coming soon" rows in each group, page mostly empty).

## Implementation Notes

### Files to create

- `lib/engine/moneyFind.ts` — money-find scorer.
- `lib/engine/heroState.ts` — hero state + data-depth derivation.
- `components/wallet-v2/MoneyFindRow.tsx` — single row (headline + personalization sentence + $value or probe + tristate + expansion).
- `components/wallet-v2/CatalogGroup.tsx` — group container with header (icon, label, group-level skip toggle, group $value summary) and ranked rows beneath.
- `components/wallet-v2/HeroAdaptive.tsx` — renders one of three states based on `deriveHeroState` output.
- `components/wallet-v2/MechanicsZone.tsx` — calendar-driven items only (AF clock, SUB eligibility, deval countdown, points-at-risk).
- `components/wallet-v2/CrossCardTile.tsx` — page-level rec tile, gated until 5+ catalog signals are filled.
- `components/wallet-v2/ManageCardDisclosure.tsx` — `<details>` wrapper around existing `SignalsEditor`.

### Files to modify (rewrite)

- `components/wallet-v2/CardHero.tsx` — rewrite to compose: HeroAdaptive → CatalogGroup × N → MechanicsZone → CrossCardTile → ManageCardDisclosure. Keep existing `useCallback`/`useEffect` patch-flushing logic; remove the old top-of-page identity strip + found-money tile + per-section read-only renders (those move into HeroAdaptive's "hot" state for found-money and into MoneyFindRow content for the rest).
- `components/wallet-v2/HeroSections.tsx` — **delete this file**. The components inside (EarningGrid, CreditsAndPerks, TransferPartners, SweetSpots, IssuerRulesSection) are replaced by the catalog-group + money-find-row pattern. Existing data they read continues to flow in through plays (multipliers, credits, sweet spots all become plays with appropriate group + value_model).
- `scripts/lib/schemas.ts` — add `PlaySchema` and `ColdPromptSchema` (see shapes below); attach to `CardSchema` as `card_plays: z.array(PlaySchema).default([])` and `cold_prompts: z.array(ColdPromptSchema).default([])`.
- `cards/citi_strata_premier.md` — append `## card_plays` and `## cold_prompts` markdown sections (JSON arrays inside ```json fenced blocks). Existing sections (`cards.json entry`, `programs.json entry`, etc.) stay untouched.
- `scripts/lib/parse.ts` — add `## card_plays` and `## cold_prompts` to `SECTION_KEYS` and extract into the parsed card object. Same pattern as the existing soul sections.
- `scripts/build-card-db.ts` — pass parsed `plays` and `coldPrompts` through to the validated `Card` so they travel inside `data/cards.json` (no separate file).
- `app/wallet-edit-v2.css` — add styles for `.hero-adaptive`, `.catalog-group`, `.money-find-row`, `.mechanics-zone`, `.cross-card-tile`, `.manage-card-disclosure`. Drop styles that only the deleted `HeroSections.tsx` components used (`.earning-grid`, `.credits-grid`, `.partner-grid`, `.sweet-spot.rich`, `.rule-list`, etc. — confirm via grep before removal).

### Schema (paste into `scripts/lib/schemas.ts`)

```ts
const PlayGroup = z.enum([
  "hotels",
  "airlines",
  "travel_services",   // car rentals, lounges, trip protections, FX
  "shopping",          // online portals, gift cards, brand multipliers
  "cash",              // earning multipliers (cash mode), pooling, cash-out plays
  "niche",             // tax-payment, Curve hack, sharing-window, retention
]);

const PlayValueModel = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("multiplier_on_category"),
    spend_category: z.enum([
      "groceries", "dining", "gas", "airfare", "hotels",
      "streaming", "shopping", "drugstore", "transit",
      "utilities", "home", "other",
    ]),
    pts_per_dollar: z.number(),
    cap_usd_per_year: z.number().nullable().optional(),
  }),
  z.object({
    kind: z.literal("fixed_credit"),
    value_usd: z.number(),
    period: z.enum(["calendar_year", "anniversary_year", "monthly", "quarterly", "per_stay"]),
    requires_signal_id: z.string().nullable().optional(),
  }),
  z.object({
    kind: z.literal("transfer_redemption"),
    partner_program: z.string(),
    points_one_way: z.number(),
    cash_equiv_usd_low: z.number(),
    cash_equiv_usd_high: z.number(),
    destination_signal: z.string().nullable().optional(),
    surcharges_usd: z.number().nullable().optional(),
  }),
  z.object({
    kind: z.literal("protection_coverage"),
    max_value_usd: z.number(),
    period: z.enum(["per_trip", "per_claim", "annual"]),
    trigger_question: z.string(),  // e.g. "Had a 6+ hour flight delay this year?"
  }),
  z.object({
    kind: z.literal("system_mechanic"),
    note: z.string(),
  }),
  z.object({
    kind: z.literal("niche_play"),
    estimated_annual_value_usd: z.number().nullable().optional(),
    risk_tier: z.enum(["green", "yellow"]).default("green"),
  }),
]);

// Item-question style — drives the tristate label above the chips.
// All groups use the same three states (using / going_to / skip) but
// the displayed question varies by item type.
const PlayQuestion = z.enum([
  "spending_here",          // multipliers: "Spending here regularly?"
  "claimed_this_year",      // credits: "Claimed this year?"
  "have_done_this",         // sweet spots / niche: "Done this redemption?"
  "have_filed_claim",       // protections: "Happen to you / filed a claim?"
  "set_up",                 // mechanics: "Set this up / done?"
]);

export const PlaySchema = z.object({
  id: z.string(),
  group: PlayGroup,
  headline: z.string(),                   // clickbait-style, ≤80 chars
  personalization_template: z.string(),   // mustache-ish — see engine notes
  value_model: PlayValueModel,
  question: PlayQuestion,
  prerequisites: z.object({
    cards_held_any_of: z.array(z.string()).default([]),
    cards_held_all_of: z.array(z.string()).default([]),
    profile_signals: z.array(z.string()).default([]),
  }).default({ cards_held_any_of: [], cards_held_all_of: [], profile_signals: [] }),
  action_label: z.string().optional(),    // primary CTA text on the row
  mechanism_md: z.string(),
  how_to_md: z.string(),
  conditions_md: z.string().optional(),
  expires_at: IsoDate.optional(),
  source_urls: z.array(Url).default([]),
});

export const ColdPromptSchema = z.object({
  id: z.string(),                         // synthetic play_id when answered (cold:<id>)
  question: z.string(),                   // displayed verbatim
  answer_chips: z.array(z.object({
    value: z.string(),
    label: z.string(),
  })),
  unlocks_value_estimate_usd: z.number(), // rough "this answer unlocks $X" framing
  unlocks_groups: z.array(PlayGroup).default([]),
});
```

Attach to `CardSchema`:

```ts
card_plays: z.array(PlaySchema).default([]),
cold_prompts: z.array(ColdPromptSchema).default([]),
```

### Money-find engine signature (paste skeleton into `lib/engine/moneyFind.ts`)

```ts
import type { Card, CardDatabase } from "@/lib/data/loader";
import type { CardPlayState, UserProfile } from "@/lib/profile/types";
import type { Play } from "@/lib/data/types"; // re-export from loader

export interface ScoredFind {
  play: Play;
  score: number;             // 0-100; drives ranking within group
  visible: boolean;          // hide low-score / no-fit rows in compact mode
  personalSentence: string;  // rendered from personalization_template
  valueUsd: number | null;   // null when value depends on a signal we lack
  valueRange: [number, number] | null;
  status: "using" | "going_to" | "skip" | "unset";
  groupSkipped: boolean;     // user marked the whole group as skip
  needsProbe: boolean;       // true when valueUsd is null but a probe could resolve it
  probeQuestion: string | null;
}

export function scoreFinds(
  card: Card,
  profile: UserProfile,
  playState: CardPlayState[],
  today: string,             // YYYY-MM-DD; injected to keep pure
): ScoredFind[];

// Synthetic play_id namespaces — convention documented here so the engine
// and the page-level state writers agree:
//
//   group:<group_name>      → group-level state (state="skip" silences the group)
//   cold:<prompt_id>        → cold-prompt answer (state="got_it" with notes=answer_value)
//
// Helpers:
export function isGroupSkipped(playState: CardPlayState[], group: string): boolean;
export function getColdPromptAnswer(playState: CardPlayState[], promptId: string): string | null;
```

Personalization template syntax: `{spend.dining}`, `{destinations.contains:japan}`, `{cold:going_to_japan}` interpolated to numeric/text values from profile + cold-prompt answers. Missing keys render as a probe — engine sets `needsProbe=true` and emits the related cold-prompt question into `probeQuestion`.

Personal score formula (kept simple for v0):
- Base 50.
- +30 if at least one `prerequisites.profile_signals` matches.
- +15 if the row's value_model has a destination_signal and it matches a user destination.
- +20 if user's spend in the value_model's spend_category is non-zero (multiplier rows only).
- +10 for niche plays with green risk_tier; -10 for yellow risk_tier.
- −40 if the play's group is in the silenced-groups set AND the row isn't explicitly marked `going_to` or `using`.
- 0 cap at 100.

### Hero state engine (paste skeleton into `lib/engine/heroState.ts`)

```ts
export type HeroState = "cold" | "warm" | "hot";

export interface HeroSummary {
  state: HeroState;
  dataDepth: number;        // 0..1 — fraction of catalog rows with non-unset state
  catalogTotal: number;
  catalogAnswered: number;
  coldPromptsAnswered: number;
  coldPromptsTotal: number;
}

export function deriveHeroState(
  card: Card,
  playState: CardPlayState[],
): HeroSummary;
```

Thresholds:
- `cold` if `coldPromptsAnswered === 0` AND `catalogAnswered === 0`
- `warm` if any answers exist but `dataDepth < 0.6`
- `hot` if `dataDepth >= 0.6`

### Persistence pattern — synthetic play_ids

The existing `updateCardPlayState(cardId, playId, state)` server action is reused unchanged. Group-skip writes a row with `play_id = "group:airlines"` and `state = "skip"` (or `state = "unset"` to undo). Cold-prompt answers write `play_id = "cold:going_to_japan"`, `state = "got_it"`, `notes = "yes_in_march"` (the chip value). Document this convention at the top of `moneyFind.ts`.

The existing `getCurrentCardPlayState` already returns all rows for a card; the engine filters `play_id.startsWith("group:")` and `play_id.startsWith("cold:")` to extract the synthetic state.

### Hero page composition (paste structure into `components/wallet-v2/CardHero.tsx`)

```tsx
return (
  <main className="card-hero-page">
    <Link className="back-link">← Wallet</Link>

    <DeadlinesStrip cardId={cardId} today={today} />

    <header className="card-hero-identity">
      <CardArt size="xl" ... />
      <div className="card-hero-identity-body">
        <div className="eyebrow">{card.issuer}</div>
        <h1>{held.nickname || card.name}</h1>
        <div className="card-hero-meta">{/* AF, network, currency */}</div>
      </div>
    </header>

    <HeroAdaptive
      state={heroSummary.state}
      summary={heroSummary}
      coldPrompts={card.cold_prompts}
      coldAnswers={coldAnswers}
      topFinds={topFinds}    // top 3 ranked finds for "warm"/"hot"
      onAnswerColdPrompt={handleColdAnswer}
      onMarkFind={handleStatusChange}
    />

    {GROUPS.map((group) => (
      <CatalogGroup
        key={group}
        group={group}
        finds={findsByGroup.get(group) ?? []}
        skipped={isGroupSkipped(playState, group)}
        onToggleGroupSkip={() => handleToggleGroupSkip(group)}
        onMarkFind={handleStatusChange}
        spendSignal={spendByGroup.get(group)}
      />
    ))}

    <MechanicsZone card={card} held={held} today={today} />

    <CrossCardTile
      card={card}
      profile={profile}
      playState={playState}
      catalogAnswered={heroSummary.catalogAnswered}
    />

    <ManageCardDisclosure>
      <SignalsEditor {...existingProps} />
    </ManageCardDisclosure>
  </main>
);
```

Group rendering rules in `<CatalogGroup>`:
- Header always visible — group label, group-level $value summary (sum of `valueUsd` across visible rows), group-skip toggle.
- When `skipped === true`: rows collapse to a single "12 hidden — show anyway" toggle. Rows the user explicitly marked `using` or `going_to` stay visible above the collapse.
- When user toggles group skip with a non-zero spend signal in that group's spend categories, show inline confirmation: "Heads up — you spend $8K/yr here. Skipping hides ~$240/yr. Still skip?" with confirm/cancel chips.

`<MoneyFindRow>` shape: headline (h3), personalization sentence (1 line muted), value chip (right side — $value, range, or "tell us X to see your number"), tristate question + chips, expand-on-click for `mechanism_md` + `how_to_md` + `conditions_md` + `action_label` button + `source_urls`.

`<CrossCardTile>` rules:
- If `catalogAnswered < 5`: render "Tell us more about how you use this card to get specific recommendations" with progress chip; no recs.
- Otherwise: 1-3 ranked recs from a stub helper `recommendNextCard(card, profile, playState, db) → CardRec[]` — for v0 this can return an empty array; the tile just has to compile and render the empty-state copy. Real rec generation is a follow-up TASK.

### Strata Premier authoring (append to `cards/citi_strata_premier.md`)

After the existing sections, add:

```markdown
## card_plays

\`\`\`json
[
  /* HOTELS group */
  {"id": "hyatt_park_tokyo", "group": "hotels", "headline": "Sleep at Park Hyatt Tokyo for ~$700/night cheaper", "personalization_template": "You said you're going to Japan in {cold:going_to_japan}. 30k–40k UR pts at the Park Hyatt covers nights normally costing $700+.", "value_model": {"kind": "transfer_redemption", "partner_program": "World of Hyatt", "points_one_way": 35000, "cash_equiv_usd_low": 600, "cash_equiv_usd_high": 900, "destination_signal": "destination_japan", "surcharges_usd": 0}, "question": "have_done_this", "prerequisites": {"profile_signals": ["destination_japan"], "cards_held_any_of": [], "cards_held_all_of": []}, "action_label": "Find dates", "mechanism_md": "Citi → World of Hyatt 1:1. Park Hyatt Tokyo prices at Hyatt Cat 7 (35k–45k pts/night). Pool TY points to Strata Premier first to get the 1:1 ratio.", "how_to_md": "1. Find available dates on hyatt.com.\n2. Transfer Citi → Hyatt 1:1.\n3. Book on hyatt.com.", "source_urls": ["https://thepointsguy.com/loyalty-programs/redeeming-citi-thankyou-points-maximum-value/"]},
  {"id": "vacasa_wyndham", "group": "hotels", "headline": "$300+ vacation rentals for 15k Wyndham points/night", "personalization_template": "Cheapest US vacation-rental redemption around. Skip Vacasa's cleaning fees too.", "value_model": {"kind": "transfer_redemption", "partner_program": "Wyndham Rewards", "points_one_way": 15000, "cash_equiv_usd_low": 200, "cash_equiv_usd_high": 600, "destination_signal": null, "surcharges_usd": 0}, "question": "have_done_this", "prerequisites": {"profile_signals": [], "cards_held_any_of": [], "cards_held_all_of": []}, "action_label": "Browse Vacasa", "mechanism_md": "Wyndham prices Vacasa rentals at 15k pts/bedroom/night. Bookings often skip cleaning + resort fees that apply to cash stays.", "how_to_md": "1. Search Vacasa availability at wyndhamrewards.com.\n2. Transfer Citi → Wyndham 1:1 (~24h).\n3. May require a phone call to complete.", "source_urls": ["https://travelfreely.com/citi-thankyou-points-sweet-spots/"]},
  {"id": "hotel_credit_100", "group": "hotels", "headline": "$100 free hotel — burn it before Dec 31", "personalization_template": "Once a calendar year on a $500+ stay via CitiTravel.com. {capture:hotel_credit_100} so far this year.", "value_model": {"kind": "fixed_credit", "value_usd": 100, "period": "calendar_year", "requires_signal_id": "hotel_credit"}, "question": "claimed_this_year", "prerequisites": {"profile_signals": [], "cards_held_any_of": [], "cards_held_all_of": []}, "action_label": "Find a $500 hotel", "mechanism_md": "Citi knocks $100 off any single $500+ hotel stay (excl. taxes/fees) booked through CitiTravel.com. Applied instantly at booking. Primary cardholder only — AUs share.", "how_to_md": "1. Search hotels at CitiTravel.com.\n2. Filter base rate ≥ $500.\n3. Pay with the Strata Premier — $100 deducts at checkout.", "source_urls": ["https://www.citi.com/credit-cards/citi-strata-premier-credit-card"]},
  {"id": "luxury_hotels_breakfast", "group": "hotels", "headline": "Free breakfast + $100 amenity at 4,000 luxury hotels", "personalization_template": "Mastercard Luxury Hotels & Resorts portal — comp breakfast + on-property credit per stay.", "value_model": {"kind": "fixed_credit", "value_usd": 250, "period": "per_stay", "requires_signal_id": "luxury_hotel_traveler"}, "question": "claimed_this_year", "prerequisites": {"profile_signals": ["luxury_hotel_traveler"], "cards_held_any_of": [], "cards_held_all_of": []}, "action_label": "Browse properties", "mechanism_md": "Booking through mastercard.com/luxuryhotels grants complimentary breakfast for two, room upgrade subject to availability, and a $100 amenity per stay across 4,000+ properties.", "how_to_md": "1. Sign in at mastercard.com/luxuryhotels with your Strata Premier.\n2. Book a participating property.\n3. Perks honored at check-in."},

  /* AIRLINES group */
  {"id": "jal_biz_tokyo", "group": "airlines", "headline": "Fly JAL Business to Tokyo for 60k pts (saves $4-8k)", "personalization_template": "Citi → AAdvantage 1:1 unlocks JAL biz at 60k miles one-way. Cash equivalent runs $4,000–$8,000.", "value_model": {"kind": "transfer_redemption", "partner_program": "American AAdvantage", "points_one_way": 60000, "cash_equiv_usd_low": 4000, "cash_equiv_usd_high": 8000, "destination_signal": "destination_japan", "surcharges_usd": 6}, "question": "have_done_this", "prerequisites": {"profile_signals": ["destination_japan"], "cards_held_any_of": [], "cards_held_all_of": []}, "action_label": "Find a seat", "mechanism_md": "Citi is the only major transferable currency that transfers 1:1 to AAdvantage. JAL biz to Tokyo at 60k miles is one of the most accessible long-haul biz redemptions in the market.", "how_to_md": "1. Find Saver award space on AA.com.\n2. Transfer Citi → AAdvantage 1:1 (instant or near-instant).\n3. Book on AA.com or by phone.", "conditions_md": "AA charges no award change/cancel fees. Pool TY into Strata Premier for full 1:1 ratio.", "source_urls": ["https://thepointsguy.com/loyalty-programs/redeeming-citi-thankyou-points-maximum-value/"]},
  {"id": "ana_biz_virgin", "group": "airlines", "headline": "ANA Business to Tokyo, 52.5k from West Coast", "personalization_template": "Virgin Atlantic Flying Club prices ANA biz US-Tokyo at 52.5k West / 60k East one-way. Surcharges run ~$360 westbound, ~$450 eastbound.", "value_model": {"kind": "transfer_redemption", "partner_program": "Virgin Atlantic Flying Club", "points_one_way": 52500, "cash_equiv_usd_low": 3500, "cash_equiv_usd_high": 7000, "destination_signal": "destination_japan", "surcharges_usd": 360}, "question": "have_done_this", "prerequisites": {"profile_signals": ["destination_japan"], "cards_held_any_of": [], "cards_held_all_of": []}, "action_label": "Search ANA space", "mechanism_md": "Search ANA Saver space on United.com (no login). Transfer Citi → Virgin Atlantic 1:1 (instant). Must call Virgin Atlantic at 800-365-9500 to book — cannot self-serve online.", "how_to_md": "1. Find ANA Saver space on united.com.\n2. Transfer Citi → Virgin Atlantic 1:1.\n3. Call 800-365-9500.", "conditions_md": "Direct flights only — segments price separately. $100 fee to change/cancel.", "source_urls": ["https://travelfreely.com/citi-thankyou-points-sweet-spots/"]},
  {"id": "lh_first_avianca", "group": "airlines", "headline": "Lufthansa First to Europe — no fuel surcharges", "personalization_template": "Avianca LifeMiles never passes fuel surcharges through. Lufthansa First at 87k miles one-way saves ~$1,000 vs other partners.", "value_model": {"kind": "transfer_redemption", "partner_program": "Avianca LifeMiles", "points_one_way": 87000, "cash_equiv_usd_low": 5000, "cash_equiv_usd_high": 12000, "destination_signal": "destination_europe", "surcharges_usd": 0}, "question": "have_done_this", "prerequisites": {"profile_signals": ["destination_europe"], "cards_held_any_of": [], "cards_held_all_of": []}, "action_label": "Find a seat", "mechanism_md": "Lufthansa First availability typically opens 14 days out.", "how_to_md": "1. Find Lufthansa First availability close to departure.\n2. Transfer Citi → Avianca LifeMiles 1:1.\n3. Book on lifemiles.com or by phone.", "source_urls": ["https://thriftytraveler.com/citi-thankyou-points-sweet-spots/"]},
  {"id": "united_domestic_turkish", "group": "airlines", "headline": "Any United domestic flight for 7,500 miles", "personalization_template": "Turkish Miles & Smiles charges 7.5k–10k miles for any United domestic. No fuel surcharges. ~$5.60 in fees.", "value_model": {"kind": "transfer_redemption", "partner_program": "Turkish Miles & Smiles", "points_one_way": 7500, "cash_equiv_usd_low": 200, "cash_equiv_usd_high": 800, "destination_signal": "destination_us_domestic", "surcharges_usd": 6}, "question": "have_done_this", "prerequisites": {"profile_signals": [], "cards_held_any_of": [], "cards_held_all_of": []}, "action_label": "Find availability", "mechanism_md": "Turkish website is quirky; mobile app and phone are often more reliable. Verify Saver space on united.com or aircanada.com first.", "how_to_md": "1. Confirm Saver space on united.com.\n2. Transfer Citi → Turkish 1:1.\n3. Book in the Turkish app or by phone.", "source_urls": ["https://thepointsguy.com/loyalty-programs/redeeming-citi-thankyou-points-maximum-value/"]},
  {"id": "etihad_backdoor", "group": "airlines", "headline": "AA Business Europe/Asia for 50k miles (Etihad backdoor)", "personalization_template": "Etihad's chart prices AA-operated flights at 50k biz / 62.5k first to Europe or Asia 1.", "value_model": {"kind": "transfer_redemption", "partner_program": "Etihad Guest", "points_one_way": 50000, "cash_equiv_usd_low": 3500, "cash_equiv_usd_high": 7000, "destination_signal": "destination_europe", "surcharges_usd": 100}, "question": "have_done_this", "prerequisites": {"profile_signals": [], "cards_held_any_of": [], "cards_held_all_of": []}, "action_label": "Plan it", "mechanism_md": "AA Metal only — partner-operated flights excluded. Must find Saver space on AA's own site first; call Etihad to book partner award.", "how_to_md": "1. Find AA Saver space on AA.com.\n2. Transfer Citi → Etihad Guest 1:1.\n3. Call Etihad to book the partner award.", "conditions_md": "AA Metal only. No-AF Citi cards drop ratio to 1:0.7 — pool to Strata Premier first.", "source_urls": ["https://thepointsguy.com/news/etihad-guest-american-airlines-sweet-spots/"]},
  {"id": "royal_air_maroc", "group": "airlines", "headline": "Casablanca in business for 44k miles (Etihad)", "personalization_template": "Etihad's distance chart: 22k economy / 44k biz JFK/IAD/MIA → CMN nonstop on Royal Air Maroc.", "value_model": {"kind": "transfer_redemption", "partner_program": "Etihad Guest", "points_one_way": 44000, "cash_equiv_usd_low": 2500, "cash_equiv_usd_high": 4500, "destination_signal": "destination_morocco", "surcharges_usd": 150}, "question": "have_done_this", "prerequisites": {"profile_signals": ["destination_morocco"], "cards_held_any_of": [], "cards_held_all_of": []}, "action_label": "Find dates", "mechanism_md": "Confirm award space on royalairmaroc.com. Eligible from JFK, IAD, MIA.", "how_to_md": "1. Confirm space on royalairmaroc.com.\n2. Transfer Citi → Etihad 1:1.\n3. Book via Etihad website or phone.", "source_urls": ["https://thriftytraveler.com/citi-thankyou-points-sweet-spots/"]},
  {"id": "jetblue_mint_qatar", "group": "airlines", "headline": "JetBlue Mint to Europe for $10 in taxes", "personalization_template": "Citi → Qatar Avios 1:1, then book JetBlue Mint biz to Europe at 78k Avios with ~$10 in taxes/fees.", "value_model": {"kind": "transfer_redemption", "partner_program": "Qatar Privilege Club", "points_one_way": 78000, "cash_equiv_usd_low": 2500, "cash_equiv_usd_high": 5000, "destination_signal": "destination_europe", "surcharges_usd": 10}, "question": "have_done_this", "prerequisites": {"profile_signals": ["destination_europe"], "cards_held_any_of": [], "cards_held_all_of": []}, "action_label": "Plan it", "mechanism_md": "Find JetBlue Mint Europe availability on jetblue.com. Transfer Citi → Qatar Avios. Book through Qatar.", "how_to_md": "1. Find JetBlue Mint Europe availability.\n2. Transfer Citi → Qatar 1:1.\n3. Book on qatarairways.com.", "source_urls": ["https://thepointsguy.com/loyalty-programs/redeeming-citi-thankyou-points-maximum-value/"]},

  /* TRAVEL_SERVICES group — protections + FX + lounge access (none here) */
  {"id": "trip_delay", "group": "travel_services", "headline": "Get $500 back when your flight delays 6+ hours", "personalization_template": "Up to $500 per covered trip on Strata Premier when you're stuck 6+ hours. Two claims a year max.", "value_model": {"kind": "protection_coverage", "max_value_usd": 500, "period": "per_trip", "trigger_question": "Had a flight delayed 6+ hours this year?"}, "question": "have_filed_claim", "prerequisites": {"profile_signals": [], "cards_held_any_of": [], "cards_held_all_of": []}, "action_label": "File a claim", "mechanism_md": "Coverage applies when a covered trip (paid in part with the Strata Premier) is delayed 6+ hours. Up to $500 for meals, lodging, and incidentals. Max 2 claims per 12-month period. Underwritten by Mastercard.", "how_to_md": "1. Save receipts during the delay.\n2. File at cardbenefitservices.com within 60 days.", "source_urls": ["https://www.citi.com/credit-cards/citi-strata-premier-credit-card"]},
  {"id": "trip_cancel", "group": "travel_services", "headline": "Reimburse a canceled trip up to $5,000", "personalization_template": "Up to $5k per trip / $10k per cardholder per year for nonrefundable trip costs lost to a covered cancellation.", "value_model": {"kind": "protection_coverage", "max_value_usd": 5000, "period": "per_trip", "trigger_question": "Had a trip canceled or cut short this year?"}, "question": "have_filed_claim", "prerequisites": {"profile_signals": [], "cards_held_any_of": [], "cards_held_all_of": []}, "action_label": "File a claim", "mechanism_md": "Reimburses prepaid, nonrefundable trip costs if a covered trip is cut short or canceled for a covered reason (illness, severe weather, jury duty, etc.).", "how_to_md": "1. Document the cancellation reason.\n2. Submit claim via Mastercard within 20 days of the event."},
  {"id": "rental_cdw", "group": "travel_services", "headline": "Free rental car CDW abroad — primary coverage", "personalization_template": "Decline the rental company's CDW. Charge the rental to your Strata Premier. You're covered as primary outside the US, secondary inside.", "value_model": {"kind": "protection_coverage", "max_value_usd": 50000, "period": "per_claim", "trigger_question": "Renting a car?"}, "question": "set_up", "prerequisites": {"profile_signals": [], "cards_held_any_of": [], "cards_held_all_of": []}, "action_label": "Save the steps", "mechanism_md": "MasterRental coverage. Decline the rental company's CDW/LDW; charge the rental to your Strata Premier; covered for theft and collision damage.", "how_to_md": "1. Reserve and pay with the Strata Premier in the renter's name.\n2. Decline the rental company's CDW/LDW.\n3. File any claim within 45 days."},
  {"id": "fx_zero", "group": "travel_services", "headline": "Spend abroad fee-free", "personalization_template": "No foreign transaction fees on the Strata Premier — saves ~3% vs cards that charge them.", "value_model": {"kind": "system_mechanic", "note": "0% FX fee — passive."}, "question": "set_up", "prerequisites": {"profile_signals": [], "cards_held_any_of": [], "cards_held_all_of": []}, "mechanism_md": "Strata Premier charges no FX fees. Other Citi no-AF cards (Double Cash, Custom Cash) charge 3% — use Strata Premier abroad to avoid the fee.", "how_to_md": "Use the Strata Premier for any foreign-merchant purchase."},

  /* SHOPPING group */
  {"id": "ext_warranty", "group": "shopping", "headline": "Add 24 months to any warranty under 5 years", "personalization_template": "Industry-leading: doubles manufacturer warranties of 5 years or less, up to $10k per item.", "value_model": {"kind": "protection_coverage", "max_value_usd": 10000, "period": "per_claim", "trigger_question": "Buying electronics or appliances?"}, "question": "set_up", "prerequisites": {"profile_signals": [], "cards_held_any_of": [], "cards_held_all_of": []}, "action_label": "How to claim", "mechanism_md": "Adds 24 months to manufacturer warranties of 5 years or less, up to $10k per item.", "how_to_md": "1. Save the receipt + warranty terms.\n2. File via Mastercard once the original warranty ends and an issue arises."},
  {"id": "purchase_protection", "group": "shopping", "headline": "$10,000 stolen-item coverage on every purchase", "personalization_template": "Up to $10k per claim, $50k per cardholder per year. Covers damage or theft within 90 days.", "value_model": {"kind": "protection_coverage", "max_value_usd": 10000, "period": "per_claim", "trigger_question": "Had something break or get stolen recently?"}, "question": "have_filed_claim", "prerequisites": {"profile_signals": [], "cards_held_any_of": [], "cards_held_all_of": []}, "action_label": "File a claim", "mechanism_md": "Covers damage or theft of items charged to the Strata Premier within 90 days of purchase.", "how_to_md": "1. Keep your receipt + original packaging if possible.\n2. File via Mastercard within the 90-day window."},
  {"id": "instacart_plus", "group": "shopping", "headline": "Instacart+ free for 2 months + $10/mo off", "personalization_template": "2 months free Instacart+ plus $10 off your second order each month (~$30 value).", "value_model": {"kind": "fixed_credit", "value_usd": 30, "period": "calendar_year", "requires_signal_id": "instacart_user"}, "question": "set_up", "prerequisites": {"profile_signals": [], "cards_held_any_of": [], "cards_held_all_of": []}, "action_label": "Activate", "mechanism_md": "Enroll your Strata Premier at instacart.com/citi.", "how_to_md": "1. Sign in at instacart.com/citi.\n2. Activate the offer with your Strata Premier."},
  {"id": "dashpass_trial", "group": "shopping", "headline": "DashPass free for 3 months", "personalization_template": "Complimentary 3-month DoorDash DashPass membership.", "value_model": {"kind": "fixed_credit", "value_usd": 30, "period": "calendar_year", "requires_signal_id": "doordash_user"}, "question": "set_up", "prerequisites": {"profile_signals": [], "cards_held_any_of": [], "cards_held_all_of": []}, "action_label": "Activate", "mechanism_md": "Enroll your Strata Premier on DoorDash for the trial.", "how_to_md": "Activate via the DoorDash app's payment settings."},

  /* CASH group — earning multipliers */
  {"id": "earn_dining_3x", "group": "cash", "headline": "Stack 3x on every restaurant bill", "personalization_template": "You spend ~{spend.dining}/yr on dining → about {value.dining_3x} in TY value.", "value_model": {"kind": "multiplier_on_category", "spend_category": "dining", "pts_per_dollar": 3}, "question": "spending_here", "prerequisites": {"profile_signals": [], "cards_held_any_of": [], "cards_held_all_of": []}, "action_label": "Set as default", "mechanism_md": "Restaurants — dine-in, takeout, delivery — all earn 3x TY pts. Uncapped.", "how_to_md": "Pay every meal with the Strata Premier."},
  {"id": "earn_supermarkets_3x", "group": "cash", "headline": "3x on groceries — uncapped, no other major card matches", "personalization_template": "You spend ~{spend.groceries}/yr at supermarkets → ~{value.groceries_3x} in TY value.", "value_model": {"kind": "multiplier_on_category", "spend_category": "groceries", "pts_per_dollar": 3}, "question": "spending_here", "prerequisites": {"profile_signals": [], "cards_held_any_of": [], "cards_held_all_of": []}, "action_label": "Set as default", "mechanism_md": "Most competitors cap grocery bonus spend at $6,000/yr. Strata Premier doesn't. Costco doesn't code as supermarket.", "how_to_md": "Use the Strata Premier at any supermarket. Use a different card at Costco."},
  {"id": "earn_gas_ev_3x", "group": "cash", "headline": "3x at the pump (and the EV charger)", "personalization_template": "Both traditional fuel and EV charging stations earn 3x TY pts.", "value_model": {"kind": "multiplier_on_category", "spend_category": "gas", "pts_per_dollar": 3}, "question": "spending_here", "prerequisites": {"profile_signals": [], "cards_held_any_of": [], "cards_held_all_of": []}, "action_label": "Set as default", "mechanism_md": "Gas + EV charging both at 3x. Uncapped.", "how_to_md": "Pay at the pump or charger with the Strata Premier."},
  {"id": "earn_air_hotels_3x", "group": "cash", "headline": "3x on flights and hotels booked direct", "personalization_template": "Air travel + hotels booked direct or through any travel agency earn 3x.", "value_model": {"kind": "multiplier_on_category", "spend_category": "airfare", "pts_per_dollar": 3}, "question": "spending_here", "prerequisites": {"profile_signals": [], "cards_held_any_of": [], "cards_held_all_of": []}, "mechanism_md": "Includes booking through any travel agency. CitiTravel.com bookings earn 10x (separate row).", "how_to_md": "Book direct or through a travel agency with the Strata Premier."},
  {"id": "earn_citi_travel_10x", "group": "cash", "headline": "10x on hotels via CitiTravel.com — top rate on the card", "personalization_template": "Hotels, cars, and attractions through CitiTravel.com earn 10x. Stack with the $100 hotel credit on $500+ stays.", "value_model": {"kind": "multiplier_on_category", "spend_category": "hotels", "pts_per_dollar": 10}, "question": "spending_here", "prerequisites": {"profile_signals": [], "cards_held_any_of": [], "cards_held_all_of": []}, "action_label": "Set as default", "mechanism_md": "10x on hotels, rental cars, and attractions through CitiTravel.com. Stack with the $100 hotel credit when stay is $500+.", "how_to_md": "Search at CitiTravel.com. Compare to direct rates first — Citi prices can occasionally be higher."},
  {"id": "trifecta_pool", "group": "cash", "headline": "Pool no-AF Citi points to your Premier — 30%+ value boost", "personalization_template": "Pooling Double Cash and Custom Cash points into your Strata Premier converts cash points into 1:1 transferable points (vs 1:0.7 unpooled).", "value_model": {"kind": "system_mechanic", "note": "Pooling is a one-time setup at thankyou.com."}, "question": "set_up", "prerequisites": {"profile_signals": [], "cards_held_any_of": ["citi_double_cash", "citi_custom_cash"], "cards_held_all_of": []}, "action_label": "Set up pooling", "mechanism_md": "Sign in at thankyou.com → Account Management → Combine Points. Move points from Double Cash / Custom Cash into the Strata Premier account. One-time setup. Note: closing a Citi card erases its earned points 60 days later, even if pooled — combine before any close.", "how_to_md": "1. Sign in at thankyou.com.\n2. Go to Account Management → Combine Points.\n3. Move points from no-AF cards into Strata Premier."},

  /* NICHE group */
  {"id": "ty_sharing_window", "group": "niche", "headline": "Share 100k pts to family — gone forever May 17, 2026", "personalization_template": "Until May 16, 2026, you can move 100,000 TY points/year to another Citi member free. After May 17 it's gone permanently.", "value_model": {"kind": "niche_play", "estimated_annual_value_usd": 1000, "risk_tier": "green"}, "question": "have_done_this", "prerequisites": {"profile_signals": [], "cards_held_any_of": [], "cards_held_all_of": []}, "action_label": "Plan a transfer", "mechanism_md": "Citi is ending the points-sharing feature on May 17, 2026. Until then you can share up to 100k pts/year to any other ThankYou member. Shared points expire 90 days after transfer — only share if recipient has an immediate booking.", "how_to_md": "1. Sign in at thankyou.com → Manage → Share Points.\n2. Enter the recipient's TY account number and the amount.\n3. Recipient must redeem within 90 days.", "expires_at": "2026-05-17", "source_urls": ["https://frequentmiler.com/citi-thankyou-points-about-to-end-points-sharing-between-cardholders/"]},
  {"id": "retention_call", "group": "niche", "headline": "Call retention 30 days before fee — typical $50–100 offer", "personalization_template": "Cardholders frequently report success calling Citi near anniversary asking for a fee waiver or spend-based bonus.", "value_model": {"kind": "niche_play", "estimated_annual_value_usd": 75, "risk_tier": "green"}, "question": "set_up", "prerequisites": {"profile_signals": [], "cards_held_any_of": [], "cards_held_all_of": []}, "action_label": "Save reminder", "mechanism_md": "Best calling window is 30–60 days before the AF posts. Mention you're considering closing.", "how_to_md": "1. Call the number on the back of the card.\n2. Ask to be transferred to retention or customer loyalty.\n3. Mention you're considering closing the card and ask what they can do."},
  {"id": "fed_tax_payment", "group": "niche", "headline": "Pay federal taxes to buy TY at 0.875¢ — only if you transfer", "personalization_template": "Federal tax payment processors charge ~1.75%. Putting taxes on a 2x-card-pooled-to-Premier effectively buys TY pts at 0.875¢ each. Only profitable if you transfer at sweet-spot rates.", "value_model": {"kind": "niche_play", "estimated_annual_value_usd": 0, "risk_tier": "yellow"}, "question": "have_done_this", "prerequisites": {"profile_signals": ["does_estimated_taxes"], "cards_held_any_of": [], "cards_held_all_of": []}, "action_label": "Calculate ROI", "mechanism_md": "Pay federal taxes via pay1040.com or similar (~1.75% fee). Bad math if you'd cash out at 1¢. Profitable only if you redeem at >1¢/pt via transfer partners.", "how_to_md": "1. Confirm your sweet-spot redemption first.\n2. Pay via pay1040.com.\n3. Pool earned points to Strata Premier and transfer.", "conditions_md": "Don't speculate. Only do this if you have a confirmed booking that beats 0.875¢/pt."},
  {"id": "curve_fx_hack", "group": "niche", "headline": "Curve card hack to dodge FX fees on no-AF Citi", "personalization_template": "Curve fronts your Double Cash / Custom Cash so you keep 2x/5x earnings without the 3% FX fee. Strata Premier has no FX fee on its own — only useful if you specifically want a 5x category abroad.", "value_model": {"kind": "niche_play", "estimated_annual_value_usd": 50, "risk_tier": "yellow"}, "question": "set_up", "prerequisites": {"profile_signals": [], "cards_held_any_of": ["citi_double_cash", "citi_custom_cash"], "cards_held_all_of": []}, "mechanism_md": "Curve doesn't pass FX fees through. Loading the no-AF Citi cards into Curve means you earn 2x/5x abroad without the FX surcharge.", "how_to_md": "1. Sign up for Curve.\n2. Add the Citi card as a funding card.\n3. Use Curve abroad.", "conditions_md": "Curve's terms periodically change. Large FX volume can trigger account review."}
]
\`\`\`

## cold_prompts

\`\`\`json
[
  {"id": "going_to_japan", "question": "Going to Japan in the next 12 months?", "answer_chips": [{"value": "yes_dates_set", "label": "Yes, dates set"}, {"value": "yes_someday", "label": "Yes, someday"}, {"value": "no", "label": "Not in 12 months"}], "unlocks_value_estimate_usd": 4500, "unlocks_groups": ["airlines", "hotels"]},
  {"id": "uses_lyft", "question": "Use Lyft regularly?", "answer_chips": [{"value": "weekly", "label": "Weekly"}, {"value": "occasionally", "label": "Occasionally"}, {"value": "no", "label": "Never"}], "unlocks_value_estimate_usd": 60, "unlocks_groups": ["travel_services", "shopping"]},
  {"id": "transferred_points_last_year", "question": "Did you transfer Citi points to an airline or hotel last year?", "answer_chips": [{"value": "yes_aa", "label": "Yes, to AA"}, {"value": "yes_other", "label": "Yes, other"}, {"value": "no", "label": "No, never"}], "unlocks_value_estimate_usd": 800, "unlocks_groups": ["airlines", "hotels", "niche"]}
]
\`\`\`
```

(For Code: keep all play JSON entries on single lines — the parser doesn't tolerate trailing commas; standard JSON. Comments in the markdown above (`/* GROUP */`) are decorative and OUTSIDE the json block — they belong as actual JSON comments? No — strip them. Use the section ordering instead. Code should drop the `/* */` comments when authoring the actual file.)

### CSS additions to `app/wallet-edit-v2.css`

Append styles for:
- `.hero-adaptive` (and `.hero-adaptive[data-state="cold"]`, `.hero-adaptive[data-state="warm"]`, `.hero-adaptive[data-state="hot"]`)
- `.cold-prompt`, `.cold-prompt-question`, `.cold-prompt-chips`
- `.catalog-group`, `.catalog-group-head`, `.catalog-group-body`, `.catalog-group[data-skipped="true"]`
- `.money-find-row`, `.money-find-headline`, `.money-find-personal`, `.money-find-value`, `.money-find-probe`, `.money-find-question`, `.money-find-tristate`
- `.mechanics-zone`, `.mechanic-row`
- `.cross-card-tile`, `.cross-card-empty`
- `.manage-card-disclosure`

Drop styles only used by the deleted `HeroSections.tsx` (verify with `grep -r "earning-grid\|credits-grid\|partner-grid\|sweet-spot.rich\|rule-list" app components` — keep styles still referenced elsewhere). Run `npm run build` after deleting and confirm no class-name regressions.

### LightRAG note

LightRAG was not queried during spec authoring. The existing engine pattern in `lib/engine/scoring.ts` is the authoritative reference for pure-function structure, redemption-style cpp resolution, and per-process memoization — follow it.

## Do Not Change

- `lib/engine/scoring.ts`, `eligibility.ts`, `ranking.ts` — power the live `/recommendations` page and integration tests; the new money-find engine is independent.
- `lib/engine/foundMoney.ts` — used by `EditWalletClient` for the wallet-list found-money chips. Keep as-is until the audit engine replaces it in a follow-up TASK.
- `db/migrations/0001-0005` — no migration in this TASK; reuse `user_card_play_state` via synthetic `play_id` namespaces.
- `lib/profile/server.ts` `getCurrentCardPlayState` — already returns all rows for a card; engines decode synthetic ids client-side. No changes needed.
- `lib/profile/actions.ts` `updateCardPlayState` — already supports any `play_id`. Reuse unchanged.
- `app/(app)/onboarding/cards/page.tsx`, `components/onboarding/CardsForm.tsx` — onboarding flow, untouched.
- `app/(app)/wallet/edit/page.tsx`, `components/wallet-v2/EditWalletClient.tsx`, `components/wallet-v2/WalletListRow.tsx`, `components/wallet-v2/SearchBar.tsx`, `components/wallet-v2/EmptyState.tsx` — wallet-list page stays.
- `components/wallet-v2/SignalsEditor.tsx` — preserved verbatim; new `<ManageCardDisclosure>` wraps it.
- `components/wallet-v2/FoundMoneyTile.tsx`, `DeadlinesStrip.tsx`, `primitives.tsx`, `CategoryPicker.tsx` — used by SignalsEditor and the new HeroAdaptive's "warm/hot" states. No changes.
- `app/(app)/recommendations/page.tsx`, `lib/auth/actions.ts` — typedRoutes casts shipped in v1; don't touch.
- `cards/citi_double_cash.md`, `citi_custom_cash.md`, `costco_anywhere_visa.md`, all other card markdown — only Strata Premier gets `card_plays` + `cold_prompts` in this TASK.
- `data/*.json` — derived; don't edit directly.

## Acceptance Criteria

- [ ] `npm run cards:build` passes; the compiled `data/cards.json` for `citi_strata_premier` includes a `card_plays` array of length ≥28 and a `cold_prompts` array of length 3.
- [ ] `npm run typecheck` passes with zero errors.
- [ ] `npm run lint` passes with zero new errors (the pre-existing CardImage warning is acceptable).
- [ ] `npm test` passes (95+ tests).
- [ ] `npm run build` (with `NEXT_PUBLIC_WALLET_EDIT_V2=1`) ships clean. The `/wallet/cards/[id]` route compiles.
- [ ] With the flag on, navigating to `/wallet/cards/citi_strata_premier` renders: identity strip with card art + name + AF + currency, an adaptive Hero in cold state (3 cold-prompt question chips), 6 catalog groups (Hotels, Airlines, Travel-services, Shopping, Cash, Niche) with the Strata Premier money-find rows beneath, a Mechanics zone with the AF clock + SUB eligibility, an empty-state Cross-card tile, and a collapsed "Manage card" disclosure at the bottom.
- [ ] Clicking a cold-prompt chip persists via `updateCardPlayState` (synthetic `cold:going_to_japan` row), the Hero advances to "warm" state on the next render, and any unlocked group's matching rows update their personal sentence + value.
- [ ] Marking a money-find row's tristate (using / going_to / skip) persists via `updateCardPlayState`, updates the running data-depth ratio, and reflects in the row's pill on hard refresh.
- [ ] Group-level skip toggle writes `group:<group>` synthetic row, collapses the group's body to a "show hidden" toggle, and subtracts the group's $value from any aggregate display.
- [ ] `git diff --stat` shows changes ONLY in: `scripts/lib/schemas.ts`, `scripts/lib/parse.ts`, `scripts/build-card-db.ts`, `lib/engine/moneyFind.ts` (new), `lib/engine/heroState.ts` (new), `components/wallet-v2/CardHero.tsx` (rewrite), `components/wallet-v2/MoneyFindRow.tsx` (new), `components/wallet-v2/CatalogGroup.tsx` (new), `components/wallet-v2/HeroAdaptive.tsx` (new), `components/wallet-v2/MechanicsZone.tsx` (new), `components/wallet-v2/CrossCardTile.tsx` (new), `components/wallet-v2/ManageCardDisclosure.tsx` (new), `components/wallet-v2/HeroSections.tsx` (deleted), `cards/citi_strata_premier.md` (new sections appended), `app/wallet-edit-v2.css` (additions + select deletions).

## Verification

1. Run `npm run cards:build` and confirm the build succeeds; spot-check `data/cards.json` for `card_plays` and `cold_prompts` on `citi_strata_premier`.
2. Run `npm run typecheck`, `npm run lint`, `npm test`. All green.
3. Apply migration 0005 if not already applied: `psql $DATABASE_URL -f db/migrations/0005_wallet_v2.sql`.
4. Set `NEXT_PUBLIC_WALLET_EDIT_V2=1` in `.env.local`. Run `npm run dev`. Sign in as a user with the Strata Premier in their wallet.
5. Navigate to `/wallet/cards/citi_strata_premier`. Confirm:
   - Cold-state Hero shows three question chips.
   - Six catalog group headers visible. Beneath each, money-find rows render with headline, personalization sentence, $value-or-probe chip, and tristate.
   - Mechanics zone shows AF countdown.
   - Cross-card tile shows the "tell us more" empty state.
   - Manage card disclosure is closed by default; opens to reveal the existing SignalsEditor clusters.
6. Click "Yes, dates set" on the Going-to-Japan cold prompt. Confirm: Hero advances to warm, Japan-related airline + hotel rows bubble to top of their groups with refreshed personal sentences and $values.
7. Click the tristate on three money-find rows in different groups. Hard refresh. Confirm states persist.
8. Toggle "skip" on the Airlines group. Confirm: rows collapse, "show hidden" appears, group $value is removed from any aggregate.
9. `git diff --stat` and confirm no files outside the listed scope were modified.
