# claims.travel_credit.flexible

User claims broad-scope travel credits (CSR-style $300, Venture X-style portal credit). Broader than airline incidentals — applies to airfare, hotels, rideshare, parking, transit.

## signals.json entry

```json
{
  "id": "claims.travel_credit.flexible",
  "type": "behavior",
  "decay": "annual",
  "label": "Claims flexible travel credits",
  "prompt": "Do you reliably use a card's broad travel credit (airline + hotel + ride share)?",
  "implies": ["User has any travel spend at all", "User claims credit without effort because scope is broad", "$300-class flexible-travel credits should be near-100% capture for this user"],
  "evidence_strength": "strong",
  "source_card_examples": ["chase_sapphire_reserve", "capital_one_venture_x", "amex_business_platinum"]
}
```

## Notes

Triggered by Got-it on CSR-class $300 broad travel credits and Cap One Venture X portal credits. Higher capture rate than airline-incidental because the credit is forgiving — anything coded as travel triggers it.
