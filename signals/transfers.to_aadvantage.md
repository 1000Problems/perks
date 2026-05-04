# transfers.to_aadvantage

User has transferred points to American AAdvantage. Implies comfort with transfer-partner mechanics and access to OneWorld premium-cabin redemptions.

## signals.json entry

```json
{
  "id": "transfers.to_aadvantage",
  "type": "behavior",
  "decay": "never",
  "label": "Transfers points to American AAdvantage",
  "prompt": "Have you transferred points (Citi ThankYou or Bilt) to American AAdvantage for a redemption?",
  "implies": [
    "User is comfortable with transfer-partner mechanics",
    "Cards earning toward AAdvantage transfer should weight higher in recommendations"
  ],
  "evidence_strength": "strong",
  "source_card_examples": ["citi_strata_premier", "citi_strata_elite", "bilt_mastercard"]
}
```

## Notes

Triggered by Got-it on AAdvantage transfer plays. AAdvantage is the highest-leverage transfer for ThankYou holders — only Citi and Bilt transfer 1:1, and the redemption rates clear OneWorld business class.
