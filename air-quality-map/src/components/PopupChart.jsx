import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";

function PopupChart({ data }) {
  const chartRef = useRef();

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    const sortedData = Object.entries(data).sort((a, b) => b[1] - a[1]);
    const labels = sortedData.map((entry) => entry[0]);
    const values = sortedData.map((entry) => entry[1]);

    const colors = [
      "rgba(255, 0, 0, 0.6)", // Rosso per PM10
      "rgba(54, 162, 235, 0.6)", // Blu per PM2.5
      "rgba(0, 128, 0, 0.6)", // Verde per OZONE
      "rgba(255, 255, 0, 0.6)", // Giallo per NO2
      "rgba(255, 165, 0, 0.6)", // Arancione per CO
      "rgba(128, 0, 128, 0.6)", // Viola per SO2
    ];

    const chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            data: values,
            backgroundColor: colors,
            borderColor: colors.map((color) => color.replace("0.6", "1")),
            borderWidth: 1,
          },
        ],
      },
      options: {
        indexAxis: "y", // Ruota l'asse delle x per visualizzare barre orizzontali
        responsive: true,
        scales: {
          x: {
            display: false, // Nasconde le scritte sull'asse x
            grid: {
              color: "rgba(255, 255, 255, 0)", // Griglia bianca con opacità 0.3
            },
            ticks: {
              font: {
                size: 12, // Dimensione del carattere per le etichette dell'asse Y
              },
              color: "white", // Colore delle etichette dell'asse Y
            },
          },
          y: {
            display: true, // Nasconde le scritte sull'asse y
            grid: {
              color: "rgba(255, 255, 255, 0)", // Griglia bianca con opacità 0.3
            },
            ticks: {
              font: {
                size: 12, // Dimensione del carattere per le etichette dell'asse Y
              },
              color: "white", // Colore delle etichette dell'asse Y
            },
          },
        },
        plugins: {
          legend: {
            display: false, // Nasconde la legenda
          },
        },
      },
    });

    return () => {
      chart.destroy();
    };
  }, [data]);

  return <canvas ref={chartRef} />;
}

export default PopupChart;
