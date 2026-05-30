/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ["Orbitron", "sans-serif"],
        mm: ["Noto Sans Myanmar", "sans-serif"],
        mono: ["Space Mono", "monospace"],
      },
      colors: {
        dim0: "#C0C0FF",
        dim1: "#00F5FF",
        dim2: "#A855F7",
        dim3: "#FF1F6E",
        dim4: "#FFD700",
        void: "#000008",
      },
    },
  },
  plugins: [],
}
