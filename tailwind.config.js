/** @type {import('tailwindcss').Config} */
module.exports = {
  // Toggle dark mode by adding/removing a `dark` class on <html>.
  darkMode: 'class',

  // Tailwind purges any class not referenced in these files.
  content: [
    './*.html',
    './_layouts/**/*.html',
    './_includes/**/*.html',
    './_data/**/*.yml',
    './js/**/*.js',
  ],

  theme: {
    extend: {
      // Grayscale-only palette: background, text, secondary text, and one
      // border tone. RGB values live as CSS variables in css/input.css and
      // switch when the `dark` class is on <html>, so no `dark:` prefixes.
      colors: {
        canvas:   'rgb(var(--color-canvas) / <alpha-value>)',
        hairline: 'rgb(var(--color-hairline) / <alpha-value>)',
        ink:      'rgb(var(--color-ink) / <alpha-value>)',
        muted:    'rgb(var(--color-muted) / <alpha-value>)',
      },

      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Inter"',
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          '"Liberation Mono"',
          'monospace',
        ],
      },

      maxWidth: {
        content: '40rem',
      },
    },
  },

  plugins: [
    require('@tailwindcss/typography'),
  ],
};
