/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    colors: {
      'blue': '#1fb6ff',
      'purple': '#7e5bef',
      'pink': '#ff49db',
      'orange': '#ff7849',
      'green': '#13ce66',
      'yellow': '#ffc82c',
      'gray-dark': '#273444',
      'gray': '#8492a6',
      'gray-light': '#d3dce6',
      'border': 'rgba(255, 255, 255, 0.1)',
      'semivisible': 'rgba(255, 255, 255, 0.4)',
      'soft': 'rgba(255, 255, 255, 0.9)',
      'brand': '#d14fb8'
    },
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
      serif: ['Merriweather', 'sans-serif']
    },
    extend: {},
  },
  plugins: [],
}
