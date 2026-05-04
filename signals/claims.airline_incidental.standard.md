# claims.airline_incidental.standard

User actively reimburses airline incidentals (bag fees, in-flight wifi, seat selection) on a $200-class credit. Distinct from broad travel credits because the user has navigated the qualifying-airline election dance.

## signals.json entry

```json
{
  "id": "claims.airline_incidental.standard",
  "type": "behavior",
  "decay": "annual",
  "label": "Claims airline incidental credits",
  "prompt": "Do you submit airline incidental credits (bag fees, wifi, seat selection) for reimbursement?",
  "implies": ["User flies enough to incur incidentals", "User is patient enough to elect a single qualifying airline yearly", "$200-class incidental plays should value at face for this user"],
  "evidence_strength": "strong",
  "source_card_examples": ["amex_platinum", "amex_business_platinum", "delta_reserve"]
}
```

## Notes

Triggered by Got-it on Amex Platinum-class $200 airline incidental credits. The credit excludes airfare itself — only ancillaries qualify, which trips up casual users. Got-it here is a strong predictor that this user will capture similar incidental credits on other cards.
