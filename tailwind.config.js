/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Minimal dark palette — red is used ONLY as an accent, no heavy gradients.
        ink: {
          950: "#0a0a0b", // page background
          900: "#0f0f11", // deep surface
          850: "#151517", // card surface
          800: "#1c1c20", // raised surface / inputs
          700: "#26262b", // borders (strong)
        },
        accent: {
          DEFAULT: "#e02434", // primary red accent
          soft: "#f04452",
          dark: "#b31b29",
        },
        muted: "#9a9aa2", // secondary text
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Oswald", "Inter", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      maxWidth: {
        shell: "1120px",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.4s ease-out both",
      },
    },
  },
  plugins: [],
};
