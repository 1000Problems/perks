# claims.hotel_credit.portal

User books hotels through the issuer's travel portal to claim portal-channel hotel credits. Easier capture than FHR-channel credits — no specific-property constraint.

## signals.json entry

```json
{
  "id": "claims.hotel_credit.portal",
  "type": "behavior",
  "decay": "annual",
  "label": "Claims portal-booked hotel credits",
  "prompt": "Do you book hotels through your card's travel portal to claim hotel credits?",
  "implies": ["User comfortable with portal-booking workflow", "Portal hotel credits should value at face for this user"],
  "evidence_strength": "strong",
  "source_card_examples": ["citi_strata_premier", "capital_one_venture_x"]
}
```

## Notes

Triggered by Got-it on portal-channel hotel credits (Strata Premier $100, Venture X $300 portal credit). Easier than FHR because no resort-channel constraint.
