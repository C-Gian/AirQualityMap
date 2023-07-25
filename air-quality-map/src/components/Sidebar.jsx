import React, { useEffect, useRef, useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import SideBarChart from "./SideBarChart";
import { connect } from "react-redux";
import { setSliderValue } from "../actions/index.js";
import { useSelector } from "react-redux";
import * as d3 from "d3";

const Sidebar = ({ infos, onButtonClick, setSliderValue }) => {
  const [name, setName] = useState("");
  const [AQI, setAQI] = useState("");
  const [lastUpdate, setLastUpdate] = useState("");
  const [values, setValues] = useState([]);
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
  let countryPolluttans = {
    CO: {
      totalValue: 0,
      times: 0,
      fixedValue: 0,
    },
    NO2: {
      totalValue: 0,
      times: 0,
      fixedValue: 0,
    },
    OZONE: {
      totalValue: 0,
      times: 0,
      fixedValue: 0,
    },
    "PM2.5": {
      totalValue: 0,
      times: 0,
      fixedValue: 0,
    },
    PM10: {
      totalValue: 0,
      times: 0,
      fixedValue: 0,
    },
    SO2: {
      totalValue: 0,
      times: 0,
      fixedValue: 0,
    },
  };
  const colors = [
    "#00D900",
    "#B5B500",
    "#F57300",
    "#F50000",
    "#83328C",
    "#730017",
  ];

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
  };

  const handleChange = (value) => {
    setDataR(infos.datas[value - 1].features[infos.id]);
    setSliderValue(value - 1);
    //setSValue(sValue - 1);
  };

  useEffect(() => {
    if (!infos.isState) {
      setName("USA");
      setDataR(infos.datas[sliderValue].features[infos.id]);
      setAQI(dataR.properties.countryAQI);
      setLastUpdate(dataR.lastUpdatedMe);
      infos.datas[sliderValue].features.forEach((feature) => {
        Object.keys(feature.properties.measurements).forEach((poll) => {
          if (feature.properties.measurements[poll].fixedValue != null) {
            countryPolluttans[poll].totalValue +=
              feature.properties.measurements[poll].fixedValue;
            countryPolluttans[poll].times += 1;
          }
        });
      });
      let temp = [];
      Object.keys(countryPolluttans).forEach((key) => {
        countryPolluttans[key].fixedValue =
          countryPolluttans[key].totalValue / countryPolluttans[key].times;
        temp.push(countryPolluttans[key].fixedValue);
      });
      setValues(temp);
      setTempReal(dataR.properties.countryTemp);
      setHumidity(dataR.properties.countryHum);
      setAirQualityText(getColoreByValore(dataR.properties.countryAQI)[0]);
      setAirQualityColor(getColoreByValore(dataR.properties.countryAQI)[1]);
    } else {
      console.log("aaa", dataR);
      setName(dataR.properties.name);
      setAQI(dataR.properties.AQI);
      setLastUpdate(dataR.lastUpdatedMe);
      let temp = [];
      Object.keys(dataR.properties.measurements).forEach((key) => {
        temp.push(dataR.properties.measurements[key].fixedValue);
      });
      setValues(temp);
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
    }

    if (dataR.properties.AQI >= 301 || dataR.properties.countryAQI >= 301) {
      setHexColor("#4b0b2c");
    } else {
      let stateColorArray = null;
      if (infos.isState) {
        stateColorArray = getColorForValue(dataR.properties.AQI);
      } else {
        stateColorArray = getColorForValue(dataR.properties.countryAQI);
      }
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
      setHexColor(hc);
    }
  }, [dataR]);

  useEffect(() => {
    setDataR(infos.datas[sliderValue].features[infos.id]);
  }, [infos]);

  return (
    <div className="sidebar h-screen w-500 p-5 bg-gray-600 z-30 fixed">
      <div className="mb-2">
        <button className="close-button" onClick={onButtonClick}>
          &#10005;
        </button>
        <div className="flex items-center">
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
              className="rounded-2xl p-3 flex items-center justify-center "
              style={{
                backgroundColor: hexColor,
                width: "60px",
                height: "60px",
              }}
            >
              <h2 className="text-white flex mix-blend-difference text-xl items-center justify-center align-middle">
                {Math.floor(AQI * 100) / 100}
              </h2>
            </div>
          </div>
          <div className="flex w-full h-fit justify-between items-center mt-3">
            <h2 className="text-white text-xl items-center mr-5">
              Last Update:
            </h2>
            <span className="text-l text-white">{lastUpdate}</span>
          </div>
        </div>
        {countryPolluttans && values && (
          <SideBarChart
            values={values}
            countryPolluttans={countryPolluttans}
          ></SideBarChart>
        )}
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
        <div className="bg-black h-500 w-full mt-10 "></div>
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
