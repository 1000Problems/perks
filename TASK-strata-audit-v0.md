# TASK: Strata Premier Audit Page (v0)

> Ship the first card-audit page for the Citi Strata Premier — a read-only, feature-flagged surface that demonstrates the new "found money" framing end-to-end on one card.

## Context

We are reframing the recommender from "+$X/yr next card" to a card-by-card audit experience: the user adds a card to their wallet, we surface every value-extraction surface that card supports (multipliers, credits, transfer sweet spots, protections, mechanics, advanced plays), and we let the user check off what they already do, what they want to do, and what's not for them. The page math is personalized off their existing spend profile, destinations, and merchant loyalty signals.

This TASK ships the **read-only** v0: schema + content + engine + page render. Interactivity (tristate checkboxes, persistence) and the clickable trifecta recommender follow in TASK-002 and TASK-003. The artifact ships behind a feature flag so it can be merged without affecting the live recommender.

## Requirements

1. **Plays schema and parser.** Extend `scripts/lib/schemas.ts` with a `PlaySchema` and add a `## card_plays` section to the markdown parser at `scripts/lib/parse.ts`. The build script must validate every card's plays block and emit a compiled list as part of the existing card object (added to `Card` type).

2. **Strata Premier plays content.** Add a `## card_plays` section to `cards/citi_strata_premier.md` containing the structured plays JSON specified verbatim under *Implementation Notes → Plays content*. Twenty-eight plays across six sections.

3. **Audit engine function.** Add a new pure function `computeAudit(card, profile, wallet, db)` in `lib/engine/audit.ts` (new file). Returns the three-pillar gauge totals (`guaranteed`, `claimItValue`, `unlockItRange`) and a per-row evaluation (`rows[]`) with personalized dollar value, prerequisites-met flag, and visibility flag.

4. **Audit page route.** Create `app/(app)/wallet/cards/[id]/audit/page.tsx` plus the components it needs under `app/(app)/wallet/cards/[id]/audit/_components/`. Server-rendered, read-only. Renders the three-pillar gauge, the deadlines strip, the audit feed grouped by section with collapsed expansion panels, and a ghost-state Citi trifecta visualizer at the bottom. No mutations, no checkboxes yet (placeholder UI for the tristate is acceptable but must be non-interactive).

5. **Feature flag.** Gate access to the new route behind an environment variable `NEXT_PUBLIC_AUDIT_V0=1`. When the flag is off, hitting the route returns a 404 via `notFound()`. Add a small "Audit (preview)" link on the existing card-detail page that only renders when the flag is on, pointing to `/wallet/cards/citi_strata_premier/audit` for now.

## Implementation Notes

### Files to create

- `lib/engine/audit.ts` — new audit engine. Pure function. No I/O. No `Date.now()`.
- `app/(app)/wallet/cards/[id]/audit/page.tsx` — server component, the route.
- `app/(app)/wallet/cards/[id]/audit/_components/AuditGauge.tsx` — three-pillar header.
- `app/(app)/wallet/cards/[id]/audit/_components/DeadlineStrip.tsx` — banners for any plays whose `expires_at` is within 90 days, sorted ascending.
- `app/(app)/wallet/cards/[id]/audit/_components/AuditRow.tsx` — single value-row card with collapsible expansion.
- `app/(app)/wallet/cards/[id]/audit/_components/CitiTrifecta.tsx` — ghost-state SVG/HTML triangle. Hard-coded for the Citi ecosystem in v0.

### Files to modify

- `scripts/lib/schemas.ts` — add `PlaySchema`, attach to `CardSchema` as `card_plays: z.array(PlaySchema).default([])`.
- `scripts/lib/parse.ts` — add `## card_plays` to `SECTION_KEYS`, parse its `\`\`\`json` block as the plays array, attach to the parsed card. Soul-section pattern is the right precedent.
- `scripts/build-card-db.ts` — pass parsed `plays` into the validated `Card`. Plays travel with the card, not as a separate JSON file.
- `lib/data/loader.ts` — no changes needed if plays travel on the card. If a separate Map is preferred, mirror the pattern of `cardById`.
- `cards/citi_strata_premier.md` — append the plays section.
- `app/(app)/wallet/cards/[id]/page.tsx` (if it exists) — add the preview link when flag is on. If it does not exist, skip this requirement and document in the PR description.

### Schema (paste into `scripts/lib/schemas.ts`)

