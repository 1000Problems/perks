"use client";

// Brand-new card page for Citi Strata Premier built from the two design
// docs:
//   - docs/SECTION_1_FROM_OFFICIAL_CARD_DOCS.md
//   - docs/SECTION_2_FROM_NETWORK_RESEARCH.md
//
// Section 1 pulls from the card markdown (cards/citi_strata_premier.md
// → cards.json). Section 2 pulls from the network research JSON
// (cards/_NETWORK_RESEARCH/world_elite_mastercard_*.json) filtered by
// the card's overlay entry.
//
// Header pricing facts (APR ranges, penalty fees) are not yet in the
// schema. They live in the disclosures doc — see the PRICING constant
// below. TODO(schema): add APR fields to CardSchema, repopulate
// cards/*.md, drop this constant.

import { useMemo } from "react";
import type { Card } from "@/lib/data/loader";
import type {
  NetworkResearch,
  CardOverlayEntry,
  BenefitEntry,
  EarnChannelEntry,
  DestinationEntry,
} from "@/lib/data/networkResearch";

// ── Pricing constants (from cards/_REF_citi_strata_official.md, verbatim) ─
//
// These are the Schumer-box facts that don't live in the card schema yet.
// Source URL is the same as every Strata Premier issuer source already in
// the card markdown.
const PRICING = {
  source_url:
    "https://online.citi.com/US/ag/cards/displayterms?app=UNSOL&HKOP=14da5ef2c3aff980790d0f188b27d0a954e3592a191ef6ca71244ad26383b1aa",
  source_label: "Citi Strata Premier disclosures",
  annual_fee: "$95",
  foreign_purchase: "None",
  purchase_apr: "19.49% – 27.49% variable",
  cash_advance_apr: "29.74% variable",
  penalty_apr: "up to 29.99%",
  late_payment: "up to $41",
  returned_payment: "up to $41",
} as const;

// ── Section 1 currency intro paragraph (verbatim from disclosures) ──────
const CURRENCY_INTRO = `Citi Travel® Site: You will earn 10 ThankYou Points for each $1 spent on hotels, car rentals, and attractions when you use your Citi Strata Premier Card to book them through the Citi Travel site via cititravel.com or 1-833-737-1288 (TTY: 711). For bookings made with a combination of points and your Citi Strata Premier Card, only the portion paid with your card will earn points. Points are not earned on cancelled bookings. If your account is closed for any reason, including if you convert to another card product, you will no longer be eligible for this offer. Citi Travel is powered by Rocket Travel by Agoda.`;

// ── Section 1 earn rows (verbatim title + restrictions from disclosures) ─
//
// One row per earn rate. Title is the human-readable form ("10x on X"),
// restrictions are pulled verbatim from the "definitions apply to the
// categories" subsections of the source doc. We don't paraphrase.
const EARN_ROWS: Array<{
  title: string;
  restrictions: string;
}> = [
  {
    title: "10x on hotels, car rentals, attractions booked through Citi Travel",
    restrictions:
      "For bookings made with a combination of points and your Citi Strata Premier Card, only the portion paid with your card will earn points. Points are not earned on cancelled bookings. If your account is closed for any reason, including if you convert to another card product, you will no longer be eligible for this offer. Citi Travel is powered by Rocket Travel by Agoda.",
  },
  {
    title: "3x on air travel and other hotel purchases",
    restrictions:
      "Includes purchases at airlines, hotels (not booked through the Citi Travel site via cititravel.com), and travel agencies.",
  },
  {
    title: "3x on restaurants",
    restrictions:
      "Includes purchases at cafes, bars, lounges, fast-food restaurants, restaurant delivery services, and take out restaurants. Excludes purchases at bakeries, caterers, and restaurants located inside another business (such as hotels, stores, stadiums, grocery stores, or warehouse clubs). You will not earn 3 ThankYou Points on restaurant gift card purchases if the merchant does not use the restaurant merchant category code.",
  },
  {
    title: "3x on supermarkets",
    restrictions:
      "Excludes purchases made at general merchandise/discount superstores; freezer/meat locker provisioners; dairy product stores; miscellaneous food/convenience stores; drugstores; warehouse/wholesale clubs; specialty food markets; bakeries; candy, nut, and confectionery stores; and meal kit delivery services. Purchases made at online supermarkets or with grocery delivery services do not qualify if the merchant does not classify itself as a supermarket by using the supermarket merchant code.",
  },
  {
    title: "3x on gas and EV charging stations",
    restrictions:
      "Excludes gas and EV charging purchases at warehouse clubs, discount stores, department stores, convenience stores or other merchants that are not classified as gas stations or EV charging using the gas station or EV charging merchant codes.",
  },
  {
    title: "1x on all other purchases",
    restrictions: "Includes the non-qualifying purchases listed above.",
  },
];

