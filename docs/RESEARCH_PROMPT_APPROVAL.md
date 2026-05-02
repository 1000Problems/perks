# Research Prompt — Approval Eligibility Data

Extends `docs/RESEARCH_PROMPT.md`. Adds structured approval-eligibility fields to every card in `data/cards.json` and produces a top-level `data/issuer_rules.json`. Paste the prompt below into a deep-research-capable AI.

---

## PROMPT START

You are extending the data layer for a US credit-card recommendation engine. The engine is a pure function that runs in the browser: it takes a user profile and a card database and returns a ranked list of "next card to add." A user's eligibility for each card must be classifiable as `green` (likely approval), `yellow` (marginal — pre-qual recommended), or `red` (denied or invite-only) without the engine having to parse English at runtime.

The user-side input you can rely on is one self-reported credit-score band:
`building` (no credit or sub-580), `fair` (580–669), `good` (670–739), `very_good` (740–799), `excellent` (800+), `unknown`. Plus the cards-held list with open dates and bonus-received flags.

Your job: add the fields specified below to every card and produce `data/issuer_rules.json`. Do not invent data. If a field is unknown after careful research, set it to `null` and add a `notes` string. Cite a primary source URL for every numeric or rule claim.

### Coverage

Same scope as `docs/RESEARCH_PROMPT.md` — 120–160 US-issued personal and small-business cards. If `data/cards.json` already exists from that prompt, preserve every existing field and add the new ones below.

### New fields on every card

Replace the old `credit_score_required` string with this object, and add the others alongside it:

```jsonc
{
  "credit_score": {
    "min_recommended_fico8": 720,         // Score below which approval is unlikely. Integer or null.
    "typical_approval_band": "very_good", // building | fair | good | very_good | excellent
    "typical_approval_range": { "low": 720, "high": 800 }, // From DPs; null if unknown
    "notes": "Chase rarely approves Sapphire products below 720 per Doctor of Credit DPs"
  },

  "invite_only": false,                   // True for Centurion, BoA Private Bank cards, etc.

  "prequal": {
    "available": true,
    "url": "https://www.capitalone.com/credit-cards/preapproval/",
    "soft_pull": true,
    "notes": "Pre-approval tool covers most personal cards"
  },

  "business_card_requirements": {         // null when card_type !== "business"
    "ein_required": false,
    "sole_prop_ssn_accepted": true,
    "min_revenue_recommended_usd": null,
    "notes": "Sole prop with $0 revenue regularly approved per DPs"
  },

  "issuer_rules_ref": ["chase_5_24", "chase_velocity_2_per_30d"],  // IDs from issuer_rules.json

  "issuer_rules_structured": [            // Card-specific (product-level) rules only
    {
      "type": "once_per_product_family",
      "family": "chase_sapphire",
      "lookback_months": 48,
      "condition": "bonus_received_or_card_currently_held",
      "description": "Cannot earn SUB if any Sapphire bonus received in last 48 months or any Sapphire currently held"
    }
  ]
}
```

### `data/issuer_rules.json` — new file

Keyed by issuer slug. Required keys: `chase`, `amex`, `citi`, `capital_one`, `bank_of_america`, `barclays`, `wells_fargo`, `us_bank`, `discover`, `synchrony`, `bread_comenity`.

```jsonc
{
  "chase": {
    "name": "JPMorgan Chase",
    "rules": [
      {
        "id": "chase_5_24",
        "type": "x_in_y",
        "limit": 5,
        "window_months": 24,
        "counts": "new_personal_accounts_all_issuers",
        "scope": "personal_apps",
        "consequence": "auto_decline",
        "official": false,
        "description": "Auto-declines personal-card apps when 5+ new personal accounts have been opened across all issuers in the last 24 months. Capital One business and Discover business count toward 5/24; Chase Ink, Amex business, Citi business do not.",
        "sources": ["https://www.doctorofcredit.com/..."]
      },
      {
        "id": "chase_velocity_2_per_30d",
        "type": "max_apps_per_period",
        "limit": 2,
        "window_days": 30,
        "scope": "this_issuer_personal",
        "consequence": "auto_decline",
        "description": "No more than 2 Chase personal cards in 30 days; informal 1/30 is safer."
      }
    ]
  }
}
```

### Structured rule shapes — discriminated union

Every rule, whether issuer-level or card-level, must take one of these shapes. If you find a rule that does not fit, add a new variant rather than falling back to prose:

