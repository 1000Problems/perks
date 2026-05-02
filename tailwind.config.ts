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
        paper: "var(--paper)",
        "paper-2": "var(--paper-2)",
        "paper-3": "var(--paper-3)",
        rule: "var(--rule)",
        "rule-2": "var(--rule-2)",
        ink: "var(--ink)",
        "ink-2": "var(--ink-2)",
        "ink-3": "var(--ink-3)",
        "ink-4": "var(--ink-4)",
        pos: "var(--pos)",
        "pos-bg": "var(--pos-bg)",
        "pos-ink": "var(--pos-ink)",
        neg: "var(--neg)",
        "neg-bg": "var(--neg-bg)",
        "neg-ink": "var(--neg-ink)",
        warn: "var(--warn)",
        "warn-bg": "var(--warn-bg)",
        "warn-ink": "var(--warn-ink)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        display: ["var(--font-display)", "serif"],
      },
      borderRadius: {
        xs: "4px",
        sm: "6px",
        md: "10px",
        lg: "14px",
        xl: "20px",
      },
      boxShadow: {
        "paper-1": "var(--shadow-1)",
        "paper-2": "var(--shadow-2)",
      },
    },
  },
  plugins: [],
};

export default config;
