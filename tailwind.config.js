/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'navy': '#1E3A8A',
        'emerald': '#10B981',
        'teal': '#0D9488',
        'amber': '#D97706',
        'crimson': '#DC2626',
      },
      fontFamily: {
        'display': ['"Wix Madefor Display"', 'sans-serif'],
        'headline': ['"Wix Madefor Display"', 'sans-serif'],
        'title': ['"Instrument Sans"', 'sans-serif'],
        'body': ['"Instrument Sans"', 'sans-serif'],
        'code': ['"Red Hat Mono"', 'monospace'],
      }
    },
  },
  plugins: [],
}
