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
      fontSize: {
        '4.5xl': ['2.5rem', { lineHeight: '3rem' }] // 40px
      },
      colors: {
        customColorPrimary: '#E6E3D8',
        customColorPrimaryLight: '#f5f3eb',
        customColorSecondary: '#ecf3f9',
        textPrimary: '#423e31',
        customColorTertiary: '#2B5D6E',
        customColorTertiaryLight: '#6295A8',
        customColorTertiaryDark: '#203E49',
        customColorTertiarypop: '#7CADC0',
        Neutral1: '#4C4C4C',
        Neutral2: '#686868',
        Neutral3: '#686868',
        Neutral4: '#D9D9D9',
        Neutral5: '#E4E4E4',
        customBorder: '#C2B99E',
        customP2Primary: '#8A91B7',
        customP2BackgroundW: '#F8F8FF',
        customP2BackgroundW_500: '#D9DCFF',
        customP2BackgroundW_700: '#B6BAF6',
        customP2BackgroundW_600: '#CACEFE',
        customP2BackgroundW_400: '#E5E7FF',
        // for admin dark mode custom colors
        customP2BackgroundD: '#222345',
        customP2BackgroundD_darkest: '#070F2B',
        customP2BackgroundD_100: '#0F0E2D',
        customP2BackgroundD_200: '#1B1A55',
        customP2BackgroundD_300: '#27266D',
        customP2BackgroundD_400: '#333285',
        customP2BackgroundD_500: '#3F3E9D',
        customP2BackgroundD_600: '#4B4AB5',
        customP2BackgroundD_700: '#5756CD',
        customP2BackgroundD_800: '#6362E5',
        customP2ForegroundD_100: '#190E18',
        customP2ButtonD: '#D7ACD0',
        customP2ForegroundD_200: '#8A91B7',
        customP2ForegroundD_300: '#737BA8',
        customP2ForegroundD_400: '#5D6699',
        customP2ForegroundD_500: '#535C91',
        customP2ForegroundD_600: '#3F466D'
      }
    }
  },
  plugins: [import('@tailwindcss/forms'), 'prettier-plugin-tailwindcss']
}
