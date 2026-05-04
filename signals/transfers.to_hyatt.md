# transfers.to_hyatt

User transfers UR to World of Hyatt. The UR-Hyatt route is the highest-cents-per-point redemption in the Chase ecosystem; using it implies sophistication.

## signals.json entry

```json
{
  "id": "transfers.to_hyatt",
  "type": "behavior",
  "decay": "never",
  "label": "Transfers points to World of Hyatt",
  "prompt": "Have you transferred Chase Ultimate Rewards points to World of Hyatt?",
  "implies": [
    "User is engaged with Hyatt cobrand or transfer mechanics",
    "URs Hyatt-transfer plays should value at the 2cpp+ Hyatt rate for this user"
  ],
  "evidence_strength": "strong",
  "source_card_examples": ["chase_sapphire_preferred", "chase_sapphire_reserve", "ink_business_preferred"]
}
```

## Notes

Triggered by Got-it on Hyatt transfer plays. Hyatt is the canonical UR sweet spot at 2-3cpp; willingness to transfer here is a strong endorsement of the UR ecosystem.
