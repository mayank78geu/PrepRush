import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        jakarta: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
      },
      colors: {
        "pr-bg":      "#08090d",
        "pr-surface": "#12141c",
        "pr-surface-light": "#1c1f2b",
        "pr-primary": "#6366f1",
        "pr-rush":    "#f43f5e",
        "pr-secondary": "#10b981",
      },
      animation: {
        "slide-up": "slideUp 0.5s ease forwards",
        "fade-in":  "fadeIn 0.4s ease forwards",
        "spin-fast": "spin 0.8s linear infinite",
      },
      keyframes: {
        slideUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
