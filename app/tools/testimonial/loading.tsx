export default function Loading() {
  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(2,7,4,0.90)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--border-g)", padding: "14px 20px",
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.06)" }} />
        <div style={{ flex: 1 }}>
          <div style={{ width: 140, height: 14, borderRadius: 6, background: "rgba(255,255,255,0.08)", marginBottom: 6 }} />
          <div style={{ width: 100, height: 10, borderRadius: 6, background: "rgba(255,255,255,0.05)" }} />
        </div>
        <div style={{ width: 70, height: 28, borderRadius: 100, background: "rgba(254,203,0,0.08)" }} />
      </div>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "20px 16px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[120, 80, 80, 52].map((h, i) => (
            <div key={i} style={{ height: h, borderRadius: 14, background: "rgba(255,255,255,0.04)", animation: "pulse 1.5s ease-in-out infinite" }} />
          ))}
        </div>
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </div>
  )
}
