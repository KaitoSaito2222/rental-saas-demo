import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0f172a',
        sand: '#f8f4e8',
        ember: '#f97316',
        slate: '#475569',
      },
      boxShadow: {
        soft: '0 18px 60px rgba(15, 23, 42, 0.12)',
      },
    },
  },
  plugins: [],
};

export default config;
