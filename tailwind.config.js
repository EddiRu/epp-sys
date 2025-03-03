/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './src/**/*.{html,ts}',
    "./node_modules/@ionic/angular/**/*.js"
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/typography') // Agrega esta línea si necesitas mejorar la tipografía
  ],
};

