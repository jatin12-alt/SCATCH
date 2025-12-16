/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        accent: 'var(--color-accent)',
        error: 'var(--color-error)',
        textPrimary: 'var(--color-text)'
      },
      boxShadow: {
        glow: '0 10px 30px rgba(34, 211, 238, 0.15)',
        card: '0 4px 24px rgba(0, 0, 0, 0.35)'
      }
    }
  },
  plugins: []
};