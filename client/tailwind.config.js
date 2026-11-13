/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Geist"', '"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        navy: {
          800: '#1e293b',
          900: '#0f172a',
          950: '#0a0f1d',
        },
        // Refined B2B palette
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          150: '#efefef',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
        accent: {
          amber: '#f59e0b',
          rose: '#ef4444',
          emerald: '#10b981',
          sky: '#0284c7',
        }
      },
      boxShadow: {
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'sm': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'base': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'md': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
        'lg': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 12px 24px -6px rgba(15, 23, 42, 0.12), 0 4px 8px -2px rgba(15, 23, 42, 0.06)',
        'glow-teal': '0 0 20px -3px rgba(13, 148, 136, 0.25)',
        'glow-amber': '0 0 20px -3px rgba(245, 158, 11, 0.25)',
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }],
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        radarPulse: {
          '0%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(13, 148, 136, 0.6)' },
          '70%': { transform: 'scale(1)', boxShadow: '0 0 0 8px rgba(13, 148, 136, 0)' },
          '100%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(13, 148, 136, 0)' },
        },
        radarPulseAmber: {
          '0%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(245, 158, 11, 0.6)' },
          '70%': { transform: 'scale(1)', boxShadow: '0 0 0 8px rgba(245, 158, 11, 0)' },
          '100%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(245, 158, 11, 0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' }
        }
      },
      animation: {
        fadeIn: 'fadeIn 250ms ease-out',
        slideUp: 'slideUp 300ms cubic-bezier(0.16, 1, 0.3, 1)',
        slideDown: 'slideDown 250ms cubic-bezier(0.16, 1, 0.3, 1)',
        scaleIn: 'scaleIn 200ms cubic-bezier(0.16, 1, 0.3, 1)',
        radar: 'radarPulse 2s infinite',
        radarAmber: 'radarPulseAmber 2s infinite',
      },
    },
  },
  plugins: [],
}
