import React, { useEffect, useState } from "react";
import PopupLegend from "./PopupLegend";
import ReactDOM from "react-dom";

function Legend({ nightMode, colorBlind }) {
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

  const startColor = colorBlind ? "rgba(0, 147, 0, 1)" : "#00D900";
  const mid1Color = colorBlind ? "rgba(181, 140, 0, 1)" : "#B5B500";
  const mid2Color = colorBlind ? "rgba(245, 116, 0, 1)" : "#F57300";
  const mid3Color = colorBlind ? "rgba(245, 0, 0, 1)" : "#F50000";
  const mid4Color = colorBlind ? "rgba(131, 52, 140, 1)" : "#83328C";
  const endColor = colorBlind ? "rgba(115, 0, 23, 1)" : "#730017";

  return (
    <div
      className="m-3 p-3 h-fit w-250 bottom-0 right-0 shadow absolute z-99 cursor-default overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      style={{
        backgroundColor: nightMode
          ? "rgba(55 ,65 ,81, 0.5)"
          : "rgba(55 ,65 ,81, 1)",
      }}
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
          <PopupLegend position={mousePosition} colorBlind={colorBlind} />,
          document.getElementById("popup-portal")
        )}
    </div>
  );
}

export default Legend;
