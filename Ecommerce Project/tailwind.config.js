/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // to enable dark mode stuff
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
        customColorTertiary: '#092933',
        customP2Primary: '#6E6ADE',
        customP2BackgroundW: '#F8F8FF',
        customP2BackgroundW_500: '#D9DCFF',
        customP2Button: '#E7E5AA',
        customP2ForeGroundw: '#F3F3D0',
        customP2ForeGroundW_200: '#EDECB8',
        customP2BackgroundW_700: '#B6BAF6',
        customP2BackgroundW_600: '#CACEFE',
        customP2BackgroundW_400: '#E5E7FF',
        // for admin dark mode custom colors
        customP2BackgroundD: '#1E1E43',
        customP2BackgroundD_darkest: '#0F0F1D',
        customP2BackgroundD_200: '#222147',
        customP2BackgroundD_500: '#4B4995',
        customP2ButtonD: '#343202'
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
}
