"use client";

// Citi Strata Premier — card page (perks design system v2).
// React port of the Claude Design HTML in card_design/Citi Strata Premier.html.
// Page-scoped CSS lives in app/strata-page.css under .strata-page-v2.
//
// Data model:
//   - PerkRow: a row in the flat list. Includes group label, category tags
//     (used for the quickchip filter), keywords (for search), title,
//     source, tag chips, and an ordered list of expand-panel blocks.
//   - The issuer-side rows are inlined verbatim from the Citi T&C.
//   - The network-side rows are inlined verbatim from the network research
//     JSON (cards/_NETWORK_RESEARCH/world_elite_mastercard_*.json) at the
//     time of build. When the runtime loader is wired through to the
//     route, this constant moves out of here.
//
// Behavior:
//   - search input filters by perk-title text + keyword string
//   - quickchip filters by category tag
//   - rows expand/collapse on click (static rows for the network "Earn
//     channels" trio render with a bullet instead of a caret and don't
//     expand)
//   - Expand all / Collapse all toggles every visible row
//   - Owned-since month/year inputs compute a tenure pill
//   - CPP cards (Cash / Citi Travel / Transfer) are editable, with an
//     "Edited" flag when the value differs from default and a Reset
//     button restoring all three.

import { useMemo, useState } from "react";
import type { Card } from "@/lib/data/loader";
import type {
  NetworkResearch,
  CardOverlayEntry,
} from "@/lib/data/networkResearch";

// ───────────────────────────────────────────────────────────────────────
// Constants
// ───────────────────────────────────────────────────────────────────────

const ISSUER_TC_URL =
  "https://online.citi.com/US/ag/cards/displayterms?app=UNSOL&HKOP=b5a03a5076668926139dc6d999bcde8adb7310d1f3118cdef81adbb339f30ab0";
const ISSUER_TC_LABEL = "Citi Strata Premier card terms";
const TRAVEL_BENEFITS_URL =
  "https://www.citi.com/credit-cards/credit-card-rewards/citi-strata-premier-travel-benefits";
const TRAVEL_BENEFITS_LABEL = "Citi Strata Premier travel benefits";
const PRODUCT_PAGE_URL =
  "https://www.citi.com/credit-cards/citi-strata-premier-credit-card";
const PRODUCT_PAGE_LABEL = "Citi Strata Premier card page";
const VERIFIED_AT = "2026-05-04";

const CPP_DEFAULTS: { cash: number; portal: number; transfer: number } = {
  cash: 1.0,
  portal: 1.0,
  transfer: 1.9,
};

const CHIPS: Array<{ value: string; label: string }> = [
  { value: "all", label: "All" },
  { value: "earn", label: "Earn rates" },
  { value: "credits", label: "Credits" },
  { value: "travel", label: "Travel protections" },
  { value: "hotels", label: "Hotel programs" },
  { value: "shopping", label: "Shopping" },
  { value: "network", label: "Network" },
];

const CURRENCY_INTRO = `Citi Travel® Site: You will earn 10 ThankYou Points for each $1 spent on hotels, car rentals, and attractions when you use your Citi Strata Premier Card to book them through the Citi Travel site via cititravel.com or 1-833-737-1288 (TTY: 711). For bookings made with a combination of points and your Citi Strata Premier Card, only the portion paid with your card will earn points. Points are not earned on cancelled bookings. If your account is closed for any reason, including if you convert to another card product, you will no longer be eligible for this offer. Citi Travel is powered by Rocket Travel by Agoda.`;

// ───────────────────────────────────────────────────────────────────────
// Perk row data model
// ───────────────────────────────────────────────────────────────────────

type Tag = { label: string; variant?: "rate" | "value" | "cap" };

type PanelBlock =
  | { kind: "prose"; eyebrow?: string; text: string; emphasized?: boolean }
  | {
      kind: "bullets";
      eyebrow?: string;
      items: string[];
      checks?: boolean;
      emphasized?: boolean;
    };

type PerkRow = {
  id: string;
  cats: string[];
  keywords: string;
  title: string;
  source: { url: string; label: string };
  verifiedAt: string;
  tags: Tag[];
  panel?: PanelBlock[]; // omit / empty → static (no expand)
};

type PerkGroup = {
  id: string;
  eyebrow: string;
  rows: PerkRow[];
};

// ── Issuer groups ───────────────────────────────────────────────────────

