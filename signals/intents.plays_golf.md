# intents.plays_golf

User plays golf with enough regularity that tee-time access, golf concierge, and PGA TOUR experience benefits matter. Activates Mastercard Golf, TPC Network access, and similar lifestyle-tier perks.

## signals.json entry

```json
{
  "id": "intents.plays_golf",
  "type": "intent",
  "decay": "annual",
  "label": "Plays golf",
  "prompt": "Do you play golf?",
  "implies": [
    "Mastercard Golf concierge and TPC tee-time access have real value",
    "Premium-tier cards with golf benefits gain priority over generic World Elite peers"
  ],
  "evidence_strength": "medium",
  "source_card_examples": ["citi_strata_premier", "amex_platinum"]
}
```

## Notes

Triggered by Got-it / Done-this on Mastercard Golf and PGA TOUR experience plays. Decay annual — habits are stable, but partner programs change yearly.
