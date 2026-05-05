# intents.attends_concerts

User attends concerts, festivals, or other live ticketed events with enough frequency that presale access has real value. Activates Mastercard Music & Entertainment presale plays and Live Nation / Ticketmaster network benefits.

## signals.json entry

```json
{
  "id": "intents.attends_concerts",
  "type": "intent",
  "decay": "annual",
  "label": "Attends live music and ticketed events",
  "prompt": "Do you buy tickets to concerts, festivals, or live shows?",
  "implies": [
    "Presale-access benefits (Mastercard Music & Entertainment, Capital One Entertainment) have real value for this user",
    "Cards earning higher in entertainment / lifestyle categories gain priority"
  ],
  "evidence_strength": "medium",
  "source_card_examples": ["citi_strata_premier", "capital_one_savor", "amex_gold"]
}
```

## Notes

Triggered by Got-it / Done-this on Music & Entertainment presale plays. Decay annual — concert habits don't shift quickly, but offer terms expire and the signal should re-confirm yearly.
