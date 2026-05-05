// Root app — wires data, tweaks, and the section order together.
const { useState, useMemo: useM } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "density": "default",
  "showDeadlines": true,
  "showManage": true,
  "accentHue": 245,
  "paperTone": "warm"
}/*EDITMODE-END*/;

function App() {
  const card = window.STRATA;
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  const [cpp, setCpp] = useState(card.cpp_defaults);
  const [held, setHeld] = useState(window.HELD);
  const [statuses, setStatuses] = useState({});
  const [frequencies, setFrequencies] = useState({});

  const setStatus = (id, v) => setStatuses((s) => ({ ...s, [id]: v }));
  const setFrequency = (id, v) => setFrequencies((s) => ({ ...s, [id]: v }));

  // Apply tweaks to the doc
  React.useEffect(() => {
    document.documentElement.dataset.density = tweaks.density;
    document.documentElement.style.setProperty("--accent", `oklch(0.42 0.10 ${tweaks.accentHue})`);
    document.documentElement.style.setProperty("--accent-soft", `oklch(0.42 0.10 ${tweaks.accentHue} / 0.10)`);
    document.documentElement.style.setProperty("--accent-line", `oklch(0.42 0.10 ${tweaks.accentHue} / 0.30)`);
    if (tweaks.paperTone === "cool") {
      document.documentElement.style.setProperty("--paper", "#f1f3f6");
      document.documentElement.style.setProperty("--paper-2", "#e7eaf0");
      document.documentElement.style.setProperty("--card", "#fafbfc");
    } else if (tweaks.paperTone === "stark") {
      document.documentElement.style.setProperty("--paper", "#ffffff");
      document.documentElement.style.setProperty("--paper-2", "#f5f5f5");
      document.documentElement.style.setProperty("--card", "#ffffff");
    } else {
      document.documentElement.style.setProperty("--paper", "#f6f3ec");
      document.documentElement.style.setProperty("--paper-2", "#efebe1");
      document.documentElement.style.setProperty("--card", "#fbfaf6");
    }
  }, [tweaks.density, tweaks.accentHue, tweaks.paperTone]);

  return (
    <div className="shell">
      <Crumb />
      {tweaks.showDeadlines && <Deadlines items={card.deadlines} />}
      <Hero card={card} />

      <CurrencyPanel card={card} cpp={cpp} setCpp={setCpp} />

      <div>
        {card.groups.map((g) => (
          <Group
            key={g.id}
            group={g}
            statuses={statuses}
            setStatus={setStatus}
            frequencies={frequencies}
            setFrequency={setFrequency}
          />
        ))}
      </div>

      {tweaks.showManage && <ManageCard card={card} held={held} setHeld={setHeld} />}

      <TweaksPanel title="Tweaks">
        <TweakSection label="Layout" />
        <TweakRadio
          label="Density"
          value={tweaks.density}
          onChange={(v) => setTweak("density", v)}
          options={[
            { value: "tight",   label: "Tight" },
            { value: "default", label: "Default" },
            { value: "airy",    label: "Airy" },
          ]}
        />
        <TweakRadio
          label="Paper tone"
          value={tweaks.paperTone}
          onChange={(v) => setTweak("paperTone", v)}
          options={[
            { value: "warm",  label: "Warm" },
            { value: "cool",  label: "Cool" },
            { value: "stark", label: "Stark" },
          ]}
        />
        <TweakSlider
          label="Accent hue"
          min={0} max={360} step={5} unit="°"
          value={tweaks.accentHue}
          onChange={(v) => setTweak("accentHue", v)}
        />
        <TweakSection label="Sections" />
        <TweakToggle
          label="Show watching strip"
          value={tweaks.showDeadlines}
          onChange={(v) => setTweak("showDeadlines", v)}
        />
        <TweakToggle
          label="Show Manage panel"
          value={tweaks.showManage}
          onChange={(v) => setTweak("showManage", v)}
        />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
