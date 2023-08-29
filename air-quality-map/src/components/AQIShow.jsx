import React from "react";

function AQIShow({ hexColor, AQI, w, h, fs, nightMode }) {
  return (
    <div
      className={`rounded-full flex flex-col justify-center items-center `}
      style={{ width: w, height: h, backgroundColor: hexColor }}
    >
      <h2
        className="text-white mix-blend-difference items-center"
        style={{
          lineHeight: "1",
          margin: "0",
          padding: "0",
          fontSize: fs,
          fontFamily: "Poppins",
        }}
      >
        {AQI}
      </h2>
    </div>
  );
}

export default AQIShow;
