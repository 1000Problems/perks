# behaviors.uses_lounges_centurion

User actively visits Centurion Lounges. Locked to the Amex Platinum ecosystem — a strong reason to retain a Platinum-class card.

## signals.json entry

```json
{
  "id": "behaviors.uses_lounges_centurion",
  "type": "behavior",
  "decay": "never",
  "label": "Uses Amex Centurion Lounges",
  "prompt": "Do you use Amex Centurion Lounges when you fly?",
  "implies": [
    "User is brand-loyal to Amex lounge ecosystem",
    "Centurion-access plays should weight higher in Amex card recommendations"
  ],
  "evidence_strength": "strong",
  "source_card_examples": ["amex_platinum", "amex_business_platinum"]
}
```

## Notes

Triggered by Got-it on Centurion Lounge plays. Distinct from Priority Pass — Amex restricts access to Platinum-class cards only, so the signal is platform-locked.
