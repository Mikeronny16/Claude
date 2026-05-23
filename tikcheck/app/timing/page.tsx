"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import BackHeader from "../components/BackHeader";
import BottomNav from "../components/BottomNav";

const PLATFORMS: Record<string, { times: string[]; days: string; tip: string }> = {
  TikTok: { times: ["6:00 AM – 9:00 AM", "12:00 PM – 3:00 PM", "7:00 PM – 11:00 PM"], days: "Tue, Thu, Fri", tip: "Post 1-3x daily. Consistency beats perfection on TikTok." },
  Instagram: { times: ["8:00 AM – 10:00 AM", "11:00 AM – 1:00 PM", "7:00 PM – 9:00 PM"], days: "Mon, Wed, Fri", tip: "Reels get 3x more reach than regular posts. Use them." },
  "YouTube Shorts": { times: ["8:00 AM – 11:00 AM", "5:00 PM – 8:00 PM"], days: "Thu, Fri, Sat", tip: "Upload when your audience is awake. Check YouTube Analytics." },
  Facebook: { times: ["9:00 AM – 12:00 PM", "3:00 PM – 5:00 PM"], days: "Wed, Thu, Fri", tip: "Facebook rewards consistency. Post same time every day." },
};

const TIMEZONES = ["UTC+6:30 (Myanmar)", "UTC+7 (Thailand/Indonesia)", "UTC+8 (Philippines/Singapore)", "UTC+5:30 (India)", "UTC+0 (UK)", "UTC-5 (EST)", "UTC-8 (PST)"];

export default function TimingPage() {
  const [platform, setPlatform] = useState("TikTok");
  const [timezone, setTimezone] = useState(TIMEZONES[0]);
  const [revealed, setRevealed] = useState(false);

  const data = PLATFORMS[platform];

  return (
    <main style={{ minHeight: "100vh", background: "#000" }}>
      <BackHeader title="⏰ Best Time to Post" color="#00FF87" />
      <div style={{ padding: "20px" }}>
        <p style={{ color: "#555", fontSize: 13, marginBottom: 20 }}>Know exactly when your audience is online.</p>

        <div style={{ marginBottom: 14 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "#444", letterSpacing: "1px", marginBottom: 8 }}>PLATFORM</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {Object.keys(PLATFORMS).map(p => (
              <button key={p} onClick={() => { setPlatform(p); setRevealed(false); }} style={{
                padding: "8px 16px", borderRadius: 20, border: `1px solid ${platform === p ? "#00FF87" : "rgba(255,255,255,0.08)"}`,
                background: platform === p ? "rgba(0,242,234,0.12)" : "transparent",
                color: platform === p ? "#00FF87" : "#555", fontSize: 12, fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit",
              }}>{p}</button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "#444", letterSpacing: "1px", marginBottom: 8 }}>YOUR TIMEZONE</p>
          <select value={timezone} onChange={e => setTimezone(e.target.value)}>
            {TIMEZONES.map(tz => <option key={tz}>{tz}</option>)}
          </select>
        </div>

        <motion.button whileTap={{ scale: 0.96 }} onClick={() => setRevealed(true)}
          style={{
            width: "100%", padding: "15px", borderRadius: 14, border: "none",
            background: "linear-gradient(135deg, #00FF87, #00c4be)",
            color: "#003320", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
            boxShadow: "0 0 24px rgba(0,242,234,0.3)",
          }}>
          ⏰ Show Best Times
        </motion.button>

        {revealed && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ background: "rgba(0,242,234,0.05)", border: "1px solid rgba(0,242,234,0.2)", borderRadius: 16, padding: "18px" }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: "#00FF87", letterSpacing: "1.5px", marginBottom: 14 }}>BEST TIMES — {platform.toUpperCase()}</p>
              {data.times.map((t, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                  style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(0,242,234,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>
                    {i === 0 ? "🌅" : i === 1 ? "☀️" : "🌙"}
                  </div>
                  <span style={{ fontSize: 15, fontWeight: 600, color: "white" }}>{t}</span>
                </motion.div>
              ))}
              <div style={{ marginTop: 14, padding: "10px 14px", background: "rgba(255,255,255,0.04)", borderRadius: 10, display: "flex", gap: 8, alignItems: "flex-start" }}>
                <span style={{ fontSize: 16 }}>📅</span>
                <div>
                  <p style={{ fontSize: 10, color: "#555", fontWeight: 600 }}>BEST DAYS</p>
                  <p style={{ fontSize: 14, color: "#00FF87", fontWeight: 600 }}>{data.days}</p>
                </div>
              </div>
              <div style={{ marginTop: 10, padding: "10px 14px", background: "rgba(255,255,255,0.04)", borderRadius: 10 }}>
                <p style={{ fontSize: 13, color: "#aaa", lineHeight: 1.5 }}>💡 {data.tip}</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
      <BottomNav />
    </main>
  );
}
