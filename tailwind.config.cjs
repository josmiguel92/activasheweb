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
        'accent-600': '#ff6a3f',
        // Versiones oscurecidas para usar sobre warm-cream. El mismo tono, con
        // el contraste que pide la norma: 4,5:1 para texto y 3:1 para iconos.
        // Terracota: 5,6:1 (AA para texto normal)
        'terracotta-deep': '#A8462C',
        // Mostaza: 3,3:1. La original queda en 1,9:1 sobre crema.
        'mustard-deep': '#B87D00',
        // Naranja: 3,8:1. La original queda en 2,6:1 sobre crema.
        'orange-deep': '#E54500'
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            // Paleta clara (fondo warm-cream)
            '--tw-prose-body': theme('colors.chocolate'),
            '--tw-prose-headings': theme('colors.chocolate'),
            '--tw-prose-lead': theme('colors.chocolate'),
            '--tw-prose-links': theme('colors.terracotta-deep'),
            '--tw-prose-bold': theme('colors.chocolate'),
            '--tw-prose-counters': theme('colors.terracotta-deep'),
            '--tw-prose-bullets': theme('colors.terracotta'),
            '--tw-prose-hr': 'rgb(45 27 20 / 0.15)',
            '--tw-prose-quotes': theme('colors.chocolate'),
            '--tw-prose-quote-borders': theme('colors.mustard'),
            '--tw-prose-captions': 'rgb(45 27 20 / 0.7)',
            '--tw-prose-code': theme('colors.terracotta-deep'),
            '--tw-prose-pre-code': theme('colors.warm-cream'),
            '--tw-prose-pre-bg': theme('colors.chocolate'),
            '--tw-prose-th-borders': 'rgb(45 27 20 / 0.25)',
            '--tw-prose-td-borders': 'rgb(45 27 20 / 0.15)',
            // Paleta invertida (fondos olive / chocolate)
            '--tw-prose-invert-body': 'rgb(253 248 243 / 0.9)',
            '--tw-prose-invert-headings': theme('colors.warm-cream'),
            '--tw-prose-invert-lead': 'rgb(253 248 243 / 0.9)',
            '--tw-prose-invert-links': theme('colors.mustard'),
            '--tw-prose-invert-bold': theme('colors.warm-cream'),
            '--tw-prose-invert-counters': theme('colors.mustard'),
            '--tw-prose-invert-bullets': theme('colors.mustard'),
            '--tw-prose-invert-hr': 'rgb(253 248 243 / 0.2)',
            '--tw-prose-invert-quotes': theme('colors.warm-cream'),
            '--tw-prose-invert-quote-borders': theme('colors.mustard'),
            '--tw-prose-invert-captions': 'rgb(253 248 243 / 0.7)',
            '--tw-prose-invert-code': theme('colors.mustard'),
            '--tw-prose-invert-pre-code': theme('colors.warm-cream'),
            '--tw-prose-invert-pre-bg': 'rgb(0 0 0 / 0.3)',
            '--tw-prose-invert-th-borders': 'rgb(253 248 243 / 0.3)',
            '--tw-prose-invert-td-borders': 'rgb(253 248 243 / 0.2)',

            maxWidth: 'none',
            'h1, h2, h3': {
              fontFamily: theme('fontFamily.display').join(', '),
              fontWeight: '800',
              lineHeight: '1.2',
            },
            h2: { marginTop: '2.25em', marginBottom: '0.75em' },
            h3: { marginTop: '1.75em', marginBottom: '0.5em' },
            h4: { fontWeight: '700' },
            a: {
              textDecorationThickness: '2px',
              textUnderlineOffset: '3px',
              transition: 'color 150ms',
              '&:hover': { color: theme('colors.terracotta') },
            },
            'a:focus-visible': {
              outline: `3px solid ${theme('colors.mustard')}`,
              outlineOffset: '2px',
              borderRadius: '2px',
            },
            strong: { fontWeight: '700' },
            blockquote: {
              fontStyle: 'italic',
              borderLeftWidth: '4px',
              paddingTop: '0.5em',
              paddingBottom: '0.5em',
              paddingRight: '1em',
              borderRadius: '0 1rem 1rem 0',
              backgroundColor: 'rgb(246 167 0 / 0.08)',
            },
            'blockquote p:first-of-type::before': { content: 'none' },
            'blockquote p:last-of-type::after': { content: 'none' },
            img: {
              marginLeft: 'auto',
              marginRight: 'auto',
              marginTop: '2.5em',
              marginBottom: '2.5em',
              maxHeight: '32rem',
              width: 'auto',
              maxWidth: '100%',
              borderRadius: '1.5rem',
              objectFit: 'contain',
              boxShadow: '0 10px 30px -15px rgb(45 27 20 / 0.35)',
            },
            code: {
              backgroundColor: 'rgb(45 27 20 / 0.06)',
              borderRadius: '0.375rem',
              padding: '0.15em 0.4em',
              fontWeight: '500',
            },
            'code::before': { content: 'none' },
            'code::after': { content: 'none' },
            hr: { marginTop: '2.5em', marginBottom: '2.5em' },
          },
        },
        invert: {
          css: {
            img: { boxShadow: '0 10px 30px -15px rgb(0 0 0 / 0.5)' },
            code: { backgroundColor: 'rgb(253 248 243 / 0.1)' },
            blockquote: { backgroundColor: 'rgb(253 248 243 / 0.06)' },
            'a:hover': { color: theme('colors.vibrant-orange') },
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
