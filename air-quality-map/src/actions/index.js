// actions/index.js
export const setSliderValue = (value) => {
  return {
    type: "SET_SLIDER_VALUE",
    payload: value,
  };
};

export const setLayerToShow = (value) => {
  return {
    type: "SET_LAYER_TO_SHOW",
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
