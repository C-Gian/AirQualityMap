import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";

function PollsLevelsChart({
  dataR,
  allDays,
  isState,
  sliderValue,
  colorBlind,
}) {
  const labels = Object.keys(dataR.properties.measurements);
  let values = [];
  if (isState) {
    values = Object.values(dataR.properties.measurements).map(
      (item) => item.fixedValue
    );
  } else {
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
    allDays[sliderValue].features.forEach((feature) => {
      Object.keys(feature.properties.measurements).forEach((poll) => {
        if (feature.properties.measurements[poll].fixedValue != null) {
          countryPolluttans[poll].totalValue +=
            feature.properties.measurements[poll].fixedValue;
          countryPolluttans[poll].times += 1;
        }
      });
    });
    let temp = [];
    Object.keys(countryPolluttans).forEach((key) => {
      countryPolluttans[key].fixedValue =
        countryPolluttans[key].totalValue / countryPolluttans[key].times;
      temp.push(countryPolluttans[key].fixedValue);
    });
    values = [...temp];
  }
  const chartRef = useRef(null);
  const colors = colorBlind
    ? [
        "rgba(255, 50, 50, 1)",
        "rgba(0, 0, 255, 1)",
        "rgba(0, 255, 0, 1)",
        "rgba(255, 205, 0, 1)",
        "rgba(255, 149, 0, 1)",
        "rgba(148, 0, 211, 1)",
      ]
    : ["red", "blue", "green", "yellow", "orange", "purple"];

  // Dati per il grafico
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Polluttans levels",
        data: values,
        backgroundColor: colors, // Colore delle barre
      },
    ],
  };

  const options = {
    scales: {
      x: {
        border: {
          display: false,
        },
        grid: {
          display: false,
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
      y: {
        border: {
          display: false,
        },
        grid: {
          drawBorder: false,
          display: false,
          color: "rgba(255, 255, 255, 0.1)",
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

    // when component unmounts
    return () => {
      chart.destroy();
    };
  }, [data, options]);

  return (
    <div>
      <canvas ref={chartRef} />
    </div>
  );
}

export default PollsLevelsChart;