```ts
const PlaySection = z.enum([
  "earning",
  "credit",
  "sweet_spot",
  "protection",
  "mechanic",
  "advanced",
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
    period: z.enum(["calendar_year", "anniversary_year", "monthly", "quarterly"]),
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
    requires_premium_card: z.boolean().default(true),
  }),
  z.object({
    kind: z.literal("protection_coverage"),
    max_value_usd: z.number(),
    period: z.enum(["per_trip", "per_claim", "annual"]),
    claim_cap_per_year: z.number().nullable().optional(),
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

export const PlaySchema = z.object({
  id: z.string(),
  section: PlaySection,
  headline: z.string(),
  value_model: PlayValueModel,
  prerequisites: z.object({
    cards_held_any_of: z.array(z.string()).default([]),
    cards_held_all_of: z.array(z.string()).default([]),
    profile_signals: z.array(z.string()).default([]),
  }).default({ cards_held_any_of: [], cards_held_all_of: [], profile_signals: [] }),
  mechanism_md: z.string(),
  how_to_md: z.string(),
  conditions_md: z.string().optional(),
  expires_at: IsoDate.optional(),
  source_urls: z.array(Url).default([]),
});

export type Play = z.infer<typeof PlaySchema>;
```

Then attach to `CardSchema` as `card_plays: z.array(PlaySchema).default([])`.

### Audit engine signature (paste skeleton into `lib/engine/audit.ts`)

```ts
import type { Card, CardDatabase } from "@/lib/data/loader";
import type { UserProfile, WalletCardHeld } from "./types";
import type { Play } from "@/lib/data/types"; // re-export from loader if needed

export interface AuditRow {
  play: Play;
  prerequisitesMet: boolean;
  visible: boolean;        // false hides the row entirely; true even when value is 0
  personalValueUsd: number; // 0 if hidden or prereq missing
  pillar: "guaranteed" | "claim_it" | "unlock_it" | "informational";
  reasonText: string;       // short audit trace, e.g. "$4,200 grocery × 3¢ × 1.9¢/pt cpp"
}

export interface AuditResult {
  rows: AuditRow[];
  guaranteed: number;       // sum of pillar="guaranteed"
  claimItValue: number;     // sum of pillar="claim_it"
  unlockItLow: number;      // sum of pillar="unlock_it" lower bound
  unlockItHigh: number;     // sum of pillar="unlock_it" upper bound
  upcomingDeadlines: Play[]; // plays with expires_at within 90 days, sorted asc
}

export function computeAudit(
  card: Card,
  profile: UserProfile,
  wallet: WalletCardHeld[],
  db: CardDatabase,
  today: string, // YYYY-MM-DD, injected
): AuditResult { ... }
```

Pillar mapping: `multiplier_on_category` → guaranteed; `fixed_credit` → claim_it; `transfer_redemption` → unlock_it; `protection_coverage` → informational (rows visible, $0 personalValueUsd in v0); `system_mechanic` → informational; `niche_play` → claim_it (default) or unlock_it depending on the row's content (use `risk_tier === "yellow"` → claim_it).

Personal value rules:
- `multiplier_on_category`: `(spend_in_category × (pts_per_dollar × program_cpp / 100))` capped at `cap_usd_per_year`. Use the program's median cpp via the existing `resolveLoyaltyCpp` pattern (see `lib/engine/scoring.ts`); reuse rather than reimplement.
- `fixed_credit`: full `value_usd` if `requires_signal_id` is null OR it's in `profile.perk_opt_ins`; otherwise 0 with `prerequisitesMet=false`.
- `transfer_redemption`: visibility gated on `destination_signal` matching `profile.destinations` (new field — see below). If matched, contributes `[cash_equiv_usd_low − surcharges, cash_equiv_usd_high − surcharges]` to the unlock-it range. If not matched, `visible=false` in v0.
- `protection_coverage` and `system_mechanic`: `personalValueUsd=0`, `visible=true`. Row body explains coverage / mechanic.

Profile additions: add `destinations: string[]` to `UserProfile` in `lib/engine/types.ts`. Default empty array. Used only by audit.ts for now. Do not change scoring.ts behavior.

### Plays content (paste into `cards/citi_strata_premier.md`)

Append a new section after the existing sections:

