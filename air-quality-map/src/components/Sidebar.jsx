import React, { useEffect, useRef, useState } from "react";
import "rc-slider/assets/index.css";
import PollsLevelsChart from "./PollsLevelsChart";
import * as d3 from "d3";
import PollsTempCorrChart from "./PollsTempCorrChart";
import CorrelationMatrix from "./CorrelationMatrix";
import LinearRegression from "./LinearRegression";
import MultipleRegression from "./MultipleRegression";
import CountryFlag from "react-country-flag";
import { useSelector, useDispatch } from "react-redux";
import { setSidebar } from "../actions/index.js";
import HalfDoughnutChart from "./HalfDoughnutChart";

const Sidebar = ({ infos, bulkDatas }) => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [AQI, setAQI] = useState("");
  const [lastUpdate, setLastUpdate] = useState("");
  const [dataR, setDataR] = useState(infos.datas[0].features[infos.id]);
  const [hexColor, setHexColor] = useState("");
  const [airQualityText, setAirQualityText] = useState(null);
  const [weatherCondition, setWeatherCondition] = useState(null);
  const [tempFeel, setTempFeel] = useState(null);
  const [tempReal, setTempReal] = useState(null);
  const [cloud, setCloud] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [nStations, setNStation] = useState(0);
  const sliderValue = useSelector((state) => state.sliderValue);
  const nightMode = useSelector((state) => state.nightMode);
  const colorBlind = useSelector((state) => state.colorBlindMode);

  const colors = colorBlind
    ? [
        "rgba(0, 147, 0, 1)", // Verde
        "rgba(181, 140, 0, 1)", // Giallo
        "rgba(245, 116, 0, 1)", // Arancione
        "rgba(245, 0, 0, 1)", // Rosso
        "rgba(131, 52, 140, 1)", // Viola
        "rgba(115, 0, 23, 1)",
      ]
    : ["#00D900", "#B5B500", "#F57300", "#F50000", "#83328C", "#730017"];

  const handleCloseButtonClick = () => {
    dispatch(setSidebar(false));
  };

  function getColoreByValore(value) {
    if (value >= 0 && value <= 51) {
      return ["Good", "#00D900"];
    } else if (value > 51 && value <= 100) {
      return ["Moderate", "#B5B500"];
    } else if (value > 100 && value <= 150) {
      return ["Unhealthy for Sensitive Groups", "#F57300"];
    } else if (value > 150 && value <= 200) {
      return ["Unhealthy", "#F50000"];
    } else if (value > 200 && value <= 300) {
      return ["Very Unhealthy", "#83328C"];
    }
    return ["Hazardous", "#730017"];
  }

  /* function getFixedValues(datas) {
    datas.forEach(day => {
      day.features.forEach(feature => {

      })
    })
  } */

  // Funzione per calcolare il colore associato al valore in base all'interpolazione lineare
  const getColorForValue = (value) => {
    if (value && value > 0) {
      const scale = d3
        .scaleLinear()
        .domain([0, 301])
        .range([0, colors.length - 1]);
      const index = scale(value);
      const t = index % 1; // Frazione dell'indice
      const colorInterpolator = d3.interpolate(
        colors[Math.floor(index)],
        colors[Math.ceil(index)]
      );
      const color = colorInterpolator(t);
      // Ora aumenta la luminosità del colore
      const brighterColor = d3.color(color).brighter(1).toString();
      return brighterColor;
    }
    return "rgba(0,0,0,0)";
  };

  useEffect(() => {
    setDataR(infos.datas[sliderValue].features[infos.id]);
  }, [sliderValue, infos, nightMode, colorBlind]);

  useEffect(() => {
    let colorToSet = null;
    if (!infos.isState) {
      setName("USA");
      setDataR(infos.datas[sliderValue].features[infos.id]);
      setAQI(dataR.properties.countryAQI);
      setLastUpdate(dataR.lastUpdatedMe.split(" "));
      setTempReal(dataR.properties.countryTemp);
      setHumidity(dataR.properties.countryHum);
      setAirQualityText(getColoreByValore(dataR.properties.countryAQI)[0]);
      setNStation(
        infos.datas[sliderValue].features.reduce(
          (total, obj) => total + obj.properties.nDetections,
          0
        )
      );
      if (!dataR.properties.countryAQI) {
        colorToSet = "#00000000";
      } else {
        if (dataR.properties.countryAQI >= 301) {
          ("#4b0b2c");
        } else {
          let stateColorArray = getColorForValue(dataR.properties.countryAQI);
          const stateColorArrayRGB = stateColorArray
            .replace("rgb(", "")
            .replace(")", "")
            .split(",");
          const stateColorObjectRGB = {
            r: Number(stateColorArrayRGB[0]),
            g: Number(stateColorArrayRGB[1]),
            b: Number(stateColorArrayRGB[2]),
          };

          const r = stateColorObjectRGB.r;
          const g = stateColorObjectRGB.g;
          const b = stateColorObjectRGB.b;
          const hc = `#${r.toString(16).padStart(2, "0")}${g
            .toString(16)
            .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
          colorToSet = hc;
        }
      }
    } else {
      /* console.log("all data", infos.datas);
      console.log("today data", dataR); */
      setName(dataR.properties.name);
      setAQI(dataR.properties.AQI);
      setLastUpdate(dataR.lastUpdatedMe.split(" "));
      //setairQualityty(dataR.weather.data.);
      setWeatherCondition({
        condText: dataR.weather.data.conditionText,
        condIcon: dataR.weather.data.conditionIcon,
      });
      setTempFeel(dataR.weather.data.tempFeel);
      setTempReal(dataR.weather.data.tempReal);
      setCloud(dataR.weather.data.cloud);
      setHumidity(dataR.weather.data.humidity);
      setAirQualityText(getColoreByValore(dataR.properties.AQI)[0]);
      setNStation(dataR.properties.nDetections);
      if (!dataR.properties.AQI) {
        colorToSet = "#00000000";
      } else {
        if (dataR.properties.AQI >= 301) {
          ("#4b0b2c");
        } else {
          let stateColorArray = getColorForValue(dataR.properties.AQI);
          const stateColorArrayRGB = stateColorArray
            .replace("rgb(", "")
            .replace(")", "")
            .split(",");
          const stateColorObjectRGB = {
            r: Number(stateColorArrayRGB[0]),
            g: Number(stateColorArrayRGB[1]),
            b: Number(stateColorArrayRGB[2]),
          };

          const r = stateColorObjectRGB.r;
          const g = stateColorObjectRGB.g;
          const b = stateColorObjectRGB.b;
          const hc = `#${r.toString(16).padStart(2, "0")}${g
            .toString(16)
            .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
          colorToSet = hc;
        }
      }
    }
    setHexColor(colorToSet);
  }, [dataR, nightMode, colorBlind]);

  return (
    <div
      className="sidebar pt-3 pb-3 pl-3 pr-2 h-screen w-500 z-30 fixed"
      style={{
        top: "50px",
        backgroundColor: nightMode
          ? "rgba(75 ,85 ,99, 1)"
          : "rgba(75 ,85 ,99, 1)",
      }}
    >
      <div className="flex justify-between">
        <div className="flex flex-col items-center">
          <div className="flex items-center">
            <CountryFlag
              className="mr-3"
              countryCode={dataR.properties.countryCode}
              svg
              style={{
                width: "50px", // Imposta la larghezza desiderata per la bandiera
                height: "auto",
              }}
            />
            <span className="text-4xl text-white ">{name}</span>
          </div>
          <div className="flex text-white">
            <h2 className="text-xs">
              {lastUpdate ? lastUpdate[0] : "No data"}
            </h2>
            <h2 className="ml-2 text-xs">
              {lastUpdate ? lastUpdate[1] : "No data"}
            </h2>
          </div>
        </div>
        <button
          className="absolute top-0 right-0 mt-2 bg-transparent border-none cursor-pointer p-0 text-2xl text-gray-300 hover:text-gray-100"
          onClick={handleCloseButtonClick}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <div className="sidebar mr-1 h-[calc(100%-110px)] overflow-y-scroll py-4 pb-40 pt-3 sm:h-[calc(100%-130px)]">
        <div className="mr-4">
          <div className="flex w-full h-fit items-center justify-between mt-2 space-y-5">
            <div className="flex flex-col items-center">
              <div
                className="rounded-2xl p-3 flex justify-center whitespace-nowrap"
                style={{
                  backgroundColor: hexColor,
                  height: "100px",
                  width: "100px",
                }}
              >
                <h2
                  className="text-white flex mix-blend-difference text-xl items-center justify-center align-middle whitespace-nowrap"
                  style={{ color: hexColor }}
                >
                  {Math.floor(AQI * 100) / 100 != 0
                    ? Math.floor(AQI * 100) / 100
                    : "No Data"}
                </h2>
              </div>
              <h2 className="text-white text-xl">AQI</h2>
            </div>
            <div className="flex flex-col items-center">
              <HalfDoughnutChart></HalfDoughnutChart>
              <h2 className="text-white text-xl">AQI</h2>
            </div>
          </div>
          <div className="mt-10">
            <h2 className="text-white text-xl font-semibold">
              Polluttants Levels
            </h2>
            <PollsLevelsChart
              dataR={dataR}
              allDays={infos.datas}
              isState={infos.isState}
              sliderValue={sliderValue}
              colorBlind={colorBlind}
            ></PollsLevelsChart>
          </div>
          <div className="h-fit w-full mt-10 flex-col justify-between">
            <div className="flex justify-between">
              <h2 className="text-xl text-white mr-5 font-semibold">
                Air Quality:{" "}
              </h2>
              <h2 className="text-xl" style={{ color: hexColor }}>
                {airQualityText}
              </h2>
            </div>
            <div className="flex justify-between mt-5">
              <h2 className="text-xl text-white mr-5 font-semibold">
                Total Stations:{" "}
              </h2>
              <h2 className="text-xl text-white">{nStations}</h2>
            </div>
            {weatherCondition != null && infos.isState && (
              <div className="flex justify-between mt-5 items-center">
                <h2 className="text-xl text-white mr-5 font-semibold">
                  Weather:{" "}
                </h2>
                <div className="flex items-center">
                  <img
                    className=" mr-2 "
                    src={`${weatherCondition.condIcon}`}
                    width={50}
                    height={50}
                  />
                  <h2 className="text-xl text-white">{`${weatherCondition.condText}`}</h2>
                </div>
              </div>
            )}
            {cloud != null && infos.isState && (
              <div className="flex justify-between mt-5">
                <h2 className="text-xl text-white mr-5 font-semibold">
                  Cloud:{" "}
                </h2>
                <h2 className="text-xl text-white">
                  {Math.floor(cloud * 100) / 100}
                </h2>
              </div>
            )}
            {tempFeel != null && infos.isState && (
              <div className="flex justify-between mt-5">
                <h2 className="text-xl text-white mr-5 font-semibold">
                  Temp. Feel:{" "}
                </h2>
                <h2 className="text-xl text-white">{`${
                  Math.floor(tempFeel * 100) / 100
                }°`}</h2>
              </div>
            )}
            {tempReal != null && (
              <div className="flex justify-between mt-5">
                <h2 className="text-xl text-white mr-5 font-semibold">
                  Temp. Real:{" "}
                </h2>
                <h2 className="text-xl text-white">{`${
                  Math.floor(tempReal * 100) / 100
                }°`}</h2>
              </div>
            )}
            {humidity != null && (
              <div className="flex justify-between mt-5">
                <h2 className="text-xl text-white mr-5 font-semibold">
                  Humidity:{" "}
                </h2>
                <h2 className="text-xl text-white">{`${
                  Math.floor(humidity * 100) / 100
                }%`}</h2>
              </div>
            )}
          </div>
          {infos.isState ? (
            <div>
              <div className="mt-5">
                <PollsTempCorrChart
                  datas={infos.datas}
                  id={infos.id}
                  colorBlind={colorBlind}
                ></PollsTempCorrChart>
              </div>
              {/* <div className="flex-col">
                {["PM10", "PM2.5", "OZONE", "NO2", "CO", "SO2"].map(
                  (pollutant, index) => (
                    <PredictionRegression
                      datas={infos.datas}
                      id={infos.id}
                      pollutant={pollutant}
                      key={index}
                      colorBlind={colorBlind}
                    />
                  )
                )}
              </div>
              <div className="mt-5">
                <MultipleRegression
                  datas={infos.datas}
                  id={infos.id}
                  colorBlind={colorBlind}
                ></MultipleRegression>
              </div> */}
            </div>
          ) : (
            <div>
              <div className="mt-5">
                <PollsTempCorrChart
                  datas={bulkDatas}
                  id={null}
                  colorBlind={colorBlind}
                ></PollsTempCorrChart>
              </div>
              <div className="flex mt-16 items-center">
                <CorrelationMatrix
                  bulkDatas={bulkDatas}
                  colorBlind={colorBlind}
                ></CorrelationMatrix>
              </div>
              <div className="flex-col mt-10">
                <div className="flex-col items-center text-white text-xl mx-10">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 100 100"
                        xmlns="http://www.w3.org/2000/svg"
                        className="mr-3"
                      >
                        <line
                          x1="0"
                          y1="100"
                          x2="100"
                          y2="0"
                          stroke="white"
                          strokeWidth="10"
                        />
                      </svg>
                      <h2 className="mb-1">Up Line</h2>
                    </div>
                    <h2 className="mb-1">Correlation</h2>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 100 100"
                        xmlns="http://www.w3.org/2000/svg"
                        className="mr-3"
                      >
                        <line
                          x1="0"
                          y1="50"
                          x2="100"
                          y2="50"
                          stroke="white"
                          strokeWidth="10"
                        />
                      </svg>
                      <h2 className="mb-1">Straight Line</h2>
                    </div>
                    <h2 className="mb-1">No Correlation</h2>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 100 100"
                        xmlns="http://www.w3.org/2000/svg"
                        className="mr-3"
                      >
                        <line
                          x1="0"
                          y1="0"
                          x2="100"
                          y2="100"
                          stroke="white"
                          strokeWidth="10"
                        />
                      </svg>
                      <h2 className="mb-1">Down Line</h2>
                    </div>
                    <h2>Opposite Correlation</h2>
                  </div>
                </div>
                {["PM10", "PM2.5", "OZONE", "NO2", "CO", "SO2"].map(
                  (pollutant, index) => (
                    <LinearRegression
                      datas={bulkDatas}
                      pollutant={pollutant}
                      key={index}
                      colorBlind={colorBlind}
                    />
                  )
                )}
              </div>
              <div className="mt-16">
                <MultipleRegression
                  datas={bulkDatas}
                  id={null}
                  colorBlind={colorBlind}
                ></MultipleRegression>
              </div>
            </div>
          )}
        </div>
        <hr className="my-2 h-px border-none bg-gray-200/50 dark:bg-gray-700/50"></hr>
      </div>
    </div>
  );
};

export default Sidebar;
