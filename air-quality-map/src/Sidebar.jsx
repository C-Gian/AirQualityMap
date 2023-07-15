import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";

const Sidebar = ({ stateInfo, onClose }) => {
  console.log(stateInfo);
  const measurements = {
    pm25: {
      value: 3.3,
      lastUpdatedStation: "2021-11-17T15:46:50+00:00",
      unit: "µg/m³",
    },
    pm10: {
      value: 3.6,
      lastUpdatedStation: "2021-11-17T15:46:50+00:00",
      unit: "µg/m³",
    },
    o3: {
      value: 5.5,
      lastUpdatedStation: "2021-11-17T15:46:50+00:00",
      unit: "µg/m³",
    },
    no: {
      value: 4.7,
      lastUpdatedStation: "2021-11-17T15:46:50+00:00",
      unit: "µg/m³",
    },
    co: {
      value: 3.9,
      lastUpdatedStation: "2021-11-17T15:46:50+00:00",
      unit: "µg/m³",
    },
    so2: {
      value: 8.9,
      lastUpdatedStation: "2021-11-17T15:46:50+00:00",
      unit: "µg/m³",
    },
    no2: {
      value: 11,
      lastUpdatedStation: "2021-11-17T15:46:50+00:00",
      unit: "µg/m³",
    },
    nox: {
      value: 1.2,
      lastUpdatedStation: "2021-11-17T15:46:50+00:00",
      unit: "µg/m³",
    },
  };
  let values = [];
  Object.keys(measurements).forEach((key) => {
    values.push(measurements[key].value);
  });
  const chartRef = useRef(null);
  // Dati per il grafico
  const data = {
    labels: Object.keys(measurements),
    datasets: [
      {
        label: "Valori inquinanti",
        data: values, // Sostituisci con i tuoi valori reali
        backgroundColor: "rgba(75, 192, 192, 0.6)", // Colore delle barre
        borderColor: "rgba(75, 192, 192, 1)", // Colore dei bordi delle barre
        borderWidth: 1, // Spessore dei bordi delle barre
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "white", // Colore delle linee di griglia sull'asse Y
        },
        ticks: {
          font: {
            size: 14, // Dimensione del carattere per le etichette dell'asse Y
          },
          color: "white", // Colore delle etichette dell'asse Y
        },
      },
      x: {
        ticks: {
          font: {
            size: 14, // Dimensione del carattere per le etichette dell'asse Y
          },
          color: "white", // Colore delle etichette dell'asse Y
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          font: {
            size: 16, // Dimensione del carattere per le etichette della legenda
            weight: "bold", // Spessore del carattere per le etichette della legenda
          },
          color: "white", // Colore delle etichette della legenda
        },
      },
    },
  };

  useEffect(() => {
    const canvas = chartRef.current;

    // Verifica se esiste già un grafico sul canvas
    if (canvas && canvas.chart) {
      canvas.chart.destroy(); // Distruggi l'istanza del grafico esistente
    }
    const ctx = canvas.getContext("2d");

    // Crea l'istanza del grafico
    const chart = new Chart(ctx, {
      type: "bar",
      data: data,
      options: options,
    });
    canvas.chart = chart;
  }, [data, options]);

  return (
    <div className="w-fit h-full p-8 bg-gray-600 z-30 fixed">
      <button className="close-button" onClick={onClose}>
        &#10005;
      </button>
      <div className="flex items-center">
        <span className="text-4xl text-white">{stateInfo.properties.name}</span>
      </div>
      <div className="flex flex-col w-fit h-fit items-center  justify-between ">
        <div className="flex w-full h-fit items-center mt-4 overflow-hidden">
          <h2 className="text-white text-xl items-center mr-5">
            Air Quality Index (AQI):
          </h2>
          <div className=" rounded-2xl p-3 bg-red-400">
            <h2 className="text-white text-xl">300</h2>
          </div>
        </div>
        <div className="flex w-full h-fit justify-between items-center mt-3">
          <h2 className="text-white text-xl items-center mr-5">Last Update:</h2>
          <span className="text-l text-white">11/09/2023</span>
        </div>
      </div>
      <div>
        <canvas className="mt-5" ref={chartRef} />
      </div>
      {/* Aggiungi altre informazioni dello stato qui */}
    </div>
  );
};

export default Sidebar;
