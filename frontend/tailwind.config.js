/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0c', // Deep matte dark
        surface: '#121216', // Dark steel
        panel: '#1f1f26',
        primary: '#FF0033', // Neon Red Cyberpunk
        accent: '#FF4655', // Neon Coral
        lavender: '#C4B5FD', // For typography pop
        text: {
          main: '#ECE8E1',
          muted: '#8B97A2'
        }
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'], // Or Oswald/Clash Display
        sans: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'brutalist-grid': 'linear-gradient(to right, #1f1f26 1px, transparent 1px), linear-gradient(to bottom, #1f1f26 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid-size': '40px 40px',
      }
    },
  },
  plugins: [],
}
