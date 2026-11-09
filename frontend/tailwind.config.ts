import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
    './src/data/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        '3xl': '1800px',
        '4xl': '2160px',
      },
      colors: {
        cream: {
          DEFAULT: '#EEE6E2',
          light: '#F8F4F2',
          dark: '#E2D7D1',
        },
        teal: {
          DEFAULT: '#1E5A54',
          light: '#2B756E',
          dark: '#14423E',
          muted: 'rgba(30, 90, 84, 0.7)',
          subtle: 'rgba(30, 90, 84, 0.1)',
          border: 'rgba(30, 90, 84, 0.18)',
        },
        orange: {
          DEFAULT: '#F7623D',
          hover: '#E05330',
          light: '#FFA085',
        },
        background: '#EEE6E2',
        foreground: '#1E5A54',
        card: {
          DEFAULT: '#EEE6E2',
          foreground: '#1E5A54',
        },
        popover: {
          DEFAULT: '#EEE6E2',
          foreground: '#1E5A54',
        },
        primary: {
          DEFAULT: '#F7623D',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#1E5A54',
          foreground: '#EEE6E2',
        },
        muted: {
          DEFAULT: 'rgba(30, 90, 84, 0.65)',
          foreground: 'rgba(30, 90, 84, 0.65)',
        },
        accent: {
          DEFAULT: '#F7623D',
          foreground: '#ffffff',
        },
        destructive: {
          DEFAULT: '#dc2626',
          foreground: '#ffffff',
        },
        border: 'rgba(30, 90, 84, 0.18)',
        input: 'rgba(30, 90, 84, 0.25)',
        ring: '#1E5A54',
      },
      fontFamily: {
        headline: ['var(--font-anton)', 'Anton', 'Impact', 'League Gothic', 'Bebas Neue', 'sans-serif'],
        sans: ['var(--font-sans)', 'Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        'wide-caps': '0.15em',
        'extra-wide': '0.2em',
      },
    },
  },
  plugins: [],
};

export default config;