const ISSUER_GROUPS: PerkGroup[] = [
  {
    id: "earn",
    eyebrow: "Earn — Citi ThankYou points",
    rows: [
      {
        id: "earn-10x",
        cats: ["earn"],
        keywords: "hotel car rental attractions citi travel 10x",
        title:
          "10× on hotels, car rentals, and attractions booked through Citi Travel",
        source: { url: ISSUER_TC_URL, label: ISSUER_TC_LABEL },
        verifiedAt: VERIFIED_AT,
        tags: [
          { label: "10×", variant: "rate" },
          { label: "Citi Travel only" },
        ],
        panel: [
          {
            kind: "prose",
            eyebrow: "Restrictions",
            text: "For bookings made with a combination of points and your Citi Strata Premier Card, only the portion paid with your card will earn points. Points are not earned on cancelled bookings. If your account is closed for any reason, including if you convert to another card product, you will no longer be eligible for this offer. Citi Travel is powered by Rocket Travel by Agoda.",
          },
          {
            kind: "prose",
            eyebrow: "Stack tip",
            text: "Pair with the $100 Annual Hotel Benefit on stays of $500 or more for a single booking that earns 10× and discounts $100 — effectively the card's largest annual print of value.",
            emphasized: true,
          },
        ],
      },
      {
        id: "earn-3x-air",
        cats: ["earn"],
        keywords: "air travel airline hotel 3x",
        title: "3× on air travel and other hotel purchases",
        source: { url: ISSUER_TC_URL, label: ISSUER_TC_LABEL },
        verifiedAt: VERIFIED_AT,
        tags: [
          { label: "3×", variant: "rate" },
          { label: "Direct & agencies" },
        ],
        panel: [
          {
            kind: "prose",
            eyebrow: "What counts",
            text: "Includes purchases at airlines, hotels (not booked through the Citi Travel site via cititravel.com), and travel agencies.",
          },
        ],
      },
      {
        id: "earn-3x-rest",
        cats: ["earn"],
        keywords: "restaurant dining 3x",
        title: "3× on restaurants",
        source: { url: ISSUER_TC_URL, label: ISSUER_TC_LABEL },
        verifiedAt: VERIFIED_AT,
        tags: [
          { label: "3×", variant: "rate" },
          { label: "MCC-coded" },
        ],
        panel: [
          {
            kind: "prose",
            eyebrow: "What counts",
            text: "Includes purchases at cafes, bars, lounges, fast-food restaurants, restaurant delivery services, and take-out restaurants.",
          },
          {
            kind: "prose",
            eyebrow: "Excludes",
            text: "Bakeries, caterers, and restaurants located inside another business (such as hotels, stores, stadiums, grocery stores, or warehouse clubs). You will not earn 3 ThankYou Points on restaurant gift card purchases if the merchant does not use the restaurant merchant category code.",
          },
        ],
      },
      {
        id: "earn-3x-super",
        cats: ["earn"],
        keywords: "supermarket grocery 3x",
        title: "3× on supermarkets",
        source: { url: ISSUER_TC_URL, label: ISSUER_TC_LABEL },
        verifiedAt: VERIFIED_AT,
        tags: [
          { label: "3×", variant: "rate" },
          { label: "Uncapped" },
        ],
        panel: [
          {
            kind: "prose",
            eyebrow: "Excludes",
            text: "Excludes purchases made at general merchandise/discount superstores; freezer/meat locker provisioners; dairy product stores; miscellaneous food/convenience stores; drugstores; warehouse/wholesale clubs; specialty food markets; bakeries; candy, nut, and confectionery stores; and meal kit delivery services. Purchases made at online supermarkets or with grocery delivery services do not qualify if the merchant does not classify itself as a supermarket by using the supermarket merchant code.",
          },
        ],
      },
      {
        id: "earn-3x-gas",
        cats: ["earn"],
        keywords: "gas ev charging fuel 3x",
        title: "3× on gas and EV charging stations",
        source: { url: ISSUER_TC_URL, label: ISSUER_TC_LABEL },
        verifiedAt: VERIFIED_AT,
        tags: [
          { label: "3×", variant: "rate" },
          { label: "EV included" },
        ],
        panel: [
          {
            kind: "prose",
            eyebrow: "Excludes",
            text: "Excludes gas and EV charging purchases at warehouse clubs, discount stores, department stores, convenience stores or other merchants that are not classified as gas stations or EV charging using the gas station or EV charging merchant codes.",
          },
        ],
      },
      {
        id: "earn-1x",
        cats: ["earn"],
        keywords: "everything else base 1x",
        title: "1× on all other purchases",
        source: { url: ISSUER_TC_URL, label: ISSUER_TC_LABEL },
        verifiedAt: VERIFIED_AT,
        tags: [{ label: "1×", variant: "rate" }],
        panel: [
          {
            kind: "prose",
            text: "Includes the non-qualifying purchases listed in the bonus categories above.",
          },
        ],
      },
    ],
  },
  {
    id: "credits",
    eyebrow: "Credits — annual & recurring",
    rows: [
      {
        id: "credit-100-hotel",
        cats: ["credits", "hotels"],
        keywords: "hotel credit 100 citi travel annual",
        title: "$100 Annual Hotel Benefit on a $500+ Citi Travel stay",
        source: { url: PRODUCT_PAGE_URL, label: PRODUCT_PAGE_LABEL },
        verifiedAt: VERIFIED_AT,
        tags: [
          { label: "$100/yr", variant: "value" },
          { label: "Calendar year" },
        ],
        panel: [
          {
            kind: "prose",
            eyebrow: "How it works",
            text: "Once per calendar year, enjoy $100 off a single hotel stay of $500 or more, excluding taxes and fees, when booked through the Citi Travel site via CitiTravel.com or 1-833-737-1288 (TTY: 711). To receive the benefit, you must pre-pay for your complete stay with your Citi Strata Premier Card, ThankYou® Points, or a combination thereof. The $100 will be applied to your reservation at the time of booking.",
          },
          {
            kind: "bullets",
            eyebrow: "Restrictions",
            items: [
              "Reservations must be made by the primary cardmember. Reservations can be made in the primary cardmember's or authorized user's names.",
              "Package rates such as air-and-hotel or hotel-and-car-rental do not qualify for the benefit.",
              "Reservations through any party or channel other than the Citi Travel site are not eligible.",
              "Cannot be combined in the same transaction with the Citi Prestige® Complimentary 4th Night benefit if you hold both cards. Cannot be combined with any other promotions or discounts on thankyou.com.",
              "If you cancel a booking that used the benefit, it returns to your account for use on remaining days that calendar year. Non-refundable hotel cancellation forfeits the benefit.",
              "Hotel purchases that qualify for the $100 benefit will not earn points on the portion offset by the credit.",
            ],
          },
        ],
      },
      {
        id: "reserve-100",
        cats: ["credits", "hotels"],
        keywords: "reserve experience credit 100 hotel",
        title:
          "The Reserve — $100 Experience Credit (per stay, no annual cap)",
        source: { url: ISSUER_TC_URL, label: "Citi Strata Premier T&C — The Reserve" },
        verifiedAt: VERIFIED_AT,
        tags: [
          { label: "$100/stay", variant: "value" },
          { label: "CitiTravel rate" },
        ],
        panel: [
          {
            kind: "bullets",
            eyebrow: "What's bundled at the Reserve rate",
            checks: true,
            items: [
              "$100 Experience Credit (gift card or hotel credit, varies by property)",
              "Room upgrade, upon availability",
              "Daily breakfast for two",
              "Complimentary Wi-Fi",
              "Early check-in & late check-out, upon availability",
            ],
          },
          {
            kind: "bullets",
            eyebrow: "Restrictions",
            items: [
              "$100 Experience Credit is determined by each hotel and shall be valued at $100 USD. May be in the form of a credit or gift card, provided directly by the hotel. Certain services may require advance reservations.",
              "Back-to-back stays within 24 hours at the same hotel are considered one stay. Benefits are awarded once per stay.",
              "If the credit and other benefits are not consumed during the eligible stay, no refunds or compensation are provided and the remaining balance will be forfeited.",
              "Room upgrades are based on availability and only certain hotel room categories may be available for upgrade.",
              "Daily breakfast for two may be provided directly by the hotel or in the form of a gift card or credit. If breakfast is included as a standard hotel amenity, no additional compensation is provided.",
              "Complimentary Wi-Fi excludes select hotels where Wi-Fi is included as part of a mandatory daily resort fee or is unavailable.",
              "Benefits cannot be redeemed for cash and may not be combined with other offers. Must be used during the booked stay.",
              "Available to Citi Strata Elite℠, Citi Strata Premier®, and Citi Prestige® cardmembers only.",
            ],
          },
        ],
      },
      {
        id: "hotel-collection",
        cats: ["credits", "hotels"],
        keywords: "hotel collection citi travel breakfast wifi",
        title: "Hotel Collection by Citi Travel — breakfast, Wi-Fi, late check-out",
        source: { url: ISSUER_TC_URL, label: "Citi Strata Premier T&C — Hotel Collection" },
        verifiedAt: VERIFIED_AT,
        tags: [
          { label: "~$60/stay", variant: "value" },
          { label: "Per booking" },
        ],
        panel: [
          {
            kind: "bullets",
            eyebrow: "What's bundled",
            checks: true,
            items: [
              "Daily breakfast for two",
              "Complimentary Wi-Fi",
              "Early check-in & late check-out, upon availability",
            ],
          },
          {
            kind: "prose",
            eyebrow: "Restrictions",
            text: "Lower tier than The Reserve — no $100 Experience Credit and no room upgrade. Must book at the \"Hotel Collection\" rate via CitiTravel.com. Available to all Citi cardmembers with Citi Travel access.",
          },
        ],
      },
    ],
  },
  {
    id: "travel",
    eyebrow: "Travel protections — automatic when paid with the card",
    rows: [
      {
        id: "trip-delay",
        cats: ["travel"],
        keywords: "trip delay flight 6 hour 500 insurance",
        title: "Trip Delay Protection — up to $500 per covered trip",
        source: { url: TRAVEL_BENEFITS_URL, label: TRAVEL_BENEFITS_LABEL },
        verifiedAt: VERIFIED_AT,
        tags: [
          { label: "$500/trip", variant: "value" },
          { label: "Max 2/yr" },
        ],
        panel: [
          {
            kind: "prose",
            eyebrow: "Restrictions",
            text: "Coverage applies when a covered trip — paid in part or full with the Strata Premier — is delayed 6 or more hours. Up to $500 for meals, lodging, and incidentals. Maximum 2 claims per 12-month period. Underwritten by New Hampshire Insurance Company (an AIG company); secondary coverage unless otherwise stated. Full terms in the Guide to Protection Benefits provided with the card.",
          },
          {
            kind: "prose",
            eyebrow: "How to file",
            text: "Save receipts during the delay. File at cardbenefitservices.com within 60 days.",
          },
        ],
      },
      {
        id: "trip-cancel",
        cats: ["travel"],
        keywords: "trip cancellation interruption 5000 insurance",
        title: "Trip Cancellation & Interruption — up to $5,000 per trip",
        source: { url: TRAVEL_BENEFITS_URL, label: TRAVEL_BENEFITS_LABEL },
        verifiedAt: VERIFIED_AT,
        tags: [
          { label: "$5k/trip", variant: "value" },
          { label: "$10k/yr" },
        ],
        panel: [
          {
            kind: "prose",
            eyebrow: "Restrictions",
            text: "Reimburses prepaid, nonrefundable trip costs lost to a covered cancellation reason — such as illness, severe weather, or jury duty. Up to $5,000 per trip / $10,000 per cardholder per 12-month period. Trip must be paid (in whole or part) with the Strata Premier.",
          },
          {
            kind: "prose",
            eyebrow: "How to file",
            text: "Document the cancellation reason. Submit your claim via Mastercard within 20 days of the event.",
          },
        ],
      },
      {
        id: "lost-luggage",
        cats: ["travel"],
        keywords: "lost damaged luggage 3000 insurance",
        title: "Lost or Damaged Luggage — up to $3,000 per covered trip",
        source: { url: TRAVEL_BENEFITS_URL, label: TRAVEL_BENEFITS_LABEL },
        verifiedAt: VERIFIED_AT,
        tags: [{ label: "$3k/trip", variant: "value" }],
        panel: [
          {
            kind: "prose",
            eyebrow: "Restrictions",
            text: "Up to $3,000 per covered trip ($2,000 per bag for NY residents). File via Mastercard within 60 days. Common-carrier ticket must be charged to the card.",
          },
        ],
      },
      {
        id: "ad-d",
        cats: ["travel"],
        keywords: "worldwide travel accident insurance death dismemberment 1000000",
        title: "Worldwide Travel Accident Insurance — up to $1,000,000",
        source: { url: TRAVEL_BENEFITS_URL, label: TRAVEL_BENEFITS_LABEL },
        verifiedAt: VERIFIED_AT,
        tags: [{ label: "$1M max", variant: "value" }],
        panel: [
          {
            kind: "prose",
            eyebrow: "Restrictions",
            text: "Up to $1,000,000 accidental death & dismemberment when the entire common-carrier fare (plane, train, ship, or bus) is charged to the card. Covers the cardmember and immediate family. See the Guide to Protection Benefits for the schedule of indemnities and exclusions.",
          },
        ],
      },
      {
        id: "masterrental",
        cats: ["travel"],
        keywords: "masterrental rental car cdw collision damage waiver",
        title: "MasterRental — rental car CDW (primary outside the US)",
        source: { url: TRAVEL_BENEFITS_URL, label: TRAVEL_BENEFITS_LABEL },
        verifiedAt: VERIFIED_AT,
        tags: [
          { label: "Primary abroad" },
          { label: "Secondary in US" },
        ],
        panel: [
          {
            kind: "bullets",
            eyebrow: "How to qualify",
            items: [
              "Reserve and pay for the entire rental with the Strata Premier in the renter's name.",
              "Decline the rental company's CDW/LDW at the counter.",
              "Coverage is secondary in your country of residence and primary outside it. Covers theft and collision damage.",
            ],
          },
          {
            kind: "prose",
            eyebrow: "Restrictions",
            text: "Excludes certain vehicle classes (exotic, antique, large trucks, motorcycles), some countries, and rentals over a maximum daily duration. File any claim within 45 days. Full exclusion list is in the Guide to Protection Benefits.",
          },
        ],
      },
    ],
  },
  {
    id: "shopping",
    eyebrow: "Shopping protections",
    rows: [
      {
        id: "purchase-protection",
        cats: ["shopping"],
        keywords: "purchase protection 90 days theft damage",
        title: "Purchase Protection — damage or theft within 90 days",
        source: { url: TRAVEL_BENEFITS_URL, label: TRAVEL_BENEFITS_LABEL },
        verifiedAt: VERIFIED_AT,
        tags: [
          { label: "$10k/claim", variant: "value" },
          { label: "$50k/yr" },
        ],
        panel: [
          {
            kind: "prose",
            eyebrow: "Restrictions",
            text: "Up to $10,000 per claim and $50,000 per cardholder per year. Covers damage or theft of items charged to the Strata Premier within 90 days of purchase. Keep your receipt and original packaging where possible. File via Mastercard within the 90-day window. Standard exclusions apply (motorized vehicles, perishables, animals, software, etc.).",
          },
        ],
      },
      {
        id: "extended-warranty",
        cats: ["shopping"],
        keywords: "extended warranty 24 months manufacturer",
        title: "Extended Warranty — adds 24 months to manufacturer warranties",
        source: { url: TRAVEL_BENEFITS_URL, label: TRAVEL_BENEFITS_LABEL },
        verifiedAt: VERIFIED_AT,
        tags: [
          { label: "$10k/item", variant: "value" },
          { label: "+24 months" },
        ],
        panel: [
          {
            kind: "prose",
            eyebrow: "Restrictions",
            text: "Adds 24 months to manufacturer warranties of 5 years or less, up to $10,000 per item. Industry-leading among $95-tier cards. Save the receipt and warranty terms. File via Mastercard once the original warranty ends and an issue arises. Excludes used items, items purchased for resale, motorized vehicles, and certain electronics — see the Guide to Protection Benefits.",
          },
        ],
      },
    ],
  },
  {
    id: "services",
    eyebrow: "Cardholder services",
    rows: [
      {
        id: "concierge",
        cats: ["services"],
        keywords: "concierge 24 7 lifestyle citi",
        title: "Citi Concierge — 24/7 lifestyle & travel desk",
        source: { url: PRODUCT_PAGE_URL, label: PRODUCT_PAGE_LABEL },
        verifiedAt: VERIFIED_AT,
        tags: [{ label: "Always on" }],
        panel: [
          {
            kind: "prose",
            text: "24/7 assistance with dining reservations, travel planning, and ticket purchases. Access via the number on the back of your card.",
          },
        ],
      },
      {
        id: "entertainment",
        cats: ["services"],
        keywords: "citi entertainment presale ticketmaster concert",
        title: "Citi Entertainment — presale tickets & experiences",
        source: { url: "https://www.citientertainment.com/", label: "Citi Entertainment" },
        verifiedAt: VERIFIED_AT,
        tags: [{ label: "Always on" }],
        panel: [
          {
            kind: "prose",
            text: "Exclusive access and presale tickets to concerts, sporting events, and cultural experiences. At checkout via Ticketmaster/TicketWeb, enter the first 6 digits of your Strata Premier as the offer passcode for Mastercard presales. Not available to business or commercial Mastercards.",
          },
        ],
      },
      {
        id: "no-fx",
        cats: ["travel"],
        keywords: "foreign transaction fee fx 0 abroad international",
        title: "No foreign transaction fees",
        source: { url: PRODUCT_PAGE_URL, label: PRODUCT_PAGE_LABEL },
        verifiedAt: VERIFIED_AT,
        tags: [{ label: "0% FX" }, { label: "Passive" }],
        panel: [
          {
            kind: "prose",
            text: "Saves ~3% versus cards that charge them. Use the Strata Premier for any foreign-merchant purchase — your no-AF Citi cards (Double Cash, Custom Cash) charge 3% FX, so this is the wallet's go-to abroad.",
          },
        ],
      },
      {
        id: "quick-lock",
        cats: ["services"],
        keywords: "citi quick lock app block",
        title: "Citi Quick Lock — instantly block new charges from the app",
        source: {
          url: "https://www.citi.com/credit-cards/credit-card-quicklock",
          label: "Citi Quick Lock",
        },
        verifiedAt: VERIFIED_AT,
        tags: [{ label: "Always on" }],
        panel: [
          {
            kind: "prose",
            text: "Lock your card instantly via the Citi mobile app if it's misplaced. Recurring autopayments and payments on file continue to process; new authorizations are declined while locked.",
          },
        ],
      },
    ],
  },
];

