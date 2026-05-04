# claims.travel_credit.airline_specific

User actively uses an airline-specific cobrand credit (United Quest $200 United credit, Delta travel credit). Implies brand loyalty to that airline.

## signals.json entry

```json
{
  "id": "claims.travel_credit.airline_specific",
  "type": "behavior",
  "decay": "annual",
  "label": "Claims airline-specific travel credits",
  "prompt": "Do you regularly fly the airline whose card you carry?",
  "implies": ["User is a brand-loyal flyer of the issuer airline", "Airline-specific credits should value at face for this user"],
  "evidence_strength": "medium",
  "source_card_examples": ["united_quest", "delta_reserve", "aa_executive"]
}
```

## Notes

Triggered by Got-it on cobrand airline cards with auto-applied travel credits (United Quest $200, Delta Reserve travel credits). Different from claims.travel_credit.flexible — the credit only fires on the issuer airline, so it depends on brand loyalty.
