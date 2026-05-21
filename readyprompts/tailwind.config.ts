import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cinema: {
          bg: "#05080f",
          "bg-2": "#0a0f1a",
          orange: "#f97316",
          "orange-dark": "#ea580c",
          "orange-glow": "#fb923c",
          blue: "#3b82f6",
          "blue-dark": "#1d4ed8",
          "blue-light": "#60a5fa",
          text: "#f1f5f9",
          muted: "#94a3b8",
          border: "#1e293b",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "orange-gradient": "linear-gradient(135deg, #f97316, #ea580c)",
        "blue-gradient": "linear-gradient(135deg, #3b82f6, #1d4ed8)",
        "cinema-gradient": "linear-gradient(135deg, #f97316 0%, #3b82f6 100%)",
        "hero-glow":
          "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(249,115,22,0.15) 0%, transparent 60%)",
        "grid-lines":
          "linear-gradient(rgba(30,41,59,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(30,41,59,0.4) 1px, transparent 1px)",
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "fade-in": "fadeIn 0.4s ease-out forwards",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow-pulse": "glowPulse 3s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(249,115,22,0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(249,115,22,0.6)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
