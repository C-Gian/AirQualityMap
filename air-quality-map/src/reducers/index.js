// reducers/index.js
import { combineReducers } from "redux";

const initialState = {
  sliderValue: 0,
  // Altri stati globali se necessario
};

const sliderValueReducer = (state = initialState.sliderValue, action) => {
  if (action.type === "SET_SLIDER_VALUE") {
    return action.payload;
  }
  return state;
};

const rootReducer = combineReducers({
  sliderValue: sliderValueReducer,
  // Altri riduttori della tua app, se presenti
});

export default rootReducer;
