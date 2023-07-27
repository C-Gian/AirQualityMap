import { Scatter } from "react-chartjs-2";

const AnalysisChartSidebar = () => {
  const dati = [
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

  // Prendi i dati necessari per il grafico a dispersione
  const datiTemperatura = dati.map((dato) => dato.temperatura);
  const datiCO2 = dati.map((dato) => dato.co2);
  const datiNO2 = dati.map((dato) => dato.no2);
  const datiSO2 = dati.map((dato) => dato.so2);
  const datiPM10 = dati.map((dato) => dato.pm10);
  const datiPM25 = dati.map((dato) => dato.pm25);
  // Ripeti per gli altri inquinanti

  // Definisci i dati del grafico
  // ... (codice precedente)

  // Definisci i dati del grafico
  const data = {
    datasets: [
      {
        label: "CO2",
        data: datiCO2.map((y, index) => ({ x: datiTemperatura[index], y })),
        backgroundColor: "rgba(255, 0, 0, 0.5)", // Colore dei punti CO2
      },
      {
        label: "NO2",
        data: datiNO2.map((y, index) => ({ x: datiTemperatura[index], y })),
        backgroundColor: "rgba(0, 255, 0, 0.5)", // Colore dei punti NO2
      },
      {
        label: "SO2",
        data: datiSO2.map((y, index) => ({ x: datiTemperatura[index], y })),
        backgroundColor: "rgba(255, 0, 255, 0.7)", // Colore dei punti NO2
      },
      {
        label: "PM10",
        data: datiPM10.map((y, index) => ({ x: datiTemperatura[index], y })),
        backgroundColor: "rgba(255, 255, 0, 0.7)", // Colore dei punti NO2
      },
      {
        label: "PM25",
        data: datiPM25.map((y, index) => ({ x: datiTemperatura[index], y })),
        backgroundColor: "rgba(0, 0, 255, 0.7)", // Colore dei punti NO2
      },
      // Ripeti per gli altri inquinanti
    ],
  };

  // ... (resto del codice)

  // Definisci le opzioni del grafico
  const options = {
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
  };

  return <Scatter data={data} options={options} />;
};

export default AnalysisChartSidebar;
