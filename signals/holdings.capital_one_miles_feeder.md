# holdings.capital_one_miles_feeder

Auto-confirmed when wallet contains a Capital One miles-feeder card. Lifts Venture / Venture X recommendations because the user already has miles to combine.

## signals.json entry

```json
{
  "id": "holdings.capital_one_miles_feeder",
  "type": "holding",
  "decay": "never",
  "label": "Holds a Capital One miles-feeder card",
  "prompt": "",
  "implies": [
    "User can pool C1 miles from a Quicksilver-class feeder",
    "Cap One transfer-partner cards score higher"
  ],
  "evidence_strength": "medium",
  "source_card_examples": ["capital_one_venture_x", "capital_one_venture"]
}
```

## Notes

Auto-confirmed when wallet contains Capital One Quicksilver, SavorOne, or any Cap One miles-earning card. Not user-clickable; derived from cards_held in Phase 4.
