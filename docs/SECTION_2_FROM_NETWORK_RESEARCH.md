# Section 2 — From Network Research

The second section of every card page. Surfaces benefits the user gets because of the card's network (Mastercard World Elite, Visa Infinite, etc.), not because of the issuer. Citi doesn't market most of these; this section is where they become visible.

Source of truth is the research JSON produced by `_PROMPT_NETWORK_RESEARCH.md`. One JSON file per network per region, re-run every 4–6 months. The card's `card_overlays` entry inside that JSON tells us which network benefits the issuer actually enables on this card.

## Reusable across the network

This entire spec — the subsections, the Perk Card variants, the layout — works for every Mastercard World Elite card we ship. The only thing that changes between cards is which `card_overlays[]` entry we filter to. Same JSON, same UI, different `card_id`.

When a new World Elite card lands in `cards/*.md`, the work is:

1. Add the card_id to `CARDS_TO_OVERLAY` in the research prompt.
2. Re-run the research (which produces a fresh JSON with the new card overlay).
3. The Section 2 page renders automatically — no per-card design work.

When a card moves to a different network (e.g., a Visa Infinite product launches), it pulls from a different research JSON but uses the same Section 2 spec.

## Source rule

Every entry on Section 2 comes from one of:

- `mastercard.com` (network pages, regional landing pages)
- Official partner pages (`peacocktv.com/mastercard`, `lyft.com/mastercard`, `instacart.com/p/mastercard-offer`, etc.)
- Underwriter Guide-to-Benefits PDFs (`cardbenefitservices.com`, AIG / New Hampshire Insurance, Virginia Surety)
- Issuer pages confirming the card enables the benefit

Blog claims, Reddit threads, aggregators, archived pages — all out. They go to the future "From the community / unverified" section, not here.

If the card overlay disables a benefit (`disabled_or_not_offered`), it doesn't appear on the page at all. We don't show what isn't there.

## Five subsections, fixed order

Action-first ordering. The user has just learned what the issuer markets (Section 1) and now wants to know what else they can do with the card.

### 2.1 Earn channels

Compact list — one row per channel, three fields: name, one-line kind, link.

Source: `earn_channels[]` filtered to entries where `card_overlays[].enabled_network_benefits` contains the channel id.

Not Perk Cards. These are entry points to alternative ways of using the card, not benefits in themselves. Restrictions don't apply at this layer.

### 2.2 Activate to claim

Full Perk Cards. Sorted by `value_estimate_usd` descending so the highest-dollar enrollment is first.

Filter from JSON: any `tier_specific_benefits[]` entry where `subtype == "partner_offer"` AND the card overlay enables it. Plus any `universal_benefits[]` entry with `activation_required` that has recurring monthly/annual value (rare — most universal benefits are passive).

Each card gets:

- Title (the benefit name)
- Notes (verbatim from the JSON `notes` field)
- Source link
- Value chip (`$X/yr` from `value_estimate_usd`)
- Expiration chip (`Expires YYYY-MM-DD` from `expires_at`)
- Primary CTA: **Activate** → `enrollment_url`

Expiration on a chip, not buried in body text. Partner offers cycle; the user needs to see at a glance whether the deal is still live.

### 2.3 Always-on

Full Perk Cards. No CTA. Same shape as Section 1 — title, source, notes verbatim.

Filter from JSON: every `universal_benefits[]` and `tier_specific_benefits[]` entry where the card overlay enables it AND it's not a partner offer.

Special case: Mastercard ID Theft Protection. The JSON marks it `activation_required` but the enrollment is one-time, free, and continuous-service — no recurring value lost from delaying. Treat as always-on with a small inline "Enroll for free monitoring" link, not as an Activate-to-Claim card.

### 2.4 Where you go

The destination subsystem. Two read paths against the same data.

**On this card's page** — chip rail of destinations the card unlocks. Each chip = one `destination_benefits[]` entry where the card overlay enables it. When the user has a matching destination signal in their profile, the chip lights up.

