# transfers.to_air_france_klm

User books awards via Flying Blue (monthly Promo Awards, KLM/AF metal, partner redemptions). Implies active monitoring of award charts.

## signals.json entry

```json
{
  "id": "transfers.to_air_france_klm",
  "type": "behavior",
  "decay": "never",
  "label": "Transfers points to Air France-KLM Flying Blue",
  "prompt": "Have you booked an award via Flying Blue's Promo Awards or transfer partners?",
  "implies": [
    "User is a Europe-bound flyer or Flying Blue Promo-Award hunter",
    "Flying Blue-transfer plays should weight higher for this user"
  ],
  "evidence_strength": "medium",
  "source_card_examples": ["amex_platinum", "amex_gold", "chase_sapphire_reserve", "citi_strata_premier", "bilt_mastercard"]
}
```

## Notes

Triggered by Got-it on Flying Blue transfer plays. Flying Blue Promo Awards drop monthly and discount specific routes 25-50%. Strong signal of active award-travel hobbyist.
