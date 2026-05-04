# claims.hotel_free_night_cert

User reliably books the annual free-night certificate on hotel cobrand cards. Many holders let these expire; Got-it confirms active use.

## signals.json entry

```json
{
  "id": "claims.hotel_free_night_cert",
  "type": "behavior",
  "decay": "annual",
  "label": "Uses annual free-night certificates",
  "prompt": "Do you actually book the annual free-night certificates your hotel cards earn?",
  "implies": [
    "User is engaged with hotel cobrand programs",
    "Free-night cert plays should value at the cert's anchor rate for this user"
  ],
  "evidence_strength": "strong",
  "source_card_examples": ["marriott_bonvoy_brilliant", "ihg_premier", "hilton_aspire"]
}
```

## Notes

Triggered by Got-it on annual free-night cert plays (Bonvoy 85k, IHG 40k, Hilton Aspire weekend night). The cert is valuable on paper but expires unused for many cardholders — Got-it confirms the user actually books.
