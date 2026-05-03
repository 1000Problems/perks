# Citi Strata Premier

`card_id`: citi_strata_premier
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "citi_strata_premier",
  "name": "Citi Strata Premier Card",
  "issuer": "Citi",
  "network": "Mastercard World Elite",
  "card_type": "personal",
  "category": ["mid_tier_travel"],
  "annual_fee_usd": 95,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "citi_thankyou",

  "earning": [
    {"category": "hotels_cars_attractions_citi_travel", "rate_pts_per_dollar": 10, "cap_usd_per_year": null, "notes": "Via CitiTravel.com"},
    {"category": "airlines", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "hotels_other", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "restaurants", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "supermarkets", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "gas_stations_ev_charging", "rate_pts_per_dollar": 3, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": 75000,
    "spend_required_usd": 4000,
    "spend_window_months": 3,
    "estimated_value_usd": 1100,
    "notes": "Has hit 80k-90k. Citi 8/65/95 ThankYou family rules apply."
  },

  "annual_credits": [
    {"name": "$100 hotel credit on $500+ stay via CitiTravel.com", "signal_id": "hotel_credit", "value_usd": 100, "type": "specific", "expiration": "calendar_year", "ease_of_use": "medium", "notes": "Once per calendar year. Single hotel stay $500+ (excluding taxes/fees) via CitiTravel.com or 1-833-737-1288. Applied instantly at booking. Primary cardholder only — AUs share, don't get a separate credit."}
  ],

  "ongoing_perks": [
    {"name": "Mastercard Luxury Hotels & Resorts", "value_estimate_usd": 250, "category": "travel_perk", "signal_id": "luxury_hotel_traveler", "notes": "Complimentary breakfast for two, room upgrade subject to availability, and $100 on-property amenity credit per stay at 4,000+ properties booked via mastercard.com/luxuryhotels."},
    {"name": "Citi Entertainment presale tickets", "value_estimate_usd": null, "category": "lifestyle", "notes": "Exclusive access and presale tickets to concerts, sporting events, and cultural experiences."},
    {"name": "Citi Concierge", "value_estimate_usd": null, "category": "lifestyle", "notes": "24/7 assistance with dining reservations, travel planning, and ticket purchases."},
    {"name": "Trip Delay Protection", "signal_id": "trip_insurance", "value_estimate_usd": null, "category": "travel_protection", "notes": "Up to $500 per covered trip when delayed 6+ hours, max 2 claims per 12 months. Underwritten by Mastercard."},
    {"name": "Trip Cancellation & Interruption", "signal_id": "trip_insurance", "value_estimate_usd": null, "category": "travel_protection", "notes": "Up to $5,000 per trip / $10,000 per cardholder per year for nonrefundable trip costs lost to a covered cancellation reason."},
    {"name": "Lost or Damaged Luggage", "signal_id": "trip_insurance", "value_estimate_usd": null, "category": "travel_protection", "notes": "Up to $3,000 per covered trip ($2,000 per bag for NY residents). File via Mastercard within 60 days."},
    {"name": "MasterRental car insurance", "value_estimate_usd": null, "category": "travel_protection", "notes": "Secondary CDW in your country of residence; primary outside. Decline the rental company's CDW and charge the rental to your Strata Premier."},
    {"name": "Worldwide Travel Accident Insurance", "value_estimate_usd": null, "category": "travel_protection", "notes": "Up to $1,000,000 accidental death & dismemberment when common-carrier fare is charged to the card."},
    {"name": "Purchase Protection", "value_estimate_usd": null, "category": "shopping_protection", "notes": "Up to $10,000 per claim, $50,000 per cardholder per year for damage or theft within 90 days of purchase."},
    {"name": "Extended Warranty", "value_estimate_usd": null, "category": "shopping_protection", "notes": "Adds 24 months to manufacturer warranties of 5 years or less, up to $10,000 per item. Industry-leading among $95-tier cards."},
    {"name": "DoorDash DashPass trial", "value_estimate_usd": 30, "category": "lifestyle", "notes": "Complimentary 3-month DashPass membership."},
    {"name": "Lyft monthly credit", "value_estimate_usd": 60, "category": "lifestyle", "signal_id": "rideshare_user", "notes": "$5 credit each month after 3+ Lyft rides. Enrollment required at mastercard.com/lyft."},
    {"name": "Instacart+ trial", "value_estimate_usd": 30, "category": "lifestyle", "notes": "2 months of free Instacart+ delivery + $10 off the second order each month."},
    {"name": "No foreign transaction fees", "value_estimate_usd": null, "category": "passive", "activation": "passive"},
    {"name": "Mastercard ID Theft Protection", "value_estimate_usd": null, "category": "passive", "activation": "passive"},
    {"name": "Citi Quick Lock", "value_estimate_usd": null, "category": "passive", "activation": "passive", "notes": "Instantly block new charges via the Citi app if the card is misplaced."}
  ],

  "transfer_partners_inherited_from": "citi_thankyou",

  "issuer_rules": [
    "Citi 8/65 (8 cards in 65 days max)",
    "Citi 1/8 (1 Citi card every 8 days)",
    "Citi 2/65 (2 cards in 65 days)",
    "Citi ThankYou family 24-month rule: cannot earn SUB on Strata Premier if received bonus on Premier/Strata Premier in last 24 months"
  ],

  "best_for": ["broad_3x_categories_at_$95_AF", "AAdvantage_transfer_users", "Turkish_Miles_Smiles_for_United"],
  "synergies_with": ["citi_double_cash", "citi_custom_cash"],
  "competing_with_in_wallet": ["chase_sapphire_preferred", "amex_gold", "capital_one_venture"],

  "breakeven_logic_notes": "AF $95 less $100 hotel credit (medium) = -$5 net AF if used. Broadest 3x category footprint among $95 mid-tier cards. Strong choice if user prefers ThankYou ecosystem (American AAdvantage transfer, Turkish Miles+Smiles).",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": [
    "https://www.citi.com/credit-cards/citi-strata-premier-credit-card",
    "https://thepointsguy.com/credit-cards/citi-strata-vs-citi-strata-premier/"
  ]
}
```

## programs.json entry (citi_thankyou)

```json
{
  "id": "citi_thankyou",
  "name": "Citi ThankYou Rewards",
  "type": "transferable",
  "issuer": "Citi",
  "earning_cards": [
    "citi_strata_premier",
    "citi_strata",
    "citi_double_cash",
    "citi_custom_cash",
    "citi_rewards_plus"
  ],
  "transfer_unlock_card_ids": [
    "citi_strata_premier",
    "citi_strata_elite"
  ],
  "fixed_redemption_cpp": 1.0,
  "portal_redemption_cpp": 1.0,
  "median_redemption_cpp": 1.9,
  "median_cpp_source_url": "https://thepointsguy.com/loyalty-programs/monthly-valuations/",
  "median_cpp_as_of": "2026-05-01",
  "transfer_partners": [
    {"partner": "American Airlines AAdvantage", "ratio": "1:1", "type": "airline", "min_transfer": 1000, "notes": "Unique to TY among major US transferable currencies"},
    {"partner": "Air France-KLM Flying Blue", "ratio": "1:1", "type": "airline", "min_transfer": 1000, "notes": null},
    {"partner": "Avianca LifeMiles", "ratio": "1:1", "type": "airline", "min_transfer": 1000, "notes": null},
    {"partner": "Cathay Pacific Asia Miles", "ratio": "1:1", "type": "airline", "min_transfer": 1000, "notes": null},
    {"partner": "Emirates Skywards", "ratio": "1:1", "type": "airline", "min_transfer": 1000, "notes": null},
    {"partner": "Etihad Guest", "ratio": "1:1", "type": "airline", "min_transfer": 1000, "notes": null},
    {"partner": "EVA Infinity MileageLands", "ratio": "1:1", "type": "airline", "min_transfer": 1000, "notes": null},
    {"partner": "JetBlue TrueBlue", "ratio": "1:1", "type": "airline", "min_transfer": 1000, "notes": "Best 1:1 of any TPG partner"},
    {"partner": "Qantas Frequent Flyer", "ratio": "1:1", "type": "airline", "min_transfer": 1000, "notes": null},
    {"partner": "Qatar Privilege Club", "ratio": "1:1", "type": "airline", "min_transfer": 1000, "notes": null},
    {"partner": "Singapore KrisFlyer", "ratio": "1:1", "type": "airline", "min_transfer": 1000, "notes": null},
    {"partner": "Turkish Miles & Smiles", "ratio": "1:1", "type": "airline", "min_transfer": 1000, "notes": null},
    {"partner": "Virgin Atlantic Flying Club", "ratio": "1:1", "type": "airline", "min_transfer": 1000, "notes": null},
    {"partner": "Choice Privileges", "ratio": "1:2", "type": "hotel", "min_transfer": 1000, "notes": "1:2 ratio is excellent for Choice transfers"},
    {"partner": "Wyndham Rewards", "ratio": "1:1", "type": "hotel", "min_transfer": 1000, "notes": null},
    {"partner": "Accor Live Limitless", "ratio": "2:1", "type": "hotel", "min_transfer": 1000, "notes": null}
  ],
  "sweet_spots": [
    {
      "description": "JAL Business Class US → Tokyo via American AAdvantage",
      "value_estimate_usd": "~5-8cpp",
      "partner_program": "American AAdvantage",
      "route": "US → Tokyo (NRT/HND), JAL metal",
      "point_cost_one_way": 60000,
      "cash_equiv_usd_low": 4000,
      "cash_equiv_usd_high": 8000,
      "surcharges_usd": 6,
      "conditions": "Citi is the only major transferable currency that transfers 1:1 to AAdvantage. Find Saver space on AA.com; AA charges no award change/cancel fees.",
      "source": "https://thepointsguy.com/loyalty-programs/redeeming-citi-thankyou-points-maximum-value/"
    },
    {
      "description": "ANA Business US → Tokyo via Virgin Atlantic Flying Club",
      "value_estimate_usd": "~5-7cpp",
      "partner_program": "Virgin Atlantic Flying Club",
      "route": "US West Coast → Tokyo (52.5k) / US East Coast → Tokyo (60k)",
      "point_cost_one_way": 52500,
      "cash_equiv_usd_low": 3500,
      "cash_equiv_usd_high": 7000,
      "surcharges_usd": 360,
      "conditions": "Search ANA Saver space on United.com. Must call Virgin Atlantic at 800-365-9500 to book. Direct flights only — segments price separately. $100 fee to change/cancel.",
      "source": "https://travelfreely.com/citi-thankyou-points-sweet-spots/"
    },
    {
      "description": "Lufthansa First Class US → Europe via Avianca LifeMiles (no fuel surcharges)",
      "value_estimate_usd": "~6-10cpp",
      "partner_program": "Avianca LifeMiles",
      "route": "US → Europe, Lufthansa First",
      "point_cost_one_way": 87000,
      "cash_equiv_usd_low": 5000,
      "cash_equiv_usd_high": 12000,
      "surcharges_usd": 0,
      "conditions": "Avianca never charges carrier-imposed fuel surcharges — saves ~$1,000 vs other partners. Lufthansa First availability typically opens 14 days out.",
      "source": "https://thriftytraveler.com/citi-thankyou-points-sweet-spots/"
    },
    {
      "description": "United domestic flights for 7,500-10,000 miles via Turkish Miles & Smiles",
      "value_estimate_usd": "~3-6cpp",
      "partner_program": "Turkish Miles & Smiles",
      "route": "Any United domestic, economy",
      "point_cost_one_way": 7500,
      "cash_equiv_usd_low": 200,
      "cash_equiv_usd_high": 800,
      "surcharges_usd": 6,
      "conditions": "Verify United Saver space on united.com or aircanada.com first. Turkish website is quirky; mobile app and phone often more reliable. ~$5.60 in fees on United metal.",
      "source": "https://thepointsguy.com/loyalty-programs/redeeming-citi-thankyou-points-maximum-value/"
    },
    {
      "description": "United mainland → Hawaii roundtrip via Turkish Miles & Smiles",
      "value_estimate_usd": "~2-3cpp",
      "partner_program": "Turkish Miles & Smiles",
      "route": "Mainland US → Hawaii roundtrip on United metal",
      "point_cost_one_way": 25000,
      "cash_equiv_usd_low": 400,
      "cash_equiv_usd_high": 1200,
      "surcharges_usd": 30,
      "conditions": "50,000 miles roundtrip on United metal. The previous 15,000-mile sweet spot is gone but 50k RT remains strong vs cash.",
      "source": "https://thriftytraveler.com/citi-thankyou-points-sweet-spots/"
    },
    {
      "description": "AA Business to Europe / Asia via Etihad Guest backdoor",
      "value_estimate_usd": "~5-8cpp",
      "partner_program": "Etihad Guest",
      "route": "US → Europe or Asia 1, AA Metal only",
      "point_cost_one_way": 50000,
      "cash_equiv_usd_low": 3500,
      "cash_equiv_usd_high": 7000,
      "surcharges_usd": 100,
      "conditions": "Etihad's award chart prices AA-operated flights at 50k biz / 62.5k first to Europe or Asia 1 — significantly cheaper than via AAdvantage. AA Metal only; partner-operated flights excluded. Call Etihad to book partner space.",
      "source": "https://thepointsguy.com/news/etihad-guest-american-airlines-sweet-spots/"
    },
    {
      "description": "Royal Air Maroc Business US → Casablanca via Etihad Guest",
      "value_estimate_usd": "~4-6cpp",
      "partner_program": "Etihad Guest",
      "route": "JFK / IAD / MIA → Casablanca (CMN), Royal Air Maroc",
      "point_cost_one_way": 44000,
      "cash_equiv_usd_low": 2500,
      "cash_equiv_usd_high": 4500,
      "surcharges_usd": 150,
      "conditions": "Etihad's distance-based chart: 22k economy / 44k biz nonstop. Eligible from JFK, IAD, MIA. Confirm award space on royalairmaroc.com first.",
      "source": "https://thriftytraveler.com/citi-thankyou-points-sweet-spots/"
    },
    {
      "description": "JetBlue Mint to Europe for ~$10 in taxes via Qatar Avios",
      "value_estimate_usd": "~3-5cpp",
      "partner_program": "Qatar Privilege Club Avios",
      "route": "US → Europe, JetBlue Mint biz",
      "point_cost_one_way": 78000,
      "cash_equiv_usd_low": 2500,
      "cash_equiv_usd_high": 5000,
      "surcharges_usd": 10,
      "conditions": "Transfer Citi → Qatar Avios 1:1, then book JetBlue Mint biz to Europe. Notably low taxes (~$10).",
      "source": "https://thepointsguy.com/loyalty-programs/redeeming-citi-thankyou-points-maximum-value/"
    },
    {
      "description": "Vacasa vacation rentals at 15k Wyndham points/bedroom/night",
      "value_estimate_usd": "~2-4cpp",
      "partner_program": "Wyndham Rewards",
      "route": "Vacasa-managed vacation homes (US-heavy)",
      "point_cost_one_way": 15000,
      "cash_equiv_usd_low": 200,
      "cash_equiv_usd_high": 600,
      "surcharges_usd": 0,
      "conditions": "Wyndham prices Vacasa rentals at 15k points per bedroom per night. Bookings often skip cleaning + resort fees that apply to cash stays. Transfer 1:1 with premium card; ~24 hour transfer time.",
      "source": "https://travelfreely.com/citi-thankyou-points-sweet-spots/"
    },
    {
      "description": "Choice Privileges 1:2 transfer (DEVALUES April 19, 2026 to 1:1.5)",
      "value_estimate_usd": "~2-3cpp",
      "partner_program": "Choice Privileges",
      "route": "International stays (Scandinavia, Japan), Ascend Collection",
      "point_cost_one_way": null,
      "cash_equiv_usd_low": null,
      "cash_equiv_usd_high": null,
      "surcharges_usd": 0,
      "conditions": "Through April 18, 2026, Citi → Choice transfers at 1:2 (premium card). After April 19, 2026 the ratio drops to 1:1.5 — a 25% devaluation. Transfer before the deadline if you have a planned booking.",
      "source": "https://awardwallet.com/news/citi-thankyou-rewards/citi-transfer-devaluation-choice-preferred-hotels/"
    }
  ],
  "sources": ["https://www.citi.com/credit-cards/thank-you-rewards"]
}
```

## issuer_rules.json entry (Citi)

```json
{
  "issuer": "Citi",
  "rules": [
    {
      "id": "citi_8_65",
      "name": "8 cards in 65 days",
      "description": "Citi limits applicants to 8 card approvals across all Citi products in any 65-day rolling window.",
      "applies_to": "all_citi_cards",
      "official": false
    },
    {
      "id": "citi_2_65",
      "name": "2 cards in 65 days (per cardholder)",
      "description": "Stricter rule informally enforced for new accounts: 2 personal cards in 65 days max.",
      "applies_to": "citi_personal",
      "official": false
    },
    {
      "id": "citi_1_8",
      "name": "1 card per 8 days",
      "description": "No two Citi applications submitted within 8 days of each other.",
      "applies_to": "all_citi_cards",
      "official": false
    },
    {
      "id": "citi_thankyou_24_month",
      "name": "ThankYou family 24-month rule",
      "description": "Cannot earn SUB on a TY-earning card if received SUB on the same product or a sister product (Premier/Strata Premier) in the last 24 months.",
      "applies_to": "citi_thankyou_cards",
      "official": true
    },
    {
      "id": "citi_24_month_aa",
      "name": "AA card 48-month rule",
      "description": "Citi AA cards: cannot earn SUB if received bonus on the same AA card in the last 48 months.",
      "applies_to": "citi_aa_cards",
      "official": true
    }
  ]
}
```

## perks_dedup.json entries
None unique.

## destination_perks.json entries

```json
{
  "us_domestic_with_aa": {
    "airline_routes_strong": ["American Airlines"],
    "relevant_cards": ["citi_strata_premier (TY transfer to AA)"],
    "notes": "TY is one of two transferable currencies that transfer to AA (the other is Bilt). Useful for AA Web Specials and off-peak."
  }
}
```

## RESEARCH_NOTES.md entries

- **Citi Strata** (sister card, lower tier) — file separately.
- **Premier rebranded as Strata Premier in 2024.** Old Premier no longer accepts new applicants.
- **AA transfer access**: Major differentiator vs Chase UR and Amex MR.
