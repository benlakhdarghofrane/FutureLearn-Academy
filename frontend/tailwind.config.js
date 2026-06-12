/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0D0D1A',
        surface: '#12121F',
        card: '#1A1A2E',
        border: '#2A2A45',
        primary: {
          DEFAULT: '#6C47FF',
          hover: '#7C5CFF',
          light: '#8B6FFF',
        },
        accent: {
          blue: '#4F8EF7',
          purple: '#A855F7',
          cyan: '#22D3EE',
          green: '#10B981',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#A0A0C0',
          muted: '#6B6B8A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'radial-gradient(ellipse at 50% 0%, rgba(108,71,255,0.3) 0%, transparent 70%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        glowPulse: { '0%,100%': { boxShadow: '0 0 20px rgba(108,71,255,0.3)' }, '50%': { boxShadow: '0 0 40px rgba(108,71,255,0.6)' } },
      },
    },
  },
  plugins: [],
};
