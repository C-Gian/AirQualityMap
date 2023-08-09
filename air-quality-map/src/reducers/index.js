// reducers/index.js
import { combineReducers } from "redux";

const initialState = {
  sliderValue: 0,
  layerToShow: "AQI",
  currentLayer: "country",
};

const sliderValueReducer = (state = initialState.sliderValue, action) => {
  if (action.type === "SET_SLIDER_VALUE") {
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
});

export default rootReducer;
