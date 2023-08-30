import React, { useEffect, useState } from "react";
import dataR from "./data/dataR.json";
import axios from "axios";
import weatherDataProxy from "./data/weatherProxy.json";
import dailyDataProxy from "./data/dailyDataProxy.json";
import datasBackup from "./data/datasBackup.json";
import windDataImport from "./data/wind.data.json";
import * as turf from "@turf/turf";
import Sidebar from "./components/Sidebar";
import MapComponent from "./components/MapComponent";
import Legend from "./components/Legend";
import Toolbar from "./components/Toolbar";
import Navbar from "./components/Navbar";
import { useSelector } from "react-redux";
import ControlPanel from "./components/ControlPanel";
import Modes from "./components/Modes";

const App = () => {
  const sidebar = useSelector((state) => state.sidebar);
  const nightMode = useSelector((state) => state.nightMode);
  const colorBlindMode = useSelector((state) => state.colorBlind);
  const [stateInfo, setStateInfo] = useState(null);
  const [datas, setDatas] = useState([]);
  const [bulkDatas, setBulkDatas] = useState([]);
  const [dotsDatas, setDotsDatas] = useState({});
  const [windDatas, setWindDatas] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [refreshIsLoading, setRefreshIsLoading] = useState(false);
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

  const onRefreshButton = async () => {
    setRefreshIsLoading(true);
    await getDataCode(true);
    setRefreshIsLoading(false);
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

  async function refreshData(dataToUpdate) {
    await axios.post(`http://localhost:4000/refresh-data`, {
      dataToUpdate,
    });
    console.log("Refresh Data Done");
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

  async function refreshDots(todayDots) {
    await axios.post(`http://localhost:4000/refresh-dots`, {
      todayDots,
    });
    console.log("Refresh Dots Done");
  }

  async function getDailyData() {
    /* const apiAQIWorlds = await axios.get(
      "https://api.waqi.info/v2/map/bounds?latlng=-90,-180,90,180&networks=all&token=551302aec928205074ba444ee505af1db545b83c"
    ); */
    const response = await axios.get(`http://localhost:4000/get-daily-datas`);
    const flatResponse = response.data.flat();
    console.log("Daily data got", flatResponse);
    return flatResponse;
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

  /* async function getWindDatas() {
    const data = windDataImport; //await axios.get(`http://localhost:4000/daily-wind-update`);
    if (data) {
      return data;
    } else {
      console.log("wind data error");
      return null;
    }
  } */

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

  /* async function getAllData() {
    try {
      const [datas, bulkDatas, dotsDatas] = await Promise.all([
        getDatas(),
        getBulkDatas(),
        getDotsDatas(),
      ]);
      const windData = windDataImport;

      setDatas(datas); //getting the whole db data (7 days data)
      setBulkDatas(bulkDatas.data);
      setDotsDatas(dotsDatas.data);
      setWindDatas(windData);

      // Puoi fare ulteriori elaborazioni sui dati qui
    } catch (error) {
      console.error("Errore durante il recupero dei dati:", error);
    }
  } */

  async function getDataCode(refresh) {
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
      const point = turf.point([measurement.Longitude, measurement.Latitude]);
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
          //todayDots.push(point);
          todayDots.push({
            point: point,
            value: measurement.AQI ? measurement.AQI : 0,
          });
          feature.properties.nDetections = feature.properties.nDetections + 1;
          if (
            Object.keys(feature.properties.measurements).includes(
              measurement.Parameter
            )
          ) {
            todayBulkData[measurement.Parameter].tempValue += measurement.Value;
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
              feature.properties.measurements[measurement.Parameter].times += 1;
            } else {
              feature.properties.measurements[
                measurement.Parameter
              ].totalValues = measurement.Value;
              feature.properties.measurements[measurement.Parameter].unit =
                measurement.Unit;
              feature.properties.measurements[
                measurement.Parameter
              ].lastUpdate = measurement.UTC;
              feature.properties.measurements[measurement.Parameter].times = 1;
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
    if (refresh) {
      await refreshData(dataR);
      await dailyBulkDataUpdate(todayBulkData);
      await refreshDots(todayDots);
      console.log("All refresh operations completed");
      const datas = await getDatas();
      setDatas(datas);
    } else {
      await dailyUpdate(dataR);
      console.log("Daily Data Updated");
      await dailyBulkDataUpdate(todayBulkData);
      console.log("Daily Bulk Data Updated");
      await dailyDotsDataUpdate(todayDots);
      console.log("Daily Dots Updated");
    }
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
          await getDataCode(false);
        }
        /* await getAllData();
        console.log("datas got"); */
        const datas = await getDatas();
        console.log("datas", datas);
        const bulkDatas = await getBulkDatas();
        const dotsDatas = await getDotsDatas();
        const windData = windDataImport;
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
    <div className="flex flex-col overflow-x-hidden w-screen h-screen">
      <Navbar></Navbar>
      {isLoading ? (
        <div
          className="flex justify-center items-center h-full w-full backdrop-blur-3xl"
          style={{
            backgroundColor: nightMode ? "rgba(45, 47, 48, 1)" : "white",
          }}
        >
          <div className={nightMode ? "globe-night" : "globe"}>
            <svg
              width="1328"
              height="340"
              viewBox="0 0 547 140"
              xmlns="http://www.w3.org/2000/svg"
              className="globe-svg"
            >
              <path
                d="M120.95 45.907l-1.18 1.573-.784.786-1.57.865-.236.71s-.628.63-.55 1.022c.08.393.08 1.1.08 1.1s-1.1 1.024-1.57 1.338c-.472.314-1.1 1.022-1.1 1.022s-.393.473-.628.63c-.236.157-.628.63-.942 1.1-.315.473-.63.787-.786 1.023-.157.236-.628.786-.863 1.652-.235.865-.863 1.887-.863 1.887l-.157.393c.078 1.338.078 1.574.235 2.046.157.47.315.314.157 1.337-.157 1.022-.157 1.415-.314 1.887s-.628 1.337-.784 1.73c-.158.394.314 1.1.314 1.1s.235 1.024.078 1.26c-.157.236.08.708.08.708s.94.55 1.255.865c.315.315.865.787.943 1.023.08.236.707 1.337.785 1.573.08.236.707 1.1.864 1.337.157.236.942 1.1.942 1.1s1.02.787 1.257 1.102c.236.314.943.472 1.178.707.236.236.785.157 1.1.394.314.236.942-.158 1.256 0 .314.157 1.178-.157 1.413-.315.236-.156.785-.706 1.178-.47.392.235.628 0 .942.078.314.08.785-.314 1.1-.314.313 0 1.098-.315 1.334-.315s1.022-.474 1.336-.474c.314 0 .706-.313 1.1-.156.39.156.234-.315.94-.08.708.236.943 0 1.18.236.234.237.55 0 .784.316.236.314.628.55.707.865.078.314.55.63.55.63l.47.077s.63-.47.785-.156c.157.314.864.236.864.236l.707.786.235.315s.472 1.258.393 1.73c-.078.472-.078 1.494-.313 1.73-.236.236-.393 1.26-.393 1.26s-.314.313.393.942c.707.63 1.178 1.18 1.413 1.494.236.316.864 1.182.942 1.732.08.55.236.865.55 1.573.314.708.707.786.785 1.573.08.787.236.787.157 1.337-.078.55-.314.63-.078 1.022.235.394.55 1.102.47 1.338-.078.235-.235 1.258-.235 1.258l-.156.472-.706 1.338-.472.707c-.157.55-.47 1.1-.392 1.887.078.787-.392.787.235 1.573.628.787.94 1.652 1.334 2.36.393.708.628 1.416.707 1.887.08.472.393.63.55 1.26.157.628.236.942.236 1.336 0 .393-.08 1.416.08 1.652.155.236.234.944.313 1.258.077.315-.237.394.234.944.47.55.785.865 1.1 1.26.313.392.235.235.47.785.236.55.55.866.63 1.337.077.47.155 1.65.39 2.2.237.552.55 1.103.55 1.103s.865.55 1.18.472c.312-.08.94-.786 1.412-.55.47.235.864 0 1.256 0 .393 0 .785-.473 1.178-.473.393 0 .942-.63 1.257-.472.314.157.706-.158 1.098-.55.393-.393.63-.708 1.335-1.337.707-.63.628-.63 1.1-1.023.47-.393.942-1.26 1.49-1.416.55-.157.708-.707.865-1.1.157-.394.235-.63.47-.945.237-.315.08.08.472-.944.393-1.023.865-1.416 1.257-1.652.392-.236.628-.708.863-.787.236-.08.63.236.472-.472-.158-.707 0-1.73-.158-1.966-.157-.237-.393.55-.314-.63.08-1.18.942-2.36.942-2.36s1.178-1.494 1.57-1.73c.393-.236.47-.472 1.02-.787.55-.314 1.728-1.1 1.728-1.494 0-.394.472-1.417.472-1.653s0-.472-.157-1.81c-.157-1.336.157-1.02-.314-2.28-.472-1.258-.55-2.83-.865-3.224-.314-.394-.157-1.417-.157-1.73 0-.315.55-1.102.785-1.416.236-.315 1.256-1.574 1.256-1.574s1.57-1.808 2.12-2.673c.55-.866 1.098-1.652 1.49-1.966.394-.315 1.336-1.024 1.885-1.81.55-.786 1.65-2.28 1.728-2.517.078-.235.706-1.022.706-1.022s.863-1.023 1.02-1.573c.157-.55.942-3.618.785-3.46-.157.157-1.1.314-1.413.392-.314.08.47.393-1.806.237-2.277-.157-3.454.236-3.454.236-.708-.157-1.257.63-1.493-.472-.236-1.1-.394-1.73-.864-2.516-.47-.787-.786-1.1-1.492-2.124-.706-1.022-.628-.55-1.257-1.337-.627-.786-.785-.55-1.177-1.573-.393-1.022-.707-.63-1.178-2.045-.47-1.417-.785-1.574-1.02-2.36-.236-.787-.55-1.023-.707-1.73-.157-.71-1.963-4.327-2.2-4.563-.234-.235-.627-1.494-.548-1.258.078.235 1.178 1.02 1.178 1.02s.627-.235.863-.235 1.178.866 1.178 1.18c0 .315 1.65 1.81 2.042 2.91.392 1.1.864 1.888.942 2.202.078.315.864 1.574 1.178 2.046.313.472 1.334 1.415 1.49 1.887.158.472 1.65 2.045 1.65 3.068 0 1.022.706 2.36.785 2.673.08.316 1.492.71 1.492.71l1.885-.472s2.826-1.81 3.14-1.81c.314 0 2.827-1.18 2.827-1.18s1.02-.943 1.727-1.493c.707-.55 1.492-1.573 1.65-2.045.156-.473.47-.55 1.098-1.26.628-.707 1.492-1.415.942-1.887-.55-.47-.864-.314-1.648-1.1-.786-.787-.707-.63-1.257-1.653-.55-1.022.078-2.202-1.1-1.022-1.178 1.18-.707 1.495-1.885 1.73-1.177.237-1.65 1.023-2.198.237-.55-.787-1.1-.315-1.414-1.495-.314-1.18-.55-1.26-.628-1.73-.078-.472 0-.472-.628-1.652s-.157-2.99.236-1.966c.392 1.022 1.02 1.18 2.04 1.887 1.022.707 1.493 1.258 2.435 1.337.942.078 1.728 0 1.885.156.157.158.313-.078.706.08.392.157.548-.236.706.392.157.63 1.02.708 1.413 1.1.392.394.392.237 1.413.394 1.02.157 2.434.157 2.434.157l1.49-.08 1.73.158s1.256.708 1.57.708c.313 0 .392.865 1.177 1.337s.942.55 1.413 1.1c.472.552.393.788 1.02 1.338.63.55 1.65-.078 1.807-.314.157-.236.942-.63.786 0-.158.63.784.393.55 1.888-.237 1.494-.394 1.1 0 2.123.39 1.023 2.118 4.17 2.197 5.113.08.943.55.63.628 1.495.08.864.55 1.18.55 1.808 0 .63.55.787.628 1.26.08.472.942.078 1.178 0 .237-.08 1.335-1.102 1.335-1.102s.472-.156.393-.943c-.08-.786 0-.63 0-1.81 0-1.18-.47-1.18-.235-2.358.235-1.18.863-1.888 1.02-2.438.157-.552.786-1.496 1.1-1.575.313-.078 2.04-.943 2.434-1.494.392-.55 1.02-1.18 1.65-1.808.627-.63 1.726-1.415 1.962-1.18.234.236.156.158.548.158.393 0 1.1.315 1.65.393.55.08 1.648 1.416 1.884 2.124.235.708.078.55.942 1.573.864 1.022 1.65.393 1.65 1.65 0 1.26 0 1.18.392 1.653.392.472.863-.865 1.334-.707.47.157.55-.158.942 1.1.392 1.26.628 1.26.707 2.518.077 1.258-.08.078-.08 1.1 0 1.023-.08 1.102.08 2.045.155.944.705 1.258.627 1.415 0 0 .47-1.337.313-2.28-.156-.944 0-2.28.393-2.674.393-.393.786-.786 1.1.237.314 1.022.47.236 1.177 1.415.707 1.18 1.335.944 1.413 1.494.08.55.472.63 1.02 1.1.55.474 1.022-.077 1.65-.55.63-.47 2.355-2.2 2.435-2.91.078-.707.784-.55-.472-2.358-1.257-1.81-1.257-2.44-2.59-3.54-1.335-1.1-2.12-1.18-1.1-2.595 1.02-1.416 1.492-2.36 2.12-1.966.628.393 1.727.314 1.727 1.887s-.314 3.304.785 1.416c1.1-1.888 1.65-2.99 1.335-2.674-.314.315.706-.63.706-.63s.078-.707 1.413-1.02c1.335-.317 1.727-.473 2.2-.71.47-.236 1.805-1.81 2.04-2.516.235-.708.864-1.967.707-2.517-.157-.55-.943-3.224-1.1-3.146-.156.08-.078.08-1.098-1.022-1.022-1.1-1.728-1.888-1.885-2.36-.157-.472-.55-.55-.08-1.18.473-.63.708-.55.787-1.1.078-.55.706-1.023-.472-.63-1.177.393-.314.158-1.335.08-1.02-.08-3.69.55-2.354-1.102 1.334-1.652 1.726-2.674 1.962-2.674s1.414-1.338 1.492-.08c.078 1.26.55.944.628 1.73.08.787 1.65-.864 1.65-.864s.548.157.94.55c.393.393.393 1.652.393 1.652s-.313-.394.55.236c.864.63 1.806.314 1.806 1.65 0 1.338 0 1.417.55 1.732.55.314 1.098.157 1.57-.236.47-.393 1.256-1.81 1.256-1.81s.08-.55-1.178-1.336c-1.256-.787-2.04-1.337-2.51-1.73-.473-.394-.316-1.573.155-2.046.472-.472.707-.708.55-1.337-.158-.628.235-1.1 1.413-1.02 1.178.078 1.413-.08 1.413-.08s.236.157.236-.315c0-.47 1.49-2.674 1.098-2.674-.393 0 .08-.55-.157-1.414-.235-.866.786-2.202-.077-2.832-.864-.63-1.1-.944-1.65-1.887-.55-.945-.47-1.1-2.512-1.338-2.04-.237-2.982.47-3.454-.158-.47-.63-.706.944-1.02-.944-.314-1.887.47-3.146.47-3.146s1.257-.786 1.57-1.337c.315-.55 1.57-.787 2.593-.393 1.02.393 2.51.314 3.768.55 1.256.236 1.177 1.023 1.805 0 .628-1.022 0-1.494.47-2.044.473-.55 1.022-1.416 1.415-.866.392.55 1.178 1.1 1.806.393.628-.707.864-.786.864-.786l.313.314s.708-.394.708.314.707 1.495.314 2.045c-.393.55-.942.472-.942 1.81 0 1.337 0 1.1.863 2.202.864 1.1 1.414.157 1.57 1.337.158 1.18.314.944 1.18 1.73.862.786.705.786 1.333 1.258.63.472.943.945.943.158 0-.787.077-1.18 0-1.888-.08-.707.627-1.258.155-2.438-.47-1.18-.078-1.1-1.02-1.966-.943-.865-1.57.157-1.884-1.1-.314-1.26 1.492-1.81 1.964-1.968.47-.156 1.177-1.1 1.334-.47.157.628-1.178 2.91 1.1.47 2.276-2.438 1.256-1.415 1.256-1.415s1.177-.157 1.413 0c.235.157.864-.708.628-.63-.236.08-2.512-1.258-2.512-1.258l-1.65-.943s.55-.394.943-.315c.393.08.472-.786.864-.865.393-.08 3.062.55 3.612.865.55.315 2.512.393 2.276.236-.235-.157-1.49-1.1-1.57-1.416-.078-.314-2.826-.944-3.69-.865-.864.078-1.648.314-2.355.078-.707-.236-1.727-.865-2.277-.865s-7.46-1.337-7.773-1.258c-.314.078-.785 1.573-1.02 1.337-.236-.236-.63-.236-1.73-.55-1.097-.315-2.59-.552-4.553-.71-1.962-.156-3.297.16-3.846-.47-.55-.63-1.727-.394-3.062-.473-1.335-.077-2.905 0-3.612 0-.707 0-2.355-.077-2.748-.156-.393-.08-.864-.63-1.335-.708-.47-.08-.393-.235-1.335-.393-.942-.157-.863-1.18-1.177-.315-.314.866-.158.63-.628.944-.472.315-.943.944-1.257.944-.314 0-1.57.08-1.806-.08-.236-.156-.628-.313-1.413-.313s-.785.078-1.805-.08c-1.02-.156-1.806-.078-2.748-.55-.943-.47-.943-.786-1.728-.707-.785.08-.785-.158-1.885-.158s-2.434.63-3.14.708c-.707.08-2.277-.08-2.827-.314-.55-.236-.707-.787-2.748-.55-2.042.235-3.22.235-2.827-.394.393-.63.864-1.26 1.1-1.337.235-.078.784-.47.39-.628-.39-.158-.784-.393-1.725-.472-.943-.08-.865.314-2.278.157s.786-.55-2.12-.472c-2.904.08-3.61.315-3.925.315-.314 0-.707-.63-1.492.314s-1.885 1.494-3.455 1.573c-1.57.08-1.65-.157-3.14.393-1.492.55-2.434-.157-2.12 1.1.314 1.26.707 1.732.707 1.968 0 .235-.707 1.81-1.57.865-.865-.944-2.435-4.64-1.728-2.124.706 2.516 2.276 3.38.785 3.774-1.492.394-1.335-.157-1.57-.314-.236-.158 0-1.26-.08-1.888-.078-.63-.235-1.022-.55-1.337-.312-.315-.234-.787-.862-.944-.63-.156-.08-.47-1.1-.47s-1.884-.63-1.648.786c.235 1.415.47.472 1.098 1.81.628 1.336 1.806.392.943 1.336-.864.943-3.14.63-3.69.236-.55-.394-.393.157-1.414-.55-1.022-.71-.707-1.26-1.885-.71-1.178.552-1.57 1.574-2.042 1.18-.47-.393-1.57.55-1.962.08-.392-.472-1.963-.472-2.276 0-.315.472-1.257.393-2.59 1.022-1.336.63-.944.08-2.593 1.416-1.648 1.337-2.59 2.438-3.14 1.573-.55-.866-3.533-2.36-2.355-2.597 1.178-.236 1.728-.708 2.356-.157.63.55 1.65.393 1.806 0 .157-.394.865-.787-.078-1.258-.942-.473-1.02-.158-2.512-.708-1.492-.55 0-.394-2.042-.708-2.04-.315-2.905-.472-3.455-.63-.55-.157-1.336 0-2.12-.078-.786-.08-1.335-.236-2.042-.157-.706.078-1.1-.08-2.04.63-.944.707-1.65 1.022-2.28 1.572-.627.55-2.275 1.65-2.746 2.044-.472.393-2.12 1.652-2.278 2.124-.157.472.157.865-.47 1.18-.63.314-1.257.314-1.728.392-.472.08 0-.707-.472.08-.47.786-.314 3.617.08 3.224.39-.394.156-1.652 1.883-.472 1.728 1.18 2.827 1.022 2.748 2.123-.078 1.1 1.178 1.023 1.335 1.26.157.235.942-.316.942-.316s1.728-1.102 1.728-1.652c0-.55 1.1-1.81 1.1-1.81s-.787-.392-.787-1.18c0-.785.236-1.022.393-1.808.157-.786-.864 0 1.492-1.495 2.355-1.494 2.512-.47 2.512-.47s.314.313-.08.785c-.39.472-1.098 1.73-1.255 1.888-.157.157.707 1.416 1.1 1.416.392 0 1.177-.315 1.648-.237.472.08 1.257-.235 1.492-.078.236.156.785.628.392 1.022-.392.393-1.256.864-1.884.708-.628-.157-1.57-1.26-1.02.314.55 1.573-.08 1.966-.55 1.888-.47-.08-1.492-.865-1.335.314.157 1.18-1.02 1.966-1.256 1.966s-.707-.078-.707-.078-.707-.08-1.1-.08c-.39 0-1.177.394-1.412.71-.236.313-.55.078-.942.078-.392 0 0-.472-.785-.63-.784-.157-1.256-.314-1.727 0-.47.315-1.177.472-1.492.236-.314-.236.158-.787-.47-.47-.63.313-1.1 1.178-1.336 1.257-.235.078.707 0-.235.078-.942.08-1.335.316-1.806.473-.472.157.156 1.1-.708 1.415-.863.316-.235-.392-1.1.316-.863.708-1.02 1.337-1.333 1.415-.316.08-.237.237-.944.316-.706.08-.628.157-1.02.236-.393.078.078.236-.786.078-.864-.157-1.49.158-1.335.473.157.314 3.063 1.18.864 1.1-2.2-.078-1.492.315-1.02.63.47.314.705.63.94.708.237.08.63 1.023.63 1.023s.627-.08.234.472c-.392.55.157.708-.235 1.416-.394.71-.394.237-.708.394-.314.157-.785.708-1.65.236-.863-.472-1.49-.708-2.51-.786-1.022-.08-.316-.236-1.022.314-.707.55-.864 1.18-.785 1.887.08.708.157 1.652-.08 2.124-.234.47-.234.943-.078 1.65.158.71.63 1.024.63 1.024s1.098.157 1.334.236c.236.078.707-.157 1.335.235.63.394 1.257.55 1.65.08.392-.472 1.962-1.023 2.434-1.495.47-.472.784-.63.548-1.1-.235-.473.47-1.653.864-1.89.392-.234 1.256-.47 1.256-.47l.942-1.416s.785-.866 1.178-.787c.392.08 2.59.866 2.434-.157-.157-1.023.157-1.337.392-.944.236.393.864.236.864.236s.314-.157.55.08c.235.234.55 1.258 1.02 1.493.472.236.864.472 1.178.63.314.157.628 0 1.257.55.628.55 1.256.865 1.334 1.1.08.237.63.787.63.787s.548.158.39.473c-.156.314-.94 1.258-1.334 1.415-.392.157-1.413-.158-1.02.157.392.315.942.708 1.177.472.236-.237 1.727-1.81 1.727-1.81s-.078.08 0-.393c.08-.472 0-1.022.393-.787.393.237.628.55.785.237.157-.315.314-.158-.078-.394-.393-.236-1.335-1.573-1.806-1.65-.47-.08-1.65-.867-1.65-.867s-.234-.236-.783-.865c-.55-.628-.707-.47-.864-1.02-.157-.552-.63-1.26.235-1.103.864.158 1.413.708 2.2 1.18.784.472.627.63 1.334 1.1.706.473.785.945 1.334.867.55-.08 1.178.314 1.178 1.022s.157 1.494.314 1.652c.157.158.628.472.785.787.157.314.47 1.1.707 1.415.235.315.47.55.706.944.236.393.314-.08.55.08.235.156.55.077.55-.237 0-.315.078-.866.078-.866s1.1-.313.785-.47c-.315-.158-1.257-1.102-1.18-1.416.08-.315 0-.944.394-.865.392.077.785.785 1.65.156.863-.63 1.883-.944 1.57 0-.315.944.078 1.1 0 2.123-.08 1.022.314.707.863 1.258.55.55.942.63 1.335.787.392.157 1.02.08 1.65.157.627.08 1.02-.236 1.57-.078.548.157 1.805-.08 2.04.078.237.157 1.18-.314 1.257.236.077.55.392-.08.156 1.18-.235 1.258-.55 2.123-.55 2.123-.863 1.653-1.177 2.046-1.57 2.125-.392.08-.628.315-1.334.236-.707-.078-1.57 0-2.59-.235-1.022-.236-2.907.236-3.692-.236-.785-.473-1.884-.08-2.356-.63-.47-.55-1.256-.472-1.57-.787-.314-.314-.47-1.18-.47.08 0 1.258-.708 1.336-.864 1.966-.158.628.235.313-.63.234-.863-.08-1.098.394-2.354-.55-1.257-.944-1.885-.944-2.513-1.337-.628-.394-1.256.707-1.884-.55-.63-1.26-1.493-.237-1.572-1.26-.078-1.022 0-.943.08-1.572.078-.63.94-1.18.55-1.416-.394-.236-.08-.63-.63-.394s-1.334.315-1.962.55c-.63.237 1.413 0-1.65.237-3.06.236-3.925.55-3.925.55s-.235-.157-.628.158c-.392.315-.942.787-1.49.55-.55-.235-.865-.156-1.336-.077-.47.078-.785-.394-1.335 0-.548.392-1.176.55-1.412.392-.236-.16-.63-.788-.63-.788zm52.526 51.752c-.235.865-1.1 2.123-1.1 2.123l-1.57.786s-.548.47-.863.55c-.314.078-1.1.472-1.1.472s-.706-.158-.47.55c.235.708.314 1.573.235 1.81-.078.235-.078.707-.078 1.337 0 .628-.236 1.414-.628 1.57-.393.16-.786.316-.707.867.08.55.08 2.202.08 2.202l1.02 1.572s.314-.236.942-.236c.627 0 1.256-.55 1.256-.55s.707.157.628-.708c-.078-.865.316-1.888.236-2.124-.078-.236.707-1.258.707-1.494s.786-1.337.786-1.73.548-1.023.627-1.494c.078-.473.157-1.573.314-1.888.158-.314.236-.63.236-.944v-.943l-.55-1.73zm61.478 10.617c-.235.314-.392 3.697-.55 4.09-.156.393-.47 2.438-.313 2.91.158.472.393 2.202.237 2.753-.158.55.078 2.28-.315 2.202-.392-.08-.55.08-.55.315 0 .236.55.707.55.707s.943 0 1.335-.078c.393-.08 1.178-.472 1.806-.472.628 0 1.02-.473 1.57-.473s1.728-.39 2.042-.234c.314.156.785-.944 1.335-.708.55.236 1.727-.55 2.277-.55s.785-.866 1.413-.708c.628.157 1.806-.315 2.356-.08.55.237 1.413-.786 1.805 0 .394.787 1.572 1.102 1.572 1.495s-.08 1.26-.08 1.26l.943-.08s1.492-.944 1.728-.944c.235 0 .785-.785.785-.392s-.472 1.26-.628 1.65c-.157.395.156.867.156.867s.786.393.472 1.1c-.314.71.078.552 0 1.102-.08.55 0 .314.313.63.316.314.866.865 1.336.786.472-.08.628-.55 1.02-.315.394.236 1.178.08 1.414.394s-1.49 1.1 1.492-.236c2.984-1.338 3.297-1.652 3.69-2.124.394-.472.865-.944 1.178-1.26.314-.313.08-.235 1.02-.943.943-.708.943-.394 1.807-1.73.864-1.338 1.49-1.81 1.65-2.046.156-.236.47-.314.548-1.26.08-.942.707-1.808.707-2.122 0-.314.235-.786.157-1.337-.08-.55.313-1.337-.158-2.123-.47-.787.235-1.1-.47-1.416-.708-.315-1.18-.157-1.336-.708-.157-.55-.786-.472-1.02-1.966-.237-1.494-1.18-1.652-1.18-1.652s-.94-.393-.705-.55c.237-.158.315-1.26.237-1.574-.08-.314-.08-1.022-.314-1.494-.236-.472-.393-1.1-.628-1.652-.236-.55-.628-.708-.786-1.337-.158-.63-.393-.865-.472-1.022-.08-.156-.236-.943-.392-.078-.157.865-.472 2.516-.472 2.516s-.628 1.338-.864 1.73c-.235.394-.47 1.417-.863 1.338-.393-.08-.63.394-.942.314-.315-.08-.786.08-1.02-.157-.236-.236-.865-.865-1.18-.944-.313-.08-.548-.708-.784-.708-.235 0-.627-.55-.55-.866.08-.314.158-1.022.237-1.337.078-.315.55-1.023.55-1.023s0-.472-.393-.472-.47 0-1.335-.08c-.865-.078-1.1-.156-1.415-.156-.313 0 .315-.16-.55.077-.862.237-1.255.866-1.805 1.417-.55.55-.078.392-.55.55-.47.158-.39-.393-.706.472-.314.865.158 1.1-.08 1.258-.234.158-1.883-.55-1.883-.55s.394-.08.08-.472c-.314-.394-.628-.944-1.1-.708-.47.236-.864.394-1.177.787-.314.394-.314.708-.55 1.023-.235.314-.863.314-.942.63-.077.314-.077 1.1-.313 1.18-.235.078-.313-.315-.55-.394-.234-.08-.156-.71-.313-.315-.157.393-.314.314-.55.943-.235.63-.314 1.18-.55 1.26-.235.078 0 .156-.706.55-.706.393-.864.393-1.884.865s-.785.472-1.49.55c-.708.08-.866.315-1.336.394-.472.078-.785.156-1.257.63-.47.47-.862.628-1.176.707-.314.078-.63.393-.63.393zm4.632-31.067c-.313.472-1.334 1.888-1.726 1.967-.393.078-.786.472-1.1.393-.314-.08-1.02 0-1.256 1.022-.236 1.023-.628 1.573-.865 1.494-.236-.078.392 1.494-.942.866-1.335-.63-.864.55-1.02.865-.158.315.234 1.18.313 1.495.08.314.315.865.63 1.336.313.472.55 1.023 1.098.866.55-.158 2.277 0 2.277 0s.63.236 1.02.236c.393 0 .472-.157.707-.157s.707-.787.628-.866c-.078-.08-.313-.314.157-.786.472-.472 1.02-.628 1.1-1.18.078-.55-.157-.55.078-.865.236-.314.785-.235.63-.55-.16-.315.155-.236-.16-.866-.312-.63-.705-.866-.39-1.652.313-.787.628-.944.55-1.416-.08-.472.39-.63-.16-1.18-.548-.55-.784-.708-1.176-.866l-.394-.156zm15.39 7.865c.314-.078 1.413-.865 1.492.55.078 1.417.156 1.023.628 1.81.47.786.784 1.023 1.334.63.55-.394 1.178-.394 1.334-1.102.158-.708.158-.708.63-.708.47 0 .627-.078.863.237.236.314.392 0 1.413.55 1.02.55 1.884.393 2.513.944.628.55.942.472 1.806.786.863.315.47-.157 1.255.708.786.865.472 1.1.864 1.494.39.394.706-.314.548.63-.157.943-1.256 0 .393 1.336 1.65 1.338 1.886 1.574 2.435 1.967.55.393.942.865.472.865-.472 0-1.964 0-2.12-.236-.158-.236-.864-.394-1.336-.944-.47-.55-1.49-.944-1.725-1.415-.236-.473-.55-.63-.942-.63-.393 0-.785.472-1.335 1.023-.55.55-.314-.314-1.02-.08-.708.237-1.492-.078-1.886-.392-.392-.315-.313-.787-.94-.55-.63.235-1.022.078-.786-.394.235-.472.078-1.1.078-1.1s.236-.788-.313-.945c-.55-.158-.55-.708-1.1-.866-.55-.157-1.412-.55-1.412-.55s-.08 0-.314-.08c-.236-.078-.236-.078-.864-.235-.628-.16-1.1-.002-1.413-.395-.315-.393-.157-.943-.157-.943s1.256.157 0-.787l-1.257-.943s.157-.08.08-.237c-.08-.158.782 0 .782 0zm-35.332-6.528s.392.394 1.02.315c.628-.08 1.1 1.258 1.492 1.73.392.472.628.708 1.492 1.258.863.55.785-.472 1.963 1.18s.63.63 1.178 1.652c.55 1.023.864 1.573 1.178 1.81.314.235.55.864.63 1.1.077.236.626.944.626 1.18s.157.865-.314 1.416c-.47.55-.864.63-.864.63s-.942-.473-1.256-.945c-.314-.472-.706-.865-1.256-1.81-.55-.943-1.178-1.965-1.492-2.437-.314-.472-.785-.944-1.02-1.416-.236-.472-.864-1.888-1.178-2.045-.314-.158-.393-.63-.943-1.18-.55-.55-.472-1.022-.707-1.337-.236-.314-.785-1.023-.785-1.023l.236-.078zM66.93 139.895c-.55-.314-1.728-.865-2.12-1.18-.392-.314-1.57-2.045-1.57-2.045l-.864-1.652s-1.02-1.258-.785-1.73c.236-.472.708-.786.708-1.022s.47-.866.078-1.1c-.393-.237-.393-.316-.628-1.024-.236-.707-.236-1.337-.55-1.494-.314-.157-.55-1.18-.864-1.258-.313-.08-.628-.63-.628-.63l-.47-6.37s-.158-2.91-.315-3.54c-.156-.63.236-1.966-.156-3.146-.393-1.18.08-2.595-.157-3.067-.236-.472.157-1.81-.08-3.067-.234-1.26.943-2.832 0-3.303-.94-.473-.234-1.18-1.02-1.18-.784 0-1.334-.394-2.04-.944-.708-.55-2.043-1.573-2.435-1.967-.392-.393-1.65-1.415-2.04-1.73-.394-.314-.787-1.652-1.1-2.045-.314-.392-.47-1.572-.943-2.28-.472-.707-1.1-1.887-1.257-2.123-.157-.236-1.885-2.28-1.885-2.28l.157-1.26s1.178-.707 1.02-.943c-.156-.236.08-.472-.47-.944-.55-.472-.47-1.337 0-1.73.47-.394 1.177-1.652 1.177-1.652l1.178-1.966s.943-1.023.943-1.73c0-.71 1.334-1.18.55-1.81-.786-.63-.393-1.18-.63-1.652-.235-.47-.078-.786.63-1.258.706-.472 1.962-2.202 1.962-2.202s.942-.236 1.178-.236c.235 0 .628-2.518 1.335-.866.706 1.652.942.787.706 1.966-.235 1.18.314.944.628.63.314-.315-.157.236.47-1.18.63-1.416.394-1.888.786-1.494.393.393.55.472 1.257.708.706.236.942.157 1.177.63.235.47.157-.16 1.492.078 1.334.236 3.22-.472 2.983.314-.235.786-.706-.08.393.786 1.1.866 1.256 1.023 1.884 1.18.628.158 1.178.08 2.12 1.023.943.942 1.178 1.02 1.413 1.493.236.472.628.157 1.02.63.394.47.943.47 1.493.47.55 0 0-.47.863.16.865.628 1.492.706 1.885 1.965.392 1.26 1.178 1.18.55 2.438-.63 1.26-1.885 1.81-1.335 1.73.55-.078 1.57-.55 1.884-.47.314.077.47-.237.942 0 .47.234.55-.316.47.234-.078.55-.078 0-.078.55 0 .552-.157-.55.785-.313.942.236.392-.473 1.492.55 1.098 1.023 1.098.708 1.49 1.26.393.55.785-.315 1.02-.08.237.236.943.078 1.65.236.707.157.236-.472 1.335.236 1.1.706 2.198.47 2.434 1.1.234.63.863.393 1.177.786.313.394.47-.157.785.394.314.55 1.256.393 1.1.943-.158.55.234.236.077 1.022-.158.788-.708 2.046-1.178 2.36-.472.315-.47.708-.785 1.1-.314.395-.236-.392-.63.71-.39 1.1-.313 1.258-.627 2.28-.314 1.022-.078 0-.314 1.022-.235 1.023-.078 1.652-.314 2.832-.235 1.18-.156 1.18-.313 2.044-.158.865.39-.393-.316 1.416-.706 1.81-.785 1.73-1.02 2.517-.236.787.078.157-.785.63-.865.47-.394.313-1.415.628-1.02.315-2.277.63-2.67.708-.39.08-1.962.55-1.49 1.494.47.944.47 1.1 0 2.282-.472 1.178-1.178 1.572-1.178 2.122 0 .55-.315 1.1-.393 1.494-.08.393.707-.394-.235.786-.943 1.18-1.022.866-1.336 1.574-.314.707 0 .156-.314.707-.314.55-1.1.786-1.1.786s.08.393-.235.236c-.314-.157-.236.078-1.414-.237-1.176-.315-1.333-1.1-1.49-.55-.157.55.078.865.785 1.415.706.55 1.884.708 1.57 1.26-.314.55-.314.55-.55.864-.235.314.315.077-.235.314-.55.235-.864 1.258-1.1 1.258-.235 0-.392.393-.706.236-.314-.157-1.1-.708-1.256-.393-.157.314-.47-.394-.393.707.08 1.1.236 1.73-.157 1.967-.392.235-1.335 0-1.335 0l-.157-.395-.55.158s-.235.944.158 1.1c.392.158.314.315.706.787.393.472.157 1.337.157 1.337s0 .236-.392.63c-.392.393-.55.708-.628.943-.08.236-.55 1.26.157 1.18.706-.08 1.256-.472 1.256.787 0 1.258.314.944-.078 1.81-.393.864-.707.942-.786 1.73-.078.785.08.864.236 1.336.157.472.55.236.157.472-.392.236-1.57 0-1.57 0zM46.672 75.873l-.55-.786s-.234-.473-.627-.55c-.393-.08-1.257-1.102-1.257-1.102s-.392-.314-.392-.865c0-.55-.314-1.415-.08-2.36.237-.943.315-2.123.237-2.438-.08-.314.392-.393-.157-.707-.55-.315-1.65-.394-2.356-.394s-1.57.238-1.727.316c-.157.08.863-2.36 1.02-2.753.157-.393.864-2.123.864-2.36 0-.235.236-.314-.235-.628-.47-.315-1.256-.472-1.728-.236-.47.235-.392-.316-.785.628s-.786 1.966-1.257 2.124c-.47.157-1.413.63-1.413.63s-1.178-.08-1.57-.158c-.393-.08-2.042-.944-2.356-1.494-.314-.55-.47-1.73-.47-2.28 0-.552.862-2.203.784-2.597-.078-.393.864-1.966.785-2.202-.08-.235.157-1.022.393-1.336.235-.315 1.413-.708 1.727-1.023.314-.313.864-.706 1.413-.864.55-.157 1.02-.314 1.414-.314.392 0 1.413-.865 1.57 0 .157.865.864.55 1.256.63.393.078.472.47 1.1-.552.628-1.022 1.256-1.337 1.256-1.1 0 .235 1.02-.08 1.177.157.156.235.47-.158 1.02.314.55.473 1.335.552 1.256.787-.078.236.314.236.314.472 0 .235.314-.55.314.864 0 1.416.393 2.28.393 2.28s.55 1.18.785.945c.235-.237.706-.866.706-.866s.785-.472.236-2.124c-.55-1.65-.157-2.123-.314-2.674-.157-.55-.157-.865.785-1.573.942-.708 3.22-2.28 3.77-2.595.548-.315 1.804-1.18 1.804-1.18s.47-.236.55-.865c.077-.63 1.57-1.73 1.648-2.045.08-.314 1.1-1.1 1.1-1.1s1.098-.63 1.02-1.023c-.08-.393 1.413-1.1 1.65-1.1.234 0 1.49.392 1.49-.316 0-.71 0-.866.786-1.495.785-.63 1.805-1.573 2.198-1.573s1.727-.708 2.277-.865c.55-.158 2.276-.944.706 0-1.57.943-.55.393-.864 1.18-.314.786-.55 1.808.942.628 1.492-1.18 1.413-1.415 1.963-1.494.55-.077.157.237 1.335-.156s1.256-.55 1.256-.55.55-.473.236-.708c-.314-.237.314-.55-.864-.08-1.178.473-1.1.55-1.885.315-.784-.235-1.962-.156-1.1-.943.865-.786 1.964-1.022 1.257-1.337-.706-.314-2.512.08-2.747.157-.236.08-.786-.078-1.257 0-.47.08-.314-.628 0-.786.315-.156 1.335-.63 2.59-.943 1.257-.315 4.32-.393 5.026-.393.707 0 1.65.157 2.2-.236.548-.393 1.648-1.022 1.805-1.337.156-.314.784-.785.784-.785s.706-.708.314-1.023c-.393-.314-.786-1.022-1.1-.865-.313.157-.078 1.1-.706.078s-.55-1.18-.864-1.415c-.314-.236-.628-.08-.392-1.18.235-1.1.157-1.573.157-1.573s.235-.943 0-1.022c-.236-.08-.392-.314-.785-.08-.393.237-2.59 1.338-3.062 1.574-.47.235-1.1-.945-.864-1.495.236-.55.078-.236-.235-1.022-.314-.787-1.57-.945-2.042-.945-.47 0-1.57-.708-1.884-.235-.313.47-1.962 1.965-2.276 2.123-.314.158-.785-1.337-1.02 1.1-.237 2.44.863 3.147-.393 3.305-1.255.158-2.355.865-2.355.865s-1.02.08-1.02.708c0 .63-.393 2.124-.864 2.28-.47.16-1.648-.077-2.04-.55-.393-.47.078-2.2.078-2.2l.707-.71s-5.025-.785-4.947-1.1c.08-.315-1.492-.865-1.65-1.337-.156-.472-.235-1.495-.077-1.888.158-.393 2.278-2.28 3.377-2.674 1.1-.393 2.983-1.258 3.533-1.416.55-.157 1.492-.078 1.806-.47.314-.395.392-1.102.392-1.102s-.157-1.102.157-.945c.314.16.864.395.943.63.078.237.078.787.628.158.55-.63 1.256-.866 1.884-1.18.628-.315 1.57-.236 2.12-.55.55-.315 1.492-.63 1.57-1.416.08-.786-.235-.55-.628-.63-.392-.078.157.08-1.177.71-1.335.628-.943.156-1.885.628-.942.472-1.02.55-1.1.157-.078-.393.158-1.022.158-1.022s.08-.08-.47-.236c-.55-.158-.55.078-.63-.63-.078-.708.393-1.73-.392-1.416-.785.315-1.49-.236-2.04 1.337-.55 1.574-2.435 3.226-2.906 2.832-.47-.393-.55-.472-.943-.472-.392 0-.942-.47-1.648-.55-.708-.08-2.828-.08-3.377 0-.55.08-1.178-.315-1.65.158-.47.47-1.177 1.1-1.177 1.337 0 .236-.707-.866-.942-.787-.236.08-.864-.314-1.57-.314-.707 0-1.178-.394-1.413-.394-.235 0 .236-.63 0-.708-.235-.078-5.34-.235-5.34-.235s-1.648-.63-2.276-.55c-.628.078-2.355.156-3.69.392-1.335.235-3.298 1.022-3.926 1.1-.628.08-2.04.08-2.277-.314-.235-.393.08-.315-.235-.393-.314-.08-.078-.236-.784-.787-.706-.55.315-1.022-1.1-1.022-1.412 0-2.275-.08-3.532 0-1.256.08-3.847.708-4.16.63-.315-.08-2.827.392-3.22.157-.393-.236-2.356.865-2.748.787-.392-.08-1.884.08-2.277.315-.393.236-2.277.707-1.65 1.1.63.394.55.787.63 1.023.078.236-.63.786-.63.786s-.156 0-1.02-.313c-.863-.315-1.805-.472-2.198-.236-.393.237-1.1.71-.942 1.024.157.314 1.256 1.022 1.413.786.157-.236.55-.708 1.02-.63.472.08 1.18-.313.55.473-.628.786-1.177 1.18-1.57 1.26-.392.077-1.334.156-2.198.235-.864.08-.786-.315-1.57.472-.786.786-1.1.314-1.257 1.18-.156.864-.313.864 0 1.1.315.236-.627.315.08.55.706.237 1.57.473 1.49.71-.078.235.787-.316.315.313-.47.63-.785 1.18.157.55.942-.628 1.492-.157 2.277-.55.784-.393 1.57-.472 2.04-.786.472-.315.707-.786 1.414-1.023.707-.236.235.08.314.472.078.393 0 .472.47.157.472-.315.472-.078 1.1-.472.628-.392 1.335-.785 1.806-.55.47.237.628.237.942.237.314 0-.392-.08.314 0 .707.078-.314-.236 2.042.314 2.355.552 2.984.158 3.14 1.024.158.865.472-.08.864.47.392.552.628.08.864 1.024.235.944 0 3.54-.157 3.854-.157.314-.236.314-.157 1.022.078.708 1.02 4.09.706 4.326-.313.235-1.02.314-1.02.314L18.8 34.19s-.63 1.18-1.178 1.81c-.55.628-1.256 1.415-1.65 1.965-.392.55-.706 1.495-1.255 2.045-.55.55-1.02.314-.864 1.494.157 1.18 0 2.438.157 3.304.157.865.55 2.045.864 2.517.314.47.55.47 1.1.865.55.393 1.255.865 1.176 1.258-.078.393.08 2.832.08 2.832s.47.786.548 1.65c.08.867.63 1.732.63 1.732l.47 1.023s.235.08.55.707c.314.63.314.63.392.944.08.315.08.236.08.315 0 .08-.08-1.336-.237-1.73-.157-.393-.157-.865-.314-1.337-.158-.472.078-1.023-.393-1.73-.47-.708-.47-.787-.707-1.495-.235-.707-.55-1.494-.235-1.652.314-.156.55-1.18 1.177 0 .628 1.18.707.866.786 1.81.078.944.314 1.26.55 1.65.235.394.784 1.732 1.098 2.282.314.55 0-.314.707.787.706 1.1.785 1.337 1.178 2.202.393.865.63.865.864 1.494.236.63.08.473-.078 1.18-.157.708.157 1.495.157 1.495s1.1.393 1.177.63c.08.235 1.178.628 1.335.943.157.315 1.178.708 1.178.708s.864.55 1.177.707c.314.158 1.257.315 1.257.315s.628.158.863.236c.236.08.943.08.943.08s.628-.473.863-.316c.236.157.785-.315 1.02.08.236.392.708.392.943.707.235.314.47.314.863.707.393.394.785.315 1.177.63.393.314.707.314 1.178.314.47 0 .47 0 .785.08.314.078.47-.237.785.157.314.393.55.628.785 1.022.236.393.785.393.864 1.022.078.63.235.55.235 1.1 0 .552.314.788.55.945.235.157 1.1.943 1.1.943l1.177.237.94.708 1.022.313zM71.837 2.806l4.71-.59s1.65 0 2.474-.59c.825-.59 0-.59 2.474-1.06 2.474-.473 1.767-.71 3.063-.473 1.295.236 1.648.236 3.062.472C89.03.8 89.384.447 90.68.8c1.296.354 1.885.236 2.945.236h3.297c1.65 0 3.18-.943 3.77-.354.588.59.94.354 2.944.59 2.002.236 2.826-.236 3.65 0 .825.236 2.24-.118 3.887 0 1.65.118 2.474-.118 3.062-.118.59 0 1.178-.826 2.002-.118.825.708 1.885-.236 2.002.708.117.944 1.648.236.117.944-1.53.708-1.295.59-2.355 1.534-1.06.944.706 1.77-1.53 2.595-2.24.826-2.593-.472-3.18.944-.59 1.417 0 1.77-.12 2.48-.117.706-.352.824-1.06 1.414-.706.59-.706 0-2.354.354-1.65.354-2.827.708-3.533.708-.707 0-2.238.59-2.71.826-.47.236.825.59-1.648 1.298-2.474.708-3.063.59-3.77 1.533-.706.944-.47 1.063-.94 1.652-.473.59-1.886 2.95-2.592 2.36-.707-.59-1.06-.472-1.65-1.062-.588-.59-.942-1.415-1.295-1.887s-.47-1.652-.59-2.36c-.116-.708-1.177-2.36 0-2.124 1.18.236 1.886.118 2.24-.117.352-.237.706-1.062.706-1.062s-.118-1.298-.472-2.006c-.353-.708-.117-1.298-.706-2.005-.59-.708-.59-.59-1.413-1.298-.825-.708-.59-1.062-1.885-1.18-1.295-.118-1.65-.472-2.12-.354-.47.118-2.002-.826-.353-.944 1.65-.118 3.18.118 3.18.118s2.12-.944 1.413-1.062c-.706-.118 1.06-1.18-.59-.826-1.648.354-3.532.826-4.003.944-.47.118-1.65.236-2.827.59s-2.59.236-3.297 1.062c-.707.826 0 .944-.707.826-.706-.118.59-.826-1.06 0s-1.177.708-2.002.472c-.824-.236-1.413-.59-1.413-.59s1.06-.118-.47-.236-1.53-.118-2.12-.826c-.59-.708-.235-.708.118-.944s.59-.708.59-.708zm-2.59 5.31c-.59.59-2.004 1.415-1.65 1.77.354.353.59 1.65 1.296 1.296.706-.353-.118-1.533 2.59-.59 2.71.944 2.474-.117 3.063 1.298.588 1.416 1.06 2.478.706 2.832-.353.354-.47.708-1.65 1.062-1.177.354-1.648.826-.823 1.415.823.59 2.354 1.18 3.06 1.533.708.354 2.827.472 1.767-.707-1.06-1.18.236-1.534.236-1.534s2.002 1.534 1.296-.236c-.708-1.77-1.18-1.77-.708-1.77.47 0 1.413.59 1.413.59l.47-.944-.47-1.533-1.53-1.535s1.294-1.18-.472-1.415c-1.767-.236-1.65-.236-2.59-.827-.944-.59-1.06-.825-2.828-.47-1.766.353-2.355.59-2.355.59l-.824-.828zM42.982 9.53c.706-.707 2.59-2.36 3.297-1.887.707.472 1.767-.354 2.59.354.825.708 1.768 1.534 2.474 1.77.707.235 1.53-.59 2.238-.236.707.355 3.18-1.77 2.71-.117-.472 1.652.588 2.123-.708 2.242-1.295.118-2.71 1.06-3.298.708-.59-.354-1.06-.708-2.002-.236-.942.47-.47.47-1.53.236-1.06-.236-1.296.235-1.532-.12-.236-.352-.942-.234-.824-1.296.117-1.062.47-.944-.236-.944-.707 0-1.295.118-1.767-.236-.47-.354-1.412-.236-1.412-.236zm351.8 36.377l-1.178 1.573-.785.786-1.57.865-.236.71s-.628.63-.55 1.022c.08.393.08 1.1.08 1.1s-1.1 1.024-1.57 1.338c-.473.314-1.1 1.022-1.1 1.022s-.393.473-.63.63c-.234.157-.627.63-.94 1.1-.315.473-.63.787-.786 1.023-.157.236-.628.786-.864 1.652-.235.865-.864 1.887-.864 1.887l-.157.393c.08 1.338.08 1.574.236 2.046.156.47.313.314.156 1.337-.157 1.022-.157 1.415-.314 1.887s-.628 1.337-.785 1.73c-.157.394.314 1.1.314 1.1s.237 1.024.08 1.26c-.157.236.078.708.078.708s.942.55 1.257.865c.313.315.863.787.942 1.023.08.236.706 1.337.785 1.573.078.236.707 1.1.864 1.337.157.236.942 1.1.942 1.1s1.02.787 1.256 1.102c.236.314.943.472 1.178.707.235.236.785.157 1.1.394.313.236.94-.158 1.255 0 .314.157 1.178-.157 1.414-.315.236-.156.786-.706 1.178-.47.393.235.628 0 .943.078.314.08.786-.314 1.1-.314.314 0 1.1-.315 1.334-.315.236 0 1.02-.474 1.335-.474.313 0 .706-.313 1.098-.156.393.156.236-.315.942-.08.707.236.943 0 1.178.236.236.237.55 0 .786.316.235.314.628.55.706.865.078.314.55.63.55.63l.47.077s.63-.47.786-.156c.157.314.864.236.864.236l.706.786.236.315s.47 1.258.392 1.73c-.078.472-.078 1.494-.314 1.73-.235.236-.392 1.26-.392 1.26s-.314.313.392.942c.707.63 1.178 1.18 1.414 1.494.236.316.864 1.182.942 1.732.08.55.236.865.55 1.573.314.708.706.786.785 1.573.08.787.236.787.158 1.337-.08.55-.314.63-.08 1.022.237.394.55 1.102.472 1.338-.078.235-.235 1.258-.235 1.258l-.157.472-.707 1.338-.47.707c-.157.55-.47 1.1-.392 1.887.078.787-.393.787.235 1.573.628.787.942 1.652 1.335 2.36.392.708.628 1.416.706 1.887.08.472.393.63.55 1.26.156.628.235.942.235 1.336 0 .393-.08 1.416.078 1.652.157.236.236.944.314 1.258.08.315-.236.394.236.944.47.55.785.865 1.1 1.26.313.392.234.235.47.785.235.55.55.866.628 1.337.08.47.157 1.65.393 2.2.234.552.548 1.103.548 1.103s.864.55 1.178.472c.314-.08.942-.786 1.414-.55.47.235.863 0 1.256 0 .392 0 .785-.473 1.178-.473.392 0 .942-.63 1.256-.472.314.157.706-.158 1.1-.55.392-.393.627-.708 1.334-1.337.706-.63.628-.63 1.1-1.023.47-.393.94-1.26 1.49-1.416.55-.157.707-.707.864-1.1.157-.394.236-.63.47-.945.237-.315.08.08.473-.944.393-1.023.865-1.416 1.258-1.652.392-.236.627-.708.863-.787.236-.08.63.236.472-.472-.156-.707 0-1.73-.156-1.966-.158-.237-.394.55-.315-.63.08-1.18.943-2.36.943-2.36s1.178-1.494 1.57-1.73c.394-.236.472-.472 1.022-.787.55-.314 1.727-1.1 1.727-1.494 0-.394.47-1.417.47-1.653s0-.472-.155-1.81c-.158-1.336.156-1.02-.315-2.28-.47-1.258-.55-2.83-.863-3.224-.316-.394-.16-1.417-.16-1.73 0-.315.55-1.102.787-1.416.235-.315 1.256-1.574 1.256-1.574s1.57-1.808 2.12-2.673c.55-.866 1.1-1.652 1.49-1.966.394-.315 1.336-1.024 1.886-1.81.55-.786 1.648-2.28 1.727-2.517.078-.235.706-1.022.706-1.022s.863-1.023 1.02-1.573c.157-.55.942-3.618.785-3.46-.156.157-1.1.314-1.413.392-.314.08.472.393-1.806.237-2.277-.157-3.455.236-3.455.236-.707-.157-1.256.63-1.492-.472-.236-1.1-.393-1.73-.864-2.516-.472-.787-.786-1.1-1.492-2.124-.707-1.022-.63-.55-1.257-1.337-.627-.786-.784-.55-1.177-1.573-.392-1.022-.706-.63-1.177-2.045-.472-1.417-.786-1.574-1.02-2.36-.237-.787-.55-1.023-.708-1.73-.157-.71-1.962-4.327-2.198-4.563-.236-.235-.628-1.494-.55-1.258.08.235 1.178 1.02 1.178 1.02s.628-.235.864-.235c.235 0 1.177.866 1.177 1.18 0 .315 1.65 1.81 2.04 2.91.394 1.1.866 1.888.943 2.202.078.315.864 1.574 1.178 2.046.315.472 1.336 1.415 1.493 1.887.157.472 1.65 2.045 1.65 3.068 0 1.022.705 2.36.784 2.673.08.316 1.49.71 1.49.71l1.886-.472s2.826-1.81 3.14-1.81c.314 0 2.828-1.18 2.828-1.18s1.02-.943 1.727-1.493c.707-.55 1.492-1.573 1.65-2.045.156-.473.47-.55 1.098-1.26.63-.707 1.492-1.415.943-1.887-.55-.47-.864-.314-1.65-1.1-.784-.787-.706-.63-1.255-1.653-.55-1.022.078-2.202-1.1-1.022-1.177 1.18-.706 1.495-1.884 1.73-1.18.237-1.65 1.023-2.2.237-.55-.787-1.1-.315-1.413-1.495-.314-1.18-.55-1.26-.628-1.73-.08-.472 0-.472-.63-1.652-.627-1.18-.156-2.99.236-1.966.393 1.022 1.02 1.18 2.042 1.887 1.02.707 1.492 1.258 2.434 1.337.942.078 1.727 0 1.884.156.157.158.314-.078.707.08.393.157.55-.236.706.392.156.63 1.02.708 1.412 1.1.393.394.393.237 1.414.394 1.02.157 2.435.157 2.435.157l1.492-.08 1.727.158s1.256.708 1.57.708c.314 0 .392.865 1.177 1.337.786.472.943.55 1.414 1.1.473.552.393.788 1.02 1.338.63.55 1.65-.078 1.808-.314.156-.236.94-.63.785 0-.157.63.785.393.55 1.888-.236 1.494-.394 1.1 0 2.123.392 1.023 2.12 4.17 2.198 5.113.08.943.55.63.63 1.495.078.864.548 1.18.548 1.808 0 .63.55.787.628 1.26.08.472.943.078 1.178 0 .236-.08 1.335-1.102 1.335-1.102s.47-.156.392-.943c-.08-.786 0-.63 0-1.81 0-1.18-.47-1.18-.236-2.358.236-1.18.864-1.888 1.02-2.438.158-.552.786-1.496 1.1-1.575.314-.078 2.042-.943 2.434-1.494.393-.55 1.02-1.18 1.65-1.808.627-.63 1.726-1.415 1.962-1.18.236.236.157.158.55.158.392 0 1.1.315 1.648.393.55.08 1.65 1.416 1.885 2.124.236.708.08.55.942 1.573.864 1.022 1.65.393 1.65 1.65 0 1.26 0 1.18.392 1.653.392.472.862-.865 1.333-.707.47.157.55-.158.942 1.1.393 1.26.628 1.26.707 2.518.078 1.258-.078.078-.078 1.1 0 1.023-.08 1.102.078 2.045.157.944.706 1.258.628 1.415 0 0 .47-1.337.314-2.28-.156-.944 0-2.28.393-2.674.392-.393.785-.786 1.1.237.313 1.022.47.236 1.176 1.415.708 1.18 1.335.944 1.414 1.494.078.55.472.63 1.02 1.1.55.474 1.02-.077 1.65-.55.628-.47 2.355-2.2 2.434-2.91.08-.707.786-.55-.47-2.358-1.257-1.81-1.257-2.44-2.592-3.54-1.334-1.1-2.12-1.18-1.098-2.595 1.02-1.416 1.492-2.36 2.12-1.966.628.393 1.726.314 1.726 1.887s-.314 3.304.786 1.416 1.65-2.99 1.334-2.674c-.313.315.707-.63.707-.63s.08-.707 1.414-1.02c1.334-.317 1.727-.473 2.198-.71.47-.236 1.806-1.81 2.042-2.516.235-.708.863-1.967.706-2.517-.157-.55-.942-3.224-1.1-3.146-.156.08-.077.08-1.098-1.022-1.02-1.1-1.728-1.888-1.884-2.36-.156-.472-.55-.55-.078-1.18.47-.63.707-.55.785-1.1.078-.55.706-1.023-.47-.63-1.18.393-.315.158-1.336.08-1.02-.08-3.69.55-2.354-1.102 1.334-1.652 1.726-2.674 1.962-2.674s1.414-1.338 1.492-.08c.08 1.26.55.944.628 1.73.08.787 1.65-.864 1.65-.864s.55.157.94.55c.394.393.394 1.652.394 1.652s-.314-.394.55.236c.864.63 1.805.314 1.805 1.65 0 1.338 0 1.417.55 1.732.55.314 1.1.157 1.57-.236.472-.393 1.257-1.81 1.257-1.81s.078-.55-1.178-1.336c-1.256-.787-2.04-1.337-2.512-1.73-.472-.394-.314-1.573.156-2.046.472-.472.707-.708.55-1.337-.157-.628.236-1.1 1.414-1.02 1.177.078 1.413-.08 1.413-.08s.236.157.236-.315c0-.47 1.49-2.674 1.098-2.674-.39 0 .08-.55-.156-1.414-.235-.866.786-2.202-.078-2.832-.864-.63-1.1-.944-1.65-1.887-.548-.945-.47-1.1-2.51-1.338-2.043-.237-2.985.47-3.456-.158-.47-.63-.707.944-1.02-.944-.314-1.887.47-3.146.47-3.146s1.257-.786 1.57-1.337c.314-.55 1.57-.787 2.592-.393 1.02.393 2.512.314 3.77.55 1.255.236 1.177 1.023 1.805 0 .628-1.022 0-1.494.47-2.044.473-.55 1.022-1.416 1.414-.866.393.55 1.18 1.1 1.808.393.628-.707.863-.786.863-.786l.315.314s.706-.394.706.314.708 1.495.316 2.045c-.394.55-.942.472-.942 1.81 0 1.337 0 1.1.863 2.202.864 1.1 1.413.157 1.57 1.337.158 1.18.314.944 1.178 1.73.864.786.706.786 1.335 1.258.628.472.942.945.942.158 0-.787.08-1.18 0-1.888-.08-.707.63-1.258.157-2.438-.472-1.18-.08-1.1-1.022-1.966-.942-.865-1.57.157-1.884-1.1-.314-1.26 1.492-1.81 1.963-1.968.47-.156 1.177-1.1 1.334-.47.158.628-1.176 2.91 1.1.47 2.277-2.438 1.257-1.415 1.257-1.415s1.178-.157 1.413 0c.235.157.865-.708.628-.63-.235.08-2.51-1.258-2.51-1.258l-1.65-.943s.55-.394.94-.315c.394.08.473-.786.866-.865.392-.08 3.062.55 3.612.865.55.315 2.512.393 2.276.236-.236-.157-1.49-1.1-1.57-1.416-.078-.314-2.827-.944-3.69-.865-.864.078-1.65.314-2.356.078-.707-.236-1.727-.865-2.277-.865s-7.46-1.337-7.773-1.258c-.314.078-.786 1.573-1.02 1.337-.237-.236-.63-.236-1.73-.55-1.098-.315-2.59-.552-4.553-.71-1.963-.156-3.297.16-3.847-.47-.55-.63-1.727-.394-3.062-.473-1.334-.077-2.905 0-3.612 0-.706 0-2.355-.077-2.747-.156-.393-.08-.864-.63-1.335-.708-.47-.08-.392-.235-1.334-.393-.942-.157-.864-1.18-1.178-.315-.314.866-.157.63-.628.944-.47.315-.942.944-1.256.944-.314 0-1.57.08-1.806-.08-.236-.156-.63-.313-1.414-.313-.785 0-.785.078-1.806-.08-1.02-.156-1.806-.078-2.748-.55-.942-.47-.942-.786-1.727-.707-.785.08-.785-.158-1.885-.158-1.098 0-2.433.63-3.14.708-.706.08-2.277-.08-2.826-.314-.55-.236-.707-.787-2.75-.55-2.04.235-3.218.235-2.825-.394.392-.63.863-1.26 1.1-1.337.235-.078.784-.47.39-.628-.39-.158-.784-.393-1.726-.472-.94-.08-.863.314-2.276.157-1.413-.157.785-.55-2.12-.472-2.905.08-3.61.315-3.925.315-.316 0-.708-.63-1.493.314-.786.944-1.885 1.494-3.455 1.573-1.57.08-1.65-.157-3.14.393-1.492.55-2.435-.157-2.12 1.1.313 1.26.706 1.732.706 1.968 0 .235-.707 1.81-1.57.865-.864-.944-2.434-4.64-1.728-2.124.707 2.516 2.277 3.38.786 3.774-1.492.394-1.336-.157-1.57-.314-.236-.158 0-1.26-.08-1.888-.08-.63-.235-1.022-.55-1.337-.313-.315-.235-.787-.863-.944-.628-.156-.078-.47-1.1-.47-1.02 0-1.883-.63-1.648.786.236 1.415.47.472 1.1 1.81.627 1.336 1.805.392.94 1.336-.862.943-3.14.63-3.69.236-.55-.394-.39.157-1.413-.55-1.02-.71-.706-1.26-1.883-.71-1.18.552-1.572 1.574-2.043 1.18-.47-.393-1.57.55-1.963.08-.393-.472-1.963-.472-2.277 0-.314.472-1.256.393-2.59 1.022-1.336.63-.943.08-2.592 1.416-1.65 1.337-2.592 2.438-3.14 1.573-.55-.866-3.534-2.36-2.356-2.597 1.177-.236 1.726-.708 2.354-.157.63.55 1.65.393 1.806 0 .157-.394.864-.787-.08-1.258-.94-.473-1.02-.158-2.51-.708-1.493-.55 0-.394-2.043-.708-2.04-.315-2.905-.472-3.454-.63-.55-.157-1.335 0-2.12-.078-.785-.08-1.335-.236-2.042-.157-.705.078-1.097-.08-2.04.63-.943.707-1.65 1.022-2.277 1.572-.628.55-2.277 1.65-2.748 2.044-.47.393-2.12 1.652-2.277 2.124-.157.472.157.865-.47 1.18-.63.314-1.257.314-1.73.392-.47.08 0-.707-.47.08-.47.786-.314 3.617.078 3.224.393-.394.157-1.652 1.885-.472s2.828 1.022 2.75 2.123c-.08 1.1 1.177 1.023 1.334 1.26.157.235.942-.316.942-.316s1.727-1.102 1.727-1.652c0-.55 1.1-1.81 1.1-1.81s-.786-.392-.786-1.18c0-.785.236-1.022.393-1.808.157-.786-.864 0 1.492-1.495 2.355-1.494 2.512-.47 2.512-.47s.313.313-.08.785c-.39.472-1.098 1.73-1.255 1.888-.158.157.706 1.416 1.098 1.416.392 0 1.178-.315 1.65-.237.47.08 1.255-.235 1.49-.078.236.156.786.628.393 1.022-.39.393-1.255.864-1.883.708-.63-.157-1.57-1.26-1.02.314.55 1.573-.08 1.966-.55 1.888-.47-.08-1.492-.865-1.335.314.157 1.18-1.02 1.966-1.257 1.966-.235 0-.706-.078-.706-.078s-.708-.08-1.1-.08c-.393 0-1.178.394-1.414.71-.235.313-.55.078-.942.078-.392 0 0-.472-.785-.63-.786-.157-1.257-.314-1.728 0-.47.315-1.178.472-1.492.236-.314-.236.157-.787-.47-.47-.63.313-1.1 1.178-1.336 1.257-.235.078.707 0-.235.078-.944.08-1.336.316-1.807.473-.472.157.157 1.1-.707 1.415-.864.316-.235-.392-1.1.316-.863.708-1.02 1.337-1.334 1.415-.314.08-.235.237-.942.316-.707.08-.628.157-1.02.236-.394.078.078.236-.786.078-.864-.157-1.492.158-1.335.473.156.314 3.06 1.18.863 1.1-2.2-.078-1.492.315-1.02.63.47.314.705.63.94.708.237.08.63 1.023.63 1.023s.627-.08.235.472c-.392.55.157.708-.236 1.416-.392.71-.392.237-.706.394-.314.157-.785.708-1.65.236-.863-.472-1.49-.708-2.512-.786-1.02-.08-.314-.236-1.02.314-.707.55-.864 1.18-.785 1.887.077.708.156 1.652-.08 2.124-.236.47-.236.943-.08 1.65.158.71.63 1.024.63 1.024s1.1.157 1.334.236c.236.078.707-.157 1.335.235.627.394 1.255.55 1.648.08.392-.472 1.963-1.023 2.434-1.495.47-.472.785-.63.55-1.1-.236-.473.47-1.653.863-1.89.393-.234 1.257-.47 1.257-.47l.942-1.416s.785-.866 1.177-.787c.394.08 2.592.866 2.436-.157-.157-1.023.156-1.337.392-.944.235.393.864.236.864.236s.314-.157.55.08c.235.234.548 1.258 1.02 1.493.47.236.863.472 1.178.63.314.157.628 0 1.256.55s1.256.865 1.335 1.1c.08.237.63.787.63.787s.55.158.392.473c-.157.314-.942 1.258-1.335 1.415-.393.157-1.413-.158-1.02.157.39.315.94.708 1.177.472.236-.237 1.727-1.81 1.727-1.81s-.077.08 0-.393c.08-.472 0-1.022.394-.787.392.237.628.55.785.237.156-.315.313-.158-.08-.394-.393-.236-1.334-1.573-1.806-1.65-.47-.08-1.65-.867-1.65-.867s-.234-.236-.784-.865c-.55-.628-.706-.47-.864-1.02-.157-.552-.628-1.26.236-1.103.864.158 1.413.708 2.198 1.18.785.472.63.63 1.335 1.1.707.473.786.945 1.335.867.55-.08 1.178.314 1.178 1.022s.156 1.494.313 1.652c.16.158.63.472.787.787.157.314.47 1.1.706 1.415.236.315.47.55.707.944.235.393.314-.08.55.08.235.156.55.077.55-.237 0-.315.077-.866.077-.866s1.1-.313.786-.47c-.314-.158-1.257-1.102-1.178-1.416.078-.315 0-.944.392-.865.393.077.786.785 1.65.156.863-.63 1.884-.944 1.57 0-.314.944.08 1.1 0 2.123-.08 1.022.314.707.864 1.258.55.55.943.63 1.335.787.393.157 1.02.08 1.65.157.628.08 1.02-.236 1.57-.078.55.157 1.805-.08 2.04.078.237.157 1.18-.314 1.257.236.08.55.393-.08.158 1.18-.236 1.258-.55 2.123-.55 2.123-.864 1.653-1.178 2.046-1.57 2.125-.393.08-.628.315-1.335.236-.707-.078-1.57 0-2.59-.235-1.022-.236-2.906.236-3.69-.236-.786-.473-1.886-.08-2.357-.63-.47-.55-1.256-.472-1.57-.787-.314-.314-.47-1.18-.47.08 0 1.258-.708 1.336-.865 1.966-.157.628.235.313-.63.234-.862-.08-1.098.394-2.354-.55-1.257-.944-1.885-.944-2.513-1.337-.63-.394-1.257.707-1.885-.55-.628-1.26-1.492-.237-1.57-1.26-.078-1.022 0-.943.078-1.572.08-.63.943-1.18.55-1.416-.393-.236-.08-.63-.628-.394-.55.236-1.335.315-1.963.55-.63.237 1.412 0-1.65.237-3.062.236-3.926.55-3.926.55s-.235-.157-.628.158-.942.787-1.492.55c-.55-.235-.863-.156-1.334-.077-.472.078-.785-.394-1.335 0-.55.392-1.178.55-1.414.392-.235-.16-.627-.788-.627-.788zM447.31 97.66c-.236.865-1.1 2.123-1.1 2.123l-1.57.786s-.55.47-.864.55c-.314.078-1.1.472-1.1.472s-.705-.158-.47.55c.235.708.314 1.573.235 1.81-.077.235-.077.707-.077 1.337 0 .628-.235 1.414-.628 1.57-.392.16-.785.316-.707.867.08.55.08 2.202.08 2.202l1.02 1.572s.314-.236.942-.236c.628 0 1.257-.55 1.257-.55s.707.157.627-.708c-.078-.865.315-1.888.236-2.124-.078-.236.707-1.258.707-1.494s.785-1.337.785-1.73.55-1.023.628-1.494c.08-.473.157-1.573.314-1.888.157-.314.236-.63.236-.944v-.943l-.55-1.73zm61.478 10.617c-.236.314-.393 3.697-.55 4.09-.157.393-.47 2.438-.313 2.91.156.472.392 2.202.235 2.753-.157.55.08 2.28-.315 2.202-.392-.08-.548.08-.548.315 0 .236.548.707.548.707s.943 0 1.336-.078c.393-.08 1.178-.472 1.807-.472.628 0 1.02-.473 1.57-.473s1.728-.39 2.04-.234c.315.156.786-.944 1.336-.708s1.728-.55 2.277-.55c.55 0 .786-.866 1.414-.708.628.157 1.806-.315 2.355-.08.548.237 1.413-.786 1.805 0 .393.787 1.57 1.102 1.57 1.495s-.08 1.26-.08 1.26l.944-.08s1.49-.944 1.726-.944.785-.785.785-.392-.47 1.26-.627 1.65c-.157.395.157.867.157.867s.786.393.47 1.1c-.313.71.08.552 0 1.102-.077.55 0 .314.315.63.314.314.864.865 1.335.786.472-.08.628-.55 1.02-.315.393.236 1.178.08 1.413.394.237.314-1.49 1.1 1.493-.236 2.983-1.338 3.297-1.652 3.69-2.124.393-.472.864-.944 1.177-1.26.315-.313.08-.235 1.02-.943.943-.708.943-.394 1.808-1.73.864-1.338 1.492-1.81 1.65-2.046.157-.236.47-.314.55-1.26.078-.942.705-1.808.705-2.122 0-.314.236-.786.157-1.337-.078-.55.315-1.337-.157-2.123-.47-.787.236-1.1-.47-1.416-.708-.315-1.18-.157-1.336-.708-.158-.55-.786-.472-1.022-1.966-.235-1.494-1.177-1.652-1.177-1.652s-.94-.393-.706-.55c.236-.158.314-1.26.236-1.574-.08-.314-.08-1.022-.314-1.494-.235-.472-.393-1.1-.628-1.652-.235-.55-.628-.708-.785-1.337-.158-.63-.393-.865-.47-1.022-.08-.156-.238-.943-.394-.078-.158.865-.473 2.516-.473 2.516s-.628 1.338-.863 1.73c-.236.394-.47 1.417-.864 1.338-.392-.08-.63.394-.942.314-.314-.08-.785.08-1.02-.157-.236-.236-.864-.865-1.178-.944-.314-.08-.55-.708-.786-.708s-.628-.55-.55-.866c.08-.314.158-1.022.236-1.337.078-.315.55-1.023.55-1.023s0-.472-.393-.472c-.392 0-.47 0-1.335-.08-.863-.078-1.098-.156-1.413-.156-.314 0 .314-.16-.55.077-.864.237-1.257.866-1.806 1.417-.55.55-.08.392-.55.55-.47.158-.392-.393-.706.472-.315.865.157 1.1-.08 1.258-.235.158-1.883-.55-1.883-.55s.392-.08.078-.472c-.314-.394-.628-.944-1.098-.708-.472.236-.865.394-1.178.787-.315.394-.315.708-.55 1.023-.236.314-.864.314-.942.63-.08.314-.08 1.1-.314 1.18-.234.078-.313-.315-.548-.394-.236-.08-.158-.71-.314-.315-.157.393-.314.314-.55.943-.236.63-.314 1.18-.55 1.26-.235.078 0 .156-.707.55-.705.393-.862.393-1.882.865s-.785.472-1.492.55c-.706.08-.864.315-1.335.394-.47.078-.784.156-1.255.63-.47.47-.864.628-1.178.707-.314.078-.63.393-.63.393zm4.632-31.067c-.314.472-1.335 1.888-1.727 1.967-.393.078-.786.472-1.1.393-.313-.08-1.02 0-1.256 1.022-.235 1.023-.628 1.573-.864 1.494-.235-.078.392 1.494-.942.866-1.333-.63-.862.55-1.02.865-.157.315.236 1.18.314 1.495.08.314.314.865.63 1.336.313.472.548 1.023 1.098.866.55-.158 2.276 0 2.276 0s.63.236 1.02.236c.394 0 .473-.157.708-.157s.706-.787.628-.866c-.08-.08-.314-.314.157-.786.472-.472 1.022-.628 1.1-1.18.08-.55-.157-.55.08-.865.234-.314.784-.235.627-.55-.157-.315.157-.236-.157-.866s-.707-.866-.393-1.652c.314-.787.63-.944.55-1.416-.08-.472.393-.63-.157-1.18-.55-.55-.785-.708-1.178-.866l-.392-.156zm15.39 7.865c.314-.078 1.412-.865 1.49.55.08 1.417.157 1.023.63 1.81.47.786.784 1.023 1.333.63.55-.394 1.178-.394 1.335-1.102.157-.708.157-.708.628-.708.472 0 .628-.078.865.237.236.314.392 0 1.414.55 1.02.55 1.884.393 2.513.944.628.55.942.472 1.805.786.864.315.47-.157 1.256.708s.472 1.1.864 1.494c.393.394.707-.314.55.63-.157.943-1.256 0 .393 1.336 1.648 1.338 1.884 1.574 2.433 1.967.55.393.943.865.472.865-.472 0-1.963 0-2.12-.236-.157-.236-.863-.394-1.335-.944-.47-.55-1.49-.944-1.726-1.415-.238-.473-.552-.63-.944-.63-.392 0-.785.472-1.335 1.023-.55.55-.312-.314-1.02-.08-.707.237-1.49-.078-1.884-.392-.393-.315-.314-.787-.942-.55-.628.235-1.02.078-.785-.394.235-.472.077-1.1.077-1.1s.237-.788-.313-.945c-.55-.158-.55-.708-1.1-.866-.55-.157-1.412-.55-1.412-.55s-.08 0-.315-.08c-.235-.078-.235-.078-.863-.235-.628-.16-1.1-.002-1.414-.395-.314-.393-.157-.943-.157-.943s1.256.157 0-.787l-1.256-.943s.156-.08.078-.237c-.08-.158.784 0 .784 0zm-35.333-6.528s.392.394 1.02.315c.63-.08 1.1 1.258 1.493 1.73.392.472.628.708 1.49 1.258.865.55.786-.472 1.964 1.18s.628.63 1.178 1.652c.55 1.023.864 1.573 1.177 1.81.313.235.55.864.628 1.1.078.236.628.944.628 1.18s.157.865-.314 1.416c-.47.55-.864.63-.864.63s-.942-.473-1.256-.945c-.314-.472-.707-.865-1.257-1.81-.55-.943-1.177-1.965-1.49-2.437-.315-.472-.787-.944-1.022-1.416s-.864-1.888-1.178-2.045c-.314-.158-.392-.63-.942-1.18-.55-.55-.47-1.022-.707-1.337-.235-.314-.784-1.023-.784-1.023l.235-.078zm-152.714 61.348c-.55-.314-1.727-.865-2.12-1.18-.392-.314-1.57-2.045-1.57-2.045l-.864-1.652s-1.02-1.258-.785-1.73.706-.786.706-1.022.472-.866.08-1.1c-.393-.237-.393-.316-.63-1.024-.234-.707-.234-1.337-.548-1.494-.315-.157-.55-1.18-.864-1.258-.314-.08-.628-.63-.628-.63l-.472-6.37s-.157-2.91-.313-3.54c-.158-.63.235-1.966-.158-3.146-.392-1.18.08-2.595-.157-3.067-.235-.472.157-1.81-.078-3.067-.236-1.26.942-2.832 0-3.303-.942-.473-.236-1.18-1.02-1.18-.786 0-1.336-.394-2.042-.944-.707-.55-2.042-1.573-2.434-1.967-.393-.393-1.65-1.415-2.042-1.73-.392-.314-.785-1.652-1.1-2.045-.313-.392-.47-1.572-.94-2.28-.472-.707-1.1-1.887-1.258-2.123-.157-.236-1.884-2.28-1.884-2.28l.157-1.26s1.177-.707 1.02-.943c-.157-.236.078-.472-.472-.944-.55-.472-.47-1.337 0-1.73.472-.394 1.178-1.652 1.178-1.652l1.178-1.966s.942-1.023.942-1.73c0-.71 1.335-1.18.55-1.81-.786-.63-.393-1.18-.63-1.652-.234-.47-.077-.786.63-1.258.706-.472 1.962-2.202 1.962-2.202s.943-.236 1.178-.236c.236 0 .628-2.518 1.335-.866.708 1.652.943.787.708 1.966-.236 1.18.314.944.628.63.314-.315-.158.236.47-1.18.63-1.416.393-1.888.786-1.494.392.393.55.472 1.256.708s.942.157 1.177.63c.236.47.158-.16 1.492.078 1.335.236 3.22-.472 2.984.314-.235.786-.706-.08.393.786 1.1.866 1.257 1.023 1.885 1.18.628.158 1.177.08 2.12 1.023.942.942 1.178 1.02 1.413 1.493.236.472.63.157 1.022.63.392.47.942.47 1.49.47.55 0 0-.47.865.16.864.628 1.492.706 1.884 1.965.394 1.26 1.18 1.18.55 2.438-.627 1.26-1.883 1.81-1.334 1.73.55-.078 1.57-.55 1.885-.47.315.077.472-.237.943 0 .47.234.55-.316.47.234-.078.55-.078 0-.078.55 0 .552-.157-.55.785-.313.943.236.393-.473 1.492.55 1.1 1.023 1.1.708 1.492 1.26.392.55.785-.315 1.02-.08.236.236.943.078 1.65.236.706.157.235-.472 1.335.236 1.097.706 2.197.47 2.432 1.1.236.63.864.393 1.178.786.314.394.47-.157.785.394.314.55 1.257.393 1.1.943-.158.55.235.236.078 1.022-.157.788-.707 2.046-1.178 2.36-.47.315-.47.708-.785 1.1-.314.395-.235-.392-.628.71-.393 1.1-.314 1.258-.628 2.28-.314 1.022-.08 0-.314 1.022-.235 1.023-.08 1.652-.314 2.832-.235 1.18-.157 1.18-.314 2.044-.157.865.393-.393-.314 1.416-.707 1.81-.785 1.73-1.02 2.517-.236.787.078.157-.786.63-.863.47-.392.313-1.413.628-1.022.315-2.278.63-2.67.708-.393.08-1.963.55-1.492 1.494.47.944.47 1.1 0 2.282-.47 1.178-1.178 1.572-1.178 2.122 0 .55-.314 1.1-.392 1.494-.08.393.706-.394-.236.786-.942 1.18-1.02.866-1.335 1.574-.314.707 0 .156-.314.707-.314.55-1.1.786-1.1.786s.08.393-.235.236c-.314-.157-.235.078-1.413-.237s-1.335-1.1-1.492-.55c-.157.55.08.865.786 1.415.705.55 1.883.708 1.57 1.26-.315.55-.315.55-.55.864-.237.314.313.077-.237.314-.55.235-.863 1.258-1.1 1.258-.234 0-.392.393-.705.236-.314-.157-1.1-.708-1.257-.393-.156.314-.47-.394-.39.707.077 1.1.234 1.73-.158 1.967-.393.235-1.335 0-1.335 0l-.157-.395-.55.158s-.235.944.157 1.1c.393.158.314.315.707.787.392.472.157 1.337.157 1.337s0 .236-.392.63c-.392.393-.55.708-.628.943-.08.236-.55 1.26.157 1.18.707-.08 1.257-.472 1.257.787 0 1.258.314.944-.08 1.81-.392.864-.706.942-.784 1.73-.078.785.08.864.236 1.336.157.472.55.236.157.472-.392.236-1.57 0-1.57 0zm-20.257-64.022l-.55-.786s-.235-.473-.628-.55c-.392-.08-1.256-1.102-1.256-1.102s-.393-.314-.393-.865c0-.55-.315-1.415-.08-2.36.236-.943.315-2.123.236-2.438-.078-.314.393-.393-.157-.707-.55-.315-1.65-.394-2.356-.394-.707 0-1.57.238-1.728.316-.157.08.864-2.36 1.02-2.753.158-.393.865-2.123.865-2.36 0-.235.236-.314-.235-.628-.47-.315-1.256-.472-1.727-.236-.47.235-.393-.316-.785.628s-.785 1.966-1.257 2.124c-.47.157-1.413.63-1.413.63s-1.177-.08-1.57-.158c-.393-.08-2.04-.944-2.355-1.494-.314-.55-.47-1.73-.47-2.28 0-.552.862-2.203.784-2.597-.08-.393.864-1.966.785-2.202-.08-.235.157-1.022.392-1.336.235-.315 1.413-.708 1.727-1.023.314-.313.863-.706 1.413-.864.55-.157 1.02-.314 1.413-.314s1.413-.865 1.57 0c.158.865.864.55 1.257.63.392.078.47.47 1.1-.552.627-1.022 1.255-1.337 1.255-1.1 0 .235 1.02-.08 1.178.157.157.235.47-.158 1.02.314.55.473 1.335.552 1.257.787-.08.236.314.236.314.472 0 .235.314-.55.314.864 0 1.416.392 2.28.392 2.28s.55 1.18.785.945c.236-.237.707-.866.707-.866s.785-.472.235-2.124c-.55-1.65-.157-2.123-.314-2.674-.157-.55-.157-.865.785-1.573.942-.708 3.22-2.28 3.77-2.595.548-.315 1.805-1.18 1.805-1.18s.47-.236.55-.865c.078-.63 1.57-1.73 1.648-2.045.08-.314 1.1-1.1 1.1-1.1s1.1-.63 1.02-1.023c-.077-.393 1.415-1.1 1.65-1.1.236 0 1.492.392 1.492-.316 0-.71 0-.866.785-1.495.785-.63 1.806-1.573 2.2-1.573.39 0 1.726-.708 2.275-.865.55-.158 2.278-.944.707 0-1.57.943-.55.393-.865 1.18-.313.786-.55 1.808.943.628 1.492-1.18 1.413-1.415 1.963-1.494.55-.077.158.237 1.335-.156 1.178-.393 1.257-.55 1.257-.55s.55-.473.235-.708c-.314-.237.314-.55-.864-.08-1.177.473-1.1.55-1.884.315-.786-.235-1.964-.156-1.1-.943.864-.786 1.963-1.022 1.256-1.337-.706-.314-2.512.08-2.748.157-.236.08-.785-.078-1.256 0-.47.08-.314-.628 0-.786.314-.156 1.335-.63 2.59-.943 1.257-.315 4.32-.393 5.026-.393.706 0 1.648.157 2.198-.236s1.65-1.022 1.806-1.337c.157-.314.785-.785.785-.785s.707-.708.314-1.023c-.39-.314-.784-1.022-1.098-.865-.314.157-.078 1.1-.706.078-.63-1.022-.55-1.18-.864-1.415-.314-.236-.628-.08-.392-1.18.235-1.1.157-1.573.157-1.573s.235-.943 0-1.022c-.236-.08-.393-.314-.785-.08-.393.237-2.59 1.338-3.062 1.574-.472.235-1.1-.945-.864-1.495.235-.55.078-.236-.236-1.022-.314-.787-1.57-.945-2.04-.945-.473 0-1.57-.708-1.886-.235-.314.47-1.962 1.965-2.277 2.123-.314.158-.785-1.337-1.02 1.1-.236 2.44.863 3.147-.393 3.305-1.256.158-2.355.865-2.355.865s-1.022.08-1.022.708c0 .63-.392 2.124-.864 2.28-.47.16-1.65-.077-2.04-.55-.394-.47.077-2.2.077-2.2l.708-.71s-5.025-.785-4.947-1.1c.08-.315-1.49-.865-1.647-1.337-.157-.472-.236-1.495-.08-1.888.158-.393 2.278-2.28 3.377-2.674 1.1-.393 2.984-1.258 3.534-1.416.55-.157 1.49-.078 1.806-.47.313-.395.392-1.102.392-1.102s-.157-1.102.157-.945c.313.16.863.395.94.63.08.237.08.787.63.158.55-.63 1.256-.866 1.884-1.18.628-.315 1.57-.236 2.12-.55.55-.315 1.492-.63 1.57-1.416.08-.786-.235-.55-.628-.63-.393-.078.157.08-1.178.71-1.335.628-.942.156-1.884.628s-1.02.55-1.1.157c-.078-.393.158-1.022.158-1.022s.078-.08-.47-.236c-.55-.158-.55.078-.63-.63-.078-.708.393-1.73-.392-1.416-.785.315-1.492-.236-2.04 1.337-.55 1.574-2.436 3.226-2.907 2.832-.47-.393-.55-.472-.942-.472-.392 0-.94-.47-1.648-.55-.707-.08-2.827-.08-3.376 0-.55.08-1.178-.315-1.65.158-.47.47-1.177 1.1-1.177 1.337 0 .236-.707-.866-.943-.787-.235.08-.864-.314-1.57-.314-.707 0-1.178-.394-1.413-.394-.235 0 .235-.63 0-.708-.235-.078-5.34-.235-5.34-.235s-1.648-.63-2.276-.55c-.628.078-2.355.156-3.69.392-1.336.235-3.3 1.022-3.926 1.1-.63.08-2.042.08-2.277-.314-.236-.393.078-.315-.236-.393-.315-.08-.08-.236-.786-.787-.707-.55.314-1.022-1.1-1.022-1.412 0-2.276-.08-3.532 0-1.257.08-3.847.708-4.16.63-.315-.08-2.828.392-3.22.157-.393-.236-2.356.865-2.748.787-.393-.08-1.885.08-2.277.315-.393.236-2.277.707-1.65 1.1.63.394.55.787.63 1.023.078.236-.63.786-.63.786s-.157 0-1.02-.313c-.864-.315-1.806-.472-2.2-.236-.39.237-1.098.71-.94 1.024.157.314 1.255 1.022 1.413.786.157-.236.55-.708 1.02-.63.472.08 1.178-.313.55.473-.628.786-1.178 1.18-1.57 1.26-.393.077-1.335.156-2.2.235-.863.08-.784-.315-1.57.472-.784.786-1.098.314-1.255 1.18-.157.864-.314.864 0 1.1.314.236-.628.315.078.55.707.237 1.57.473 1.492.71-.08.235.785-.316.314.313-.472.63-.786 1.18.156.55.942-.628 1.49-.157 2.277-.55.785-.393 1.57-.472 2.04-.786.472-.315.708-.786 1.414-1.023.707-.236.236.08.314.472.08.393 0 .472.473.157.47-.315.47-.078 1.1-.472.627-.392 1.333-.785 1.805-.55.47.237.628.237.942.237.314 0-.393-.08.314 0 .707.078-.314-.236 2.04.314 2.357.552 2.985.158 3.142 1.024.157.865.47-.08.863.47.392.552.628.08.863 1.024.236.944 0 3.54-.157 3.854-.157.314-.235.314-.157 1.022.078.708 1.02 4.09.706 4.326-.314.235-1.02.314-1.02.314l-.393 1.416s-.628 1.18-1.178 1.81c-.55.628-1.256 1.415-1.65 1.965-.39.55-.705 1.495-1.255 2.045-.55.55-1.02.314-.864 1.494.157 1.18 0 2.438.157 3.304.158.865.55 2.045.864 2.517.314.47.55.47 1.1.865.55.393 1.256.865 1.177 1.258-.08.393.078 2.832.078 2.832s.472.786.55 1.65c.08.867.628 1.732.628 1.732l.47 1.023s.237.08.55.707c.315.63.315.63.394.944.078.315.078.236.078.315 0 .08-.078-1.336-.235-1.73-.157-.393-.157-.865-.314-1.337s.078-1.023-.393-1.73c-.47-.708-.47-.787-.706-1.495-.236-.707-.55-1.494-.236-1.652.314-.156.55-1.18 1.178 0 .628 1.18.707.866.785 1.81.08.944.315 1.26.55 1.65.236.394.786 1.732 1.1 2.282.314.55 0-.314.706.787.707 1.1.786 1.337 1.178 2.202.393.865.628.865.864 1.494.235.63.078.473-.08 1.18-.156.708.158 1.495.158 1.495s1.1.393 1.178.63c.078.235 1.177.628 1.335.943.156.315 1.176.708 1.176.708s.864.55 1.178.707c.314.158 1.257.315 1.257.315s.628.158.864.236c.235.08.942.08.942.08s.628-.473.864-.316c.235.157.785-.315 1.02.08.236.392.707.392.943.707.235.314.47.314.863.707.393.394.786.315 1.178.63.392.314.706.314 1.178.314.47 0 .47 0 .785.08.313.078.47-.237.785.157.314.393.55.628.785 1.022.235.393.785.393.863 1.022.08.63.236.55.236 1.1 0 .552.314.788.55.945.235.157 1.098.943 1.098.943l1.178.237.942.708 1.022.313zM345.67 2.806l4.71-.59s1.65 0 2.475-.59c.824-.59 0-.59 2.473-1.06 2.473-.473 1.767-.71 3.062-.473 1.295.236 1.65.236 3.062.472 1.413.235 1.767-.118 3.062.235 1.296.354 1.884.236 2.944.236h3.298c1.65 0 3.18-.943 3.77-.354.588.59.94.354 2.943.59 2 .236 2.826-.236 3.65 0 .825.236 2.238-.118 3.887 0 1.648.118 2.473-.118 3.062-.118.588 0 1.176-.826 2-.118.826.708 1.885-.236 2.003.708.118.944 1.65.236.118.944-1.53.708-1.295.59-2.355 1.534-1.06.944.707 1.77-1.53 2.595-2.24.826-2.592-.472-3.18.944-.59 1.417 0 1.77-.118 2.48-.118.706-.354.824-1.06 1.414-.707.59-.707 0-2.356.354-1.648.354-2.825.708-3.532.708-.707 0-2.238.59-2.71.826-.47.236.826.59-1.648 1.298-2.473.708-3.062.59-3.77 1.533-.705.944-.47 1.063-.94 1.652-.472.59-1.885 2.95-2.592 2.36-.706-.59-1.06-.472-1.65-1.062-.588-.59-.94-1.415-1.294-1.887-.354-.472-.472-1.652-.59-2.36-.117-.708-1.177-2.36 0-2.124 1.178.236 1.885.118 2.238-.117.354-.237.707-1.062.707-1.062s-.118-1.298-.472-2.006c-.353-.708-.118-1.298-.706-2.005-.59-.708-.59-.59-1.414-1.298-.824-.708-.59-1.062-1.884-1.18-1.296-.118-1.65-.472-2.12-.354-.47.118-2.002-.826-.354-.944 1.65-.118 3.18.118 3.18.118s2.12-.944 1.414-1.062c-.707-.118 1.06-1.18-.59-.826-1.648.354-3.532.826-4.004.944-.47.118-1.648.236-2.826.59-1.177.354-2.59.236-3.298 1.062-.706.826 0 .944-.706.826-.707-.118.588-.826-1.06 0-1.65.826-1.178.708-2.002.472-.825-.236-1.414-.59-1.414-.59s1.06-.118-.47-.236-1.53-.118-2.12-.826c-.59-.708-.236-.708.117-.944.355-.236.59-.708.59-.708zm-2.59 5.31c-.59.59-2.003 1.415-1.65 1.77.354.353.59 1.65 1.296 1.296.707-.353-.118-1.533 2.59-.59 2.71.944 2.474-.117 3.063 1.298.588 1.416 1.06 2.478.705 2.832-.353.354-.47.708-1.648 1.062-1.178.354-1.65.826-.825 1.415.825.59 2.356 1.18 3.062 1.533.707.354 2.827.472 1.767-.707-1.06-1.18.236-1.534.236-1.534s2.003 1.534 1.296-.236c-.707-1.77-1.178-1.77-.707-1.77.472 0 1.414.59 1.414.59l.47-.944-.47-1.533-1.532-1.535s1.295-1.18-.472-1.415c-1.766-.236-1.65-.236-2.59-.827-.943-.59-1.06-.825-2.827-.47-1.768.353-2.357.59-2.357.59l-.824-.828zM316.815 9.53c.707-.707 2.59-2.36 3.298-1.887.706.472 1.766-.354 2.59.354.825.708 1.767 1.534 2.474 1.77.707.235 1.53-.59 2.238-.236.706.355 3.18-1.77 2.708-.117-.47 1.652.59 2.123-.706 2.242-1.296.118-2.71 1.06-3.298.708-.59-.354-1.06-.708-2.003-.236-.942.47-.47.47-1.53.236-1.06-.236-1.296.235-1.53-.12-.237-.352-.943-.234-.826-1.296.12-1.062.472-.944-.235-.944-.706 0-1.295.118-1.766-.236-.472-.354-1.414-.236-1.414-.236z"
                stroke="#333"
                strokeWidth="0"
                fill={nightMode ? "#353332" : "white"}
                fillRule="evenodd"
                className="globe-path"
              />
            </svg>
          </div>

          {/* <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            version="1.1"
            width="350"
            height="350"
          >
            <defs>
              <clipPath id="clip">
                <circle cx="175" cy="175" r="157" />
              </clipPath>
            </defs>
            <circle cx="175" cy="175" r="170" fill="#2314a1">
              <animate
                attributeName="r"
                calcMode="spline"
                keySplines="0.3 0 0.7 1;0.3 0 0.7 1"
                values="170;175;170"
                dur="3s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="175" cy="175" r="157" fill="#4294fe" />
            <g clipPath="url(#clip)">
              <g>
                <g id="land" fill="#43d8aa">
                  <path d="M14 101v12a6 6 0 0 1 6 6 6 6 0 0 1-6 6v12h40v-12a6 6 0 0 1-6-6 6 6 0 0 1 6-6v-12H14zm75 177v8a7.5 7.5 0 0 1 7.5 7.5A7.5 7.5 0 0 1 89 301v9h32v-9a7.5 7.5 0 0 1-7.5-7.5 7.5 7.5 0 0 1 7.5-7.5v-8z" />
                  <rect y="9" x="197" width="52" height="30" rx="15" ry="15" />
                  <rect
                    y="57"
                    x="-34"
                    width="150"
                    height="56"
                    rx="28"
                    ry="28"
                  />
                  <rect y="81" x="176" width="65" height="30" ry="15" rx="15" />
                  <rect
                    y="125"
                    x="-3"
                    width="82"
                    height="39"
                    ry="19.5"
                    rx="19.5"
                  />
                  <rect
                    y="139"
                    x="189"
                    width="195"
                    height="64"
                    rx="32"
                    ry="32"
                  />
                  <rect
                    y="218"
                    x="250"
                    width="100"
                    height="40"
                    rx="20"
                    ry="20"
                  />
                  <rect
                    y="230"
                    x="-17"
                    width="180"
                    height="56"
                    ry="28"
                    rx="28"
                  />
                  <rect
                    y="301"
                    x="56"
                    width="104"
                    height="30"
                    rx="15"
                    ry="15"
                  />
                </g>
                <use transform="translate(400 0)" xlinkHref="#land" />
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  from="0 0"
                  to="-400 0"
                  dur="10s"
                  repeatCount="indefinite"
                />
              </g>
              <g>
                <g id="clouds" fill="#e6ebfc">
                  <path d="M242 87v6.03a3 3 0 0 1 .38-.03 3 3 0 0 1 3 3 3 3 0 0 1-3 3 3 3 0 0 1-.38-.03V105h18v-6a3 3 0 0 1-3-3 3 3 0 0 1 3-3v-6zm53-2v4a5 5 0 0 1 0 10v4h30v-4a5 5 0 0 1 0-10v-4h-30zM48 209v6a4.5 4.5 0 1 1 0 9v3h29v-3a4.5 4.5 0 1 1 0-9v-6zM81 65v3a3.5 3.5 0 1 1 0 7v2h16v-2a3.5 3.5 0 1 1 0-7v-3zm18 181v4a5 5 0 0 1 0 10v4h30v-4a5 5 0 0 1 0-10v-4z" />
                  <rect y="50" x="64" width="53" height="18" rx="9" ry="9" />
                  <rect y="53" x="269" width="80" height="36" rx="18" ry="18" />
                  <rect y="75" x="0" width="112" height="22" rx="11" ry="11" />
                  <rect y="83" x="236" width="32" height="10" rx="5" ry="5" />
                  <rect
                    y="99"
                    x="227"
                    width="112"
                    height="24"
                    rx="12"
                    ry="12"
                  />
                  <rect y="102" x="146" width="36" height="16" rx="8" ry="8" />
                  <rect
                    y="172"
                    x="119"
                    width="62"
                    height="30"
                    rx="15"
                    ry="15"
                  />
                  <rect y="197" x="0" width="90" height="18" rx="9" ry="9" />
                  <rect y="293" x="219" width="30" height="16" rx="8" ry="8" />
                  <rect
                    y="224"
                    x="31"
                    width="118"
                    height="26"
                    rx="13"
                    ry="13"
                  />
                  <rect y="260" x="77" width="77" height="36" rx="18" ry="18" />
                  <rect
                    y="264"
                    x="228"
                    width="44"
                    height="22"
                    rx="11"
                    ry="11"
                  />
                </g>
                <use transform="translate(400 0)" xlinkHref="#clouds" />
                <animateTransform
                  attributeName="transform"
                  attributeType="XML"
                  type="translate"
                  from="0 0"
                  to="-400 0"
                  dur="5s"
                  repeatCount="indefinite"
                />
              </g>
            </g>
          </svg> */}
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
          <ControlPanel
            onRefreshButton={onRefreshButton}
            refreshIsLoading={refreshIsLoading}
          ></ControlPanel>
          {sidebar && stateInfo && (
            <Sidebar infos={stateInfo} bulkDatas={bulkDatas} />
          )}
          {/* <Legend></Legend>
          <Toolbar
            onRefreshButton={onRefreshButton}
            refreshIsLoading={refreshIsLoading}
          ></Toolbar> */}
          <Modes></Modes>
        </div>
      )}
    </div>
  );
};

export default App;
