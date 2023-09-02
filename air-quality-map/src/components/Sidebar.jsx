import React, { useEffect, useRef, useState } from "react";
import "rc-slider/assets/index.css";
import PollsLevelsChart from "./PollsLevelsChart";
import PollsTempCorrChart from "./PollsTempCorrChart";
import CorrelationMatrix from "./CorrelationMatrix";
import LinearRegression from "./LinearRegression";
import MultipleRegression from "./MultipleRegression";
import CountryFlag from "react-country-flag";
import { useSelector, useDispatch } from "react-redux";
import { setSidebar } from "../actions/index.js";
import AQIShow from "./AQIShow";
import AreaChart from "./AreaChart";
import HoverableHeader from "./HoverableHeader";

const Sidebar = ({ infos, bulkDatas }) => {
  const dispatch = useDispatch();
  const [sidebarData, setSidebarData] = useState({});
  const [dataR, setDataR] = useState(infos.datas[0].features[infos.id]);
  const sliderValue = useSelector((state) => state.sliderValue);
  const nightMode = useSelector((state) => state.nightMode);
  const colorBlind = useSelector((state) => state.colorBlindMode);
  const r = Math.round(infos.color.r * 255);
  const g = Math.round(infos.color.g * 255);
  const b = Math.round(infos.color.b * 255);
  const hexColor = `#${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;

  const handleCloseButtonClick = () => {
    dispatch(setSidebar(false));
  };

  function getColoreByValore(value) {
    if (value >= 0 && value <= 51) {
      return ["Good", "#00D900"];
    } else if (value > 51 && value <= 100) {
      return ["Moderate", "#B5B500"];
    } else if (value > 100 && value <= 150) {
      return ["Unhealthy for Sensitive Groups", "#F57300"];
    } else if (value > 150 && value <= 200) {
      return ["Unhealthy", "#F50000"];
    } else if (value > 200 && value <= 300) {
      return ["Very Unhealthy", "#83328C"];
    }
    return ["Hazardous", "#730017"];
  }

  useEffect(() => {
    setDataR(infos.datas[sliderValue].features[infos.id]);
  }, [sliderValue, infos, nightMode, colorBlind]);

  useEffect(() => {
    if (!infos.isState) {
      setDataR(infos.datas[sliderValue].features[infos.id]);
      setSidebarData({
        name: "USA",
        AQI: dataR.properties.countryAQI,
        lastUpdate: dataR.lastUpdatedMe.split(" "),
        historyAQI: infos.datas.map(
          (item) => item.features[0].properties.countryAQI
        ),
        tempReal: dataR.properties.countryTemp,
        humidity: dataR.properties.countryHum,
        airQualityText: getColoreByValore(dataR.properties.countryAQI)[0],
        nStations: infos.datas[sliderValue].features.reduce(
          (total, obj) => total + obj.properties.nDetections,
          0
        ),
      });
    } else {
      setSidebarData({
        name: dataR.properties.name,
        AQI: dataR.properties.AQI,
        lastUpdate: dataR.lastUpdatedMe.split(" "),
        weatherCondition: {
          condText: dataR.weather.data.conditionText,
          condIcon: dataR.weather.data.conditionIcon,
        },
        historyAQI: infos.datas.map(
          (item) => item.features[infos.id].properties.AQI
        ),
        tempFeel: dataR.weather.data.tempFeel,
        tempReal: dataR.weather.data.tempReal,
        cloud: dataR.properties.cloud,
        humidity: dataR.weather.data.humidity,
        airQualityText: getColoreByValore(dataR.properties.AQI)[0],
        nStations: dataR.properties.nDetections,
      });
    }
  }, [dataR, nightMode, colorBlind]);

  return (
    <div
      className={`sidebar-container pt-3 pb-3 pl-3 pr-2 h-screen z-30 fixed backdrop-blur-2xl ${
        nightMode ? "sidebar-background " : "sidebar-background-light"
      }`}
      style={{
        top: "50px",
      }}
    >
      <div className="flex justify-between">
        <div className="flex items-center">
          <div
            className={`flex items-center ${
              nightMode ? "" : "light-mode-text-color"
            }`}
          >
            <CountryFlag
              className="mr-3"
              countryCode={dataR.properties.countryCode}
              svg
              style={{
                width: "50px", // Imposta la larghezza desiderata per la bandiera
                height: "auto",
              }}
            />
            <span className="title-text-font">{sidebarData.name}</span>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`icon icon-tabler icon-tabler-point-filled mx-2 ${
              nightMode ? "text-white" : "light-mode-text-color"
            }`}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path
              d="M12 7a5 5 0 1 1 -4.995 5.217l-.005 -.217l.005 -.217a5 5 0 0 1 4.995 -4.783z"
              strokeWidth="0"
              fill="currentColor"
            ></path>
          </svg>
          <div
            className={`flex flex-col justify-center items-center ${
              nightMode ? "" : "light-mode-text-color"
            }`}
          >
            <h2 className={`normal-text-font text-l font-light opacity-90 `}>
              Last Update
            </h2>
            <div className={`flex -mt-2 `}>
              <h2 className="normal-text-font text-xl">
                {sidebarData.lastUpdate ? sidebarData.lastUpdate[0] : "No data"}
              </h2>
              <h2 className="normal-text-font ml-2 text-xl">
                {sidebarData.lastUpdate ? sidebarData.lastUpdate[1] : "No data"}
              </h2>
            </div>
          </div>
        </div>
        <button
          className={`absolute top-0 right-0 m-1 bg-transparent border-none cursor-pointer p-0 text-2xl  ${
            nightMode
              ? "text-gray-300 hover:text-gray-100"
              : "light-mode-text-color hover:text-gray-100"
          }`}
          onClick={handleCloseButtonClick}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <div
        className={`sidebar h-[calc(100%-110px)] overflow-y-scroll py-4 ${
          (nightMode ? "" : "light-mode-text-color",
          colorBlind ? "sidebar-blind" : "")
        }`}
      >
        <div className="mr-2">
          <div className="aqis-div flex w-full h-200 items-center justify-around mt-5">
            <div
              className={`flex h-full flex-col items-center justify-between ${
                nightMode ? "" : "light-mode-text-color"
              }`}
            >
              <h2
                className={`headers-text-font text-2xl ${
                  nightMode ? "night-mode" : ""
                }`}
              >
                AQI
              </h2>
              <AQIShow
                hexColor={hexColor}
                AQI={sidebarData.AQI}
                sidebar={true}
              ></AQIShow>
            </div>
            <div
              className="flex h-full flex-col items-center justify-between
            "
            >
              <h2 className="headers-text-font  text-2xl">AQI History</h2>
              <AreaChart
                data={sidebarData.historyAQI}
                color={hexColor}
                nightMode={nightMode}
              />
            </div>
          </div>
          <div className="w-full mt-10">
            <h2
              className={`headers-text-font text-2xl mb-3 ${
                nightMode ? "text-white" : "light-mode-text-color"
              }`}
            >
              Polluttants Levels
            </h2>
            <PollsLevelsChart
              dataR={dataR}
              allDays={infos.datas}
              isState={infos.isState}
              sliderValue={sliderValue}
              nightMode={nightMode}
              colorBlind={colorBlind}
            ></PollsLevelsChart>
          </div>
          <div
            className={`h-fit w-full mt-10 flex-col justify-between p-5 rounded-2xl shadow-md ${
              nightMode
                ? "sidebarInfo-background text-white"
                : "sidebarInfo-background-light light-mode-text-color"
            }`}
          >
            <div className="flex justify-between">
              <h2 className="light-text-font text-xl  mr-5">Air Quality: </h2>
              <h2
                className="everything-font text-xl"
                style={{ color: hexColor }}
              >
                {sidebarData.airQualityText}
              </h2>
            </div>
            <div className="flex justify-between mt-5">
              <h2 className="light-text-font text-xl  mr-5">
                Total Stations:{" "}
              </h2>
              <h2 className="light-text-font text-xl ">
                {sidebarData.nStations}
              </h2>
            </div>
            {sidebarData.weatherCondition != null && infos.isState && (
              <div className="flex justify-between mt-5 items-center">
                <h2 className="light-text-font text-xl  mr-5">Weather: </h2>
                <div className="flex items-center">
                  <img
                    className=" mr-2 "
                    src={`${sidebarData.weatherCondition.condIcon}`}
                    width={50}
                    height={50}
                  />
                  <h2 className="light-text-font text-xl ">{`${sidebarData.weatherCondition.condText}`}</h2>
                </div>
              </div>
            )}
            {sidebarData.cloud != null && infos.isState && (
              <div className="flex justify-between mt-5">
                <h2 className="light-text-font text-xl  mr-5">Cloud: </h2>
                <h2 className="light-text-font text-xl ">
                  {Math.floor(sidebarData.cloud * 100) / 100}
                </h2>
              </div>
            )}
            {sidebarData.tempFeel != null && infos.isState && (
              <div className="flex justify-between mt-5">
                <h2 className="light-text-font text-xl  mr-5">Temp. Feel: </h2>
                <h2 className="light-text-font text-xl ">{`${
                  Math.floor(sidebarData.tempFeel * 100) / 100
                }°`}</h2>
              </div>
            )}
            {sidebarData.tempReal != null && (
              <div className="flex justify-between mt-5">
                <h2 className="light-text-font text-xl  mr-5">Temp. Real: </h2>
                <h2 className="light-text-font text-xl ">{`${
                  Math.floor(sidebarData.tempReal * 100) / 100
                }°`}</h2>
              </div>
            )}
            {sidebarData.humidity != null && (
              <div className="flex justify-between mt-5">
                <h2 className="light-text-font text-xl  mr-5">Humidity: </h2>
                <h2 className="light-text-font text-xl ">{`${
                  Math.floor(sidebarData.humidity * 100) / 100
                }%`}</h2>
              </div>
            )}
          </div>
          {infos.isState ? (
            <div>
              <div className="mt-10">
                <HoverableHeader
                  title="Levels Comparation [Temperature - Polluttants]"
                  nightMode={nightMode}
                />
                <PollsTempCorrChart
                  datas={infos.datas}
                  id={infos.id}
                  nightMode={nightMode}
                  colorBlind={colorBlind}
                ></PollsTempCorrChart>
              </div>
              {/* <div className="flex-col">
                {["PM10", "PM2.5", "OZONE", "NO2", "CO", "SO2"].map(
                  (pollutant, index) => (
                    <PredictionRegression
                      datas={infos.datas}
                      id={infos.id}
                      pollutant={pollutant}
                      key={index}
                      colorBlind={colorBlind}
                    />
                  )
                )}
              </div>
              <div className="mt-5">
                <MultipleRegression
                  datas={infos.datas}
                  id={infos.id}
                  colorBlind={colorBlind}
                ></MultipleRegression>
              </div> */}
            </div>
          ) : (
            <div>
              <div className="mt-10">
                <HoverableHeader
                  title="Levels Comparation [Temperature - Polluttants]"
                  nightMode={nightMode}
                />
                <PollsTempCorrChart
                  datas={bulkDatas}
                  id={null}
                  nightMode={nightMode}
                  colorBlind={colorBlind}
                ></PollsTempCorrChart>
              </div>
              <div className="flex flex-col mt-10">
                <HoverableHeader
                  title="Correlation Matrix"
                  nightMode={nightMode}
                />
                <CorrelationMatrix
                  bulkDatas={bulkDatas}
                  nightMode={nightMode}
                  colorBlind={colorBlind}
                ></CorrelationMatrix>
              </div>
              <div className="flex-col mt-10">
                <HoverableHeader
                  title="Linear Regression"
                  nightMode={nightMode}
                />
                {["PM10", "PM2.5", "OZONE", "NO2", "CO", "SO2"].map(
                  (pollutant, index) => (
                    <LinearRegression
                      datas={bulkDatas}
                      pollutant={pollutant}
                      key={index}
                      nightMode={nightMode}
                      colorBlind={colorBlind}
                    />
                  )
                )}
              </div>
              <div className="mt-10">
                <HoverableHeader
                  title="Multiple Regression"
                  nightMode={nightMode}
                />
                <MultipleRegression
                  datas={bulkDatas}
                  id={null}
                  nightMode={nightMode}
                  colorBlind={colorBlind}
                ></MultipleRegression>
              </div>
            </div>
          )}
        </div>
        <hr className="my-2 h-px border-none bg-gray-200/50 dark:bg-gray-700/50"></hr>
      </div>
    </div>
  );
};

export default Sidebar;