```markdown
## card_plays

\`\`\`json
[
  {"id": "earn_dining_3x", "section": "earning", "headline": "3x ThankYou points on restaurants (dine-in and takeout)", "value_model": {"kind": "multiplier_on_category", "spend_category": "dining", "pts_per_dollar": 3, "cap_usd_per_year": null}, "mechanism_md": "Every dollar spent at restaurants — including delivery and takeout — earns 3 ThankYou points. Uncapped. Pools with your other Citi cards into your Strata Premier account.", "how_to_md": "1. Pay at any restaurant with your Strata Premier.\\n2. 3x posts automatically.\\n3. Pool to Premier if earned on a non-Premier Citi card."},
  {"id": "earn_supermarkets_3x", "section": "earning", "headline": "3x on supermarkets (uncapped — major hidden value)", "value_model": {"kind": "multiplier_on_category", "spend_category": "groceries", "pts_per_dollar": 3, "cap_usd_per_year": null}, "mechanism_md": "Citi pays 3x on US supermarket purchases with no annual cap. Most competitors limit grocery bonus spend to $6,000/yr; Strata Premier does not.", "how_to_md": "1. Use the Strata Premier at any supermarket.\\n2. Note: Costco does not code as supermarket. Use the Custom Cash 5x or Double Cash 2x there instead."},
  {"id": "earn_gas_ev_3x", "section": "earning", "headline": "3x on gas stations and EV charging stations", "value_model": {"kind": "multiplier_on_category", "spend_category": "gas", "pts_per_dollar": 3, "cap_usd_per_year": null}, "mechanism_md": "Both traditional fuel and EV charging stations earn 3x. Top choice for commuters.", "how_to_md": "1. Pay at the pump or at the EV charging terminal with the Strata Premier.\\n2. 3x posts automatically."},
  {"id": "earn_air_hotels_3x", "section": "earning", "headline": "3x on air travel and hotels (direct or via travel agencies)", "value_model": {"kind": "multiplier_on_category", "spend_category": "airfare", "pts_per_dollar": 3, "cap_usd_per_year": null}, "mechanism_md": "Flights and hotel stays booked directly with the provider, OR through a travel agency, earn 3x. CitiTravel.com bookings earn 10x (see separate row).", "how_to_md": "1. Book direct (airline/hotel website) or through any travel agency.\\n2. 3x posts automatically."},
  {"id": "earn_citi_travel_10x", "section": "earning", "headline": "10x on hotels, cars, and attractions via CitiTravel.com", "value_model": {"kind": "multiplier_on_category", "spend_category": "hotels", "pts_per_dollar": 10, "cap_usd_per_year": null}, "mechanism_md": "Booking hotels, rental cars, or attractions through CitiTravel.com earns 10x ThankYou points — the highest rate on the card. Stack with the $100 hotel credit when stay is $500+.", "how_to_md": "1. Search at CitiTravel.com.\\n2. Compare to direct rates — Citi prices can occasionally be higher.\\n3. Book a $500+ stay to also trigger the $100 credit."},

  {"id": "credit_hotel_100", "section": "credit", "headline": "$100 hotel credit on any $500+ stay via CitiTravel.com", "value_model": {"kind": "fixed_credit", "value_usd": 100, "period": "calendar_year", "requires_signal_id": "hotel_credit"}, "mechanism_md": "Once per calendar year, get $100 off a single hotel stay totaling $500+ (excluding taxes and fees) booked through CitiTravel.com. Applied instantly at booking — not a statement credit.", "how_to_md": "1. Search hotels on CitiTravel.com (or call 1-833-737-1288).\\n2. Filter for stays with base rate ≥ $500.\\n3. The $100 deducts at checkout. Available once per primary cardholder per calendar year."},
  {"id": "credit_mc_luxury_hotels", "section": "credit", "headline": "Mastercard Luxury Hotels & Resorts: free breakfast + $100 amenity per stay", "value_model": {"kind": "fixed_credit", "value_usd": 250, "period": "calendar_year", "requires_signal_id": "luxury_hotel_traveler"}, "mechanism_md": "Booking through the Mastercard Luxury Hotels & Resorts portal at any of 4,000+ properties grants complimentary breakfast for two, room upgrade subject to availability, and a $100 on-property amenity credit per stay. Estimate two-stays/yr capture for travelers, $0 otherwise.", "how_to_md": "1. Sign in at mastercard.com/luxuryhotels with your Strata Premier.\\n2. Book a participating property.\\n3. Perks honored at check-in."},
  {"id": "credit_merchant_offers", "section": "credit", "headline": "Citi Merchant Offers (Shell, Sam's Club, CVS, others)", "value_model": {"kind": "fixed_credit", "value_usd": 50, "period": "calendar_year", "requires_signal_id": "active_offers_user"}, "mechanism_md": "Targeted cashback or extra-points offers from retailers, accessed inside the Citi online account. Conservative $50/yr estimate when actively used.", "how_to_md": "1. Log in to citi.com.\\n2. Click 'Merchant Offers'.\\n3. Activate offers before purchase."},

  {"id": "sweet_jal_biz_tokyo", "section": "sweet_spot", "headline": "JAL Business to Tokyo for 60k miles via AAdvantage", "value_model": {"kind": "transfer_redemption", "partner_program": "aa_aadvantage", "points_one_way": 60000, "cash_equiv_usd_low": 3000, "cash_equiv_usd_high": 8000, "destination_signal": "destination_japan", "surcharges_usd": 50, "requires_premium_card": true}, "mechanism_md": "Citi is the only major transferable currency that transfers 1:1 to American AAdvantage. JAL biz to Tokyo on 60k miles one-way is one of the most accessible long-haul biz redemptions in the market.", "how_to_md": "1. Find JAL Saver award space on AA.com.\\n2. Transfer Citi → AAdvantage 1:1 (instant or near-instant).\\n3. Book on AA.com or by phone. Low taxes; AA charges no award change/cancel fees.", "conditions_md": "AA Metal-equivalent rules don't apply — JAL operates these flights. Premium Strata Premier or Strata Elite required for 1:1 ratio."},
  {"id": "sweet_ana_biz_virgin", "section": "sweet_spot", "headline": "ANA Business to Tokyo for 52.5–60k via Virgin Atlantic", "value_model": {"kind": "transfer_redemption", "partner_program": "virgin_atlantic", "points_one_way": 52500, "cash_equiv_usd_low": 3500, "cash_equiv_usd_high": 7000, "destination_signal": "destination_japan", "surcharges_usd": 360, "requires_premium_card": true}, "mechanism_md": "Virgin Atlantic Flying Club prices ANA biz at 52.5k miles from US West Coast / 60k from East Coast one-way. Surcharges run ~$360 westbound, ~$450 eastbound.", "how_to_md": "1. Search ANA Saver space on United.com (no login).\\n2. Transfer Citi → Virgin Atlantic 1:1 (instant).\\n3. Call Virgin Atlantic at 800-365-9500 to book — cannot be booked online.", "conditions_md": "Direct flights only; segments price separately. $100 fee to change/cancel."},
  {"id": "sweet_lh_first_avianca", "section": "sweet_spot", "headline": "Lufthansa First Class to Europe for 87k via Avianca LifeMiles (no fuel surcharges)", "value_model": {"kind": "transfer_redemption", "partner_program": "avianca_lifemiles", "points_one_way": 87000, "cash_equiv_usd_low": 5000, "cash_equiv_usd_high": 12000, "destination_signal": "destination_europe", "surcharges_usd": 0, "requires_premium_card": true}, "mechanism_md": "Avianca LifeMiles never charges carrier-imposed fuel surcharges. Lufthansa First at 87k one-way to Europe nets ~$1,000 in cash savings vs other partners that pass through surcharges.", "how_to_md": "1. Find Lufthansa First availability (typically opens 14 days out).\\n2. Transfer Citi → Avianca LifeMiles 1:1.\\n3. Book on lifemiles.com or by phone."},
  {"id": "sweet_united_domestic_turkish", "section": "sweet_spot", "headline": "United domestic for 7,500–10,000 miles via Turkish Miles & Smiles", "value_model": {"kind": "transfer_redemption", "partner_program": "turkish_miles_smiles", "points_one_way": 7500, "cash_equiv_usd_low": 200, "cash_equiv_usd_high": 800, "destination_signal": "destination_us_domestic", "surcharges_usd": 5, "requires_premium_card": true}, "mechanism_md": "Turkish Miles & Smiles charges 7.5k–10k one-way for any United domestic flight. No fuel surcharges on United metal.", "how_to_md": "1. Verify United Saver space on united.com or aircanada.com.\\n2. Transfer Citi → Turkish 1:1.\\n3. Search Star Alliance awards in the Turkish app or call to book.", "conditions_md": "Turkish website is quirky; mobile app and phone are often more reliable."},
  {"id": "sweet_hawaii_turkish", "section": "sweet_spot", "headline": "United to Hawaii roundtrip for 50k miles via Turkish", "value_model": {"kind": "transfer_redemption", "partner_program": "turkish_miles_smiles", "points_one_way": 25000, "cash_equiv_usd_low": 400, "cash_equiv_usd_high": 1200, "destination_signal": "destination_hawaii", "surcharges_usd": 30, "requires_premium_card": true}, "mechanism_md": "50k Turkish miles books a roundtrip mainland-Hawaii on United metal. The previous 15k sweet-spot is gone, but 50k RT is still strong vs cash.", "how_to_md": "1. Confirm United Saver space.\\n2. Transfer Citi → Turkish 1:1.\\n3. Book through Turkish."},
  {"id": "sweet_etihad_backdoor", "section": "sweet_spot", "headline": "AA Business to Europe/Asia for 50k via Etihad Guest backdoor", "value_model": {"kind": "transfer_redemption", "partner_program": "etihad_guest", "points_one_way": 50000, "cash_equiv_usd_low": 3500, "cash_equiv_usd_high": 7000, "destination_signal": "destination_europe", "surcharges_usd": 100, "requires_premium_card": true}, "mechanism_md": "Etihad's award chart prices AA-operated flights at 50k biz / 62.5k first to Europe or Asia 1 — significantly cheaper than booking via AAdvantage directly. AA Metal only.", "how_to_md": "1. Find AA Saver space on AA.com.\\n2. Transfer Citi → Etihad 1:1.\\n3. Call Etihad to book the partner award (cannot self-serve online for AA partner space).", "conditions_md": "AA Metal only — does not work for Oneworld partner-operated flights."},
  {"id": "sweet_royal_air_maroc", "section": "sweet_spot", "headline": "Royal Air Maroc Business to Casablanca for 44k via Etihad", "value_model": {"kind": "transfer_redemption", "partner_program": "etihad_guest", "points_one_way": 44000, "cash_equiv_usd_low": 2500, "cash_equiv_usd_high": 4500, "destination_signal": "destination_morocco", "surcharges_usd": 150, "requires_premium_card": true}, "mechanism_md": "Etihad's distance-based chart prices Royal Air Maroc nonstop US-Casablanca at 22k economy / 44k biz. Eligible from JFK, IAD, MIA.", "how_to_md": "1. Confirm Royal Air Maroc award space on royalairmaroc.com or partner tools.\\n2. Transfer Citi → Etihad 1:1.\\n3. Book via Etihad website or phone."},
  {"id": "sweet_jetblue_mint_qatar", "section": "sweet_spot", "headline": "JetBlue Mint to Europe for 78k via Qatar Avios ($10 in taxes)", "value_model": {"kind": "transfer_redemption", "partner_program": "qatar_privilege_club", "points_one_way": 78000, "cash_equiv_usd_low": 2500, "cash_equiv_usd_high": 5000, "destination_signal": "destination_europe", "surcharges_usd": 10, "requires_premium_card": true}, "mechanism_md": "Transfer Citi → Qatar Avios 1:1 to book JetBlue Mint biz to Europe at 78k Avios with about $10 in taxes/fees.", "how_to_md": "1. Find JetBlue Mint Europe availability on jetblue.com.\\n2. Transfer Citi → Qatar.\\n3. Book through Qatar Privilege Club."},
  {"id": "sweet_vacasa_wyndham", "section": "sweet_spot", "headline": "Vacasa vacation rentals at 15k Wyndham points/bedroom/night", "value_model": {"kind": "transfer_redemption", "partner_program": "wyndham_rewards", "points_one_way": 15000, "cash_equiv_usd_low": 200, "cash_equiv_usd_high": 600, "destination_signal": "destination_us_domestic", "surcharges_usd": 0, "requires_premium_card": true}, "mechanism_md": "Wyndham prices Vacasa rentals at 15k points per bedroom per night. Bookings often skip cleaning and resort fees that apply to cash stays.", "how_to_md": "1. Search Vacasa availability via wyndhamrewards.com.\\n2. Transfer Citi → Wyndham 1:1 (~24 hours).\\n3. May require a phone call to complete booking."},
  {"id": "sweet_choice_pre_deval", "section": "sweet_spot", "headline": "Choice Privileges 1:2 transfers — DEVALUES April 19, 2026 to 1:1.5", "value_model": {"kind": "transfer_redemption", "partner_program": "choice_privileges", "points_one_way": 8000, "cash_equiv_usd_low": 100, "cash_equiv_usd_high": 400, "destination_signal": "destination_europe", "surcharges_usd": 0, "requires_premium_card": true}, "mechanism_md": "Through April 18, 2026, premium Citi cards transfer to Choice at 1:2. After April 19, 2026, the ratio drops to 1:1.5 — a 25% devaluation. If user plans to use Choice points (Scandinavia, Japan, Ascend Collection suites), transferring before the deadline locks in the better rate.", "how_to_md": "1. Decide your Choice booking before April 19, 2026.\\n2. Transfer Citi → Choice at 1:2.\\n3. Book the stay (Choice points themselves don't expire as long as account stays active).", "conditions_md": "Transfers are one-way and irreversible. Don't transfer speculative balances.", "expires_at": "2026-04-19"},

  {"id": "protect_trip_delay", "section": "protection", "headline": "Trip Delay: $500/trip after 6+ hour delay (2 claims/yr)", "value_model": {"kind": "protection_coverage", "max_value_usd": 500, "period": "per_trip", "claim_cap_per_year": 2}, "mechanism_md": "When a covered trip (paid for in full or part with the Strata Premier) is delayed 6 hours or more, you can claim up to $500 for meals, lodging, and incidentals. Maximum 2 claims per 12-month period.", "how_to_md": "1. Save receipts during the delay.\\n2. File at cardbenefitservices.com within 60 days.\\n3. Coverage administered by Mastercard."},
  {"id": "protect_trip_cancel", "section": "protection", "headline": "Trip Cancellation/Interruption: $5,000/trip, $10,000/year", "value_model": {"kind": "protection_coverage", "max_value_usd": 5000, "period": "per_trip", "claim_cap_per_year": 10000}, "mechanism_md": "Reimburses prepaid, nonrefundable trip costs if a covered trip is cut short or canceled for a covered reason (illness, severe weather, jury duty, etc.).", "how_to_md": "1. Document the cancellation reason.\\n2. File via Mastercard within 20 days of the event.\\n3. Up to $5k per trip, $10k aggregate per cardholder per year."},
  {"id": "protect_luggage", "section": "protection", "headline": "Lost/Damaged Luggage: $3,000/trip ($2,000/bag for NY residents)", "value_model": {"kind": "protection_coverage", "max_value_usd": 3000, "period": "per_trip"}, "mechanism_md": "Up to $3,000 reimbursement per trip for checked or carry-on luggage that is lost or damaged in transit. NY residents capped at $2,000 per bag.", "how_to_md": "1. File a report with the carrier.\\n2. Submit claim to Mastercard with the carrier's report and receipts."},
  {"id": "protect_rental_car", "section": "protection", "headline": "MasterRental: secondary in your home country, primary abroad", "value_model": {"kind": "protection_coverage", "max_value_usd": 50000, "period": "per_claim"}, "mechanism_md": "Decline the rental company's CDW; charge the rental to your Strata Premier; you're covered for theft and collision damage as primary outside your country of residence (secondary inside it).", "how_to_md": "1. Reserve and pay with the Strata Premier in the renter's name.\\n2. Decline the rental company's CDW/LDW.\\n3. File any claim within 45 days."},
  {"id": "protect_purchase", "section": "protection", "headline": "Purchase Protection: $10k/claim, $50k/year", "value_model": {"kind": "protection_coverage", "max_value_usd": 10000, "period": "per_claim", "claim_cap_per_year": 50000}, "mechanism_md": "Covers damage or theft of items charged to the Strata Premier within 90 days of purchase, up to $10,000 per claim and $50,000 per cardholder per year.", "how_to_md": "1. Keep your receipt and the original packaging if possible.\\n2. File a claim with Mastercard within the coverage window."},
  {"id": "protect_extended_warranty", "section": "protection", "headline": "Extended Warranty: +24 months on warranties of 5 years or less (best-in-class)", "value_model": {"kind": "protection_coverage", "max_value_usd": 10000, "period": "per_claim"}, "mechanism_md": "Adds 24 months to the manufacturer's warranty when the original warranty is 5 years or less. Considered best-in-class among premium credit-card warranty extensions.", "how_to_md": "1. Save the original receipt and warranty terms.\\n2. File via Mastercard once the manufacturer's warranty ends and an issue arises."},

  {"id": "mech_trifecta_pool", "section": "mechanic", "headline": "Trifecta pooling: convert Double Cash 2x and Custom Cash 5x into transferable points", "value_model": {"kind": "system_mechanic", "note": "Pooling Double Cash and Custom Cash points into your Strata Premier account at thankyou.com converts them from cash-equivalent points to fully transferable travel points. The 1:1 transfer ratio you keep is worth ~30% more than the 1:0.7 ratio no-AF Citi cards get on their own."}, "mechanism_md": "ThankYou points earned on no-AF Citi cards (Double Cash, Custom Cash) cannot transfer at full ratio on their own. Pooling them into your Strata Premier account upgrades them to 1:1 transferability across all 16 partners. Citi tracks which card earned which points, so closing a card erases its remaining points even if pooled.", "how_to_md": "1. Sign in at thankyou.com.\\n2. Go to Account Management → Combine Points.\\n3. Move points from Double Cash / Custom Cash into Strata Premier.\\n4. Once pooled, transfer to any partner."},
  {"id": "mech_48_month_rule", "section": "mechanic", "headline": "48-month signup-bonus rule (Strata Premier / Citi Premier family)", "value_model": {"kind": "system_mechanic", "note": "You are ineligible for the Strata Premier signup bonus if you received a Premier or Strata Premier bonus, or product-changed another card into a Premier, in the last 48 months."}, "mechanism_md": "Citi enforces a 48-month lockout on the Premier family. Resets the moment you product-change another card into a Premier or earn a fresh bonus.", "how_to_md": "1. Check your Citi statements/emails for the last bonus posting.\\n2. Wait until 48 months have passed before applying for a new SUB."},
  {"id": "mech_retention", "section": "mechanic", "headline": "Annual retention call: ask Citi for a fee waiver or spend-based bonus", "value_model": {"kind": "system_mechanic", "note": "Cardholders frequently report success calling Citi near anniversary to request a $95 fee waiver or a spend-based bonus offer (e.g., $100 statement credit on $X spend in 90 days). Not guaranteed, but a 5-minute call has nontrivial expected value."}, "mechanism_md": "Citi retention agents have discretion to offer fee waivers, statement credits, or bonus-points offers to retain cardholders. Best calling window is 30–60 days before the AF posts.", "how_to_md": "1. Call the number on the back of the card.\\n2. Ask to be transferred to retention or customer loyalty.\\n3. Mention you're considering closing the card and ask what they can do to retain you."},

  {"id": "advanced_ty_sharing", "section": "advanced", "headline": "Free 100k/yr point sharing — ENDS May 17, 2026", "value_model": {"kind": "niche_play", "estimated_annual_value_usd": 1000, "risk_tier": "green"}, "mechanism_md": "Until May 16, 2026, you can share up to 100,000 ThankYou points/year with any other ThankYou member, free. Shared points expire 90 days after transfer — share only if recipient has an immediate booking. Citi is ending this feature permanently on May 17, 2026.", "how_to_md": "1. Sign in at thankyou.com → Manage → Share Points.\\n2. Enter the recipient's ThankYou account number and points to send.\\n3. Recipient must redeem within 90 days.", "conditions_md": "Custom-Cash-only cardholders cannot share points with others. Shared points still earn at the recipient's redemption ratio.", "expires_at": "2026-05-17"},
  {"id": "advanced_curve_fx_hack", "section": "advanced", "headline": "Curve card hack to nullify FX fees on Double Cash / Custom Cash", "value_model": {"kind": "niche_play", "estimated_annual_value_usd": 50, "risk_tier": "yellow"}, "mechanism_md": "The Double Cash and Custom Cash charge foreign transaction fees. Loading them into a Curve card (which doesn't pass FX through) lets you earn 2x/5x abroad while bypassing the FX fee. The Strata Premier itself has no FX fees, so this only matters if you'd specifically want a 5x abroad.", "how_to_md": "1. Sign up for Curve.\\n2. Add Double Cash / Custom Cash as funding cards.\\n3. Use Curve abroad — Curve passes the charge to your Citi card without FX fee.", "conditions_md": "Curve's terms periodically change, and large FX volume can trigger account review. Use sparingly."},
  {"id": "advanced_fed_tax_payment", "section": "advanced", "headline": "Pay federal taxes for ~1.75% to buy ThankYou points at 0.875¢ each", "value_model": {"kind": "niche_play", "estimated_annual_value_usd": 0, "risk_tier": "yellow"}, "mechanism_md": "Federal tax payment processors charge ~1.75% to put taxes on a credit card. Using a 2x card like Double Cash effectively buys ThankYou points at 0.875¢ each. Only worth it if you reliably redeem at >1¢/pt — i.e., you actually transfer to airline partners. Bad math if you'd cash out.", "how_to_md": "1. Calculate redemption value first — must beat 0.875¢/pt.\\n2. Pay federal tax via pay1040.com or similar.\\n3. Pool earned points to Strata Premier.\\n4. Transfer to a sweet-spot partner.", "conditions_md": "Only profitable if you actually redeem at sweet-spot rates. Skip if you'd cash out."}
]
\`\`\`
```

