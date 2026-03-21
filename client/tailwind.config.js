/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        forest: "#2F5338",
        sun: "#F4D03F",
        leaf: "#82C47C"
      },
      borderRadius: {
        xl2: "16px"
      }
    }
  },
  plugins: []
};
