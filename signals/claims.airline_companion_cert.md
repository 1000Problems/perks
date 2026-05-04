# claims.airline_companion_cert

User uses an annual companion certificate (Alaska Companion Fare, Delta Companion, BA Travel Together Ticket). Implies a steady travel companion.

## signals.json entry

```json
{
  "id": "claims.airline_companion_cert",
  "type": "behavior",
  "decay": "annual",
  "label": "Uses airline companion certificates",
  "prompt": "Do you fly with a companion frequently enough to use a companion certificate?",
  "implies": [
    "User has a regular travel companion",
    "Companion-cert plays should value at the discounted cash equivalent for this user"
  ],
  "evidence_strength": "strong",
  "source_card_examples": ["alaska_visa", "delta_reserve", "british_airways_visa"]
}
```

## Notes

Triggered by Got-it on companion-cert plays (Alaska Companion Fare, Delta Companion, BA Travel Together Ticket). Strong signal because using the cert requires coordinated travel — casual cardholders let it lapse.
