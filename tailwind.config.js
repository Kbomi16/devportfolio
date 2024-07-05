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
        gray: {
          50: '#7D7986',
          40: '#A4A1AA',
          30: '#CBC9CF',
          20: '#E5E4E7',
          10: '#F2F2F3',
          5: '#FAFAFA',
        },
        green: {
          20: '#6A7E60',
          10: '#D4E4CF',
        },
      },
    },
  },
  variants: {},
  plugins: [],
}
