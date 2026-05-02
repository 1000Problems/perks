// Skeleton shown while the recommendations page is rendering on the
// server. Mimics the three-column layout so there's no visual flash.

export default function Loading() {
  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        display: "grid",
        gridTemplateRows: "64px 1fr",
        background: "var(--paper)",
      }}
    >
      <div
        style={{
          borderBottom: "1px solid var(--rule)",
          display: "flex",
          alignItems: "center",
          padding: "0 32px",
          height: 64,
        }}
      >
        <div className="skel" style={{ width: 110, height: 18 }} />
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "320px 1fr 460px",
          minHeight: 0,
        }}
      >
        <aside style={{ padding: "28px 24px", borderRight: "1px solid var(--rule)" }}>
          <div className="skel" style={{ width: 100, height: 12, marginBottom: 14 }} />
          <div className="skel" style={{ width: 140, height: 32, marginBottom: 22 }} />
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="skel" style={{ width: "100%", height: 18, marginBottom: 8 }} />
          ))}
        </aside>
        <main style={{ padding: "28px 32px" }}>
          <div className="skel" style={{ width: 220, height: 14, marginBottom: 12 }} />
          <div className="skel" style={{ width: "70%", height: 32, marginBottom: 24 }} />
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="skel"
              style={{ width: "100%", height: 88, marginBottom: 10 }}
            />
          ))}
        </main>
        <aside style={{ padding: "28px 28px", borderLeft: "1px solid var(--rule)" }}>
          <div className="skel" style={{ width: 80, height: 12, marginBottom: 14 }} />
          <div className="skel" style={{ width: 160, height: 96, marginBottom: 18 }} />
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="skel" style={{ width: "100%", height: 16, marginBottom: 8 }} />
          ))}
        </aside>
      </div>
    </div>
  );
}
