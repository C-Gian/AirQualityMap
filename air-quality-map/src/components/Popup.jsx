import React from "react";
import AQIShow from "./AQIShow";

const Popup = ({ x, y, hoveredState, hoveredStateColor }) => {
  //console.log(hoveredState[0]);
  let name = "";
  let lastUpdatedMe = "";
  let AQI = 0;
  if (hoveredState != undefined) {
    lastUpdatedMe = hoveredState[0].lastUpdatedMe;
    if (hoveredState[1]) {
      name = "USA";
      AQI = hoveredState[0].properties.countryAQI;
    } else {
      name = hoveredState[0].properties.name;
      AQI = hoveredState[0].properties.AQI;
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
      className="flex flex-col items-center w-fit h-fit fixed pb-4 p-3 bg-gray-600"
      style={{ left: x + 30, top: y - 200 }}
    >
      <div>
        <h2 className="text-white text-2xl">{name}</h2>
        <h2 className="text-white opacity-70 text-xs">{lastUpdatedMe}</h2>
      </div>
      <div className="flex flex-col w-fit h-fit items-center mt-4 overflow-hidden">
        <h2 className="text-white text-l items-center">AQI</h2>
        <AQIShow
          hexColor={hexColor}
          AQI={AQI}
          w={100}
          h={100}
          fs={30}
        ></AQIShow>
      </div>
    </div>
  );
};

export default Popup;
