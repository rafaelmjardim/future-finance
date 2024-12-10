/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: { 
      colors: {
        primary: '#191919',
        secundary: '#777777',
        accent: '#D33535',
        greenColor: '#6e9c90',
        grayColor: '#6e839c',
        backgroundColor: '#FFFFFF',
        surfaceColor: '#FFFFFF',
        borderColor: '#DDDDDD',
        textColor: '#191919',
      },
    },
    borderRadius: {
      'none': '0',
      'sm': '.2rem',
      DEFAULT: '.5rem',
      'lg': '1rem',
      'ful': '9999px'
    },
    gap: {
      '0.5': '.5rem',
      '0.8': '.8rem',
      '1': '1rem',
      '2': '2rem',
      '3': '3rem',
      '4': '4rem',
      '5': '5rem',
      '6': '6rem',
    },
    fontSize: {
      'sm': '1.4rem',
      'base': '1.6rem',
      'lg': '1.8rem'
    }
  },
  plugins: [],
}