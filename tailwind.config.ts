import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/helpers/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        poppins: ["var(--font-poppins)"],
        jakarta: ["Plus Jakarta Sans"],
        nunito: ["Nunito"],
        itim: ["var(--font-itim)"],
        helvetica: ["Helvetica", "sans-serif"],
        overpass: ["Overpass", "sans-serif"],
        spaceGrotesk: ["var(--font-space-grotesk)"],
        onest: ["var(--font-onest)"],
        sen: ["var(--font-sen)"],
        inter: ["var(--font-inter)"],
        barlow: ["var(--font-barlow-semi-condensed)"],
        urbanist: ["var(--font-urbanist)"],
        cherrySwash: ["var(--font-cherry-swash)"],
        vietnamPro: ["var(--font-vietnam-pro)"],
        bungeeInline: ["var(--font-bungee-inline)"],
        jost: ["var(--font-jost)"],
        montserrat: ["var(--font-montserrat)"],
        lexend: ["var(--font-lexend)"],
      },
      colors: {
        DarkBlue: "#0469DE",
        DarkBlueTone1: "#B2D6FF",
        DarkBlueTone2: "#F3F9FF",
        BrightBlue: "#ECF8FF",
        Black01: "#464E5F",
        Gray00: "#413D3D",
        Gray03: "#666",
        Gray04: "#8E8E8E",
        Gray05: "#A7A7A7",
        Green: "#13B87E",
        DarkGray: "#5B5757",
      },
      screens: {
        "w/1024": { min: "1024px" },
        "w/1280": { min: "1280px" },
        "2xl": { min: "1650px" },
        "3xl": { min: "2120px" },
        "4xl": { min: "2420px" },
        "w/1440": { min: "1440px" },
        "w/1920": { min: "1920px" },
        "w/mobile": { max: "500px" },
        'md': {min:'600px', max:'899px'},
        'mdxl':{min:"900px", max:"1023px"},
				sm: { max: '599px' },
				xs: { max: '361px' },
      },
    },
  },
  plugins: [],
};
export default config;
