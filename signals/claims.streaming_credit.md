# claims.streaming_credit

User claims streaming-service credits (Disney+, Netflix, Hulu, NYT, Peacock, etc.) reimbursed via the card. Binary capture — they have the subscription or they don't.

## signals.json entry

```json
{
  "id": "claims.streaming_credit",
  "type": "behavior",
  "decay": "annual",
  "label": "Claims streaming-service credits",
  "prompt": "Does your card reimburse a streaming subscription you already pay for?",
  "implies": ["User has at least one paid streaming subscription", "Streaming credits should value at face for this user"],
  "evidence_strength": "medium",
  "source_card_examples": ["amex_platinum", "delta_reserve"]
}
```

## Notes

Triggered by Got-it on streaming credits (Amex Platinum $240/yr digital entertainment credit). Capture is binary — the user either has the subscription or they do not.
