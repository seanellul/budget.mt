/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#60a5fa',
          dark: '#3b82f6',
          light: '#93c5fd'
        },
        success: '#34d399',
        danger: '#f87171',
        warning: '#fbbf24'
      }
    },
  },
  darkMode: 'media',
  plugins: [],
} 