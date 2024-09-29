/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        customSky:'rgb(178,222,242)',
        customGray:'#EBEDEC',
        customGreen:'#00CAC2',
        customGreenBorder:'#00EF91'
      },
      fontFamily:{
        customOne:["Poetsen One", "sans-serif"],
        customTwo:["Mitr", "sans-serif"],
      }
    },
  },
  plugins: [require('daisyui')],
}
