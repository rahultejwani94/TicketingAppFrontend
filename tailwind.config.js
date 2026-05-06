/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: "#c026d3",
        brandDark: "#a21caf",
        accent: "#a855f7",
        darkBg: "#070810",
        panel: "rgba(255,255,255,0.12)",
      },
    },
  },
  plugins: [],
};
