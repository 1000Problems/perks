# Capital One Walmart Rewards Card

`card_id`: capital_one_walmart
`data_freshness`: 2026-05-01

## cards.json entry

```json
{
  "id": "capital_one_walmart",
  "name": "Capital One Walmart Rewards Mastercard",
  "issuer": "Capital One",
  "network": "Mastercard",
  "card_type": "personal",
  "category": ["retail_cobrand"],
  "annual_fee_usd": 0,
  "annual_fee_first_year_waived": false,
  "foreign_tx_fee_pct": 0,
  "credit_score_required": "good",
  "currency_earned": "capital_one_walmart_cashback",

  "earning": [
    {"category": "walmart_com_app_grocery_pickup_delivery", "rate_pts_per_dollar": 5, "cap_usd_per_year": null},
    {"category": "walmart_in_store_via_walmart_pay", "rate_pts_per_dollar": 5, "cap_usd_per_year": null, "notes": "Y1 only via Walmart Pay; reverts to 2% in-store after Y1"},
    {"category": "restaurants_travel", "rate_pts_per_dollar": 2, "cap_usd_per_year": null},
    {"category": "everything_else", "rate_pts_per_dollar": 1, "cap_usd_per_year": null}
  ],

  "signup_bonus": {
    "amount_pts": null,
    "spend_required_usd": null,
    "spend_window_months": null,
    "estimated_value_usd": null
  },

  "annual_credits": [],

  "ongoing_perks": [],

  "transfer_partners_inherited_from": null,

  "issuer_rules": ["Capital One 1-per-month"],

  "best_for": ["Walmart_online_grocery_or_pickup_user"],
  "synergies_with": ["amex_blue_cash_preferred"],
  "competing_with_in_wallet": [],

  "breakeven_logic_notes": "No AF. 5% Walmart.com is competitive but Walmart accepts most cards, so Amex BCP grocery 6% loses on online-grocery cap. Niche card.",

  "recently_changed": false,
  "data_freshness": "2026-05-01",
  "sources": ["https://www.capitalone.com/credit-cards/walmart-rewards/"]
}
```

## programs.json entry
Closed-loop Walmart cash back. No transfer partners.

## issuer_rules.json entry
See `capital_one_venture_x.md`.

## perks_dedup.json entries
None unique.

## destination_perks.json entries
None.

## RESEARCH_NOTES.md entries
- Walmart relationship transitioned away from Synchrony to Capital One in 2019.
- Limited utility outside Walmart.
