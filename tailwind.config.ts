import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        aec: {
          bg: "#111506",        // Deep Dark Green (Main background)
          card: "#323522",      // Dark Olive (Panels, Cards, Surfaces)
          border: "#81815D",    // Muted Olive / Khaki (Borders & Subtle UI)
          darkRed: "#340A0E",   // Primary Dark Red (Critical/High-impact)
          burgundy: "#570F1D",  // Secondary Burgundy (Primary buttons/Active)
          rose: "#6F2B34",      // Accent Rose (Hover & Highlights)
          muted: "#81815D",     // Muted Text & Diagrams
          textLight: "#F8FAFC", // Off-white for high contrast readability
          textMuted: "#94A3B8", // Subtle text readability
        },
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Open Sans', 'Helvetica Neue', 'sans-serif'],
      },
      boxShadow: {
        'aec-glow': '0 0 15px rgba(111, 43, 52, 0.3)',
        'aec-critical': '0 0 15px rgba(52, 10, 14, 0.6)',
      },
      animation: {
        'pulse-subtle': 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
export default config;
