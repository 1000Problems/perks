# holdings.amex_mr_feeder

Auto-confirmed when wallet contains an Amex MR feeder card (BBP, Everyday Preferred, Green). Lifts MR-platform recommendations and ecosystem lines.

## signals.json entry

```json
{
  "id": "holdings.amex_mr_feeder",
  "type": "holding",
  "decay": "never",
  "label": "Holds an Amex Membership Rewards feeder card",
  "prompt": "",
  "implies": [
    "User can pool MR points from a no-fee or low-fee feeder",
    "Amex MR-platform cards score higher"
  ],
  "evidence_strength": "strong",
  "source_card_examples": ["amex_platinum", "amex_gold"]
}
```

## Notes

Auto-confirmed when wallet contains Amex Blue Business Plus, Everyday Preferred, or Green. Not user-clickable; derived from cards_held in Phase 4.
