// reducers/index.js
import { combineReducers } from "redux";

const initialState = {
  sliderValue: 0,
  switchState: false,
  layerToSet: "AQI",
};

const sliderValueReducer = (state = initialState.sliderValue, action) => {
  if (action.type === "SET_SLIDER_VALUE") {
    return action.payload;
  }
  return state;
};

const layerToSedReducer = (state = initialState.layerToSet, action) => {
  if (action.type === "SET_LAYER_TO_SHOW") {
    return action.payload;
  }
  return state;
};

// reducers.js
const switchStateReducer = (state = initialState.switchState, action) => {
  if (action.type === "TOGGLE_SWITCH") {
    return !state; // Toggle the switch state
  }
  return state;
};

const rootReducer = combineReducers({
  sliderValue: sliderValueReducer,
  layerToSet: layerToSedReducer,
  switchState: switchStateReducer,
});

export default rootReducer;
