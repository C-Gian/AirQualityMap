import React from "react";

const Popup = ({ x, y, hoveredState, hoveredStateColor }) => {
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
        <div
          className=" rounded-2xl p-3 flex items-center justify-center"
          style={{ backgroundColor: hexColor, width: "60px", height: "60px" }}
        >
          <h2 className="text-white mix-blend-difference text-2xl">
            {Math.round(AQI * 10) / 10}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default Popup;