(The exact sources URL list can be omitted in v0 to keep authoring tractable. The build script's `Url` validator allows empty `source_urls: []`.)

### Page layout and components

Layout (top to bottom): page header (card art + name + AF + currency), three-pillar `AuditGauge`, `DeadlineStrip` (renders only if `upcomingDeadlines.length > 0`), six audit feed sections in fixed order (Earning, Credits, Sweet Spots, Protections, Mechanics, Advanced — each section header + rows under it), `CitiTrifecta` at the bottom. Tailwind classes consistent with the existing app; do not introduce new component libraries.

Sweet spots section renders only rows where `visible=true` (destination matches user). Other sections render all visible rows.

Each `AuditRow` renders headline + value chip + a placeholder tristate UI (three icon buttons styled as disabled in v0 — they don't yet write state). Click on the row body expands the panel with `mechanism_md`, `how_to_md`, optional `conditions_md`, all rendered as markdown.

`CitiTrifecta` is hardcoded for v0: shows three nodes (Strata Premier, Double Cash, Custom Cash). Filled when in wallet, ghosted when not. Each ghosted node carries a static "Add this — unlocks pooling" caption. No click handlers in v0.

### LightRAG note

I did not query LightRAG during spec authoring (not running locally for this skill invocation). If Code wants cross-project context for the engine pattern, the existing `lib/engine/scoring.ts` is the authoritative reference for pure-function structure, redemption-style cpp resolution, and per-process memoization.

## Do Not Change

- `lib/engine/scoring.ts`, `lib/engine/eligibility.ts`, `lib/engine/ranking.ts` — these power the live recommender. The audit page reads card data and computes its own values; do not modify scoring behavior.
- `data/*.json` — derived from markdown by the build script. Do not write directly.
- `lib/db.ts` — auth/session DB wrapper. Audit v0 is read-only and does not need to write user state.
- `lib/auth.ts` and the `app/(app)/layout.tsx` auth gate — no changes.
- Any existing card markdown other than `cards/citi_strata_premier.md`.
- The `## cards.json entry`, `## programs.json entry`, `## issuer_rules.json entry`, `## perks_dedup.json entries`, and `## destination_perks.json entries` sections of `cards/citi_strata_premier.md`. The new `## card_plays` section is purely additive.
- The existing recommender UI (`/wallet`, `/recommendations`, etc.). The audit page is a new route that does not replace any existing surface.
- `package.json` dependencies — implement using existing libraries. Markdown rendering for `mechanism_md` / `how_to_md` should use whatever the project already has; if none, use `<pre>` formatted text in v0 rather than adding a markdown library.

## Acceptance Criteria

- [ ] `npm run cards:build` passes and emits `data/cards.json` containing `card_plays` on `citi_strata_premier` with exactly 28 entries.
- [ ] `npm run typecheck` passes with zero errors.
- [ ] `npm run build` passes with zero errors.
- [ ] `npm test` passes (engine tests must continue to pass; do not need new tests for audit in v0, though a single smoke test for `computeAudit` is welcome).
- [ ] With `NEXT_PUBLIC_AUDIT_V0=1`, navigating to `/wallet/cards/citi_strata_premier/audit` renders: three-pillar gauge with non-zero `guaranteed` value (assuming the test user has supermarket and dining spend), the deadlines strip showing the Choice 1:2 deadline (2026-04-19) and the TY sharing close (2026-05-17), all six section headers, and the Citi trifecta visualizer at the bottom.
- [ ] With `NEXT_PUBLIC_AUDIT_V0` unset or `0`, the route returns 404.
- [ ] `git diff` shows changes only in: `scripts/lib/schemas.ts`, `scripts/lib/parse.ts`, `scripts/build-card-db.ts`, `lib/engine/audit.ts` (new), `lib/engine/types.ts` (added `destinations` field only), `cards/citi_strata_premier.md` (appended `## card_plays` section only), `app/(app)/wallet/cards/[id]/audit/**` (new), and optionally one line on the existing card-detail page for the preview link.

## Verification

1. Run `npm run cards:build` and confirm `data/cards.json` for `citi_strata_premier` includes the `card_plays` array with 28 entries.
2. Run `npm run typecheck` and `npm run build`.
3. Run `npm test` and confirm zero failures.
4. With `NEXT_PUBLIC_AUDIT_V0=1`, hit `/wallet/cards/citi_strata_premier/audit` in dev. Visually verify the gauge renders, the deadline strip shows two banners, and the trifecta visualizer is at the bottom. Click a row to expand and confirm the mechanism/how-to text renders.
5. With the flag off, confirm the route returns 404.
6. `git diff --stat` and confirm no files outside the scope listed in *Do Not Change* / *Implementation Notes* are modified.
