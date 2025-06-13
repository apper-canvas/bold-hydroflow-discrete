/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0EA5E9',
        secondary: '#06B6D4',
        accent: '#10B981',
        surface: '#F0F9FF',
        background: '#FFFFFF',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        heading: ['Poppins', 'ui-sans-serif', 'system-ui']
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ripple': 'ripple 0.6s linear',
        'splash': 'splash 0.8s ease-out',
        'wave': 'wave 2s ease-in-out infinite'
      },
      keyframes: {
        ripple: {
          '0%': {
            transform: 'scale(0)',
            opacity: '1'
          },
          '100%': {
            transform: 'scale(4)',
            opacity: '0'
          }
        },
        splash: {
          '0%': {
            transform: 'scale(0) rotate(0deg)',
            opacity: '1'
          },
          '50%': {
            transform: 'scale(1.2) rotate(180deg)',
            opacity: '0.8'
          },
          '100%': {
            transform: 'scale(1) rotate(360deg)',
            opacity: '0'
          }
        },
        wave: {
          '0%, 100%': {
            transform: 'translateY(0)'
          },
          '50%': {
            transform: 'translateY(-10px)'
          }
        }
      }
    },
  },
  plugins: [],
}