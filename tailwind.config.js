/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'pharm-teal': '#10847e',
        'pharm-teal-dark': '#0c6b65',
        'pharm-dark': '#303642',
        'pharm-light': '#f4f7f6'
      }
    },
  },
  plugins: [],
}