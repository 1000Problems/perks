# Chase Sapphire Preferred Card

`card_id`: chase_sapphire_preferred
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "chase_sapphire_preferred",
  "name": "Chase Sapphire Preferred Card",
  "issuer": "Chase",
  "network": "Visa",
  "card_type": "personal",
  "category": ["mid_tier_travel"],
  "annual_fee_usd": 95,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "chase_ur",

  "earning": [
    {"category": "travel_chase_portal", "rate_pts_per_dollar": 5, "cap_usd_per_year": null, "notes": "Chase Travel; excludes hotel purchases that earn the $50 hotel credit"},
    {"category": "dining", "rate_pts_per_dollar": 3, "cap_usd_per_year": null, "notes": "Includes eligible delivery and takeout"},
    {"category": "online_grocery", "rate_pts_per_dollar": 3, "cap_usd_per_year": null, "notes": "Excludes Walmart, Target, wholesale clubs"},
    {"category": "streaming_select", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "travel_other", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": 75000,
    "spend_required_usd": 5000,
    "spend_window_months": 3,
    "estimated_value_usd": 1500,
    "notes": "Current public offer as of 2026-05; valued at ~2cpp via Hyatt transfers"
  },

  "annual_credits": [
    {"name": "Chase Travel hotel credit", "value_usd": 50, "type": "specific", "expiration": "annual_anniversary", "ease_of_use": "medium", "notes": "Must book hotel through Chase Travel"}
  ],

  "ongoing_perks": [
    {"name": "10% anniversary points bonus", "value_estimate_usd": null, "category": "rewards_boost", "notes": "10% of prior-year purchase points each anniversary"},
    {"name": "Trip cancellation/interruption insurance", "value_estimate_usd": null, "category": "travel_protection", "notes": "Up to $10,000/person, $20,000/trip"},
    {"name": "Primary auto rental CDW", "value_estimate_usd": null, "category": "travel_protection"},
    {"name": "Trip delay reimbursement", "value_estimate_usd": null, "category": "travel_protection", "notes": "12+ hour delay or overnight, up to $500/ticket"},
    {"name": "Baggage delay insurance", "value_estimate_usd": null, "category": "travel_protection", "notes": "$100/day up to 5 days after 6-hour delay"},
    {"name": "Lost luggage reimbursement", "value_estimate_usd": null, "category": "travel_protection"},
    {"name": "DoorDash DashPass", "value_estimate_usd": 120, "category": "lifestyle", "notes": "Complimentary through Dec 31 2027 with DoorDash account activation"},
    {"name": "Purchase protection", "value_estimate_usd": null, "category": "purchase_protection", "notes": "120 days, $500/claim, $50,000/account"},
    {"name": "Extended warranty", "value_estimate_usd": null, "category": "purchase_protection"},
    {"name": "1:1 point transfers to airline/hotel partners", "value_estimate_usd": null, "category": "rewards_flexibility"}
  ],

  "transfer_partners_inherited_from": "chase_ur",

  "issuer_rules": [
    "Chase 5/24: denied if 5+ new personal-credit cards opened in last 24 months",
    "Sapphire family bonus eligibility: cannot earn SUB if currently hold any Sapphire card or have received a Sapphire SUB in last 48 months"
  ],

  "best_for": ["dining_and_travel_balance", "first_transferable_points_card", "international_travel_no_FX_fee", "Hyatt_transfer_value"],
  "synergies_with": ["chase_freedom_unlimited", "chase_freedom_flex", "chase_ink_business_preferred", "chase_ink_business_unlimited", "chase_ink_business_cash"],
  "competing_with_in_wallet": ["amex_gold", "capital_one_venture", "citi_strata_premier"],

  "breakeven_logic_notes": "AF $95, less $50 hotel credit (medium ease) = ~$45 effective. Beats 2% flat-rate card on combined dining+travel+online-grocery once category spend exceeds ~$5k/yr at 2cpp valuation; gap widens at higher Hyatt transfer valuations.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": [
    "https://creditcards.chase.com/rewards-credit-cards/sapphire/preferred",
    "https://thepointsguy.com/credit-cards/chase-sapphire-preferred-current-offer/",
    "https://upgradedpoints.com/credit-cards/reviews/chase-sapphire-preferred-card/welcome-offer-eligibility-changes/"
  ]
}
```

## programs.json entry (chase_ur)

```json
{
  "id": "chase_ur",
  "name": "Chase Ultimate Rewards",
  "type": "transferable",
  "issuer": "Chase",
  "earning_cards": [
    "chase_sapphire_preferred",
    "chase_sapphire_reserve",
    "chase_freedom_unlimited",
    "chase_freedom_flex",
    "chase_freedom_rise",
    "chase_ink_business_preferred",
    "chase_ink_business_cash",
    "chase_ink_business_unlimited",
    "chase_ink_business_premier"
  ],
  "fixed_redemption_cpp": 1.0,
  "portal_redemption_cpp": 1.25,
  "portal_redemption_cpp_notes": "1.25cpp on Sapphire Preferred / Ink Business Preferred via Chase Travel; Sapphire Reserve has shifted to a different points-and-cash redemption model post-2025 refresh",
  "transfer_partners": [
    {"partner": "United MileagePlus", "ratio": "1:1", "type": "airline", "min_transfer": 1000, "notes": null},
    {"partner": "Southwest Rapid Rewards", "ratio": "1:1", "type": "airline", "min_transfer": 1000, "notes": null},
    {"partner": "British Airways Avios", "ratio": "1:1", "type": "airline", "min_transfer": 1000, "notes": null},
    {"partner": "Air Canada Aeroplan", "ratio": "1:1", "type": "airline", "min_transfer": 1000, "notes": null},
    {"partner": "Air France-KLM Flying Blue", "ratio": "1:1", "type": "airline", "min_transfer": 1000, "notes": null},
    {"partner": "Virgin Atlantic Flying Club", "ratio": "1:1", "type": "airline", "min_transfer": 1000, "notes": null},
    {"partner": "Singapore KrisFlyer", "ratio": "1:1", "type": "airline", "min_transfer": 1000, "notes": null},
    {"partner": "Emirates Skywards", "ratio": "1:1", "type": "airline", "min_transfer": 1000, "notes": null},
    {"partner": "Aer Lingus AerClub", "ratio": "1:1", "type": "airline", "min_transfer": 1000, "notes": null},
    {"partner": "Iberia Plus", "ratio": "1:1", "type": "airline", "min_transfer": 1000, "notes": null},
    {"partner": "JetBlue TrueBlue", "ratio": "1:1", "type": "airline", "min_transfer": 1000, "notes": null},
    {"partner": "World of Hyatt", "ratio": "1:1", "type": "hotel", "min_transfer": 1000, "notes": "Best-value Chase UR transfer partner"},
    {"partner": "Marriott Bonvoy", "ratio": "1:1", "type": "hotel", "min_transfer": 1000, "notes": null},
    {"partner": "IHG One Rewards", "ratio": "1:1", "type": "hotel", "min_transfer": 1000, "notes": null}
  ],
  "sweet_spots": [
    {"description": "Hyatt Cat 1-4 free night 3,500-15,000 points (off-peak/standard)", "value_estimate_usd": "~3-5cpp", "source": "https://www.hyatt.com/info/world-of-hyatt-award-chart"},
    {"description": "Virgin Atlantic Flying Club ANA business class to Japan ~95-120k pts r/t", "value_estimate_usd": "~5-7cpp", "source": "https://thepointsguy.com/guide/virgin-atlantic-flying-club-sweet-spots/"},
    {"description": "Aeroplan stopovers on Star Alliance awards (5k stopover fee)", "value_estimate_usd": "~2-4cpp", "source": "https://www.aircanada.com/aeroplan/"},
    {"description": "Air France-KLM Flying Blue Promo Awards (monthly 20-50% off)", "value_estimate_usd": "~2-3cpp", "source": "https://www.flyingblue.com/"}
  ],
  "sources": [
    "https://creditcards.chase.com/rewards-credit-cards/ultimate-rewards",
    "https://thepointsguy.com/guide/maximizing-chase-ultimate-rewards/"
  ]
}
```

## issuer_rules.json entry (Chase)

```json
{
  "issuer": "Chase",
  "rules": [
    {
      "id": "chase_5_24",
      "name": "5/24 rule",
      "description": "Application denied if applicant has opened 5 or more cards across any issuer on personal credit in the last 24 months. Business cards from most issuers (including Chase) do not count toward the 5/24 count, but Chase business cards still pull personal credit and are subject to 5/24 themselves.",
      "applies_to": "all_personal_and_business_cards",
      "official": false,
      "notes": "Not in card terms but consistently enforced; verified via thousands of data points"
    },
    {
      "id": "sapphire_48_month",
      "name": "Sapphire family 48-month bonus rule",
      "description": "Cannot earn signup bonus on any Sapphire-family card if currently hold any Sapphire card OR received a Sapphire bonus in the last 48 months",
      "applies_to": ["chase_sapphire_preferred", "chase_sapphire_reserve"],
      "official": true
    },
    {
      "id": "ink_velocity",
      "name": "Ink approval velocity",
      "description": "Chase typically allows a new Ink Business card every ~90 days for established cardholders. Faster approval cadence has been documented but is not guaranteed.",
      "applies_to": "chase_ink_business_family",
      "official": false
    }
  ]
}
```

## perks_dedup.json entries contributed by this card

```json
[
  {
    "perk": "doordash_dashpass",
    "card_ids": ["chase_sapphire_preferred"],
    "value_if_unique_usd": 120,
    "value_if_duplicate_usd": 0,
    "notes": "Through 2027-12-31. Same membership across all Chase, Amex Platinum, Mastercard credit cards offering it."
  },
  {
    "perk": "primary_cdw_rental",
    "card_ids": ["chase_sapphire_preferred"],
    "value_if_unique_usd": "use_based",
    "value_if_duplicate_usd": "use_based",
    "notes": "Stacks at instance level (you choose which card to bill)."
  }
]
```

## destination_perks.json entries this card relevant to

```json
{
  "anywhere_with_hyatt": {
    "hotel_chains_strong": ["Hyatt"],
    "relevant_cards": ["chase_sapphire_preferred (UR transfer to Hyatt)"],
    "notes": "Best-known UR sweet spot. Cat 1-4 free-night certs and 3,500-15,000 point award nights at Andaz Scottsdale, Park Hyatt St. Kitts, Alila Ventana Big Sur deliver outsized value vs portal redemption."
  },
  "international_no_fx_fee": {
    "relevant_cards": ["chase_sapphire_preferred"],
    "notes": "0% foreign transaction fee + Visa network acceptance + primary CDW make CSP a default international travel card."
  }
}
```

## RESEARCH_NOTES.md entries for this card

- **2026 SUB level**: 75,000 pts / $5,000 spend / 3 months. This is elevated vs the long-running 60k baseline. Has periodically hit 80k and 100k in past public offers; expect reversion to 60k baseline at any time.
- **Sapphire Reserve refresh impact**: After the 2025 CSR refresh, the 1.25cpp portal redemption appears to have been preserved on CSP / Ink Preferred but is no longer the model on CSR itself. Verify before quoting.
- **Hyatt valuation**: Common valuations of UR at 2cpp lean heavily on Hyatt transfers. If user does not stay at Hyatt, realistic UR valuation drops to ~1.25-1.5cpp via portal/airline transfers for economy.
- **DashPass expiry**: Currently advertised through Dec 31 2027. Chase has extended this multiple times.
- **Once-per-product clarification**: The "48-month" rule is the eligibility window post-bonus-receipt. User can downgrade CSR → CSP without triggering the rule, but cannot earn a new Sapphire SUB.
