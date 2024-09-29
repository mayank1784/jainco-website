import type { Config } from "tailwindcss";
const flowbite = require("flowbite-react/tailwind");

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ...flowbite.content(),
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#3c3c3c",
          100: "#747474",
          200: "#848484",
          300: "#565656",
        },
        black: "#040404",
        secondary: "#dcb46a",
        gray: {
          100: "#cdcde0",
        },
      },
      fontFamily: {
        lbold: ['var(--font-league-spartan)', 'sans-serif'], // For League Spartan
        iregular: ['var(--font-inter)', 'sans-serif'],       // For Inter Regular
        rregular: ['var(--font-roboto)', 'sans-serif'],      // For Roboto Regular
        sregular: ['var(--font-space-mono)', 'sans-serif'],  // For Space Mono Regular
      },
    },
    
  },
  plugins: [require("tailwindcss-debug-screens"),flowbite.plugin(),],
  
};
export default config;
