# Section 1 — From Official Card Documentation

The first section of every card page. Built directly from the issuer's official disclosure document — the Schumer box plus the rewards and benefits T&C. Two zones, one repeating atomic unit, exact issuer wording everywhere.

## Source of truth

Every word on a Section 1 page comes from the issuer's official card-terms document — the page linked from "Pricing & Terms" or the application disclosures. One URL, one date stamp. If a sentence on the page can't be matched to a sentence in the source doc, it doesn't belong on the page.

This is the audit guarantee: every claim is verbatim and sourced inline. Paraphrasing is a bug.

---

## Header — identity + pricing facts

Pulled from the disclosures box (the Schumer box at the top of the doc) and the card-name heading. State, don't sell. No marketing copy, no positioning, no value estimates.

Fields, in order:

- Card name, exact, including ®/℠/SM marks
- Issuer — the legal entity named in "is the issuer of the account"
- Card art
- Annual Fee — from "Annual Fee"
- Foreign Purchase — from "Foreign Purchase Transaction"
- Purchase APR — from "APR for Purchases"
- Cash Advance APR — from "APR for Cash Advances"
- Penalty APR — from "Penalty APR and When it Applies"
- Late Payment / Returned Payment — from the Penalty Fees rows

That's it. No "best for", no "differentiator", no signup-bonus headline. Those live in the recommender, not the card page.

---

## Body — "{Card Name} Benefits"

Section heading is `{Card Name} Benefits`. For the Strata Premier page that's "Citi Strata Premier Benefits."

Four blocks, in this fixed order:

### 1. About {Currency} (intro block)

A single quoted paragraph from the source doc that defines the points or cashback and the headline earn mechanic. Verbatim, in quotes, sits above the earn grid so the rows beneath it have currency context.

For Citi Strata Premier this is the "Citi Travel® Site: You will earn 10 ThankYou Points..." paragraph. For other cards it's the equivalent currency primer near the top of the rewards T&C.

If the card has no transferable currency, use the cashback-definition paragraph instead.

### 2. Earn

One Perk Card per earn rate. Order from highest multiplier down to 1x.

Earn lines come from the rewards summary ("Summary of {Card} Terms and Conditions" or equivalent). Restrictions come from the "definitions apply to the categories" subsections that follow.

### 3. Annual Credits

One Perk Card per recurring credit that's once-per-calendar-year or once-per-anniversary.

Title is the exact line from the rewards summary that introduces the benefit — e.g., "Cardmembers will also be eligible to receive the $100 Annual Hotel Benefit." Restrictions are the dedicated benefit subsection in full, including any bulleted eligibility requirements.

### 4. Recurring Benefits

Per-stay or per-event benefits with no annual cap — luxury hotel programs, airline incidentals, etc. Different shape than earn or credits because the unit is a bundle, not a single line.

- Title: the bundle name with cardmember scope, exact wording
- Bundle: the verbatim bullet list of components
- Restrictions: the supplemental T&C subsections, concatenated verbatim

---

## The atomic unit — Perk Card

Every benefit on the page is a Perk Card. Same skeleton, no exceptions.

```
┌────────────────────────────────────────────┐
│ Title — exact issuer wording               │
│ Source: <issuer URL>                       │
│                                            │
│ Restrictions                               │
│ Exact issuer paragraph(s) here.            │
└────────────────────────────────────────────┘
```

Three fields: title, source, restrictions. The Recurring Benefits variant adds a fourth field (the bundle list) between source and restrictions.

Wording rules:

- Title is verbatim from the source doc — earn-rate line or benefit heading.
- Source URL is the issuer T&C page, not the marketing card page.
- Restrictions are the verbatim restriction paragraph(s). No paraphrasing, no summarization, no "essentially this means..."
- If the doc gives no explicit restriction, the field shows the inclusion sentence verbatim. For Strata Premier's 3x air/hotel line: "Includes purchases at airlines, hotels (not booked through the Citi Travel site via cititravel.com), and travel agencies."

---

## Layout

Desktop:

```
┌────────────────────────────────────────────┐
│ HEADER — identity + pricing facts          │
└────────────────────────────────────────────┘
┌────────────────────────────────────────────┐
│ ABOUT {CURRENCY} (intro block)             │
└────────────────────────────────────────────┘
┌──────────── EARN ──────────────────────────┐
│ Perk Card grid (3-up)                      │
└────────────────────────────────────────────┘
┌──────── ANNUAL CREDITS ────────────────────┐
│ Perk Card (full-width)                     │
└────────────────────────────────────────────┘
┌──────── RECURRING ─────────────────────────┐
│ Bundle list  │  Restrictions               │
└────────────────────────────────────────────┘
```

Mobile: single column, restrictions always expanded. No accordions on restrictions — collapsing the fine print is the failure mode this design exists to fix.

