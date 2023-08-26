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
              strokeWidth={1.5}
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
            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-brand-github w-6 h-6" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
   <path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5"></path>
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
                strokeWidth={2}
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
                strokeWidth={2}
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
              <svg xmlns="http://www.w3.org/2000/svg" 
              className="icon icon-tabler icon-tabler-sunglasses w-6 h-6"  
              viewBox="0 0 24 24" strokeWidth={1.7} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M8 4h-2l-3 10"></path>
              <path d="M16 4h2l3 10"></path>
              <path d="M10 16h4"></path>
              <path d="M21 16.5a3.5 3.5 0 0 1 -7 0v-2.5h7v2.5"></path>
              <path d="M10 16.5a3.5 3.5 0 0 1 -7 0v-2.5h7v2.5"></path>
              <path d="M4 14l4.5 4.5"></path>
              <path d="M15 14l4.5 4.5"></path>
           </svg>
            ) : (
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
