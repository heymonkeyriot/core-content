/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        yellow: "#FFE681",
        black: "#100A26",
        darkBlue: "#251757",
        navy: "#2A1182",
        teal: "#3BECCD",
        red: "#FD5765",
        accent: {
          50: "#F1F0FA",
          100: "#E0E4E8",
          200: "#C4BEEE",
          300: "#9E8CE8",
          400: "#355b73",
          500: "#240E6D",
          600: "#1E0B58",
          700: "#180843",
          800: "#12052E",
          900: "#0C0219"
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
