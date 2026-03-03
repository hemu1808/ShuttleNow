/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // We will control this manually like you do in ThemeProvider
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // The Vercel/Linear standard
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        // "Galactic" Dark Theme Palette
        space: {
          950: '#030712', // Deepest black-blue
          900: '#0b1221',
          800: '#151e32',
        },
        // "Folklore" Accent
        forest: {
          500: '#10b981', // Emerald glow
          900: '#064e3b',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'leaf-fall': 'leafFall 10s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        leafFall: {
          '0%': { transform: 'translateY(-10%) rotate(0deg)', opacity: '0' },
          '10%': { opacity: '1' },
          '100%': { transform: 'translateY(120vh) rotate(360deg)', opacity: '0' },
        }
      }
    },
  },
  plugins: [],
}