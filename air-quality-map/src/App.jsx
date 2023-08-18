import React, { useEffect, useState } from "react";
import dataR from "./data/dataR.json";
import axios from "axios";
import weatherDataProxy from "./data/weatherProxy.json";
import dailyDataProxy from "./data/dailyDataProxy.json";
import datasBackup from "./data/datasBackup.json";
import windData from "./data/wind.data.json";
import * as turf from "@turf/turf";
import Sidebar from "./components/Sidebar";
import MapComponent from "./components/MapComponent";
import Legend from "./components/Legend";
import Toolbar from "./components/Toolbar";
import Navbar from "./components/Navbar";
import { useSelector } from "react-redux";
import TemporalSlider from "./components/TemporalSlider";

const App = () => {
  const sidebar = useSelector((state) => state.sidebar);
  const [stateInfo, setStateInfo] = useState(null);
  const [datas, setDatas] = useState([]);
  const [bulkDatas, setBulkDatas] = useState([]);
  const [dotsDatas, setDotsDatas] = useState({});
  const [windDatas, setWindDatas] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  /* const [zoomInClicked, setZoomInClicked] = useState(false);
  const [centerClicked, setCenterClicked] = useState(false);
  const [zoomOutClicked, setZoomOutClicked] = useState(false); */
  const layersToShow = {
    "PM2.5": "state-pm2.5-aqi",
    PM10: "state-pm10-aqi",
    OZONE: "state-ozone-aqi",
    NO2: "state-no2-aqi",
    CO: "state-co-aqi",
    SO2: "state-so2-aqi",
  };
  const aqiBreakpoints = {
    OZONE: [
      [0.0, 0.054],
      [0.055, 0.07],
      [0.071, 0.085],
      [0.086, 0.105],
      [0.106, 0.2],
      [0.201, 0.504],
      [0.505, 0.604],
    ],
    "PM2.5": [
      [0, 12.0],
      [12.1, 35.4],
      [35.5, 55.4],
      [55.5, 150.4],
      [150.5, 250.4],
      [250.5, 350.4],
      [350.5, 500.4],
    ],
    PM10: [
      [0, 54],
      [55, 154],
      [155, 254],
      [255, 354],
      [355, 424],
      [425, 504],
      [505, 604],
    ],
    CO: [
      [0.0, 4.4],
      [4.5, 9.4],
      [9.5, 12.4],
      [12.5, 15.4],
      [15.5, 30.4],
      [30.5, 40.4],
      [40.5, 50.4],
    ],
    SO2: [
      [0, 35],
      [36, 75],
      [76, 185],
      [186, 304],
      [305, 604],
      [605, 804],
      [805, 1004],
    ],
    NO2: [
      [0, 53],
      [54, 100],
      [101, 150],
      [151, 200],
      [201, 300],
      [301, 400],
      [401, 500],
    ],
  };

  /* const handleStopButton = () => {
    setZoomInClicked(false);
    setCenterClicked(false);
    setZoomOutClicked(false);
  };

  const handleZoomInClick = () => {
    setZoomInClicked(true);
  };

  const handleCenterClick = () => {
    setCenterClicked(true);
  };

  const handleZoomOutClick = () => {
    setZoomOutClicked(true);
  }; */

  const stateClicked = (stateInfos) => {
    setStateInfo(stateInfos);
  };

  function initilizeJson() {
    dataR.features.forEach((feature) => {
      feature.properties.AQI = null;
      feature.lastUpdatedMe = null;
      feature.properties.nDetections = null;
      Object.keys(feature.properties.measurements).forEach((key) => {
        feature.properties.measurements[key].totalValues = null;
        feature.properties.measurements[key].fixedValue = null;
        feature.properties.measurements[key].times = null;
        feature.properties.measurements[key].unit = null;
      });
    });
    console.log("JSON initilized correctly", "\n");
  }

  function formattedTime() {
    const now = new Date();

    // Ottenere i componenti della data e dell'ora
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // I mesi sono indicizzati da 0 a 11, quindi aggiungiamo 1
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    // Creare la stringa di data e ora formattata
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  }

  function calculateAQI(pollutant, concentration) {
    const breakpoints = aqiBreakpoints[pollutant];

    let i;
    for (i = 0; i < breakpoints.length; i++) {
      if (
        concentration >= breakpoints[i][0] &&
        concentration <= breakpoints[i][1]
      ) {
        break;
      }
    }
    if (i >= breakpoints.length) {
      i = breakpoints.length - 1;
    }
    const AQILo = breakpoints[i][0];
    const AQIHi = breakpoints[i][1];
    const aqi =
      ((AQIHi - AQILo) / (breakpoints[i][1] - breakpoints[i][0])) *
        (concentration - AQILo) +
      AQILo;

    return Math.round(aqi);
  }

  /* async function getAirQualityDataEurope() {
  const API_TOKEN = "551302aec928205074ba444ee505af1db545b83c";
    try {
      const response = await axios.get(
        `https://api.waqi.info/map/bounds/?token=${API_TOKEN}&latlng=36.0,-10.0,72.0,40.0`
      );

      // Verifica se la risposta è valida
      if (response.status === 200 && response.data.data) {
        const europeAirQualityData = response.data.data;
        let datas = []
        // Otteniamo i dati degli inquinanti per ogni stazione di monitoraggio
        for (const station of europeAirQualityData) {
          const stationDataResponse = await axios.get(
            `https://api.waqi.info/feed/@${station.uid}/?token=${API_TOKEN}`
          );
          if (
            stationDataResponse.status === 200 &&
            stationDataResponse.data.data
          ) {
            const stationAirQualityData = stationDataResponse.data.data;
            datas.push(stationAirQualityData)
            console.log("stazione: ", station.uid, stationAirQualityData); // I dati sull'indice di qualità dell'aria e gli inquinanti per questa stazione di monitoraggio sono presenti in stationAirQualityData
          } else {
            console.log(
              `Errore nella richiesta API per la stazione di monitoraggio ${station.uid}`
            );
          }
        }
      } else {
        console.log("Errore nella richiesta API");
      }
    } catch (error) {
      console.error("Errore durante la richiesta API:", error.message);
    }
  } */

  /* async function getHistoricalData(startDate, endDate) {
    //startDate = "2023-07-10" endDate = "2023-07-17"
    const startDay = startDate.split("-")[2];
    const endDay = endDate.split("-")[2];
    const month = startDate.split("-")[1];
    const days = [];
    for (let i = Number(startDay); i < endDay; i++) {
      days.push(i);
    }
    console.log(days);
    let data = [];
    for (const day of days) {
      data.push(await getFirstHistoricalUS(month, day));
      data.push(await getSecondHistoricalUS(month, day));
      data.push(await getThirdHistoricalUS(month, day));
      data.push(await getFourthHistoricalUS(month, day));
    }
    return data;
  } */

  async function dailyUpdate(dataToUpdate) {
    /* //addinge test data
        await axios.post(`http://localhost:4000/test-aggiunta`); */

    /*  //removing 
        const id = "_1";
        await axios.post(`http://localhost:4000/inserisci-dati`, {
          id,
          ...historicalData[id].slice(0, 5),
        }); */

    /* await axios.post(`http://localhost:4000/daily-update`, {
          dataR,
        }); */

    await axios.post(`http://localhost:4000/daily-update`, {
      dataToUpdate,
    });
    console.log("Daily update done");
  }

  async function dailyBulkDataUpdate(todayBulkData) {
    await axios.post(`http://localhost:4000/daily-bulk-update`, {
      todayBulkData,
    });
    console.log("Daily bulk update done");
  }

  async function dailyDotsDataUpdate(todayDots) {
    await axios.post(`http://localhost:4000/daily-dots-update`, {
      todayDots,
    });
    console.log("Daily dots update done");
  }

  async function getDailyData() {
    const response = await axios.get(`http://localhost:4000/get-daily-datas`);
    console.log("Daily data got", response);
    return response.data;
  }

  async function getWindDatas() {
    const data = windData; //await axios.get(`http://localhost:4000/daily-wind-update`);
    if (data) {
      return data;
    } else {
      console.log("wind data error");
      return null;
    }
  }

  async function getDatas() {
    const response = await axios.get(`http://localhost:4000/datas`);
    return response.data;
  }

  async function getBulkDatas() {
    const response = await axios.get(`http://localhost:4000/bulk-datas`);
    return response.data;
  }

  async function getDotsDatas() {
    const response = await axios.get(`http://localhost:4000/dots-datas`);
    return response.data;
  }

  async function getWeatherDataStates() {
    const apiKey = "bbf74644b9d24ee58ea144902232407";
    const baseUrl = "https://api.weatherapi.com/v1/current.json";
    const states = [
      "Alabama",
      "Alaska",
      "Arizona",
      "Arkansas",
      "California",
      "Colorado",
      "Connecticut",
      "Delaware",
      "Florida",
      "Georgia",
      "Hawaii",
      "Idaho",
      "Illinois",
      "Indiana",
      "Iowa",
      "Kansas",
      "Kentucky",
      "Louisiana",
      "Maine",
      "Maryland",
      "Massachusetts",
      "Michigan",
      "Minnesota",
      "Mississippi",
      "Missouri",
      "Montana",
      "Nebraska",
      "Nevada",
      "New Hampshire",
      "New Jersey",
      "New Mexico",
      "New York",
      "North Carolina",
      "North Dakota",
      "Ohio",
      "Oklahoma",
      "Oregon",
      "Pennsylvania",
      "Rhode Island",
      "South Carolina",
      "South Dakota",
      "Tennessee",
      "Texas",
      "Utah",
      "Vermont",
      "Virginia",
      "Washington",
      "West Virginia",
      "Wisconsin",
      "Wyoming",
    ];
    const weatherData = {};
    for (const state of states) {
      const url = `${baseUrl}?key=${apiKey}&q=${encodeURIComponent(state)}`;
      const response = await fetch(url);
      const data = await response.json();
      weatherData[state] = data; // Salva i dati meteo nell'oggetto weatherData
    }
    return weatherData;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        /* getWeatherData().then((weatherData) => {
          console.log(weatherData);
        }); */
        //console.log(weatherData)
        /* await axios.post("http://localhost:4000/multipleAddForTest", {
          datasBackup,
        }); */

        /* const prova = await getAirQualityDataEurope();
        console.log(prova); */

        const todayIsUpdated = await axios.get(
          `http://localhost:4000/is-daily-update-done`
        );
        if (!todayIsUpdated.data) {
          const dailyData = await getDailyData(); //getting today data, using dataAirNow as proxy to not get each time api connection
          const weatherDailyData = await getWeatherDataStates();
          initilizeJson(); //initialize json to be sure that adding field are correct
          let todayBulkData = {
            PM10: {
              tempValue: 0,
              finalValue: 0,
              times: 0,
            },
            "PM2.5": {
              tempValue: 0,
              finalValue: 0,
              times: 0,
            },
            OZONE: {
              tempValue: 0,
              finalValue: 0,
              times: 0,
            },
            NO2: {
              tempValue: 0,
              finalValue: 0,
              times: 0,
            },
            CO: {
              tempValue: 0,
              finalValue: 0,
              times: 0,
            },
            SO2: {
              tempValue: 0,
              finalValue: 0,
              times: 0,
            },
            TEMP: {
              tempValue: 0,
              finalValue: 0,
              times: 0,
            },
          };
          let todayDots = [];
          dailyData.forEach((measurement) => {
            const point = turf.point([
              measurement.Longitude,
              measurement.Latitude,
            ]);
            for (let i = 0; i < dataR.features.length; i++) {
              const feature = dataR.features[i];
              feature.id = i;
              feature.lastUpdatedMe = formattedTime().toString(); //??
              const typeF = feature.geometry.type;
              let polygon = {};
              if (typeF === "MultiPolygon") {
                polygon = turf.multiPolygon(feature.geometry.coordinates);
              } else {
                polygon = turf.polygon(feature.geometry.coordinates);
              }
              if (
                turf.booleanPointInPolygon(point, polygon, {
                  ignoreBoundary: false,
                })
              ) {
                todayDots.push(point);
                feature.properties.nDetections =
                  feature.properties.nDetections + 1;
                if (
                  Object.keys(feature.properties.measurements).includes(
                    measurement.Parameter
                  )
                ) {
                  todayBulkData[measurement.Parameter].tempValue +=
                    measurement.Value;
                  todayBulkData[measurement.Parameter].times += 1;
                  if (feature.properties.AQI < measurement.AQI) {
                    feature.properties.AQI = measurement.AQI;
                  }
                  if (
                    feature.properties.measurements[measurement.Parameter]
                      .totalValues != null
                  ) {
                    feature.properties.measurements[
                      measurement.Parameter
                    ].totalValues += measurement.Value;
                    feature.properties.measurements[
                      measurement.Parameter
                    ].times += 1;
                  } else {
                    feature.properties.measurements[
                      measurement.Parameter
                    ].totalValues = measurement.Value;
                    feature.properties.measurements[
                      measurement.Parameter
                    ].unit = measurement.Unit;
                    feature.properties.measurements[
                      measurement.Parameter
                    ].lastUpdate = measurement.UTC;
                    feature.properties.measurements[
                      measurement.Parameter
                    ].times = 1;
                  }
                  if (measurement.Parameter !== null) {
                    const singleAQIPoll = calculateAQI(
                      measurement.Parameter,
                      measurement.Value
                    );
                    if (
                      feature.properties[layersToShow[measurement.Parameter]] <
                      singleAQIPoll
                    ) {
                      feature.properties[layersToShow[measurement.Parameter]] =
                        singleAQIPoll;
                    }
                  }
                }
                break;
              }
            }
          });
          //setting fixedValue to sidebar data, fixedValue is the sum for each pollutant divided by the number of its measurements in that state
          //calculating countryAQI for country-layer
          let med = 0;
          let tem = 0;
          let hum = 0;
          dataR.features.forEach((el) => {
            //setting fixedValue
            Object.keys(el.properties.measurements).forEach((key) => {
              if (
                el.properties.measurements[key].totalValues != null &&
                el.properties.measurements[key].totalValues > 0
              ) {
                el.properties.measurements[key].fixedValue =
                  el.properties.measurements[key].totalValues /
                  el.properties.measurements[key].times;
              }
            });
            const weatherNameState = el.properties.name;
            const weatherStateData = weatherDailyData[weatherNameState];
            const cloud = weatherStateData.current.cloud;
            const tempReal = weatherStateData.current.temp_c;
            todayBulkData["TEMP"].tempValue += tempReal;
            todayBulkData["TEMP"].times += 1;
            const tempFeel = weatherStateData.current.feelslike_c;
            const humidity = weatherStateData.current.humidity;
            const conditionIcon = weatherStateData.current.condition.icon;
            const conditionText = weatherStateData.current.condition.text;
            tem += tempReal;
            hum += humidity;
            el.weather = {
              data: {
                cloud,
                tempReal,
                tempFeel,
                humidity,
                conditionIcon,
                conditionText,
              },
            };
            med += el.properties.AQI;
          });
          Object.keys(todayBulkData).forEach((el) => {
            todayBulkData[el] = (
              todayBulkData[el].tempValue / todayBulkData[el].times
            ).toFixed(2);
          });
          dataR.features.forEach((el) => {
            el.properties.countryAQI = med / dataR.features.length;
            el.properties.countryTemp = tem / dataR.features.length;
            el.properties.countryHum = hum / dataR.features.length;
          });
          await dailyUpdate(dataR);
          console.log("Daily Data Updated");
          await dailyBulkDataUpdate(todayBulkData);
          console.log("Daily Bulk Data Updated");
          await dailyDotsDataUpdate(todayDots);
          console.log("Daily Dots Updated");
        }
        const datas = await getDatas();
        console.log("1", datas);
        const bulkDatas = await getBulkDatas();
        console.log("2", bulkDatas.data);
        const dotsDatas = await getDotsDatas();
        console.log("3", dotsDatas.data);
        const windData = await getWindDatas();
        console.log("4", windData);
        setDatas(datas); //getting the whole db data (7 days data)
        setBulkDatas(bulkDatas.data);
        setDotsDatas(dotsDatas.data);
        setWindDatas(windData);
        setIsLoading(false);

        /* //CODE TO FIND MIN, MED, MAX AQI LEVEL
        let min = 0;
        let med = 0;
        let max = 0;
        dataR.features.forEach((el) => {
          if (el.type == "Feature") {
            if (el.properties.AQI > max) {
              max = el.properties.AQI;
            }
            if (el.properties.AQI < min) {
              min = el.properties.AQI;
            }
            med += el.properties.AQI;
          }
        });
        console.log(min, med / dataR.features.length, max); */

        /* //code to write the dataR json into a real file
          axios.post("http://localhost:4000/update", dataR)
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            console.error(
              "Si è verificato un errore durante la richiesta:",
              error
            );
          }); */
      } catch (error) {
        console.error("Error fetching air quality data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex-col">
      <Navbar></Navbar>
      {isLoading ? (
        <div className="loading-overlay">
          <img src="/loading-spin.gif" alt="Logo" width="300" height="300" />
        </div>
      ) : (
        <div>
          {datas.length > 0 && (
            <MapComponent
              datas={datas}
              dotsDatas={dotsDatas}
              windDatas={windDatas}
              stateClicked={stateClicked}
              /* zoomInClicked={zoomInClicked}
              centerClicked={centerClicked}
              zoomOutClicked={zoomOutClicked}
              stopButton={handleStopButton} */
            ></MapComponent>
          )}
          <TemporalSlider></TemporalSlider>
          {sidebar && stateInfo && (
            <Sidebar infos={stateInfo} bulkDatas={bulkDatas} />
          )}
          <Legend></Legend>
          <Toolbar
          /* onZoomInClick={handleZoomInClick}
            onCenterClick={handleCenterClick}
            onZoomOutClick={handleZoomOutClick} */
          ></Toolbar>
        </div>
      )}
    </div>
  );
};

export default App;
