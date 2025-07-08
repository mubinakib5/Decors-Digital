/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: "#E53935",
          redAccent: "#FF6F61",
          black: "#181818",
          charcoal: "#232323",
          silver: "#B0B0B0",
          white: "#F5F5F5",
          gradient: "linear-gradient(90deg, #E53935 0%, #FF6F61 100%)",
        },
      },
      fontFamily: {
        sans: [
          "Manrope",
          "Inter",
          "Poppins",
          "var(--font-manrope)",
          "sans-serif",
        ],
        manrope: ["Manrope", "var(--font-manrope)", "sans-serif"],
        cormorant: ["Cormorant", "var(--font-cormorant)", "serif"],
      },
    },
  },
  plugins: [],
};
