/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      textStrokeWidth: {
        2: "2px", // Imposta la larghezza della traccia
      },
      textStrokeColor: (theme) => theme("colors"), // Usa i colori definiti nel tema di Tailwind CSS
      colors: {
        primary: "#F53850",
      },
      width: {
        15: "15px",
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
        15: "15px",
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
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const utilities = {
        ".text-stroke": {
          "-webkit-text-stroke":
            "var(--tw-text-stroke-width, 0) var(--tw-text-stroke-color, transparent)",
          "text-stroke":
            "var(--tw-text-stroke-width, 0) var(--tw-text-stroke-color, transparent)",
          "-webkit-fill-color": "transparent",
        },
      };

      addUtilities(utilities);
    },
  ],
};
