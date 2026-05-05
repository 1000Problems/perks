# Network research prompt — Mastercard World Elite

Paste this prompt into Claude Research. Output is a single JSON document that
maps directly to our `OngoingPerk` schema and feeds the per-card "From the
Mastercard network" section. Re-run every 4–6 months and diff against the
previous run to surface added / removed / changed benefits.

The prompt is parameterized so the same structure works for World Elite,
World Legend, Visa Infinite, Visa Signature, etc. — change the `NETWORK`
parameter at the top.

---

## Prompt to paste

```
You are a credit-card benefits researcher. Your output feeds a US recommendation
engine and is ingested as JSON, not read as prose. Accuracy and source rigor
matter more than coverage breadth.

Parameters for this run:
  NETWORK = "Mastercard World Elite"
  REGION  = "US"
  TODAY   = <ISO date you actually open the pages, e.g. 2026-05-05>
  CARDS_TO_OVERLAY = ["citi_strata_premier"]   ← add/remove cards here

Mission

Compile the complete current state of NETWORK benefits in REGION across five
tiers (below). Then for each card in CARDS_TO_OVERLAY, identify which
network benefits the issuer actually enables, which it disables, and which
it overrides. Output one JSON document with the shape specified at the end.

What "current" means: a benefit is current if (a) the official source page
is reachable today, (b) the benefit's stated end date is in the future or
unspecified, and (c) the benefit appears on the network's or issuer's own
domain — not just a partner's marketing page. If any of those fail, the
benefit goes under `unverified_claims` or `deprecated_or_changed`, not
under the live tiers.

Five tiers to research, in order

  Tier 1 — Universal Mastercard benefits
  Benefits available on every Mastercard regardless of tier (Standard, World,
  World Elite, World Legend). Examples: Zero Liability, Mastercard ID Theft
  Protection enrollment, Global Service phone number, EMV chip security.

  Tier 2 — World Elite–specific benefits
  Benefits exclusive to World Elite (and World Legend). Subdivide:
    2a) Always-on / passive — no enrollment needed
    2b) Activation-required — free but user must register/opt in
    2c) Co-branded partner offers — Mastercard's deals with merchants
        (Lyft, Peacock, Instacart, etc.), each with start/end dates and
        enrollment URLs

  Tier 3 — Earn channels (Mastercard's own marketplaces)
  Where a cardholder earns extra rewards beyond the card's native earn rate.
  Document each separately:
    - Mastercard Travel Rewards (international cashback portal)
    - Mastercard Travel (booking site — does it earn extra above issuer rates?)
    - Mastercard Easy Savings (small business; flag whether it applies)
    - Priceless Specials / Mastercard Offers (merchant-funded discount portals)
    - Any other earn portal you find on mastercard.com
  For each: how to access, what categories earn what, eligibility, enrollment
  URL, and (if listed) sample participating merchants.

  Tier 4 — Regional / destination benefits
  Benefits that activate when traveling to or being in a specific country/city:
    - Priceless Cities — list every city with a current program, with the URL
      of each city page. Tag each with our destination signal id where
      applicable (destination_japan, destination_paris, etc.; see
      signals/destination_*.md in the repo for the canonical list).
    - Priceless Causes
    - Mastercard Golf (PGA TOUR, Open Championship benefits)
    - Country-specific cashback rates inside Mastercard Travel Rewards

  Tier 5 — Insurance & protection (network-administered)
  Even when issuers package these, Mastercard's underwriter administers the
  claims. Document:
    - MasterRental car CDW — current limits, primary vs secondary
    - Trip delay / cancellation / interruption — limits and triggers
    - Lost luggage / baggage delay
    - Travel accident insurance
    - Purchase protection
    - Extended warranty
    - Cell phone protection (if applicable to NETWORK)
  For each: claim filing URL, current limits, exclusions, coverage period.

Source rules — strict

Authoritative sources, in priority order:
  1. Mastercard.com (network pages, regional landing pages)
  2. Mastercard partner pages (peacocktv.com/mastercard, lyft.com/mastercard,
     instacart.com/p/mastercard-offer, mastercard.com/lyft, etc.)
  3. Underwriter Guide-to-Benefits PDFs (cardbenefitservices.com, AIG /
     New Hampshire Insurance)
  4. Issuer pages confirming a specific card enables a benefit
     (citi.com/credit-cards/..., chase.com/personal/credit-cards/...)

Not acceptable as the sole citation:
  - Blog posts (TPG, Frequent Miler, ThriftyTraveler, NerdWallet, Forbes
    Advisor) — useful for cross-checking but cannot be the cited URL
  - Reddit threads, forum posts
  - archive.org / web.archive.org or any cached version
  - Third-party aggregators (CardRatings, ValuePenguin, WalletHub)

Every entry MUST have:
  - source.url      — the deep link to the specific benefit page, not a
                      homepage. If only a homepage exists, mark
                      `confirmed: false` and add to `unverified_claims`.
  - source.type     — one of: "network" | "underwriter" | "partner" | "issuer"
  - source.label    — short human-readable name of the page
  - source.verified_at — TODAY (the date you actually opened the page)

Numerical claims

Only quote `value_estimate_usd` when the network or issuer publishes a number.
Do NOT estimate. Leave it null when unknown. Same for `expires_at`: include
only when the source explicitly states a date; "limited time" without a
date does not become an expiration.

Output JSON shape

Return ONE JSON document. No prose, no commentary outside the JSON. The
top level shape:

{
  "research_run": {
    "network": "<NETWORK>",
    "region": "<REGION>",
    "verified_at": "<TODAY>",
    "researcher": "claude-research",
    "previous_run_compared": null   /* set to the previous file's verified_at when this is a re-run */
  },

  "universal_benefits":      [ <BenefitEntry>, … ],   /* Tier 1 */
  "tier_specific_benefits":  [ <BenefitEntry>, … ],   /* Tier 2 — passive + activation + partner mixed; use `subtype` */
  "earn_channels":           [ <EarnChannelEntry>, … ], /* Tier 3 */
  "destination_benefits":    [ <DestinationEntry>, … ], /* Tier 4 */
  "insurance_protection":    [ <BenefitEntry>, … ],   /* Tier 5 */

  "card_overlays": [ <CardOverlayEntry>, … ],         /* one per card in CARDS_TO_OVERLAY */

  "unverified_claims": [
    {
      "claim": "...",
      "found_on": "<blog URL>",
      "what_would_confirm_it": "...",
      "blog_source": "..."
    }
  ],

  "deprecated_or_changed_since_last_run": [
    {
      "id": "<benefit id>",
      "status": "removed" | "value_changed" | "expiry_changed" | "enrollment_url_changed",
      "previous_value": "...",
      "new_value": "...",
      "as_of": "YYYY-MM",
      "source": <Source>
    }
  ]
}

BenefitEntry shape (matches our OngoingPerk schema; ingested verbatim):

{
  "id": "mc_zero_liability",                         /* stable kebab-prefixed id; reuse across runs */
  "name": "Zero Liability Protection",               /* user-visible name */
  "value_estimate_usd": null | <number>,             /* only when published */
  "category": "passive" | "lifestyle" | "travel_perk" | "travel_protection" | "shopping_protection",
  "activation": "passive" | "signal_gated",
  "signal_id": null | "<signal id from signals/*.md>",
  "subtype": "always_on" | "activation_required" | "partner_offer",  /* Tier 2 only */
  "enrollment_url": null | "<url>",                  /* present when activation needed */
  "expires_at": null | "YYYY-MM-DD",                 /* only when published */
  "notes": "1–2 sentences. Concrete. No marketing language. State who it covers, where, and any meaningful limit.",
  "source": {
    "url": "<deep link, NOT homepage>",
    "type": "network" | "underwriter" | "partner" | "issuer",
    "label": "Mastercard Zero Liability page",
    "verified_at": "<TODAY>"
  }
}

EarnChannelEntry shape (Tier 3):

{
  "id": "mc_travel_rewards",
  "name": "Mastercard Travel Rewards",
  "kind": "international_cashback_portal" | "booking_site" | "merchant_offers" | "small_business",
  "how_to_access": "Sign in at travelrewards.mastercard.com with an eligible World Elite or World Legend card.",
  "eligibility": "World Elite or World Legend US-issued credit cards.",
  "enrollment_url": "https://...",
  "earn_structure": [
    { "country": "JP", "category": "dining",   "cashback_pct": 5 },
    { "country": "FR", "category": "shopping", "cashback_pct": 3 }
  ],
  "sample_participating_merchants": [],               /* fill only if listed on the page */
  "notes": "...",
  "source": <Source>
}

DestinationEntry shape (Tier 4):

{
  "id": "priceless_paris",
  "name": "Priceless Paris",
  "destination_signal": "destination_paris",          /* matches signals/destination_*.md */
  "city": "Paris",
  "country": "FR",
  "current_experiences": [
    { "title": "...", "category": "dining" | "culture" | "sports" | "music", "url": "..." }
  ],
  "notes": "...",
  "source": <Source>
}

CardOverlayEntry shape:

{
  "card_id": "citi_strata_premier",
  "verified_at": "<TODAY>",
  "issuer_source_url": "https://www.citi.com/credit-cards/citi-strata-premier-credit-card",
  "guide_to_benefits_url": "<URL or null>",
  "enabled_network_benefits": [ "<benefit id>", … ],   /* the network ids the issuer enables */
  "disabled_or_not_offered": [
    {
      "id": "mc_priority_pass",
      "reason": "Citi does not enable Priority Pass on the Strata Premier (Strata Elite only).",
      "evidence_url": "<deep link to the issuer's product page or T&C>"
    }
  ],
  "issuer_overrides": [                               /* issuer changes a network benefit's terms */
    {
      "id": "<benefit id>",
      "what_changed": "Issuer raises trip-delay coverage from $300 (network default) to $500.",
      "evidence_url": "<URL>"
    }
  ]
}

Re-run / diff rules

When this is a re-run (i.e. CARDS_TO_OVERLAY and a previous JSON file exist):
  1. Open the previous JSON. Set `previous_run_compared` to its `verified_at`.
  2. For every `id` in both runs: if `notes`, `value_estimate_usd`,
     `expires_at`, or `enrollment_url` differs, append to
     `deprecated_or_changed_since_last_run` with `status: "value_changed"`
     and the source confirming the change.
  3. For every `id` only in the previous run: append with `status: "removed"`
     and the source confirming removal (or absence from the network's page).
  4. For every `id` only in the new run: it's a new benefit — no action
     needed in the deprecated array.
  5. Stable ids: NEVER renumber or rename ids across runs. If a benefit's
     branding changes (e.g. DashPass → Peacock), the new benefit gets a new
     id and the old id moves to deprecated.

What to skip

- Benefits with no Mastercard.com or issuer.com page — they're rumors.
- Promotional language without a concrete benefit value or mechanism.
- Marketing tabs that don't lead to actual benefit pages.
- Benefits whose stated end date is in the past.
- Anything you can find only on a blog. Move it to `unverified_claims`.

Output now. JSON only, no commentary.
```

---

## How to use the output

1. Save the JSON to `cards/_NETWORK_RESEARCH/world_elite_mastercard_<verified_at>.json`.
2. Run `scripts/ingest-network-research.ts` (TODO — write next) to:
   - Update each card in `CARDS_TO_OVERLAY` by inserting / updating
     `ongoing_perks[]` entries that match `card_overlays[].enabled_network_benefits`.
   - Source urls flow into the existing `source` field (`type: "network"`).
   - Disabled-by-issuer benefits land in a new `disabled_network_benefits[]`
     array on the card so the UI can show "Network advertises but issuer
     doesn't enable" rows.
3. Diff against the previous run's JSON in git to review what changed before
   merging.

## Notes for the operator

- Run separately per region. The US run and the EU run will produce different
  earn structures inside Mastercard Travel Rewards.
- For card overlays, list every Mastercard-network card we have in
  `cards/*.md` whose `network` field is `"Mastercard World Elite"` (run
  `grep -l '"network": "Mastercard World Elite"' cards/*.md` to enumerate).
- Add `claude-research` as the researcher tag on every run so we can
  filter / blame when triaging stale data.
