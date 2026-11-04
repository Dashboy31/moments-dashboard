/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Montserrat', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif']
      },
      colors: {
        moments: {
          forest: '#2F3A2A',       // Verde Bosque Profundo Oficial
          forestDark: '#1E251B',   // Verde Oscuro para barras y modales
          sage: '#5A6B4A',         // Verde Salvia / Oliva Medio
          sageLight: '#E8EDE3',    // Salvia muy suave
          gold: '#C6A96A',         // Dorado Cálido Oficial
          goldLight: '#F7F1E3',    // Dorado tenue / Champán
          goldDark: '#9F803C',     // Oro intenso
          cream: '#F6F3E9',        // Arena / Crema Oficial de Fondo
          surface: '#FDFBF7',      // Superficie limpia
          card: '#FFFFFF',
          border: '#E3DCCE',       // Borde suave
          dark: '#161D13',         // Casi negro botánico
          50: '#F6F3E9',
          100: '#E8EDE3',
          200: '#D5DEC9',
          300: '#C6A96A',
          400: '#8A9E75',
          500: '#5A6B4A',
          600: '#465538',
          700: '#2F3A2A',
          800: '#232C1E',
          900: '#161D13'
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
