/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        secondary: ['Playfair Display', 'serif'],
        primary: ['Montserrat', ' sans-serif'],
        tertiary: ['Quicksand', 'sans-serif']
      },
      colors: {
        customColorPrimary: '#e6e3d8',
        customColorSecondary: '#ecf3f9',
        textPrimary: '#423e31',
        customColorTertiary: '#092933'
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
}
