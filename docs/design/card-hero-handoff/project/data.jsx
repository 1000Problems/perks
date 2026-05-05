// Realistic-shape Strata Premier data, condensed from perks/data/cards.json
// for the mockup. Not the full schema — just what the page renders.

const STRATA = {
  id: "citi_strata_premier",
  name: "Citi Strata Premier Card",
  issuer: "Citi",
  network: "Mastercard World Elite",
  annual_fee: 95,
  currency: { id: "citi_thankyou", short: "Citi TY", name: "ThankYou Points" },
  signup_bonus: { pts: 75000, spend: 4000, months: 3, value: 1100 },
  positioning:
    "Citi's $95 mid-tier travel card — broad 3× on travel, dining, supermarkets, gas/EV, plus 10× on the Citi Travel portal. The cheapest path to ThankYou transferable points.",
  source_url:
    "https://online.citi.com/US/ag/cards/displayterms?app=UNSOL&HKOP=...",
  source_label: "Citi Strata Premier card terms",
  verified_at: "2026-05-04",

  earning: [
    { rate: 10, headline: "Hotels, cars & attractions on Citi Travel", note: "Booked at cititravel.com" },
    { rate: 3,  headline: "Air travel" },
    { rate: 3,  headline: "Other hotel purchases" },
    { rate: 3,  headline: "Restaurants" },
    { rate: 3,  headline: "Supermarkets", note: "Excludes superstores, warehouse clubs, drugstores, meal kits" },
    { rate: 3,  headline: "Gas & EV charging stations" },
    { rate: 1,  headline: "Everything else" },
  ],

  // The arrival hero number — in the real app this is computed from the
  // user's spend profile × earning rate × portal cpp. Hardcoded here.
  projected_rewards_usd: 1240,

  cpp_defaults: { cash: 1.0, portal: 1.25, transfer: 1.9 },

  deadlines: [
    { text: "Citi point-sharing closes", days: 13 },
    { text: "Choice Privileges 1:2 → 1:1.5 transfer ratio drop", days: 24 },
  ],

  // Recurring credits + annual credits + perks, simplified into one
  // "what's worth using" stream split by group.
  groups: [
    {
      id: "hotels",
      label: "Hotels",
      summary: 460,
      source_url: "https://www.citi.com/credit-cards/citi-strata-premier-credit-card",
      source_label: "Citi card page",
      items: [
        {
          id: "reserve_experience_credit",
          headline: "$100 every Reserve hotel stay — repeats, no annual cap",
          personal: "If you book 3–5 Reserve stays a year, that's $300–$500 in hotel credit, plus breakfast, upgrades, and Wi-Fi each time.",
          value: "$100/stay",
          status: null,
          frequency: "1-2",
          companions: ["Daily breakfast for two", "Room upgrade (subject to availability)", "Complimentary Wi-Fi", "Early check-in", "Late check-out"],
        },
        {
          id: "annual_hotel_credit",
          headline: "$100 hotel credit on a $500+ stay",
          personal: "Once per calendar year, applied instantly when you book a $500+ stay through CitiTravel.com.",
          value: "$100/yr",
          status: null,
        },
        {
          id: "mc_luxury",
          headline: "Mastercard Luxury Hotels & Resorts",
          personal: "Breakfast, upgrade, and a $100 amenity credit at 4,000+ properties booked via mastercard.com/luxuryhotels.",
          value: "~$250/stay",
          status: null,
        },
      ],
    },
    {
      id: "airlines",
      label: "Airlines",
      summary: 380,
      source_url: "https://www.citi.com/credit-cards/credit-card-rewards/citi-strata-premier-travel-benefits",
      source_label: "Citi travel benefits",
      items: [
        {
          id: "transfer_to_aa",
          headline: "Transfer ThankYou to American AAdvantage",
          personal: "Citi is the only major bank that transfers to AA. 1¢/pt floor → 4¢+ on AA premium-cabin awards.",
          value: "$240+/yr",
          status: "going_to",
        },
        {
          id: "transfer_to_va",
          headline: "Transfer to Virgin Atlantic Flying Club",
          personal: "Sweet spot: 60k VS pts books ANA First Class one-way to Tokyo.",
          value: "$1,800+",
          status: null,
        },
      ],
    },
    {
      id: "credits",
      label: "Recurring credits",
      summary: 96,
      source_url: "https://www.peacocktv.com/mastercard",
      source_label: "Mastercard partner",
      items: [
        {
          id: "lyft",
          headline: "Lyft monthly credit",
          personal: "$5 each month after 3+ Lyft rides. Enroll once at mastercard.com/lyft.",
          value: "$60/yr",
          status: "using",
        },
        {
          id: "peacock",
          headline: "Peacock monthly credit",
          personal: "$3/mo statement credit when you pay your Peacock subscription with this card.",
          value: "$36/yr",
          status: null,
        },
      ],
    },
    {
      id: "protection",
      label: "Travel protection",
      summary: null,
      source_url: "https://www.citi.com/credit-cards/credit-card-rewards/citi-strata-premier-travel-benefits",
      source_label: "Citi travel benefits",
      items: [
        {
          id: "trip_delay",
          headline: "Trip Delay Protection",
          personal: "Up to $500/trip when delayed 6+ hours, 2 claims per 12 months.",
          value: "claim",
          status: null,
        },
        {
          id: "trip_cancel",
          headline: "Trip Cancellation & Interruption",
          personal: "Up to $5,000/trip for nonrefundable trip costs lost to a covered reason.",
          value: "claim",
          status: null,
        },
        {
          id: "luggage",
          headline: "Lost or Damaged Luggage",
          personal: "Up to $3,000 per covered trip ($2,000/bag for NY).",
          value: "claim",
          status: null,
        },
      ],
    },
    {
      id: "shopping",
      label: "Shopping protection",
      summary: null,
      source_url: "https://www.citi.com/credit-cards/credit-card-rewards/citi-strata-premier-travel-benefits",
      source_label: "Citi travel benefits",
      items: [
        {
          id: "ext_warranty",
          headline: "Extended Warranty — +24 months",
          personal: "Industry-leading among $95-tier cards. Adds 24 months on manufacturer warranties of 5 years or less.",
          value: "claim",
          status: "using",
        },
        {
          id: "purchase_protection",
          headline: "Purchase Protection",
          personal: "Up to $10,000/claim for damage or theft within 90 days.",
          value: "claim",
          status: null,
        },
      ],
    },
  ],
};

// Held-card state — would normally come from the user profile.
const HELD = {
  opened_at: "2024-08-01",
  bonus_received: true,
  authorized_users: 1,
  pool_status: "yes",
  status: "active",
  nickname: "",
};

window.STRATA = STRATA;
window.HELD = HELD;
