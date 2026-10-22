/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#131921',
          slate: '#232f3e',
          accent: '#febd69',
          'accent-hover': '#f3a847',
          orange: '#ff9900',
          blue: '#007185',
          'blue-hover': '#004b58',
          link: '#007185',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
