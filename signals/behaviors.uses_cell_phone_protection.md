# behaviors.uses_cell_phone_protection

User has filed and received a cell phone protection claim. Strong evidence the user pays their monthly phone bill on a protection-bearing card.

## signals.json entry

```json
{
  "id": "behaviors.uses_cell_phone_protection",
  "type": "behavior",
  "decay": "never",
  "label": "Has used cell phone protection",
  "prompt": "Have you filed a cell phone protection claim through a card?",
  "implies": [
    "User pays their cell phone bill with the card and trusts the protection benefit",
    "Cell-protection plays should value at the deductible-net face for this user"
  ],
  "evidence_strength": "medium",
  "source_card_examples": ["chase_sapphire_reserve", "ink_business_preferred", "wells_fargo_active_cash"]
}
```

## Notes

Triggered by Got-it on cell phone protection plays. Implies the user pays their phone bill on the card AND has actually filed and received a payout — the second part is rare.
