"use client";

// CurrencyPanel — what the points actually are.
//
// Renders directly under the identity strip so the user never wonders
// "what's a Citi ThankYou Point worth?" The data comes from the program
// referenced by card.currency_earned. Three lines of plain-English
// economics, then an airline-partners tag row.
//
// When card.currency_earned is null (no-rewards cards), render nothing.

import type { Card, Program } from "@/lib/data/loader";

interface Props {
  card: Card;
  program: Program | undefined;
  /** Optional ecosystem one-liner from value_thesis. Renders as the */
  /** "unlock" line under the partners count. */
  ecosystemLine?: string;
}

export function CurrencyPanel({ card, program, ecosystemLine }: Props) {
  if (!card.currency_earned || !program) return null;

  const portal = program.portal_redemption_cpp ?? null;
  const median = program.median_redemption_cpp ?? null;

  const airlinePartners = program.transfer_partners.filter(
    (p) => p.type === "airline",
  );
  const hotelPartners = program.transfer_partners.filter(
    (p) => p.type === "hotel",
  );

  // Sort airline partners alphabetically; lift "unique" partners
  // (notes contains "Unique to") to the top so the differentiator
  // reads first.
  const isUnique = (notes: string | null | undefined) =>
    typeof notes === "string" && /unique to/i.test(notes);
  const sortedAirlines = [...airlinePartners].sort((a, b) => {
    const au = isUnique(a.notes);
    const bu = isUnique(b.notes);
    if (au !== bu) return au ? -1 : 1;
    return a.partner.localeCompare(b.partner);
  });

  const cppLine = formatCppLine(portal, median, program.issuer);
  const partnersLine = formatPartnersLine(
    airlinePartners.length,
    hotelPartners.length,
    sortedAirlines.find((p) => isUnique(p.notes))?.partner ?? null,
  );

  return (
    <section className="currency-panel" aria-label="Your points">
      <div className="currency-panel-head">
        <span className="eyebrow">Your points</span>
        <h2 className="currency-panel-name">{program.name}</h2>
      </div>
      {cppLine && <p className="currency-panel-line">{cppLine}</p>}
      {partnersLine && <p className="currency-panel-line">{partnersLine}</p>}
      {ecosystemLine && (
        <p className="currency-panel-line currency-panel-unlock">
          {ecosystemLine}
        </p>
      )}
      {sortedAirlines.length > 0 && (
        <div className="currency-panel-partners" aria-label="Airline transfer partners">
          {sortedAirlines.map((p) => (
            <span
              key={p.partner}
              className="currency-partner-tag"
              data-unique={isUnique(p.notes) ? "true" : "false"}
              title={p.notes ?? undefined}
            >
              {isUnique(p.notes) && (
                <span className="currency-partner-star" aria-hidden>
                  ★
                </span>
              )}
              {p.partner}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}

function formatCppLine(
  portal: number | null,
  median: number | null,
  issuer: string,
): string | null {
  const portalLabel = `${issuer} portal`;
  if (portal != null && median != null) {
    return `Floor ${formatCpp(portal)} in the ${portalLabel}. Median ${formatCpp(median)} if you transfer.`;
  }
  if (portal != null) {
    return `Worth ${formatCpp(portal)} in the ${portalLabel}.`;
  }
  if (median != null) {
    return `Median ${formatCpp(median)} if you transfer.`;
  }
  return null;
}

function formatCpp(cpp: number): string {
  // Whole-cent values render without trailing zeros: 1¢, not 1.00¢.
  if (Number.isInteger(cpp)) return `${cpp}¢`;
  // Round to one decimal otherwise: 1.9¢.
  return `${(Math.round(cpp * 10) / 10).toFixed(1)}¢`;
}

function formatPartnersLine(
  airlineCount: number,
  hotelCount: number,
  uniquePartner: string | null,
): string | null {
  if (airlineCount === 0 && hotelCount === 0) return null;
  const parts: string[] = [];
  if (airlineCount > 0) parts.push(`${airlineCount} airlines`);
  if (hotelCount > 0) parts.push(`${hotelCount} hotels`);
  const list = parts.join(" and ");
  const unique = uniquePartner
    ? ` Unique 1:1 transfer to ${uniquePartner}.`
    : "";
  return `Transfers 1:1 to ${list}.${unique}`;
}
