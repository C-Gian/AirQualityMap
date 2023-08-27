import React from "react";
import AQIShow from "./AQIShow";
import CountryFlag from "react-country-flag";
import PopupChart from "./PopupChart";

const Popup = ({ x, y, hoveredState, hoveredStateColor }) => {
  //console.log(hoveredState[0]);
  let hoveredState2 = null;
  let name = "";
  let AQI = 0;
  let polls = {};
  if (hoveredState != undefined) {
    if (hoveredState[2]) {
      let polluttants = {
        CO: 0,
        NO2: 0,
        OZONE: 0,
        "PM2.5": 0,
        PM10: 0,
        SO2: 0,
      };
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
      className="flex flex-col items-center w-fit h-fit fixed pb-4 p-3 sfondo backdrop-blur-2xl rounded-2xl"
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
        <span className="text-4xl text-white ">{name}</span>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex flex-col w-fit h-fit items-center mt-4 overflow-hidden space-y-4">
          <h2 className="text-white text-2xl items-center">AQI</h2>
          <AQIShow
            hexColor={hexColor}
            AQI={AQI}
            w={100}
            h={100}
            fs={30}
          ></AQIShow>
        </div>
        <div className="ml-50">
          <PopupChart data={polls}></PopupChart>
        </div>
      </div>
    </div>
  );
};

export default Popup;
