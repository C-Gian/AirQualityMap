import React, { useEffect, useState } from "react";
import PopupLegend from "./PopupLegend";
import ReactDOM from "react-dom";

function Legend() {
  const [showPopup, setShowPopup] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (e) => {
    setShowPopup(true);
  };

  const handleMouseLeave = () => {
    setShowPopup(false);
  };

  const handleMouseMove = (e) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const startColor = "#00D900";
  const mid1Color = "#B5B500";
  const mid2Color = "#F57300";
  const mid3Color = "#F50000";
  const mid4Color = "#83328C";
  const endColor = "#730017";

  return (
    <div
      className="m-3 p-3 h-fit w-250 bottom-0 right-0 bg-gray-700 shadow absolute z-99 cursor-default overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <h2 className="text-n text-white font-semibold">Valori AQI</h2>
      <div
        className="w-full mt-2 h-3 rounded"
        style={{
          background: `linear-gradient(to right, ${startColor}, ${mid1Color}, ${mid2Color}, ${mid3Color}, ${mid4Color}, ${endColor})`,
        }}
      ></div>
      <div className="flex items-center mt-2 justify-between">
        <span className="text-xs text-white font-medium">0</span>
        <span className="text-xs text-white font-medium">51</span>
        <span className="text-xs text-white font-medium">101</span>
        <span className="text-xs text-white font-medium">151</span>
        <span className="text-xs text-white font-medium">201</span>
        <span className="text-xs text-white font-medium">301</span>
      </div>
      {showPopup &&
        ReactDOM.createPortal(
          <PopupLegend position={mousePosition} />,
          document.getElementById("popup-portal")
        )}
    </div>
  );
}

export default Legend;
