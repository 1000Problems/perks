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

  "card_intro": {
    "positioning": "Citi's $95 mid-tier travel card with broad 3x earn across the categories most people actually spend on — groceries, gas, dining, air, and hotel.",
    "differentiator": "One of two transferable currencies in America that transfer 1:1 to American AAdvantage.",
    "ecosystem_role": "The card that unlocks transfer-partner access for Citi's no-AF cards. Pool Double Cash and Custom Cash points here to turn cashback into transferable miles."
  },

  "feeder_pair": {
    "feeder_card_ids": ["citi_double_cash", "citi_custom_cash"],
    "pair_role": "currency_pooler",
    "value_when_held": "Pooling Double Cash and Custom Cash points into your Strata Premier converts 2% / 5% cashback into 1:1 transferable points — about a 30% value boost on every dollar.",
    "value_when_missing": "Add Citi Double Cash or Custom Cash next. Their cashback pools into this card and converts to transferable miles — about a 30% boost on every dollar.",
    "recommendation_priority": "first"
  },

  "value_thesis": {
    "headline": "Why this card earns its keep",
    "net_af_line": "$95 annual fee minus the $100 hotel credit = effectively pays for itself.",
    "structural_edge": "One of two cards in America that transfers points 1:1 to American AAdvantage — 60,000 points clears a JAL business class seat that retails for $4,000+.",
    "ecosystem_line": {
      "text": "Holding a Citi 2% or 5% cashback card alongside this one converts that cashback into 1:1 transferable points — about a 30% value boost on every dollar.",
      "show_if_holds_any": ["citi_double_cash", "citi_custom_cash"]
    }
  },

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

## card_plays

