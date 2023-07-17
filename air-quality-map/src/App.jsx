import React, { useEffect, useState } from "react";
import dataR from "./dataR.json";
import dataAirNow from "./dataAirNow.json";
import axios from "axios";
import * as turf from "@turf/turf";
import Sidebar from "./Sidebar";
import MapComponent from "./MapComponent";

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

  const aqi_breakpoints = [
    [0, 50],
    [51, 100],
    [101, 150],
    [151, 200],
    [201, 300],
    [301, 400],
    [401, 500],
  ];

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

  function o3_aqi_calculator(o3_value) {
    const o3_breakpoints = [
      [0, 126.428],
      [160.714, 351.428],
      [437.142, 865.714],
      [1080, 1294.285],
    ];
    /*
    C_P = the truncated concentration of pollutant
    BP_HI = the concentration breakpoint that is greater than or equal to C_P
    BP_LO = the concentration breakpoint that is less than or equal to C_P
    I_HI = the AQI value corresponding to BP_HI
    I_LO = the AQI value corresponding to BP_LO
    */
    const C_P = o3_value;
    let aqiTotal = null;
    Object.keys(o3_breakpoints).forEach((key) => {
      if (C_P >= o3_breakpoints[key][0] && C_P <= o3_breakpoints[key][1]) {
        const BP_HI = o3_breakpoints[key][1];
        const BP_LO = o3_breakpoints[key][0];
        const I_HI = aqi_breakpoints[key][1];
        const I_LO = aqi_breakpoints[key][0];
        aqiTotal = ((I_HI - I_LO) / (BP_HI - BP_LO)) * (C_P - BP_LO) + I_LO;
      }
    });
    return aqiTotal;
  }

  function pm25_aqi_calculator(pm25_value) {
    const pm25_breakpoints = [
      [0.0, 12.0],
      [12.1, 35.4],
      [35.5, 55.4],
      [55.5, 150.4],
      [150.5, 250.4],
      [250.5, 350.4],
      [350.5, 500.4],
    ];
    /*
    C_P = the truncated concentration of pollutant
    BP_HI = the concentration breakpoint that is greater than or equal to C_P
    BP_LO = the concentration breakpoint that is less than or equal to C_P
    I_HI = the AQI value corresponding to BP_HI
    I_LO = the AQI value corresponding to BP_LO
    */
    const C_P = pm25_value;
    let aqiTotal = null;

    Object.keys(pm25_breakpoints).forEach((key) => {
      if (C_P >= pm25_breakpoints[key][0] && C_P <= pm25_breakpoints[key][1]) {
        const BP_HI = pm25_breakpoints[key][1];
        const BP_LO = pm25_breakpoints[key][0];
        const I_HI = aqi_breakpoints[key][1];
        const I_LO = aqi_breakpoints[key][0];
        aqiTotal = ((I_HI - I_LO) / (BP_HI - BP_LO)) * (C_P - BP_LO) + I_LO;
      }
    });
    return aqiTotal;
  }
  function pm10_aqi_calculator(pm10_value) {
    const pm10_breakpoints = [
      [0, 54],
      [55, 154],
      [155, 254],
      [255, 354],
      [355, 424],
      [425, 504],
      [505, 604],
    ];
    /*
    C_P = the truncated concentration of pollutant
    BP_HI = the concentration breakpoint that is greater than or equal to C_P
    BP_LO = the concentration breakpoint that is less than or equal to C_P
    I_HI = the AQI value corresponding to BP_HI
    I_LO = the AQI value corresponding to BP_LO
    */
    const C_P = pm10_value;
    let aqiTotal = null;
    Object.keys(pm10_breakpoints).forEach((key) => {
      if (C_P >= pm10_breakpoints[key][0] && C_P <= pm10_breakpoints[key][1]) {
        const BP_HI = pm10_breakpoints[key][1];
        const BP_LO = pm10_breakpoints[key][0];
        const I_HI = aqi_breakpoints[key][1];
        const I_LO = aqi_breakpoints[key][0];
        aqiTotal = ((I_HI - I_LO) / (BP_HI - BP_LO)) * (C_P - BP_LO) + I_LO;
      }
    });
    return aqiTotal;
  }
  function co_aqi_calculator(co_value) {
    const co_breakpoints = [
      [0.0, 4.4],
      [4.5, 9.4],
      [9.5, 12.4],
      [12.5, 15.4],
      [15.5, 30.4],
      [30.5, 40.4],
      [40.5, 50.4],
    ];
    /*
    C_P = the truncated concentration of pollutant
    BP_HI = the concentration breakpoint that is greater than or equal to C_P
    BP_LO = the concentration breakpoint that is less than or equal to C_P
    I_HI = the AQI value corresponding to BP_HI
    I_LO = the AQI value corresponding to BP_LO
    */
    const C_P = co_value;
    let aqiTotal = null;
    Object.keys(co_breakpoints).forEach((key) => {
      if (C_P >= co_breakpoints[key][0] && C_P <= co_breakpoints[key][1]) {
        const BP_HI = co_breakpoints[key][1];
        const BP_LO = co_breakpoints[key][0];
        const I_HI = aqi_breakpoints[key][1];
        const I_LO = aqi_breakpoints[key][0];
        aqiTotal = ((I_HI - I_LO) / (BP_HI - BP_LO)) * (C_P - BP_LO) + I_LO;
      }
    });
    return aqiTotal;
  }
  function so2_aqi_calculator(so2_value) {
    const so2_breakpoints = [
      [0, 53],
      [54, 100],
      [101, 360],
      [361, 649],
      [650, 1249],
      [1250, 1649],
      [1650, 2049],
    ];
    /*
    C_P = the truncated concentration of pollutant
    BP_HI = the concentration breakpoint that is greater than or equal to C_P
    BP_LO = the concentration breakpoint that is less than or equal to C_P
    I_HI = the AQI value corresponding to BP_HI
    I_LO = the AQI value corresponding to BP_LO
    */
    const C_P = so2_value;
    let aqiTotal = null;
    Object.keys(so2_breakpoints).forEach((key) => {
      if (C_P >= so2_breakpoints[key][0] && C_P <= so2_breakpoints[key][1]) {
        const BP_HI = so2_breakpoints[key][1];
        const BP_LO = so2_breakpoints[key][0];
        const I_HI = aqi_breakpoints[key][1];
        const I_LO = aqi_breakpoints[key][0];
        aqiTotal = ((I_HI - I_LO) / (BP_HI - BP_LO)) * (C_P - BP_LO) + I_LO;
      }
    });
    return aqiTotal;
  }
  function no2_aqi_calculator(no2_value) {
    const no2_breakpoints = [
      [0, 50],
      [51, 100],
      [101, 150],
      [151, 200],
      [210, 300],
      [301, 400],
      [401, 500],
    ];
    /*
    C_P = the truncated concentration of pollutant
    BP_HI = the concentration breakpoint that is greater than or equal to C_P
    BP_LO = the concentration breakpoint that is less than or equal to C_P
    I_HI = the AQI value corresponding to BP_HI
    I_LO = the AQI value corresponding to BP_LO
    */
    const C_P = no2_value;
    let aqiTotal = null;
    Object.keys(no2_breakpoints).forEach((key) => {
      if (C_P >= no2_breakpoints[key][0] && C_P <= no2_breakpoints[key][1]) {
        const BP_HI = no2_breakpoints[key][1];
        const BP_LO = no2_breakpoints[key][0];
        const I_HI = aqi_breakpoints[key][1];
        const I_LO = aqi_breakpoints[key][0];
        aqiTotal = ((I_HI - I_LO) / (BP_HI - BP_LO)) * (C_P - BP_LO) + I_LO;
      }
    });
    return aqiTotal;
  }
  function nox_aqi_calculator(nox_value) {
    const nox_breakpoints = [
      [0, 50],
      [51, 100],
      [101, 150],
      [151, 200],
      [210, 300],
      [301, 400],
      [401, 500],
    ];
    /*
    C_P = the truncated concentration of pollutant
    BP_HI = the concentration breakpoint that is greater than or equal to C_P
    BP_LO = the concentration breakpoint that is less than or equal to C_P
    I_HI = the AQI value corresponding to BP_HI
    I_LO = the AQI value corresponding to BP_LO
    */
    const C_P = nox_value;
    let aqiTotal = null;
    Object.keys(nox_breakpoints).forEach((key) => {
      if (C_P >= nox_breakpoints[key][0] && C_P <= nox_breakpoints[key][1]) {
        const BP_HI = nox_breakpoints[key][1];
        const BP_LO = nox_breakpoints[key][0];
        const I_HI = aqi_breakpoints[key][1];
        const I_LO = aqi_breakpoints[key][0];
        aqiTotal = ((I_HI - I_LO) / (BP_HI - BP_LO)) * (C_P - BP_LO) + I_LO;
      }
    });
    return aqiTotal;
  }

  function no_aqi_calculator(no_value) {
    const no_breakpoints = [
      [0, 50],
      [51, 100],
      [101, 150],
      [151, 200],
      [210, 300],
      [301, 400],
      [401, 500],
    ];
    /*
    C_P = the truncated concentration of pollutant
    BP_HI = the concentration breakpoint that is greater than or equal to C_P
    BP_LO = the concentration breakpoint that is less than or equal to C_P
    I_HI = the AQI value corresponding to BP_HI
    I_LO = the AQI value corresponding to BP_LO
    */
    const C_P = no_value;
    let aqiTotal = null;
    Object.keys(no_breakpoints).forEach((key) => {
      if (C_P >= no_breakpoints[key][0] && C_P <= no_breakpoints[key][1]) {
        const BP_HI = no_breakpoints[key][1];
        const BP_LO = no_breakpoints[key][0];
        const I_HI = aqi_breakpoints[key][1];
        const I_LO = aqi_breakpoints[key][0];
        aqiTotal = ((I_HI - I_LO) / (BP_HI - BP_LO)) * (C_P - BP_LO) + I_LO;
      }
    });
    return aqiTotal;
  }

  function AQICalculator(pollutant) {
    const parameter = pollutant[0];
    const value = pollutant[1];

    switch (parameter) {
      case "pm25":
        const aqi_pm25 = pm25_aqi_calculator(value);
        if (aqi_pm25 != null) {
          return aqi_pm25;
        }
        break;
      case "o3":
        const aqi_o3 = o3_aqi_calculator(value);
        if (aqi_o3 != null) {
          return aqi_o3;
        }
        break;
      case "pm10":
        const aqi_pm10 = pm10_aqi_calculator(value);
        if (aqi_pm10 != null) {
          return aqi_pm10;
        }
        break;
      case "co":
        const aqi_co = co_aqi_calculator(value);
        if (aqi_co != null) {
          return aqi_co;
        }
        break;
      case "so2":
        const aqi_so2 = so2_aqi_calculator(value);
        if (aqi_so2 != null) {
          return aqi_so2;
        }
        break;
      case "no2":
        const aqi_no2 = no2_aqi_calculator(value);
        if (aqi_no2 != null) {
          return aqi_no2;
        }
        break;
      case "no":
        const aqi_no = no_aqi_calculator(value);
        if (aqi_no != null) {
          return aqi_no;
        }
        break;
      case "nox":
        const aqi_nox = nox_aqi_calculator(value);
        if (aqi_nox != null) {
          return aqi_nox;
        }
        break;
    }
  }

  /* //ambee - 100 richieste al giorno ma ogni richiesta ti da tutte le stazioni, problema è che tutte le stazioni = 5 stazioni
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://api.ambeedata.com/latest/by-country-code?countryCode=US",
          {
            headers: {
              "x-api-key":
                "4b9272ed189ece1ebc2d886d014ff08d763ce0c95c86325c8b97e9be27c25640",
              "Content-type": "application/json",
            },
          }
        );
        const data = response.data;
        console.log(data);
        setAirQualityData(data);
        console.log(data);
        console.log(data.stations[0].state);
        for (let i = 0; i < data2.features.length; i++) {
          if (data2.features[i].properties.name === data.stations[0].state) {
            data2.features[i].properties.population = data.stations[0].AQI;
          }
        } 
      } catch (error) {
        console.error("Error fetching air quality data:", error);
      }
    };

    fetchData();
  }, []); */

  /* //waqi API - totalmente free? - una singola chiamata ottieni tutte stazioni ma hai solo AQI senza inquinanti
  const tokenaqicn = "551302aec928205074ba444ee505af1db545b83c";
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://api.waqi.info/map/bounds/?latlng=24.396308,-125.000000,49.384358,-66.934570&token=${tokenaqicn}`
        );

        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.log("Errore durante il recupero dei dati:", error);
      }
    };

    fetchData();
  }, []); */

  /* //openAQ API - max 300 richieste ogni 5m - una singola chiamata ottieni max 1000 stazioni ma con tutti gli inquinanti
  const OPENAQ_ENDPOINT =
    "https://api.openaq.org/v2/latest?limit=6000&offset=0&sort=desc&country_id=US&order_by=city&dumpRaw=false";
 */

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
    const startDay = startDate.split("-")[2]
    const endDay = endDate.split("-")[2]
    const month = startDate.split("-")[1]
    const days = []
    for (let i=Number(startDay); i<endDay; i++) {
      days.push(i);
    }
    console.log(days)
    let data = []
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
