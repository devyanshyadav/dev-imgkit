/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      colors:{
        primary: '#FFFFFF',
        accent: '#9D4EDD',
        shade: '#e2e8f0',
      }
    },
  },

  plugins: [],
};
