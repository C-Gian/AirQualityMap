import React, { useState } from "react";
import { setNightMode, setColorBlindMode } from "../actions/index.js";
import { useDispatch, useSelector } from "react-redux";

const Navbar = () => {
  const nightMode = useSelector((state) => state.nightMode);
  const colorBlindMode = useSelector((state) => state.colorBlindMode);
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);

  const handleNightModeClick = () => {
    dispatch(setNightMode(!nightMode));
  };

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const handleColorBlindClick = () => {
    dispatch(setColorBlindMode(!colorBlindMode));
  };

  const stopPropagation = (event) => {
    event.stopPropagation();
  };

  return (
    <div
      className="p-4 z-30 w-full top-0 fixed flex justify-between items-center"
      style={{ height: "50px", backgroundColor: "rgba(68 , 68 , 68 , 1" }}
    >
      <div className="flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="white"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-8 h-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
          />
        </svg>
        <span className="text-white text-xl font-semibold">
          Air Quality Map
        </span>
      </div>

      <div className="flex space-x-2">
        <div className="tooltip-container  bg-white rounded-full w-9 h-9 flex items-center justify-center">
          <button className="info-button" onClick={toggleModal}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-info-small w-12 h-12"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M12 9h.01"></path>
              <path d="M11 12h1v4h1"></path>
            </svg>
          </button>
          <span className="tooltip-text p-2">Github</span>
        </div>
        <div className="tooltip-container  bg-white rounded-full w-9 h-9  flex flex-col items-center justify-end">
          <a
            className="flex flex-col w-full h-full justify-end items-center"
            href="https://github.com/C-Gian/Dev-Mapbox"
            target="_blank"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-brand-github-filled w-7 h-7"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              fill="white"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path
                d="M5.315 2.1c.791 -.113 1.9 .145 3.333 .966l.272 .161l.16 .1l.397 -.083a13.3 13.3 0 0 1 4.59 -.08l.456 .08l.396 .083l.161 -.1c1.385 -.84 2.487 -1.17 3.322 -1.148l.164 .008l.147 .017l.076 .014l.05 .011l.144 .047a1 1 0 0 1 .53 .514a5.2 5.2 0 0 1 .397 2.91l-.047 .267l-.046 .196l.123 .163c.574 .795 .93 1.728 1.03 2.707l.023 .295l.007 .272c0 3.855 -1.659 5.883 -4.644 6.68l-.245 .061l-.132 .029l.014 .161l.008 .157l.004 .365l-.002 .213l-.003 3.834a1 1 0 0 1 -.883 .993l-.117 .007h-6a1 1 0 0 1 -.993 -.883l-.007 -.117v-.734c-1.818 .26 -3.03 -.424 -4.11 -1.878l-.535 -.766c-.28 -.396 -.455 -.579 -.589 -.644l-.048 -.019a1 1 0 0 1 .564 -1.918c.642 .188 1.074 .568 1.57 1.239l.538 .769c.76 1.079 1.36 1.459 2.609 1.191l.001 -.678l-.018 -.168a5.03 5.03 0 0 1 -.021 -.824l.017 -.185l.019 -.12l-.108 -.024c-2.976 -.71 -4.703 -2.573 -4.875 -6.139l-.01 -.31l-.004 -.292a5.6 5.6 0 0 1 .908 -3.051l.152 -.222l.122 -.163l-.045 -.196a5.2 5.2 0 0 1 .145 -2.642l.1 -.282l.106 -.253a1 1 0 0 1 .529 -.514l.144 -.047l.154 -.03z"
                stroke-width="0"
                fill="currentColor"
              ></path>
            </svg>
          </a>
          <span className="tooltip-text p-2">Github</span>
        </div>
        <div className="tooltip-container  bg-white rounded-full w-9 h-9  flex items-center justify-center">
          <button
            className="bg-white rounded-full flex items-center tooltip-btn"
            style={{ padding: "5px" }}
            onClick={handleNightModeClick}
          >
            {nightMode ? (
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
            ) : (
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
          </button>
          <span className="tooltip-text p-2">Modalità Notte</span>
        </div>
        <div className="tooltip-container bg-white rounded-full w-9 h-9  flex items-center justify-center">
          <button
            className="bg-white rounded-full flex items-center tooltip-btn"
            style={{ padding: "5px" }}
            onClick={handleColorBlindClick}
          >
            {colorBlindMode ? (
              <svg
                version="1.0"
                className="w-7 h-7"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512.000000 512.000000"
                preserveAspectRatio="xMidYMid meet"
              >
                <g
                  transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                  fill="#000000"
                  stroke="none"
                >
                  <path d="M3883 3988 c-12 -7 -109 -96 -215 -198 -106 -102 -223 -213 -259 -247 l-66 -63 -69 31 c-365 166 -760 202 -1138 104 -392 -102 -835 -379 -1189 -744 -129 -133 -152 -180 -152 -311 0 -142 20 -178 204 -360 151 -150 311 -281 463 -379 48 -31 87 -58 88 -61 0 -3 -106 -106 -235 -229 -193 -185 -237 -231 -245 -262 -12 -44 3 -91 38 -122 28 -25 92 -33 125 -16 15 8 652 615 1417 1349 1088 1044 1392 1342 1399 1367 12 43 -2 93 -33 122 -29 28 -101 38 -133 19z m-1120 -791 c43 -14 103 -40 133 -58 l54 -33 -87 -88 -86 -87 -31 16 c-159 82 -370 42 -498 -95 -77 -82 -118 -184 -118 -292 0 -56 18 -139 38 -176 10 -18 1 -31 -77 -108 l-89 -88 -27 46 c-43 74 -76 191 -82 292 -7 117 14 220 70 334 33 68 58 102 127 170 96 97 187 150 312 181 102 26 254 20 361 -14z" />
                  <path d="M3475 2990 l-260 -250 5 -38 c3 -20 5 -91 5 -157 0 -91 -5 -133 -19 -175 -74 -219 -217 -369 -426 -445 -62 -23 -96 -29 -195 -32 -85 -3 -136 0 -173 10 l-54 14 -181 -174 c-100 -95 -183 -178 -185 -183 -8 -22 267 -87 435 -102 514 -47 1069 179 1598 652 144 128 240 236 274 310 21 45 26 70 26 140 0 146 -51 225 -279 432 -105 96 -294 249 -307 248 -2 -1 -121 -113 -264 -250z" />
                  <path d="M2780 2321 l-195 -189 54 10 c146 26 267 130 321 276 42 111 27 103 -180 -97z" />
                </g>
              </svg>
            ) : (
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
          <span className="tooltip-text p-2">Modalità Daltonici</span>
        </div>
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={toggleModal}
        >
          <div
            className="bg-white rounded-lg p-4 w-500 relative"
            onClick={stopPropagation}
          >
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              onClick={toggleModal}
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="flex flex-col">
              <div className="flex flex-col mb-3">
                <span className="text-lg font-bold">
                  What is Air Quality Map?
                </span>
                <span className="text-base">
                  Air Quality Map is a web application that provides users with
                  an interactive color-coded map based on the Air Quality Index
                  (AQI) of countries and regions or states.
                </span>
              </div>
              <div className="flex flex-col mb-3">
                <span className="text-lg font-bold">What is AQI?</span>
                <span className="text-base">
                  Air Quality Index (AQI) is a tool designed to measure the air
                  quality in a specific area. Higher AQI level indicates more
                  dangerous air to breathe.
                </span>
              </div>
              <div className="flex flex-col mb-3">
                <span className="text-lg font-bold">
                  Why is important to monitor AQI?
                </span>
                <span className="text-base">
                  Monitoring AQI is of really important due to the perilous
                  nature of pollutants for both human beings and the
                  environment.
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold">
                  How is AQI calculated?
                </span>
                <span className="text-base">
                  AQI is calculated using a formula that computes the sub-index
                  for each pollutant. The highest sub-index is then selected to
                  determine the AQI value.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
