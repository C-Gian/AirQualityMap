import React from "react";

const Popup = ({ x, y, hoveredState, hoveredStateColor }) => {
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
        <h2 className="text-white text-2xl">{hoveredState.properties.name}</h2>
        <h2 className="text-white opacity-70 text-xs">
          {hoveredState.lastUpdatedMe}
        </h2>
      </div>
      <div className="flex flex-col w-fit h-fit items-center mt-4 overflow-hidden">
        <h2 className="text-white text-l items-center">AQI</h2>
        <div className=" rounded-2xl p-3" style={{ backgroundColor: hexColor }}>
          <h2 className="text-white text-2xl">
            {Math.round(hoveredState.properties.AQI * 10) / 10}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default Popup;
