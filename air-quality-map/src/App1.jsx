import React, { useEffect, useRef, useState } from "react";
import mapboxgl, { NavigationControl } from "mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import dataR from "./dataR.json";
import proxyData from "./proxydata.json";
import axios from "axios";
import * as turf from "@turf/turf";
import Popup from "./Popup";
import StateMenu from "./StateMenu";

const MapComponent = ({ onStateHover, onStateClick }) => {
  const mapRef = useRef(null);
  let hoveredPolygonId = null;

  const handleCloseMenu = () => {
    setStateInfo(null);
  };

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
  const aqi_breakpoints = [
    [0, 50],
    [51, 100],
    [101, 150],
    [151, 200],
    [201, 300],
    [301, 400],
    [401, 500],
  ];
  function o3_aqi_calculator(o3_value) {
    const o3_breakpoints = {
      1: [0.0, 0.054],
      2: [0.055, 0.07],
      3: [0.071, 0.085],
      4: [0.086, 0.105],
      5: [0.106, 0.2],
      6: [0.405, 0.504],
      7: [0.505, 0.604],
    };
    /*
    C_P = the truncated concentration of pollutant
    BP_HI = the concentration breakpoint that is greater than or equal to C_P
    BP_LO = the concentration breakpoint that is less than or equal to C_P
    I_HI = the AQI value corresponding to BP_HI
    I_LO = the AQI value corresponding to BP_LO
    */
    const C_P = o3_value.value;
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
    const C_P = pm25_value.value;
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
    const C_P = pm10_value.value;
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
    const C_P = co_value.value;
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
    const C_P = so2_value.value;
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
    const C_P = no2_value.value;
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
    const C_P = nox_value.value;
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
    const C_P = no_value.value;
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
  function AQICalculator(measurements) {
    let AQIs = {};
    if (measurements.o3.value != null && measurements.o3.value != 0) {
      AQIs.o3 = [null, null];
      const o3_aqi = o3_aqi_calculator(measurements.o3);
      if (o3_aqi != null) {
        AQIs.o3 = [measurements.o3.value, o3_aqi];
      }
    }
    if (measurements.pm25.value != null && measurements.pm25.value != 0) {
      AQIs.pm25 = [null, null];
      const pm25_aqi = pm25_aqi_calculator(measurements.pm25);
      if (pm25_aqi != null) {
        AQIs.pm25 = [measurements.pm25.value, pm25_aqi];
      }
    }
    if (measurements.pm10.value != null && measurements.pm10.value != 0) {
      AQIs.pm10 = [null, null];
      const pm10_aqi = pm10_aqi_calculator(measurements.pm10);
      if (pm10_aqi != null) {
        AQIs.pm10 = [measurements.pm10.value, pm10_aqi];
      }
    }
    if (measurements.co.value != null && measurements.co.value != 0) {
      AQIs.co = [null, null];
      const co_aqi = co_aqi_calculator(measurements.co);
      if (co_aqi != null) {
        AQIs.co = [measurements.co.value, co_aqi];
      }
    }
    if (measurements.so2.value != null && measurements.so2.value != 0) {
      AQIs.so2 = [null, null];
      const so2_aqi = so2_aqi_calculator(measurements.so2);
      if (so2_aqi != null) {
        AQIs.so2 = [measurements.so2.value, so2_aqi];
      }
    }
    if (measurements.no2.value != null && measurements.no2.value != 0) {
      AQIs.no2 = [null, null];
      const no2_aqi = no2_aqi_calculator(measurements.no2);
      if (no2_aqi != null) {
        AQIs.no2 = [measurements.no2.value, no2_aqi];
      }
    }
    if (measurements.nox.value != null && measurements.nox.value != 0) {
      AQIs.nox = [null, null];
      const nox_aqi = nox_aqi_calculator(measurements.nox);
      if (nox_aqi != null) {
        AQIs.nox = [measurements.nox.value, nox_aqi];
      }
    }
    if (measurements.no.value != null && measurements.no.value != 0) {
      AQIs.no = [null, null];
      const no_aqi = no_aqi_calculator(measurements.no);
      if (no_aqi != null) {
        AQIs.no = [measurements.no.value, no_aqi];
      }
    }
    let AQI_array = [];
    Object.keys(AQIs).forEach((key) => {
      if (AQIs[key][1] != null) {
        AQI_array.push(AQIs[key][1]);
      }
    });
    if (AQI_array.length > 0) {
      return Math.max(...AQI_array);
    }
    return 0;
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

  //openAQ API - max 300 richieste ogni 5m - una singola chiamata ottieni max 1000 stazioni ma con tutti gli inquinanti
  const OPENAQ_ENDPOINT =
    "https://api.openaq.org/v2/latest?limit=6000&offset=0&sort=desc&country_id=US&order_by=city&dumpRaw=false";
  useEffect(() => {
    const fetchData = async () => {
      try {
        /* const response = await axios.get(OPENAQ_ENDPOINT);
        const data = response.data.results; */
        const data = proxyData;
        for (let i = 0; i < data.length; i++) {
          const point = turf.point([
            data[i].coordinates.longitude,
            data[i].coordinates.latitude,
          ]);
          for (let j = 0; j < dataR.features.length; j++) {
            dataR.features[j].id = j;
            dataR.features[j].lastUpdatedMe = formattedTime().toString();
            const typeF = dataR.features[j].geometry.type;
            let polygon = {};
            if (typeF === "MultiPolygon") {
              polygon = turf.multiPolygon(
                dataR.features[j].geometry.coordinates
              );
            } else {
              polygon = turf.polygon(dataR.features[j].geometry.coordinates);
            }
            if (turf.booleanPointInPolygon(point, polygon)) {
              dataR.features[j].properties.nStations =
                dataR.features[j].properties.nStations + 1;
              const pollutionElements = [
                "pm25",
                "o3",
                "no",
                "co",
                "so2",
                "pm10",
                "no2",
                "nox",
              ];
              /* console.log(data[i].measurements);
              console.log(dataR.features[j].properties.measurements); */
              var measurements = {};
              data[i].measurements.forEach((el) => {
                if (pollutionElements.includes(el.parameter)) {
                  const index = pollutionElements.indexOf(el.parameter);
                  if (index > -1) {
                    pollutionElements.splice(index, 1);
                  }
                  Object.assign(measurements, {
                    [el.parameter]: {
                      value: el.value,
                      lastUpdatedStation: el.lastUpdated,
                      unit: el.unit,
                    },
                  });
                }
              });
              if (pollutionElements.length > 0) {
                pollutionElements.forEach((el) => {
                  Object.assign(measurements, {
                    [el]: {
                      value: null,
                      lastUpdatedStation: null,
                      unit: null,
                    },
                  });
                });
              }
              dataR.features[j].properties.measurements = measurements;
              const thisStationAQI = AQICalculator(measurements);
              if (thisStationAQI > dataR.features[j].properties.AQI) {
                dataR.features[j].properties.AQI = thisStationAQI;
              }
            }
          }
        }
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

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoiYy1naWFuIiwiYSI6ImNsanB3MXVjdTAwdmUzZW80OWwxazl2M2EifQ.O0p5OWTAIw07QDYHYTH1rw";
    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/dark-v11",
      center: [-98.30953630020429, 38.75491131673913],
      minZoom: 2,
      zoom: 3,
    });

    const zoomThreshold = 5;

    map.on("load", () => {
      let show = false;
      map.style.stylesheet.layers.forEach(function (layer) {
        if (layer.type === "symbol") {
          map.setLayoutProperty(
            layer.id,
            "visibility",
            show ? "visible" : "none"
          );
        }
      });

      //map.addControl(new NavigationControl(), "top-right");

      map.addSource("aqi", {
        type: "geojson",
        data: dataR,
      });

      map.addLayer(
        {
          id: "state-aqi",
          source: "aqi",
          maxzoom: zoomThreshold,
          type: "fill",
          paint: {
            "fill-color": [
              "interpolate",
              ["linear"],
              ["get", "AQI"],
              0,
              "#FFFFFF",
              16.8,
              "#00ff04",
              33.4,
              "#a2ff00",
              50,
              "#bbff00",

              51,
              "#f6ff00",
              67.4,
              "#ffea00",
              83.7,
              "#ffd000",
              100,
              "#ffb300",

              101,
              "#ff9900",
              117.4,
              "#ff8000",
              133.7,
              "#ff6600",
              150,
              "#ff4800",

              151,
              "#ff0000",
              167.4,
              "#ff003c",
              183.7,
              "#ff0066",
              200,
              "#d6006f",

              201,
              "#db0072",
              220.8,
              "#b50460",
              240.6,
              "#9e0253",
              260.4,
              "#8a0349",
              280.2,
              "#7a0140",
              300,
              "#690137",

              301,
              "#57012d",
            ],
            "fill-opacity": [
              "case",
              ["boolean", ["feature-state", "hover"], false],
              1,
              0.75,
            ],
          },
        },
        "road-label-simple"
      );

      map.addLayer(
        {
          id: "state-aqi-line",
          source: "aqi",
          maxzoom: zoomThreshold,
          type: "line",
          paint: {
            "line-opacity": 0.3, // Opacità delle linee dei confini
            "line-color": "#212121", // Colore delle linee dei confini
            "line-width": 0.5, // Spessore delle linee dei confini
          },
        },
        "road-label-simple"
      );
    });

    map.on("zoom", () => {
      const stateLegendEl = document.getElementById("state-legend");
      const countyLegendEl = document.getElementById("county-legend");
      if (map.getZoom() > zoomThreshold) {
        stateLegendEl.style.display = "none";
        countyLegendEl.style.display = "block";
      } else {
        stateLegendEl.style.display = "block";
        countyLegendEl.style.display = "none";
      }
    });

    const handleMouseMove = (e) => {
      map.getCanvas().style.cursor = "pointer";
      const feat = e.features;
      if (feat.length > 0) {
        hoveredPolygonId = feat[0].id;
        map.setFeatureState(
          { source: "aqi", id: hoveredPolygonId },
          { hover: true }
        );
      }
      onStateHover(
        dataR.features[feat[0].id],
        feat[0].layer.paint["fill-color"],
        e.originalEvent.clientX,
        e.originalEvent.clientY
      );
    };

    const handleMouseLeave = () => {
      // ... gestione del mouseleave ...
      onStateHover(null, null, null, null);
    };

    const handleClick = (e) => {
      // ... gestione del click ...
      const stateInfos = dataR.features.find(
        (obj) => obj.id === e.features[0].id
      );
      if (stateInfos) {
        onStateClick(stateInfos);
      }
    };

    map.on("mousemove", "state-aqi", handleMouseMove);
    map.on("mouseleave", "state-aqi", handleMouseLeave);
    map.on("click", "state-aqi", handleClick);

    mapRef.current = map;

    return () => {
      map.off("mousemove", "state-aqi", handleMouseMove);
      map.off("mouseleave", "state-aqi", handleMouseLeave);
      map.off("click", "state-aqi", handleClick);
    };
  }, []);

  return <div id="map" ref={mapRef}></div>;
};

export default MapComponent;
