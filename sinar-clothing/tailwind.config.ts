import type { Config } from "tailwindcss"

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        forest: "#0A1A0F",
        "forest-light": "#0F2415",
        "forest-mid": "#122B19",
        pink: "#FF1F6E",
        "pink-glow": "#FF1F6E33",
        emerald: "#00FF88",
        "emerald-dim": "#00FF8822",
        cream: "#F5F0E8",
        muted: "#7A8F7D",
        hairline: "#1C3020",
      },
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        mm: ["Padauk", "Pyidaungsu", "sans-serif"],
      },
      boxShadow: {
        card: "0 2px 20px rgba(0,0,0,0.4)",
        pink: "0 0 30px rgba(255,31,110,0.4)",
        "pink-sm": "0 0 15px rgba(255,31,110,0.3)",
        glow: "0 0 40px rgba(0,255,136,0.15)",
      },
      animation: {
        marquee: "marquee 25s linear infinite",
        float: "float 3s ease-in-out infinite",
        pulse2: "pulse2 2s ease-in-out infinite",
        "spin-slow": "spin 8s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        pulse2: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
