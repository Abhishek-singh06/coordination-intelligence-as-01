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
          bg: "#05070A",           // Primary Background (Deep Black-Blue)
          surface: "#0A0F16",      // Secondary Background (Card Surfaces)
          card: "#0A0F16",         // Card Surfaces
          darkBlue: "#0B1F3A",     // Dark Blue
          primaryBlue: "#123B66",  // Primary Blue
          accentBlue: "#1E5A91",   // Accent Blue
          brightBlue: "#2F80ED",   // Bright Blue (Interactive & Buttons)
          border: "#1B2735",       // Border Color
          textMain: "#FFFFFF",     // White Text
          textOff: "#F5F7FA",      // Off-white Text
          textSecondary: "#A7B0BC",// Secondary Text
          textMuted: "#6F7B88",    // Muted Text
          critical: "#E53E3E",     // Restrained Critical Red
          success: "#10B981",      // Restrained Success Green
          
          // Legacy mappings mapped to new dark blue/black/white palette
          darkRed: "#1B2735",
          burgundy: "#1E5A91",
          rose: "#2F80ED",
          muted: "#6F7B88",
          textLight: "#FFFFFF",
        },
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Open Sans', 'Helvetica Neue', 'sans-serif'],
      },
      boxShadow: {
        'aec-glow': '0 0 20px rgba(47, 128, 237, 0.25)',
        'aec-blue': '0 0 15px rgba(30, 90, 145, 0.4)',
        'aec-critical': '0 0 15px rgba(229, 62, 62, 0.5)',
      },
      animation: {
        'pulse-subtle': 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
export default config;