**Cross-card recommendation** — when the user sets `destination_japan`, `destination_paris`, etc. in their profile, the recommender queries every card's destination entries where `destination_signal == <user's signal>` and surfaces matching cards. Same data, different read path.

Data model: each destination benefit carries a `destination_signal` field that matches the canonical signal IDs in `signals/destination_*.md`. One field, one index, two consumers.

A card with no matching destination entry simply doesn't surface for that signal. That's correct behavior — we add destination presence when a re-run picks it up, not before.

### 2.5 What you're covered for

Compact list. One line per coverage with the limit. No underwriter, no claim URL, no primary-vs-secondary nuance, no exclusions inline.

Filter from JSON: `insurance_protection[]` entries where the card overlay enables them.

For each entry, the line is: `<short benefit label>    <limit phrase>`. Examples:

- "Trip delay 6+ hours — up to $500 per trip"
- "Rental car damage — secondary in US, primary abroad"

Single link at the bottom: **Read the full benefits guide** → the issuer GTPB PDF (`card_overlays[].guide_to_benefits_url`). Everything claim-related lives there.

The user only needs the summary on the card page. When something happens, they pull the GTPB.

## The atomic unit — Perk Card v2

Same skeleton as Section 1, with three optional additions:

```
┌──────────────────────────────────────────────┐
│ Title — exact benefit name                   │
│   [auto-applied | activate | enrolled]       │  status pill
│   [$X/yr]  [Expires YYYY-MM-DD]              │  value/expiry chips
│                                              │
│ Notes — verbatim from JSON `notes` field.    │
│                                              │
│ Source: <link from `source.url`>             │
│                                              │
│ [ Activate now ]  → `enrollment_url`         │  only when activation needed
└──────────────────────────────────────────────┘
```

Field rules:

- **Title** — verbatim from `name`.
- **Notes** — verbatim from `notes`. The researcher distills concrete language; we don't paraphrase a paraphrase.
- **Source** — `source.url`. The label is `source.label`.
- **Status pill** — derived from `activation` and `subtype`. Three states: auto-applied (passive), activate (activation_required, not yet enrolled), enrolled (activation_required, user has enrolled).
- **Value chip** — only when `value_estimate_usd` is non-null.
- **Expiry chip** — only when `expires_at` is non-null.
- **Activate button** — only when `enrollment_url` is non-null AND the benefit is in subsection 2.2.

## Layout

Desktop:

```
┌──────────────────────────────────────────────┐
│ Additional perks from Mastercard World Elite │
└──────────────────────────────────────────────┘
┌──────────── 2.1 EARN CHANNELS ───────────────┐
│ Compact 3-field list                         │
└──────────────────────────────────────────────┘
┌──────────── 2.2 ACTIVATE TO CLAIM ───────────┐
│ Perk Cards 2-up, sorted $ desc               │
└──────────────────────────────────────────────┘
┌──────────── 2.3 ALWAYS-ON ───────────────────┐
│ Perk Cards 3-up                              │
└──────────────────────────────────────────────┘
┌──────────── 2.4 WHERE YOU GO ────────────────┐
│ Destination chip rail                        │
└──────────────────────────────────────────────┘
┌──────────── 2.5 WHAT YOU'RE COVERED FOR ─────┐
│ Coverage list + single GTPB link             │
└──────────────────────────────────────────────┘
```

Mobile: every block stacks single-column; chip rail scrolls horizontally; coverage list unchanged.

## What's not on this page

- Benefits the issuer doesn't enable. Filter them out via the card overlay; don't render them as dimmed.
- Unverified blog claims. They live in a separate "From the community" section that we'll spec later.
- Underwriter, claim filing URL, primary/secondary coverage, exclusions. These live in the GTPB.
- "Citi modified" badges or any editorial framing about how the issuer changed network defaults.
- Any benefit with `confirmed: false` in the JSON.

## Worked example — Citi Strata Premier (Mastercard World Elite)

Source JSON: `cards/_NETWORK_RESEARCH/world_elite_mastercard_2026-05-05.json`

Card overlay: `card_overlays[]` where `card_id == "citi_strata_premier"`.

**2.1 Earn channels**

Filter `earn_channels[]` to enabled ids — `mc_travel_rewards`, `mc_mastercard_travel_booking`, `mc_priceless_specials`. Three rows.

**2.2 Activate to claim**

Filter `tier_specific_benefits[]` where `subtype == "partner_offer"` AND enabled. Sorted by `value_estimate_usd` desc:

- Instacart+ — `value_estimate_usd: 150`, `expires_at: 2027-01-31`
- Lyft Take 3, Get $5 — `value_estimate_usd: 60`, `expires_at: 2027-01-31`
- Peacock $3/mo credit — `value_estimate_usd: 36`, `expires_at: 2027-12-31`
- Lyft 10% off scheduled airport rides — no `value_estimate_usd`, `expires_at: 2027-01-31`

**2.3 Always-on**

Filter remaining enabled benefits across `universal_benefits[]` and `tier_specific_benefits[]`. Nine cards:

- Zero Liability Protection
- Mastercard Global Service
- ID Theft Protection (with inline enrollment link)
- Public Transit Tap & Go
- Travel & Lifestyle Services
- World Elite Concierge
- Airport Concierge
- Music & Entertainment Presales
- Priceless Experiences

**2.4 Where you go**

Filter `destination_benefits[]` to enabled ids. For Strata Premier today: Priceless US filter, NY, Chicago, LA, Miami, Golf. Six chips.

**2.5 What you're covered for**

Filter `insurance_protection[]` to enabled ids. Six lines:

- Rental car damage — secondary in US, primary abroad
- Trip cancellation/interruption — up to $5,000 per trip ($10,000/year)
- Trip delay 6+ hours — up to $500 per trip
- Lost or damaged luggage — up to $3,000 per trip
- Purchase protection — up to $10,000 per item, 90 days
- Extended warranty — +24 months

GTPB link at the bottom: `card_overlays[0].guide_to_benefits_url`.

## Replicating for another World Elite card

1. Add the card_id to `CARDS_TO_OVERLAY` in the research prompt.
2. Re-run the prompt against Claude Research. Save the JSON to `cards/_NETWORK_RESEARCH/world_elite_mastercard_<date>.json`.
3. The card's Section 2 renders from its `card_overlays[]` entry. No code changes, no design changes.
4. If the card uses a different network, swap to that network's research JSON and follow the same five-subsection spec — the structure is network-agnostic.

## Re-run cadence

Every 4–6 months, or sooner if a partner offer is approaching its `expires_at`. The diff against the previous JSON (in `deprecated_or_changed_since_last_run[]`) tells us what changed since the last render — that's the changelog we surface to users on re-render.
