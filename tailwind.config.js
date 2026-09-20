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
      // Semantic color tokens. The actual RGB values are defined as CSS
      // variables in css/input.css and switch automatically when the `dark`
      // class is added to <html>. This means most components don't need
      // `dark:` prefixes - `bg-canvas` just works in both modes.
      colors: {
        canvas:    'rgb(var(--color-canvas) / <alpha-value>)',
        surface:   'rgb(var(--color-surface) / <alpha-value>)',
        elevated:  'rgb(var(--color-elevated) / <alpha-value>)',
        hairline:  'rgb(var(--color-hairline) / <alpha-value>)',
        ink:       'rgb(var(--color-ink) / <alpha-value>)',
        muted:     'rgb(var(--color-muted) / <alpha-value>)',
        subtle:    'rgb(var(--color-subtle) / <alpha-value>)',
        accent:    'rgb(var(--color-accent) / <alpha-value>)',
        'accent-hover': 'rgb(var(--color-accent-hover) / <alpha-value>)',
        success:   'rgb(var(--color-success) / <alpha-value>)',
        warning:   'rgb(var(--color-warning) / <alpha-value>)',
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
        prose: '70ch',
        content: '64rem',
      },

      // Slightly tighter line-height for headings, looser for body.
      lineHeight: {
        tight: '1.15',
        relaxed: '1.7',
      },

      // Subtle, purpose-built animations only.
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 400ms ease-out both',
      },
    },
  },

  plugins: [
    require('@tailwindcss/typography'),
  ],
};
