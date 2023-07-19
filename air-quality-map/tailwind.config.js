/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#F53850",
      },
      width: {
        75: "75px",
        100: "100px",
        200: "200px",
        250: "250px",
        300: "300px",
        400: "400px",
        500: "500px",
        600: "600px",
        700: "700px",
        800: "800px",
        900: "900px",
      },
      height: {
        75: "75px",
        100: "100px",
        200: "200px",
        300: "300px",
        400: "400px",
        600: "600px",
        700: "700px",
        800: "800px",
        900: "900px",
      },
    },
  },
  plugins: [],
};
