"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import BackHeader from "../components/BackHeader";

const FREE_FEATURES = [
  "5 AI tools — Hook, Caption, Hashtags, Timing, Image",
  "Generate up to 10 times per day",
  "All 9 languages supported",
  "No account required",
];

const PRO_FEATURES = [
  "Everything in Free",
  "Unlimited generations — no daily limit",
  "Priority AI responses (faster)",
  "Batch mode — generate 10 hooks at once",
  "Save & history — keep your best results",
  "Export results as PDF / image",
  "Early access to new tools",
  "Support the creator 🙌",
];

export default function PricingPage() {
  const emailSubject = encodeURIComponent("TikCheck Pro — One-Time Purchase");
  const emailBody = encodeURIComponent(
    "Hi Mike,\n\nI'd like to purchase TikCheck Pro (one-time).\n\nMy details:\n- Name: \n- Country: \n- How I'll pay (PayPal / bank transfer / other): \n\nThanks!"
  );
  const mailto = `mailto:mikeronny18@gmail.com?subject=${emailSubject}&body=${emailBody}`;

  return (
    <main style={{ minHeight: "100vh", background: "#000", paddingBottom: 40 }}>
      <BackHeader title="⚡ Plans" color="#FF0050" />

      <div style={{ padding: "24px 20px 0" }}>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <p style={{ fontSize: 9, fontWeight: 700, color: "#444", letterSpacing: "2.5px", marginBottom: 8 }}>SIMPLE PRICING</p>
          <h1 style={{ fontSize: 26, fontWeight: 800, lineHeight: 1.2, color: "white" }}>
            One price.<br /><span style={{ color: "#FF0050" }}>Own it forever.</span>
          </h1>
          <p style={{ color: "#444", fontSize: 13, marginTop: 8, marginBottom: 24 }}>
            No subscriptions. No recurring charges. Pay once, use TikCheck Pro for life.
          </p>
        </motion.div>

        {/* Free plan */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 20, padding: "20px",
            marginBottom: 14,
          }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div>
              <p style={{ fontSize: 9, fontWeight: 700, color: "#444", letterSpacing: "2px" }}>CURRENT PLAN</p>
              <p style={{ fontSize: 22, fontWeight: 800, color: "white", marginTop: 2 }}>Free</p>
            </div>
            <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 10, padding: "6px 12px" }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#555" }}>$0</span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {FREE_FEATURES.map((f, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ color: "#555", fontSize: 14, flexShrink: 0, marginTop: 1 }}>✓</span>
                <span style={{ fontSize: 13, color: "#666", lineHeight: 1.4 }}>{f}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Pro plan */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{
            background: "linear-gradient(160deg, rgba(255,0,80,0.08), rgba(168,85,247,0.08))",
            border: "1px solid rgba(255,0,80,0.3)",
            borderRadius: 20, padding: "20px",
            position: "relative", overflow: "hidden",
            marginBottom: 20,
            boxShadow: "0 0 40px rgba(255,0,80,0.1)",
          }}>
          {/* Badge */}
          <div style={{
            position: "absolute", top: 16, right: 16,
            background: "linear-gradient(135deg, #FF0050, #A855F7)",
            borderRadius: 10, padding: "4px 10px",
            fontSize: 10, fontWeight: 700, color: "white",
          }}>BEST VALUE</div>

          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 9, fontWeight: 700, color: "#FF0050", letterSpacing: "2px" }}>ONE-TIME</p>
            <p style={{ fontSize: 22, fontWeight: 800, color: "white", marginTop: 2 }}>Pro</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 6 }}>
              <span style={{
                fontSize: 36, fontWeight: 800,
                background: "linear-gradient(90deg, #FF0050, #A855F7)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>$9</span>
              <span style={{ fontSize: 14, color: "#555" }}>one-time · lifetime access</span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
            {PRO_FEATURES.map((f, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ color: "#FF0050", fontSize: 14, flexShrink: 0, marginTop: 1 }}>✓</span>
                <span style={{ fontSize: 13, color: "#ccc", lineHeight: 1.4 }}>{f}</span>
              </div>
            ))}
          </div>

          <a href={mailto} style={{ textDecoration: "none" }}>
            <motion.div whileTap={{ scale: 0.97 }} style={{
              background: "linear-gradient(135deg, #FF0050, #A855F7)",
              borderRadius: 14, padding: "15px",
              textAlign: "center",
              boxShadow: "0 0 28px rgba(255,0,80,0.3)",
              cursor: "pointer",
            }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: "white" }}>Get Pro — $9 Lifetime</p>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 3 }}>Email to complete purchase</p>
            </motion.div>
          </a>
        </motion.div>

        {/* Payment info */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 16, padding: "16px",
          }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#444", letterSpacing: "1px", marginBottom: 10 }}>HOW PAYMENT WORKS</p>
          {[
            { step: "1", text: "Tap 'Get Pro' → your email opens with details pre-filled" },
            { step: "2", text: "Send the email to Mike (mikeronny18@gmail.com)" },
            { step: "3", text: "Mike will contact you about payment method (PayPal, bank transfer, etc.)" },
            { step: "4", text: "Access activated within 24 hours" },
          ].map(s => (
            <div key={s.step} style={{ display: "flex", gap: 12, marginBottom: 8, alignItems: "flex-start" }}>
              <div style={{
                width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                background: "rgba(255,0,80,0.15)", border: "1px solid rgba(255,0,80,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 10, fontWeight: 700, color: "#FF0050",
              }}>{s.step}</div>
              <p style={{ fontSize: 12, color: "#666", lineHeight: 1.5, flex: 1 }}>{s.text}</p>
            </div>
          ))}
        </motion.div>

        <p style={{ textAlign: "center", fontSize: 11, color: "#333", marginTop: 16 }}>
          Questions? Email <span style={{ color: "#FF0050" }}>mikeronny18@gmail.com</span>
        </p>
      </div>
    </main>
  );
}
