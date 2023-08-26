import React, { useState, useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";
import * as math from "mathjs";

function MultipleRegression({ datas, id, colorBlind }) {
  const chartRef = useRef(null);
  const [nullPolls, setNullPolls] = useState(null);
  const [activePollutants, setActivePollutants] = useState([
    "PM10",
    "PM2.5",
    "OZONE",
    "NO2",
    "CO",
    "SO2",
  ]);
  let dataX = [];
  if (id) {
    datas.forEach((day) => {
      let obj = { temperatura: day.features[id].weather.data.tempReal };
      Object.keys(day.features[id].properties.measurements).forEach((key) => {
        obj[key] = day.features[id].properties.measurements[key].fixedValue;
      });
      dataX.push(obj);
    });
  } else {
    dataX = transformData(datas);
  }

  const colors = colorBlind
    ? {
        CO: "rgba(255, 149, 0, 1)",
        SO2: "rgba(148, 0, 211, 1)",
        NO2: "rgba(255, 205, 0, 1)",
        "PM2.5": "rgba(0, 0, 255, 1)",
        PM10: "rgba(255, 50, 50, 1)",
        OZONE: "rgba(0, 255, 0, 1)",
      }
    : {
        CO: "rgba(255, 165, 0, 1)",
        SO2: "rgba(128, 0, 128, 1)",
        NO2: "rgba(255, 255, 0, 1) ",
        "PM2.5": "rgba(0, 0, 255, 1)",
        PM10: "rgba(255, 0, 0, 1) ",
        OZONE: "rgba(0, 128, 0, 1) ",
      };
  const indexs = {
    PM10: 0,
    "PM2.5": 1,
    OZONE: 2,
    NO2: 3,
    CO: 4,
    SO2: 5,
  };

  function transformData(inputObj) {
    const outputArr = [];

    for (const key in inputObj) {
      const dayData = inputObj[key];
      const transformedData = {
        temperatura: parseFloat(dayData.TEMP),
        PM10: parseFloat(dayData.PM10),
        "PM2.5": parseFloat(dayData["PM2.5"]),
        OZONE: dayData.OZONE !== undefined ? parseFloat(dayData.OZONE) : null,
        NO2: parseFloat(dayData.NO2),
        CO: parseFloat(dayData.CO),
        SO2: parseFloat(dayData.SO2),
      };

      outputArr.push(transformedData);
    }

    return outputArr;
  }

  const handlePollutantClick = (pollutant, hidden) => {
    if (hidden) {
      if (activePollutants.includes(pollutant)) {
        setActivePollutants(
          activePollutants.filter((item) => item !== pollutant)
        );
      }
    } else {
      if (!activePollutants.includes(pollutant)) {
        activePollutants.splice(indexs[pollutant], 0, pollutant);
        const temp = [...activePollutants];
        setActivePollutants(temp);
      }
    }
  };

  function multipleRegression(data) {
    const filteredData = data.map((obj) => {
      const filteredObj = {
        temperatura: obj["temperatura"], // Aggiungi il campo "temperatura"
      };

      activePollutants.forEach((key) => {
        if (obj.hasOwnProperty(key)) {
          filteredObj[key] = obj[key];
        }
      });

      return filteredObj;
    });
    const filteredDataWithoutNull = filteredData.map((row) => {
      const newRow = { ...row };
      Object.keys(newRow).forEach((key) => {
        if (newRow[key] === null) {
          // Calcola la media dei valori non null per la variabile key
          const nonNullValues = filteredData.filter(
            (item) => item[key] !== null
          );
          const sum = nonNullValues.reduce((acc, item) => acc + item[key], 0);
          const average = sum / nonNullValues.length;

          newRow[key] = average;
        }
      });
      return newRow;
    });
    const X = [];
    const Y = [];
    const pollutants = ["temp", ...activePollutants];
    // Costruisci le matrici X e Y dai dati
    for (const row of filteredDataWithoutNull) {
      let xRow = [1];
      Object.keys(row).forEach((key) => {
        if (key !== "temperatura") {
          xRow.push(row[key]);
        }
      });
      //const xRow = [1, row.co, row.no2, row.so2, row.o3, row.pm10, row.pm25];
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

  // Creazione del grafico all'interno di useEffect per assicurarci che il componente sia montato
  useEffect(() => {
    setNullPolls(multipleRegression(dataX)[0].coefficient.toFixed(2));
    const coefficients = multipleRegression(dataX).slice(1);
    const datasets = [];
    const pollutants = ["PM10", "PM2.5", "OZONE", "NO2", "CO", "SO2"];

    if (coefficients.length != pollutants.length) {
      let coefEls = [];
      coefficients.forEach((el) => {
        coefEls.push(el.pollutant);
      });
      const diffArr = pollutants.filter((item) => !coefEls.includes(item));
      diffArr.forEach((el) => {
        coefficients.splice(indexs[el], 0, 0);
      });
    }
    for (const pollutant of pollutants) {
      const isHidden = activePollutants.includes(pollutant);
      const data = coefficients.map((coefficient) =>
        coefficient.pollutant === pollutant ? coefficient.coefficient : 0
      );
      datasets.push({
        label: pollutant,
        data: data,
        backgroundColor: colors[pollutant],
        barPercentage: 0.8,
        categoryPercentage: 0.5,
        hidden: isHidden ? false : true,
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
            handlePollutantClick(item.text, item.hidden);
          },
          labels: {
            font: {
              size: 16, // Imposta la dimensione del font della legenda
            },
            color: "white", // Colore delle etichette della legenda
            boxWidth: 25,
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
  }, [activePollutants, id, colorBlind]);

  return (
    <div>
      <canvas ref={chartRef} />
      {/* <h2 className="text-xl text-white">
        When All Polluttants = 0 temperature is: {nullPolls}
      </h2> */}
    </div>
  );
}

export default MultipleRegression;