```ts
type IssuerRule =
  | {
      type: "x_in_y";                            // Chase 5/24, Barclays informal 6/24
      limit: number;
      window_months: number;
      counts:
        | "new_personal_accounts_all_issuers"
        | "new_accounts_this_issuer"
        | "hard_inquiries_all_bureaus"
        | "hard_inquiries_one_bureau";
      scope: "personal_apps" | "business_apps" | "any_app";
    }
  | {
      type: "max_apps_per_period";               // Chase 2/30, Capital One 1/6, Amex 1/5
      limit: number;
      window_days?: number;
      window_months?: number;
      scope: "this_issuer_personal" | "this_issuer_business" | "this_issuer_all";
    }
  | {
      type: "max_open_cards_with_issuer";        // Amex 5 credit + 10 charge
      max: number;
      scope: "personal" | "business" | "all_credit_cards" | "all_charge_cards";
    }
  | {
      type: "once_per_lifetime";                 // Amex SUB per product
      product_id: string;
    }
  | {
      type: "once_per_product_family";           // Chase Sapphire 48-month
      family: string;
      lookback_months: number;
      condition: "bonus_received" | "card_currently_held" | "bonus_received_or_card_currently_held";
    }
  | {
      type: "velocity_2_3_4";                    // BoA: 2 in 30d / 3 in 12mo / 4 in 24mo
      caps: { window_months: number; limit: number }[];
      scope: "this_issuer_personal";
    }
  | {
      type: "credit_score_floor";
      min_score: number;
      bureau_used: "experian" | "equifax" | "transunion" | "any";
    }
  | {
      type: "invite_only";
      pathways: string[];                        // e.g. ["~$250k+/yr Platinum spend", "BoA Private Bank client"]
    }
  | {
      type: "existing_relationship_required";    // Citi Chairman, JPM Reserve
      relationship: "deposit_account" | "investment_account" | "private_bank";
      min_assets_usd: number | null;
    }
  | {
      type: "informal";                          // Practitioner DPs only, no issuer publication
      summary: string;
    };
```

### Specific issuer rules you must encode in `issuer_rules.json`

- Chase 5/24 (document which business cards count toward it and which do not)
- Chase 2/30 personal velocity (plus the informal 1/30)
- Chase Sapphire 48-month product-family
- Amex once-per-lifetime SUB per product (note popup-jail criteria from DPs)
- Amex 5-credit-card limit and 10-charge-card limit
- Amex 1/5 and 2/90 velocity
- Citi 8/65/95 (8 days between apps, 65 days between two business cards, 95 days between two personal cards)
- Citi 24-month ThankYou-family bonus rule
- Capital One 1 personal card every 6 months
- Capital One 2-card total limit (informal but consistent)
- Capital One pulls all three bureaus on every app
- Bank of America 2/3/4
- Bank of America 7/12 (own products)
- Barclays 6/24 (informal)
- Wells Fargo 6-month between personal cards (informal)
- US Bank 2-in-30-days velocity (informal)
- Discover 1-card-per-application, 12-month between SUB on same product
- Synchrony / Bread Comenity — store-card-friendly score floors

For each rule, include a `sources` array with at least one citation. Where the rule is unofficial, set `official: false` and cite the practitioner source (Doctor of Credit, MyFico, Reddit /r/CreditCards megathreads).

### Per-card score floors — be specific, not lazy

Set `credit_score.min_recommended_fico8` based on, in priority order:

1. Issuer-published guidance, where it exists.
2. Doctor of Credit / MyFico / Reddit DP patterns — look at the bottom decile of approvals.
3. Card-tier defaults if no DPs are available: secured 0, building 580, basic rewards 670, mid-tier travel 700, premium travel 720, ultra-premium 740, business 680.

Do not assign the same floor to every card from one issuer. Chase Freedom Unlimited approves much lower than Chase Sapphire Reserve.

### Pre-qualification

Set `prequal.available: true` and populate `url` for every card whose issuer offers a soft-pull tool that covers it. Public entry pages:

- Capital One: https://www.capitalone.com/credit-cards/preapproval/
- Amex: https://www.americanexpress.com/en-us/credit-cards/cards/pre-qualified/
- Citi: https://www.citi.com/credit-cards/citi-credit-card-prequalification.do
- Discover: https://www.discover.com/credit-cards/pre-approval/
- Chase: Card Match (logged-in only)
- Bank of America, Wells Fargo, US Bank: logged-in-only

For logged-in-only tools, the URL is the issuer's logged-in entry page; mark in `notes`.

### Invite-only cards

Set `invite_only: true` and add an `invite_only` rule with `pathways` for at minimum:

- Amex Centurion ("Black Card")
- JP Morgan Reserve (legacy / Private Bank only)
- Bank of America Private Bank cards
- Any other card that genuinely cannot be applied for through a public form

### Output requirements

1. Preserve all existing fields in `cards.json`. Add the new ones — do not remove anything.
2. `data/issuer_rules.json` is a new file, single object keyed by issuer slug.
3. Every numeric or rule claim has a `sources` URL on the card or on the rule.
4. `null` for unknowns, never guess. Always include a `notes` field explaining what you tried.
5. Update `data_freshness` on any card where you modified approval fields.
6. The existing prose `issuer_rules` array can stay for human readability, but every entry must now have a structured counterpart in `issuer_rules_structured` or a referenced rule in `issuer_rules_ref`.

### Final checklist

- Every card has `credit_score`, `invite_only`, `prequal`, `issuer_rules_ref`, `issuer_rules_structured` (may be empty), and `business_card_requirements` (null for personal).
- `data/issuer_rules.json` covers all 11 listed issuers.
- No rule lives in prose only — every prose rule has a structured equivalent.
- Every Centurion-class card has `invite_only: true` with populated pathways.
- Every card from an issuer with a public soft-pull tool has `prequal.available: true` and a URL.

## PROMPT END
