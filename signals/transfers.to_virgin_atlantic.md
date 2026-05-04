# transfers.to_virgin_atlantic

User uses Virgin Atlantic Flying Club to access ANA, Delta, or Air France redemptions. Multi-partner sweet-spot user.

## signals.json entry

```json
{
  "id": "transfers.to_virgin_atlantic",
  "type": "behavior",
  "decay": "never",
  "label": "Transfers points to Virgin Atlantic Flying Club",
  "prompt": "Have you transferred points to Virgin Atlantic for an ANA, Delta, or Air France redemption?",
  "implies": [
    "User is comfortable with multi-partner sweet-spot routings",
    "Virgin Atlantic-transfer plays should weight higher for this user"
  ],
  "evidence_strength": "medium",
  "source_card_examples": ["amex_platinum", "amex_gold", "chase_sapphire_reserve", "citi_strata_premier"]
}
```

## Notes

Triggered by Got-it on Virgin Atlantic transfer plays. Used for ANA First (75k miles), Delta domestic (2x cheaper than via Delta), Air France business — the partner sweet spots that drive the value of MR and TY.
