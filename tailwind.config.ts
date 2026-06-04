import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#FFF0F2',
          100: '#FFD6DB',
          200: '#FFB3BC',
          300: '#FF8090',
          400: '#E8294A',
          500: '#C8102E',
          600: '#A50D25',
          700: '#7A0A1C',
          800: '#540718',
        },
        fifa: {
          red:    '#C8102E',
          orange: '#F4600C',
          lime:   '#7DBB2D',
          blue:   '#0033A0',
          purple: '#6B3FA0',
          yellow: '#FFD700',
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
