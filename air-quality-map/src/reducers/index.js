// reducers/index.js
import { combineReducers } from "redux";

const initialState = {
  sliderValue: 0,
  switchState: false,
};

const sliderValueReducer = (state = initialState.sliderValue, action) => {
  if (action.type === "SET_SLIDER_VALUE") {
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
  switchState: switchStateReducer,
});

export default rootReducer;
