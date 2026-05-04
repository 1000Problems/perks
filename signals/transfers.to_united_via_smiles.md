# transfers.to_united_via_smiles

User has used Turkish Airlines Miles & Smiles for a United flight (typically 12,500 miles for any United domestic, vs. ~25,000 with United directly). Niche, advanced redeemer.

## signals.json entry

```json
{
  "id": "transfers.to_united_via_smiles",
  "type": "behavior",
  "decay": "never",
  "label": "Books United via Turkish Miles & Smiles",
  "prompt": "Have you used Turkish Miles & Smiles miles for a United domestic flight?",
  "implies": [
    "User is at the advanced end of award-travel hobby",
    "Turkish-Smiles plays should weight higher for this user even when they look niche"
  ],
  "evidence_strength": "medium",
  "source_card_examples": ["citi_strata_premier", "citi_strata_elite", "bilt_mastercard"]
}
```

## Notes

Triggered by Got-it on Turkish Miles & Smiles transfer plays. Niche but high-value: 12,500 Smiles for any United domestic, 7,500 within North America. Requires phone-booking and is unfriendly to casual users.
