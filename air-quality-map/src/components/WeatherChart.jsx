import React from "react";
import { Chart } from "chart.js/auto";

const WeatherChart = () => {
  React.useEffect(() => {
    const ctx = document.getElementById("weather-chart").getContext("2d");
    new Chart(ctx, {
      type: "line",
      data: {
        labels: ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"],
        datasets: [
          {
            label: "Temperatura Reale",
            data: [20, 21, 22, 23, 24, 25, 26],
            fill: false,
          },
          {
            label: "Temperatura Percepita",
            data: [19, 20, 21, 22, 22, 23, 24],
            fill: false,
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            labels: {
              color: "white",
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: "white",
            },
          },
          y: {
            ticks: {
              color: "white",
            },
          },
        },
      },
    });
  }, []);

  return <canvas id="weather-chart" width="400" height="200"></canvas>;
};

export default WeatherChart;
