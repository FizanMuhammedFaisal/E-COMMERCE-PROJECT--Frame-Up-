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
        customP2Button: '#D7ACD0',
        customP2ForeGroundW_100: '#FFFBFE',
        customP2ForeGroundW_200: '#FFF7FD',
        customP2ForeGroundW_300: '#F9EBF7',
        customP2ForeGroundW_400: '#F4E2F1',
        customP2ForeGroundW_500: '#F0D9EC',
        customP2ForeGroundW_600: '#EBD0E6',
        customP2ForeGroundW_700: '#E4C3DE',
        customP2BackgroundW_700: '#B6BAF6',
        customP2BackgroundW_600: '#CACEFE',
        customP2BackgroundW_400: '#E5E7FF',
        // for admin dark mode custom colors
        customP2BackgroundD: '#1E1E43',
        customP2BackgroundD_darkest: '#0F0F1D',
        customP2BackgroundD_200: '#222147',
        customP2BackgroundD_500: '#4B4995',
        customP2BackgroundD_100: '#2A2662',
        customP2BackgroundD_300: '#343172',
        customP2BackgroundD_400: '#3E3C80',
        customP2BackgroundD_600: '#5A58B1',
        customP2BackgroundD_700: '#6E6ADE',
        customP2BackgroundD_800: '#6363BD',
        customP2ForegroundD_100: '#190E18',
        customP2ButtonD: '#D7ACD0',
        customP2ForegroundD_200: '#291927',
        customP2ForegroundD_300: '#361F33',
        customP2ForegroundD_400: '#41253D',
        customP2ForegroundD_500: '#4D2D49',
        customP2ForegroundD_600: '#5E3859'
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
}
