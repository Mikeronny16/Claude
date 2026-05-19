import type { Config } from "tailwindcss"

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FAF9F7",
        ink: "#1C1917",
        deep: "#4A3728",
        muted: "#78716C",
        sage: "#6B8F71",
        hairline: "#E8E5E0",
        blush: "#F5E6E0",
      },
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        mm: ["Padauk", "Pyidaungsu", "sans-serif"],
      },
      boxShadow: {
        card: "0 2px 20px rgba(0,0,0,0.06)",
        soft: "0 8px 30px rgba(0,0,0,0.10)",
      },
    },
  },
  plugins: [],
} satisfies Config
