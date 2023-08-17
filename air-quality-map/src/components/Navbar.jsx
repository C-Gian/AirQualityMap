import React from "react";
import {
  setLayerToShow,
  setWind,
  setWindHeatmap,
  set3DMap,
  setNightMode,
  setColorBlindMode,
} from "../actions/index.js";
import { useDispatch, useSelector } from "react-redux";

const Navbar = () => {
  const nightMode = useSelector((state) => state.nightMode);
  const colorBlindMode = useSelector((state) => state.colorBlindMode);
  const dispatch = useDispatch();

  const handleNightModeClick = () => {
    dispatch(setNightMode(!nightMode));
  };

  const handleColorBlindClick = () => {
    dispatch(setColorBlindMode(!colorBlindMode));
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

      <div className="flex mr-2">
        <div className="tooltip-container mr-1">
          <button
            className="bg-white p-1 rounded flex items-center tooltip-btn"
            onClick={handleNightModeClick}
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
            onClick={handleColorBlindClick}
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
    </div>
  );
};

export default Navbar;
