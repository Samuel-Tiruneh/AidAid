/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tomato: "#FF6347",
      },
      fontFamily: {
        oswald: ["Oswald", "sans-serif"], 
        lora: ["Lora", "serif"], 
        poppins: ["Poppins", "sans-serif"], 
      },
    },
  },
  plugins: [],
};
