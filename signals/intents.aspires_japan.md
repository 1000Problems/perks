# intents.aspires_japan

User is planning or aspires to a Japan trip. Activates JAL/AAdvantage and Park Hyatt Tokyo sweet-spot recommendations.

## signals.json entry

```json
{
  "id": "intents.aspires_japan",
  "type": "intent",
  "decay": "trip_bound",
  "label": "Aspires to Japan redemption",
  "prompt": "Are you planning a trip to Japan, or want to use points to get there?",
  "implies": [
    "User wants premium-cabin or hotel redemption to Japan",
    "Japan-route sweet-spot plays should weight much higher in recommendations",
    "Cards earning toward AAdvantage (JAL access) and Hyatt (Park Hyatt Tokyo) gain priority"
  ],
  "evidence_strength": "strong",
  "source_card_examples": ["citi_strata_premier", "amex_platinum", "chase_sapphire_reserve"]
}
```

## Notes

Triggered by Want-it on Japan-redemption plays or by trips_planned containing Japan. Auto-decays trip_bound — the signal expires when the trip is completed or removed from the user planner.
