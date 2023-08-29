import React, { useEffect, useRef } from "react";
/* import { Line } from "react-chartjs-2"; */
import Chart from "chart.js/auto";
import zoomPlugin from "chartjs-plugin-zoom";
Chart.register(zoomPlugin);

const PollsTempCorrChart = ({ datas, id, nightMode, colorBlind }) => {
  const chartRef = useRef(null);
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

  function transformData(inputObj) {
    const outputArr = [];

    for (const key in inputObj) {
      const dayData = inputObj[key];
      const transformedData = {
        day: `Day ${key}`,
        temp: parseFloat(dayData.TEMP),
        co: parseFloat(dayData.CO),
        no2: parseFloat(dayData.NO2),
        ozone: parseFloat(dayData.OZONE),
        so2: parseFloat(dayData.SO2),
        pm25: parseFloat(dayData["PM2.5"]),
        pm10: parseFloat(dayData.PM10),
      };

      outputArr.push(transformedData);
    }

    return outputArr;
  }

  if (id) {
    datas.forEach((day, index) => {
      const dayToGet = day.features.filter((item) => item.id === id)[0];
      data.push({
        day: "Day " + (index + 1),
        temp: dayToGet.weather.data.tempReal
          ? dayToGet.weather.data.tempReal
          : 0,
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
  } else {
    data = transformData(datas);
  }

  // Estrai le labels (giorni) dall'array di dati
  const labels = data.map((item, index) => (index + 1).toString());

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
        title: {
          display: true,
          text: "Days", // Testo per la descrizione dell'asse x
          color: nightMode ? "white" : "#333",
        },
        grid: {
          color: nightMode
            ? "rgba(255, 255, 255, 0.1)"
            : "rgba(51, 51, 51, 0.1)", // Colore delle linee di griglia sull'asse Y
        },
        ticks: {
          color: nightMode ? "white" : "#333",
          font: {
            family: "PoppinsLight", // Imposta il font desiderato
            size: 15, // Imposta la dimensione del font desiderata
          },
        },
      },
      y: {
        grid: {
          color: nightMode
            ? "rgba(255, 255, 255, 0.1)"
            : "rgba(51, 51, 51, 0.1)", // Colore delle linee di griglia sull'asse Y
        },
        ticks: {
          color: nightMode ? "white" : "#333",
          font: {
            family: "PoppinsLight", // Imposta il font desiderato
            size: 12, // Imposta la dimensione del font desiderata
          },
        },
      },
    },
    plugins: {
      zoom: {
        pan: {
          enabled: true,
          mode: "x",
        },
        limits: {
          x: {
            minRange: 10,
          },
        },
        zoom: {
          wheel: {
            enabled: true, // Enable wheel zooming
          },
          speed: 50,
          mode: "x",
        },
      },
      legend: {
        labels: {
          font: {
            family: "Poppins", // Imposta il font desiderato
            size: 17, // Imposta la dimensione del font desiderata
          },
          color: nightMode ? "white" : "#333",
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
        pointRadius: 3,
      },
      {
        label: "PM10",
        data: pm10Data,
        fill: false,
        backgroundColor: colors["PM10"], // Colore della linea del PM10
        borderColor: colors["PM10"],
        barPercentage: 0.8,
        categoryPercentage: 0.5,
        borderWidth: 3,
        pointRadius: 3,
      },
      {
        label: "PM2.5",
        data: pm25Data,
        fill: false,
        backgroundColor: colors["PM2.5"], // Colore della linea del PM2.5
        borderColor: colors["PM2.5"],
        barPercentage: 0.8,
        categoryPercentage: 0.5,
        borderWidth: 3,
        pointRadius: 3,
      },
      {
        label: "O3",
        data: ozoneData,
        fill: false,
        backgroundColor: colors["OZONE"], // Colore della linea del CO2
        borderColor: colors["OZONE"],
        barPercentage: 0.8,
        categoryPercentage: 0.5,
        borderWidth: 3,
        pointRadius: 3,
      },
      {
        label: "NO2",
        data: no2Data,
        fill: false,
        backgroundColor: colors["NO2"], // Colore della linea del NO2
        borderColor: colors["NO2"],
        barPercentage: 0.8,
        categoryPercentage: 0.5,
        borderWidth: 3,
        pointRadius: 3,
      },
      {
        label: "CO",
        data: coData,
        fill: false,
        backgroundColor: colors["CO"], // Colore della linea del CO2
        borderColor: colors["CO"],
        barPercentage: 0.8,
        categoryPercentage: 0.5,
        borderWidth: 3,
        pointRadius: 3,
      },
      {
        label: "SO2",
        data: so2Data,
        fill: false,
        backgroundColor: colors["SO2"], // Colore della linea del SO2
        borderColor: colors["SO2"],
        barPercentage: 0.8,
        categoryPercentage: 0.5,
        borderWidth: 3,
        pointRadius: 3,
      },
    ],
  };

  const config = {
    type: "line",
    data: chartData,
    options: options,
  };

  useEffect(() => {
    const myChart = new Chart(chartRef.current, config);
    myChart.zoom(2);
    myChart.pan(
      {
        x: Number.MIN_SAFE_INTEGER,
      },
      undefined,
      "default"
    );

    // Clean up the chart instance on unmount
    return () => {
      myChart.destroy();
    };
  }, []);

  return <canvas ref={chartRef}></canvas>;
};

export default PollsTempCorrChart;
