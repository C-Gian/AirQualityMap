import React from "react";

function AQIShow({ hexColor, AQI, w, h, fs }) {
  return (
    <div
      className="rounded-full flex justify-center items-center"
      style={{ width: w, height: h, backgroundColor: hexColor }}
    >
      <h2
        className="text-white mix-blend-difference items-center"
        style={{ lineHeight: "1", margin: "0", padding: "0", fontSize: fs }}
      >
        {AQI}
      </h2>
    </div>
  );
}

export default AQIShow;
