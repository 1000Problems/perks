# claims.clear_credit

User is a CLEAR Plus member; the annual CLEAR credit (Amex Platinum $199) reliably zeroes out their membership cost.

## signals.json entry

```json
{
  "id": "claims.clear_credit",
  "type": "behavior",
  "decay": "annual",
  "label": "Claims CLEAR membership credit",
  "prompt": "Do you have CLEAR airport security and would use a CLEAR-credit reimbursement?",
  "implies": ["User has CLEAR active", "CLEAR credit should value at face for this user"],
  "evidence_strength": "medium",
  "source_card_examples": ["amex_platinum"]
}
```

## Notes

Triggered by Got-it on Amex Platinum $199 CLEAR Plus credit. Binary — user has CLEAR or does not.
