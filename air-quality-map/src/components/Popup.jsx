import React from "react";
import AQIShow from "./AQIShow";
import CountryFlag from "react-country-flag";
import PopupChart from "./PopupChart";
import { color } from "d3";

const Popup = ({
  x,
  y,
  hoveredState,
  hoveredStateColor,
  nightMode,
  colorBlindMode,
}) => {
  //console.log(hoveredState[0]);
  let hoveredState2 = null;
  let name = "";
  let AQI = 0;
  let polls = {};
  let polluttants = {
    CO: 0,
    NO2: 0,
    OZONE: 0,
    "PM2.5": 0,
    PM10: 0,
    SO2: 0,
  };
  if (hoveredState != undefined) {
    if (hoveredState[2]) {
      hoveredState2 = hoveredState[0].features[hoveredState[1]];
      hoveredState[0].features.forEach((state) => {
        const stateM = state.properties.measurements;
        Object.keys(stateM).forEach((poll) => {
          polluttants[poll] += stateM[poll].fixedValue;
        });
      });
      Object.keys(polluttants).forEach((poll) => {
        polluttants[poll] = polluttants[poll] / 50;
      });
      polls = polluttants;
      name = "USA";
      AQI = hoveredState2.properties.countryAQI;
    } else {
      hoveredState2 = hoveredState[0].features[hoveredState[1]];
      Object.keys(hoveredState2.properties.measurements).forEach((poll) => {
        polls[poll] = hoveredState2.properties.measurements[poll].fixedValue;
      });
      name = hoveredState2.properties.name;
      AQI = hoveredState2.properties.AQI;
    }
  }

  const r = Math.round(hoveredStateColor.r * 255);
  const g = Math.round(hoveredStateColor.g * 255);
  const b = Math.round(hoveredStateColor.b * 255);
  const hexColor = `#${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;

  return (
    <div
      className="popup-div flex flex-col items-center fixed pb-4 p-3 controlPanel-background backdrop-blur-2xl rounded-2xl"
      style={{ left: x + 30, top: y - 200 }}
    >
      <div className="flex items-center">
        <CountryFlag
          className="mr-3"
          countryCode={hoveredState2.properties.countryCode}
          svg
          style={{
            width: "50px", // Imposta la larghezza desiderata per la bandiera
            height: "auto",
          }}
        />
        <span className="title-text-font text-4xl text-white title-text-font">
          {name}
        </span>
      </div>
      <div className="popup-div-1 flex justify-between items-center w-full">
        <div className="popup-div-2 flex flex-col w-fit h-fit items-center mt-4 overflow-hidden space-y-4">
          <h2 className="text-white text-2xl items-center headers-text-font">
            AQI
          </h2>
          <AQIShow hexColor={hexColor} AQI={AQI} sidebar={false}></AQIShow>
        </div>
        <div className="ml-30">
          <PopupChart
            data={polls}
            nightMode={nightMode}
            colorBlindMode={colorBlindMode}
          ></PopupChart>
        </div>
      </div>
    </div>
  );
};

export default Popup;
