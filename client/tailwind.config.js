// tailwind.config.js
const { heroui } = require("@heroui/react");

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {},
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            // colors 1 a 6 (de izq a der) son los colores de la paleta que paso el profe. La imagen esta en commons "logo59.png"
            primary: "#855329",
            secondary: "#CB13FE",
            success: "#73DF7A",
            error: "#E34848",
            "color-1": "#F5E5BA",
            "color-2": "#D3853B",
            // 'color-3': -> es el primary
            "color-4": "#513422",
            "color-5": "#87532B",
            "color-6": "#503322",
          },
        },
      },
    }),
  ],
  darkMode: "class",
};
