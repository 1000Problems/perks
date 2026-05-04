# holdings.ultimate_rewards_feeder

Auto-confirmed when wallet contains a Chase UR feeder card (Freedom Unlimited / Flex, Ink Cash / Unlimited). Lifts Sapphire and Ink Preferred recommendations because the ecosystem case is real.

## signals.json entry

```json
{
  "id": "holdings.ultimate_rewards_feeder",
  "type": "holding",
  "decay": "never",
  "label": "Holds a Chase Ultimate Rewards feeder card",
  "prompt": "",
  "implies": [
    "User can pool UR points from a Freedom-class feeder",
    "Sapphire-class and Ink-class cards score higher"
  ],
  "evidence_strength": "strong",
  "source_card_examples": ["chase_sapphire_reserve", "chase_sapphire_preferred", "ink_business_preferred"]
}
```

## Notes

Auto-confirmed when wallet contains Chase Freedom Unlimited, Freedom Flex, or Ink Cash / Ink Unlimited. Not user-clickable; derived from cards_held in Phase 4.
