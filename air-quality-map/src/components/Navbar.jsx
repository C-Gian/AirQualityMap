import React, { useState } from "react";
import { setNightMode, setColorBlindMode } from "../actions/index.js";
import { useDispatch, useSelector } from "react-redux";
import Modes from "./Modes.jsx";

const Navbar = () => {
  const nightMode = useSelector((state) => state.nightMode);
  const colorBlindMode = useSelector((state) => state.colorBlindMode);
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const startColor = colorBlindMode ? "rgba(0, 147, 0, 1)" : "#00D900";
  const mid1Color = colorBlindMode ? "rgba(181, 140, 0, 1)" : "#B5B500";
  const mid2Color = colorBlindMode ? "rgba(245, 116, 0, 1)" : "#F57300";
  const mid3Color = colorBlindMode ? "rgba(245, 0, 0, 1)" : "#F50000";
  const mid4Color = colorBlindMode ? "rgba(131, 52, 140, 1)" : "#83328C";
  const endColor = colorBlindMode ? "rgba(115, 0, 23, 1)" : "#730017";

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const stopPropagation = (event) => {
    event.stopPropagation();
  };

  return (
    <div className="z-30 w-full top-0 fixed flex items-center ">
      <div
        className="p-4 flex w-full justify-between backdrop-blur-2xl navbar-background"
        style={{ height: "50px" }}
      >
        <div className="flex items-center space-x-2">
          <svg
            version="1.0"
            xmlns="http://www.w3.org/2000/svg"
            width="34.000000pt"
            height="34.000000pt"
            fill="white"
            stroke="white"
            viewBox="0 0 680.000000 540.000000"
            preserveAspectRatio="xMidYMid meet"
          >
            <g
              transform="translate(0.000000,540.000000) scale(0.100000,-0.100000)"
              fill="#FFF"
              stroke="none"
            >
              <path
                d="M2745 4989 c-177 -18 -249 -29 -270 -43 -12 -8 -40 -18 -61 -21 -37
-7 -139 -49 -194 -80 -14 -8 -41 -22 -60 -31 -19 -9 -48 -27 -63 -40 -16 -13
-33 -24 -38 -24 -10 0 -83 -54 -115 -85 -11 -11 -38 -36 -59 -55 -57 -51 -149
-159 -169 -197 -9 -18 -20 -33 -25 -33 -5 0 -14 -13 -20 -29 -7 -15 -27 -42
-44 -58 -30 -28 -39 -31 -130 -37 -54 -4 -114 -13 -135 -21 -20 -8 -65 -19
-99 -25 -56 -10 -122 -35 -193 -76 -14 -8 -42 -21 -62 -30 -21 -10 -38 -21
-38 -25 0 -5 -17 -20 -37 -33 -64 -41 -243 -227 -243 -253 0 -5 -11 -24 -25
-43 -13 -18 -30 -49 -36 -69 -6 -20 -18 -43 -25 -51 -7 -9 -20 -43 -28 -75 -8
-33 -22 -80 -32 -105 -25 -65 -25 -367 -1 -424 10 -22 24 -69 32 -105 9 -36
22 -72 29 -81 7 -8 19 -32 25 -52 7 -20 19 -42 27 -49 8 -7 22 -28 29 -46 8
-19 25 -48 37 -64 43 -56 192 -201 223 -216 16 -9 43 -26 58 -39 16 -13 34
-24 41 -24 8 0 24 -9 37 -19 14 -10 47 -26 74 -34 28 -8 64 -22 81 -31 19 -10
90 -22 175 -31 121 -12 440 -15 1959 -15 1990 0 1953 -1 2046 57 51 31 174
150 174 168 0 7 12 34 27 61 26 46 28 57 28 169 0 105 -3 124 -21 155 -12 19
-25 46 -29 60 -16 51 -98 140 -155 168 -19 10 -47 25 -61 35 -15 10 -63 22
-115 28 -49 6 -94 16 -99 23 -6 6 -19 16 -30 22 -14 8 -24 30 -33 74 -7 35
-17 69 -23 76 -6 7 -17 36 -24 64 -8 29 -20 59 -28 69 -7 9 -20 32 -27 51 -8
19 -36 62 -63 95 -51 61 -167 175 -179 175 -3 0 -19 11 -35 23 -15 13 -43 29
-62 36 -19 6 -42 18 -51 26 -9 8 -43 21 -75 29 -33 8 -78 22 -100 30 -22 8
-69 16 -105 16 -36 1 -81 7 -100 14 -30 11 -37 20 -50 62 -8 28 -23 62 -32 76
-9 14 -20 41 -23 61 -4 20 -18 50 -31 68 -13 18 -24 40 -24 50 0 9 -13 33 -30
54 -16 21 -30 43 -30 50 0 7 -6 15 -14 18 -8 3 -23 23 -33 44 -26 55 -300 323
-331 323 -6 0 -23 11 -39 24 -15 13 -44 31 -63 40 -19 9 -46 23 -60 31 -59 33
-158 74 -197 80 -24 4 -45 11 -48 16 -12 18 -86 30 -350 54 -22 2 -80 -1 -130
-6z"
              />
              <path
                d="M6086 2959 c-32 -5 -70 -17 -84 -26 -13 -10 -32 -22 -41 -28 -26 -16
-91 -81 -91 -92 0 -5 -11 -24 -25 -43 -17 -23 -25 -47 -25 -75 0 -34 6 -47 38
-78 29 -28 46 -37 72 -37 32 0 100 36 100 53 0 4 18 27 40 51 27 29 51 45 74
49 55 9 108 -8 139 -45 23 -27 27 -41 27 -91 0 -56 -2 -62 -39 -98 l-39 -39
-196 0 c-205 0 -231 -4 -267 -46 -20 -24 -40 -92 -29 -99 5 -3 11 -18 15 -34
10 -48 67 -61 255 -61 185 0 318 19 362 53 97 74 141 136 167 236 l22 85 -22
88 c-12 49 -32 100 -43 113 -12 13 -31 38 -44 55 -42 55 -121 99 -198 110 -78
11 -86 11 -168 -1z"
              />
              <path
                d="M1924 1996 c-47 -47 -48 -99 -2 -147 l33 -34 1870 -5 1870 -5 49 -27
c27 -16 54 -28 61 -28 22 0 100 -64 143 -116 56 -69 80 -121 97 -212 17 -87
17 -97 1 -184 -11 -59 -27 -108 -44 -136 -36 -60 -115 -145 -149 -162 -15 -8
-37 -22 -49 -32 -23 -21 -151 -48 -224 -48 -77 0 -188 27 -224 55 -18 14 -36
25 -40 25 -13 0 -96 74 -96 85 0 7 -11 22 -24 34 -13 13 -27 35 -31 49 -4 15
-17 49 -31 78 -16 34 -24 69 -24 105 0 111 -62 165 -159 138 -51 -14 -71 -50
-71 -126 1 -75 19 -185 34 -202 8 -9 19 -35 25 -58 7 -23 16 -45 21 -48 6 -4
21 -27 34 -53 35 -69 184 -211 239 -228 12 -4 32 -15 45 -25 13 -10 49 -23 80
-29 31 -6 72 -18 91 -27 45 -20 224 -20 274 0 19 9 60 20 90 27 31 6 60 17 66
24 6 7 31 21 56 31 25 9 45 21 45 26 0 4 12 15 28 23 28 15 69 54 112 106 14
17 33 40 43 51 28 31 83 140 92 179 4 19 16 61 26 92 21 62 25 179 9 238 -5
19 -19 68 -30 109 -11 41 -28 86 -37 100 -10 14 -23 39 -30 54 -29 67 -160
202 -220 228 -24 10 -43 23 -43 28 0 6 -19 15 -42 22 -24 6 -59 21 -78 32
l-35 22 -1908 3 -1909 2 -34 -34z"
              />
              <path
                d="M2746 1607 c-77 -45 -78 -146 -1 -196 l40 -26 620 -5 c452 -4 626 -8
641 -17 11 -6 29 -36 39 -67 18 -53 18 -56 1 -95 -10 -22 -32 -52 -48 -68 -24
-23 -38 -28 -79 -28 -48 0 -53 3 -102 55 -29 31 -60 66 -69 78 -14 17 -28 22
-66 22 -54 0 -71 -10 -101 -60 -22 -37 -27 -70 -12 -86 5 -5 14 -25 20 -45 12
-39 88 -115 157 -159 34 -21 53 -25 154 -28 119 -4 129 -2 214 45 44 24 125
113 137 153 7 19 19 46 28 60 12 17 16 48 16 110 0 71 -4 91 -23 121 -12 20
-22 43 -22 52 0 19 -61 92 -103 123 -41 30 -57 37 -138 63 -63 20 -84 21 -665
21 l-599 -1 -39 -22z"
              />
            </g>
          </svg>
          <span
            className="text-white logo-title select-none"
            style={{ fontSize: 25 }}
          >
            Air Quality Map
          </span>
        </div>

        <div className="flex justify-between items-center space-x-3">
          <div className="tooltip-container w-fit h-fit flex flex-col items-center justify-end">
            <a className="github-button" onClick={toggleModal}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-brand-github"
                viewBox="0 0 24 24"
                width={30}
                strokeWidth="2"
                stroke="white"
                fill="white"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path
                  d="M10.425 1.414a3.33 3.33 0 0 1 3.026 -.097l.19 .097l6.775 3.995l.096 .063l.092 .077l.107 .075a3.224 3.224 0 0 1 1.266 2.188l.018 .202l.005 .204v7.284c0 1.106 -.57 2.129 -1.454 2.693l-.17 .1l-6.803 4.302c-.918 .504 -2.019 .535 -3.004 .068l-.196 -.1l-6.695 -4.237a3.225 3.225 0 0 1 -1.671 -2.619l-.007 -.207v-7.285c0 -1.106 .57 -2.128 1.476 -2.705l6.95 -4.098zm1.575 9.586h-1l-.117 .007a1 1 0 0 0 0 1.986l.117 .007v3l.007 .117a1 1 0 0 0 .876 .876l.117 .007h1l.117 -.007a1 1 0 0 0 .876 -.876l.007 -.117l-.007 -.117a1 1 0 0 0 -.764 -.857l-.112 -.02l-.117 -.006v-3l-.007 -.117a1 1 0 0 0 -.876 -.876l-.117 -.007zm.01 -3l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007z"
                  strokeWidth="0"
                  fill="white"
                ></path>
              </svg>
            </a>
            <span className="tooltip-text p-2">Github</span>
          </div>
          <div className="tooltip-container w-fit h-fit flex flex-col items-center justify-end">
            <a
              className="github-button"
              href="https://github.com/C-Gian/Dev-Mapbox"
              target="_blank"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-brand-github"
                viewBox="0 0 24 24"
                width={30}
                strokeWidth="2"
                stroke="white"
                fill="white"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5"></path>
              </svg>
            </a>
            <span className="tooltip-text p-2">Github</span>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center"
          onClick={toggleModal}
        >
          <div
            className="bg-white rounded-lg p-4 w-600 relative backdrop-blur-3xl"
            onClick={stopPropagation}
            style={{
              backgroundColor: nightMode
                ? "rgba(53, 54, 58, 0.5)"
                : "rgba(75 ,85 ,99, 1)",
            }}
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
                stroke="white"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="flex flex-col space-y-10">
              <div className="flex flex-col">
                <span className="text-white text-lg font-bold">
                  What is Air Quality Map?
                </span>
                <span className="text-white text-base">
                  Air Quality Map is a web application that provides users with
                  an interactive color-coded map based on the Air Quality Index
                  (AQI) of countries and regions or states.
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-white text-lg font-bold">
                  What is AQI?
                </span>
                <span className="text-white text-base">
                  Air Quality Index (AQI) is a tool designed to measure the air
                  quality in a specific area. Higher AQI level indicates more
                  dangerous air to breathe.
                </span>
                <div className="flex justify-between mt-2">
                  <div className="flex  w-full h-full flex-col justify-center items-center space-y-1">
                    <div
                      className=""
                      style={{
                        width: 90,
                        height: 25,
                        backgroundColor: startColor,
                      }}
                    ></div>
                    <h2 className="text-white text-xs">Good</h2>
                  </div>
                  <div className="flex  w-full h-full flex-col justify-center items-center space-y-1">
                    <div
                      className="bg-slate-500"
                      style={{
                        width: 90,
                        height: 25,
                        backgroundColor: mid1Color,
                      }}
                    ></div>
                    <h2 className="text-white text-xs">Moderate</h2>
                  </div>
                  <div className="flex w-full h-full flex-col justify-center items-center space-y-1">
                    <div
                      className="bg-slate-500"
                      style={{
                        width: 90,
                        height: 25,
                        backgroundColor: mid2Color,
                      }}
                    ></div>
                    <h2 className="text-white text-xs text-center">
                      Unhealthy for Sensitive Groups
                    </h2>
                  </div>
                  <div className="flex  w-full h-full flex-col justify-center items-center space-y-1">
                    <div
                      className="bg-slate-500"
                      style={{
                        width: 90,
                        height: 25,
                        backgroundColor: mid3Color,
                      }}
                    ></div>
                    <h2 className="text-white text-xs">Unhealthy</h2>
                  </div>
                  <div className="flex w-full h-full flex-col justify-center items-center space-y-1">
                    <div
                      className="bg-slate-500"
                      style={{
                        width: 90,
                        height: 25,
                        backgroundColor: mid4Color,
                      }}
                    ></div>
                    <h2 className="text-white text-xs text-center">
                      Very Unhealthy
                    </h2>
                  </div>
                  <div className="flex  w-full h-full flex-col justify-center items-center space-y-1">
                    <div
                      className="bg-slate-500"
                      style={{
                        width: 90,
                        height: 25,
                        backgroundColor: endColor,
                      }}
                    ></div>
                    <h2 className="text-white text-xs">Hazardous</h2>
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-white text-lg font-bold">
                  Why is important to monitor AQI?
                </span>
                <span className="text-white text-base">
                  Monitoring AQI is of really important due to the perilous
                  nature of pollutants for both human beings and the
                  environment.
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-white text-lg font-bold">
                  How is AQI calculated?
                </span>
                <span className="text-white text-base">
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
