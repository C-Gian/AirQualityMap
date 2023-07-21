import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";

function SideBarChart({ values, countryPolluttans }) {
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
    <div>
      <canvas className="mt-5" ref={chartRef} />
    </div>
  );
}

export default SideBarChart;
