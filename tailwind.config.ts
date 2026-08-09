import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        terra: {
          800: '#A0522D',
        },
        sage: {
          500: '#8A9A5B',
        },
        sand: {
          50: '#F5F5DC',
        }
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'serif'],
        mono: ['var(--font-space-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
};
export default config;
