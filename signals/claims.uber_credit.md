# claims.uber_credit

User burns monthly Uber Cash credits (Amex Platinum $200/yr, Amex Gold $120/yr). Cadence matters — monthly increments expire if not used in-month.

## signals.json entry

```json
{
  "id": "claims.uber_credit",
  "type": "behavior",
  "decay": "annual",
  "label": "Claims monthly Uber credit",
  "prompt": "Do you use Uber or Uber Eats often enough that a monthly Uber credit gets burned?",
  "implies": ["User is a regular rideshare or food-delivery user", "Monthly Uber credits should value at face for this user"],
  "evidence_strength": "medium",
  "source_card_examples": ["amex_platinum", "amex_gold"]
}
```

## Notes

Triggered by Got-it on monthly Uber credits (Platinum $15/mo + $20 December, Gold $10/mo). Capture rate depends on monthly cadence — a user who uses Uber once a quarter will let credits expire.
