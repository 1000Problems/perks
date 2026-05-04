# behaviors.uses_lounges_priority_pass

User actively visits Priority Pass lounges. Implies sub-monthly to monthly flying cadence.

## signals.json entry

```json
{
  "id": "behaviors.uses_lounges_priority_pass",
  "type": "behavior",
  "decay": "never",
  "label": "Uses Priority Pass lounges",
  "prompt": "Do you use Priority Pass lounges when you fly?",
  "implies": [
    "User is a frequent flyer",
    "Lounge-access plays should value at the per-visit rate for this user"
  ],
  "evidence_strength": "strong",
  "source_card_examples": ["chase_sapphire_reserve", "amex_platinum", "capital_one_venture_x"]
}
```

## Notes

Triggered by Got-it on Priority Pass plays. Strong indicator of flying frequency — sub-monthly flyers usually do not bother with PP cards.
