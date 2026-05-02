# Research Prompt — US Credit Card Database for Comparison Engine

Paste the prompt below into Claude Code with deep-research/web access. Output goes into `data/cards.json` and `data/programs.json`. Follow the schema exactly. Cite primary sources (issuer pages, Award Wallet, The Points Guy, NerdWallet, Doctor of Credit) for every numeric claim.

---

## PROMPT START

You are doing primary research to build the source-of-truth dataset for a US credit-card recommendation engine. The engine will personalize recommendations based on a user's spend categories, services they use (Costco, United, Hilton, Marriott, Hyatt, Amazon, etc.), cards they already hold, and travel plans. It must reason about net annual value (rewards − annual fee − unredeemed credits), point transferability, and overlap between perks the user already has.

Produce two JSON files. Do not invent data. If a field is unknown after a careful search, set it to `null` and add a `"notes"` line explaining why. Cite a primary source URL for every numeric or policy claim in a `"sources"` array on each card.

### Scope

**Coverage target: 120–160 US-issued personal and small-business cards, current as of the research date.** Include every card meeting any of:

1. Top 5 cards by category in: flat-rate cashback, tiered/category cashback, rotating 5% cashback, premium travel, mid-tier travel, no-AF travel, balance transfer, student, secured, business.
2. Every co-branded card from these brands: United, Delta, American, Southwest, Alaska, JetBlue, Frontier, Spirit, Marriott, Hilton, Hyatt, IHG, Wyndham, Choice, Best Western, Costco, Amazon, Apple, Target, Walmart, Sam's Club, Disney, Capital One Walmart, BJ's, REI, Lowe's, Home Depot, Synchrony PayPal, Bilt.
3. Every card from these issuers' core lineups: Chase, Amex, Citi, Capital One, Bank of America, Wells Fargo, US Bank, Discover, Barclays, Synchrony, Bread/Comenity for the brands above.

### File 1 — `data/programs.json`

One entry per transferable-points or co-branded loyalty currency. Schema:

```json
{
  "id": "chase_ur",
  "name": "Chase Ultimate Rewards",
  "type": "transferable" | "fixed_value" | "cobrand_airline" | "cobrand_hotel",
  "issuer": "Chase",
  "earning_cards": ["chase_sapphire_preferred", "chase_sapphire_reserve", "..."],
  "fixed_redemption_cpp": 1.0,
  "portal_redemption_cpp": 1.25,
  "transfer_partners": [
    {"partner": "Hyatt", "ratio": "1:1", "type": "hotel", "min_transfer": 1000, "notes": null}
  ],
  "sweet_spots": [
    {"description": "Hyatt Cat 1-4 free night for 3,500-15,000 points", "value_estimate_usd": "~3.5cpp", "source": "..."}
  ],
  "sources": ["https://..."]
}
```

Required programs: Chase UR, Amex MR, Citi ThankYou, Capital One Miles, Bilt Rewards, Wells Fargo Rewards, US Bank FlexPoints, BoA Travel Rewards, Discover Cashback, Brex Points, plus every airline/hotel program that any covered card transfers to or earns directly.

For `sweet_spots`, list at minimum: Hyatt cat 1-4, Virgin Atlantic Flying Club ANA business class, Turkish Miles & Smiles for United domestic, Air France-KLM Flying Blue Promo Awards, Avianca LifeMiles Star Alliance partners, Aeroplan stopovers, Wyndham 7,500-pt Vacasa rentals.

### File 2 — `data/cards.json`

One entry per card. Schema (every field required unless marked optional):

```json
{
  "id": "chase_sapphire_preferred",
  "name": "Chase Sapphire Preferred Card",
  "issuer": "Chase",
  "network": "Visa",
  "card_type": "personal" | "business",
  "category": ["mid_tier_travel"],
  "annual_fee_usd": 95,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "chase_ur",

  "earning": [
    {"category": "travel_chase_portal", "rate_pts_per_dollar": 5, "cap_usd_per_year": null, "notes": "Through Chase Travel"},
    {"category": "dining", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "online_grocery", "rate_pts_per_dollar": 3, "cap_usd_per_year": null, "notes": "Excludes Walmart, Target, wholesale clubs"},
    {"category": "streaming_select", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "travel_other", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": 60000,
    "spend_required_usd": 4000,
    "spend_window_months": 3,
    "estimated_value_usd": 750,
    "notes": "Once-per-product family lifetime"
  },

  "annual_credits": [
    {"name": "Hotel credit through Chase Travel", "value_usd": 50, "type": "specific", "expiration": "annual_anniversary", "ease_of_use": "medium"}
  ],

  "ongoing_perks": [
    {"name": "Trip cancellation insurance", "value_estimate_usd": null, "category": "travel_protection"},
    {"name": "Primary auto rental CDW", "value_estimate_usd": null, "category": "travel_protection"},
    {"name": "DoorDash DashPass (12 months)", "value_estimate_usd": 120, "category": "lifestyle"}
  ],

  "transfer_partners_inherited_from": "chase_ur",

  "issuer_rules": [
    "Chase 5/24: denied if 5+ new cards on personal credit in 24 months",
    "Once-per-product-family: cannot earn SUB if held any Sapphire (Preferred or Reserve) in last 48 months and bonus received"
  ],

  "best_for": ["dining_and_travel_balance", "first_transferable_points_card", "international_travel_no_FX_fee"],
  "synergies_with": ["chase_freedom_unlimited", "chase_freedom_flex", "chase_ink_business_preferred"],
  "competing_with_in_wallet": ["amex_gold", "capital_one_venture", "citi_strata_premier"],

  "breakeven_logic_notes": "AF $95. To beat 2% flat-rate card on $X non-bonus spend: needs bonus categories. Justified if user spends >$5k/yr combined dining+travel.",

  "data_freshness": "2026-04-15",
  "sources": ["https://creditcards.chase.com/...", "https://www.doctorofcredit.com/..."]
}
```

