# Notes pulled from the NotebookLM workspace

Source: NotebookLM "Credit Card Rewards and Loyalty Benefits Spotlight" (49 sources).
Captured during the build to validate engine assumptions and shape why-sentence templates.

## Realistic-vs-face-value credit capture (validates ease_of_use multipliers)

| Card | Face value | Realistic capture | Implied multiplier |
|---|---|---|---|
| Amex Platinum | $1,500+ | $500–$700 | ~0.40 ("hard") — breakage + enrollment friction |
| Amex Gold | ~$424 | ~$240 | ~0.57 (mix of easy/medium/hard) |
| Chase Sapphire Reserve | $2,700+ | $600–$800 | ~0.26 (split credits, only $300 travel is "easy") |
| Venture X | ~$700 | ~$400 | ~0.57 (broad portal credit) |

Engine multipliers (`ease_of_use`):
- `easy = 1.00` — auto-applied broad credit (CSR $300 travel, Venture X $300)
- `medium = 0.75` — straightforward but specific (Amex Platinum digital ent. $20/mo)
- `hard = 0.40` — narrow merchant + small monthly increments
- `coupon_book = 0.20` — Saks, Resy, Dunkin', Walmart+ in non-applicable use

These match the captures above. Keep as-is.

## Sweet spots worth surfacing in why-sentences and trip planner

- Citi TY → **American Airlines**, ~2.1¢/pt — Citi is the only major issuer with AA transfers
- Chase UR → **World of Hyatt**, 5k–45k pts → properties retailing $1,000+, ~2.0¢/pt
- Chase UR → International business class (variable, very high cpp)
- Amex MR → **Virgin Atlantic**, ~2.2¢/pt — most valuable currency for luxury flight transfers
- Chase UR → **United MileagePlus**, ~1.3¢/pt — 1:1, expanded award seat availability
- Amex MR → International premium cabins (high cpp via partners)

## "Best next card" templates for common spend profiles

| Profile | Best next | Why-line (≤90 chars) |
|---|---|---|
| Heavy dining + travel | Amex Gold | "4× on dining and groceries — your two biggest categories." |
| Heavy grocery + gas | Blue Cash Preferred | "6% on groceries, 3% on gas. Pays for itself before perks." |
| United loyalist | United Quest | "$200 United credit + free checked bags more than cover the fee." |
| Costco-heavy | Citi Double Cash | "Flat 2% covers wholesale clubs where category cards don't." |
| No-AF only | Wells Fargo Active Cash | "Unlimited 2% on everything, no fee, no rotating categories." |
| First card ever | Chase Freedom Rise | "Best approval odds for thin files, no fee, real cashback." |

These are the pattern shapes the `generateWhy` function should produce — specific number, specific category, specific merchant. Avoid generic "Great rewards card."
