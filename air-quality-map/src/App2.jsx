import Popup from "./Popup";
import StateMenu from "./StateMenu";
import React, { useEffect, useRef, useState } from "react";
import mapboxgl, { NavigationControl } from "mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import dataR from "./dataR.json";
import proxyData from "./proxydata.json";
import axios from "axios";
import * as turf from "@turf/turf";
import MapComponent from "./App1";

const App = () => {
  const [hoveredState, setHoveredState] = useState(null);
  const [hoveredStateColor, setHoveredStateColor] = useState(null);
  const [coords, setCoords] = useState({});
  const [stateInfo, setStateInfo] = useState(null);

  const handleStateHover = (state, color, x, y) => {
    setHoveredState(state);
    setHoveredStateColor(color);
    setCoords({ x: x, y: y });
  };

  const handleStateClick = (stateInfo) => {
    setStateInfo(stateInfo);
  };

  const handleCloseMenu = () => {
    setStateInfo(null);
  };

  return (
    <div>
      <MapComponent
        onStateHover={handleStateHover}
        onStateClick={handleStateClick}
      />
      {hoveredState && hoveredStateColor && (
        <Popup
          x={coords.x}
          y={coords.y}
          hoveredState={hoveredState}
          hoveredStateColor={hoveredStateColor}
        />
      )}
      {stateInfo && (
        <StateMenu stateInfo={stateInfo} onClose={handleCloseMenu} />
      )}
    </div>
  );
};

export default App;
