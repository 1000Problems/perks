# holdings.thank_you_feeder

Auto-confirmed when wallet contains a Citi ThankYou cashback feeder card (Double Cash, Custom Cash, or Rewards+). Activates the Strata Premier ecosystem-line and lifts ThankYou-platform recommendations.

## signals.json entry

```json
{
  "id": "holdings.thank_you_feeder",
  "type": "holding",
  "decay": "never",
  "label": "Holds a Citi ThankYou-feeder card",
  "prompt": "",
  "implies": [
    "User can pool 2-5%-cashback ThankYou points from a feeder",
    "Strata-class cards score higher because the ecosystem case is real"
  ],
  "evidence_strength": "strong",
  "source_card_examples": ["citi_strata_premier", "citi_strata_elite"]
}
```

## Notes

Auto-confirmed when wallet contains Citi Double Cash, Custom Cash, or Rewards+. Not user-clickable; derived from cards_held in Phase 4.
