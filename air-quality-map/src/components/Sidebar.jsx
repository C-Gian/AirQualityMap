import React, { useEffect, useRef } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import SideBarChart from "./SideBarChart";

const Sidebar = ({ infos, onButtonClick, onSliderChange }) => {
  const handleSliderChange = (value) => {
    onSliderChange(value);
  };
  let name = "";
  let AQI = "";
  let lastUpdate = "";
  let values = [];
  let dataR = null;
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
  if (Object.keys(infos.stato)[0] == "USA") {
    name = "USA";
    dataR = infos.stato["USA"];
    AQI = dataR.features[0].properties.countryAQI;
    lastUpdate = dataR.features[0].lastUpdatedMe;
    dataR.features.forEach((feature) => {
      Object.keys(feature.properties.measurements).forEach((poll) => {
        if (feature.properties.measurements[poll].fixedValue != null) {
          countryPolluttans[poll].totalValue +=
            feature.properties.measurements[poll].fixedValue;
          countryPolluttans[poll].times += 1;
        }
      });
    });
    Object.keys(countryPolluttans).forEach((key) => {
      countryPolluttans[key].fixedValue =
        countryPolluttans[key].totalValue / countryPolluttans[key].times;
      values.push(countryPolluttans[key].fixedValue);
    });
  } else {
    name = infos.stato.properties.name;
    AQI = infos.stato.properties.AQI;
    lastUpdate = infos.stato.lastUpdatedMe;
    Object.keys(infos.stato.properties.measurements).forEach((key) => {
      values.push(infos.stato.properties.measurements[key].fixedValue);
    });
  }
  const colorToColor = infos.colore;
  const r = Math.round(colorToColor.r * 255);
  const g = Math.round(colorToColor.g * 255);
  const b = Math.round(colorToColor.b * 255);
  const hexColor = `#${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;

  return (
    <div className="w-400 h-full p-5 bg-gray-600 z-30 fixed">
      <button className="close-button" onClick={onButtonClick}>
        &#10005;
      </button>
      <div className="flex items-center">
        <span className="text-4xl text-white">{name}</span>
      </div>
      <div className="flex flex-col w-fit h-fit items-center  justify-between ">
        <div className="flex w-full h-fit items-center mt-4 overflow-hidden">
          <h2 className="text-white  text-xl items-center mr-5">
            Air Quality Index (AQI):
          </h2>
          <div
            className="rounded-2xl p-3 flex items-center justify-center "
            style={{ backgroundColor: hexColor, width: "60px", height: "60px" }}
          >
            <h2 className="text-white flex mix-blend-difference text-xl items-center justify-center align-middle">
              {AQI}
            </h2>
          </div>
        </div>
        <div className="flex w-full h-fit justify-between items-center mt-3">
          <h2 className="text-white text-xl items-center mr-5">Last Update:</h2>
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
            defaultValue={1}
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
            onChange={handleSliderChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
