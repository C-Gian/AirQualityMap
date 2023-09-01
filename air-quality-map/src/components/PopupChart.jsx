import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";

function PopupChart({ data, nightMode, colorBlindMode }) {
  const chartRef = useRef();

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    const pollutantColors = colorBlindMode
      ? {
          TEMP: "rgba(255, 255, 255, 1)", //bianco
          CO: "rgba(255, 165, 0, 1)", // Arancione
          SO2: "rgba(128, 0, 128, 1)", // Viola
          NO2: "rgba(255, 255, 0, 1)", // Giallo
          "PM2.5": "rgba(0, 0, 255, 1)", // Blu
          PM10: "rgba(255, 192, 203, 1)", // Rosa
          OZONE: "rgba(128, 128, 128, 1)", // Grigio
        }
      : {
          CO: "rgba(255, 165, 0, 1)",
          SO2: "rgba(128, 0, 128, 1)",
          NO2: "rgba(255, 255, 0, 1) ",
          "PM2.5": "rgba(0, 0, 255, 1)",
          PM10: "rgba(255, 0, 0, 1) ",
          OZONE: "rgba(0, 128, 0, 1) ",
        };

    const sortedData = Object.entries(data).sort((a, b) => b[1] - a[1]);
    const labels = sortedData.map((entry) => entry[0]);
    const values = sortedData.map((entry) => entry[1]);
    const colors = labels.map((label) => pollutantColors[label]);

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
              color: nightMode
                ? "rgba(255, 255, 255, 0.1)"
                : "rgba(51, 51, 51, 0.1)", // Colore delle linee di griglia sull'asse Y
            },
            ticks: {
              font: {
                family: "PoppinsLight", // Imposta il font desiderato
                size: 12, // Imposta la dimensione del font desiderata
              },
              color: nightMode ? "white" : "#333",
            },
          },
          y: {
            display: true, // Nasconde le scritte sull'asse y
            grid: {
              color: nightMode
                ? "rgba(255, 255, 255, 0.1)"
                : "rgba(51, 51, 51, 0.1)", // Colore delle linee di griglia sull'asse Y
            },
            ticks: {
              font: {
                size: 12, // Dimensione del carattere per le etichette dell'asse Y
              },
              color: nightMode ? "white" : "#333",
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

  return (
    <div className="popup-chart">
      <canvas ref={chartRef} />
    </div>
  );
}

export default PopupChart;
