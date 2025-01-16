import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2C3E50",
        secondary: "#ECF0F1",
        accent: "#1ABC9C",
        textColor: "#333333",
        background: "#ffffff",
      },
    },
  },
  plugins: [],
} satisfies Config;
