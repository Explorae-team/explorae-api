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
        background: "#00161e",
        surface: "#00161e",
        "on-background": "#bde9fe",
        "on-surface": "#bde9fe",
        outline: "#8b9296",
        accent: "#F2641F",
        'explora-blue': '#004E64',
        'explora-orange': '#FF6B35',
        'explora-gold': '#FFB700',
        'background-light': '#F8F9FA',
        // --- Tokens do HTML (Stitch Material Design) ---
        "surface-container-highest": "#053a4a",
        "surface-container-high": "#002e3c",
        "surface-container": "#00232f",
        "surface-container-low": "#001f29",
        "surface-bright": "#0d3e4e",
        "on-surface-variant": "#c1c7cc",
        "on-primary-container": "#fd6c28",
        "tertiary-container": "#432d00",
        "on-tertiary": "#422d00",
        "on-tertiary-container": "#c88f00",
        "outline-variant": "#41484b",
        "surface-container-lowest": "#001017",
      },
      fontFamily: {
        headline: ["Inter", "sans-serif"],
        body: ["Inter", "sans-serif"],
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      }
    },
  },
  plugins: [],
};
