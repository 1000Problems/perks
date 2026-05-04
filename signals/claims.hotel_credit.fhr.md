# claims.hotel_credit.fhr

User books through Amex FHR or equivalent luxury hotel channels to capture resort credits. Implies luxury-hotel traveler — the channel premium only pencils out for high-end stays.

## signals.json entry

```json
{
  "id": "claims.hotel_credit.fhr",
  "type": "behavior",
  "decay": "annual",
  "label": "Claims FHR / luxury-channel hotel credits",
  "prompt": "Do you book hotels through Amex Fine Hotels & Resorts (or similar luxury channels) to claim resort credits?",
  "implies": ["User is a luxury-hotel traveler", "FHR resort credits and on-property credits should value at face for this user", "User has at least one annual stay long enough to recoup the channel premium"],
  "evidence_strength": "medium",
  "source_card_examples": ["amex_platinum", "amex_business_platinum"]
}
```

## Notes

Triggered by Got-it on FHR / luxury-channel hotel credits. Harder than portal hotel credits because the credit only fires when booking through a specific channel at a participating property — the cheaper rate-shopping flow does not qualify.
