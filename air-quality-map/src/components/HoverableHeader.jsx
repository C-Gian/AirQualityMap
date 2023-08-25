import React, { useState } from "react";

const HoverableHeader = ({ title, toShow }) => {
  const [showExpl, setShowExpl] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (event) => {
    setShowExpl(true);
    setTooltipPosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseLeave = () => {
    setShowExpl(false);
  };

  return (
    <div>
      <h2
        className="text-white text-2xl font-semibold mb-5 w-fit hover:text-blue-300 hover:underline cursor-pointer"
        onMouseEnter={(event) => handleMouseEnter(event)}
        onMouseLeave={handleMouseLeave}
      >
        {title}
      </h2>
      {showExpl && (
        <div>
          {toShow == "PollsTempCorrChart" && (
            <div
              className="w-200 h-200 bg-blue-500 absolute text-white p-5 border border-r-2 text-xl z-20"
              style={{
                left: tooltipPosition.x + "px",
                top: tooltipPosition.y + "px",
              }}
            >
              PollsTempCorrChart
            </div>
          )}
          {toShow == "CorrelationMatrix" && (
            <div
              className="w-200 h-200 bg-blue-500 absolute text-white p-5 border border-r-2 text-xl z-20"
              style={{
                top: tooltipPosition.y + "px",
                left: tooltipPosition.x + "px",
              }}
            >
              CorrelationMatrix
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HoverableHeader;
