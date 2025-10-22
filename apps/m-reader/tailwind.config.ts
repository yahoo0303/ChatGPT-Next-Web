import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.5rem",
        lg: "2rem",
        xl: "3rem"
      },
      screens: {
        xl: "1120px"
      }
    },
    extend: {
      colors: {
        surface: "var(--color-surface)",
        "surface-muted": "var(--color-surface-muted)",
        ink: "var(--color-ink)",
        "ink-subtle": "var(--color-ink-subtle)",
        accent: "var(--color-accent)",
        "accent-soft": "var(--color-accent-soft)"
      },
      fontFamily: {
        serif: [
          "var(--font-source-serif)",
          "var(--font-noto-serif)",
          "var(--font-merriweather)",
          "ui-serif",
          "Georgia",
          "serif"
        ]
      },
      maxWidth: {
        prose: "var(--max-prose-width)"
      },
      boxShadow: {
        sheet: "0 24px 60px -32px rgba(15, 23, 42, 0.35)"
      },
      borderRadius: {
        reader: "24px"
      },
      spacing: {
        "reader-gutter": "clamp(1.5rem, 4vw, 3rem)"
      }
    }
  },
  plugins: []
};

export default config;
