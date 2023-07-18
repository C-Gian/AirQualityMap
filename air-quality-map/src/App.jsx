import React, { useEffect, useState } from "react";
import dataR from "./dataR.json";
import dataAirNow from "./dataAirNow.json";
import axios from "axios";
import * as turf from "@turf/turf";
import Sidebar from "./Sidebar";
import MapComponent from "./MapComponent";
import historicalData from "./historicalData.json";

//LE COORDINATE IN MAPBOX SONO ROVESCIATE RISPETTO A QUELLE DI GOOGLE

const App = () => {
  const [stateInfo, setStateInfo] = useState(null);
  const [buttonPressed, setButtonPressed] = useState(false);

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

  async function getHistoricalData(startDate, endDate) {
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
  }

  async function getFirstHistoricalUS(month, day) {
    const apiURL = `https://www.airnowapi.org/aq/data/?startDate=2023-${month}-${day}T10&endDate=2023-${month}-${day}T18&parameters=OZONE,PM25,PM10,CO,NO2,SO2&BBOX=-125,24,-97.67,49&dataType=B&format=application/json&verbose=0&monitorType=0&includerawconcentrations=0&API_KEY=B463827E-2DD2-4E7D-A5DC-CCF4D074877A`;
    try {
      const response = await fetch(apiURL);
      const data = await response.json();
      console.log("first historical data US got correctly");
      return data;
    } catch (error) {
      console.log("error fetching historical first US data", error);
      return null;
    }
  }
  async function getSecondHistoricalUS(month, day) {
    const apiURL = `https://www.airnowapi.org/aq/data/?startDate=2023-${month}-${day}T10&endDate=2023-${month}-${day}T18&parameters=OZONE,PM25,PM10,CO,NO2,SO2&BBOX=-97.67,24,-70.33,49&dataType=B&format=application/json&verbose=0&monitorType=0&includerawconcentrations=0&API_KEY=B463827E-2DD2-4E7D-A5DC-CCF4D074877A`;
    try {
      const response = await fetch(apiURL);
      const data = await response.json();
      console.log("second historical data US got correctly");
      return data;
    } catch (error) {
      console.log("error fetching historical second US data", error);
      return null;
    }
  }
  async function getThirdHistoricalUS(month, day) {
    const apiURL = `https://www.airnowapi.org/aq/data/?startDate=2023-${month}-${day}T10&endDate=2023-${month}-${day}T18&parameters=OZONE,PM25,PM10,CO,NO2,SO2&BBOX=-70.33,24,-67,49&dataType=B&format=application/json&verbose=0&monitorType=0&includerawconcentrations=0&API_KEY=B463827E-2DD2-4E7D-A5DC-CCF4D074877A`;
    try {
      const response = await fetch(apiURL);
      const data = await response.json();
      console.log("third historical data US got correctly");
      return data;
    } catch (error) {
      console.log("error fetching historical third US data", error);
      return null;
    }
  }
  async function getFourthHistoricalUS(month, day) {
    const apiURL = `https://www.airnowapi.org/aq/data/?startDate=2023-${month}-${day}T10&endDate=2023-${month}-${day}T18&parameters=OZONE,PM25,PM10,CO,NO2,SO2&BBOX=-179.33,54,-129,72&dataType=B&format=application/json&verbose=0&monitorType=0&includerawconcentrations=0&API_KEY=B463827E-2DD2-4E7D-A5DC-CCF4D074877A`;
    try {
      const response = await fetch(apiURL);
      const data = await response.json();
      console.log("fourth historical data US got correctly");
      return data;
    } catch (error) {
      console.log("error fetching historical fourth US data", error);
      return null;
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        /* const response = await axios.get(OPENAQ_ENDPOINT);
        const data = response.data.results; */
        //const data = proxyData;//.slice(0, 50);
        /* const d1 = await getFirstUS();
        console.log(d1);
        const d2 = await getSecondUS();
        console.log(d2);
        const d3 = await getThirdUS();
        console.log(d3);
        const d4 = await getFourthUS();
        console.log(d4); */
        //DATAPROXYAIRNOW LASTUPDATE = 16/07/2023 ORE 15:00
        /* const d = await getHistoricalData("2023-07-09", "2023-07-16");
        console.log(d); */

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

        const response = await axios.get(`http://localhost:4000/daily-update`);
        if (!response.data) {
          await axios.post(`http://localhost:4000/daily-update`, {
            dataR,
          });
        }

        initilizeJson();
        dataAirNow.forEach((measurement) => {
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
                  feature.properties.measurements[measurement.Parameter].unit =
                    measurement.Unit;
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

        //setting fixedValue and AQI
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
        });

        //calculating countryAQI
        let med = 0;
        dataR.features.forEach((el) => {
          med += el.properties.AQI;
        });
        dataR.features.forEach((el) => {
          el.properties.countryAQI = med / dataR.features.length;
        });

        console.log(dataR);

        /* //CODE TO FIND MIN, MED, MAX AQI LEVEL
        let min = 0;
        let med = 0;
        let max = 0;
        dataR.features.forEach((el) => {
          if (el.properties.AQI > max) {
            max = el.properties.AQI;
          }
          if (el.properties.AQI < min) {
            min = el.properties.AQI;
          }
          med += el.properties.AQI;
        });
        console.log(min, med / dataR.features.length, max); */

        /* axios
          .post("http://localhost:4000/update", dataR)
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
      {dataR && (
        <MapComponent
          dataR={dataR}
          stateClicked={stateClicked}
          buttonPressed={buttonPressed}
          onButtonClick={handleButtonClick}
        ></MapComponent>
      )}
      {stateInfo && (
        <Sidebar infos={stateInfo} onButtonClick={handleButtonClick} />
      )}
    </div>
  );
};

export default App;
