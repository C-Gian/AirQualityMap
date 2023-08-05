import React, { useState } from "react";

function Toolbar({
  nightMode,
  onNightModeClick,
  onColorBlindClick,
  onColorZoomInClick,
  onColorCenterClick,
  onColorZoomOutClick,
}) {
  return (
    <div
      className="flex-col mt-5 mr-5 absolute w-fit p-3 h-fit rounded-2xl right-0 items-center justify-center"
      style={{
        backgroundColor: nightMode
          ? "rgba(55 ,65 ,81, 0.5)"
          : "rgba(128, 128, 128, 0.5)",
      }}
    >
      <div className="tooltip-container">
        <button
          className="bg-white mt-1 p-1 rounded-full flex items-center tooltip-btn"
          onClick={onNightModeClick}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-7 h-7"
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
          className="bg-white mt-5 p-1 rounded-full flex items-center tooltip-btn"
          onClick={onColorBlindClick}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-7 h-7"
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
      <div className="mt-10">
        <div className="tooltip-container">
          <button
            className="bg-white mt-5 mb-1 p-1 rounded flex items-center tooltip-btn"
            onClick={onColorZoomInClick}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-7 h-7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </button>
          <span className="tooltip-text p-2">Zoom In</span>
        </div>
        <div className="tooltip-container">
          <button
            className="bg-white p-1 rounded flex items-center tooltip-btn"
            onClick={onColorCenterClick}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-7 h-7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
              />
            </svg>
          </button>
          <span className="tooltip-text p-2">Go to Center</span>
        </div>
        <div className="tooltip-container">
          <button
            className="bg-white mt-1 mb-1 p-1 rounded flex items-center tooltip-btn"
            onClick={onColorZoomOutClick}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-7 h-7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 12h-15"
              />
            </svg>
          </button>
          <span className="tooltip-text p-2">Zoom Out</span>
        </div>
      </div>
    </div>
  );
}

export default Toolbar;
