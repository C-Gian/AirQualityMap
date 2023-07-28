import React, { useEffect, useState } from "react";
import { Scatter, Line } from "react-chartjs-2";
import { Chart } from "chart.js/auto";
import Heatmap from "react-heatmap-grid";

const AnalysisChartSidebar = () => {
  const [matrix, setMatrix] = useState([]);
  // Funzione per calcolare il coefficiente di correlazione di Pearson tra due array di dati
  const calculateCorrelationPearson = (xData, yData) => {
    const n = xData.length;
    const xSum = xData.reduce((acc, val) => acc + val, 0);
    const ySum = yData.reduce((acc, val) => acc + val, 0);
    const xySum = xData.reduce(
      (acc, val, index) => acc + val * yData[index],
      0
    );
    const xSquaredSum = xData.reduce((acc, val) => acc + val * val, 0);
    const ySquaredSum = yData.reduce((acc, val) => acc + val * val, 0);

    const numerator = n * xySum - xSum * ySum;
    const denominatorX = n * xSquaredSum - xSum * xSum;
    const denominatorY = n * ySquaredSum - ySum * ySum;

    const correlation = numerator / Math.sqrt(denominatorX * denominatorY);
    return correlation;
  };

  const calculateCorrelationMatrix = (xData, yData) => {
    const n = xData.length;
    const xSum = xData.reduce((acc, val) => acc + val, 0);
    const ySum = yData.reduce((acc, val) => acc + val, 0);
    const xySum = xData.reduce(
      (acc, val, index) => acc + val * yData[index],
      0
    );
    const xSquaredSum = xData.reduce((acc, val) => acc + val * val, 0);
    const ySquaredSum = yData.reduce((acc, val) => acc + val * val, 0);

    const numerator = n * xySum - xSum * ySum;
    const denominatorX = n * xSquaredSum - xSum * xSum;
    const denominatorY = n * ySquaredSum - ySum * ySum;

    const correlation = numerator / Math.sqrt(denominatorX * denominatorY);
    return correlation;
  };
  const labels = ["T", "CO2", "NO2", "SO2", "SO3", "SO4", "SO5"];
  let correlationMatrix = null;
  useEffect(() => {
    // Dati casuali
    /*  const temperature = [20, 22, 25, 24, 18, 23];
    const co2 = [0, 0, 0, 0, 0, 0];
    const no2 = [2, 9, 13, 11, 1, 4];
    const so2 = [10, 12, 8, 11, 9, 7];
    const pm25 = [25, 30, 28, 32, 27, 29];
    const pm10 = [40, 38, 42, 39, 37, 41];
    const o3 = [5, 6, 4, 7, 3, 5];
    // Punto 1: Calcolo delle correlazioni tra temperatura e inquinanti
    const data = [temperature, co2, no2, so2, pm25, pm10, o3];
    const correlationMatrix = data.map((x, i) => {
      return data.map((y, j) => {
        return i === j ? 1 : sampleCorrelation(x, y);
      });
    });

    console.log("Correlation Matrix:", correlationMatrix); */

    // Punto 2: Esecuzione di una regressione multivariata

    // Dati iniziali
    const data2 = [
      { temperatura: 35, inquinanti: { co2: 100, no2: 40, so2: 15 } },
      { temperatura: 25, inquinanti: { co2: 80, no2: 60, so2: 30 } },
      { temperatura: 30, inquinanti: { co2: 90, no2: 50, so2: 20 } },
      { temperatura: 40, inquinanti: { co2: 120, no2: 30, so2: 25 } },
      { temperatura: 20, inquinanti: { co2: 70, no2: 70, so2: 35 } },
      { temperatura: 20, inquinanti: { co2: 70, no2: 70, so2: 35 } },
      { temperatura: 20, inquinanti: { co2: 70, no2: 70, so2: 35 } },
    ];

    // Estraiamo i dati di temperatura e inquinanti dagli oggetti all'interno dell'array
    const temperatureData = data2.map((item) => item.temperatura);
    const co2Data = data2.map((item) => item.inquinanti.co2);
    const no2Data = data2.map((item) => item.inquinanti.no2);
    const so2Data = data2.map((item) => item.inquinanti.so2);
    const so3Data = data2.map((item) => item.inquinanti.so3);
    const so4Data = data2.map((item) => item.inquinanti.so4);
    const so5Data = data2.map((item) => item.inquinanti.so5);

    // Calcoliamo la correlation matrix tra tutte le variabili
    setMatrix([
      [
        1,
        calculateCorrelationMatrix(temperatureData, co2Data),
        calculateCorrelationMatrix(temperatureData, no2Data),
        calculateCorrelationMatrix(temperatureData, so2Data),
        calculateCorrelationMatrix(temperatureData, so3Data),
        calculateCorrelationMatrix(temperatureData, so4Data),
        calculateCorrelationMatrix(temperatureData, so5Data),
      ],
      [
        calculateCorrelationMatrix(temperatureData, co2Data),
        1,
        calculateCorrelationMatrix(co2Data, no2Data),
        calculateCorrelationMatrix(co2Data, so2Data),
        calculateCorrelationMatrix(co2Data, so3Data),
        calculateCorrelationMatrix(co2Data, so4Data),
        calculateCorrelationMatrix(co2Data, so5Data),
      ],
      [
        calculateCorrelationMatrix(temperatureData, no2Data),
        calculateCorrelationMatrix(co2Data, no2Data),
        1,
        calculateCorrelationMatrix(no2Data, so2Data),
        calculateCorrelationMatrix(co2Data, so3Data),
        calculateCorrelationMatrix(co2Data, so4Data),
        calculateCorrelationMatrix(co2Data, so5Data),
      ],
      [
        calculateCorrelationMatrix(temperatureData, so2Data),
        calculateCorrelationMatrix(co2Data, so2Data),
        calculateCorrelationMatrix(no2Data, so2Data),
        1,
        calculateCorrelationMatrix(co2Data, so3Data),
        calculateCorrelationMatrix(co2Data, so4Data),
        calculateCorrelationMatrix(co2Data, so5Data),
      ],
      [
        calculateCorrelationMatrix(temperatureData, so2Data),
        calculateCorrelationMatrix(co2Data, so2Data),
        calculateCorrelationMatrix(no2Data, so2Data),
        calculateCorrelationMatrix(co2Data, so3Data),
        1,
        calculateCorrelationMatrix(co2Data, so4Data),
        calculateCorrelationMatrix(co2Data, so5Data),
      ],
      [
        calculateCorrelationMatrix(temperatureData, so2Data),
        calculateCorrelationMatrix(co2Data, so2Data),
        calculateCorrelationMatrix(no2Data, so2Data),
        calculateCorrelationMatrix(co2Data, so3Data),
        calculateCorrelationMatrix(co2Data, so4Data),
        1,
        calculateCorrelationMatrix(co2Data, so5Data),
      ],
      [
        calculateCorrelationMatrix(temperatureData, so2Data),
        calculateCorrelationMatrix(co2Data, so2Data),
        calculateCorrelationMatrix(no2Data, so2Data),
        calculateCorrelationMatrix(co2Data, so3Data),
        calculateCorrelationMatrix(co2Data, so4Data),
        calculateCorrelationMatrix(co2Data, so5Data),
        1,
      ],
    ]);
    console.log("Correlation Matrix:");
    console.table(correlationMatrix);

    // Calcoliamo il coefficiente di correlazione di Pearson per la temperatura e ciascun inquinante
    const temperatureCo2Correlation = calculateCorrelationPearson(
      temperatureData,
      co2Data
    );
    const temperatureNo2Correlation = calculateCorrelationPearson(
      temperatureData,
      no2Data
    );
    const temperatureSo2Correlation = calculateCorrelationPearson(
      temperatureData,
      so2Data
    );
    const temperatureSo3Correlation = calculateCorrelationPearson(
      temperatureData,
      so3Data
    );
    const temperatureSo4Correlation = calculateCorrelationPearson(
      temperatureData,
      so4Data
    );
    const temperatureSo5Correlation = calculateCorrelationPearson(
      temperatureData,
      so5Data
    );
    console.log(
      "Correlazione tra temperatura e CO2:",
      temperatureCo2Correlation
    );
    console.log(
      "Correlazione tra temperatura e NO2:",
      temperatureNo2Correlation
    );
    console.log(
      "Correlazione tra temperatura e SO2:",
      temperatureSo2Correlation
    );
    console.log(
      "Correlazione tra temperatura e SO3:",
      temperatureSo3Correlation
    );
    console.log(
      "Correlazione tra temperatura e SO4:",
      temperatureSo4Correlation
    );
    console.log(
      "Correlazione tra temperatura e SO5:",
      temperatureSo5Correlation
    );

    /* // Grafico a dispersione dei dati
  const scatterData = {
    datasets: [
      {
        label: "Temperature",
        data: temperature.map((y, index) => ({ x: y, y })),
        backgroundColor: "rgba(255, 0, 0, 0.5)", // Colore dei punti per la temperatura
      },
      {
        label: "CO2",
        data: co2.map((y, index) => ({ x: y, y })),
        backgroundColor: "rgba(0, 255, 0, 0.5)", // Colore dei punti per il CO2
      },
      // Ripeti per gli altri inquinanti
    ],
  };

  const scatterOptions = {
    plugins: {
      legend: {
        labels: {
          color: "white", // Colore delle etichette della legenda
        },
      },
    },
    scales: {
      x: {
        type: "linear",
        position: "bottom",
        title: {
          display: true,
          text: "Temperatura",
          color: "white", // Colore del titolo asse x
        },
        ticks: {
          color: "white", // Colore delle etichette asse x
        },
      },
      y: {
        title: {
          display: true,
          text: "Valore Inquinante",
          color: "white", // Colore del titolo asse y
        },
        ticks: {
          color: "white", // Colore delle etichette asse y
        },
      },
    },
  }; */
  }, []);

  return (
    <div
      className="w-full"
      style={{
        width: "100%",
        fontFamily: "sans-serif",
      }}
    >
      {/* Controlla la console per vedere la Correlation Matrix
        Controlla la console per vedere i coefficienti della regressione
        multivariata
        Controlla la console per vedere l'inquinante o coppia di inquinanti più
        influente sulla temperatura */}
      {console.log("HHHH", matrix)}
      {matrix.length > 0 && (
        <div
          style={{
            width: "100%",
            fontFamily: "sans-serif",
          }}
        >
          <Heatmap
            xLabels={labels}
            yLabels={labels}
            data={matrix}
            squares
            xLabelsStyle={(index) => ({
              color: index % 2 ? "transparent" : "#777",
              fontSize: ".65rem",
            })}
            yLabelsStyle={() => ({
              fontSize: ".65rem",
              textTransform: "uppercase",
              color: "#777",
            })}
            cellStyle={(background, value, min, max, data, x, y) => ({
              background:
                value === 1 ? "white" : `rgba(0, 255, 0, ${1 - value})`,
              fontSize: "16px", // Imposta la dimensione del testo nelle celle
              fontWeight: "bold",
              color: value === 1 ? "black" : "white", // Cambia il colore del testo della cella se il valore è 1
              textAlign: "center", // Centra il testo nella cella
              lineHeight: "30px", // Imposta l'altezza della cella per centrare verticalmente il testo
            })}
            height={30}
            width={6000} // Imposta la larghezza della matrice
          />
        </div>
      )}
    </div>
  );
};

export default AnalysisChartSidebar;
