# transfers.to_avianca_lifemiles

User books Star Alliance awards through Avianca LifeMiles (often cheaper than United for the same partner metal).

## signals.json entry

```json
{
  "id": "transfers.to_avianca_lifemiles",
  "type": "behavior",
  "decay": "never",
  "label": "Transfers points to Avianca LifeMiles",
  "prompt": "Have you booked a Star Alliance award via Avianca LifeMiles?",
  "implies": [
    "User books Star Alliance awards",
    "LifeMiles plays should weight higher for this user"
  ],
  "evidence_strength": "medium",
  "source_card_examples": ["amex_platinum", "amex_gold", "chase_sapphire_reserve", "citi_strata_premier"]
}
```

## Notes

Triggered by Got-it on LifeMiles transfer plays. LifeMiles undercuts United Polaris pricing on many Star Alliance redemptions; willingness to use them is a strong premium-cabin signal.
