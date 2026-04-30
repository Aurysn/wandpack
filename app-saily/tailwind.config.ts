import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "#0d0b1a",
          surface: "#1a1630",
          "surface-hover": "#221e3d",
          border: "#2d2850",
          gold: "#f0c040",
          "gold-hover": "#c9a230",
          "text-primary": "#ffffff",
          "text-secondary": "#9d95c4",
          "text-muted": "#8a84b0",
        },
      },
      fontFamily: {
        display: ["var(--font-cinzel)", "serif"],
      },
      boxShadow: {
        gold: "0 0 16px rgba(240, 192, 64, 0.25)",
        "gold-sm": "0 0 8px rgba(240, 192, 64, 0.15)",
      },
    },
  },
  safelist: ['font-display'],
  plugins: [],
};
export default config;
