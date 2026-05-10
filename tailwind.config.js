/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0b',
        surface: '#141416',
        surfaceHover: '#1c1c1f',
        border: '#27272a',
        text: '#fafafa',
        textSecondary: '#a1a1aa',
        accent: '#22d3ee',
        accentHover: '#06b6d4',
      },
    },
  },
  plugins: [],
}
