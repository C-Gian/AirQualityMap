import React from "react";
import {
  setNightMode,
  setColorBlindMode,
  setSidebar,
  setLayerToShow,
  setWind,
  setWindHeatmap,
} from "../actions/index.js";
import { useDispatch, useSelector } from "react-redux";

function Modes() {
  const nightMode = useSelector((state) => state.nightMode);
  const colorBlindMode = useSelector((state) => state.colorBlindMode);
  const wind = useSelector((state) => state.wind);
  const windHeatmap = useSelector((state) => state.windHeatmap);
  const layerToShow = useSelector((state) => state.layerToShow);
  const dispatch = useDispatch();

  const handleNightModeClick = () => {
    dispatch(setSidebar(false));
    dispatch(setLayerToShow("AQI"));
    dispatch(setWind(false));
    dispatch(setWindHeatmap(false));
    dispatch(setNightMode(!nightMode));
  };

  const handleColorBlindClick = () => {
    dispatch(setSidebar(false));
    dispatch(setLayerToShow("AQI"));
    dispatch(setWind(false));
    dispatch(setWindHeatmap(false));
    dispatch(setColorBlindMode(!colorBlindMode));
  };
  return (
    <div
      className="flex flex-col space-y-1 absolute m-2 modes-shadow"
      style={{ top: 180, right: 2 }}
    >
      <div
        className={`tooltip-container rounded flex items-center justify-center border modes-border p-2 
        ${
          nightMode
            ? "button-colors-nightmode-map"
            : "button-colors-lightmode-map"
        }`}
        style={{
          width: 40,
          height: 40,
        }}
        onClick={handleNightModeClick}
      >
        <button className="flex items-center tooltip-btn w-full h-full select-none transition duration-300 ease-in-out">
          {nightMode ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="white"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="white"
              className="w-7 h-7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-sun-filled"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path
                d="M12 19a1 1 0 0 1 .993 .883l.007 .117v1a1 1 0 0 1 -1.993 .117l-.007 -.117v-1a1 1 0 0 1 1 -1z"
                strokeWidth="0"
                fill="rgb(51, 51, 51)"
              ></path>
              <path
                d="M18.313 16.91l.094 .083l.7 .7a1 1 0 0 1 -1.32 1.497l-.094 -.083l-.7 -.7a1 1 0 0 1 1.218 -1.567l.102 .07z"
                strokeWidth="0"
                fill="rgb(51, 51, 51)"
              ></path>
              <path
                d="M7.007 16.993a1 1 0 0 1 .083 1.32l-.083 .094l-.7 .7a1 1 0 0 1 -1.497 -1.32l.083 -.094l.7 -.7a1 1 0 0 1 1.414 0z"
                strokeWidth="0"
                fill="rgb(51, 51, 51)"
              ></path>
              <path
                d="M4 11a1 1 0 0 1 .117 1.993l-.117 .007h-1a1 1 0 0 1 -.117 -1.993l.117 -.007h1z"
                strokeWidth="0"
                fill="rgb(51, 51, 51)"
              ></path>
              <path
                d="M21 11a1 1 0 0 1 .117 1.993l-.117 .007h-1a1 1 0 0 1 -.117 -1.993l.117 -.007h1z"
                strokeWidth="0"
                fill="rgb(51, 51, 51)"
              ></path>
              <path
                d="M6.213 4.81l.094 .083l.7 .7a1 1 0 0 1 -1.32 1.497l-.094 -.083l-.7 -.7a1 1 0 0 1 1.217 -1.567l.102 .07z"
                strokeWidth="0"
                fill="rgb(51, 51, 51)"
              ></path>
              <path
                d="M19.107 4.893a1 1 0 0 1 .083 1.32l-.083 .094l-.7 .7a1 1 0 0 1 -1.497 -1.32l.083 -.094l.7 -.7a1 1 0 0 1 1.414 0z"
                strokeWidth="0"
                fill="rgb(51, 51, 51)"
              ></path>
              <path
                d="M12 2a1 1 0 0 1 .993 .883l.007 .117v1a1 1 0 0 1 -1.993 .117l-.007 -.117v-1a1 1 0 0 1 1 -1z"
                strokeWidth="0"
                fill="rgb(51, 51, 51)"
              ></path>
              <path
                d="M12 7a5 5 0 1 1 -4.995 5.217l-.005 -.217l.005 -.217a5 5 0 0 1 4.995 -4.783z"
                strokeWidth="0"
                fill="rgb(51, 51, 51)"
              ></path>
            </svg>
          )}
        </button>
        <div className="absolute inset-0 bg-black opacity-0 transition duration-300 ease-in-out hover:opacity-10"></div>
        <span className="tooltip-text-modes p-2">Night Mode</span>
      </div>
      <div
        className={`tooltip-container rounded w-fit h-fit flex items-center justify-center border modes-border p-2 ${
          nightMode
            ? "button-colors-nightmode-map"
            : "button-colors-lightmode-map"
        }`}
        style={{
          width: 40,
          height: 40,
        }}
        onClick={handleColorBlindClick}
      >
        <button
          className="rounded flex items-center tooltip-btn  transition duration-300 ease-in-out"
          onClick={handleColorBlindClick}
        >
          {colorBlindMode ? (
            <svg
              version="1.0"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512.000000 512.000000"
              preserveAspectRatio="xMidYMid meet"
              className="w-9 h-9"
            >
              <g
                transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                fill={nightMode ? "white" : "#333"}
                stroke="none"
              >
                <path
                  d="M3883 3988 c-12 -7 -109 -96 -215 -198 -106 -102 -223 -213 -259
           -247 l-66 -63 -69 31 c-365 166 -760 202 -1138 104 -392 -102 -835 -379 -1189
           -744 -129 -133 -152 -180 -152 -311 0 -142 20 -178 204 -360 151 -150 311
           -281 463 -379 48 -31 87 -58 88 -61 0 -3 -106 -106 -235 -229 -193 -185 -237
           -231 -245 -262 -12 -44 3 -91 38 -122 28 -25 92 -33 125 -16 15 8 652 615
           1417 1349 1088 1044 1392 1342 1399 1367 12 43 -2 93 -33 122 -29 28 -101 38
           -133 19z m-1120 -791 c43 -14 103 -40 133 -58 l54 -33 -87 -88 -86 -87 -31 16
           c-159 82 -370 42 -498 -95 -77 -82 -118 -184 -118 -292 0 -56 18 -139 38 -176
           10 -18 1 -31 -77 -108 l-89 -88 -27 46 c-43 74 -76 191 -82 292 -7 117 14 220
           70 334 33 68 58 102 127 170 96 97 187 150 312 181 102 26 254 20 361 -14z"
                />
                <path
                  d="M3475 2990 l-260 -250 5 -38 c3 -20 5 -91 5 -157 0 -91 -5 -133 -19
           -175 -74 -219 -217 -369 -426 -445 -62 -23 -96 -29 -195 -32 -85 -3 -136 0
           -173 10 l-54 14 -181 -174 c-100 -95 -183 -178 -185 -183 -8 -22 267 -87 435
           -102 514 -47 1069 179 1598 652 144 128 240 236 274 310 21 45 26 70 26 140 0
           146 -51 225 -279 432 -105 96 -294 249 -307 248 -2 -1 -121 -113 -264 -250z"
                />
                <path
                  d="M2780 2321 l-195 -189 54 10 c146 26 267 130 321 276 42 111 27 103
           -180 -97z"
                />
              </g>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke={`${nightMode ? "white" : "rgb(51, 51, 51)"}`}
              className="w-7 h-7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          )}
        </button>
        <div className="absolute inset-0 bg-black opacity-0 transition duration-300 ease-in-out hover:opacity-10"></div>
        <span className="tooltip-text-modes p-2">Blind Mode</span>
      </div>
    </div>
  );
}

export default Modes;
