import React from "react";
import { Line } from "react-chartjs-2";

const WeatherChart = () => {
  // Dati dei 7 giorni
  const data = [
    {
      giorno: "Giorno 1",
      temperatura: 20,
      co2: 100,
      no2: 50,
      so2: 10,
      pm25: 25,
      pm10: 40,
    },
    {
      giorno: "Giorno 2",
      temperatura: 25,
      co2: 150,
      no2: 70,
      so2: 15,
      pm25: 30,
      pm10: 50,
    },
    {
      giorno: "Giorno 3",
      temperatura: 22,
      co2: 120,
      no2: 60,
      so2: 12,
      pm25: 28,
      pm10: 45,
    },
    {
      giorno: "Giorno 4",
      temperatura: 18,
      co2: 90,
      no2: 40,
      so2: 8,
      pm25: 20,
      pm10: 35,
    },
    {
      giorno: "Giorno 5",
      temperatura: 28,
      co2: 180,
      no2: 80,
      so2: 20,
      pm25: 35,
      pm10: 60,
    },
    {
      giorno: "Giorno 6",
      temperatura: 30,
      co2: 200,
      no2: 90,
      so2: 25,
      pm25: 40,
      pm10: 70,
    },
    {
      giorno: "Giorno 7",
      temperatura: 23,
      co2: 130,
      no2: 55,
      so2: 11,
      pm25: 26,
      pm10: 42,
    },
  ];

  // Estrai le labels (giorni) dall'array di dati
  const labels = data.map((item) => item.giorno);

  // Estrai i dati di temperatura e inquinanti dall'array di dati
  const temperaturaData = data.map((item) => item.temperatura);
  const co2Data = data.map((item) => item.co2);
  const no2Data = data.map((item) => item.no2);
  const so2Data = data.map((item) => item.so2);
  const pm25Data = data.map((item) => item.pm25);
  const pm10Data = data.map((item) => item.pm10);

  // Opzioni per personalizzare il grafico
  const options = {
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "white", // Colore delle etichette dell'asse y
        },
      },
      y: {
        grid: {
          color: "white", // Colore delle linee di griglia dell'asse y
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
        borderWidth: 5,
      },
      {
        label: "CO2",
        data: co2Data,
        fill: false,
        borderColor: "red", // Colore della linea del CO2
        borderWidth: 1,
      },
      {
        label: "NO2",
        data: no2Data,
        fill: false,
        borderColor: "green", // Colore della linea del NO2
        borderWidth: 1,
      },
      {
        label: "SO2",
        data: so2Data,
        fill: false,
        borderColor: "blue", // Colore della linea del SO2
        borderWidth: 1,
      },
      {
        label: "PM2.5",
        data: pm25Data,
        fill: false,
        borderColor: "purple", // Colore della linea del PM2.5
        borderWidth: 1,
      },
      {
        label: "PM10",
        data: pm10Data,
        fill: false,
        borderColor: "orange", // Colore della linea del PM10
        borderWidth: 1,
      },
    ],
  };

  return <Line data={chartData} options={options} />;
};

export default WeatherChart;
