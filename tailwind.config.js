/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#1e293b', // Cor principal para o tema light
          dark: '#f3f4f6',  // Cor principal para o tema dark
        },
        background: {
          light: '#ffffff',
          dark: '#000000',
        },
      }
    },
  },
  plugins: [],
}