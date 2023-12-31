import React from "react";
import { Scatter } from "react-chartjs-2";
import regression from "regression";

const LinearRegression = ({
  datas,
  pollutant,
  index,
  nightMode,
  colorBlind,
}) => {
  let temperatures = [];
  let pollutantValues = [];
  let objData = [];
  Object.keys(datas).forEach((day, index) => {
    const sDay = datas[day];
    const tempValue = Number(sDay["TEMP"]);
    const pollValue = Number(sDay[pollutant]);
    temperatures.push(tempValue);
    pollutantValues.push(pollValue);
    objData.push({ x: tempValue, y: pollValue });
  });

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

  const colors = colorBlind
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

  const chartData = {
    datasets: [
      {
        label: pollutant.toUpperCase(),
        data: objData,
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
          color: nightMode ? "white" : "#333",
          font: {
            family: "PoppinsLight", // Imposta il font desiderato
            size: 15, // Imposta la dimensione del font desiderata
          },
        },
        grid: {
          color: nightMode
            ? "rgba(255, 255, 255, 0.1)"
            : "rgba(51, 51, 51, 0.1)", // Colore delle linee di griglia sull'asse Y
        },
      },
      y: {
        ticks: {
          color: nightMode ? "white" : "#333",
          font: {
            family: "PoppinsLight", // Imposta il font desiderato
            size: 12, // Imposta la dimensione del font desiderata
          },
        },
        grid: {
          color: nightMode
            ? "rgba(255, 255, 255, 0.1)"
            : "rgba(51, 51, 51, 0.1)", // Colore delle linee di griglia sull'asse Y
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          font: {
            family: "Poppins", // Imposta il font desiderato
            size: 17, // Imposta la dimensione del font desiderata
          },
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
              fontColor: nightMode ? "white" : "#333",
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

  return <Scatter className="mt-5" data={chartData} options={chartOptions} />;
};
export default LinearRegression;
