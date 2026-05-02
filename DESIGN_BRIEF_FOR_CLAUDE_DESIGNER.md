# Design Brief — Credit Card Recommendation Engine

You are designing the core flow for a US credit card recommendation web app. This is not a calculator and not a wallet-vs-wallet comparator — those exist (richwithpoints, awardwallet, the points guy). This is a recommender for normal people who add one or two cards per year and want to know which one card, right now, would do the most for them.

## Product thesis

The user's question is always: **"Given the cards I already have and how I actually spend, what is the best next card to add to my wallet — and what would it concretely improve?"**

Everything in the design serves that question. We are not showing totals. We are showing **deltas**: net annual value gained, perks unlocked, sweet-spot redemptions opened up, cards rendered redundant. A single ranked list of "next card to add" is the headline output, not a side-by-side matrix.

We compete with richwithpoints (https://www.richwithpoints.com/app/wallet-comparisons) — review their wallet comparison flow before designing. They are powerful but built for hobbyists who already know what a Quadfecta is. Our user has never heard the word "Quadfecta" and shouldn't need to.

## Audience

- US-based, employed, has 1–4 credit cards already, decent credit
- Spends 10–25 minutes a year thinking about credit card optimization, not 10 hours
- Knows brands they use (Costco, United, Hilton) but doesn't know transfer partners or sweet spots
- Cares about money saved, not points-per-dollar tables

## The four-screen onboarding → recommendation flow

### Screen 1 — Spend profile

Capture how much the user spends per year by category. Twelve categories at most:
groceries, dining, gas, airfare, hotels, streaming, online shopping, drugstore, transit/rideshare, utilities, home improvement, "everything else."

Two ways to fill it in:
- **Manual sliders** with sensible US-household defaults pre-filled. The user nudges. Total dollars spent is shown live as they adjust.
- **Statement upload** (later phase, mention as "coming soon" placeholder) — drag a CSV from their bank to auto-populate.

Visual priority: this screen should feel like it takes 60 seconds, not a tax form. Defaults visible immediately. No required fields except total spend.

### Screen 2 — Brands, services, travel plans

Multi-select chip selectors, three groups:

- **Stores I shop at**: Costco, Amazon, Target, Walmart, Sam's Club, Apple, Whole Foods.
- **Brands I'm loyal to**: United, Delta, American, Southwest, Alaska, JetBlue / Hilton, Marriott, Hyatt, IHG, Wyndham / Uber, Lyft, DoorDash, Disney+, Netflix, Spotify, Equinox, Peloton.
- **Trips I'm planning in the next 12 months**: free-text city or chip from a curated list (NYC, LA, Vegas, Maui, Cancun, Tokyo, Paris, Rome, etc.). This is what powers hidden-gem detection.

The chip picker should feel light, not exhaustive. Users skip what doesn't apply.

### Screen 3 — Cards I already have

Search-and-add interface. Each card the user adds prompts two questions:
- **When did you open it?** (year/month) — this drives 5/24, Amex once-per-lifetime, and similar issuer rules.
- **Did you receive the sign-up bonus?** (yes/no) — so we don't recommend the same card again.

Show a small "your wallet" panel that fills as cards are added. Each card displayed as the actual card art, lightly recognizable.

A subtle eligibility pre-check renders below: "Based on your card-opening history, you appear to be at 3/24 for Chase, eligible for new Amex products you haven't held, etc." — informational, not gatekept.

### Screen 4 — The recommendation panel

This is the value moment. Three-column layout on desktop, stacked on mobile.

**Left column — Your current wallet**

- Net annual value of what you already hold (rewards earned from your spend profile, minus annual fees, minus unredeemed credits valued realistically). One big number, color-coded.
- A spend-coverage heatmap: 12 category rows, each showing your best earning rate across your wallet. Cells are colored by rate (1% red, 5%+ green). Reveals where your wallet has gaps.
- Total perks you currently have, deduplicated (e.g., "Global Entry credit ×1 even if 3 cards offer it").

**Middle column — Top 5 cards to add**

Vertical list of card cards. Each row contains:
- Card art (small)
- Card name and issuer
- **Delta headline**: "+$340/year net" — annual value added, after annual fee, after dedup
- **Eligibility chip**: green / yellow / red — based on issuer rules using the dates from Screen 3
- **One-line "why"**: written in plain English, not jargon. Examples: "Doubles your dining rate, adds Hyatt transfers for your Phoenix trip." or "Pays for itself with the Walmart+ credit you already use."
- **Sort/filter toggle at top**: "Cards that pay for themselves" | "Best total value" | "No annual fee only" | "Premium tier"

This list should feel like Spotify's "Made for You" — high-trust, ranked, scannable in 30 seconds.

**Right column — Drill-in detail (revealed when user clicks a card in middle column)**

Five sections, each visually distinct:

1. **Spend impact** — same heatmap from left column, but with the new card's earning rates layered in. Cells light up green where this card wins.
2. **New perks gained** — list of perks this card adds that you don't already have. Each with a realistic value estimate, not face value.
3. **Perks you'd duplicate** — greyed out list of perks already covered by your existing wallet, so the user sees we're not double-counting.
4. **Points/transfer partners unlocked** — if the card unlocks Chase UR or Amex MR, show the new transfer partners and a 2-3 line "what this means for you" tied to the user's stated travel plans. Example: "You're going to Phoenix — this card lets you transfer points to Hyatt and book Andaz Scottsdale for 12k pts (≈$400 retail)."
5. **The math** — small expandable section showing the calculation: spend × rate per category, minus annual fee, minus credits not used, plus sign-up bonus amortized over 2 years. For users who want to verify.

### Cross-cutting design requirements

- **Year 1 vs ongoing toggle** at the top of the rec panel. Sign-up bonuses dominate year 1 and skew everything. Show both views, default to "ongoing" so the rec is honest.
- **Realistic credit valuation toggle**: "Show me face value of credits" vs "Show me what I'd actually use." Default to realistic.
- **Mobile-first**. Most users decide on credit cards on their phone. Desktop is enhancement.
- **No dark patterns, no affiliate-link bait**. Lock in user trust by being transparent about ranking criteria.

## Visual language

- Clean, financial, calm. Not gamified. Not flashy. Think Wealthfront / Mercury / Copilot Money, not Mint or Credit Karma.
- Numbers are hero typography. The "+$340/year" delta should feel as important as the card art.
- Color used sparingly: green for value gained, red for fees/loss, yellow for caution (eligibility risk). No rainbow charts.
- Typography: a serious sans like Inter or Söhne for body, a slightly distinctive face for hero numbers.
- Card art is a real visual element — credit cards are physical, beautiful objects, lean into that. Show actual issuer card designs.

## Trip planner — secondary view

A separate tab from the recommendation panel, linked from any "sweet spot" mention.

User picks a destination from the chips on Screen 2. Output:
- Hotels and airlines that match their existing points balance, with redemption costs in points and dollar equivalents
- Award flights that the user could book today with what they hold
- Cards in the rec list that would unlock additional redemption paths for this trip

Single-page experience. No multi-step flow.

## Deliverables

Three artifacts, in this order of priority:

1. **The recommendation panel (Screen 4)** at high fidelity — desktop and mobile. This is the moment of value. Get this right first.
2. **The four-screen onboarding flow** at wireframe-to-mid fidelity. Focus on minimum friction.
3. **The trip planner view** at mid fidelity.

For each screen, include the empty/loading state, the populated state, and one error state where relevant.

## What to NOT design

- Account / login / settings pages — assume those exist
- Marketing landing pages — separate brief
- A side-by-side wallet comparison view — explicitly not what we're building, that's richwithpoints' game

## Anti-patterns to avoid

- "Apply now" buttons that look like primary CTAs (we are not an affiliate funnel)
- Coupon-book stacking that double-counts credits
- Toggles or filters that hide negative information from the user
- "Recommended for you!" badges without explanation
- Forcing email signup before showing recommendations

## Questions to answer with the design

1. How does the rec panel handle the case where the user has zero cards yet (cold start)?
2. How does the panel update in real time as the user toggles "year 1" vs "ongoing," or as they edit spend?
3. How is the "why" sentence generated visually — is it always one line, or does it expand?
4. How does the trip planner integrate with the rec list — link from each "sweet spot" mention, or a persistent tab?
5. What does the mobile version of the three-column rec panel look like — tabbed? stacked? swipe?

Treat these as design problems to solve, not questions to ask back.
