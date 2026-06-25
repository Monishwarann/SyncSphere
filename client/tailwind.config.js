/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          50: '#f4f5f6',
          100: '#e9ebed',
          200: '#c8cbd0',
          300: '#a7abb4',
          400: '#656b7c',
          500: '#232c43',
          600: '#1f283c',
          700: '#1a2132',
          800: '#151b29',
          900: '#0d111a',
          950: '#07090e',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass-glowing': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
      },
      boxShadow: {
        'glass-glow': '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
        'neon-indigo': '0 0 15px rgba(99, 102, 241, 0.4)',
        'neon-cyan': '0 0 15px rgba(6, 182, 212, 0.4)',
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