// ── Network groups ──────────────────────────────────────────────────────

const NETWORK_GROUPS: PerkGroup[] = [
  {
    id: "net-channels",
    eyebrow: "Earn channels",
    rows: [
      {
        id: "mc-travel-rewards",
        cats: ["network"],
        keywords:
          "mastercard travel rewards international cashback portal",
        title:
          "Mastercard Travel Rewards — international cashback portal",
        source: {
          url: "https://mtr.mastercardservices.com",
          label: "mtr.mastercardservices.com",
        },
        verifiedAt: VERIFIED_AT,
        tags: [{ label: "Login required" }],
        // No panel → renders as static row with bullet
      },
      {
        id: "mc-travel-booking",
        cats: ["network"],
        keywords:
          "mastercard travel booking hotel stay guarantee lifestyle manager",
        title: "Mastercard Travel — booking site with Hotel Stay Guarantee",
        source: {
          url: "https://travel.mastercard.com",
          label: "travel.mastercard.com",
        },
        verifiedAt: VERIFIED_AT,
        tags: [{ label: "Lifestyle Manager" }],
      },
      {
        id: "priceless",
        cats: ["network"],
        keywords: "priceless specials offers experiences mastercard",
        title:
          "Priceless Specials & priceless.com — curated experience marketplace",
        source: { url: "https://priceless.com", label: "priceless.com" },
        verifiedAt: VERIFIED_AT,
        tags: [{ label: "Curated" }],
      },
    ],
  },
  {
    id: "net-activate",
    eyebrow: "Activate to claim",
    rows: [
      {
        id: "mc-luxury",
        cats: ["network", "hotels"],
        keywords:
          "mastercard luxury hotels resorts amenity breakfast upgrade",
        title:
          "Mastercard Luxury Hotels & Resorts — $100 amenity + breakfast",
        source: {
          url: "https://www.mastercard.com/us/en/personal/find-a-card/credit-card/world-elite-mastercard.html",
          label: "Mastercard World Elite benefits",
        },
        verifiedAt: VERIFIED_AT,
        tags: [
          { label: "~$250/stay", variant: "value" },
          { label: "Per booking" },
        ],
        panel: [
          {
            kind: "bullets",
            eyebrow: "What you get per stay",
            checks: true,
            items: [
              "Complimentary breakfast for two",
              "Room upgrade, subject to availability",
              "$100 on-property amenity credit",
            ],
          },
          {
            kind: "prose",
            eyebrow: "Restrictions",
            text: "Booked via mastercard.com/luxuryhotels at 4,000+ properties. World Elite network benefit; separate from Citi-branded The Reserve / Hotel Collection programs at CitiTravel.com — you cannot stack on the same booking.",
          },
        ],
      },
      {
        id: "peacock",
        cats: ["network"],
        keywords: "peacock streaming mastercard 3 monthly",
        title: "$3/mo Peacock statement credit",
        source: {
          url: "https://www.peacocktv.com/mastercard",
          label: "Peacock × Mastercard",
        },
        verifiedAt: VERIFIED_AT,
        tags: [
          { label: "$36/yr", variant: "value" },
          { label: "Activate" },
        ],
        panel: [
          {
            kind: "prose",
            eyebrow: "How to activate",
            text: "Set the Strata Premier as the payment method on Peacock. The $3 credit posts as a statement credit within a few days of each Peacock charge. Mastercard World Elite benefit; replaces the prior DoorDash DashPass slot.",
          },
          {
            kind: "prose",
            eyebrow: "Restrictions",
            text: "Credit applies only to Peacock charges paid with the eligible Mastercard. Subject to Mastercard's network promotion calendar — currently locked in via Mastercard. Not stackable with other Peacock promotions.",
          },
        ],
      },
      {
        id: "lyft",
        cats: ["network"],
        keywords: "lyft rideshare 5 monthly mastercard",
        title: "$5/mo Lyft credit after 3+ rides",
        source: {
          url: "https://www.lyft.com/mastercard",
          label: "Lyft × Mastercard",
        },
        verifiedAt: VERIFIED_AT,
        tags: [
          { label: "$60/yr", variant: "value" },
          { label: "Enroll" },
        ],
        panel: [
          {
            kind: "prose",
            eyebrow: "How it works",
            text: "After 3+ Lyft rides in a calendar month with the Strata Premier, any further ride that month earns a $5 statement credit.",
          },
          {
            kind: "prose",
            eyebrow: "Restrictions",
            text: "Enrollment required at mastercard.com/lyft. Standard Lyft, shared, and lux rides eligible; rentals, Lyft Pink, and gift cards excluded. Limited to one $5 credit per calendar month.",
          },
        ],
      },
      {
        id: "instacart",
        cats: ["network"],
        keywords: "instacart grocery delivery 10 mastercard",
        title:
          "2 months free Instacart+ & $10 off second order monthly",
        source: {
          url: "https://www.instacart.com/mastercard",
          label: "Instacart × Mastercard",
        },
        verifiedAt: VERIFIED_AT,
        tags: [
          { label: "~$30/yr", variant: "value" },
          { label: "Enroll" },
        ],
        panel: [
          {
            kind: "prose",
            eyebrow: "How to activate",
            text: "Add the Strata Premier as a payment method in your Instacart account, then visit instacart.com/mastercard to claim. World Elite benefit, locked in via Mastercard through early 2027.",
          },
          {
            kind: "prose",
            eyebrow: "Restrictions",
            text: "$10 monthly credit applies only to your second order each calendar month placed with Instacart+. Trial converts to paid Instacart+ unless cancelled. New Instacart+ members only for the free trial.",
          },
        ],
      },
      {
        id: "transit-tap",
        cats: ["network"],
        keywords: "transit tap public mastercard 2.50",
        title: "$2.50/mo back when you tap to pay on public transit",
        source: {
          url: "https://www.mastercard.com/us/en/personal/find-a-card/card-benefits.html",
          label: "Mastercard Tap & Go transit",
        },
        verifiedAt: VERIFIED_AT,
        tags: [
          { label: "$30/yr", variant: "value" },
          { label: "Until 2027-12-31" },
        ],
        panel: [
          {
            kind: "prose",
            eyebrow: "How it works",
            text: "Tap to pay $10+ in a calendar month at participating systems and Mastercard kicks back $2.50 as a statement credit. Limit one credit per cardholder per calendar month. Posts within 60 days.",
          },
          {
            kind: "prose",
            eyebrow: "Eligible transit systems",
            text: "MBTA (Boston), CTA & Pace (Chicago), DART (Dallas), Miami-Dade, NJ Transit, PATH, SEPTA (Philadelphia), and WMATA (Washington DC).",
          },
        ],
      },
    ],
  },
  {
    id: "net-services",
    eyebrow: "Always-on",
    rows: [
      {
        id: "mc-id-theft",
        cats: ["network"],
        keywords: "mastercard id identity theft monitoring credit",
        title: "Mastercard ID Theft Protection — surface, deep, and dark web",
        source: {
          url: "https://mastercardus.idprotectiononline.com/",
          label: "Mastercard ID Theft Protection",
        },
        verifiedAt: VERIFIED_AT,
        tags: [{ label: "Enroll once" }],
        panel: [
          {
            kind: "prose",
            eyebrow: "Restrictions",
            text: "Identity-theft monitoring across surface, dark, and deep web; single-bureau (TransUnion) credit monitoring; access to a resolution specialist. Provided by Iris Powered by Generali. Cardholder must enroll at mastercardus.idprotectiononline.com to receive coverage.",
          },
        ],
      },
      {
        id: "mc-global-service",
        cats: ["network"],
        keywords:
          "mastercard global service emergency lost stolen replacement",
        title: "Mastercard Global Service — 24/7 worldwide emergency line",
        source: {
          url: "https://www.mastercard.com/us/en/personal/protection-and-security.html",
          label: "Mastercard Global Service",
        },
        verifiedAt: VERIFIED_AT,
        tags: [{ label: "Always on" }],
        panel: [
          {
            kind: "bullets",
            eyebrow: "Use it for",
            items: [
              "Lost or stolen card reporting",
              "Emergency card replacement (typically 24–72 hours)",
              "Emergency cash advance",
            ],
          },
          {
            kind: "prose",
            eyebrow: "Numbers to save",
            text: "US/Canada toll-free: 1-800-307-7309. Outside the US (collect): +1-636-722-7111. Available 24/7 in any country.",
          },
        ],
      },
      {
        id: "mc-zero-liability",
        cats: ["network"],
        keywords: "zero liability fraud unauthorized mastercard",
        title: "Mastercard Zero Liability — fraud charges aren't yours",
        source: {
          url: "https://www.mastercard.com/us/en/personal/protection-and-security/zero-liability-protection.html",
          label: "Mastercard Zero Liability",
        },
        verifiedAt: VERIFIED_AT,
        tags: [{ label: "Always on" }],
        panel: [
          {
            kind: "prose",
            eyebrow: "Restrictions",
            text: "Cardholder isn't held responsible for unauthorized transactions made in store, by phone, online, in app, or at ATMs — provided you used reasonable care and promptly reported loss or theft. Excludes commercial cards and unregistered prepaid cards.",
          },
        ],
      },
    ],
  },
];

