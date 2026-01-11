/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          black: '#0a0a0a',
          dark: '#121212',
          green: '#00ff41',
          cyan: '#0ea5e9',
          dim: '#ffffff20'
        }
      },
      fontFamily: {
        mono: ['Courier New', 'monospace'],
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(to right, #1f2937 1px, transparent 1px), linear-gradient(to bottom, #1f2937 1px, transparent 1px)",
      }
    },
  },
  plugins: [],
}
