# claims.doordash_credit

User claims DoorDash credits (food delivery or grocery). Usually paired with a complimentary DashPass; Got-it implies the user has activated DashPass and regularly orders via the platform.

## signals.json entry

```json
{
  "id": "claims.doordash_credit",
  "type": "behavior",
  "decay": "annual",
  "label": "Claims DoorDash credits",
  "prompt": "Do you use DoorDash for food delivery or grocery, with DashPass active?",
  "implies": ["User has DashPass active or is willing to activate", "DoorDash credits should value at face for this user"],
  "evidence_strength": "medium",
  "source_card_examples": ["chase_sapphire_reserve", "chase_sapphire_preferred", "amex_gold"]
}
```

## Notes

Triggered by Got-it on DoorDash credits (Reserve $10/mo + grocery, Preferred $5/mo). Often paired with a complimentary DashPass — Got-it implies user has activated and uses both.
