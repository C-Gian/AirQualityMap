import React, { useEffect, useRef, useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import SideBarChart from "./SideBarChart";
import { connect } from "react-redux";
import { setSliderValue } from "../actions/index.js";
import { useSelector } from "react-redux";
import * as d3 from "d3";

const Sidebar = ({ infos, onButtonClick, setSliderValue }) => {
  const [name, setName] = useState("");
  const [AQI, setAQI] = useState("");
  const [lastUpdate, setLastUpdate] = useState("");
  const [values, setValues] = useState([]);
  const [dataR, setDataR] = useState(infos.datas[0].features[infos.id]);
  const [hexColor, setHexColor] = useState("");
  const sliderValue = useSelector((state) => state.sliderValue);
  //const [sValue, setSValue] = useState(0);
  let countryPolluttans = {
    CO: {
      totalValue: 0,
      times: 0,
      fixedValue: 0,
    },
    NO2: {
      totalValue: 0,
      times: 0,
      fixedValue: 0,
    },
    OZONE: {
      totalValue: 0,
      times: 0,
      fixedValue: 0,
    },
    "PM2.5": {
      totalValue: 0,
      times: 0,
      fixedValue: 0,
    },
    PM10: {
      totalValue: 0,
      times: 0,
      fixedValue: 0,
    },
    SO2: {
      totalValue: 0,
      times: 0,
      fixedValue: 0,
    },
  };
  const colors = [
    "#00D900",
    "#B5B500",
    "#F57300",
    "#F50000",
    "#83328C",
    "#730017",
  ];
  // Funzione per calcolare il colore associato al valore in base all'interpolazione lineare
  const getColorForValue = (value) => {
    const scale = d3
      .scaleLinear()
      .domain([0, 301])
      .range([0, colors.length - 1]);
    const index = scale(value);
    const t = index % 1; // Frazione dell'indice
    const colorInterpolator = d3.interpolate(
      colors[Math.floor(index)],
      colors[Math.ceil(index)]
    );
    const color = colorInterpolator(t);

    // Ora aumenta la luminosità del colore
    const brighterColor = d3.color(color).brighter(1).toString();

    return brighterColor;
  };

  const handleChange = (value) => {
    setDataR(infos.datas[value - 1].features[infos.id]);
    setSliderValue(value - 1);
    //setSValue(sValue - 1);
  };

  useEffect(() => {
    /* if (infos.isState == false) {
      setName("USA");
      setDataR(infos.datas[0]);
      setAQI(dataR.features[0].properties.countryAQI);
      setLastUpdate(dataR.features[0].lastUpdatedMe);
      dataR.features.forEach((feature) => {
        Object.keys(feature.properties.measurements).forEach((poll) => {
          if (feature.properties.measurements[poll].fixedValue != null) {
            countryPolluttans[poll].totalValue +=
              feature.properties.measurements[poll].fixedValue;
            countryPolluttans[poll].times += 1;
          }
        });
      });
      let temp = [];
      Object.keys(countryPolluttans).forEach((key) => {
        countryPolluttans[key].fixedValue =
          countryPolluttans[key].totalValue / countryPolluttans[key].times;
        temp.push(countryPolluttans[key].fixedValue);
      });
      setValues(temp);
    } else {
      setName(dataR.properties.name);
      setAQI(dataR.properties.AQI);
      setLastUpdate(dataR.lastUpdatedMe);
      let temp = [];
      Object.keys(dataR.properties.measurements).forEach((key) => {
        temp.push(dataR.properties.measurements[key].fixedValue);
      });
      setValues(temp);
    }
    const r = Math.round(infos.color.r * 255);
    const g = Math.round(infos.color.g * 255);
    const b = Math.round(infos.color.b * 255);
    setHexColor(
      `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b
        .toString(16)
        .padStart(2, "0")}`
    ); */
    setName(dataR.properties.name);
    setAQI(dataR.properties.AQI);
    setLastUpdate(dataR.lastUpdatedMe);
    let temp = [];
    Object.keys(dataR.properties.measurements).forEach((key) => {
      temp.push(dataR.properties.measurements[key].fixedValue);
    });
    setValues(temp);
    if (dataR.properties.AQI >= 301) {
      setHexColor("#4b0b2c");
    } else {
      const stateColorArrayRGB = getColorForValue(dataR.properties.AQI)
        .replace("rgb(", "")
        .replace(")", "")
        .split(",");
      const stateColorObjectRGB = {
        r: Number(stateColorArrayRGB[0]),
        g: Number(stateColorArrayRGB[1]),
        b: Number(stateColorArrayRGB[2]),
      };

      const r = stateColorObjectRGB.r;
      const g = stateColorObjectRGB.g;
      const b = stateColorObjectRGB.b;
      const hc = `#${r.toString(16).padStart(2, "0")}${g
        .toString(16)
        .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
      setHexColor(hc);
    }
  }, [dataR]);

  useEffect(() => {
    setDataR(infos.datas[sliderValue].features[infos.id]);
  }, [infos]);

  return (
    <div className="w-400 h-full p-5 bg-gray-600 z-30 fixed">
      <button className="close-button" onClick={onButtonClick}>
        &#10005;
      </button>
      <div className="flex items-center">
        <span className="text-4xl text-white">{name}</span>
      </div>
      <div className="flex flex-col w-fit h-fit items-center  justify-between ">
        <div className="flex w-full h-fit items-center mt-4 overflow-hidden">
          <h2 className="text-white  text-xl items-center mr-5">
            Air Quality Index (AQI):
          </h2>
          <div
            className="rounded-2xl p-3 flex items-center justify-center "
            style={{ backgroundColor: hexColor, width: "60px", height: "60px" }}
          >
            <h2 className="text-white flex mix-blend-difference text-xl items-center justify-center align-middle">
              {AQI}
            </h2>
          </div>
        </div>
        <div className="flex w-full h-fit justify-between items-center mt-3">
          <h2 className="text-white text-xl items-center mr-5">Last Update:</h2>
          <span className="text-l text-white">{lastUpdate}</span>
        </div>
      </div>
      {countryPolluttans && values && (
        <SideBarChart
          values={values}
          countryPolluttans={countryPolluttans}
        ></SideBarChart>
      )}
      <div className=" mt-10 flex-col bg-slate-500 pl-5 pr-5 pt-3 pb-7">
        <h2 className="text-white text-xl font-semibold mb-2">
          7 days past data
        </h2>
        <div className="temporal-slider-container">
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
};

const mapStateToProps = (state) => {
  return {
    sliderValue: state.sliderValue,
  };
};

const mapDispatchToProps = {
  setSliderValue,
};

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
