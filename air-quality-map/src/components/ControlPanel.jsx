import React, { useEffect, useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import {
  setSliderValue,
  setLayerToShow,
  setWind,
  setWindHeatmap,
  set3DMap,
} from "../actions/index.js";
import { useSelector, useDispatch } from "react-redux";

function ControlPanel({ onRefreshButton, refreshIsLoading }) {
  const dispatch = useDispatch();
  const currentLayer = useSelector((state) => state.currentLayer);
  const layerToShow = useSelector((state) => state.layerToShow);
  const wind = useSelector((state) => state.wind);
  const windHeatmap = useSelector((state) => state.windHeatmap);
  const map3d = useSelector((state) => state.map3d);
  const nightMode = useSelector((state) => state.nightMode);
  const colorBlindMode = useSelector((state) => state.colorBlindMode);
  const [heatCircleActive, setHeatCircleActive] = useState("NONE");
  const [currentLayerBool, setCurrentLayerBool] = useState(
    currentLayer == "country" || heatCircleActive == "DOTS"
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [checkedItem, setCheckedItem] = useState(layerToShow);
  const [selectedDay, setSelectedDay] = useState("Today");
  const sliderValue = useSelector((state) => state.sliderValue);

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
    setCurrentLayerBool(
      currentLayer == "country" || heatCircleActive == "DOTS"
    );
  }, [currentLayer]);

  const handleChange = (value) => {
    dispatch(setSliderValue(value - 1));
  };

  function calculateScaledDate(daysToSubtract) {
    const currentDate = new Date();

    // Calcola il numero totale di giorni da sottrarre
    const totalDaysToSubtract =
      currentDate.getDate() >= daysToSubtract
        ? daysToSubtract
        : currentDate.getDate() + daysToSubtract;
    currentDate.setDate(currentDate.getDate() - totalDaysToSubtract);

    /* // Formatta la data in modo leggibile (esempio: "2023-08-05")
    const formattedDate = currentDate.toISOString().split("T")[0]; */
    return currentDate;
  }

  function formatDateAsDMY(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1; // Aggiungi 1 perché i mesi sono indicizzati da 0 a 11
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }

  useEffect(() => {
    const scaledDate = calculateScaledDate(sliderValue);
    if (sliderValue != 0) {
      setSelectedDay(formatDateAsDMY(scaledDate));
    } else {
      setSelectedDay("Today");
    }
  }, [sliderValue]);

  const startColor = colorBlindMode ? "rgba(0, 147, 0, 1)" : "#00D900";
  const mid1Color = colorBlindMode ? "rgba(181, 140, 0, 1)" : "#B5B500";
  const mid2Color = colorBlindMode ? "rgba(245, 116, 0, 1)" : "#F57300";
  const mid3Color = colorBlindMode ? "rgba(245, 0, 0, 1)" : "#F50000";
  const mid4Color = colorBlindMode ? "rgba(131, 52, 140, 1)" : "#83328C";
  const endColor = colorBlindMode ? "rgba(115, 0, 23, 1)" : "#730017";

  return (
    <div
      className={`absolute flex flex-col bottom-0 right-0 m-3 `}
      style={{
        zIndex: 300,
        width: "450px",
        height: "fit-content",
      }}
    >
      <div
        className={`flex flex-col p-5 shadow-md rounded-2xl ${
          nightMode
            ? "cp-background-night backdrop-blur-2xl"
            : "cp-background-light backdrop-blur-2xl"
        }`}
      >
        <div className="flex justify-between">
          <div className="flex space-x-1">
            <div
              className={`tooltip-container shadow-md`}
              style={{ width: 40, height: 40 }}
            >
              <button
                className={`p-1 w-full h-full justify-center rounded flex items-center tooltip-btn shadow-md ${
                  nightMode
                    ? "button-colors-nightmode"
                    : "button-colors-lightmode"
                }`}
                onClick={onRefreshButton}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke={`${nightMode ? "white" : "rgb(51, 51, 51)"}`}
                  className={`w-7 h-7 ${refreshIsLoading ? "rotate" : ""}`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                  />
                </svg>
              </button>
              <span className="tooltip-text p-2">Refresh Data</span>
            </div>

            <div
              className={`tooltip-container shadow-md ${
                currentLayerBool ? "disabled-div" : ""
              }`}
              style={{ width: 40, height: 40 }}
            >
              <button
                className={`p-1 w-full h-full justify-center rounded flex items-center tooltip-btn ${
                  nightMode
                    ? "button-colors-nightmode"
                    : "button-colors-lightmode"
                }
            `}
                onMouseEnter={handleMenuOpen}
                onMouseLeave={handleMenuClose}
              >
                <svg
                  strokeWidth={2}
                  stroke={`${nightMode ? "white" : "rgb(51, 51, 51)"}`}
                  fill={`${nightMode ? "white" : "rgb(51, 51, 51)"}`}
                  className="w-7 h-7"
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
                  className={`absolute rounded shadow w-300 cursor-pointer`}
                  style={{
                    top: "-310px",
                    right: "0px",
                    backgroundColor: nightMode ? "rgb(45,56,61)" : "#FFF",
                  }}
                  onMouseEnter={handleMenuOpen}
                  onMouseLeave={handleMenuClose}
                >
                  {Object.keys(options).map((optionKey) => (
                    <div
                      key={optionKey}
                      className={`flex items-center space-x-2 pt-2 pb-2 text-xl cursor-pointer `}
                      style={{
                        backgroundColor:
                          checkedItem === optionKey
                            ? "rgba(255, 0, 0, 0.5)"
                            : "",
                        fontFamily: "Poppins",
                        color: nightMode ? "#FFF" : "#333",
                      }}
                      onClick={() => handleCheckboxChange(optionKey)}
                    >
                      <span className="ml-2 select-none pl-2 pr-2">
                        {options[optionKey]}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div
              className={`tooltip-container shadow-md  ${
                map3d ? "disabled-div" : ""
              }`}
              style={{ width: 40, height: 40 }}
            >
              <button
                className={`p-1 w-full h-full justify-center rounded flex items-center tooltip-btn shadow-md  ${
                  nightMode
                    ? "button-colors-nightmode"
                    : "button-colors-lightmode"
                }
            `}
                onClick={handleWindButtonClick}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`icon icon-tabler icon-tabler-wind w-7 h-7 ${
                    (nightMode ? "night-mode" : "",
                    wind ? "wind-animation" : "")
                  }`}
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke={`${nightMode ? "white" : "rgb(51, 51, 51)"}`}
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
          </div>

          <div
            className={`flex w-full mx-2 items-center justify-center rounded shadow-md ${
              nightMode ? "button-colors-nightmode" : "button-colors-lightmode"
            }
            `}
          >
            <h2
              className={`items-center px-1 text-l select-none light-text-font uppercase ${
                nightMode ? "text-white" : "light-mode-text-color"
              }
            `}
            >
              {selectedDay}
            </h2>
          </div>

          <div className="flex space-x-1">
            <div
              className={`tooltip-container shadow-md ${
                map3d ? "disabled-div" : ""
              }`}
              style={{ width: 40, height: 40 }}
            >
              <button
                className={`w-full h-full justify-center p-1 rounded flex items-center tooltip-btn shadow-md ${
                  nightMode
                    ? "button-colors-nightmode"
                    : "button-colors-lightmode"
                }
            `}
                onClick={handleWindHeatmapButtonClick}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`icon icon-tabler icon-tabler-sun-wind w-7 h-7 ${
                    (nightMode ? "night-mode" : "",
                    windHeatmap ? "windheatmap-animation" : "")
                  }`}
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke={`${nightMode ? "white" : "rgb(51, 51, 51)"}`}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M14.468 10a4 4 0 1 0 -5.466 5.46"></path>
                  <path d="M15 13h5a2 2 0 1 0 0 -4"></path>
                  <path d="M12 16h5.714l.253 0a2 2 0 0 1 2.033 2a2 2 0 0 1 -2 2h-.286"></path>
                  <path d="M2 12h1"></path>
                  <path d="M11 3v1"></path>
                  <path d="M11 20v1"></path>
                  <path d="M4.6 5.6l.7 .7"></path>
                  <path d="M17.4 5.6l-.7 .7"></path>
                  <path d="M5.3 17.7l-.7 .7"></path>
                </svg>
              </button>
              <span className="tooltip-text p-2">Wind Heatmap</span>
            </div>

            <div
              className={`tooltip-container shadow-md `}
              style={{ width: 40, height: 40 }}
            >
              <button
                className={`w-full h-full rounded tooltip-btn shadow-md flex items-center justify-center ${
                  nightMode
                    ? "button-colors-nightmode"
                    : "button-colors-lightmode"
                }
            `}
                onClick={handle3DButtonClick}
              >
                {!map3d ? (
                  <h2
                    className={` normal-text-font ${
                      nightMode ? "text-white" : "light-mode-text-color"
                    }
                  `}
                    style={{ fontSize: 20 }}
                  >
                    2D
                  </h2>
                ) : (
                  <h2
                    className={` normal-text-font ${
                      nightMode ? "text-white" : "light-mode-text-color"
                    }
                  `}
                    style={{ fontSize: 20 }}
                  >
                    3D
                  </h2>
                )}
              </button>
              <span className="tooltip-text p-2">3D Map</span>
            </div>

            <div
              className={`tooltip-container shadow-md `}
              style={{ width: 40, height: 40 }}
            >
              <button
                className={`p-1 w-full h-full justify-center rounded flex items-center tooltip-btn shadow-md ${
                  nightMode
                    ? "button-colors-nightmode"
                    : "button-colors-lightmode"
                }
            `}
                onClick={handleHeatCircleClick}
              >
                {heatCircleActive == "NONE" && (
                  <svg
                    className="overflow-hidden"
                    version="1.0"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 512.000000 512.000000"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <g
                      transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                      fill={`${nightMode ? "white" : "rgb(51, 51, 51)"}`}
                      stroke="none"
                    >
                      <path
                        d="M868 5105 c-371 -62 -700 -346 -816 -705 -53 -163 -52 -118 -52
                 -1840 0 -1722 -1 -1677 52 -1840 118 -362 446 -644 823 -705 135 -22 3235 -22
                 3370 0 437 71 789 423 860 860 23 138 22 3240 0 3371 -76 442 -423 788 -860
                 859 -125 21 -3255 20 -3377 0z m3356 -471 c33 -9 88 -30 121 -47 78 -41 201
                 -164 242 -242 67 -128 63 -15 63 -1785 0 -1770 4 -1657 -63 -1785 -41 -78
                 -164 -201 -242 -242 -128 -67 -15 -63 -1785 -63 -1770 0 -1657 -4 -1785 63
                 -78 41 -201 164 -242 242 -67 128 -63 15 -63 1785 0 1770 -4 1657 63 1785 40
                 75 163 200 237 240 128 68 2 63 1784 64 1436 1 1615 -1 1670 -15z"
                      />
                    </g>
                  </svg>
                )}
                {heatCircleActive == "HEAT" && (
                  <svg
                    className="overflow-hidden"
                    version="1.0"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 180.000000 173.000000"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <g
                      transform="translate(0.000000,173.000000) scale(0.100000,-0.100000)"
                      fill={`${nightMode ? "white" : "rgb(51, 51, 51)"}`}
                      stroke="none"
                    >
                      <path
                        d="M888 1700 c-54 -29 -81 -73 -86 -141 -6 -77 27 -137 91 -168 157 -76
                 312 79 236 236 -41 84 -154 118 -241 73z"
                      />
                      <path
                        d="M159 1641 c-32 -33 -36 -58 -14 -100 25 -49 90 -57 130 -16 41 40 33
                 105 -16 130 -42 22 -67 18 -100 -14z"
                      />
                      <path
                        d="M1645 1595 c-47 -46 -22 -134 41 -149 37 -10 82 11 99 45 21 40 19
                 63 -11 98 -34 41 -92 44 -129 6z"
                      />
                      <path
                        d="M305 1007 c-70 -39 -103 -135 -71 -210 48 -116 200 -138 285 -41 122
                 138 -52 342 -214 251z"
                      />
                      <path
                        d="M1399 947 c-82 -44 -124 -139 -105 -240 9 -49 76 -122 131 -143 125
                 -47 266 39 282 173 19 166 -159 288 -308 210z"
                      />
                      <path
                        d="M773 299 c-99 -49 -118 -171 -39 -248 62 -60 150 -60 212 0 80 78 60
                 205 -40 250 -53 24 -81 24 -133 -2z"
                      />
                      <path
                        d="M64 190 c-63 -26 -71 -114 -15 -157 21 -16 81 -16 102 0 22 17 39 51
                 39 81 0 54 -74 99 -126 76z"
                      />
                      <path
                        d="M1525 178 c-32 -19 -44 -40 -45 -81 0 -95 121 -122 165 -36 39 74
                 -48 158 -120 117z"
                      />
                    </g>
                  </svg>
                )}
                {heatCircleActive == "DOTS" && (
                  <svg
                    className="overflow-hidden"
                    version="1.0"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 512.000000 512.000000"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <g
                      transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                      fill={`${nightMode ? "white" : "rgb(51, 51, 51)"}`}
                      stroke="none"
                    >
                      <path
                        d="M885 4471 c-92 -24 -173 -90 -215 -176 -34 -69 -35 -198 -2 -265 34
                 -71 75 -114 144 -151 58 -31 70 -34 148 -33 72 0 93 4 136 26 75 40 107 70
                 145 140 31 58 34 70 34 148 0 78 -3 90 -34 148 -57 104 -144 160 -260 167 -36
                 2 -79 1 -96 -4z"
                      />
                      <path
                        d="M2485 4471 c-92 -24 -173 -90 -215 -176 -34 -69 -35 -198 -2 -265 34
                 -71 75 -114 144 -151 58 -31 70 -34 148 -33 72 0 93 4 136 26 75 40 107 70
                 145 140 31 58 34 70 34 148 0 78 -3 90 -34 148 -57 104 -144 160 -260 167 -36
                 2 -79 1 -96 -4z"
                      />
                      <path
                        d="M4085 4471 c-92 -24 -173 -90 -215 -176 -34 -69 -35 -198 -2 -265 34
                 -71 75 -114 144 -151 58 -31 70 -34 148 -33 72 0 93 4 136 26 75 40 107 70
                 145 140 31 58 34 70 34 148 0 78 -3 90 -34 148 -57 104 -144 160 -260 167 -36
                 2 -79 1 -96 -4z"
                      />
                      <path
                        d="M885 2871 c-92 -24 -173 -90 -215 -176 -34 -69 -35 -198 -2 -265 34
                 -71 75 -114 144 -151 58 -31 70 -34 148 -33 72 0 93 4 136 26 75 40 107 70
                 145 140 31 58 34 70 34 148 0 78 -3 90 -34 148 -57 104 -144 160 -260 167 -36
                 2 -79 1 -96 -4z"
                      />
                      <path
                        d="M2485 2871 c-92 -24 -173 -90 -215 -176 -34 -69 -35 -198 -2 -265 34
                 -71 75 -114 144 -151 58 -31 70 -34 148 -33 72 0 93 4 136 26 75 40 107 70
                 145 140 31 58 34 70 34 148 0 78 -3 90 -34 148 -57 104 -144 160 -260 167 -36
                 2 -79 1 -96 -4z"
                      />
                      <path
                        d="M4085 2871 c-92 -24 -173 -90 -215 -176 -34 -69 -35 -198 -2 -265 34
                 -71 75 -114 144 -151 58 -31 70 -34 148 -33 72 0 93 4 136 26 75 40 107 70
                 145 140 31 58 34 70 34 148 0 78 -3 90 -34 148 -57 104 -144 160 -260 167 -36
                 2 -79 1 -96 -4z"
                      />
                      <path
                        d="M885 1271 c-92 -24 -173 -90 -215 -176 -34 -69 -35 -198 -2 -265 34
                 -71 75 -114 144 -151 58 -31 70 -34 148 -33 72 0 93 4 136 26 75 40 107 70
                 145 140 31 58 34 70 34 148 0 78 -3 90 -34 148 -57 104 -144 160 -260 167 -36
                 2 -79 1 -96 -4z"
                      />
                      <path
                        d="M2485 1271 c-92 -24 -173 -90 -215 -176 -34 -69 -35 -198 -2 -265 34
                 -71 75 -114 144 -151 58 -31 70 -34 148 -33 72 0 93 4 136 26 75 40 107 70
                 145 140 31 58 34 70 34 148 0 78 -3 90 -34 148 -57 104 -144 160 -260 167 -36
                 2 -79 1 -96 -4z"
                      />
                      <path
                        d="M4085 1271 c-92 -24 -173 -90 -215 -176 -34 -69 -35 -198 -2 -265 34
                 -71 75 -114 144 -151 58 -31 70 -34 148 -33 72 0 93 4 136 26 75 40 107 70
                 145 140 31 58 34 70 34 148 0 78 -3 90 -34 148 -57 104 -144 160 -260 167 -36
                 2 -79 1 -96 -4z"
                      />
                    </g>
                  </svg>
                )}
              </button>
              <span className="tooltip-text p-2">Heats</span>
            </div>
          </div>
        </div>

        <div className="flex-col justify-between">
          <div className="mt-5 mb-6 mx-2">
            <Slider
              min={1}
              max={7}
              dots={true}
              included={false}
              marks={{
                1: (
                  <span
                    className={`select-none whitespace-nowrap ml-2 normal-text-font ${
                      nightMode ? "text-white" : "light-mode-text-color"
                    }`}
                    style={{ fontSize: 15 }}
                  >
                    Day 1
                  </span>
                ),
                2: (
                  <span
                    className={` select-none whitespace-nowrap ml-1 light-text-font ${
                      nightMode ? "text-white" : "light-mode-text-color"
                    }`}
                    style={{ fontSize: 15 }}
                  >
                    2
                  </span>
                ),
                3: (
                  <span
                    className={` select-none whitespace-nowrap ml-1 light-text-font ${
                      nightMode ? "text-white" : "light-mode-text-color"
                    }`}
                    style={{ fontSize: 15 }}
                  >
                    3
                  </span>
                ),
                4: (
                  <span
                    className={` select-none whitespace-nowrap ml-1 light-text-font ${
                      nightMode ? "text-white" : "light-mode-text-color"
                    }`}
                    style={{ fontSize: 15 }}
                  >
                    4
                  </span>
                ),
                5: (
                  <span
                    className={` select-none whitespace-nowrap ml-1 light-text-font ${
                      nightMode ? "text-white" : "light-mode-text-color"
                    }`}
                    style={{ fontSize: 15 }}
                  >
                    5
                  </span>
                ),
                6: (
                  <span
                    className={` select-none whitespace-nowrap ml-1 light-text-font ${
                      nightMode ? "text-white" : "light-mode-text-color"
                    }`}
                    style={{ fontSize: 15 }}
                  >
                    6
                  </span>
                ),
                7: (
                  <span
                    className={` text-white  select-none whitespace-nowrap mr-2 ${
                      nightMode ? "text-white" : "light-mode-text-color"
                    }`}
                    style={{ fontSize: 15 }}
                  >
                    Day 7
                  </span>
                ),
              }}
              defaultValue={sliderValue + 1}
              railStyle={{
                marginBottom: "20px",
                backgroundColor: nightMode
                  ? "rgba(92, 112, 119, 0.8)"
                  : "rgba(255,255,255)",
                height: 10,
                userSelect: "none",
              }}
              //trackStyle={{ backgroundColor: "#FFF", height: 10 }}
              handleStyle={{
                borderColor: "white",
                height: 20,
                width: 20,
                backgroundColor: "rgba(255, 0, 0, 0.8)",
                userSelect: "none",
              }}
              dotStyle={{
                visibility: "visible",
                backgroundColor: nightMode
                  ? "rgba(255, 255, 255, 1)"
                  : "rgba(51, 51, 51, 0.3)", // Change color here
                width: 12, // Adjust size here
                height: 12, // Adjust size here
                border: "none", // Remove border
                userSelect: "none",
              }}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <div
        className="w-full mt-2 h-2 rounded"
        style={{
          background: `linear-gradient(to right, ${startColor}, ${mid1Color}, ${mid2Color}, ${mid3Color}, ${mid4Color}, ${endColor})`,
        }}
      ></div>
    </div>
  );
}

export default ControlPanel;
