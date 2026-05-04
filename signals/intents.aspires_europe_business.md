# intents.aspires_europe_business

User wants European premium-cabin redemption. Lifts MR/TY-earning cards with strong European-partner transfers (Flying Blue, Virgin, Iberia).

## signals.json entry

```json
{
  "id": "intents.aspires_europe_business",
  "type": "intent",
  "decay": "trip_bound",
  "label": "Aspires to Europe business class",
  "prompt": "Are you planning a trip to Europe in business class on points?",
  "implies": [
    "User wants European premium-cabin redemption",
    "Flying Blue, Virgin Atlantic, Aer Lingus, Iberia transfer plays gain priority",
    "MR and TY recommendations score higher than UR for this user"
  ],
  "evidence_strength": "strong",
  "source_card_examples": ["amex_platinum", "amex_gold", "chase_sapphire_reserve", "citi_strata_premier"]
}
```

## Notes

Triggered by Want-it on Europe business-class redemption plays. Three transfer routes dominate this redemption (Flying Blue, Virgin Atlantic, Iberia Avios), so signal lifts MR/TY-earning cards.
