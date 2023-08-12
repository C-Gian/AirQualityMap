import React, { useEffect, useState } from "react";
import Slider from "rc-slider";
import { setSliderValue } from "../actions/index.js";
import { useSelector, useDispatch } from "react-redux";

function TemporalSlider({ nightMode }) {
  const [selectedDay, setSelectedDay] = useState("Today");
  const dispatch = useDispatch();
  const sliderValue = useSelector((state) => state.sliderValue);

  const handleChange = (value) => {
    dispatch(setSliderValue(value - 1));
  };

  function calculateScaledDate(daysToSubtract) {
    const currentDate = new Date();

    // Calcola il numero totale di giorni da sottrarre
    const totalDaysToSubtract =
      currentDate.getDate() >= daysToSubtract
        ? daysToSubtract
        : currentDate.getDate() + daysToSubtract;
    currentDate.setDate(currentDate.getDate() - totalDaysToSubtract);

    /* // Formatta la data in modo leggibile (esempio: "2023-08-05")
    const formattedDate = currentDate.toISOString().split("T")[0]; */
    return currentDate;
  }

  function formatDateAsDMY(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1; // Aggiungi 1 perché i mesi sono indicizzati da 0 a 11
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }

  useEffect(() => {
    const scaledDate = calculateScaledDate(sliderValue);
    if (sliderValue != 0) {
      setSelectedDay(formatDateAsDMY(scaledDate));
    } else {
      setSelectedDay("Today");
    }
  }, [sliderValue]);

  return (
    <div
      className={`absolute bottom-0 left-0 m-3 mt-10 pl-5 pr-5 pt-3 pb-7  ${
        nightMode ? "sfondo bg-opacity-50 backdrop-blur-md" : "bg-red-500"
      }`}
      style={{
        zIndex: 999,
        width: "552px",
        height: "150px",
      }}
    >
      <div className="flex-col justify-between">
        <div className="flex justify-between">
          <h2 className="text-white text-2xl font-semibold mt-2">
            7 days past data
          </h2>
          <h2 className="text-white text-xl font-semibold mt-2 mr-10">
            {selectedDay}
          </h2>
        </div>
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
