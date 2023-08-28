import React from "react";

function AQIShow({ hexColor, AQI, w, h, fs, extraAQI, extraAQIfs }) {
  return (
    <div
      className={`rounded-full flex flex-col justify-center items-center `}
      style={{ width: w, height: h, backgroundColor: hexColor }}
    >
      {extraAQI && (
        <h2
          className="text-white mix-blend-difference items-center font-bold uppercase"
          style={{
            lineHeight: "1",
            margin: "0",
            padding: "0",
            fontSize: extraAQIfs,
          }}
        >
          {extraAQI}
        </h2>
      )}
      <h2
        className="text-white mix-blend-difference items-center normal-text-font"
        style={{ lineHeight: "1", margin: "0", padding: "0", fontSize: fs }}
      >
        {AQI}
      </h2>
    </div>
  );
}

export default AQIShow;
