import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import ss from "simple-statistics";

function MultipleRegression() {
  /* const data = [
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
      ]; */
  // Stati per tenere traccia delle variabili indipendenti selezionate
  const [independentVariables, setIndependentVariables] = useState({
    co: true,
    no2: true,
    so2: true,
    o3: true,
    pm10: true,
    pm25: true,
  });

  // Dati del grafico (sostituisci con i tuoi dati reali)
  const data = {
    labels: [
      "Data 1",
      "Data 2",
      "Data 3",
      "Data 4",
      "Data 5",
      "Data 6",
      "Data 7",
    ],
    datasets: [
      {
        label: "Temperatura",
        data: [20, 22, 18, 25, 23, 27, 21], // Dati della variabile dipendente (temperatura)
        borderColor: "white",
        backgroundColor: "white",
        pointBackgroundColor: "white",
        // ... altri stili e opzioni del dataset ...
      },
      {
        label: "CO",
        data: [100, 90, 95, 85, 92, 80, 97], // Dati della variabile indipendente (CO)
        hidden: !independentVariables.co, // Nascondi il dataset se la variabile è disattivata
        borderColor: "white",
        backgroundColor: "white",
        pointBackgroundColor: "white",
        // ... altri stili e opzioni del dataset ...
      },
      {
        label: "NO2",
        data: [50, 45, 55, 60, 52, 48, 53], // Dati della variabile indipendente (NO2)
        hidden: !independentVariables.no2, // Nascondi il dataset se la variabile è disattivata
        borderColor: "white",
        backgroundColor: "white",
        pointBackgroundColor: "white",
        // ... altri stili e opzioni del dataset ...
      },
      {
        label: "SO2",
        data: [30, 35, 28, 25, 29, 32, 31], // Dati della variabile indipendente (SO2)
        hidden: !independentVariables.so2, // Nascondi il dataset se la variabile è disattivata
        borderColor: "white",
        backgroundColor: "white",
        pointBackgroundColor: "white",
        // ... altri stili e opzioni del dataset ...
      },
      {
        label: "O3",
        data: [40, 42, 38, 36, 41, 39, 37], // Dati della variabile indipendente (O3)
        hidden: !independentVariables.o3, // Nascondi il dataset se la variabile è disattivata
        borderColor: "white",
        backgroundColor: "white",
        pointBackgroundColor: "white",
        // ... altri stili e opzioni del dataset ...
      },
      {
        label: "PM10",
        data: [70, 68, 72, 75, 69, 71, 73], // Dati della variabile indipendente (PM10)
        hidden: !independentVariables.pm10, // Nascondi il dataset se la variabile è disattivata
        borderColor: "white",
        backgroundColor: "white",
        pointBackgroundColor: "white",
        // ... altri stili e opzioni del dataset ...
      },
      {
        label: "PM2.5",
        data: [60, 58, 62, 64, 61, 59, 63], // Dati della variabile indipendente (PM2.5)
        hidden: !independentVariables.pm25, // Nascondi il dataset se la variabile è disattivata
        borderColor: "white",
        backgroundColor: "white",
        pointBackgroundColor: "white",
        // ... altri stili e opzioni del dataset ...
      },
      // ... altri dataset per le altre variabili indipendenti ...
    ],
  };

  // Opzioni del grafico
  const options = {
    // ... opzioni del grafico ...
    scales: {
      x: {
        grid: {
          color: "white", // Imposta il colore della griglia dell'asse X in bianco
        },
        ticks: {
          color: "white", // Imposta il colore delle etichette dell'asse X in bianco
        },
      },
      y: {
        grid: {
          color: "white", // Imposta il colore della griglia dell'asse Y in bianco
        },
        ticks: {
          color: "white", // Imposta il colore delle etichette dell'asse Y in bianco
        },
      },
    },
    legend: {
      // Utilizza il callback di onClick per aggiornare lo stato delle variabili indipendenti
      onClick: (_, legendItem) => {
        const datasetIndex = legendItem.datasetIndex;
        const meta = this.chart.getDatasetMeta(datasetIndex);
        const hidden =
          meta.hidden === null
            ? !this.chart.data.datasets[datasetIndex].hidden
            : null;
        setIndependentVariables((prevVariables) => ({
          ...prevVariables,
          [legendItem.text.toLowerCase()]: hidden,
        }));
      },
      labels: {
        color: "white", // Imposta il colore delle etichette della legenda in bianco
      },
    },
  };

  const calculateMultipleRegression = () => {
    const selectedVariables = data.datasets.filter(
      (dataset) => !dataset.hidden
    );

    // Costruisci la matrice X (variabili indipendenti)
    const X = selectedVariables
      .slice(1) // Escludi la variabile dipendente (temperatura)
      .map((dataset) => dataset.data);

    // Costruisci la matrice Y (variabile dipendente, temperatura)
    const Y = selectedVariables[0].data;

    // Calcola i coefficienti di regressione usando simple-statistics
    const coefficients = ss.linearRegression(X, Y);

    // Calcola i valori previsti utilizzando i coefficienti di regressione
    const predictedValues = X.map((x) =>
      ss.linearRegressionLine(coefficients, x)
    );

    return predictedValues;
  };

  // Calcola i nuovi valori previsti con le variabili selezionate
  const predictedValues = calculateMultipleRegression();

  // Aggiorna i dati del grafico con i nuovi valori previsti
  if (data.datasets.length > 1) {
    data.datasets[0].data = predictedValues; // Aggiorna i dati previsti per la variabile dipendente
    for (let i = 1; i < data.datasets.length; i++) {
      const variable = data.datasets[i].label.toLowerCase();
      data.datasets[i].hidden = !independentVariables[variable]; // Nascondi i dataset in base allo stato delle variabili
    }
  }

  return (
    <div>
      <div>
        {/* Componente del grafico */}
        <Line data={data} options={options} />
      </div>
    </div>
  );
}

export default MultipleRegression;
