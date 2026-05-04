# intents.plans_family_trip

User is planning travel with family. Lifts cards with companion certs, multi-traveler bag waivers, and points-pooling capability.

## signals.json entry

```json
{
  "id": "intents.plans_family_trip",
  "type": "intent",
  "decay": "trip_bound",
  "label": "Plans family travel",
  "prompt": "Are you planning travel with family (multiple seats / rooms)?",
  "implies": [
    "User needs to redeem multiple seats or book larger hotel rooms",
    "Family-friendly cobrand cards (free checked bag, companion certs) gain priority"
  ],
  "evidence_strength": "medium",
  "source_card_examples": ["united_quest", "delta_reserve", "chase_sapphire_reserve"]
}
```

## Notes

Triggered by Want-it on family-travel plays. Lifts cards with companion certs, free checked bag for multiple companions, and points-pooling features.
