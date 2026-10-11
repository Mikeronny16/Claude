import type { Config } from "tailwindcss"

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Sweet Shop app palette (customer-facing pages)
        candy: {
          bg: "#FFF1F5",
          ink: "#2A1320",
          muted: "#765563",
          pink: "#E0115F",
          "pink-dark": "#B80D4D",
          soft: "#FFE1EA",
          line: "#F3C6D6",
          sun: "#FFC83D",
          butter: "#FFF0C9",
          mint: "#DFF5E8",
          sky: "#E3F1FF",
          lilac: "#E9E1FF",
        },

        // Forest palette (admin + login pages)
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
        "green-brand": "#2D5A3D",
        "green-light": "#3D7A52",
      },
      fontFamily: {
        display: ["Fredoka", "'Noto Sans Myanmar'", "system-ui", "sans-serif"],
        sans: ["'Plus Jakarta Sans'", "'Noto Sans Myanmar'", "system-ui", "sans-serif"],
        serif: ["'Playfair Display'", "Georgia", "serif"],
        mm: ["'Noto Sans Myanmar'", "Pyidaungsu", "sans-serif"],
      },
      boxShadow: {
        soft: "0 6px 18px rgba(42,19,32,0.07)",
        candy: "0 14px 34px rgba(224,17,95,0.16)",
        cta: "0 10px 22px rgba(224,17,95,0.32)",
        bar: "0 -8px 26px rgba(42,19,32,0.09)",
        pink: "0 0 30px rgba(255,31,110,0.4)",
      },
      keyframes: {
        twinkle: {
          "0%, 100%": { opacity: "0.35", transform: "scale(0.8)" },
          "50%": { opacity: "1", transform: "scale(1.1)" },
        },
        wobble: {
          "0%, 100%": { transform: "rotate(12deg) scale(1)" },
          "50%": { transform: "rotate(-4deg) scale(1.08)" },
        },
        floaty: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        twinkle: "twinkle 2.4s ease-in-out infinite",
        "twinkle-slow": "twinkle 3.1s 0.8s ease-in-out infinite",
        wobble: "wobble 2.8s ease-in-out infinite",
        floaty: "floaty 5s ease-in-out infinite",
        shimmer: "shimmer 1.6s linear infinite",
      },
    },
  },
  plugins: [],
} satisfies Config
