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
              class="icon icon-tabler icon-tabler-sun-filled"
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
