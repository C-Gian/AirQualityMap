import React from "react";
import Slider from "rc-slider";
import { setSliderValue } from "../actions/index.js";
import { useSelector, useDispatch } from "react-redux";

function TemporalSlider({ nightMode }) {
  const dispatch = useDispatch();
  const sliderValue = useSelector((state) => state.sliderValue);
  const handleChange = (value) => {
    dispatch(setSliderValue(value - 1));
  };

  return (
    <div
      className="absolute bottom-0 left-0 m-3 mt-10 pl-5 pr-5 pt-3 pb-7 z-999"
      style={{
        width: "570px",
        height: "150px",
        backgroundColor: nightMode
          ? "rgba(55 ,65 ,81, 0.5)"
          : "rgba(55 ,65 ,81, 1)",
      }}
    >
      <div className="flex-col justify-between">
        <h2 className="text-white text-2xl font-semibold mt-2">
          7 days past data
        </h2>
        <div className="mt-8 mb-10">
          <Slider
            min={1}
            max={7}
            marks={{
              1: <span className="slider-mark">1</span>,
              2: <span className="slider-mark">2</span>,
              3: <span className="slider-mark">3</span>,
              4: <span className="slider-mark">4</span>,
              5: <span className="slider-mark">5</span>,
              6: <span className="slider-mark">6</span>,
              7: <span className="slider-mark">7</span>,
            }}
            defaultValue={sliderValue + 1}
            railStyle={{ backgroundColor: "#FFF", height: 6 }}
            trackStyle={{ backgroundColor: "#FFF", height: 6 }}
            handleStyle={{
              borderColor: "#FFF",
              height: 16,
              width: 16,
              backgroundColor: "#fff",
            }}
            dotStyle={{ visibility: "hidden" }}
            activeDotStyle={{ visibility: "hidden" }}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
}

export default TemporalSlider;
