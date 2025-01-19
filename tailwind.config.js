/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@shadcn/ui/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    fontSize: {
      h1: ['64px', { fontWeight: '700' }],
      h2: ['48px', { fontWeight: '700' }],
      h3: ['32px', { fontWeight: '700' }],
      h4: ['24px', { fontWeight: '700' }],
      text1: ['20px', { fontWeight: '400' }],
      text1Medium: ['20px', { fontWeight: '500' }],
      text1Bold: ['20px', { fontWeight: '700' }],
      text2: ['18px', { fontWeight: '400' }],
      text2Medium: ['18px', { fontWeight: '500' }],
      text2Bold: ['18px', { fontWeight: '700' }],
      text3: ['16px', { fontWeight: '400' }],
      text3Medium: ['16px', { fontWeight: '500' }],
      text3Bold: ['16px', { fontWeight: '700' }],
      text4: ['14px', { fontWeight: '400' }],
      text4Medium: ['14px', { fontWeight: '500' }],
      text4Bold: ['14px', { fontWeight: '700' }],
      text5: ['12px', { fontWeight: '400' }],
      text5Medium: ['12px', { fontWeight: '500' }],
      text5Bold: ['12px', { fontWeight: '700' }],
    },
    extend: {
      fontFamily: {
        sans: ["Montserrat", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          50: "#f0fcff",
          100: "#cef5ff",
          200: "#a7e5f4",
          300: "#83d9ee",
          400: "#62cbe5",
          500: "#0ec2e6",
          600: "#0bafd0",
          700: "#0093b1",
          800: "#006db3",
          900: "#004f5f",
        },
        primary2: {
          50: "#e9f4ff",
          100: "#cef5ff",
          200: "#366faf",
          300: "#18559a",
          400: "#08458b",
          500: "#03356f",
          600: "#012a5a",
          700: "#012248",
          800: "#00142b",
          900: "#000e1e",
        },
        secondary: {
          50: "#fffcea",
          100: "#cef5ff",
          200: "#ceff5f",
          300: "#ffe585",
          400: "#fad85a",
          500: "#f7cc2d",
          600: "#e3bc2b",
          700: "#cfac28",
          800: "#c09f23",
          900: "#a98912",
        },
        sec2: {
          50: "#fff0d9",
          100: "#ec9c25",
          200: "#fed08b",
          300: "#fbc068",
          400: "#f5abed",
          500: "#ec9c25",
          600: "#d38715",
          700: "#be770e",
          800: "#a56609",
          900: "#86540a",
        },
        neutral: {
          50: "#e8e8e8",
          100: "#b7b7b7",
          200: "#949495",
          300: "#636364",
          400: "#454546",
          500: "#161618",
          600: "#141416",
          700: "#101011",
          800: "#0c0c0d",
          900: "#09090a",
        },
        black: {
          50: "#e8e8e8",
          100: "#b7b7b7",
          200: "#949494",
          300: "#636364",
          400: "#454546",
          500: "#161618",
          600: "#141416",
          700: "#101011",
          800: "#0c0c0d",
          900: "#09090a",
        },
        error1: "#D11B26",
        error2: "#EE4463",
        success: "#15C179",
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "fadeIn": {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fadeIn": 'fadeIn 0.3s ease-in-out',

      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}