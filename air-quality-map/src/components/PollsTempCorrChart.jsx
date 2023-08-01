import React from "react";
import { Line } from "react-chartjs-2";

const PollsTempCorrChart = ({ datas, id }) => {
  let data = [];

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
          color: "white", // Colore delle etichette della legenda
          boxWidth: 12,
        },
      },
    },
  };

  // Dati del grafico
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Temperatura",
        data: temperaturaData,
        fill: false,
        borderColor: "white", // Colore della linea della temperatura
        borderWidth: 3,
      },
      {
        label: "PM10",
        data: pm10Data,
        fill: false,
        borderColor: "red", // Colore della linea del PM10
        borderWidth: 1,
      },
      {
        label: "PM2.5",
        data: pm25Data,
        fill: false,
        borderColor: "blue", // Colore della linea del PM2.5
        borderWidth: 1,
      },
      {
        label: "O3",
        data: ozoneData,
        fill: false,
        borderColor: "green", // Colore della linea del CO2
        borderWidth: 1,
      },
      {
        label: "NO2",
        data: no2Data,
        fill: false,
        borderColor: "yellow", // Colore della linea del NO2
        borderWidth: 1,
      },
      {
        label: "CO",
        data: coData,
        fill: false,
        borderColor: "orange", // Colore della linea del CO2
        borderWidth: 1,
      },
      {
        label: "SO2",
        data: so2Data,
        fill: false,
        borderColor: "purple", // Colore della linea del SO2
        borderWidth: 1,
      },
    ],
  };

  return <Line data={chartData} options={options} />;
};

export default PollsTempCorrChart;
