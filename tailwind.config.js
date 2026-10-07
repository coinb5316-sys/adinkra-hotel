/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0d0d0d',
          50: '#f7f7f7',
          100: '#ebebeb',
          200: '#d1d1d1',
          300: '#a8a8a8',
          400: '#6b6b6b',
          500: '#3d3d3d',
          600: '#262626',
          700: '#1a1a1a',
          800: '#121212',
          900: '#0d0d0d',
        },
        cream: {
          DEFAULT: '#f6f1ea',
          50: '#fdfcfa',
          100: '#faf6f0',
          200: '#f6f1ea',
          300: '#ece3d4',
          400: '#ddceb4',
          500: '#c9b48c',
        },
        gold: {
          DEFAULT: '#b48a3c',
          50: '#faf6ee',
          100: '#f3e9d3',
          200: '#e6d2a7',
          300: '#d4b478',
          400: '#c39a52',
          500: '#b48a3c',
          600: '#936d2e',
          700: '#6d5023',
          800: '#4a3518',
          900: '#2a1e0e',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        serif: ['"Cormorant Garamond"', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        'ultra-wide': '0.35em',
        'mega-wide': '0.5em',
      },
      animation: {
        'fade-up': 'fadeUp 0.8s ease-out forwards',
        'fade-in': 'fadeIn 1.2s ease-out forwards',
        'ken-burns': 'kenBurns 20s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        kenBurns: {
          '0%': { transform: 'scale(1) translate(0, 0)' },
          '100%': { transform: 'scale(1.1) translate(-1%, -1%)' },
        },
      },
    },
  },
  plugins: [],
};