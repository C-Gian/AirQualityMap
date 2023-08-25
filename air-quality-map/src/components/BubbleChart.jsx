import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";

const BubbleChart = ({ data }) => {
  const chartContainer = useRef(null);

  useEffect(() => {
    if (chartContainer.current) {
      const ctx = chartContainer.current.getContext("2d");

      const labels = data.map((_, index) => `Giorno ${index + 1}`);
      const yValues = data;

      console.log(data);

      const myChart = new Chart(ctx, {
        type: "bubble",
        data: {
          labels: labels,
          datasets: [
            {
              data: yValues.map((y) => ({
                x: y,
                y: 0, // L'asse y è costante per allineare le bolle
                r: 10, // Imposta la dimensione delle bolle
              })),
              backgroundColor: "rgba(75, 192, 192, 0.6)",
              borderColor: "rgba(75, 192, 192, 1)",
            },
          ],
        },
        options: {
          scales: {
            x: {
              title: {
                display: true,
                text: "Days", // Testo per la descrizione dell'asse x
                color: "white",
              },
              grid: {
                color: "rgba(255, 255, 255, 0.3)", // Griglia sull'asse X: bianco con opacità 0.3
              },
              ticks: {
                color: "white", // Colore delle etichette dell'asse y
              },
            },
            y: {
              grid: {
                color: "rgba(255, 255, 255, 0.3)", // Griglia sull'asse X: bianco con opacità 0.3
              },
              ticks: {
                color: "white", // Colore delle etichette dell'asse y
              },
            },
          },
          layout: {
            padding: 0, // Imposta il padding a 0
            margin: 0,
          },
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              enabled: false,
            },
          },
        },
      });
      // Clean up the chart instance on unmount
      return () => {
        myChart.destroy();
      };
    }
  }, [data]);

  return (
    <div style={{ width: "100%", margin: "0 auto" }}>
      <canvas
        ref={chartContainer}
        style={{ width: "100%", height: "100%" }}
        width="300"
        height="200"
      />
    </div>
  );
};

export default BubbleChart;
