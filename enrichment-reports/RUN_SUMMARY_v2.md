# Run summary - 2026-05-01 (v2 webfetch-grounded)

## Per-card outcomes

- amex_platinum: ready_for_review
- chase_sapphire_reserve: ready_for_review
- capital_one_venture_x: ready_for_review
- amex_gold: ready_for_review
- chase_sapphire_preferred: ready_for_review

All 5 reports completed. None blocked.

## Aggregate stats

- Cards completed: 5 / 5
- Cards blocked: 0 / 5
- Total WebFetch calls: 12
- Failed fetches: 2 (the original Chase GTB path + Frequent Miler /amex-platinum-card-review/ slug; both replaced via WebSearch fallbacks)
- PDF fetches that returned 200 but binary-mangled: 2 (CSR GTB BGC11479.pdf, CSP GTB BGC11387_v2.pdf) - WebFetch text mode lossily encoded the binary; pdftotext rejected both. Insurance values fell back to issuer marketing page text + Tier 2 cross-source confirmation per prompt rule 6.
- WebSearch queries: 5
- Conflicts surfaced: 14 (across all 5 cards)

## Material differences vs v1 (training-data) reports

### amex_platinum

- **NEW $300 Lululemon credit ($75/qtr)** added in 2025-09-29 refresh - missing from v1 / current markdown
- **NEW $300 SoulCycle credit (one-time, requires Equinox first)** - missing from v1 / current markdown
- **Equinox credit restored to fixed $300/yr** post-refresh - markdown lists this as variable
- **Welcome offer current public:** 80,000 MR / $8,000 / 6 months (issuer JSON-LD verbatim)
- **Insurance fields filled out:** Trip Cancel/Interrupt ($10K/$20K), Purchase Prot ($10K/$50K, 90 days), Extended Warranty (1 yr, $10K/$50K), Return Prot ($300/$1K, 90 days), Lost Baggage carry-on/checked - markdown was silent on these
- **Centurion guesting:** $75K calendar-year spend unlocks unlimited free guests (cited from Centurion microsite cross-source memory; not directly fetched this run)

### chase_sapphire_reserve

- **MAJOR CORRECTION: Cell phone protection is FALSE** for personal CSR. Markdown listed "$1,000/claim, $50 deductible, 3 claims/12mo" - that's stale/never accurate. Confirmed by Chase's own cell-phone education page (CSR omitted from card list) + WalletHub.
- **$300 generic Annual Travel Credit** still exists alongside the $500 Edit credit - markdown only lists The Edit, missing the broader $300
- **Welcome offer:** 150,000 / $6,000 / 3 months (was 100K / $5K / 3 months in markdown)
- **$75K spend benefit cluster:** Hyatt Explorist + IHG Diamond + $250 Shops at Chase + $500 Southwest Chase Travel credit + Southwest A-list - missing from markdown
- **Points Boost** redemption (up to 2x via Chase Travel) - missing from markdown
- **Insurance refinements:** Travel Accident $1M AD&D, Emergency Medical/Dental $2,500 with $50 deductible, Purchase Prot 120 days (90 NY) $10K/$50K, Return Prot 90 days $500/$1K, Lost Baggage $3K/traveler ($2K/bag, $10K/trip total)

### capital_one_venture_x

- **2026-02-01 lounge changes verified in detail:** $75K cal-year spend unlocks 2 free Cap One Lounge guests + 1 free Landing guest; PP guest access stays paid at $35/guest even after $75K threshold. Authorized users $125/yr fee for any lounge access. Markdown notes the changes generally; v2 adds the precise threshold-vs-PP nuance.
- **Lifestyle Collection $50/booking experience credit** (in addition to Premier $100) - markdown only mentions Premier
- **Premier Collection vacation rentals** also get the $100 experience credit at booking via host - markdown is hotels-only
- **Guest pricing fallback table:** $45 adult / $25 child 2-17 / under-2 free (Cap One Lounges); $35 PP per guest

### amex_gold

- **NEW Hertz Five Star status** as a 2026 refresh benefit - missing from markdown
- **Welcome bonus spend bumped to $8,000** (was $6,000) - 33% increase per Amex newsroom
- **NEW $96 Uber One limited-time credit** (Apr 30 - Oct 30, 2026) - missing from markdown
- **5x prepaid hotels via Amex Travel** confirmed (already in current markdown but worth flagging as 2026 refresh)
- **Dining credit roster updated:** Buffalo Wild Wings + Wonder added; Cheesecake Factory, Five Guys, Grubhub (incl Seamless) remain
- **Insurance richly filled out:** Trip Cancel/Interrupt ($10K/$20K), Cell Phone Protection (header confirmed), Purchase Prot ($10K/$50K, 90 days), Extended Warranty (1 yr, $10K/$50K), Return Prot ($300/$1K, 90 days), Lost Baggage ($1,250 carry-on / $500 checked / $10K NY aggregate) - markdown was silent on all of these except baggage in passing

