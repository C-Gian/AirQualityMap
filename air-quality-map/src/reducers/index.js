// reducers/index.js
import { combineReducers } from "redux";

const initialState = {
  sliderValue: 0,
  layerToShow: "AQI",
  currentLayer: "country",
  wind: false,
  windHeatmap: false,
  map3d: false,
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

const windHeatmapReducer = (state = initialState.windHeatmap, action) => {
  if (action.type === "SET_WIND_HEATMAP") {
    return action.payload;
  }
  return state;
};

const map3DReducer = (state = initialState.map3d, action) => {
  if (action.type === "SET_3D_MAP") {
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
  windHeatmap: windHeatmapReducer,
  map3d: map3DReducer,
});

export default rootReducer;
