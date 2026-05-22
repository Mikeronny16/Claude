import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "cdm-bg": "#0d1117",
        "cdm-card": "#161b27",
        "cdm-border": "#1e2a3d",
        "cdm-blue": "#3b82f6",
        "cdm-blue-light": "#60a5fa",
        "cdm-blue-dark": "#2563eb",
        "cdm-muted": "#64748b",
        "cdm-body": "#cbd5e1",
        "cdm-white": "#f1f5f9",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      animation: {
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
        "fade-up": "fadeUp 0.6s ease forwards",
      },
      keyframes: {
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(59,130,246,0.4)" },
          "50%": { boxShadow: "0 0 40px rgba(59,130,246,0.8), 0 0 60px rgba(59,130,246,0.3)" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
