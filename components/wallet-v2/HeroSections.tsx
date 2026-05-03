// Hero-page value-content sections. Pure read-only renders against the
// existing card markdown (cards/{id}.md → data/cards.json). No new
// authoring required for v0 — these sections light up immediately for
// any card with the standard fields populated.
//
// Once card_plays[] is authored per TASK-strata-audit-v0, we'll add
// richer surfaces (named transfer redemptions with cash-equivalents,
// niche plays with risk_tier badges, booking strategies). For v0 we
// render what's already in `earning`, `annual_credits`, `ongoing_perks`,
// `program.transfer_partners`, `program.sweet_spots`, `issuer_rules`.

import type { Card, CardDatabase, Program } from "@/lib/data/loader";
import { fmt } from "@/lib/utils/format";

// Map card-database earning labels to friendly display strings. Mirrors
// the engine's matchers but returns a label, not a category id.
function earningLabel(rawCategory: string): string {
  const l = rawCategory.toLowerCase();
  if (/grocer|supermarket/.test(l)) return "Supermarkets";
  if (/wholesale_club|costco/.test(l)) return "Wholesale clubs";
  if (/restaurant|dining/.test(l)) return "Restaurants";
  if (/\bgas\b|gas_station|fuel|ev_charg/.test(l)) return "Gas + EV charging";
  if (/airline|airfare|flight/.test(l)) return "Air travel";
  if (/hotels_cars_attractions|citi_travel/.test(l)) return "Hotels, cars, attractions (CitiTravel.com)";
  if (/hotel/.test(l)) return "Hotels";
  if (/streaming/.test(l)) return "Streaming";
  if (/online_purchas|online_shop|amazon/.test(l)) return "Online shopping";
  if (/drugstore|pharmacy/.test(l)) return "Drugstores";
  if (/transit|rideshare|uber\b|lyft/.test(l)) return "Transit / rideshare";
  if (/utilit|phone|cable|internet/.test(l)) return "Utilities";
  if (/home_improvement|home_depot|lowes/.test(l)) return "Home improvement";
  if (/everything_else|all_other_purchas|other_purchas|^other$|base_rate/.test(l))
    return "Everything else";
  if (/select_travel|portal|travel\b/.test(l)) return "Travel (portal)";
  // Fallback: prettify the raw label.
  return rawCategory.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

// ── Earning multipliers ─────────────────────────────────────────────────

interface EarningGridProps {
  card: Card;
}

export function EarningGrid({ card }: EarningGridProps) {
  // Sort by rate descending so the headline rates lead.
  const rows = [...card.earning].sort(
    (a, b) => (b.rate_pts_per_dollar ?? 0) - (a.rate_pts_per_dollar ?? 0),
  );
  return (
    <section className="hero-section">
      <header className="hero-section-head">
        <span className="eyebrow">Earning</span>
        <h2 className="hero-section-title">How you earn on this card</h2>
        <p className="hero-section-sub">
          Multipliers paid out per dollar spent, before any pooling or transfer
          conversion. Caps and conditions on the right.
        </p>
      </header>
      <div className="earning-grid">
        {rows.map((r, i) => {
          const rate = r.rate_pts_per_dollar ?? 0;
          const cap = r.cap_usd_per_year;
          const isCash = (card.currency_earned ?? "").toLowerCase() === "cash";
          const display = isCash ? `${rate}%` : `${rate}x`;
          return (
            <div key={i} className="earning-row" data-rate={rate}>
              <div className="earning-rate num">{display}</div>
              <div className="earning-body">
                <div className="earning-cat">
                  {earningLabel(r.category)}
                </div>
                <div className="earning-meta">
                  {cap == null ? "Uncapped" : `Capped at ${fmt.usd(cap)}/yr`}
                  {r.notes ? ` · ${r.notes}` : ""}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ── Statement credits + ongoing perks ───────────────────────────────────

interface CreditsAndPerksProps {
  card: Card;
}

export function CreditsAndPerks({ card }: CreditsAndPerksProps) {
  const credits = card.annual_credits ?? [];
  const perks = card.ongoing_perks ?? [];
  if (credits.length === 0 && perks.length === 0) return null;
  return (
    <section className="hero-section">
      <header className="hero-section-head">
        <span className="eyebrow">Credits & benefits</span>
        <h2 className="hero-section-title">What this card pays you back</h2>
        <p className="hero-section-sub">
          Statement credits, ongoing perks, and recurring benefits beyond
          earning multipliers.
        </p>
      </header>
      {credits.length > 0 && (
        <div className="credits-grid">
          {credits.map((c, i) => (
            <article key={i} className="credit-card">
              <div className="credit-head">
                <div className="credit-name">{c.name}</div>
                {c.value_usd != null && c.value_usd > 0 && (
                  <div className="credit-value num">{fmt.usd(c.value_usd)}</div>
                )}
              </div>
              {c.notes && <div className="credit-notes">{c.notes}</div>}
              {c.expiration && (
                <div className="credit-meta">
                  Resets:{" "}
                  {c.expiration === "annual_anniversary"
                    ? "card anniversary"
                    : c.expiration.replace(/_/g, " ")}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
      {perks.length > 0 && (
        <div className="perks-list">
          {perks.map((p, i) => (
            <div key={i} className="perk-row">
              <div className="perk-name">{p.name}</div>
              {p.notes && <div className="perk-notes">{p.notes}</div>}
              {p.value_estimate_usd != null && p.value_estimate_usd > 0 && (
                <div className="perk-value mono">
                  ~{fmt.usd(p.value_estimate_usd)}/yr
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// ── Transfer partners ───────────────────────────────────────────────────

interface TransferPartnersProps {
  card: Card;
  db: CardDatabase;
}

export function TransferPartners({ card, db }: TransferPartnersProps) {
  const programId = card.currency_earned;
  if (!programId) return null;
  const program = db.programById.get(programId);
  if (!program || program.transfer_partners.length === 0) return null;

  const airline = program.transfer_partners.filter((p) => p.type === "airline");
  const hotel = program.transfer_partners.filter((p) => p.type === "hotel");
  const other = program.transfer_partners.filter((p) => p.type === "other");

  // Pool-spoke cards see a 1:0.7-style reduced ratio standalone; the
  // displayed `ratio` on the partner is the premium-card ratio. Show a
  // banner when the user holding pattern matters.
  const isSpoke = Boolean(card.is_pool_spoke);
  const anchorIds = program.transfer_unlock_card_ids ?? [];
  const anchorNames = anchorIds
    .map((id) => db.cardById.get(id)?.name)
    .filter((n): n is string => Boolean(n));

  return (
    <section className="hero-section">
      <header className="hero-section-head">
        <span className="eyebrow">Transfer partners</span>
        <h2 className="hero-section-title">
          Where these points can fly
        </h2>
        <p className="hero-section-sub">
          Transferable currencies turn into airline miles or hotel points at
          the ratio shown. Ratios assume you hold a card that unlocks
          full-value transfers.
        </p>
      </header>

      {isSpoke && anchorNames.length > 0 && (
        <div className="callout callout-warn">
          <span className="callout-icon" aria-hidden>⚠</span>
          <div>
            <strong>Pool to unlock 1:1.</strong> Standalone, this card transfers
            at a reduced ratio (typically 1:0.7). Pooling points into{" "}
            {anchorNames.join(" or ")} preserves the rates shown below.
          </div>
        </div>
      )}

      {airline.length > 0 && (
        <PartnerGroup label="Airlines" partners={airline} />
      )}
      {hotel.length > 0 && <PartnerGroup label="Hotels" partners={hotel} />}
      {other.length > 0 && <PartnerGroup label="Other" partners={other} />}
    </section>
  );
}

function PartnerGroup({
  label,
  partners,
}: {
  label: string;
  partners: Program["transfer_partners"];
}) {
  return (
    <div className="partner-group">
      <div className="partner-group-label">{label}</div>
      <div className="partner-grid">
        {partners.map((p, i) => (
          <div key={i} className="partner-card">
            <div className="partner-name">{p.partner}</div>
            <div className="partner-ratio mono">{p.ratio}</div>
            {p.notes && <div className="partner-notes">{p.notes}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Sweet spots ─────────────────────────────────────────────────────────

interface SweetSpotsProps {
  card: Card;
  db: CardDatabase;
}

export function SweetSpots({ card, db }: SweetSpotsProps) {
  const programId = card.currency_earned;
  if (!programId) return null;
  const program = db.programById.get(programId);
  if (!program || (program.sweet_spots ?? []).length === 0) return null;

  return (
    <section className="hero-section">
      <header className="hero-section-head">
        <span className="eyebrow">Sweet spots</span>
        <h2 className="hero-section-title">Where these points punch above 1¢</h2>
        <p className="hero-section-sub">
          Named redemptions with above-average cents-per-point value. Point
          counts assume you transfer at 1:1 — typically requires a premium card
          like the Strata Premier or Strata Elite.
        </p>
      </header>
      <div className="sweet-spot-list">
        {program.sweet_spots!.map((s, i) => {
          const hasStructured =
            s.point_cost_one_way != null ||
            s.partner_program != null ||
            s.cash_equiv_usd_low != null;
          if (!hasStructured) {
            // Back-compat lightweight render for cards that haven't been
            // enriched with structured data yet.
            return (
              <div key={i} className="sweet-spot">
                <div className="sweet-spot-body">
                  <div className="sweet-spot-desc">{s.description}</div>
                  {s.value_estimate_usd != null && (
                    <div className="sweet-spot-value mono">
                      {String(s.value_estimate_usd)}
                    </div>
                  )}
                </div>
                {s.source && (
                  <a
                    className="sweet-spot-source"
                    href={s.source}
                    target="_blank"
                    rel="noreferrer"
                  >
                    source ↗
                  </a>
                )}
              </div>
            );
          }
          // Rich render for structured entries.
          const cashLow = s.cash_equiv_usd_low ?? null;
          const cashHigh = s.cash_equiv_usd_high ?? null;
          let cashRange: string | null = null;
          if (cashLow != null && cashHigh != null) {
            cashRange = `${fmt.usd(cashLow)}–${fmt.usd(cashHigh)}`;
          } else if (cashLow != null) {
            cashRange = `${fmt.usd(cashLow)}+`;
          }
          return (
            <article key={i} className="sweet-spot rich">
              <header className="sweet-spot-head">
                <div className="sweet-spot-title">{s.description}</div>
                {s.value_estimate_usd != null && (
                  <div className="sweet-spot-value mono">
                    {String(s.value_estimate_usd)}
                  </div>
                )}
              </header>
              <dl className="sweet-spot-grid">
                {s.point_cost_one_way != null && (
                  <div>
                    <dt>Point cost</dt>
                    <dd className="num">
                      {s.point_cost_one_way.toLocaleString()} pts
                    </dd>
                  </div>
                )}
                {cashRange && (
                  <div>
                    <dt>Cash equivalent</dt>
                    <dd>{cashRange}</dd>
                  </div>
                )}
                {s.partner_program && (
                  <div>
                    <dt>Via</dt>
                    <dd>{s.partner_program}</dd>
                  </div>
                )}
                {s.surcharges_usd != null && (
                  <div>
                    <dt>Surcharges + fees</dt>
                    <dd>
                      {s.surcharges_usd === 0
                        ? "None"
                        : `~${fmt.usd(s.surcharges_usd)}`}
                    </dd>
                  </div>
                )}
              </dl>
              {s.route && <div className="sweet-spot-route">{s.route}</div>}
              {s.conditions && (
                <p className="sweet-spot-conditions">{s.conditions}</p>
              )}
              {s.source && (
                <a
                  className="sweet-spot-source"
                  href={s.source}
                  target="_blank"
                  rel="noreferrer"
                >
                  source ↗
                </a>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

// ── Issuer rules ────────────────────────────────────────────────────────

interface IssuerRulesProps {
  card: Card;
  db: CardDatabase;
}

export function IssuerRulesSection({ card, db }: IssuerRulesProps) {
  const cardLevel = card.issuer_rules ?? [];
  const issuer = db.issuerRulesByIssuer.get(card.issuer);
  const issuerLevel = (issuer?.rules ?? []).map((r) => `${r.name} — ${r.description}`);

  if (cardLevel.length === 0 && issuerLevel.length === 0) return null;

  const sub = card.signup_bonus
    ? buildSubLine(card.signup_bonus)
    : null;

  return (
    <section className="hero-section">
      <header className="hero-section-head">
        <span className="eyebrow">Sign-up bonus & rules</span>
        <h2 className="hero-section-title">How you get this card</h2>
      </header>
      {sub && <div className="sub-callout">{sub}</div>}
      {cardLevel.length > 0 && (
        <div className="rule-block">
          <div className="rule-block-label">This card</div>
          <ul className="rule-list">
            {cardLevel.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      )}
      {issuerLevel.length > 0 && (
        <div className="rule-block">
          <div className="rule-block-label">Issuer ({card.issuer})</div>
          <ul className="rule-list">
            {issuerLevel.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

function buildSubLine(sub: NonNullable<Card["signup_bonus"]>): string {
  const pts = sub.amount_pts;
  const spend = sub.spend_required_usd;
  const months = sub.spend_window_months;
  const value = sub.estimated_value_usd;
  const parts: string[] = [];
  if (pts) parts.push(`${pts.toLocaleString()} pts`);
  if (spend && months) parts.push(`after ${fmt.usd(spend)} in ${months} months`);
  if (value) parts.push(`(≈${fmt.usd(value)} value)`);
  if (sub.notes) parts.push(`— ${sub.notes}`);
  return parts.join(" ");
}
