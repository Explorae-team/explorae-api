/** @type {import('tailwindcss').Config} */
module.exports = {
  // Obrigatório para NativeWind v4 e Expo SDK 55
  darkMode: "class", 
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#fd6c28",
        secondary: "#a2cde1",
        tertiary: "#ffba26",
        background: "#003646",
        surface: "#FFFFFF",
        "on-background": "#bde9fe",
        "on-surface": "#003646",
        outline: "#8b9296",
        accent: "#F2641F",
      },
      fontFamily: {
        headline: ["Inter"],
        body: ["Inter"],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      }
    },
  },
  plugins: [],
};
