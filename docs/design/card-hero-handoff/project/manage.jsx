// Manage card panel — clean compact admin form.
// Replaces the old dense numbered-cluster grid.

const { useState: useStateM } = React;

function ManageCard({ card, held, setHeld }) {
  return (
    <section className="manage">
      <header className="manage-head">
        <div>
          <h2 className="title">Manage this card</h2>
          <div className="sub">Settings only — won't affect your projection. {" "}
            <span className="status-pill">Active</span>
          </div>
        </div>
        <div className="manage-actions">
          <button className="btn">Open in Citi</button>
          <button className="btn">Cancel card…</button>
        </div>
      </header>

      <div className="admin-grid">
        <AdminRow k="Nickname">
          <input
            className="input"
            placeholder="e.g. Travel + dining"
            value={held.nickname}
            onChange={(e) => setHeld({ ...held, nickname: e.target.value })}
          />
        </AdminRow>

        <AdminRow k="Account opened">
          <span className="mono">Aug 1, 2024</span>
          <span className="muted" style={{ fontSize: 12 }}>1y 9mo</span>
        </AdminRow>

        <AdminRow k="Welcome bonus">
          <Toggle
            value={held.bonus_received ? "received" : "pending"}
            onChange={(v) => setHeld({ ...held, bonus_received: v === "received" })}
            options={[
              { id: "received", label: "Received" },
              { id: "pending",  label: "Working on it" },
            ]}
          />
          <span className="muted" style={{ fontSize: 12 }}>
            {held.bonus_received
              ? "75,000 pts credited Nov 2024"
              : "$4,000 spend in 3 months"}
          </span>
        </AdminRow>

        <AdminRow k="Authorized users">
          <Stepper
            value={held.authorized_users}
            min={0}
            max={4}
            onChange={(v) => setHeld({ ...held, authorized_users: v })}
          />
          <span className="muted" style={{ fontSize: 12 }}>No fee</span>
        </AdminRow>

        <AdminRow k="Annual-fee posts">
          <span className="mono">Aug 2026</span>
          <span className="muted" style={{ fontSize: 12 }}>$95 — set a 30-day reminder</span>
        </AdminRow>

        <AdminRow k="Pool with other Citi cards">
          <Toggle
            value={held.pool_status}
            onChange={(v) => setHeld({ ...held, pool_status: v })}
            options={[
              { id: "yes", label: "Yes" },
              { id: "no",  label: "No" },
            ]}
          />
          <span className="muted" style={{ fontSize: 12 }}>
            ThankYou points combine across all your Citi cards by default
          </span>
        </AdminRow>

        <AdminRow k="Current point balance">
          <span className="mono" style={{ fontSize: 16 }}>112,480</span>
          <span className="muted" style={{ fontSize: 12 }}>≈ $2,137 at transfer value</span>
        </AdminRow>

        <AdminRow k="Card on file">
          <span className="muted" style={{ fontSize: 13 }}>3 subscriptions, 2 utilities</span>
          <button className="btn-link" style={{ marginLeft: "auto" }}>Review →</button>
        </AdminRow>
      </div>
    </section>
  );
}

function AdminRow({ k, children }) {
  return (
    <div className="admin-row">
      <div className="k">{k}</div>
      <div className="v">{children}</div>
    </div>
  );
}

function Toggle({ value, onChange, options }) {
  return (
    <div className="toggle">
      {options.map((o) => (
        <button
          key={o.id}
          className="seg"
          type="button"
          data-active={value === o.id}
          onClick={() => onChange(o.id)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Stepper({ value, onChange, min = 0, max = 9 }) {
  return (
    <div className="stepper">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
      >−</button>
      <span className="stepper-val">{value}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
      >+</button>
    </div>
  );
}

window.ManageCard = ManageCard;
