/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'selector',
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: { 
      colors: {
        primaryColor: '#191919',
        secundaryColor: '#777777',
        accentColor: '#D33535',
        greenColor: '#6e9c90',
        grayColor: '#6e839c',
        grayDarkColor: '#444444',
        backgroundColor: '#F3F3F3',
        surfaceColor: '#FFFFFF',
        hoverColor: '#f4f4f5',
        borderColor: '#DDDDDD',
        textColor: '#191919',
      }
    },
    borderRadius: {
      'none': '0',
      'sm': '.2rem',
      DEFAULT: '.5rem',
      'lg': '1rem',
      'full': '9999px'
    },
    // gap: {
    //   '0.5': '.5rem',
    //   '0.8': '.8rem',
    //   '1': '1rem',
    //   '2': '2rem',
    //   '3': '3rem',
    //   '4': '4rem',
    //   '5': '5rem',
    //   '6': '6rem',
    // },
    fontSize: {
      'sm': '1.2rem',
      'md': '1.4rem',
      'base': '1.6rem',
      'lg': '1.8rem'
    }
  },
  plugins: [],
}