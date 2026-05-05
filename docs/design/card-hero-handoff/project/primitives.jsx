// Small reusable bits.
const { useState } = React;

/* The credit card "art" — drawn purely in CSS/SVG so we don't need an image.
   Stylized only — no logos. */
function CardArt({ name, network, last4 = "•••• 4218" }) {
  return (
    <div className="cc" role="img" aria-label={`${name} card art`}>
      <div className="cc-issuer">citi</div>
      <div className="cc-chip" />
      <div className="cc-name">{name}</div>
      <div className="cc-num">{last4}</div>
      <div className="cc-network">{network}</div>
    </div>
  );
}

/* The redesigned status control. Three explicit options inline, but
   visually demoted: thin tube, divider lines, no fill until selected.
   When one is active, that segment lights up in its tone. */
function StatusControl({ value, onChange }) {
  const opts = [
    { id: "using",    label: "Using",    tone: "using" },
    { id: "going_to", label: "On list",  tone: "going_to" },
    { id: "skip",     label: "Skip",     tone: "skip" },
  ];
  return (
    <div className="status" data-active={value || "none"}>
      {opts.map((o) => (
        <button
          key={o.id}
          type="button"
          className="status-chip"
          data-tone={o.tone}
          data-active={value === o.id}
          onClick={() => onChange(value === o.id ? null : o.id)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* External-link affordance — a small superscript arrow */
function ExtLink({ href, children }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
      <span aria-hidden="true" style={{ marginLeft: 3, fontSize: "0.85em" }}>↗</span>
    </a>
  );
}

window.CardArt = CardArt;
window.StatusControl = StatusControl;
window.ExtLink = ExtLink;
