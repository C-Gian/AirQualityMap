import React from "react";
import AQIShow from "./AQIShow";
import CountryFlag from "react-country-flag";

const Popup = ({ x, y, hoveredState, hoveredStateColor }) => {
  //console.log(hoveredState[0]);
  let name = "";
  let AQI = 0;
  if (hoveredState != undefined) {
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
      <div className="flex items-center">
        <CountryFlag
          className="mr-3"
          countryCode={hoveredState[0].properties.countryCode}
          svg
          style={{
            width: "50px", // Imposta la larghezza desiderata per la bandiera
            height: "auto",
          }}
        />
        <span className="text-4xl text-white ">{name}</span>
      </div>
      <div className="flex justify-between items-center">
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
        <div>dawdawdwa</div>
      </div>
    </div>
  );
};

export default Popup;