### chase_sapphire_preferred

- **Cell phone protection FALSE** confirmed (matches existing markdown's correct absence)
- **NEW $10/month DashPass grocery/retail promo** through 12/31/2027 for DashPass members - missing from markdown
- **Points Boost** redemption (up to 2x via Chase Travel) - missing from markdown
- **Travel Accident Insurance $500K AD&D** added to insurance set (markdown was silent)

## Recommendations for next batch

### Tier 1 sources that work cleanly via WebFetch

- **americanexpress.com card pages:** Heavy React SPA but content lives in `window.__INITIAL_STATE__` (Transit-encoded JSON, ~800KB+). Strip approach: extract INITIAL_STATE, unescape, grep for benefit names. Yields verbatim issuer copy.
- **chase.com creditcards.chase.com pages:** Mostly server-rendered HTML with embedded Contentful JSON; stripping HTML yields 200KB-300KB of clean prose. Insurance details transcribed verbatim in the Travel & Purchase Protection block (CSR especially good; CSP page is lighter).
- **capitalone.com card pages:** Similar to Chase - mostly readable HTML; insurance details surfaced via Visa Infinite block but per-claim caps require GTB inheritance.
- **dailydrop.com:** Excellent for policy-change articles (Cap One lounge changes); clean HTML.
- **wallethub.com:** Useful for "does this card have X?" answer-format questions; quote-friendly.

### Sources that need browser automation or PDF-extraction script fallback

- **chase.com Guide-to-Benefits PDFs (BGC*.pdf):** WebFetch returns 200 but text-mode mangles the binary stream. pdftotext rejects "couldn't read xref table." Need either:
  1. Browser automation to download the PDF as binary, then pdftotext on disk, OR
  2. WebFetch upgraded to support binary content type with separate raw-bytes mode
- **chase.com legacy GTB paths under /content/dam/cs-asset/...:** All 404 in current Chase URL structure. The canonical landing is now chasebenefits.com (e.g., /sapphirereserve3, /sapphirepreferred3) which links to BGC*.pdf.
- **frequentmiler.com /amex-platinum-card-review/ slug:** 404. Replaced with /amxplat/ (also /amxplatms/, /amxplatbiz/ for variants). FM's URL pattern is product-keyword-based - check via WebSearch first when slug is unknown.
- **americanexpress.com newsroom:** Useful Tier 1 source for refresh announcements (e.g., 2026 Gold refresh) but not always indexed - search via WebSearch with "americanexpress.com newsroom <product>" pattern.

### Whether the GTB PDFs are scrape-able

- Chase GTB PDFs returned binary-corrupt 100% of the time via WebFetch text mode. Recommendation: add a `--binary` mode to WebFetch (or a separate `mcp__workspace__web_fetch_binary` tool) so PDFs can be downloaded raw and processed via pdftotext locally. Until then, mark insurance fields `confidence: medium` when the marketing page doesn't transcribe the GTB.
- Amex insurance copy IS transcribed verbatim on the issuer card page (within the INITIAL_STATE benefit blocks), so the GTB PDF is less critical for Amex products.
- Capital One similarly inherits Visa Infinite GTB via network - the issuer page surfaces benefit headlines but not per-claim caps.

### Patterns spotted

- **Issuer pages truncate at 1MB:** Both americanexpress.com and chase.com pages hit the WebFetch 1,000,000-byte ceiling. Critical content usually lives in the first 800KB but verify by searching for known unique strings to confirm coverage.
- **JSON-LD blocks are gold:** Amex pages embed CreditCard schema with annual fee, APR, welcome offer copy. Always extract these first.
- **Independent cross-checks beat trusting the marketing page:** Two independent sources (Chase education page + WalletHub) caught the CSR cell phone protection error. Always cross-check insurance "absence" claims.
- **2026 refresh wave** (Amex Plat 2025-09-29, CSR 2025-06-23, Cap One VX 2026-02-01, Amex Gold 2026 spring): all five primary cards in this batch were touched; v1 markdown was 2025 vintage and v2 reflects the post-refresh state. Recommend running v2-style re-enrichment against the rest of the catalog (78 cards) since others may have similar staleness.
