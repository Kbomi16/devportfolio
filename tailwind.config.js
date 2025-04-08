/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        title: ['HSSanTokki20-Regular'],
      },
      colors: {
        primary: '#F4F2ED',
        blackPrimary: '#21212a',
        cardDark: '#2a2a35',
        cardActive: '#333344',
      },
    },
  },
  variants: {},
  plugins: [],
}
