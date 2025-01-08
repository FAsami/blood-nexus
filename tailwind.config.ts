import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        primary: ['var(--font-primary)'],
        bengali: ['var(--font-bengali)']
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)'
      },
      keyframes: {
        beat: {
          '0%, 100%': { transform: 'scale(1)' },
          '25%': { transform: 'scale(1.2)' },
          '50%': { transform: 'scale(0.95)' },
          '75%': { transform: 'scale(1.1)' }
        },
        flow: {
          '0%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-10px) scale(1.1)' },
          '100%': { transform: 'translateY(0) scale(1)' }
        },
        'fade-in': {
          '0%': { opacity: '0.5' },
          '100%': { opacity: '1' }
        }
      },
      animation: {
        beat: 'beat 1.5s ease-in-out infinite',
        flow: 'flow 2s ease-in-out infinite',
        'fade-in': 'fade-in 2s ease-in-out infinite'
      }
    }
  },
  plugins: []
}

export default config
