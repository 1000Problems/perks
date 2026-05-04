# claims.equinox_credit

User is an Equinox member willing to use the Amex Platinum Equinox credit. Subjective signal — pure opt-in, no spend inference possible.

## signals.json entry

```json
{
  "id": "claims.equinox_credit",
  "type": "behavior",
  "decay": "annual",
  "label": "Claims Equinox credit",
  "prompt": "Are you an Equinox member who would use a monthly Equinox credit?",
  "implies": ["User is an Equinox member or would join", "Equinox credits should value at face for this user"],
  "evidence_strength": "weak",
  "source_card_examples": ["amex_platinum"]
}
```

## Notes

Triggered by Got-it on Amex Platinum Equinox credit. Subjective perk — no spend signal infers usage. Without explicit Got-it, default capture is zero. Weak evidence_strength because the perk is rare and the population is small.
