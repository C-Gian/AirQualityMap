import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const AreaChart = ({ data, color }) => {
  const chartContainer = useRef(null);

  function changeHexOpacity(hexColor, opacity) {
    // Rimuovi il carattere "#" se presente
    hexColor = hexColor.replace("#", "");
  
    // Estrapola i canali di colore
    const r = parseInt(hexColor.substring(0, 2), 16);
    const g = parseInt(hexColor.substring(2, 4), 16);
    const b = parseInt(hexColor.substring(4, 6), 16);
  
    // Calcola l'opacità in formato decimale (da 0 a 1)
    const alpha = opacity / 255;
  
    // Ritorna il colore con opacità modificata
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  useEffect(() => {
    if (chartContainer.current) {
      const ctx = chartContainer.current.getContext("2d");

      const labels = ["Today", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"];

      const myChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Dati di Esempio",
              data: data,
              fill: true,
              backgroundColor: changeHexOpacity(color, 128),
              borderColor: changeHexOpacity(color, 190),
              pointRadius: 5,
              pointBackgroundColor: changeHexOpacity(color, 255), // Colore dei punti
              pointHoverRadius: 10, // Aumenta il raggio durante l'hover
            },
          ],
        },
        options: {
          scales: {
            x: {
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
          plugins: {
            legend: {
              display: false, // Nasconde la legenda
            },
          },
        },
      });

      return () => {
        myChart.destroy();
      };
    }
  }, [data]);

  return (
    <div style={{ width: "100%", margin: "0 auto" }}>
      <canvas ref={chartContainer} />
    </div>
  );
};

export default AreaChart;
