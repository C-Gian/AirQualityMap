import React, { useEffect, useRef, useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import PollsLevelsChart from "./PollsLevelsChart";
import { connect } from "react-redux";
import { setSliderValue } from "../actions/index.js";
import { useSelector } from "react-redux";
import * as d3 from "d3";
import PollsTempCorrChart from "./PollsTempCorrChart";
import CorrelationMatrix from "./CorrelationMatrix";
import { linear } from "stats.js";
import LinearRegression from "./LinearRegression";
import MultipleRegression from "./MultipleRegression";
import CountryFlag from "react-country-flag";

const Sidebar = ({
  infos,
  onButtonClick,
  setSliderValue,
  nightMode,
  colorBlind,
}) => {
  const [name, setName] = useState("");
  const [AQI, setAQI] = useState("");
  const [lastUpdate, setLastUpdate] = useState("");
  const [dataR, setDataR] = useState(infos.datas[0].features[infos.id]);
  const [hexColor, setHexColor] = useState("");
  const [airQualityText, setAirQualityText] = useState(null);
  const [airQualityColor, setAirQualityColor] = useState(null);
  const [weatherCondition, setWeatherCondition] = useState(null);
  const [tempFeel, setTempFeel] = useState(null);
  const [tempReal, setTempReal] = useState(null);
  const [cloud, setCloud] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const sliderValue = useSelector((state) => state.sliderValue);

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

  const handleChange = (value) => {
    setDataR(infos.datas[value - 1].features[infos.id]);
    setSliderValue(value - 1);
    //setSValue(sValue - 1);
  };

  useEffect(() => {
    let colorToSet = null;
    if (!infos.isState) {
      setName("USA");
      setDataR(infos.datas[sliderValue].features[infos.id]);
      setAQI(dataR.properties.countryAQI);
      setLastUpdate(dataR.lastUpdatedMe);
      setTempReal(dataR.properties.countryTemp);
      setHumidity(dataR.properties.countryHum);
      setAirQualityText(getColoreByValore(dataR.properties.countryAQI)[0]);
      setAirQualityColor(getColoreByValore(dataR.properties.countryAQI)[1]);
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
      setLastUpdate(dataR.lastUpdatedMe);
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
      setAirQualityColor(getColoreByValore(dataR.properties.AQI)[1]);
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

  useEffect(() => {
    setDataR(infos.datas[sliderValue].features[infos.id]);
  }, [infos, nightMode, colorBlind]);

  return (
    <div
      className="sidebar h-screen w-600 p-5 z-30 fixed"
      style={{
        backgroundColor: nightMode
          ? "rgba(75 ,85 ,99, 0.7)"
          : "rgba(75 ,85 ,99, 1)",
      }}
    >
      <div className="mb-2">
        <button className="close-button" onClick={onButtonClick}>
          &#10005;
        </button>
        <div className="flex items-center">
          <CountryFlag
            className="m-5"
            countryCode={
              infos.isState
                ? dataR.properties.code
                : dataR.properties.countryCode
            }
            svg
            style={{
              width: "50px", // Imposta la larghezza desiderata per la bandiera
              height: "auto",
            }}
          />
          {/* <WorldFlag
            className="m-5"
            code={
              infos.isState
                ? dataR.properties.code
                : dataR.properties.countryCode
            }
            style={{ width: 50, height: 25 }}
          /> */}
          <span className="text-4xl text-white">{name}</span>
        </div>
      </div>
      <div
        className="sidebar p-4 overflow-y-auto h-full"
        style={{ height: `calc(100% - 4rem)` }}
      >
        <div className="flex flex-col w-fit h-fit items-center  justify-between ">
          <div className="flex w-full h-fit items-center mt-4 overflow-hidden">
            <h2 className="text-white  text-xl items-center mr-5">
              Air Quality Index (AQI):
            </h2>
            <div
              className="rounded-2xl p-3 flex items-center justify-center whitespace-nowrap"
              style={{
                backgroundColor: hexColor,
                width: Math.floor(AQI * 100) / 100 != 0 ? "60px" : "100px",
                height: "60px",
              }}
            >
              <h2 className="text-white flex mix-blend-difference text-xl items-center justify-center align-middle whitespace-nowrap">
                {Math.floor(AQI * 100) / 100 != 0
                  ? Math.floor(AQI * 100) / 100
                  : "No Data"}
              </h2>
            </div>
          </div>
          <div className="flex w-full h-fit justify-between items-center mt-3">
            <h2 className="text-white text-xl items-center mr-5">
              Last Update:
            </h2>
            <span className="text-l text-white">
              {lastUpdate ? lastUpdate : "No Data"}
            </span>
          </div>
        </div>
        <PollsLevelsChart
          dataR={dataR}
          allDays={infos.datas}
          isState={infos.isState}
          sliderValue={sliderValue}
          colorBlind={colorBlind}
        ></PollsLevelsChart>
        <div className=" mt-10 flex-col bg-slate-500 pl-5 pr-5 pt-3 pb-7">
          <h2 className="text-white text-xl font-semibold mb-2">
            7 days past data
          </h2>
          <div className="temporal-slider-container">
            <Slider
              min={1}
              max={7}
              marks={{
                1: <span className="slider-mark">1</span>,
                2: <span className="slider-mark">2</span>,
                3: <span className="slider-mark">3</span>,
                4: <span className="slider-mark">4</span>,
                5: <span className="slider-mark">5</span>,
                6: <span className="slider-mark">6</span>,
                7: <span className="slider-mark">7</span>,
              }}
              defaultValue={sliderValue + 1}
              railStyle={{ backgroundColor: "#FFF", height: 6 }}
              trackStyle={{ backgroundColor: "#FFF", height: 6 }}
              handleStyle={{
                borderColor: "#FFF",
                height: 16,
                width: 16,
                backgroundColor: "#fff",
              }}
              dotStyle={{ visibility: "hidden" }}
              activeDotStyle={{ visibility: "hidden" }}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="h-fit w-full mt-10 flex-col justify-between pl-5 pr-5">
          <div className="flex justify-between">
            <h2 className="text-xl text-white mr-5">Air Quality: </h2>
            <h2 className="text-xl" style={{ color: airQualityColor }}>
              {airQualityText}
            </h2>
          </div>
          {weatherCondition != null && infos.isState && (
            <div className="flex justify-between mt-5 items-center">
              <h2 className="text-xl text-white mr-5">Weather: </h2>
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
              <h2 className="text-xl text-white mr-5">Cloud: </h2>
              <h2 className="text-xl text-white">
                {Math.floor(cloud * 100) / 100}
              </h2>
            </div>
          )}
          {tempFeel != null && infos.isState && (
            <div className="flex justify-between mt-5">
              <h2 className="text-xl text-white mr-5">Temp. Feel: </h2>
              <h2 className="text-xl text-white">{`${
                Math.floor(tempFeel * 100) / 100
              }°`}</h2>
            </div>
          )}
          {tempReal != null && (
            <div className="flex justify-between mt-5">
              <h2 className="text-xl text-white mr-5">Temp. Real: </h2>
              <h2 className="text-xl text-white">{`${
                Math.floor(tempReal * 100) / 100
              }°`}</h2>
            </div>
          )}
          {humidity != null && (
            <div className="flex justify-between mt-5">
              <h2 className="text-xl text-white mr-5">Humidity: </h2>
              <h2 className="text-xl text-white">{`${
                Math.floor(humidity * 100) / 100
              }%`}</h2>
            </div>
          )}
        </div>
        {infos.isState && (
          <div>
            <div className="mt-5">
              <PollsTempCorrChart
                datas={infos.datas}
                id={infos.id}
                colorBlind={colorBlind}
              ></PollsTempCorrChart>
            </div>
            <div className="mt-16 mr-0 w-fit items-center justify-center">
              <CorrelationMatrix
                datas={infos.datas}
                id={infos.id}
                colorBlind={colorBlind}
              ></CorrelationMatrix>
            </div>
            <div className="pl-5 pr-5 flex-col">
              {["PM10", "PM2.5", "OZONE", "NO2", "CO", "SO2"].map(
                (pollutant, index) => (
                  <LinearRegression
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    sliderValue: state.sliderValue,
  };
};

const mapDispatchToProps = {
  setSliderValue,
};

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
