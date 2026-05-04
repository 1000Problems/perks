# intents.aspires_premium_hotel

User aspires to premium hotel redemptions (Park Hyatt, Andaz, St. Regis, Conrad). Lifts UR-Hyatt and luxury cobrand recommendations.

## signals.json entry

```json
{
  "id": "intents.aspires_premium_hotel",
  "type": "intent",
  "decay": "never",
  "label": "Aspires to premium hotel redemptions",
  "prompt": "Do you want to redeem points for premium hotel stays (Park Hyatt, Andaz, St. Regis, Conrad)?",
  "implies": [
    "User values brand experience over rate",
    "UR Hyatt and MR Hilton/Bonvoy transfer plays gain priority",
    "Free-night-cert plays score higher"
  ],
  "evidence_strength": "medium",
  "source_card_examples": ["chase_sapphire_reserve", "chase_sapphire_preferred", "amex_platinum"]
}
```

## Notes

Triggered by Want-it on premium-hotel plays. Does not bind to a specific trip — broader than aspires_japan.
