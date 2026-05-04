# intents.plans_road_trip

User is planning a road trip. Lifts cards with gas multipliers, rental insurance, and roadside assistance.

## signals.json entry

```json
{
  "id": "intents.plans_road_trip",
  "type": "intent",
  "decay": "trip_bound",
  "label": "Plans road travel",
  "prompt": "Are you planning a road trip (rental car, hotel chain stays, gas)?",
  "implies": [
    "User wants gas, lodging, and rental coverage",
    "Cards with gas multipliers and rental insurance gain priority"
  ],
  "evidence_strength": "weak",
  "source_card_examples": ["chase_sapphire_reserve", "wells_fargo_autograph", "capital_one_venture"]
}
```

## Notes

Triggered by Want-it on rental-coverage and roadtrip-fit plays.
