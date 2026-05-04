# claims.global_entry_tsa

User has used a card to reimburse Global Entry or TSA PreCheck enrollment. One-time $100-class capture, but a strong indicator of frequent-flyer status.

## signals.json entry

```json
{
  "id": "claims.global_entry_tsa",
  "type": "behavior",
  "decay": "never",
  "label": "Has used Global Entry / TSA PreCheck reimbursement",
  "prompt": "Have you used a card to reimburse Global Entry or TSA PreCheck?",
  "implies": ["User is an international or frequent flyer", "GE/TSA reimbursement plays should value at face for this user (one-time, ~$100)"],
  "evidence_strength": "strong",
  "source_card_examples": ["amex_platinum", "chase_sapphire_reserve", "capital_one_venture_x"]
}
```

## Notes

Triggered by Got-it on Global Entry / TSA PreCheck reimbursement plays. Decay never — once enrolled in GE/TSA, the user is in the program for 5 years and recurring reimbursements naturally renew.