### Specific things you MUST capture

1. **Issuer application rules** as machine-readable rule strings: Chase 5/24, Amex once-per-lifetime SUB on each product, Citi 8/65/95 ThankYou family rules, Capital One 1-card-per-issuer-per-month limit, BoA 2/3/4 and 7/12, Barclays 6/24 informal rule. Put under each card under `issuer_rules` AND in a top-level `data/issuer_rules.json` keyed by issuer.

2. **Statement credits with realistic ease-of-use grades.** Don't just sum face value. Use this scale:
   - `easy` — flexible cash equivalent (Capital One Venture X $300 travel), unrestricted dining credits
   - `medium` — specific category, recurring (Amex Gold dining credit, Chase Sapphire Reserve Edit hotel credit)
   - `hard` — narrow merchant or one-time (Saks $50 semiannual, Equinox $300, Resy)
   - `coupon_book` — Amex Platinum-style stacks where the realistic redemption rate is far below face value

3. **For each perk that overlaps across cards** (Global Entry, CLEAR, Priority Pass, DoorDash DashPass, Walmart+, Uber Cash) add a top-level `data/perks_dedup.json` so the engine can reason about which perks the user already gets from existing cards and not double-count.

4. **Travel protections that actually pay out**: primary vs secondary CDW, trip delay reimbursement thresholds (6h vs 12h), trip cancellation max, baggage delay, cell phone protection deductible. These materially separate Chase Sapphire Reserve / Amex Platinum / Capital One Venture X.

5. **Effective bonus-category multipliers under issuer portals**: Chase Sapphire Reserve through Chase Travel, Capital One Venture X through Capital One Travel, Amex through amextravel.com — note when redemption value differs from earning rate.

6. **Costco-specific**: Visa-only acceptance, Costco Anywhere Visa earning structure, why Citi Custom Cash and Capital One Venture X work for Costco.

7. **Bilt specifics**: rent earning with no fee, transfer partners (especially Hyatt and Alaska), Rent Day 2x.

8. **Hidden gems by destination**: include a `data/destination_perks.json` mapping common US/intl destinations to relevant card perks. Example shape:
```json
{
  "arizona_phoenix_scottsdale": {
    "hotel_chains_strong": ["Hyatt (Andaz Scottsdale)", "Marriott (Phoenician)"],
    "relevant_cards": ["chase_sapphire_preferred (Hyatt transfer)", "marriott_bonvoy_brilliant"],
    "airline_routes_strong": ["American hub PHX", "Southwest PHX"],
    "notes": "Hyatt Cat 1-4 free night certs from World of Hyatt cards redeem extremely well at Andaz Scottsdale off-peak."
  }
}
```
Cover at minimum: NYC, LA, SF, Vegas, Chicago, Miami, Orlando, Phoenix/Scottsdale, Hawaii (Maui/Oahu), Aspen/Vail, Cancun/Playa, Tokyo, Paris, London, Rome, Bangkok.

9. **Annual-fee waivers and retention-offer norms** when documented (e.g. "Amex frequently offers 30k MR for $2k spend retention on Gold"). Mark as `retention_typical` with a value range.

### Tone and rigor

- No marketing fluff. The output feeds an engine, not a blog.
- If a number conflicts between sources, use the issuer's own page and note the discrepancy.
- If a card's rules changed in the last 12 months (e.g. Chase Sapphire Reserve refresh), flag with `recently_changed: true` and the change date.
- Every dollar value is in USD as of research date.
- Do not include cards that are no longer open to new applicants (mark `closed_to_new_apps: true` if relevant for legacy holders, but de-prioritize).

### Deliverables

1. `data/programs.json`
2. `data/cards.json`
3. `data/issuer_rules.json`
4. `data/perks_dedup.json`
5. `data/destination_perks.json`
6. `data/RESEARCH_NOTES.md` — ambiguities, conflicts, things you couldn't verify, sweet spots that may be devalued soon.

When done, print a checklist of cards covered grouped by category and confirm coverage against the scope list above.

## PROMPT END
