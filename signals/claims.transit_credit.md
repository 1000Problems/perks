# claims.transit_credit

User taps to pay on public transit and would capture network/issuer transit credits (e.g., Mastercard's $2.50/mo Tap & Go credit on participating systems). Binary capture — they tap on transit or they don't.

## signals.json entry

```json
{
  "id": "claims.transit_credit",
  "type": "behavior",
  "decay": "annual",
  "label": "Claims transit credits",
  "prompt": "Do you tap your card to pay for public transit (subway, bus, light rail)?",
  "implies": [
    "User commutes via public transit",
    "Mastercard Tap & Go transit credit captures at face value",
    "Transit-specific category bonuses (e.g., Bilt 1x or Apple Card 3x at transit) gain priority"
  ],
  "evidence_strength": "medium",
  "source_card_examples": ["citi_strata_premier", "bilt_rewards"]
}
```

## Notes

Triggered by Got-it on the Mastercard Tap & Go transit play. Limited to participating US transit systems (MBTA, CTA/Pace, NJ Transit, PATH, SEPTA, WMATA, DART, Miami-Dade); user outside those metros wouldn't capture.
