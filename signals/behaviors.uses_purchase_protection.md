# behaviors.uses_purchase_protection

User has filed a purchase-protection claim. Weak signal because the perk goes uncaptured by most cardholders — the people who do file represent a small, engaged minority.

## signals.json entry

```json
{
  "id": "behaviors.uses_purchase_protection",
  "type": "behavior",
  "decay": "never",
  "label": "Has used purchase protection",
  "prompt": "Have you filed a purchase protection claim (damaged or stolen item)?",
  "implies": [
    "User is the type to file claims",
    "Purchase-protection plays should weight slightly higher for this user"
  ],
  "evidence_strength": "weak",
  "source_card_examples": ["chase_sapphire_reserve", "amex_platinum", "amex_business_gold"]
}
```

## Notes

Triggered by Got-it on purchase protection plays. Weak evidence_strength because most users never file even when eligible — the perk goes uncaptured.
