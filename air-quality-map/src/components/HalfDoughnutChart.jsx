import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";

const HalfDoughnutChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    // Dati del grafico
    const data = {
      labels: ["Rosso", "Blu", "Verde"],
      datasets: [
        {
          data: [300, 50, 100],
          backgroundColor: ["#FF6384", "#36A2EB", "#4CAF50"],
        },
      ],
    };

    // Opzioni del grafico
    const options = {
      responsive: true,
      circumference: 180,
      rotation: -90,
      legend: {
        display: false, // Nasconde la legenda
      },
      tooltips: {
        enabled: false, // Disabilita i tooltip
      },
      plugins: {
        legend: {
          labels: {
            generateLabels: function () {
              return []; // Nasconde i quadratini delle legende
            },
          },
        },
      },
    };

    // Creazione del grafico
    const ctx = chartRef.current.getContext("2d");
    const myChart = new Chart(ctx, {
      type: "doughnut",
      data: data,
      options: options,
    });

    // when component unmounts
    return () => {
      myChart.destroy();
    };
  }, []);

  return (
    <div style={{ width: "150px", height: "150px" }}>
      <canvas ref={chartRef} />
    </div>
  );
};

export default HalfDoughnutChart;