// $100 Annual Hotel Benefit — title is verbatim from rewards summary,
// restrictions block is the dedicated benefit subsection in full.
const ANNUAL_CREDIT_HOTEL = {
  title:
    "Cardmembers will also be eligible to receive the $100 Annual Hotel Benefit.",
  restrictions:
    "Once per calendar year, enjoy $100 off a single hotel stay of $500 or more, excluding taxes and fees, when booked through the Citi Travel site via CitiTravel.com (Citi Travel is powered by Rocket Travel by Agoda) or 1-833-737-1288 (TTY: 711). To receive the $100 Annual Hotel Benefit, you must pre-pay for your complete stay with your Citi Strata Premier Card, ThankYou® Points, or a combination thereof. If you choose to use the benefit, the $100 Annual Hotel Benefit will be applied to your reservation at the time of booking. If you cancel a booking for which you used the $100 Annual Hotel Benefit, the benefit will be returned to your account after the cancellation is processed and will remain available for use on any remaining days in the same calendar year. If you use your annual hotel benefit for a non-refundable hotel purchase and you cancel your hotel booking, you forfeit the annual hotel benefit that you used to make that purchase. All reservations must be changed or canceled through the Citi Travel site via cititravel.com or 1-833-737-1288 (TTY: 711). If your hotel purchase qualifies for the $100 Annual Hotel Benefit, you won't earn points on the portion of the purchase that is offset by the benefit.",
  eligibility: [
    "Reservations must be made by the primary cardmember. Reservations can be made in the primary cardmember's or authorized user's names.",
    "Package rates such as air and hotel, or hotel and car rental do not qualify for the benefit.",
    "Reservations made through any party or channel other than the Citi Travel site via cititravel.com or 1-833-737-1288 (TTY: 711) are not eligible for the $100 Annual Hotel Benefit.",
    "The $100 Annual Hotel Benefit cannot be combined in the same transaction with the Citi Prestige® Card Complimentary 4th Night hotel benefit if you have both the Citi Strata Premier and Citi Prestige cards. This benefit also cannot be combined with any other promotions or discounts on thankyou.com.",
  ],
};

// The Reserve recurring benefit — verbatim bundle list + restrictions.
const RESERVE_RECURRING = {
  title:
    "The Reserve Benefits (Citi Strata Elite℠, Citi Strata Premier®, and Citi Prestige® cardmembers)",
  bundle: [
    "$100.00 (USD) Experience Credit",
    "Room Upgrade, upon availability",
    "Daily Breakfast for Two",
    "Complimentary Wi-Fi",
    "Early Check-In, upon availability",
    "Late Check-Out, upon availability",
  ],
  restrictions: [
    "$100.00 Experience Credit (The Reserve rates only): The complimentary $100.00 Experience Credit is determined by each hotel and shall be valued at $100.00 (USD). The $100.00 Experience Credit may be in the form of a credit or gift card, provided directly by the hotel. Certain services subject to the $100.00 USD Experience Credit may require advance reservations. Back-to-back stays within 24 hours at the same hotel are considered one stay. Benefits shall be awarded once per stay. If the $100.00 Experience Credit and other benefits are not consumed during the eligible stay, no refunds or compensation shall be provided to you and the remaining balance will be forfeited.",
    "Room Upgrades (The Reserve rates only): Room Upgrades are based on availability and only certain hotel room categories may be available for upgrade.",
    "Daily Breakfast for Two (The Reserve rates): Daily Breakfast for Two is included and may be provided directly by the hotel or in the form of a gift card or credit. If breakfast is included as a standard amenity of the hotel, no additional compensation or amenity will be provided to you.",
    "Complimentary Wi-Fi (The Reserve rates and Hotel Collection): Complimentary Wi-Fi is provided, with the exception of select hotels where Wi-Fi is included as part of a mandatory daily resort fee or is not available.",
    "Check-In/Check-Out (The Reserve rates and Hotel Collection): Early Check-In eligibility is determined at time of check-in and is subject to availability. Late Check-Out eligibility is determined at time of check-in and is subject to availability.",
    "General: Both The Reserve Benefits and Hotel Collection Benefits are subject to change, availability, may vary by hotel and benefits cannot be redeemed for cash and may not be combined with any other offers. Benefits must be used during the stay booked and may not be used at a later date.",
  ],
};

