import React, { useEffect, useState } from "react";
import {
  setLayerToShow,
  setWind,
  setWindHeatmap,
  set3DMap,
} from "../actions/index.js";
import { useDispatch, useSelector } from "react-redux";

function Toolbar({ onRefreshButton, refreshIsLoading }) {
  const dispatch = useDispatch();
  const currentLayer = useSelector((state) => state.currentLayer);
  const layerToShow = useSelector((state) => state.layerToShow);
  const wind = useSelector((state) => state.wind);
  const windHeatmap = useSelector((state) => state.windHeatmap);
  const map3d = useSelector((state) => state.map3d);
  const nightMode = useSelector((state) => state.nightMode);
  const colorBlindMode = useSelector((state) => state.colorBlindMode);
  const [dotsActive, setDotsActive] = useState(false);
  const [heatCircleActive, setHeatCircleActive] = useState("NONE");
  const [heatmapActive, setHeatmapActive] = useState(false);
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

  const handleMenuClose = () => {
    setIsMenuOpen(false);
    setCheckedItem("AQI");
    //dispatch(setLayerToShow(checkedItem));
  };

  const handleHeatCircleClick = () => {
    switch (heatCircleActive) {
      case "NONE":
        setHeatCircleActive("HEAT");
        setCheckedItem("HEAT");
        break;
      case "HEAT":
        setHeatCircleActive("DOTS");
        setCheckedItem("DOTS");
        break;
      case "DOTS":
        setHeatCircleActive("NONE");
        setCheckedItem("AQI");
        break;
    }
  };

  const handleCheckboxChange = (optionKey) => {
    setCheckedItem(optionKey);
  };

  const handleWindButtonClick = () => {
    dispatch(setWind(!wind));
  };

  const handleWindHeatmapButtonClick = () => {
    dispatch(setWindHeatmap(!windHeatmap));
  };

  const handle3DButtonClick = () => {
    dispatch(set3DMap(!map3d));
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
      className="flex mr-3 absolute w-250 p-3 h-fit rounded-xl right-0 items-center"
      style={{
        bottom: "110px",
        backgroundColor: nightMode
          ? "rgba(55 ,65 ,81, 0.5)"
          : "rgba(128, 128, 128, 0.5)",
      }}
    >
      <div className="flex w-full justify-around">
        <div className={`tooltip-container `}>
          <button
            className="bg-white p-1 rounded flex items-center tooltip-btn"
            onClick={onRefreshButton}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className={`w-6 h-6 ${refreshIsLoading ? "rotate" : ""}`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
          </button>
          <span className="tooltip-text p-2">3D Map</span>
        </div>

        <div
          className={`tooltip-container ${
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

        <div className={`tooltip-container ${map3d ? "disabled-div" : ""}`}>
          <button
            className="bg-white p-1 rounded flex items-center tooltip-btn"
            onClick={handleWindButtonClick}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-wind"
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
              <path d="M5 8h8.5a2.5 2.5 0 1 0 -2.34 -3.24"></path>
              <path d="M3 12h15.5a2.5 2.5 0 1 1 -2.34 3.24"></path>
              <path d="M4 16h5.5a2.5 2.5 0 1 1 -2.34 3.24"></path>
            </svg>
          </button>
          <span className="tooltip-text p-2">Wind</span>
        </div>

        <div className={`tooltip-container ${map3d ? "disabled-div" : ""}`}>
          <button
            className="bg-white p-1 rounded flex items-center tooltip-btn"
            onClick={handleWindHeatmapButtonClick}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-sun-wind"
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
              <path d="M14.468 10a4 4 0 1 0 -5.466 5.46"></path>
              <path d="M2 12h1"></path>
              <path d="M11 3v1"></path>
              <path d="M11 20v1"></path>
              <path d="M4.6 5.6l.7 .7"></path>
              <path d="M17.4 5.6l-.7 .7"></path>
              <path d="M5.3 17.7l-.7 .7"></path>
              <path d="M15 13h5a2 2 0 1 0 0 -4"></path>
              <path d="M12 16h5.714l.253 0a2 2 0 0 1 2.033 2a2 2 0 0 1 -2 2h-.286"></path>
            </svg>
          </button>
          <span className="tooltip-text p-2">Wind Heatmap</span>
        </div>

        <div className={`tooltip-container `}>
          <button
            className="bg-white p-1 rounded flex items-center tooltip-btn"
            onClick={handle3DButtonClick}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-badge-3d"
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
              <path d="M3 5m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z"></path>
              <path d="M7 9.5a.5 .5 0 0 1 .5 -.5h1a1.5 1.5 0 0 1 0 3h-.5h.5a1.5 1.5 0 0 1 0 3h-1a.5 .5 0 0 1 -.5 -.5"></path>
              <path d="M14 9v6h1a2 2 0 0 0 2 -2v-2a2 2 0 0 0 -2 -2h-1z"></path>
            </svg>
          </button>
          <span className="tooltip-text p-2">3D Map</span>
        </div>

        <div className={`tooltip-container `}>
          <button
            className="bg-white p-1 rounded flex items-center tooltip-btn"
            onClick={handleHeatCircleClick}
          >
            {heatCircleActive == "NONE" && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="black"
                viewBox="0 0 256 256"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path d="M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM48,208V59.31L196.69,208ZM59.31,48H208V196.7Z"></path>
              </svg>
            )}
            {heatCircleActive == "HEAT" && (
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
                  d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                />
              </svg>
            )}
            {heatCircleActive == "DOTS" && (
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
                  d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}
          </button>
          {heatCircleActive == "NONE" && (
            <span className="tooltip-text p-2">None</span>
          )}
          {heatCircleActive == "HEAT" && (
            <span className="tooltip-text p-2">Heat Map</span>
          )}
          {heatCircleActive == "DOTS" && (
            <span className="tooltip-text p-2">Dots Map</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default Toolbar;
