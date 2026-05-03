# Card Research Prompt

Drop-in prompt for Claude Research (or any deep-research tool) to produce a structured value-extraction profile per card. Output is shaped to match our card markdown schema + plays schema so we can paste with minimal editing.

---

## When to use Claude Research vs NotebookLM

For most cards in our list, **Claude Research is sufficient** — it produces a structured single-pass report against high-quality public sources (issuer terms, NerdWallet, The Points Guy, Doctor of Credit, ViewFromTheWing, Reddit r/churning, AwardHacker).

**Build a NotebookLM only for the high-complexity ecosystem cards** where deep transfer logic, niche plays, and devaluation timing matter and where a single research pass tends to leave gaps. Specifically:

- Chase Sapphire Preferred and Chase Sapphire Reserve — anchor cards for the entire UR ecosystem; need every transfer partner sweet spot, the recent CSR overhaul, and the Hyatt/UA/Air Canada redemption depth.
- Chase World of Hyatt — the best-in-class hotel cobrand; sweet-spot pricing varies by category and changes; brand-explorer mechanics, cat 1-4 free night certs, status-trigger spend.
- Chase Marriott Bonvoy Boundless — the 35K free-night certificate use cases, peak/off-peak chart, top-up rule, status mechanics.
- Chase IHG One Rewards Premier — 4th-night-free, fourth-night-points-back, anniversary night up to 40k, Diamond status thresholds, all-inclusive pricing quirks.
- Amex Gold — coupon-book credits (Uber, Resy, Dunkin', dining), Pay Over Time, MR transfer partners.

For everything else (BoA Atmos Ascent, BoA Customized Cash, Capital One Venture, Citi Double Cash, Costco Anywhere, Wells Fargo Autograph, Amex Delta SkyMiles Gold), **Claude Research alone is sufficient** — these cards have shallower ecosystem logic and well-documented public terms.

Recommended sequence: run the prompt below for **all 13 cards via Claude Research**. For the five high-complexity cards above, follow up with a NotebookLM where you load 25–40 sources (their issuer T&Cs PDF, two NerdWallet articles, two Points Guy guides, the relevant subreddit master post, a YouTube deep-dive or two), then ask the same structured questions again to plug any gaps.

---

## The prompt

Paste verbatim. Replace `{CARD_NAME}` with the exact card name (e.g., "Chase Sapphire Preferred").

---

I am building a personal-finance app that surfaces every way a credit-card holder can extract value from a specific card — earning multipliers, statement credits, transfer sweet spots, protections, signup mechanics, and niche/counterintuitive plays. I need a comprehensive structured research report on the **{CARD_NAME}** as it stands today (verify everything against issuer terms current as of the date you run this — flag any recent or upcoming changes with dates).

The report should be exhaustive, cite specific dollar amounts and conditions, and be grounded in primary sources where possible (issuer T&Cs, official benefit documents) supplemented by reputable secondary sources (NerdWallet, The Points Guy, Doctor of Credit, ViewFromTheWing, r/churning master posts).

Produce the report in the following sections, in this exact order. Inside each section, use bullet points or short tables — no long prose paragraphs.

### 1. Card facts

- Issuer, network, card type (personal/business/secured/student)
- Annual fee, foreign-transaction fee, credit-score band typically required
- Currency earned (Chase UR / Citi TY / Amex MR / Capital One Miles / cash back / cobrand currency)
- Whether this card grants transfer access to its currency, and if so, at what ratio (1:1 vs 1:0.7 etc.)

### 2. Earning multipliers

For every category the card earns at >1x, provide:
- Category name (use the issuer's exact wording)
- Rate (points-per-dollar or % cash back)
- Annual cap (or "uncapped")
- Conditions or "hidden coverage" (e.g., "select transit includes parking, tolls, rideshare" or "supermarkets exclude wholesale clubs")
- Whether it pools or stacks with other cards in the same family

### 3. Statement credits and recurring benefits

For every credit and recurring benefit:
- Name
- Dollar value and cadence (monthly / quarterly / semi-annual / annual / per-stay)
- Eligible merchants or use cases (exact list)
- How activation works (auto-applied at booking, statement credit after spend, must enroll once, must use specific portal)
- Realistic capture rate for an average user vs a heavy user (e.g., "$10/mo Uber is easy capture for rideshare users, hard capture otherwise")
- Whether authorized users can use the credit and whether it grants AUs their own
- Any expiration rules

### 4. Points transfer sweet spots (only if card earns transferable points)

For every named redemption that has notable value (≥1.5¢/pt or otherwise documented as a "sweet spot"):
- Partner program (e.g., "Avianca LifeMiles", "Hyatt", "Turkish Miles & Smiles")
- Routing or property (e.g., "ANA biz US East Coast → Tokyo")
- Point cost (one-way or round-trip, business / first / economy)
- Cash equivalent (range from typical retail prices)
- Surcharges and fees passed through (carrier-imposed surcharges, taxes)
- Conditions and quirks (must call to book, AA Metal only, partner-only availability, transfer time)
- The ratio you transfer at when holding this specific card vs a no-AF version of the same currency
- Source URL (issuer T&Cs or recent reputable third-party article)

### 5. Booking strategies and partner stacking

Multi-step plays where transfers route through one program to access another's award chart:
- Strategy name (e.g., "Etihad backdoor for AA Metal", "Qatar-to-BA Avios link", "Royal Air Maroc via Etihad distance chart")
- Step-by-step: which currency to transfer to, which site to search availability on, which call center/website to book through
- The arbitrage value: how much cheaper than the direct-issuer redemption
- Risk: transfer reversibility (almost never), partner availability quirks, account-linking requirements
- Sources

### 6. Travel and purchase protections

For every protection benefit:
- Coverage type (trip delay, trip cancellation/interruption, lost luggage, primary/secondary auto rental CDW, purchase protection, extended warranty, cell phone protection, baggage delay, emergency evacuation)
- Maximum dollar value per claim and per year
- Trigger conditions (delay length, theft, etc.)
- Geographic restrictions or state-specific caps (NY luggage, etc.)
- How to file (Mastercard / Visa / Amex benefits portal)

### 7. Sign-up bonus mechanics

- Current public offer (points + spend requirement + window)
- Historical highest offer seen (with date) for context
- Issuer rules that gate the bonus (Chase 5/24, Amex once-per-lifetime per family, Citi 24-month TY rule, Citi 48-month rule, etc.) — be specific about wording
- Retention play history (typical retention offers reported to actually work; spend-based bonuses, fee waivers)
- Upgrade/downgrade clock implications (does product-changing reset eligibility?)

### 8. Issuer family rules and pooling mechanics

- Application restrictions specific to this card (5/24, 1/30, 2/65, 8/65, family lockouts)
- Whether the points earned on this card pool/combine with other cards in the family
- Anchor-vs-spoke role within its ecosystem (does this card unlock transfer access for related no-AF cards?)
- What happens to earned points if the card is closed (Citi: lost; Amex: lost; Chase: depends on timing; Capital One: pooled across all Cap One cards)
- Downgrade/upgrade paths within the family and what each preserves

### 9. Status and elite mechanics (only if card grants or accelerates status)

- Status tier granted automatically (Hilton Gold, Marriott Silver, Hyatt Discoverist, IHG Platinum/Diamond, etc.)
- Elite-night credits per year + spend-based credit thresholds
- Free night certificates: count, category cap, top-up rules, expiration
- Ancillary status-tied perks (lounge access by status, free breakfast, suite upgrades)
- Annual benefits triggered by spend thresholds (e.g., $15K Marriott Boundless = +1 elite night, $30K Boundless = Platinum status)

### 10. Niche and counterintuitive plays

Anything that doesn't fit cleanly above:
- Federal-tax payment plays (and at what implied cpp)
- Shopping portal stacking
- Curve-card / virtual-card foreign-transaction hacks
- Authorized-user farming
- Refer-a-friend mechanics
- Manufactured-spend acceptability
- Time-bound expiring features (point sharing, transfer ratios, certificate caps)

For each, state a `risk_tier`: green (issuer-blessed), yellow (CHA gray area), red (TOS-violating — flag and exclude from any "do this" framing).

### 11. Recently changed or upcoming changes (next 12 months)

List anything announced for the next 12 months with the effective date, and anything devalued in the past 12 months with the date and the prior value. Include sources.

### 12. Sources used

A bibliography of every source cited above, grouped by section, with publication date if available.

---

When you're done, output the report in markdown. Don't summarize at the end — the bibliography is the close.

---

## After research → markdown authoring

The report from this prompt is the input to `cards/{card_id}.md`. The author's job is to translate the report into:

1. Updates to the existing `## cards.json entry`, `## programs.json entry`, `## issuer_rules.json entry`, `## perks_dedup.json entries`, and `## destination_perks.json entries` blocks.
2. A new `## card_plays` block (per the schema in TASK-strata-audit-v0.md), with one entry per item from sections 2–6, 9, and 10. Each play gets `value_model`, `prerequisites`, `mechanism_md`, `how_to_md`, `conditions_md`, optional `expires_at`, and `source_urls` lifted from the bibliography.
3. A `## RESEARCH_NOTES` section with the as-of date and any flagged uncertainty.

Estimate ~30–60 minutes of authoring time per card once the research report is in hand, depending on plays count.

---

## The 13-card backlog

Order suggested by audit-page priority (high-volume, high-complexity ecosystem cards first; simple cash cards last):

1. Chase Sapphire Preferred — Chase UR anchor (NotebookLM recommended)
2. Chase Sapphire Reserve — Chase UR anchor (NotebookLM recommended)
3. Amex Gold — Amex MR ecosystem core (NotebookLM recommended)
4. Chase World of Hyatt — sweet-spot king (NotebookLM recommended)
5. Chase IHG One Rewards Premier — 4th-night-free + 40K cert (NotebookLM recommended)
6. Chase Marriott Bonvoy Boundless — free-night cert mechanics (NotebookLM recommended)
7. Capital One Venture — single transferable currency, broad partners
8. Citi Double Cash — Citi spoke
9. Costco Anywhere Visa — niche cash card
10. Amex Delta SkyMiles Gold — single-airline cobrand
11. BoA Atmos Rewards Ascent Visa Signature — newer card, may need extra verification
12. BoA Customized Cash Rewards — asset-multiplier sensitive
13. Wells Fargo Autograph — single-currency cobrand-lite

Run the prompt for all 13. Build NotebookLMs only for entries 1-6.
