import React, { useEffect, useState } from "react";
import { setLayerToShow } from "../actions/index.js";
import { useDispatch, useSelector } from "react-redux";

function Toolbar({
  nightMode,
  onNightModeClick,
  onColorBlindClick,
  onZoomInClick,
  onCenterClick,
  onZoomOutClick,
}) {
  const dispatch = useDispatch();
  const currentLayer = useSelector((state) => state.currentLayer);
  const layerToShow = useSelector((state) => state.layerToShow);
  const [dotsActive, setDotsActive] = useState(false);
  const [currentLayerBool, setCurrentLayerBool] = useState(
    currentLayer == "country" || dotsActive
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [checkedItem, setCheckedItem] = useState(layerToShow);

  const handleMenuOpen = () => {
    if (!currentLayerBool) {
      setIsMenuOpen(true);
    }
  };

  const handleDotsButtonClick = () => {
    if (dotsActive) {
      setDotsActive(false);
      setCheckedItem("AQI");
      setCurrentLayerBool(false);
    } else {
      setDotsActive(true);
      setCheckedItem("DOTS");
      setCurrentLayerBool(true);
    }
  };

  const handleMenuClose = () => {
    setIsMenuOpen(false);
    setCheckedItem("AQI");
    //dispatch(setLayerToShow(checkedItem));
  };

  const handleCheckboxChange = (optionKey) => {
    setCheckedItem(optionKey);
  };

  const options = {
    "PM2.5": "Large Particles - PM 2.5",
    PM10: "Small Particles - PM 10",
    OZONE: "Ozone - OZONE",
    NO2: "Nitrogen Dyoxide - NO2",
    SO2: "Sulfur Dyoxide - SO2",
    CO: "Carbon Monoxide - CO",
    AQI: "General AQI",
  };

  useEffect(() => {
    dispatch(setLayerToShow(checkedItem));
  }, [checkedItem]);

  useEffect(() => {
    setCurrentLayerBool(currentLayer == "country" || dotsActive);
  }, [currentLayer]);

  return (
    <div
      className="flex mr-3 absolute w-fit p-3 h-fit rounded-xl right-0 items-center justify-between"
      style={{
        bottom: "110px",
        backgroundColor: nightMode
          ? "rgba(55 ,65 ,81, 0.5)"
          : "rgba(128, 128, 128, 0.5)",
      }}
    >
      <div className="flex mr-2">
        <div className="tooltip-container mr-1">
          <button
            className="bg-white p-1 rounded flex items-center tooltip-btn"
            onClick={onNightModeClick}
          >
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
                d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
              />
            </svg>
          </button>
          <span className="tooltip-text p-2">Modalità Notte</span>
        </div>
        <div className="tooltip-container">
          <button
            className="bg-white p-1 rounded flex items-center tooltip-btn"
            onClick={onColorBlindClick}
          >
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
                d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z"
              />
            </svg>
          </button>
          <span className="tooltip-text p-2">Modalità Daltonici</span>
        </div>
      </div>

      <div className="flex w-fit justify-between">
        <div
          className={`mr-1 tooltip-container ${
            currentLayerBool ? "disabled-div" : ""
          }`}
        >
          <button
            className="bg-white p-1 rounded flex items-center tooltip-btn"
            onMouseEnter={handleMenuOpen}
            onMouseLeave={handleMenuClose}
          >
            <svg
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 421.59 421.59"
            >
              <g>
                <g>
                  <path
                    d="M400.491,291.098l-58.865-36.976l58.864-36.971c2.185-1.372,3.511-3.771,3.511-6.351s-1.326-4.979-3.511-6.352
			l-58.865-36.977l58.862-36.973c2.185-1.373,3.511-3.771,3.511-6.351s-1.326-4.979-3.511-6.351L214.783,1.149
			c-2.438-1.532-5.54-1.532-7.979,0L21.1,117.796c-2.185,1.373-3.511,3.771-3.511,6.351c0,2.58,1.326,4.979,3.511,6.351
			l58.861,36.972l-58.859,36.978c-2.185,1.373-3.51,3.771-3.51,6.351c0,2.58,1.326,4.979,3.511,6.351l58.859,36.97l-58.859,36.979
			c-2.185,1.372-3.51,3.771-3.51,6.351c0,2.58,1.326,4.979,3.511,6.351l185.7,116.64c1.22,0.766,2.604,1.149,3.989,1.149
			s2.77-0.383,3.989-1.149L400.491,303.8c2.185-1.372,3.511-3.771,3.511-6.351C404.002,294.869,402.676,292.47,400.491,291.098z
			 M39.189,124.147l171.605-107.79l171.604,107.79l-171.604,107.79L39.189,124.147z M39.191,210.798l54.869-34.471l112.744,70.818
			c1.219,0.766,2.604,1.149,3.989,1.149c1.385,0,2.77-0.383,3.989-1.149l112.742-70.817l54.875,34.47L210.792,318.582
			L39.191,210.798z M210.792,405.232L39.191,297.448l54.87-34.472l112.742,70.814c1.22,0.766,2.604,1.149,3.989,1.149
			s2.77-0.383,3.989-1.149l112.744-70.812l54.876,34.47L210.792,405.232z"
                  />
                </g>
              </g>
            </svg>
          </button>
          {isMenuOpen && (
            <div
              className="absolute bg-white border border-gray-300 rounded shadow w-300 cursor-pointer"
              style={{
                top: "-310px",
                right: "0px",
              }}
              onMouseEnter={handleMenuOpen}
              onMouseLeave={handleMenuClose}
            >
              {Object.keys(options).map((optionKey) => (
                <div
                  key={optionKey}
                  className={`flex items-center space-x-2 font-semibold pt-2 pb-2 text-xl cursor-pointer ${
                    checkedItem === optionKey ? "bg-blue-300" : "" // Aggiungiamo la classe 'selected' se l'opzione è selezionata
                  }`}
                  onClick={() => handleCheckboxChange(optionKey)}
                >
                  {/* <input
                  type="checkbox"
                  className="w-4 h-4"
                  checked={checkedItem === optionKey}
                  onChange={() => handleCheckboxChange(optionKey)}
                /> */}
                  <span className="ml-2 select-none pl-2 pr-2">
                    {options[optionKey]}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div
          className={`mr-1 tooltip-container ${
            currentLayerBool ? "disabled-div" : ""
          }`}
        >
          <button className="bg-white p-1 rounded flex items-center tooltip-btn">
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
                d="M2.25 6L9 12.75l4.286-4.286a11.948 11.948 0 014.306 6.43l.776 2.898m0 0l3.182-5.511m-3.182 5.51l-5.511-3.181"
              />
            </svg>
          </button>
          <span className="tooltip-text p-2">Wind</span>
        </div>

        <div className={`mr-2 tooltip-container `}>
          <button
            className="bg-white p-1 rounded flex items-center tooltip-btn"
            onClick={handleDotsButtonClick}
          >
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
                d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
          <span className="tooltip-text p-2">Circle Layer</span>
        </div>
      </div>

      <div className="flex items-center">
        <div className="tooltip-container">
          <button
            className="bg-white p-1 flex items-center tooltip-btn  rounded-l"
            onClick={onZoomInClick}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </button>
          <span className="tooltip-text p-2">Zoom In</span>
        </div>
        <div className="tooltip-container">
          <button
            className="bg-white p-1 flex items-center tooltip-btn"
            onClick={onCenterClick}
          >
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
                d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
              />
            </svg>
          </button>
          <span className="tooltip-text p-2">Go to Center</span>
        </div>
        <div className="tooltip-container">
          <button
            className="bg-white mt-1 mb-1 p-1 flex items-center tooltip-btn rounded-r"
            onClick={onZoomOutClick}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={3}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 12h-15"
              />
            </svg>
          </button>
          <span className="tooltip-text p-2">Zoom Out</span>
        </div>
      </div>
    </div>
  );
}

export default Toolbar;
