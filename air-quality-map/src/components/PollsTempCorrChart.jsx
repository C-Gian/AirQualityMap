import React from "react";
import { Line } from "react-chartjs-2";

const PollsTempCorrChart = ({ datas, id, colorBlind }) => {
  let data = [];
  const colors = colorBlind
    ? {
        TEMP: "rgba(255, 255, 255, 1)",
        CO: "rgba(255, 149, 0, 1)",
        SO2: "rgba(148, 0, 211, 1)",
        NO2: "rgba(255, 205, 0, 1)",
        "PM2.5": "rgba(0, 0, 255, 1)",
        PM10: "rgba(255, 50, 50, 1)",
        OZONE: "rgba(0, 255, 0, 1)",
      }
    : {
        TEMP: "rgba(255, 255, 255, 1)",
        CO: "rgba(255, 165, 0, 1)",
        SO2: "rgba(128, 0, 128, 1)",
        NO2: "rgba(255, 255, 0, 1) ",
        "PM2.5": "rgba(0, 0, 255, 1)",
        PM10: "rgba(255, 0, 0, 1) ",
        OZONE: "rgba(0, 128, 0, 1) ",
      };

  datas.forEach((day, index) => {
    const dayToGet = day.features.filter((item) => item.id === id)[0];
    data.push({
      day: "Day " + (index + 1),
      temp: dayToGet.weather.data.tempReal ? dayToGet.weather.data.tempReal : 0,
      co: dayToGet.properties.measurements.CO.fixedValue
        ? dayToGet.properties.measurements.CO.fixedValue
        : 0,
      no2: dayToGet.properties.measurements.NO2.fixedValue
        ? dayToGet.properties.measurements.NO2.fixedValue
        : 0,
      ozone: dayToGet.properties.measurements.OZONE.fixedValue
        ? dayToGet.properties.measurements.OZONE.fixedValue
        : 0,
      so2: dayToGet.properties.measurements.SO2.fixedValue
        ? dayToGet.properties.measurements.SO2.fixedValue
        : 0,
      pm25: dayToGet.properties.measurements["PM2.5"].fixedValue
        ? dayToGet.properties.measurements["PM2.5"].fixedValue
        : 0,
      pm10: dayToGet.properties.measurements.PM10.fixedValue
        ? dayToGet.properties.measurements.PM10.fixedValue
        : 0,
    });
  });

  // Estrai le labels (giorni) dall'array di dati
  const labels = data.map((item) => item.day);

  // Estrai i dati di temperatura e inquinanti dall'array di dati
  const temperaturaData = data.map((item) => item.temp);
  const coData = data.map((item) => item.co2);
  const no2Data = data.map((item) => item.no2);
  const ozoneData = data.map((item) => item.ozone);
  const so2Data = data.map((item) => item.so2);
  const pm25Data = data.map((item) => item.pm25);
  const pm10Data = data.map((item) => item.pm10);

  // Opzioni per personalizzare il grafico
  const options = {
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
        labels: {
          font: {
            size: 16, // Imposta la dimensione del font della legenda
          },
          color: "white", // Colore delle etichette della legenda
          boxWidth: 17,
        },
      },
    },
  };

  // Dati del grafico
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Temp",
        data: temperaturaData,
        fill: false,
        backgroundColor: colors["TEMP"], // Colore della linea della temperatura
        borderColor: colors["TEMP"],
        barPercentage: 0.8,
        categoryPercentage: 0.5,
        borderWidth: 3,
      },
      {
        label: "PM10",
        data: pm10Data,
        fill: false,
        backgroundColor: colors["PM10"], // Colore della linea del PM10
        borderColor: colors["PM10"],
        barPercentage: 0.8,
        categoryPercentage: 0.5,
        borderWidth: 1,
      },
      {
        label: "PM2.5",
        data: pm25Data,
        fill: false,
        backgroundColor: colors["PM2.5"], // Colore della linea del PM2.5
        borderColor: colors["PM2.5"],
        barPercentage: 0.8,
        categoryPercentage: 0.5,
        borderWidth: 1,
      },
      {
        label: "O3",
        data: ozoneData,
        fill: false,
        backgroundColor: colors["OZONE"], // Colore della linea del CO2
        borderColor: colors["OZONE"],
        barPercentage: 0.8,
        categoryPercentage: 0.5,
        borderWidth: 1,
      },
      {
        label: "NO2",
        data: no2Data,
        fill: false,
        backgroundColor: colors["NO2"], // Colore della linea del NO2
        borderColor: colors["NO2"],
        barPercentage: 0.8,
        categoryPercentage: 0.5,
        borderWidth: 1,
      },
      {
        label: "CO",
        data: coData,
        fill: false,
        backgroundColor: colors["CO"], // Colore della linea del CO2
        borderColor: colors["CO"],
        barPercentage: 0.8,
        categoryPercentage: 0.5,
        borderWidth: 1,
      },
      {
        label: "SO2",
        data: so2Data,
        fill: false,
        backgroundColor: colors["SO2"], // Colore della linea del SO2
        borderColor: colors["SO2"],
        barPercentage: 0.8,
        categoryPercentage: 0.5,
        borderWidth: 1,
      },
    ],
  };

  return <Line data={chartData} options={options} />;
};

export default PollsTempCorrChart;
