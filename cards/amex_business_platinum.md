# Amex Business Platinum

`card_id`: amex_business_platinum
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "amex_business_platinum",
  "name": "American Express Business Platinum Card",
  "issuer": "Amex",
  "network": "Amex",
  "card_type": "business",
  "category": ["business", "premium_travel"],
  "annual_fee_usd": 895,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good_to_excellent",
  "currency_earned": "amex_mr",

  "earning": [
    {"category": "flights_and_prepaid_hotels_amex_travel", "rate_pts_per_dollar": 5, "cap_usd_per_year": null},
    {"category": "purchases_5000_or_more", "rate_pts_per_dollar": 1.5, "cap_usd_per_year": 2000000, "notes": "1.5x on single transactions of $5,000+, up to 1M extra points/yr"},
    {"category": "select_business_categories", "rate_pts_per_dollar": 1.5, "cap_usd_per_year": null, "notes": "1.5x at US construction-material/hardware suppliers, US electronic-goods retailers, US software/cloud, US shipping providers"},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": 150000,
    "spend_required_usd": 20000,
    "spend_window_months": 3,
    "estimated_value_usd": 3000,
    "notes": "Often tiered: 120k at $15k + 30k at additional $5k. Has hit 250k via CardMatch."
  },

  "annual_credits": [
    {"name": "Dell credit", "value_usd": 400, "type": "specific", "expiration": "split_h1_h2", "ease_of_use": "medium", "notes": "$200 H1 + $200 H2 at Dell.com"},
    {"name": "Indeed credit", "value_usd": 360, "type": "specific", "expiration": "quarterly", "ease_of_use": "hard", "notes": "$90/quarter; only useful for businesses recruiting"},
    {"name": "Adobe credit", "value_usd": 150, "type": "specific", "expiration": "annual", "ease_of_use": "hard", "notes": "Annual Adobe.com"},
    {"name": "Wireless credit (US wireless)", "value_usd": 120, "type": "specific", "expiration": "monthly", "ease_of_use": "easy", "notes": "$10/month at US wireless carriers"},
    {"name": "CLEAR+ membership", "value_usd": 209, "type": "specific", "expiration": "annual", "ease_of_use": "easy"},
    {"name": "Hilton + Marriott Bonvoy combined credit", "value_usd": 200, "type": "specific", "expiration": "annual", "ease_of_use": "medium", "notes": "Verify current structure"},
    {"name": "Global Entry / TSA PreCheck", "value_usd": 120, "type": "specific", "expiration": "every_4_years", "ease_of_use": "medium"}
  ],

  "ongoing_perks": [
    {"name": "Centurion Lounge access", "value_estimate_usd": null, "category": "lounge_access"},
    {"name": "Priority Pass Select", "value_estimate_usd": null, "category": "lounge_access"},
    {"name": "Delta Sky Club access (when flying Delta)", "value_estimate_usd": null, "category": "lounge_access"},
    {"name": "Marriott Gold + Hilton Gold", "value_estimate_usd": null, "category": "hotel_status"},
    {"name": "35% airfare points rebate via Pay With Points (cap 1M points/yr)", "value_estimate_usd": null, "category": "rewards_flexibility", "notes": "Effectively 1.54cpp on flights — best portal value across MR ecosystem"},
    {"name": "Cell phone protection", "value_estimate_usd": null, "category": "purchase_protection"},
    {"name": "Trip cancellation/interruption", "value_estimate_usd": null, "category": "travel_protection"},
    {"name": "Premium auto rental (separate enrollment)", "value_estimate_usd": null, "category": "travel_protection_optional"}
  ],

  "transfer_partners_inherited_from": "amex_mr",

  "issuer_rules": ["Amex once-per-lifetime SUB"],

  "best_for": ["high_business_travel_with_centurion_use", "Pay_With_Points_35pct_rebate_user", "1_5x_on_$5k_plus_purchases"],
  "synergies_with": ["amex_blue_business_plus", "amex_business_gold", "amex_platinum"],
  "competing_with_in_wallet": ["chase_ink_business_preferred", "capital_one_venture_x_business"],

  "breakeven_logic_notes": "AF $895. Aggressive credit user can capture: Dell $400 + Wireless $120 + CLEAR $209 + Hilton/Marriott $200 + Adobe $150 + Indeed $360 (if recruiting) = $1,439 face. Realistic capture ~$700-1,100. Justified by Centurion lounges + 35% Pay-With-Points + 1.5x on big-ticket business charges.",

  "recently_changed": true,
  "recently_changed_date": "2025-09-29",
  "data_freshness": "2026-05-01",
  "sources": [
    "https://www.americanexpress.com/us/credit-cards/business/business-credit-cards/american-express-business-platinum-card/"
  ]
}
```

## programs.json entry
See `amex_gold.md`.

## issuer_rules.json entry
See `amex_gold.md`.

## perks_dedup.json entries
See `amex_platinum.md` for centurion_lounge, priority_pass, marriott_gold, hilton_gold, clear_plus, global_entry_credit. All shared.

## destination_perks.json entries
See `amex_platinum.md` for any_with_centurion_lounge.

## RESEARCH_NOTES.md entries

- **35% Pay With Points**: Best feature. Books any flight on Amex Travel; rebates 35% of points used (cap 1M points/yr or ~285k point flights). Effectively 1.54cpp baseline portal value vs 1cpp for personal Plat.
- **Big-ticket 1.5x**: Charges $5k+ earn 1.5x. Useful for businesses that buy expensive equipment, software, or pay vendor invoices through the card. Cap of 1M extra points/yr = 666k qualifying spend ceiling for the bonus tier.
- **2025 refresh**: AF rose to $895 from $695 effective 2025-09-29 for new applicants. Existing renewals follow.
- **Coupon-book**: Same caution as Personal Plat. Engine should grade conservatively.
