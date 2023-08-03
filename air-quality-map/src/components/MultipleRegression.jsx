import React, { useState, useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";
import * as math from "mathjs";

function MultipleRegression() {
  const chartRef = useRef(null);
  const dataX = [
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
  const [activePollutants, setActivePollutants] = useState([
    "co",
    "no2",
    "so2",
    "o3",
    "pm10",
    "pm25",
  ]);

  const handlePollutantClick = (pollutant, hidden) => {
    console.log("1", pollutant);
    if (hidden) {
      console.log("2a");
      if (activePollutants.includes(pollutant)) {
        console.log("3a");
        setActivePollutants(
          activePollutants.filter((item) => item !== pollutant)
        );
      }
    } else {
      console.log("2b", activePollutants);
      if (!activePollutants.includes(pollutant)) {
        console.log("3b");
        setActivePollutants(activePollutants.push(pollutant));
      }
    }
  };

  function multipleRegression(data) {
    const X = [];
    const Y = [];
    const pollutants = ["temp", "co", "no2", "so2", "o3", "pm10", "pm25"];

    // Costruisci le matrici X e Y dai dati
    for (const row of data) {
      const xRow = [1, row.co, row.no2, row.so2, row.o3, row.pm10, row.pm25];
      X.push(xRow);
      Y.push(row.temperatura);
    }

    // Calcola i coefficienti di regressione usando la formula OLS
    const Xtranspose = math.transpose(X);
    const XtX = math.multiply(Xtranspose, X);
    const XtXinverse = math.inv(XtX);
    const XtY = math.multiply(Xtranspose, Y);
    const coefficients = math.multiply(XtXinverse, XtY);

    // Crea un array di oggetti contenenti il coefficiente e l'inquinante corrispondente
    const results = coefficients.map((coefficient, index) => ({
      coefficient: coefficient,
      pollutant: pollutants[index],
    }));

    return results;
  }

  useEffect(() => {
    console.log("ap", activePollutants);
  }, [activePollutants]);

  // Creazione del grafico all'interno di useEffect per assicurarci che il componente sia montato
  useEffect(() => {
    const coefficients = multipleRegression(dataX).slice(1);
    const datasets = [];

    const pollutants = ["co", "no2", "so2", "o3", "pm10", "pm25"];
    for (const pollutant of pollutants) {
      const data = coefficients.map((coefficient) =>
        coefficient.pollutant === pollutant ? coefficient.coefficient : 0
      );
      datasets.push({
        label: pollutant,
        data: data,
        backgroundColor: "rgba(255, 0, 0, 1)",
        barPercentage: 0.8,
        categoryPercentage: 0.5,
      });
    }

    const chartData = {
      labels: pollutants,
      datasets: datasets,
    };

    const options = {
      scales: {
        x: {
          stacked: true, // Imposta l'asse x come asse delle categorie
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
      indexAxis: "x", // Mostra l'asse x come asse dell'indice
      plugins: {
        legend: {
          onClick(evt, item) {
            Chart.defaults.plugins.legend.onClick.call(this, evt, item, this);
            const value = evt.chart.data.datasets[
              item.datasetIndex
            ].data.filter((number) => number !== 0)[0];
            console.log("hidden", item.hidden);
            handlePollutantClick(item.text, item.hidden);
          },
          labels: {
            color: "white", // Colore delle etichette della legenda
            boxWidth: 12,
          },
        },
      },
    };

    const myChart = new Chart(chartRef.current, {
      type: "bar",
      data: chartData,
      options: options,
    });

    // Clean up the chart instance on unmount
    return () => {
      myChart.destroy();
    };
  }, []);

  return <canvas ref={chartRef} />;
}

export default MultipleRegression;
