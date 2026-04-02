/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        safe: '#22c55e',
        unsafe: '#ef4444',
        uncertain: '#eab308',
      },
      boxShadow: {
        soft: '0 10px 30px rgba(15, 23, 42, 0.08)',
        card: '0 4px 14px rgba(15, 23, 42, 0.08)',
      },
      borderRadius: {
        card: '1rem',
      },
    },
  },
  plugins: [],
}

