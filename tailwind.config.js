/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        oepro: {
          obsidian: '#171717',     // Pure deep luxury black
          charcoal: '#262626',     // High-contrast secondary
          muted: '#737373',        // WCAG AA body caption
          subtle: '#A3A3A3',       // Hairline annotations
          pine: '#2D4A3E',         // Subtle brand cotton signature (Mineral Green)
          warm: '#FBFBFA',         // Warm ecru background
          card: '#F5F5F3',         // Architectural neutral card backdrop
          border: '#E5E5E0',       // 1px hairline border
          crimson: '#991B1B',      // Refined discount/sale tag
          emerald: '#166534',      // Refined trust/guarantee green
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px 0 rgba(0, 0, 0, 0.02)',
        'elevated': '0 10px 30px -10px rgba(0, 0, 0, 0.08)',
      }
    },
  },
  plugins: [],
}