// ───────────────────────────────────────────────────────────────────────
// Component
// ───────────────────────────────────────────────────────────────────────

export interface StrataPremierPageProps {
  card: Card;
  network: NetworkResearch | null;
  overlay: CardOverlayEntry | null;
  /** Reserved for future use — destination signal lighting in section 2.4 */
  userDestinationSignals?: string[];
}

export function StrataPremierPage({ card }: StrataPremierPageProps) {
  // ── State ───────────────────────────────────────────────────────────
  const [query, setQuery] = useState("");
  const [currentCat, setCurrentCat] = useState("all");
  const [openRows, setOpenRows] = useState<Set<string>>(new Set());
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [cpp, setCpp] = useState({ ...CPP_DEFAULTS });

  // ── Derived ─────────────────────────────────────────────────────────
  const tenureLabel = useMemo(() => computeTenure(month, year), [month, year]);

  const matches = useMemo(
    () => buildMatchFn(query.trim().toLowerCase(), currentCat),
    [query, currentCat],
  );

  const issuerVisible = useMemo(
    () => countVisibleRows(ISSUER_GROUPS, matches),
    [matches],
  );
  const networkVisible = useMemo(
    () => countVisibleRows(NETWORK_GROUPS, matches),
    [matches],
  );

  // ── Handlers ────────────────────────────────────────────────────────
  function toggle(rowId: string) {
    setOpenRows((s) => {
      const next = new Set(s);
      if (next.has(rowId)) next.delete(rowId);
      else next.add(rowId);
      return next;
    });
  }

  function expandAll() {
    const ids = new Set<string>();
    for (const groups of [ISSUER_GROUPS, NETWORK_GROUPS]) {
      for (const g of groups) {
        for (const r of g.rows) {
          if (r.panel && r.panel.length > 0 && matches(r)) ids.add(r.id);
        }
      }
    }
    setOpenRows(ids);
  }
  function collapseAll() {
    setOpenRows(new Set());
  }

  function setCppValue(key: keyof typeof cpp, raw: string) {
    let v = parseFloat(raw);
    if (isNaN(v)) v = 0;
    setCpp((prev) => ({ ...prev, [key]: v }));
  }
  function blurCppValue(key: keyof typeof cpp) {
    setCpp((prev) => {
      let v = prev[key];
      if (isNaN(v)) v = 0;
      v = Math.max(0, Math.min(5, v));
      v = Math.round(v * 10) / 10;
      return { ...prev, [key]: v };
    });
  }
  function resetCpp() {
    setCpp({ ...CPP_DEFAULTS });
  }

  // ── Render ──────────────────────────────────────────────────────────
  return (
    <main className="strata-page-v2">
      <a
        href="/wallet"
        className="back-link"
        aria-label="Back to wallet"
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M7.5 2.5 4 6l3.5 3.5" />
        </svg>
        Wallet
      </a>

      {/* ── HERO IDENTITY ───────────────────────── */}
      <section className="identity">
        <div className="card-art-editorial" aria-hidden="true">
          <div>
            <div className="card-art-issuer">
              Citi · Mastercard World Elite
            </div>
            <h2 className="card-art-name">Strata Premier</h2>
          </div>
          <div className="card-art-chip"></div>
          <div className="card-art-foot">
            <span>STRATA PREMIER</span>
            <span className="net">WORLD ELITE</span>
          </div>
        </div>

        <div className="id-right">
          <div className="eyebrow">Card · Mid-tier travel</div>
          <h1 className="id-name">{card.name}</h1>
          <p className="id-issuer">
            {card.issuer} · {card.network ?? "Mastercard World Elite"} · Citi
            ThankYou Rewards
          </p>

          <p className="id-positioning">
            Citi&apos;s $95 mid-tier travel card with broad 3× earn across the
            categories most people actually spend on — groceries, gas, dining,
            air, and hotel. One of two US transferable currencies that ships
            1:1 to American AAdvantage.
          </p>
        </div>

        <div className="identity-meta">
          <div className="meta-row">
            <div className="ownership">
              <span className="ownership-label">Owned since</span>
              <div className="ownership-fields">
                <select
                  aria-label="Month opened"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                >
                  <option value="">Mo</option>
                  <option value="1">Jan</option>
                  <option value="2">Feb</option>
                  <option value="3">Mar</option>
                  <option value="4">Apr</option>
                  <option value="5">May</option>
                  <option value="6">Jun</option>
                  <option value="7">Jul</option>
                  <option value="8">Aug</option>
                  <option value="9">Sep</option>
                  <option value="10">Oct</option>
                  <option value="11">Nov</option>
                  <option value="12">Dec</option>
                </select>
                <input
                  type="number"
                  min={1990}
                  max={2030}
                  placeholder="Year"
                  aria-label="Year opened"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                />
              </div>
              <span className="ownership-tenure" aria-live="polite">
                {tenureLabel}
              </span>
            </div>

            <div className="cpp-grid">
              <CppCard
                label="Cash"
                cppKey="cash"
                value={cpp.cash}
                defaultValue={CPP_DEFAULTS.cash}
                onChange={setCppValue}
                onBlur={blurCppValue}
              />
              <CppCard
                label="Citi Travel"
                cppKey="portal"
                value={cpp.portal}
                defaultValue={CPP_DEFAULTS.portal}
                onChange={setCppValue}
                onBlur={blurCppValue}
              />
              <CppCard
                label="Transfer"
                cppKey="transfer"
                value={cpp.transfer}
                defaultValue={CPP_DEFAULTS.transfer}
                onChange={setCppValue}
                onBlur={blurCppValue}
                best
              />
            </div>

            <button type="button" className="cpp-reset" onClick={resetCpp}>
              Reset
            </button>
          </div>
        </div>
      </section>

      {/* ── ISSUER BENEFITS ─────────────────────── */}
      <section className="section">
        <p className="section-byline">
          <strong>Citi Travel® Site:</strong>{" "}
          {CURRENCY_INTRO.replace("Citi Travel® Site: ", "")}
        </p>

        <div className="toolbar">
          <label className="toolbar-search">
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <circle cx="7" cy="7" r="4.5" />
              <path d="m10.5 10.5 3 3" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              placeholder='Filter perks — try "hotel", "Mastercard", "3×"…'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <button
            className="toolbar-btn"
            type="button"
            onClick={expandAll}
          >
            Expand all
          </button>
          <button
            className="toolbar-btn"
            type="button"
            onClick={collapseAll}
          >
            Collapse all
          </button>
        </div>

        <div className="quickchips" role="tablist" aria-label="Filter by category">
          {CHIPS.map((c) => (
            <button
              key={c.value}
              type="button"
              className="quickchip"
              data-active={currentCat === c.value}
              onClick={() => setCurrentCat(c.value)}
            >
              {c.label}
            </button>
          ))}
        </div>

        {ISSUER_GROUPS.map((g) => (
          <PerkGroupView
            key={g.id}
            group={g}
            matches={matches}
            openRows={openRows}
            onToggle={toggle}
          />
        ))}

        {issuerVisible === 0 ? (
          <p className="empty">No perks match that filter.</p>
        ) : null}
      </section>

      {/* ── NETWORK BENEFITS ────────────────────── */}
      <section className="section section--network">
        <div className="section-head">
          <h2 className="section-title">Mastercard World Elite Benefits</h2>
          <span className="section-counter">
            {networkVisible} {networkVisible === 1 ? "perk" : "perks"}
          </span>
        </div>
        <p className="section-byline">
          Network-level benefits the issuer doesn&apos;t market. Most are
          sitting there unused — a few need a one-time activation.
        </p>

        {NETWORK_GROUPS.map((g) => (
          <PerkGroupView
            key={g.id}
            group={g}
            matches={matches}
            openRows={openRows}
            onToggle={toggle}
          />
        ))}

        {networkVisible === 0 ? (
          <p className="empty">No network perks match that filter.</p>
        ) : null}
      </section>

      <p className="footnote">
        Source URLs are linked verbatim from the issuer&apos;s published terms
        or the network&apos;s benefits guide; the verification date is the last
        day this catalog refreshed against the live page. Restriction text
        inside expanded sections is verbatim from the Citi T&amp;C and
        Mastercard guide where applicable, and lightly summarized otherwise —
        never paraphrased away from the underlying rule.
      </p>
    </main>
  );
}

