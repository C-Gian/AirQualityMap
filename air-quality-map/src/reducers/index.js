// reducers/index.js
import { combineReducers } from "redux";

const initialState = {
  sliderValue: 0,
  layerToShow: "AQI",
  currentLayer: "country",
  wind: false,
};

const sliderValueReducer = (state = initialState.sliderValue, action) => {
  if (action.type === "SET_SLIDER_VALUE") {
    return action.payload;
  }
  return state;
};

const windReducer = (state = initialState.wind, action) => {
  if (action.type === "SET_WIND") {
    return action.payload;
  }
  return state;
};

const layerToShowReducer = (state = initialState.layerToShow, action) => {
  if (action.type === "SET_LAYER_TO_SHOW") {
    return action.payload;
  }
  return state;
};

const currentLayerToShow = (state = initialState.currentLayer, action) => {
  if (action.type === "SET_CURRENT_LAYER") {
    return action.payload;
  }
  return state;
};

const rootReducer = combineReducers({
  sliderValue: sliderValueReducer,
  layerToShow: layerToShowReducer,
  currentLayer: currentLayerToShow,
  wind: windReducer,
});

export default rootReducer;
