import React from "react";

function AQIShow({ hexColor, AQI, sidebar }) {
  return (
    <div
      className={`rounded-full flex flex-col justify-center items-center ${
        sidebar ? "aqishow-sidebar" : "aqishow-popup"
      }`}
      style={{ backgroundColor: hexColor }}
    >
      <h2
        className="text-white mix-blend-difference items-center"
        style={{
          lineHeight: "1",
          margin: "0",
          padding: "0",
          fontFamily: "Poppins",
        }}
      >
        {AQI}
      </h2>
    </div>
  );
}

export default AQIShow;