// ───────────────────────────────────────────────────────────────────────
// Subcomponents
// ───────────────────────────────────────────────────────────────────────

function PerkGroupView({
  group,
  matches,
  openRows,
  onToggle,
}: {
  group: PerkGroup;
  matches: (row: PerkRow) => boolean;
  openRows: Set<string>;
  onToggle: (id: string) => void;
}) {
  const visibleRows = group.rows.filter(matches);
  const empty = visibleRows.length === 0;
  return (
    <>
      <div className="group-divider" data-empty={empty}>
        <span className="eyebrow">{group.eyebrow}</span>
        <span className="rule"></span>
      </div>
      <ul className="perk-list" data-empty={empty}>
        {group.rows.map((row) => (
          <PerkRowView
            key={row.id}
            row={row}
            visible={matches(row)}
            open={openRows.has(row.id)}
            onToggle={() => onToggle(row.id)}
          />
        ))}
      </ul>
    </>
  );
}

function PerkRowView({
  row,
  visible,
  open,
  onToggle,
}: {
  row: PerkRow;
  visible: boolean;
  open: boolean;
  onToggle: () => void;
}) {
  const isStatic = !row.panel || row.panel.length === 0;
  const HeadEl: React.ElementType = isStatic ? "div" : "button";
  return (
    <li
      className={`perk-row${isStatic ? " is-static" : ""}`}
      data-cat={row.cats.join(" ")}
      data-keywords={row.keywords}
      data-hidden={!visible}
      data-open={open}
    >
      <HeadEl
        className="perk-head"
        type={isStatic ? undefined : "button"}
        aria-expanded={isStatic ? undefined : open}
        onClick={isStatic ? undefined : onToggle}
      >
        {isStatic ? (
          <span className="perk-bullet" aria-hidden="true"></span>
        ) : (
          <svg
            className="perk-caret"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m6 4 4 4-4 4" />
          </svg>
        )}
        <div className="perk-titleblock">
          <h3 className="perk-title">{row.title}</h3>
          <div className="perk-meta">
            <a
              className="source-link"
              href={row.source.url}
              target="_blank"
              rel="noreferrer noopener"
              onClick={(e) => e.stopPropagation()}
            >
              {row.source.label}
            </a>
            <span className="verified">Verified {row.verifiedAt}</span>
          </div>
        </div>
        <div className="perk-tags">
          {row.tags.map((t, i) => (
            <span
              key={i}
              className={`tag${t.variant ? ` tag--${t.variant}` : ""}`}
            >
              {t.label}
            </span>
          ))}
        </div>
      </HeadEl>
      {!isStatic ? (
        <div className="perk-panel">
          <div className="perk-panel-inner">
            <div className="perk-body">
              {row.panel!.map((blk, i) => renderPanelBlock(blk, i))}
            </div>
          </div>
        </div>
      ) : null}
    </li>
  );
}

