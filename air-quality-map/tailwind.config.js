/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      scrollbar: {
        width: "8px", // Larghezza della barra di scorrimento
        backgroundColor: "#f2f2f2", // Colore dello sfondo grigio chiaro
        thumb: "#ccc", // Colore della barra di scorrimento grigia
        thumbHover: "#999", // Colore della barra di scorrimento grigia più scuro al passaggio del mouse
      },
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
  variants: {},
  plugins: [
    [require("tailwind-scrollbar")],
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
