import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";

const Sidebar = ({ infos, onButtonClick }) => {
  let name = "";
  let AQI = "";
  let lastUpdate = "";
  let values = [];
  let dataR = null;
  let countryPolluttans = {
    CO: {
      totalValue: 0,
      times: 0,
      fixedValue: 0,
    },
    NO2: {
      totalValue: 0,
      times: 0,
      fixedValue: 0,
    },
    OZONE: {
      totalValue: 0,
      times: 0,
      fixedValue: 0,
    },
    "PM2.5": {
      totalValue: 0,
      times: 0,
      fixedValue: 0,
    },
    PM10: {
      totalValue: 0,
      times: 0,
      fixedValue: 0,
    },
    SO2: {
      totalValue: 0,
      times: 0,
      fixedValue: 0,
    },
  };
  if (Object.keys(infos.stato)[0] == "USA") {
    name = "USA";
    dataR = infos.stato["USA"];
    AQI = dataR.features[0].properties.countryAQI;
    lastUpdate = dataR.features[0].lastUpdatedMe;
    dataR.features.forEach((feature) => {
      Object.keys(feature.properties.measurements).forEach((poll) => {
        if (feature.properties.measurements[poll].fixedValue != null) {
          countryPolluttans[poll].totalValue +=
            feature.properties.measurements[poll].fixedValue;
          countryPolluttans[poll].times += 1;
        }
      });
    });
    Object.keys(countryPolluttans).forEach((key) => {
      countryPolluttans[key].fixedValue =
        countryPolluttans[key].totalValue / countryPolluttans[key].times;
      values.push(countryPolluttans[key].fixedValue);
    });
  } else {
    name = infos.stato.properties.name;
    AQI = infos.stato.properties.AQI;
    lastUpdate = infos.stato.lastUpdatedMe;
    Object.keys(infos.stato.properties.measurements).forEach((key) => {
      values.push(infos.stato.properties.measurements[key].fixedValue);
    });
  }
  const colorToColor = infos.colore;
  const r = Math.round(colorToColor.r * 255);
  const g = Math.round(colorToColor.g * 255);
  const b = Math.round(colorToColor.b * 255);
  const hexColor = `#${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;

  const chartRef = useRef(null);
  // Dati per il grafico
  const data = {
    labels: Object.keys(countryPolluttans),
    datasets: [
      {
        label: "Polluttans levels",
        data: values, // Sostituisci con i tuoi valori reali
        backgroundColor: ["red", "blue", "green", "yellow", "orange"], // Colore delle barre
      },
    ],
  };

  const options = {
    barPercentage: 0.6,
    indexAxis: "x", // Imposta l'asse x come asse principale
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "white", // Colore delle linee di griglia sull'asse Y
        },
        ticks: {
          min: 0, // Valore minimo dell'asse y
          stepSize: 10, // Imposta l'incremento dei valori sull'asse y
          callback: (value) => `${value}`, // Formatta i valori sull'asse y
          font: {
            size: 14, // Dimensione del carattere per le etichette dell'asse Y
          },
          color: "white", // Colore delle etichette dell'asse Y
        },
      },
      x: {
        ticks: {
          autoSkip: false,
          maxRotation: 0,
          minRotation: 0,
          font: {
            size: 12, // Dimensione del carattere per le etichette dell'asse Y
          },
          color: "white", // Colore delle etichette dell'asse Y
        },
      },
    },
    plugins: {
      legend: {
        display: false, // Nascondi la legenda
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

  //historical data manipolation

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
    <div className="w-400 h-full p-8 bg-gray-600 z-30 fixed">
      <button className="close-button" onClick={onButtonClick}>
        &#10005;
      </button>
      <div className="flex items-center">
        <span className="text-4xl text-white">{name}</span>
      </div>
      <div className="flex flex-col w-fit h-fit items-center  justify-between ">
        <div className="flex w-full h-fit items-center mt-4 overflow-hidden">
          <h2 className="text-white text-xl items-center mr-5">
            Air Quality Index (AQI):
          </h2>
          <div
            className=" rounded-2xl p-3"
            style={{ backgroundColor: hexColor }}
          >
            <h2 className="text-white text-xl">{AQI}</h2>
          </div>
        </div>
        <div className="flex w-full h-fit justify-between items-center mt-3">
          <h2 className="text-white text-xl items-center mr-5">Last Update:</h2>
          <span className="text-l text-white">{lastUpdate}</span>
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
