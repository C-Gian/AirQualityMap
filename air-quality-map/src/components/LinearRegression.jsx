import React from "react";
import { Scatter } from "react-chartjs-2";
import regression from "regression";

const LinearRegression = ({ datas, id, pollutant, index }) => {
  const data = [
    {
      temperatura: 20,
      co: 100,
      no2: 50,
      so2: 30,
      o3: 40,
      pm10: 70,
      pm25: 60,
    },
    {
      temperatura: 22,
      co: 90,
      no2: 45,
      so2: 35,
      o3: 42,
      pm10: 68,
      pm25: 58,
    },
    {
      temperatura: 18,
      co: 95,
      no2: 55,
      so2: 28,
      o3: 38,
      pm10: 72,
      pm25: 62,
    },
    {
      temperatura: 25,
      co: 85,
      no2: 60,
      so2: 25,
      o3: 36,
      pm10: 75,
      pm25: 64,
    },
    {
      temperatura: 23,
      co: 92,
      no2: 52,
      so2: 29,
      o3: 41,
      pm10: 69,
      pm25: 61,
    },
    {
      temperatura: 27,
      co: 80,
      no2: 48,
      so2: 32,
      o3: 39,
      pm10: 71,
      pm25: 59,
    },
    {
      temperatura: 21,
      co: 97,
      no2: 53,
      so2: 31,
      o3: 37,
      pm10: 73,
      pm25: 63,
    },
  ];
  const temperatures = data.map((item) => item.temperatura);
  const pollutantValues = data.map((item) => item[pollutant]);

  // Calcola la regressione lineare per l'inquinante corrente
  const result = regression.linear(
    temperatures.map((temp, index) => [temp, pollutantValues[index]])
  );
  const slope = result.equation[0];
  const intercept = result.equation[1];

  // Genera i punti per la linea di regressione
  const regressionLine = [
    {
      x: Math.min(...temperatures),
      y: slope * Math.min(...temperatures) + intercept,
    },
    {
      x: Math.max(...temperatures),
      y: slope * Math.max(...temperatures) + intercept,
    },
  ];

  // Definisci i colori per gli inquinanti
  const colors = {
    co: "rgba(255, 0, 0, 1)", // Rosso
    so2: "rgba(0, 0, 255, 1)", // Blu
    no2: "rgba(0, 128, 0, 1)", // Verde
    pm25: "rgba(128, 0, 128, 1)", // Viola
    pm10: "rgba(255, 255, 0, 1)", // Giallo
    o3: "rgba(0, 255, 255, 1)", // Celeste
  };

  const chartData = {
    datasets: [
      {
        label: pollutant.toUpperCase(),
        data: data.map((item) => ({
          x: item.temperatura,
          y: item[pollutant],
        })),
        backgroundColor: colors[pollutant], // Colore specifico per l'inquinante
        borderColor: colors[pollutant], // Colore specifico per l'inquinante
        pointRadius: 5,
        pointBackgroundColor: colors[pollutant], // Colore specifico per l'inquinante
        pointBorderColor: "transparent",
        pointHoverRadius: 8,
        pointHoverBackgroundColor: colors[pollutant], // Colore specifico per l'inquinante
        pointHoverBorderColor: "#FFF",
      },
      {
        label: `${pollutant.toUpperCase()} Regression`,
        data: regressionLine,
        type: "line",
        fill: false,
        borderColor: colors[pollutant],
        borderWidth: 2,
        lineTension: 0,
      },
    ],
  };

  const chartOptions = {
    scales: {
      x: {
        type: "linear",
        position: "bottom",
        ticks: {
          color: "white",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.3)", // Griglia sull'asse X: bianco con opacità 0.3
        },
      },
      y: {
        ticks: {
          color: "white",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.3)", // Griglia sull'asse X: bianco con opacità 0.3
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          pointStyleWidth: 20,
          usePointStyle: true,
          generateLabels: (chart) => {
            let pointStyle = [];
            chart.data.datasets.forEach((dataset) => {
              if (dataset.type) {
                pointStyle.push("line");
              } else {
                pointStyle.push("circle");
              }
            });
            return chart.data.datasets.map((dataset, index) => ({
              text: dataset.label,
              color: "white",
              fillStyle: dataset.backgroundColor,
              strokeStyle: dataset.borderColor,
              pointStyle: pointStyle[index],
              lineWidth: 5,
              fontColor: "white",
            }));
          },
        },
      },
    },
    /* elements: {
      point: {
        backgroundColor: "rgba(75,192,192,1)",
        borderColor: "#fff",
        borderWidth: 2,
        hitRadius: 10,
        hoverRadius: 8,
        hoverBorderWidth: 4,
      },
    }, */
  };

  return <Scatter className="mt-10" data={chartData} options={chartOptions} />;
};
export default LinearRegression;
