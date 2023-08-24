import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";

const PollutantsDoughnutChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const data = {
      labels: ["PM10", "PM25", "O3", "CO", "NO2", "SO2"],
      datasets: [
        {
          data: [25, 40, 30, 15, 20, 10], // Esempio di valori per ciascun inquinante
          backgroundColor: [
            "rgba(255, 99, 132, 0.8)", // Rosso per PM10
            "rgba(54, 162, 235, 0.8)", // Blu per PM25
            "rgba(75, 192, 192, 0.8)", // Verde per O3
            "rgba(255, 206, 86, 0.8)", // Arancione per CO
            "rgba(255, 159, 64, 0.8)", // Giallo per NO2
            "rgba(153, 102, 255, 0.8)", // Viola per SO2
          ],
          borderWidth: 0,
          datalabels: {
            anchor: "end",
            clamp: true,
            fontSize: 10,
          },
        },
      ],
    };

    // Opzioni del grafico
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
          position: "bottom",
        },
        datalabels: {
          formatter: (value, context) => {
            return data.labels[context.dataIndex];
          },
          backgroundColor: function (context) {
            return context.dataset.backgroundColor;
          },
          borderColor: "white",
          borderRadius: 25,
          borderWidth: 2,
          color: "white",
          display: function (context) {
            var dataset = context.dataset;
            var count = dataset.data.length;
            var value = dataset.data[context.dataIndex];
            return value > count * 1.5;
          },
          font: {
            weight: "bold",
          },
          padding: 5,
        },
      },
      // Core options
      aspectRatio: 4 / 3,
      cutoutPercentage: 32,
      layout: {
        padding: 0,
      },
      elements: {
        line: {
          fill: false,
        },
        point: {
          hoverRadius: 7,
          radius: 5,
        },
      },
    };

    // Creazione del grafico
    const ctx = chartRef.current.getContext("2d");
    const myChart = new Chart(ctx, {
      type: "doughnut", // Tipo di grafico doughnut
      data: data,
      options: options,
    });

    // when component unmounts
    return () => {
      myChart.destroy();
    };
  }, []);

  return (
    <div style={{ width: "150px", height: "150px", padding: 0 }}>
      <canvas ref={chartRef} />
    </div>
  );
};

export default PollutantsDoughnutChart;
