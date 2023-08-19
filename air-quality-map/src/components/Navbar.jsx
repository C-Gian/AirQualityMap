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

      <div
        className="flex justify-between text-white text-xl"
        style={{ width: "150px" }}
      >
        <button className="info-button" onClick={toggleModal}>
          <h2>Info</h2>
        </button>
        <a
          className="flex"
          href="https://github.com/C-Gian/Dev-Mapbox"
          target="_blank"
        >
          <h2>GitHub</h2>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="25"
            fill="white"
            viewBox="0 0 256 256"
          >
            <path d="M208.31,75.68A59.78,59.78,0,0,0,202.93,28,8,8,0,0,0,196,24a59.75,59.75,0,0,0-48,24H124A59.75,59.75,0,0,0,76,24a8,8,0,0,0-6.93,4,59.78,59.78,0,0,0-5.38,47.68A58.14,58.14,0,0,0,56,104v8a56.06,56.06,0,0,0,48.44,55.47A39.8,39.8,0,0,0,96,192v8H72a24,24,0,0,1-24-24A40,40,0,0,0,8,136a8,8,0,0,0,0,16,24,24,0,0,1,24,24,40,40,0,0,0,40,40H96v16a8,8,0,0,0,16,0V192a24,24,0,0,1,48,0v40a8,8,0,0,0,16,0V192a39.8,39.8,0,0,0-8.44-24.53A56.06,56.06,0,0,0,216,112v-8A58.14,58.14,0,0,0,208.31,75.68ZM200,112a40,40,0,0,1-40,40H112a40,40,0,0,1-40-40v-8a41.74,41.74,0,0,1,6.9-22.48A8,8,0,0,0,80,73.83a43.81,43.81,0,0,1,.79-33.58,43.88,43.88,0,0,1,32.32,20.06A8,8,0,0,0,119.82,64h32.35a8,8,0,0,0,6.74-3.69,43.87,43.87,0,0,1,32.32-20.06A43.81,43.81,0,0,1,192,73.83a8.09,8.09,0,0,0,1,7.65A41.72,41.72,0,0,1,200,104Z"></path>
          </svg>
        </a>
      </div>

      <div className="flex">
        <div className="tooltip-container mr-1">
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
        <div className="tooltip-container">
          <button
            className="bg-white rounded-full flex items-center tooltip-btn"
            style={{ padding: "5px" }}
            onClick={handleColorBlindClick}
          >
            {colorBlindMode ? (
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
                  d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
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
