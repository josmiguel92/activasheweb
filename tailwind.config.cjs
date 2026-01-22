const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Plus Jakarta Sans", ...defaultTheme.fontFamily.sans],
        display: ["Fraunces", ...defaultTheme.fontFamily.serif],
      },
      colors: {
        chocolate: '#2D1B14',
        terracotta: '#C45B3D',
        mustard: '#F6A700',
        olive: '#3F6B0F',
        'soft-olive': '#556E2F',
        'vibrant-orange': '#FF7033',
        'warm-cream': '#FDF8F3',
        accent: 'rgb(249 115 22 / var(--tw-bg-opacity))',
        'accent-600': '#ff6a3f'
      }
    },
  },
  plugins: [],
};
