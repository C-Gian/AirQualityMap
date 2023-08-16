// actions/index.js
export const setSliderValue = (value) => {
  return {
    type: "SET_SLIDER_VALUE",
    payload: value,
  };
};

export const setSidebar = (value) => {
  return {
    type: "SET_SIDEBAR",
    payload: value,
  };
};

export const setNightMode = (value) => {
  return {
    type: "SET_NIGHT_MODE",
    payload: value,
  };
};

export const setColorBlindMode = (value) => {
  return {
    type: "SET_CB_MODE",
    payload: value,
  };
};

export const setLayerToShow = (value) => {
  return {
    type: "SET_LAYER_TO_SHOW",
    payload: value,
  };
};

export const setCurrentLayer = (value) => {
  return {
    type: "SET_CURRENT_LAYER",
    payload: value,
  };
};

export const setWind = (value) => {
  return {
    type: "SET_WIND",
    payload: value,
  };
};

export const setWindHeatmap = (value) => {
  return {
    type: "SET_WIND_HEATMAP",
    payload: value,
  };
};

export const set3DMap = (value) => {
  return {
    type: "SET_3D_MAP",
    payload: value,
  };
};

// actions.js
export const toggleSidebar = () => ({
  type: "TOGGLE_SIDEBAR",
});

export const updateMapPosition = (position) => ({
  type: "UPDATE_MAP_POSITION",
  payload: position,
});