// ── Coverage labels for Section 2.5 ─────────────────────────────────────
//
// Section 2.5 deliberately strips underwriter / claim / coverage nuance.
// Just the benefit name and the limit phrase. Map the network research
// id → short label + limit phrase. Order is editorial, not from JSON.
const COVERAGE_LABELS: Record<string, { label: string; limit: string }> = {
  mc_masterrental_cdw: {
    label: "Rental car damage",
    limit: "Secondary in US, primary abroad",
  },
  mc_trip_cancellation_interruption: {
    label: "Trip cancellation/interruption",
    limit: "Up to $5,000 per trip ($10,000/year)",
  },
  mc_trip_delay: {
    label: "Trip delay 6+ hours",
    limit: "Up to $500 per trip",
  },
  mc_lost_damaged_luggage: {
    label: "Lost or damaged luggage",
    limit: "Up to $3,000 per trip",
  },
  mc_purchase_protection: {
    label: "Purchase protection",
    limit: "Up to $10,000 per item, 90 days",
  },
  mc_extended_warranty: {
    label: "Extended warranty",
    limit: "+24 months on US manufacturer warranties",
  },
};

// ── Component props ─────────────────────────────────────────────────────

export interface StrataPremierPageProps {
  card: Card;
  network: NetworkResearch | null;
  overlay: CardOverlayEntry | null;
  /** User's destination signals — drives chip lighting in Section 2.4. */
  userDestinationSignals?: string[];
}

// ── Helpers ─────────────────────────────────────────────────────────────

function isPartnerOffer(b: BenefitEntry): boolean {
  return b.subtype === "partner_offer";
}

function isIdTheft(b: BenefitEntry): boolean {
  return b.id === "mc_id_theft_protection";
}

function alwaysOnFilter(b: BenefitEntry): boolean {
  // "Always-on" bucket: anything that isn't a partner offer.
  // ID Theft Protection lives here despite enrollment — the
  // Section 2 doc treats it as always-on with an inline link.
  return !isPartnerOffer(b);
}

function activateFilter(b: BenefitEntry): boolean {
  // "Activate to claim" bucket: partner offers only. ID Theft is
  // explicitly excluded per the Section 2 spec.
  return isPartnerOffer(b) && !isIdTheft(b);
}

function fmtUsd(n: number): string {
  return `$${n.toLocaleString("en-US")}`;
}

// ── Atomic units ────────────────────────────────────────────────────────

interface PerkCardProps {
  title: string;
  notes?: string | null;
  sourceUrl: string;
  sourceLabel?: string;
  valueChip?: string | null;
  expiresChip?: string | null;
  statusPill?: "auto-applied" | "activate" | "always-on" | null;
  enrollmentUrl?: string | null;
  inlineEnrollLabel?: string | null;
}

