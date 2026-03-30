import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Stardew Valley palette
        stardew: {
          brown: '#8B6914',
          green: '#4A7C59',
          gold: '#F4C430',
          sky: '#87CEEB',
          earth: '#C4A265',
        },
      },
    },
  },
  plugins: [],
} satisfies Config
