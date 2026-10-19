/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        moments: {
          50: '#fdfbf7',
          100: '#f7f1e6',
          200: '#eddcc5',
          300: '#dfc29e',
          400: '#cfa272',
          500: '#c0854d',
          600: '#a76a3b',
          700: '#875132',
          800: '#6e432d',
          900: '#5c3828',
          gold: '#c4974f',
          goldLight: '#f4e8d3',
          rose: '#e36387',
          roseLight: '#fceef2',
          navy: '#1b2a4a',
          navyLight: '#2c3e66',
          garden: '#2d6a4f',
          gardenLight: '#e8f5ee',
          surface: '#fcfaf7',
          card: '#ffffff',
          border: '#e8dfd5'
        }
      },
      boxShadow: {
        'soft': '0 2px 10px -2px rgba(0, 0, 0, 0.05), 0 1px 4px -1px rgba(0, 0, 0, 0.03)',
        'card': '0 4px 20px -2px rgba(60, 45, 30, 0.06), 0 2px 6px -1px rgba(60, 45, 30, 0.03)',
        'modal': '0 20px 40px -10px rgba(27, 42, 74, 0.25)'
      }
    },
  },
  plugins: [],
}