function PerkCard({
  title,
  notes,
  sourceUrl,
  sourceLabel,
  valueChip,
  expiresChip,
  statusPill,
  enrollmentUrl,
  inlineEnrollLabel,
}: PerkCardProps) {
  return (
    <article className="perk-card">
      <header className="perk-card__head">
        <h4 className="perk-card__title">{title}</h4>
        <div className="perk-card__chips">
          {statusPill ? (
            <span className={`pill pill--${statusPill}`}>{statusPill}</span>
          ) : null}
          {valueChip ? <span className="chip chip--value">{valueChip}</span> : null}
          {expiresChip ? (
            <span className="chip chip--expires">{expiresChip}</span>
          ) : null}
        </div>
      </header>
      {notes ? <p className="perk-card__notes">{notes}</p> : null}
      <footer className="perk-card__foot">
        <a
          className="perk-card__source"
          href={sourceUrl}
          target="_blank"
          rel="noreferrer noopener"
        >
          Source{sourceLabel ? ` · ${sourceLabel}` : ""}
        </a>
        {inlineEnrollLabel && enrollmentUrl ? (
          <a
            className="perk-card__inline-enroll"
            href={enrollmentUrl}
            target="_blank"
            rel="noreferrer noopener"
          >
            {inlineEnrollLabel}
          </a>
        ) : null}
      </footer>
      {enrollmentUrl && !inlineEnrollLabel ? (
        <a
          className="perk-card__cta"
          href={enrollmentUrl}
          target="_blank"
          rel="noreferrer noopener"
        >
          Activate now →
        </a>
      ) : null}
    </article>
  );
}

interface RestrictionCardProps {
  title: string;
  sourceUrl: string;
  restrictions: string;
  bullets?: string[];
}

