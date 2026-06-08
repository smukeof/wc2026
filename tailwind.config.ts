import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#fdf9ec',
          100: '#f9eecc',
          200: '#f2d98a',
          300: '#e8c155',
          400: '#d4a848',
          500: '#c9a227',
          600: '#a88520',
          700: '#7d6218',
          800: '#54410f',
        },
      },
      fontFamily: {
        display: ['system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
