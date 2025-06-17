/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Custom color palette for SinkedIn
      // Warm, inviting colors that encourage vulnerability and connection
      colors: {
        primary: {
          50: '#fff7ed',   // Cream background
          100: '#ffedd5',
          400: '#fb923c',  // Added missing primary-400 shade
          500: '#f97316',  // Soft orange for headers/buttons
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',  // Added missing primary-800 shade
        },
        neutral: {
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d1d5db',  // Gray for secondary elements
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        }
      },
      // Inter font for modern, readable typography
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      // Custom spacing for consistent layout
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      }
    },
  },
  plugins: [],
};