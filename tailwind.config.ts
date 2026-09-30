import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FFF3EE',
          100: '#FFE3D6',
          200: '#FFC5A8',
          300: '#FF9E72',
          400: '#F77A43',
          500: '#E8611C',
          600: '#C74E13',
          700: '#A43E10',
          800: '#7E330F',
          900: '#2D2D2D',
          950: '#1C1C1C',
        },
        gold: {
          50: '#FFF7F2',
          100: '#FDE9DF',
          200: '#F8CBB1',
          300: '#F3A67F',
          400: '#ED7E47',
          500: '#E8611C',
          600: '#C74E13',
          700: '#A43E10',
          800: '#7E330F',
          900: '#5C2A10',
        },
        surface: {
          50: '#F5F5F5',
          100: '#F1F1F1',
          200: '#E7E7E7',
          300: '#D9D9D9',
          400: '#B8B8B8',
          500: '#6B6B6B',
          600: '#565656',
          700: '#2D2D2D',
          800: '#1F1F1F',
          900: '#121212',
        }
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Montserrat', 'Segoe UI', 'sans-serif'],
        display: ['var(--font-sans)', 'Montserrat', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 10px 30px -20px rgba(45, 45, 45, 0.25)',
        'card-hover': '0 18px 40px -24px rgba(45, 45, 45, 0.35)',
        'elevated': '0 28px 60px -24px rgba(45, 45, 45, 0.28)',
      }
    },
  },
  plugins: [],
};
export default config;