---

## What's intentionally not on this page

- No editorial framing or positioning prose.
- No SUB / point-value estimates in the header.
- No travel-protection or shopping-protection benefits unless the source doc gives concrete coverage values. If the doc punts to a separately-delivered Guide to Protection Benefits (as Citi's does), those protections don't go in Section 1 — they belong in a later section sourced from that guide.

---

## Worked example — Citi Strata Premier

Source: https://online.citi.com/US/ag/cards/displayterms?app=UNSOL&HKOP=14da5ef2c3aff980790d0f188b27d0a954e3592a191ef6ca71244ad26383b1aa

**Header**

- Citi Strata Premier® Card
- Citibank, N.A.
- Annual Fee: $95
- Foreign Purchase: None
- Purchase APR: 19.49% – 27.49% variable
- Cash Advance APR: 29.74% variable
- Penalty APR: up to 29.99%
- Late / Returned Payment: up to $41

**About Citi ThankYou Points (intro block)**

> "Citi Travel® Site: You will earn 10 ThankYou Points for each $1 spent on hotels, car rentals, and attractions when you use your Citi Strata Premier Card to book them through the Citi Travel site via cititravel.com or 1-833-737-1288 (TTY: 711). For bookings made with a combination of points and your Citi Strata Premier Card, only the portion paid with your card will earn points. Points are not earned on cancelled bookings. If your account is closed for any reason, including if you convert to another card product, you will no longer be eligible for this offer. Citi Travel is powered by Rocket Travel by Agoda."

**Earn — six Perk Cards**

"10x on hotels, car rentals, attractions booked through Citi Travel"
Restrictions: For bookings made with a combination of points and your Citi Strata Premier Card, only the portion paid with your card will earn points. Points are not earned on cancelled bookings. If your account is closed for any reason, including if you convert to another card product, you will no longer be eligible for this offer. Citi Travel is powered by Rocket Travel by Agoda.

"3x on air travel and other hotel purchases"
Restrictions: Includes purchases at airlines, hotels (not booked through the Citi Travel site via cititravel.com), and travel agencies.

"3x on restaurants"
Restrictions: Includes purchases at cafes, bars, lounges, fast-food restaurants, restaurant delivery services, and take out restaurants. Excludes purchases at bakeries, caterers, and restaurants located inside another business (such as hotels, stores, stadiums, grocery stores, or warehouse clubs). You will not earn 3 ThankYou Points on restaurant gift card purchases if the merchant does not use the restaurant merchant category code.

"3x on supermarkets"
Restrictions: Excludes purchases made at general merchandise/discount superstores; freezer/meat locker provisioners; dairy product stores; miscellaneous food/convenience stores; drugstores; warehouse/wholesale clubs; specialty food markets; bakeries; candy, nut, and confectionery stores; and meal kit delivery services. Purchases made at online supermarkets or with grocery delivery services do not qualify if the merchant does not classify itself as a supermarket by using the supermarket merchant code.

"3x on gas and EV charging stations"
Restrictions: Excludes gas and EV charging purchases at warehouse clubs, discount stores, department stores, convenience stores or other merchants that are not classified as gas stations or EV charging using the gas station or EV charging merchant codes.

"1x on all other purchases"
Restrictions: Includes the non-qualifying purchases listed above.

**Annual Credits — one Perk Card**

Title: "Cardmembers will also be eligible to receive the $100 Annual Hotel Benefit."
Restrictions: The full "$100 Annual Hotel Benefit" T&C paragraph plus the four bulleted eligibility requirements, verbatim.

**Recurring — The Reserve**

Title: "The Reserve Benefits (Citi Strata Elite℠, Citi Strata Premier®, and Citi Prestige® cardmembers)"

Bundle:
- $100.00 (USD) Experience Credit
- Room Upgrade, upon availability
- Daily Breakfast for Two
- Complimentary Wi-Fi
- Early Check-In, upon availability
- Late Check-Out, upon availability

Restrictions: Supplemental T&C subsections — $100 Experience Credit, Room Upgrades, Daily Breakfast for Two, Complimentary Wi-Fi, Check-In/Check-Out, General — concatenated verbatim.

---

## Replicating for another card

1. Open the issuer's official card-terms doc.
2. Pull the Header fields from the Schumer box.
3. Find the rewards summary section ("Summary of...Terms and Conditions" or equivalent) — this gives you the earn-rate lines.
4. Find the category-definitions section — these become the restrictions for each earn line.
5. Find annual benefit blocks (statement credits, hotel credits, dining credits) — each becomes one Annual Credits Perk Card.
6. Find per-stay or per-event benefit bundles (luxury hotel programs, airline credits) — each becomes one Recurring Benefits block.
7. Verbatim wording for everything. If you're tempted to paraphrase, stop and copy/paste instead.