function RestrictionCard({
  title,
  sourceUrl,
  restrictions,
  bullets,
}: RestrictionCardProps) {
  return (
    <article className="perk-card perk-card--issuer">
      <header className="perk-card__head">
        <h4 className="perk-card__title">{title}</h4>
      </header>
      <p className="perk-card__notes">{restrictions}</p>
      {bullets && bullets.length > 0 ? (
        <ul className="perk-card__bullets">
          {bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      ) : null}
      <footer className="perk-card__foot">
        <a
          className="perk-card__source"
          href={sourceUrl}
          target="_blank"
          rel="noreferrer noopener"
        >
          Source · Citi Strata Premier disclosures
        </a>
      </footer>
    </article>
  );
}

// ── The page ────────────────────────────────────────────────────────────

export function StrataPremierPage({
  card,
  network,
  overlay,
  userDestinationSignals = [],
}: StrataPremierPageProps) {
  // Index of enabled network benefit ids on this card.
  const enabledIds = useMemo(
    () => new Set(overlay?.enabled_network_benefits ?? []),
    [overlay],
  );

  const allBenefits: BenefitEntry[] = useMemo(() => {
    if (!network) return [];
    return [...network.universal_benefits, ...network.tier_specific_benefits];
  }, [network]);

  const enabledBenefits = useMemo(
    () => allBenefits.filter((b) => enabledIds.has(b.id)),
    [allBenefits, enabledIds],
  );

  const enabledEarnChannels: EarnChannelEntry[] = useMemo(
    () =>
      (network?.earn_channels ?? []).filter((c) => enabledIds.has(c.id)),
    [network, enabledIds],
  );

  const enabledDestinations: DestinationEntry[] = useMemo(
    () =>
      (network?.destination_benefits ?? []).filter((d) =>
        enabledIds.has(d.id),
      ),
    [network, enabledIds],
  );

  const enabledInsurance: BenefitEntry[] = useMemo(
    () =>
      (network?.insurance_protection ?? []).filter((b) =>
        enabledIds.has(b.id),
      ),
    [network, enabledIds],
  );

  const activatePerks = useMemo(
    () =>
      enabledBenefits.filter(activateFilter).sort((a, b) => {
        const av = a.value_estimate_usd ?? 0;
        const bv = b.value_estimate_usd ?? 0;
        return bv - av;
      }),
    [enabledBenefits],
  );

  const alwaysOnPerks = useMemo(
    () => enabledBenefits.filter(alwaysOnFilter),
    [enabledBenefits],
  );

  const userDestinationSet = useMemo(
    () => new Set(userDestinationSignals),
    [userDestinationSignals],
  );

  const guideToBenefitsUrl = overlay?.guide_to_benefits_url ?? null;

  return (
    <main className="strata-page-v1">
      {/* ────────────── SECTION 1 ────────────── */}
      <section className="section section--header">
        <div className="header-grid">
          <div className="header-identity">
            <h1 className="card-name">{card.name}</h1>
            <p className="card-issuer">{card.issuer}</p>
          </div>
          <dl className="header-pricing">
            <div className="pricing-row">
              <dt>Annual Fee</dt>
              <dd>{PRICING.annual_fee}</dd>
            </div>
            <div className="pricing-row">
              <dt>Foreign Purchase</dt>
              <dd>{PRICING.foreign_purchase}</dd>
            </div>
            <div className="pricing-row">
              <dt>Purchase APR</dt>
              <dd>{PRICING.purchase_apr}</dd>
            </div>
            <div className="pricing-row">
              <dt>Cash Advance APR</dt>
              <dd>{PRICING.cash_advance_apr}</dd>
            </div>
            <div className="pricing-row">
              <dt>Penalty APR</dt>
              <dd>{PRICING.penalty_apr}</dd>
            </div>
            <div className="pricing-row">
              <dt>Late / Returned Payment</dt>
              <dd>{PRICING.late_payment}</dd>
            </div>
          </dl>
        </div>
        <a
          className="header-source"
          href={PRICING.source_url}
          target="_blank"
          rel="noreferrer noopener"
        >
          Source · {PRICING.source_label}
        </a>
      </section>

      <section className="section section--intro">
        <h2 className="section-heading">{card.name} Benefits</h2>
        <blockquote className="currency-intro">
          <p>{CURRENCY_INTRO}</p>
        </blockquote>
      </section>

      <section className="section section--earn">
        <h3 className="subsection-heading">Earn</h3>
        <div className="earn-grid">
          {EARN_ROWS.map((row) => (
            <RestrictionCard
              key={row.title}
              title={row.title}
              sourceUrl={PRICING.source_url}
              restrictions={row.restrictions}
            />
          ))}
        </div>
      </section>

      <section className="section section--annual-credits">
        <h3 className="subsection-heading">Annual Credits</h3>
        <div className="single-card">
          <RestrictionCard
            title={ANNUAL_CREDIT_HOTEL.title}
            sourceUrl={PRICING.source_url}
            restrictions={ANNUAL_CREDIT_HOTEL.restrictions}
            bullets={ANNUAL_CREDIT_HOTEL.eligibility}
          />
        </div>
      </section>

      <section className="section section--recurring">
        <h3 className="subsection-heading">Recurring Benefits — The Reserve</h3>
        <div className="recurring-grid">
          <article className="perk-card perk-card--issuer">
            <header className="perk-card__head">
              <h4 className="perk-card__title">{RESERVE_RECURRING.title}</h4>
            </header>
            <h5 className="perk-card__sub">What you get</h5>
            <ul className="perk-card__bundle">
              {RESERVE_RECURRING.bundle.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            <h5 className="perk-card__sub">Restrictions</h5>
            <ul className="perk-card__bullets">
              {RESERVE_RECURRING.restrictions.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
            <footer className="perk-card__foot">
              <a
                className="perk-card__source"
                href={PRICING.source_url}
                target="_blank"
                rel="noreferrer noopener"
              >
                Source · Citi Strata Premier disclosures
              </a>
            </footer>
          </article>
        </div>
      </section>

      {/* ────────────── SECTION 2 ────────────── */}
      {network && overlay ? (
        <>
          <section className="section section--s2-header">
            <h2 className="section-heading">
              Additional perks from {network.research_run.network}
            </h2>
            <p className="section-byline">
              Network-level benefits the issuer doesn&apos;t market. Most are
              sitting there unused — a few need a one-time activation.
            </p>
          </section>

          {/* 2.1 Earn channels — top of Section 2 */}
          {enabledEarnChannels.length > 0 ? (
            <section className="section section--earn-channels">
              <h3 className="subsection-heading">Earn channels</h3>
              <ul className="channel-list">
                {enabledEarnChannels.map((c) => (
                  <li className="channel-row" key={c.id}>
                    <div className="channel-row__name">{c.name}</div>
                    <div className="channel-row__kind">{kindLabel(c.kind)}</div>
                    <a
                      className="channel-row__link"
                      href={c.enrollment_url}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      {hostnameOf(c.enrollment_url)}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {/* 2.2 Activate to claim */}
          {activatePerks.length > 0 ? (
            <section className="section section--activate">
              <h3 className="subsection-heading">Activate to claim</h3>
              <p className="subsection-byline">
                One-time enrollment. Skip these and you leave money on the
                table every month.
              </p>
              <div className="activate-grid">
                {activatePerks.map((p) => (
                  <PerkCard
                    key={p.id}
                    title={p.name}
                    notes={p.notes}
                    sourceUrl={p.source.url}
                    sourceLabel={p.source.label}
                    statusPill="activate"
                    valueChip={
                      p.value_estimate_usd
                        ? `${fmtUsd(p.value_estimate_usd)}/yr`
                        : null
                    }
                    expiresChip={
                      p.expires_at ? `Expires ${p.expires_at}` : null
                    }
                    enrollmentUrl={p.enrollment_url}
                  />
                ))}
              </div>
            </section>
          ) : null}

          {/* 2.3 Always-on */}
          {alwaysOnPerks.length > 0 ? (
            <section className="section section--always-on">
              <h3 className="subsection-heading">Always-on</h3>
              <p className="subsection-byline">
                These just work. No action required.
              </p>
              <div className="alwayson-grid">
                {alwaysOnPerks.map((p) => {
                  const inline = isIdTheft(p)
                    ? "Enroll for free monitoring →"
                    : null;
                  return (
                    <PerkCard
                      key={p.id}
                      title={p.name}
                      notes={p.notes}
                      sourceUrl={p.source.url}
                      sourceLabel={p.source.label}
                      statusPill={inline ? null : "auto-applied"}
                      enrollmentUrl={inline ? p.enrollment_url : null}
                      inlineEnrollLabel={inline}
                    />
                  );
                })}
              </div>
            </section>
          ) : null}

          {/* 2.4 Where you go */}
          {enabledDestinations.length > 0 ? (
            <section className="section section--destinations">
              <h3 className="subsection-heading">Where you go</h3>
              <p className="subsection-byline">
                Cities and themes where this card unlocks Priceless
                experiences. Highlights match your travel signals.
              </p>
              <ul className="destination-rail">
                {enabledDestinations.map((d) => {
                  const active = userDestinationSet.has(d.destination_signal);
                  return (
                    <li
                      key={d.id}
                      className={`destination-chip ${active ? "destination-chip--active" : ""}`}
                    >
                      <a
                        href={d.source.url}
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        {d.name}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </section>
          ) : null}

          {/* 2.5 What you're covered for */}
          {enabledInsurance.length > 0 ? (
            <section className="section section--coverage">
              <h3 className="subsection-heading">What you&apos;re covered for</h3>
              <ul className="coverage-list">
                {enabledInsurance.map((p) => {
                  const meta = COVERAGE_LABELS[p.id];
                  return (
                    <li key={p.id} className="coverage-row">
                      <span className="coverage-row__label">
                        {meta?.label ?? p.name}
                      </span>
                      <span className="coverage-row__limit">
                        {meta?.limit ?? p.notes.slice(0, 80)}
                      </span>
                    </li>
                  );
                })}
              </ul>
              {guideToBenefitsUrl ? (
                <a
                  className="coverage-guide-link"
                  href={guideToBenefitsUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Read the full benefits guide →
                </a>
              ) : null}
            </section>
          ) : null}
        </>
      ) : (
        <section className="section section--s2-empty">
          <p>
            Network benefits research not available for this card&apos;s
            network. Re-run the research prompt to populate Section 2.
          </p>
        </section>
      )}
    </main>
  );
}

// ── Small helpers ───────────────────────────────────────────────────────

function kindLabel(kind: EarnChannelEntry["kind"]): string {
  switch (kind) {
    case "international_cashback_portal":
      return "International cashback portal — login required";
    case "booking_site":
      return "Booking site with Hotel Stay Guarantee and Lifestyle Manager";
    case "merchant_offers":
      return "Curated experience marketplace";
    case "small_business":
      return "Small-business merchant offers";
  }
}

function hostnameOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}
