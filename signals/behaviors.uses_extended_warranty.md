# behaviors.uses_extended_warranty

User has filed an extended-warranty claim. Rare three-step capture (original warranty expires, product fails, user remembers); Got-it identifies a small engaged minority.

## signals.json entry

```json
{
  "id": "behaviors.uses_extended_warranty",
  "type": "behavior",
  "decay": "never",
  "label": "Has used extended warranty",
  "prompt": "Have you filed an extended warranty claim through a card?",
  "implies": [
    "User is the type to file warranty claims",
    "Extended-warranty plays should weight slightly higher for this user"
  ],
  "evidence_strength": "weak",
  "source_card_examples": ["chase_sapphire_reserve", "amex_platinum", "amex_business_gold"]
}
```

## Notes

Triggered by Got-it on extended warranty plays. Weak evidence_strength — the perk requires the original warranty period to expire AND the product to fail AND the user to remember they have coverage.
