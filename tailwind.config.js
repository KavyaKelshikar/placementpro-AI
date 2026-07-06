export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f7ff',
          100: '#e7ebff',
          500: '#4f46e5',
          600: '#4338ca',
          700: '#3730a3',
        },
      },
      boxShadow: {
        soft: '0 20px 45px -20px rgba(15, 23, 42, 0.25)',
      },
    },
  },
  plugins: [],
};
