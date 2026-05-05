// Hero, currency panel, catalog group + perk row.
const { useState: useStateS, useMemo } = React;

function Crumb() {
  return (
    <div className="crumb">
      <a href="#">Wallet</a>
      <span>›</span>
      <a href="#">Citi</a>
      <span>›</span>
      <span style={{ color: "var(--ink-2)" }}>Strata Premier</span>
    </div>
  );
}

function Deadlines({ items }) {
  if (!items?.length) return null;
  return (
    <div className="deadlines">
      <span className="deadlines-tag">Watching</span>
      <div className="deadlines-list">
        {items.map((d, i) => (
          <span key={i}>
            <strong>{d.text}</strong>
            <span className="days">{d.days}d</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* HERO — card art, name, projected $, and earning rates inline.
   The user explicitly asked for earning rates UP HERE next to the card. */
function Hero({ card }) {
  const annualSpendDefault = 18000; // arbitrary mockup figure for the per-row $ projections
  return (
    <section className="hero">
      <div className="hero-art-col">
        <CardArt name={card.name} network={card.network} />
      </div>

      <div className="hero-body">
        <div className="hero-issuer">{card.issuer} · ${card.annual_fee}/yr · {card.currency.short}</div>
        <h1 className="hero-name">{card.name}</h1>
        <div className="hero-meta">
          <span>Held since Aug 2024</span>
          <span className="dot">·</span>
          <span>Bonus received</span>
          <span className="dot">·</span>
          <span>Verified <ExtLink href={card.source_url}>{card.verified_at}</ExtLink></span>
        </div>

        <p className="hero-positioning">{card.positioning}</p>

        <div className="projected">
          <div className="projected-num">
            ${card.projected_rewards_usd.toLocaleString()}
          </div>
          <div className="projected-body">
            <strong>Projected rewards this year</strong> at your current spend mix and a
            1.9¢ transfer-partner valuation. Net of the $95 fee.
          </div>
          <div className="projected-foot">
            <span><b>$1,335</b> rewards</span>
            <span><b>−$95</b> annual fee</span>
            <span className="muted">Adjust valuations below ↓</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* SLIM Currency panel — 3-line intro + cpp editor. No transfer-partner list. */
function CurrencyPanel({ card, cpp, setCpp }) {
  return (
    <section className="section">
      <div className="section-head">
        <div className="eyebrow">Currency</div>
        <h2 className="title">
          Your ThankYou Points are worth what you'll get for them.
          <span className="title-src">
            <ExtLink href="https://thepointsguy.com/guide/monthly-valuations/">TPG May 2026 valuations</ExtLink>
          </span>
        </h2>
        <p className="sub">
          Set the per-point value you actually realize for cash, the Citi Travel portal, and
          transfer partners. Every dollar number on this page recalculates instantly.
        </p>
      </div>

      <div className="currency">
        <div className="currency-intro">
          <h3>Citi ThankYou Points</h3>
          <p>
            ThankYou is the most flexible point on this card — Citi is the only major bank that
            transfers to American AAdvantage, and it shares the heavy hitters with Chase and Amex
            (Virgin Atlantic, Avios, Turkish, Singapore).
          </p>
        </div>

        <div className="cpp-grid">
          <CppCell label="Cash" value={cpp.cash} onChange={(v) => setCpp({ ...cpp, cash: v })} />
          <CppCell label="Citi Travel" value={cpp.portal} onChange={(v) => setCpp({ ...cpp, portal: v })} />
          <CppCell label="Transfer" value={cpp.transfer} headline onChange={(v) => setCpp({ ...cpp, transfer: v })} />
        </div>
      </div>
    </section>
  );
}

function CppCell({ label, value, onChange, headline }) {
  return (
    <div className="cpp-cell" data-headline={headline ? "true" : "false"}>
      {headline && <span className="cpp-cell-badge">used here</span>}
      <div className="cpp-cell-label">{label}</div>
      <div className="cpp-cell-input">
        <input
          type="number"
          step="0.05"
          min="0"
          max="10"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        />
        <span className="unit">¢/pt</span>
      </div>
    </div>
  );
}

/* CATALOG GROUP — perks bucketed (Hotels / Airlines / Recurring credits / etc).
   ONE source link in the title, not on each row. */
function Group({ group, statuses, setStatus, frequencies, setFrequency }) {
  return (
    <section className="group" id={`g-${group.id}`}>
      <header className="group-head">
        <div className="group-head-l">
          <h2 className="group-title">{group.label}</h2>
          {group.summary != null && (
            <span className="group-summary">
              <span className="num">${group.summary}</span> projected · {group.items.length} item{group.items.length === 1 ? "" : "s"}
            </span>
          )}
          <span className="group-src">
            <ExtLink href={group.source_url}>{group.source_label}</ExtLink>
          </span>
        </div>
        <button className="group-skip" type="button">Hide group</button>
      </header>

      <div>
        {group.items.map((item) => (
          <PerkRow
            key={item.id}
            item={item}
            status={statuses[item.id] ?? item.status ?? null}
            onStatus={(v) => setStatus(item.id, v)}
            frequency={frequencies[item.id] ?? item.frequency ?? null}
            onFrequency={(v) => setFrequency(item.id, v)}
          />
        ))}
      </div>
    </section>
  );
}

function PerkRow({ item, status, onStatus, frequency, onFrequency }) {
  const isRecurring = !!item.frequency || !!item.companions;
  return (
    <article className="perk" data-status={status || ""}>
      <div className="perk-body">
        <h3 className="perk-headline">{item.headline}</h3>
        {item.personal && <p className="perk-personal">{item.personal}</p>}

        {isRecurring && status !== "skip" && (
          <RecurringInset
            item={item}
            frequency={frequency}
            onFrequency={onFrequency}
          />
        )}
      </div>
      <div className="perk-tail">
        <div className={`perk-value ${item.value === "claim" ? "muted" : ""}`}>
          {item.value === "claim" ? "if you claim" : item.value}
        </div>
        <StatusControl value={status} onChange={onStatus} />
      </div>
    </article>
  );
}

function RecurringInset({ item, frequency, onFrequency }) {
  if (!item.companions && !item.frequency) return null;
  const freqOpts = ["0", "1-2", "3-5", "6+"];
  const projected = useMemo(() => {
    if (!frequency) return null;
    const map = { "0": 0, "1-2": 1, "3-5": 4, "6+": 7 };
    const stays = map[frequency] ?? 0;
    // crude: $100/stay times the frequency for the Reserve credit
    return stays * 100;
  }, [frequency]);

  return (
    <div className="recurring-inset">
      {item.frequency && (
        <div className="freq-row">
          <span className="freq-label">How often / yr</span>
          <div className="freq-buttons">
            {freqOpts.map((f) => (
              <button
                key={f}
                type="button"
                className="freq-btn"
                data-selected={frequency === f}
                onClick={() => onFrequency(f)}
              >
                {f}
              </button>
            ))}
          </div>
          {projected != null && (
            <span className="projection">
              = <b>${projected}</b>/yr
            </span>
          )}
        </div>
      )}
      {item.companions && (
        <div className="companions">
          <div className="companions-label">Companion benefits each stay</div>
          <ul className="companions-list">
            {item.companions.map((c, i) => <li key={i}>{c}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}

window.Crumb = Crumb;
window.Deadlines = Deadlines;
window.Hero = Hero;
window.CurrencyPanel = CurrencyPanel;
window.Group = Group;
