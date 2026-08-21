import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#21121a',
        rosewine: '#7e284f',
        blush: '#f7d9e2',
        cream: '#fff7f3',
        lilac: '#d7c2f3',
        plum: '#4c234d'
      },
      boxShadow: {
        glass: '0 24px 70px rgba(53, 18, 44, 0.25)',
        soft: '0 12px 40px rgba(126, 40, 79, 0.14)'
      },
      keyframes: {
        drift: { '0%,100%': { transform: 'translateY(0) translateX(0)' }, '50%': { transform: 'translateY(-18px) translateX(8px)' } },
        pulseGlow: { '0%,100%': { boxShadow: '0 0 0 0 rgba(235, 104, 145, .0)' }, '50%': { boxShadow: '0 0 0 18px rgba(235, 104, 145, .08)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } }
      },
      animation: {
        drift: 'drift 6s ease-in-out infinite',
        pulseGlow: 'pulseGlow 2.8s ease-in-out infinite',
        shimmer: 'shimmer 5s linear infinite'
      }
    }
  },
  plugins: []
}
export default config
