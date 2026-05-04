# claims.saks_credit

User shops Saks Fifth Avenue and reliably uses the semi-annual Saks credit (Amex Platinum $50 x 2/yr).

## signals.json entry

```json
{
  "id": "claims.saks_credit",
  "type": "behavior",
  "decay": "annual",
  "label": "Claims Saks credit",
  "prompt": "Do you shop at Saks Fifth Avenue often enough to use a periodic Saks credit?",
  "implies": ["User shops Saks", "Saks semi-annual credits should value at face for this user"],
  "evidence_strength": "weak",
  "source_card_examples": ["amex_platinum"]
}
```

## Notes

Triggered by Got-it on Amex Platinum $50 semi-annual Saks credit. Subjective — no spend signal infers usage; without Got-it, capture is zero.