function renderPanelBlock(blk: PanelBlock, key: number) {
  if (blk.kind === "prose") {
    const content = (
      <>
        {blk.eyebrow ? <p className="panel-eyebrow">{blk.eyebrow}</p> : null}
        <p className="panel-prose">{blk.text}</p>
      </>
    );
    return (
      <div key={key} className={blk.emphasized ? "panel-block" : undefined}>
        {content}
      </div>
    );
  }
  // bullets
  return (
    <div key={key} className={blk.emphasized ? "panel-block" : undefined}>
      {blk.eyebrow ? <p className="panel-eyebrow">{blk.eyebrow}</p> : null}
      <ul
        className={`panel-bullets${blk.checks ? " panel-bullets--checks" : ""}`}
      >
        {blk.items.map((it, i) => (
          <li key={i}>{it}</li>
        ))}
      </ul>
    </div>
  );
}

function CppCard({
  label,
  cppKey,
  value,
  defaultValue,
  onChange,
  onBlur,
  best,
}: {
  label: string;
  cppKey: "cash" | "portal" | "transfer";
  value: number;
  defaultValue: number;
  onChange: (key: "cash" | "portal" | "transfer", raw: string) => void;
  onBlur: (key: "cash" | "portal" | "transfer") => void;
  best?: boolean;
}) {
  const edited = Math.abs(value - defaultValue) > 0.0001;
  return (
    <div className="cpp-card" data-best={best}>
      <div className="cpp-label">{label}</div>
      <div className="cpp-input-wrap">
        <input
          type="number"
          className="cpp-value"
          value={Number.isFinite(value) ? value : 0}
          step={0.1}
          min={0}
          max={5}
          inputMode="decimal"
          aria-label={`Cents per point — ${label}`}
          onChange={(e) => onChange(cppKey, e.target.value)}
          onBlur={() => onBlur(cppKey)}
        />
        <span className="cpp-unit">¢ / pt</span>
      </div>
      <svg
        className="cpp-pencil"
        viewBox="0 0 14 14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="m9.5 2.5 2 2-7 7H2.5v-2l7-7z" />
      </svg>
      {edited ? <span className="cpp-edited-flag">Edited</span> : null}
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────
// Pure helpers
// ───────────────────────────────────────────────────────────────────────

function computeTenure(month: string, year: string): string {
  const m = parseInt(month, 10);
  const y = parseInt(year, 10);
  if (!m || !y || y < 1990 || y > 2100) return "—";
  const opened = new Date(y, m - 1, 1);
  const now = new Date();
  let months =
    (now.getFullYear() - opened.getFullYear()) * 12 +
    (now.getMonth() - opened.getMonth());
  if (months < 0) return "future";
  if (months < 1) return "this month";
  if (months < 12) return `${months} mo`;
  const years = Math.floor(months / 12);
  const rem = months % 12;
  return `${years}y${rem ? ` ${rem}mo` : ""}`;
}

function buildMatchFn(qLower: string, currentCat: string) {
  return (row: PerkRow): boolean => {
    const matchesCat =
      currentCat === "all" || row.cats.includes(currentCat);
    if (!matchesCat) return false;
    if (!qLower) return true;
    if (row.title.toLowerCase().includes(qLower)) return true;
    if (row.keywords.toLowerCase().includes(qLower)) return true;
    return false;
  };
}

function countVisibleRows(
  groups: PerkGroup[],
  matches: (row: PerkRow) => boolean,
): number {
  let n = 0;
  for (const g of groups) for (const r of g.rows) if (matches(r)) n++;
  return n;
}
