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
          600: "#5B21B6",
          500: "#8B5CF6",
        },
        accent: {
          500: "#F59E0B",
        },
        surface: {
          50: "#F9FAFB",
          100: "#FFFFFF",
        },
      },
      fontFamily: {
        'display': ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}