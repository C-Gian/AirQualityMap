import React, { useState } from "react";

const HoverableHeader = ({ title }) => {
  const [showExpl, setShowExpl] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (event) => {
    setShowExpl(true);
    setTooltipPosition({ x: event.clientX + 50, y: event.clientY });
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
          {title == "Levels Comparation [Temperature - Polluttants]" && (
            <div
              className="w-400 h-150 absolute text-white p-5 text-xl z-20 space-y-3 rounded-2xl"
              style={{
                top: tooltipPosition.y - 200 + "px",
                left: tooltipPosition.x + "px",
                backgroundColor: "rgba(48, 58, 62, 1)",
              }}
            >
              <h2 className="normal-text-font" style={{ fontSize: 18 }}>
                Interactive chart to visually demonstrates a correlation between
                temperature and all pollutants
              </h2>
            </div>
          )}
          {title == "Correlation Matrix" && (
            <div
              className="w-400 h-200  absolute text-white p-5 text-xl z-20 space-y-3  rounded-2xl"
              style={{
                top: tooltipPosition.y - 300 + "px",
                left: tooltipPosition.x + "px",
                backgroundColor: "rgba(48, 58, 62, 1)",
              }}
            >
              <h2 className="normal-text-font" style={{ fontSize: 18 }}>
                Shows the correlation between temperature and each pollutant.
              </h2>
              <div className="flex flex-col w-full">
                <div
                  className=" text-white flex justify-between"
                  style={{ fontSize: 17 }}
                >
                  Value Near 1:
                  <div className="flex space-x-2">
                    <h2>Strong Correlation</h2>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-arrows-up"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                      <path d="M17 3l0 18"></path>
                      <path d="M4 6l3 -3l3 3"></path>
                      <path d="M20 6l-3 -3l-3 3"></path>
                      <path d="M7 3l0 18"></path>
                    </svg>
                  </div>
                </div>
                <div
                  className=" text-white flex justify-between"
                  style={{ fontSize: 17 }}
                >
                  Value Near 0:
                  <div className="flex space-x-2">
                    <h2>No Correlation</h2>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                      />
                    </svg>
                  </div>
                </div>
                <div
                  className=" text-white flex justify-between"
                  style={{ fontSize: 17 }}
                >
                  Value Near -1:
                  <div className="flex space-x-2">
                    <h2>Opposite Correlation</h2>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-arrows-down-up"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                      <path d="M17 3l0 18"></path>
                      <path d="M10 18l-3 3l-3 -3"></path>
                      <path d="M7 21l0 -18"></path>
                      <path d="M20 6l-3 -3l-3 3"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          )}
          {title == "Linear Regression" && (
            <div
              className="w-500 h-300 absolute text-white p-5 text-xl z-20 space-y-3 rounded-2xl"
              style={{
                top: tooltipPosition.y - 300 + "px",
                left: tooltipPosition.x + "px",
                backgroundColor: "rgba(48, 58, 62, 1)",
              }}
            >
              <h2 className="normal-text-font" style={{ fontSize: 18 }}>
                Each chart shows the correlation between a polluttant and the
                temperature, quantifies the strength and the direction of their
                relationship using a straight line. This technique helps
                understand how changes in one variable relate to changes in the
                other.
              </h2>
              <div className="flex-col items-center text-white text-xl mx-10">
                <div
                  className="flex justify-between items-center"
                  style={{ fontSize: 17 }}
                >
                  <div className="flex items-center">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 100 100"
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-3"
                    >
                      <line
                        x1="0"
                        y1="100"
                        x2="100"
                        y2="0"
                        stroke="white"
                        strokeWidth="10"
                      />
                    </svg>
                    <h2 className="normal-text-font  mb-1">Up Line</h2>
                  </div>
                  <h2 className="normal-text-font  mb-1">Correlation</h2>
                </div>
                <div
                  className="flex justify-between items-center"
                  style={{ fontSize: 17 }}
                >
                  <div className="flex items-center">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 100 100"
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-3"
                    >
                      <line
                        x1="0"
                        y1="50"
                        x2="100"
                        y2="50"
                        stroke="white"
                        strokeWidth="10"
                      />
                    </svg>
                    <h2 className="normal-text-font  mb-1">Straight Line</h2>
                  </div>
                  <h2 className="normal-text-font  mb-1">No Correlation</h2>
                </div>
                <div
                  className="flex justify-between items-center"
                  style={{ fontSize: 17 }}
                >
                  <div className="flex items-center">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 100 100"
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-3"
                    >
                      <line
                        x1="0"
                        y1="0"
                        x2="100"
                        y2="100"
                        stroke="white"
                        strokeWidth="10"
                      />
                    </svg>
                    <h2 className="normal-text-font  mb-1">Down Line</h2>
                  </div>
                  <h2>Opposite Correlation</h2>
                </div>
              </div>
            </div>
          )}
          {title == "Multiple Regression" && (
            <div
              className="w-400 h-150 absolute text-white p-5 text-xl z-20 space-y-3  rounded-2xl"
              style={{
                top: tooltipPosition.y - 200 + "px",
                left: tooltipPosition.x + "px",
                backgroundColor: "rgba(48, 58, 62, 1)",
              }}
            >
              <h2 className="normal-text-font" style={{ fontSize: 18 }}>
                This interactive chart performs multiple regression analysis to
                understand the impact of different combinations of pollutants on
                temperature
              </h2>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HoverableHeader;