```json
[
  {"id":"hyatt_park_tokyo","group":"hotels","headline":"Sleep at Park Hyatt Tokyo for ~$700/night cheaper","personalization_template":"{when_trip:japan|Heading to Japan {trip:japan} — }30k–40k UR pts at the Park Hyatt covers nights normally costing $700+.","value_model":{"kind":"transfer_redemption","partner_program":"World of Hyatt","points_one_way":35000,"cash_equiv_usd_low":600,"cash_equiv_usd_high":900,"destination_signal":"destination_japan","surcharges_usd":0},"question":"have_done_this","prerequisites":{"profile_signals":["destination_japan"],"cards_held_any_of":[],"cards_held_all_of":[]},"action_label":"Find dates","mechanism_md":"Citi → World of Hyatt 1:1. Park Hyatt Tokyo prices at Hyatt Cat 7 (35k–45k pts/night). Pool TY points to Strata Premier first to get the 1:1 ratio.","how_to_md":"1. Find available dates on hyatt.com.\n2. Transfer Citi → Hyatt 1:1.\n3. Book on hyatt.com.","source_urls":["https://thepointsguy.com/loyalty-programs/redeeming-citi-thankyou-points-maximum-value/"],"reveals_signals":["transfers.to_hyatt","intents.aspires_japan","intents.aspires_premium_hotel"],"requires_signals":[]},
  {"id":"vacasa_wyndham","group":"hotels","headline":"$300+ vacation rentals for 15k Wyndham points/night","personalization_template":"Cheapest US vacation-rental redemption around. Skip Vacasa's cleaning fees too.","value_model":{"kind":"transfer_redemption","partner_program":"Wyndham Rewards","points_one_way":15000,"cash_equiv_usd_low":200,"cash_equiv_usd_high":600,"destination_signal":null,"surcharges_usd":0},"question":"have_done_this","prerequisites":{"profile_signals":[],"cards_held_any_of":[],"cards_held_all_of":[]},"action_label":"Browse Vacasa","mechanism_md":"Wyndham prices Vacasa rentals at 15k pts/bedroom/night. Bookings often skip cleaning + resort fees that apply to cash stays.","how_to_md":"1. Search Vacasa availability at wyndhamrewards.com.\n2. Transfer Citi → Wyndham 1:1 (~24h).\n3. May require a phone call to complete.","source_urls":["https://travelfreely.com/citi-thankyou-points-sweet-spots/"],"reveals_signals":[],"requires_signals":[]},
  {"id":"hotel_credit_100","group":"credits","headline":"$100 free hotel — burn it before Dec 31","personalization_template":"Once a calendar year on a $500+ stay via CitiTravel.com.","value_model":{"kind":"fixed_credit","value_usd":100,"period":"calendar_year","requires_signal_id":"hotel_credit"},"question":"claimed_this_year","prerequisites":{"profile_signals":[],"cards_held_any_of":[],"cards_held_all_of":[]},"action_label":"Find a $500 hotel","mechanism_md":"Citi knocks $100 off any single $500+ hotel stay (excl. taxes/fees) booked through CitiTravel.com. Applied instantly at booking. Primary cardholder only — AUs share.","how_to_md":"1. Search hotels at CitiTravel.com.\n2. Filter base rate ≥ $500.\n3. Pay with the Strata Premier — $100 deducts at checkout.","source_urls":["https://www.citi.com/credit-cards/citi-strata-premier-credit-card"],"reveals_signals":["claims.hotel_credit.portal"],"requires_signals":["claims.hotel_credit.portal"]},
  {"id":"luxury_hotels_breakfast","group":"hotels","headline":"Free breakfast + $100 amenity at 4,000 luxury hotels","personalization_template":"Mastercard Luxury Hotels & Resorts portal — comp breakfast + on-property credit per stay.","value_model":{"kind":"fixed_credit","value_usd":250,"period":"per_stay","requires_signal_id":"luxury_hotel_traveler"},"question":"claimed_this_year","prerequisites":{"profile_signals":["luxury_hotel_traveler"],"cards_held_any_of":[],"cards_held_all_of":[]},"action_label":"Browse properties","mechanism_md":"Booking through mastercard.com/luxuryhotels grants complimentary breakfast for two, room upgrade subject to availability, and a $100 amenity per stay across 4,000+ properties.","how_to_md":"1. Sign in at mastercard.com/luxuryhotels with your Strata Premier.\n2. Book a participating property.\n3. Perks honored at check-in.","reveals_signals":["intents.aspires_premium_hotel"],"requires_signals":["intents.aspires_premium_hotel"]},
  {"id":"jal_biz_tokyo","group":"airlines","headline":"Fly JAL Business to Tokyo for 60k pts (saves $4-8k)","personalization_template":"Citi → AAdvantage 1:1 unlocks JAL biz at 60k miles one-way. Cash equivalent runs $4,000–$8,000.","value_model":{"kind":"transfer_redemption","partner_program":"American AAdvantage","points_one_way":60000,"cash_equiv_usd_low":4000,"cash_equiv_usd_high":8000,"destination_signal":"destination_japan","surcharges_usd":6},"question":"have_done_this","prerequisites":{"profile_signals":["destination_japan"],"cards_held_any_of":[],"cards_held_all_of":[]},"action_label":"Find a seat","mechanism_md":"Citi is the only major transferable currency that transfers 1:1 to AAdvantage. JAL biz to Tokyo at 60k miles is one of the most accessible long-haul biz redemptions in the market.","how_to_md":"1. Find Saver award space on AA.com.\n2. Transfer Citi → AAdvantage 1:1 (instant or near-instant).\n3. Book on AA.com or by phone.","conditions_md":"AA charges no award change/cancel fees. Pool TY into Strata Premier for full 1:1 ratio.","source_urls":["https://thepointsguy.com/loyalty-programs/redeeming-citi-thankyou-points-maximum-value/"],"reveals_signals":["transfers.to_aadvantage","intents.aspires_japan"],"requires_signals":[]},
  {"id":"ana_biz_virgin","group":"airlines","headline":"ANA Business to Tokyo, 52.5k from West Coast","personalization_template":"Virgin Atlantic Flying Club prices ANA biz US-Tokyo at 52.5k West / 60k East one-way. Surcharges run ~$360 westbound, ~$450 eastbound.","value_model":{"kind":"transfer_redemption","partner_program":"Virgin Atlantic Flying Club","points_one_way":52500,"cash_equiv_usd_low":3500,"cash_equiv_usd_high":7000,"destination_signal":"destination_japan","surcharges_usd":360},"question":"have_done_this","prerequisites":{"profile_signals":["destination_japan"],"cards_held_any_of":[],"cards_held_all_of":[]},"action_label":"Search ANA space","mechanism_md":"Search ANA Saver space on United.com (no login). Transfer Citi → Virgin Atlantic 1:1 (instant). Must call Virgin Atlantic at 800-365-9500 to book — cannot self-serve online.","how_to_md":"1. Find ANA Saver space on united.com.\n2. Transfer Citi → Virgin Atlantic 1:1.\n3. Call 800-365-9500.","conditions_md":"Direct flights only — segments price separately. $100 fee to change/cancel.","source_urls":["https://travelfreely.com/citi-thankyou-points-sweet-spots/"],"reveals_signals":["transfers.to_virgin_atlantic","intents.aspires_japan"],"requires_signals":[]},
  {"id":"lh_first_avianca","group":"airlines","headline":"Lufthansa First to Europe — no fuel surcharges","personalization_template":"Avianca LifeMiles never passes fuel surcharges through. Lufthansa First at 87k miles one-way saves ~$1,000 vs other partners.","value_model":{"kind":"transfer_redemption","partner_program":"Avianca LifeMiles","points_one_way":87000,"cash_equiv_usd_low":5000,"cash_equiv_usd_high":12000,"destination_signal":"destination_europe","surcharges_usd":0},"question":"have_done_this","prerequisites":{"profile_signals":["destination_europe"],"cards_held_any_of":[],"cards_held_all_of":[]},"action_label":"Find a seat","mechanism_md":"Lufthansa First availability typically opens 14 days out.","how_to_md":"1. Find Lufthansa First availability close to departure.\n2. Transfer Citi → Avianca LifeMiles 1:1.\n3. Book on lifemiles.com or by phone.","source_urls":["https://thriftytraveler.com/citi-thankyou-points-sweet-spots/"],"reveals_signals":["transfers.to_avianca_lifemiles","intents.aspires_europe_business"],"requires_signals":[]},
  {"id":"united_domestic_turkish","group":"airlines","headline":"Any United domestic flight for 7,500 miles","personalization_template":"Turkish Miles & Smiles charges 7.5k–10k miles for any United domestic. No fuel surcharges. ~$5.60 in fees.","value_model":{"kind":"transfer_redemption","partner_program":"Turkish Miles & Smiles","points_one_way":7500,"cash_equiv_usd_low":200,"cash_equiv_usd_high":800,"destination_signal":"destination_us_domestic","surcharges_usd":6},"question":"have_done_this","prerequisites":{"profile_signals":[],"cards_held_any_of":[],"cards_held_all_of":[]},"action_label":"Find availability","mechanism_md":"Turkish website is quirky; mobile app and phone are often more reliable. Verify Saver space on united.com or aircanada.com first.","how_to_md":"1. Confirm Saver space on united.com.\n2. Transfer Citi → Turkish 1:1.\n3. Book in the Turkish app or by phone.","source_urls":["https://thepointsguy.com/loyalty-programs/redeeming-citi-thankyou-points-maximum-value/"],"reveals_signals":["transfers.to_united_via_smiles"],"requires_signals":[]},
  {"id":"etihad_backdoor","group":"airlines","headline":"AA Business Europe/Asia for 50k miles (Etihad backdoor)","personalization_template":"Etihad's chart prices AA-operated flights at 50k biz / 62.5k first to Europe or Asia 1.","value_model":{"kind":"transfer_redemption","partner_program":"Etihad Guest","points_one_way":50000,"cash_equiv_usd_low":3500,"cash_equiv_usd_high":7000,"destination_signal":"destination_europe","surcharges_usd":100},"question":"have_done_this","prerequisites":{"profile_signals":[],"cards_held_any_of":[],"cards_held_all_of":[]},"action_label":"Plan it","mechanism_md":"AA Metal only — partner-operated flights excluded. Must find Saver space on AA's own site first; call Etihad to book partner award.","how_to_md":"1. Find AA Saver space on AA.com.\n2. Transfer Citi → Etihad Guest 1:1.\n3. Call Etihad to book the partner award.","conditions_md":"AA Metal only. No-AF Citi cards drop ratio to 1:0.7 — pool to Strata Premier first.","source_urls":["https://thepointsguy.com/news/etihad-guest-american-airlines-sweet-spots/"],"reveals_signals":["intents.aspires_europe_business"],"requires_signals":[]},
  {"id":"royal_air_maroc","group":"airlines","headline":"Casablanca in business for 44k miles (Etihad)","personalization_template":"Etihad's distance chart: 22k economy / 44k biz JFK/IAD/MIA → CMN nonstop on Royal Air Maroc.","value_model":{"kind":"transfer_redemption","partner_program":"Etihad Guest","points_one_way":44000,"cash_equiv_usd_low":2500,"cash_equiv_usd_high":4500,"destination_signal":"destination_morocco","surcharges_usd":150},"question":"have_done_this","prerequisites":{"profile_signals":["destination_morocco"],"cards_held_any_of":[],"cards_held_all_of":[]},"action_label":"Find dates","mechanism_md":"Confirm award space on royalairmaroc.com. Eligible from JFK, IAD, MIA.","how_to_md":"1. Confirm space on royalairmaroc.com.\n2. Transfer Citi → Etihad 1:1.\n3. Book via Etihad website or phone.","source_urls":["https://thriftytraveler.com/citi-thankyou-points-sweet-spots/"],"reveals_signals":[],"requires_signals":[]},
  {"id":"jetblue_mint_qatar","group":"airlines","headline":"JetBlue Mint to Europe for $10 in taxes","personalization_template":"Citi → Qatar Avios 1:1, then book JetBlue Mint biz to Europe at 78k Avios with ~$10 in taxes/fees.","value_model":{"kind":"transfer_redemption","partner_program":"Qatar Privilege Club","points_one_way":78000,"cash_equiv_usd_low":2500,"cash_equiv_usd_high":5000,"destination_signal":"destination_europe","surcharges_usd":10},"question":"have_done_this","prerequisites":{"profile_signals":["destination_europe"],"cards_held_any_of":[],"cards_held_all_of":[]},"action_label":"Plan it","mechanism_md":"Find JetBlue Mint Europe availability on jetblue.com. Transfer Citi → Qatar Avios. Book through Qatar.","how_to_md":"1. Find JetBlue Mint Europe availability.\n2. Transfer Citi → Qatar 1:1.\n3. Book on qatarairways.com.","source_urls":["https://thepointsguy.com/loyalty-programs/redeeming-citi-thankyou-points-maximum-value/"],"reveals_signals":["intents.aspires_europe_business"],"requires_signals":[]},
  {"id":"trip_delay","group":"travel_services","headline":"Get $500 back when your flight delays 6+ hours","personalization_template":"Up to $500 per covered trip on Strata Premier when you're stuck 6+ hours. Two claims a year max.","value_model":{"kind":"protection_coverage","max_value_usd":500,"period":"per_trip","trigger_question":"Had a flight delayed 6+ hours this year?"},"question":"have_filed_claim","prerequisites":{"profile_signals":[],"cards_held_any_of":[],"cards_held_all_of":[]},"action_label":"File a claim","mechanism_md":"Coverage applies when a covered trip (paid in part with the Strata Premier) is delayed 6+ hours. Up to $500 for meals, lodging, and incidentals. Max 2 claims per 12-month period. Underwritten by Mastercard.","how_to_md":"1. Save receipts during the delay.\n2. File at cardbenefitservices.com within 60 days.","source_urls":["https://www.citi.com/credit-cards/citi-strata-premier-credit-card"],"reveals_signals":[],"requires_signals":[]},
  {"id":"trip_cancel","group":"travel_services","headline":"Reimburse a canceled trip up to $5,000","personalization_template":"Up to $5k per trip / $10k per cardholder per year for nonrefundable trip costs lost to a covered cancellation.","value_model":{"kind":"protection_coverage","max_value_usd":5000,"period":"per_trip","trigger_question":"Had a trip canceled or cut short this year?"},"question":"have_filed_claim","prerequisites":{"profile_signals":[],"cards_held_any_of":[],"cards_held_all_of":[]},"action_label":"File a claim","mechanism_md":"Reimburses prepaid, nonrefundable trip costs if a covered trip is cut short or canceled for a covered reason (illness, severe weather, jury duty, etc.).","how_to_md":"1. Document the cancellation reason.\n2. Submit claim via Mastercard within 20 days of the event.","reveals_signals":[],"requires_signals":[]},
  {"id":"rental_cdw","group":"travel_services","headline":"Free rental car CDW abroad — primary coverage","personalization_template":"Decline the rental company's CDW. Charge the rental to your Strata Premier. You're covered as primary outside the US, secondary inside.","value_model":{"kind":"protection_coverage","max_value_usd":50000,"period":"per_claim","trigger_question":"Renting a car?"},"question":"set_up","prerequisites":{"profile_signals":[],"cards_held_any_of":[],"cards_held_all_of":[]},"action_label":"Save the steps","mechanism_md":"MasterRental coverage. Decline the rental company's CDW/LDW; charge the rental to your Strata Premier; covered for theft and collision damage.","how_to_md":"1. Reserve and pay with the Strata Premier in the renter's name.\n2. Decline the rental company's CDW/LDW.\n3. File any claim within 45 days.","reveals_signals":[],"requires_signals":[]},
  {"id":"fx_zero","group":"travel_services","headline":"Spend abroad fee-free","personalization_template":"No foreign transaction fees on the Strata Premier — saves ~3% vs cards that charge them.","value_model":{"kind":"system_mechanic","note":"0% FX fee — passive."},"question":"set_up","prerequisites":{"profile_signals":[],"cards_held_any_of":[],"cards_held_all_of":[]},"mechanism_md":"Strata Premier charges no FX fees. Other Citi no-AF cards (Double Cash, Custom Cash) charge 3% — use Strata Premier abroad to avoid the fee.","how_to_md":"Use the Strata Premier for any foreign-merchant purchase.","reveals_signals":[],"requires_signals":[]},
  {"id":"ext_warranty","group":"shopping","headline":"Add 24 months to any warranty under 5 years","personalization_template":"Industry-leading: doubles manufacturer warranties of 5 years or less, up to $10k per item.","value_model":{"kind":"protection_coverage","max_value_usd":10000,"period":"per_claim","trigger_question":"Buying electronics or appliances?"},"question":"set_up","prerequisites":{"profile_signals":[],"cards_held_any_of":[],"cards_held_all_of":[]},"action_label":"How to claim","mechanism_md":"Adds 24 months to manufacturer warranties of 5 years or less, up to $10k per item.","how_to_md":"1. Save the receipt + warranty terms.\n2. File via Mastercard once the original warranty ends and an issue arises.","reveals_signals":["behaviors.uses_extended_warranty"],"requires_signals":[]},
  {"id":"purchase_protection","group":"shopping","headline":"$10,000 stolen-item coverage on every purchase","personalization_template":"Up to $10k per claim, $50k per cardholder per year. Covers damage or theft within 90 days.","value_model":{"kind":"protection_coverage","max_value_usd":10000,"period":"per_claim","trigger_question":"Had something break or get stolen recently?"},"question":"have_filed_claim","prerequisites":{"profile_signals":[],"cards_held_any_of":[],"cards_held_all_of":[]},"action_label":"File a claim","mechanism_md":"Covers damage or theft of items charged to the Strata Premier within 90 days of purchase.","how_to_md":"1. Keep your receipt + original packaging if possible.\n2. File via Mastercard within the 90-day window.","reveals_signals":["behaviors.uses_purchase_protection"],"requires_signals":[]},
  {"id":"instacart_plus","group":"credits","headline":"Instacart+ free for 2 months + $10/mo off","personalization_template":"2 months free Instacart+ plus $10 off your second order each month (~$30 value).","value_model":{"kind":"fixed_credit","value_usd":30,"period":"calendar_year","requires_signal_id":"instacart_user"},"question":"set_up","prerequisites":{"profile_signals":[],"cards_held_any_of":[],"cards_held_all_of":[]},"action_label":"Activate","mechanism_md":"Enroll your Strata Premier at instacart.com/citi.","how_to_md":"1. Sign in at instacart.com/citi.\n2. Activate the offer with your Strata Premier.","reveals_signals":[],"requires_signals":[]},
  {"id":"dashpass_trial","group":"credits","headline":"DashPass free for 3 months","personalization_template":"Complimentary 3-month DoorDash DashPass membership.","value_model":{"kind":"fixed_credit","value_usd":30,"period":"calendar_year","requires_signal_id":"doordash_user"},"question":"set_up","prerequisites":{"profile_signals":[],"cards_held_any_of":[],"cards_held_all_of":[]},"action_label":"Activate","mechanism_md":"Enroll your Strata Premier on DoorDash for the trial.","how_to_md":"Activate via the DoorDash app's payment settings.","reveals_signals":[],"requires_signals":[]},
  {"id":"lyft_monthly_credit","group":"credits","headline":"$5 a month on Lyft — $60/yr if you ride","personalization_template":"After 3+ Lyft rides in a month, the 4th and beyond stack a $5 credit. Up to $60/yr.","value_model":{"kind":"fixed_credit","value_usd":60,"period":"calendar_year","requires_signal_id":"rideshare_user"},"question":"set_up","prerequisites":{"profile_signals":[],"cards_held_any_of":[],"cards_held_all_of":[]},"action_label":"Enroll","mechanism_md":"Enrollment required at mastercard.com/lyft. Once enrolled, take 3+ Lyft rides in a month and any further ride that month earns a $5 statement credit.","how_to_md":"1. Visit mastercard.com/lyft.\n2. Enroll your Strata Premier.\n3. Use it for Lyft rides as you would normally.","reveals_signals":[],"requires_signals":[]},
  {"id":"earn_dining_3x","group":"cash","headline":"Stack 3x on every restaurant bill","personalization_template":"You spend ~{spend.dining}/yr on dining → about {value.dining_3x} in TY value.","value_model":{"kind":"multiplier_on_category","spend_category":"dining","pts_per_dollar":3},"question":"spending_here","prerequisites":{"profile_signals":[],"cards_held_any_of":[],"cards_held_all_of":[]},"action_label":"Set as default","mechanism_md":"Restaurants — dine-in, takeout, delivery — all earn 3x TY pts. Uncapped.","how_to_md":"Pay every meal with the Strata Premier.","reveals_signals":[],"requires_signals":[]},
  {"id":"earn_supermarkets_3x","group":"cash","headline":"3x on groceries — uncapped, no other major card matches","personalization_template":"You spend ~{spend.groceries}/yr at supermarkets → ~{value.groceries_3x} in TY value.","value_model":{"kind":"multiplier_on_category","spend_category":"groceries","pts_per_dollar":3},"question":"spending_here","prerequisites":{"profile_signals":[],"cards_held_any_of":[],"cards_held_all_of":[]},"action_label":"Set as default","mechanism_md":"Most competitors cap grocery bonus spend at $6,000/yr. Strata Premier doesn't. Costco doesn't code as supermarket.","how_to_md":"Use the Strata Premier at any supermarket. Use a different card at Costco.","reveals_signals":[],"requires_signals":[]},
  {"id":"earn_gas_ev_3x","group":"cash","headline":"3x at the pump (and the EV charger)","personalization_template":"Both traditional fuel and EV charging stations earn 3x TY pts.","value_model":{"kind":"multiplier_on_category","spend_category":"gas","pts_per_dollar":3},"question":"spending_here","prerequisites":{"profile_signals":[],"cards_held_any_of":[],"cards_held_all_of":[]},"action_label":"Set as default","mechanism_md":"Gas + EV charging both at 3x. Uncapped.","how_to_md":"Pay at the pump or charger with the Strata Premier.","reveals_signals":[],"requires_signals":[]},
  {"id":"earn_air_hotels_3x","group":"cash","headline":"3x on flights and hotels booked direct","personalization_template":"Air travel + hotels booked direct or through any travel agency earn 3x.","value_model":{"kind":"multiplier_on_category","spend_category":"airfare","pts_per_dollar":3},"question":"spending_here","prerequisites":{"profile_signals":[],"cards_held_any_of":[],"cards_held_all_of":[]},"mechanism_md":"Includes booking through any travel agency. CitiTravel.com bookings earn 10x (separate row).","how_to_md":"Book direct or through a travel agency with the Strata Premier.","reveals_signals":[],"requires_signals":[]},
  {"id":"earn_citi_travel_10x","group":"cash","headline":"10x on hotels via CitiTravel.com — top rate on the card","personalization_template":"Hotels, cars, and attractions through CitiTravel.com earn 10x. Stack with the $100 hotel credit on $500+ stays.","value_model":{"kind":"multiplier_on_category","spend_category":"hotels","pts_per_dollar":10},"question":"spending_here","prerequisites":{"profile_signals":[],"cards_held_any_of":[],"cards_held_all_of":[]},"action_label":"Set as default","mechanism_md":"10x on hotels, rental cars, and attractions through CitiTravel.com. Stack with the $100 hotel credit when stay is $500+.","how_to_md":"Search at CitiTravel.com. Compare to direct rates first — Citi prices can occasionally be higher.","reveals_signals":[],"requires_signals":[]},
  {"id":"trifecta_pool","group":"cash","headline":"Pool no-AF Citi points to your Premier — 30%+ value boost","personalization_template":"Pooling Double Cash and Custom Cash points into your Strata Premier converts cash points into 1:1 transferable points (vs 1:0.7 unpooled).","value_model":{"kind":"system_mechanic","note":"Pooling is a one-time setup at thankyou.com."},"question":"set_up","prerequisites":{"profile_signals":[],"cards_held_any_of":["citi_double_cash","citi_custom_cash"],"cards_held_all_of":[]},"action_label":"Set up pooling","mechanism_md":"Sign in at thankyou.com → Account Management → Combine Points. Move points from Double Cash / Custom Cash into the Strata Premier account. One-time setup. Note: closing a Citi card erases its earned points 60 days later, even if pooled — combine before any close.","how_to_md":"1. Sign in at thankyou.com.\n2. Go to Account Management → Combine Points.\n3. Move points from no-AF cards into Strata Premier.","reveals_signals":["holdings.thank_you_feeder"],"requires_signals":["holdings.thank_you_feeder"]},
  {"id":"ty_sharing_window","group":"niche","headline":"Share 100k pts to family — gone forever May 17, 2026","personalization_template":"Until May 16, 2026, you can move 100,000 TY points/year to another Citi member free. After May 17 it's gone permanently.","value_model":{"kind":"niche_play","estimated_annual_value_usd":1000,"risk_tier":"green"},"question":"have_done_this","prerequisites":{"profile_signals":[],"cards_held_any_of":[],"cards_held_all_of":[]},"action_label":"Plan a transfer","mechanism_md":"Citi is ending the points-sharing feature on May 17, 2026. Until then you can share up to 100k pts/year to any other ThankYou member. Shared points expire 90 days after transfer — only share if recipient has an immediate booking.","how_to_md":"1. Sign in at thankyou.com → Manage → Share Points.\n2. Enter the recipient's TY account number and the amount.\n3. Recipient must redeem within 90 days.","expires_at":"2026-05-17","source_urls":["https://frequentmiler.com/citi-thankyou-points-about-to-end-points-sharing-between-cardholders/"],"reveals_signals":[],"requires_signals":[]},
  {"id":"retention_call","group":"niche","headline":"Call retention 30 days before fee — typical $50–100 offer","personalization_template":"Cardholders frequently report success calling Citi near anniversary asking for a fee waiver or spend-based bonus.","value_model":{"kind":"niche_play","estimated_annual_value_usd":75,"risk_tier":"green"},"question":"set_up","prerequisites":{"profile_signals":[],"cards_held_any_of":[],"cards_held_all_of":[]},"action_label":"Save reminder","mechanism_md":"Best calling window is 30–60 days before the AF posts. Mention you're considering closing.","how_to_md":"1. Call the number on the back of the card.\n2. Ask to be transferred to retention or customer loyalty.\n3. Mention you're considering closing the card and ask what they can do.","reveals_signals":[],"requires_signals":[]},
  {"id":"fed_tax_payment","group":"niche","headline":"Pay federal taxes to buy TY at 0.875¢ — only if you transfer","personalization_template":"Federal tax payment processors charge ~1.75%. Putting taxes on a 2x-card-pooled-to-Premier effectively buys TY pts at 0.875¢ each. Only profitable if you transfer at sweet-spot rates.","value_model":{"kind":"niche_play","estimated_annual_value_usd":0,"risk_tier":"yellow"},"question":"have_done_this","prerequisites":{"profile_signals":["does_estimated_taxes"],"cards_held_any_of":[],"cards_held_all_of":[]},"action_label":"Calculate ROI","mechanism_md":"Pay federal taxes via pay1040.com or similar (~1.75% fee). Bad math if you'd cash out at 1¢. Profitable only if you redeem at >1¢/pt via transfer partners.","how_to_md":"1. Confirm your sweet-spot redemption first.\n2. Pay via pay1040.com.\n3. Pool earned points to Strata Premier and transfer.","conditions_md":"Don't speculate. Only do this if you have a confirmed booking that beats 0.875¢/pt.","reveals_signals":[],"requires_signals":[]},
  {"id":"curve_fx_hack","group":"niche","headline":"Curve card hack to dodge FX fees on no-AF Citi","personalization_template":"Curve fronts your Double Cash / Custom Cash so you keep 2x/5x earnings without the 3% FX fee. Strata Premier has no FX fee on its own — only useful if you specifically want a 5x category abroad.","value_model":{"kind":"niche_play","estimated_annual_value_usd":50,"risk_tier":"yellow"},"question":"set_up","prerequisites":{"profile_signals":[],"cards_held_any_of":["citi_double_cash","citi_custom_cash"],"cards_held_all_of":[]},"mechanism_md":"Curve doesn't pass FX fees through. Loading the no-AF Citi cards into Curve means you earn 2x/5x abroad without the FX surcharge.","how_to_md":"1. Sign up for Curve.\n2. Add the Citi card as a funding card.\n3. Use Curve abroad.","conditions_md":"Curve's terms periodically change. Large FX volume can trigger account review.","reveals_signals":["holdings.thank_you_feeder"],"requires_signals":["holdings.thank_you_feeder"]}
]
```

## cold_prompts

```json
[
  {"id": "going_to_japan", "question": "Going to Japan in the next 12 months?", "answer_chips": [{"value": "yes_dates_set", "label": "Yes, dates set"}, {"value": "yes_someday", "label": "Yes, someday"}, {"value": "no", "label": "Not in 12 months"}], "unlocks_value_estimate_usd": 4500, "unlocks_groups": ["airlines", "hotels"]},
  {"id": "uses_lyft", "question": "Use Lyft regularly?", "answer_chips": [{"value": "weekly", "label": "Weekly"}, {"value": "occasionally", "label": "Occasionally"}, {"value": "no", "label": "Never"}], "unlocks_value_estimate_usd": 60, "unlocks_groups": ["travel_services", "shopping"]},
  {"id": "transferred_points_last_year", "question": "Did you transfer Citi points to an airline or hotel last year?", "answer_chips": [{"value": "yes_aa", "label": "Yes, to AA"}, {"value": "yes_other", "label": "Yes, other"}, {"value": "no", "label": "No, never"}], "unlocks_value_estimate_usd": 800, "unlocks_groups": ["airlines", "hotels", "niche"]}
]
```
