import type { Config } from 'tailwindcss'

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'SF Pro Text', 'SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI',
          'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif'
        ]
      },
      colors: {
        apple: {
          blue: '#0071e3'
        }
      },
      boxShadow: {
        soft: '0 4px 24px rgba(0,0,0,0.25)'
      }
    },
  },
  plugins: [],
} satisfies Config
