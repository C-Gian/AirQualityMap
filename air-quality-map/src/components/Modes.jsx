import React from "react";
import { setNightMode, setColorBlindMode } from "../actions/index.js";
import { useDispatch, useSelector } from "react-redux";

function Modes() {
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
      className="flex flex-col space-y-3 absolute right-2 overflow-hidden"
      style={{ top: 200 }}
    >
      <div className="tooltip-container rounded-full w-fit h-fit flex items-center justify-center">
        <button
          className="bg-white rounded flex items-center tooltip-btn"
          style={{ padding: "5px" }}
          onClick={handleNightModeClick}
        >
          {nightMode ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="white"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="black"
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
              fill="black"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="black"
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
      <div className="tooltip-container rounded-full w-fit h-fit  flex items-center justify-center">
        <button
          className="bg-white rounded flex items-center tooltip-btn"
          style={{ padding: "5px" }}
          onClick={handleColorBlindClick}
        >
          {colorBlindMode ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-sunglasses w-6 h-6"
              viewBox="0 0 24 24"
              strokeWidth={1.7}
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
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
              stroke="black"
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
  );
}

export default Modes;
