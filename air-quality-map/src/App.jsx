import React, { useEffect, useState } from "react";
import dataR from "./data/dataR.json";
import axios from "axios";
import weatherData from "./data/weatherProxy.json";
import dailyDataProxy from "./data/dailyDataProxy.json";
import datasBackup from "./data/datasBackup.json";
import * as turf from "@turf/turf";
import Sidebar from "./components/Sidebar";
import MapComponent from "./components/MapComponent";
import Legend from "./components/Legend";
import Toolbar from "./components/Toolbar";
import * as d3 from "d3";

const App = () => {
  const [stateInfo, setStateInfo] = useState(null);
  const [buttonPressed, setButtonPressed] = useState(false);
  const [datas, setDatas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleButtonClick = () => {
    if (buttonPressed) {
      setButtonPressed(false);
    } else {
      setButtonPressed(true);
    }
    setStateInfo(null);
  };

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

  async function getFirstUS() {
    const apiURL =
      "https://www.airnowapi.org/aq/data/?parameters=OZONE,PM25,PM10,CO,NO2,SO2&BBOX=-125.525950,26.165337,-103.729075,47.554315&dataType=B&format=application/json&verbose=0&monitorType=0&includerawconcentrations=0&API_KEY=B463827E-2DD2-4E7D-A5DC-CCF4D074877A";
    /* const apiURL =
      "https://www.airnowapi.org/aq/data/?startDate=2023-07-15T10&endDate=2023-07-15T18&parameters=OZONE,PM25,PM10,CO,NO2,SO2&BBOX=-125.525950,26.165337,-103.729075,47.554315&dataType=B&format=application/json&verbose=0&monitorType=0&includerawconcentrations=0&API_KEY=B463827E-2DD2-4E7D-A5DC-CCF4D074877A";
     */
    try {
      const response = await fetch(apiURL);
      const data = await response.json();
      console.log("first data US got correctly");
      return data;
    } catch (error) {
      console.log("error fetching first US data", error);
      return null;
    }
  }
  async function getSecondUS() {
    /* const apiURL =
      "https://www.airnowapi.org/aq/data/?startDate=2023-07-15T10&endDate=2023-07-15T18&parameters=OZONE,PM25,PM10,CO,NO2,SO2&BBOX= -94.46,24.39,-66.93,49.38&dataType=B&format=application/json&verbose=0&monitorType=0&includerawconcentrations=0&API_KEY=B463827E-2DD2-4E7D-A5DC-CCF4D074877A";
     */
    const apiURL =
      "https://www.airnowapi.org/aq/data/?parameters=OZONE,PM25,PM10,CO,NO2,SO2&BBOX=-103.729075,26.749853,-86.150950,47.282452&dataType=B&format=application/json&verbose=0&monitorType=0&includerawconcentrations=0&API_KEY=B463827E-2DD2-4E7D-A5DC-CCF4D074877A";
    try {
      const response = await fetch(apiURL);
      const data = await response.json();
      console.log("second data US got correctly");
      return data;
    } catch (error) {
      console.log("error fetching second US data", error);
      return null;
    }
  }
  async function getThirdUS() {
    const apiURL =
      "https://www.airnowapi.org/aq/data/?parameters=OZONE,PM25,PM10,CO,NO2,SO2&BBOX=-85.799388,27.152772,-67.166575,47.111827&dataType=B&format=application/json&verbose=0&monitorType=0&includerawconcentrations=0&API_KEY=B463827E-2DD2-4E7D-A5DC-CCF4D074877A";
    try {
      const response = await fetch(apiURL);
      const data = await response.json();
      console.log("third data US got correctly");
      return data;
    } catch (error) {
      console.log("error fetching third US data", error);
      return null;
    }
  }
  async function getFourthUS() {
    //alaska
    const apiURL =
      "https://www.airnowapi.org/aq/data/?parameters=OZONE,PM25,PM10,CO,NO2,SO2&BBOX=-166.440506,59.326006,-140.073318,71.169033&dataType=B&format=application/json&verbose=0&monitorType=0&includerawconcentrations=0&API_KEY=B463827E-2DD2-4E7D-A5DC-CCF4D074877A";
    try {
      const response = await fetch(apiURL);
      const data = await response.json();
      console.log("fourth data US got correctly");
      return data;
    } catch (error) {
      console.log("error fetching fourth US data", error);
      return null;
    }
  }

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

    const response = await axios.get(
      `http://localhost:4000/is-daily-update-done`
    );
    if (!response.data) {
      await axios.post(`http://localhost:4000/daily-update`, {
        dataToUpdate,
      });
      console.log("Daily update to do");
    }
    console.log("Daily check done");
  }

  async function getDailyData() {
    let data = [];
    const d1 = await getFirstUS();
    d1.forEach((measurement) => {
      data.push(measurement);
    });
    console.log("data after first: ", data);
    const d2 = await getSecondUS();
    d2.forEach((measurement) => {
      data.push(measurement);
    });
    console.log("data after second: ", data);
    const d3 = await getThirdUS();
    d3.forEach((measurement) => {
      data.push(measurement);
    });
    console.log("data after third: ", data);
    const d4 = await getFourthUS();
    d4.forEach((measurement) => {
      data.push(measurement);
    });
    console.log("data after fourth: ", data);
    console.log("Daily data got");
    return data;
  }

  async function getDatas() {
    const response = await axios.get(`http://localhost:4000/datas`);
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
        const todayIsUpdated = await axios.get(
          `http://localhost:4000/is-daily-update-done`
        );
        if (!todayIsUpdated.data) {
          const dailyData = await getDailyData(); //getting today data, using dataAirNow as proxy to not get each time api connection
          initilizeJson(); //initialize json to be sure that adding field are correct
          dailyData.forEach((measurement) => {
            const point = turf.point([
              measurement.Longitude,
              measurement.Latitude,
            ]);
            for (let i = 0; i < dataR.features.length; i++) {
              const feature = dataR.features[i];
              if (feature.properties.name == "Oregon") {
              }

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
                feature.properties.nDetections =
                  feature.properties.nDetections + 1;
                if (
                  Object.keys(feature.properties.measurements).includes(
                    measurement.Parameter
                  )
                ) {
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
            if (el.type == "Feature") {
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
              med += el.properties.AQI;
            }
          });
          dataR.features[0].data.countryAQI = med / dataR.features.length;
          dataR.features.forEach((el) => {
            if (el.type == "Feature") {
              const weatherNameState = el.properties.name;
              const weatherStateData = weatherData[weatherNameState];
              const cloud = weatherStateData.current.cloud;
              const tempReal = weatherStateData.current.temp_c;
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
            }
          });
          dataR.features[0].data.weather = {
            temperature: tem / dataR.features.length,
            humidity: hum / dataR.features.length,
          };
          await dailyUpdate(dataR);
          console.log("Daily Data Updated");
        }
        const datas = datasBackup; //await getDatas();
        console.log(datas);
        setDatas(datas); //getting the whole db data (7 days data)
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
    <div>
      {isLoading ? (
        <div className="loading-overlay">
          <img src="/loading-spin.gif" alt="Logo" width="300" height="300" />
        </div>
      ) : (
        <div>
          {datas.length > 0 && (
            <MapComponent
              datas={datas}
              stateClicked={stateClicked}
              buttonPressed={buttonPressed}
              onButtonClick={handleButtonClick}
            ></MapComponent>
          )}
          {stateInfo && (
            <Sidebar infos={stateInfo} onButtonClick={handleButtonClick} />
          )}
          <Legend></Legend>
          <Toolbar></Toolbar>
        </div>
      )}
    </div>
  );
};

export default App;
