# claims.dining_credit.standard

User actively claims dining credits up to ~$300/year face value (Amex Gold-class $10/mo, Strata Premier hotel/dining bundle, Savor's dining credit).

## signals.json entry

```json
{
  "id": "claims.dining_credit.standard",
  "type": "behavior",
  "decay": "annual",
  "label": "Claims dining credits",
  "prompt": "Do you actively claim dining credits when your card offers them?",
  "implies": ["User is engaged with credit-claim mechanics", "Annualized dining-credit-class plays can be valued at face for this user"],
  "evidence_strength": "strong",
  "source_card_examples": ["amex_gold", "citi_strata_premier", "capital_one_savor"]
}
```

## Notes

Triggered by Got-it on plays whose value_model is fixed_credit and credit class is dining (e.g. Amex Gold $10/mo dining credit, Strata Premier hotel/dining bundle). Decays annually because the credit resets each calendar year.
