import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const CorrelationMatrix = ({ datas, colorBlind }) => {
  const [matrix, setMatrix] = useState([]);
  const svgRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const colors = colorBlind
    ? [
        "rgba(255, 255, 255, 1)",
        "rgba(57, 139, 72, 1)",
        "rgba(97, 169, 168, 1)",
        "rgba(202, 55, 49, 1)",
        "rgba(219, 100, 44, 1)",
        "rgba(106, 58, 122, 1)",
      ]
    : ["white", "#318765"];

  function transformData(inputObj) {
    const transformedArray = [];
    for (const key in inputObj) {
      if (inputObj.hasOwnProperty(key)) {
        const data = inputObj[key];
        const temp = parseFloat(data.TEMP);

        const polls = {
          co2: parseFloat(data.CO),
          no2: parseFloat(data.NO2),
          o3: parseFloat(data.OZONE),
          so2: parseFloat(data.SO2),
          pm25: parseFloat(data["PM2.5"]),
          pm10: parseFloat(data.PM10),
        };

        transformedArray.push({ temp, polls });
      }
    }

    return transformedArray;
  }

  // Funzione per calcolare il coefficiente di correlazione di Pearson tra due array di dati
  const calculateCorrelationPearson = (xData, yData) => {
    const n = xData.length;
    const xSum = xData.reduce((acc, val) => acc + val, 0);
    const ySum = yData.reduce((acc, val) => acc + val, 0);
    const xySum = xData.reduce(
      (acc, val, index) => acc + val * yData[index],
      0
    );
    const xSquaredSum = xData.reduce((acc, val) => acc + val * val, 0);
    const ySquaredSum = yData.reduce((acc, val) => acc + val * val, 0);

    const numerator = n * xySum - xSum * ySum;
    const denominatorX = n * xSquaredSum - xSum * xSum;
    const denominatorY = n * ySquaredSum - ySum * ySum;

    const correlation = numerator / Math.sqrt(denominatorX * denominatorY);
    return correlation;
  };

  function printSingleCorrelation(
    temperatureData,
    co2Data,
    no2Data,
    so2Data,
    o3Data,
    pm10Data,
    pm25Data
  ) {
    // Calcoliamo il coefficiente di correlazione di Pearson per la temperatura e ciascun inquinante
    console.log(
      "Correlazione tra temperatura e CO2:",
      calculateCorrelationPearson(temperatureData, co2Data)
        ? calculateCorrelationPearson(temperatureData, co2Data)
        : 0
    );
    console.log(
      "Correlazione tra temperatura e NO2:",
      calculateCorrelationPearson(temperatureData, no2Data)
        ? calculateCorrelationPearson(temperatureData, no2Data)
        : 0
    );
    console.log(
      "Correlazione tra temperatura e SO2:",
      calculateCorrelationPearson(temperatureData, so2Data)
        ? calculateCorrelationPearson(temperatureData, so2Data)
        : 0
    );
    console.log(
      "Correlazione tra temperatura e O3:",
      calculateCorrelationPearson(temperatureData, o3Data)
        ? calculateCorrelationPearson(temperatureData, o3Data)
        : 0
    );
    console.log(
      "Correlazione tra temperatura e PM10:",
      calculateCorrelationPearson(temperatureData, pm10Data)
        ? calculateCorrelationPearson(temperatureData, pm10Data)
        : 0
    );
    console.log(
      "Correlazione tra temperatura e PM25:",
      calculateCorrelationPearson(temperatureData, pm25Data)
        ? calculateCorrelationPearson(temperatureData, pm25Data)
        : 0
    );
  }

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  /* CODE FOR SINGLE STATE, TO UPDATE WHEN ANOTHER STATE IS CLICKED
  useEffect(() => {
    // Clear existing content before drawing the heatmap
    if (svgRef.current) {
      d3.select(svgRef.current).selectAll("*").remove();
    }
  }, [id]);
 */
  useEffect(() => {
    let data = transformData(datas);

    /* CODE FOR SINGLE STATES!
    datas.forEach((day) => {
      const dayToGet = day.features.filter((item) => item.id === id)[0];
      data.push({
        temp: dayToGet.weather.data.tempReal
          ? dayToGet.weather.data.tempReal
          : 0,
        polls: {
          co2: dayToGet.properties.measurements.CO.fixedValue
            ? dayToGet.properties.measurements.CO.fixedValue
            : 0,
          no2: dayToGet.properties.measurements.NO2.fixedValue
            ? dayToGet.properties.measurements.NO2.fixedValue
            : 0,
          o3: dayToGet.properties.measurements.OZONE.fixedValue
            ? dayToGet.properties.measurements.OZONE.fixedValue
            : 0,
          so2: dayToGet.properties.measurements.SO2.fixedValue
            ? dayToGet.properties.measurements.SO2.fixedValue
            : 0,
          pm25: dayToGet.properties.measurements["PM2.5"].fixedValue
            ? dayToGet.properties.measurements["PM2.5"].fixedValue
            : 0,
          pm10: dayToGet.properties.measurements.PM10.fixedValue
            ? dayToGet.properties.measurements.PM10.fixedValue
            : 0,
        },
      });
    }); */

    // Estraiamo i dati di temperatura e inquinanti dagli oggetti all'interno dell'array
    const temperatureData = data.map((item) => item.temp);
    const co2Data = data.map((item) => item.polls.co2);
    const no2Data = data.map((item) => item.polls.no2);
    const so2Data = data.map((item) => item.polls.so2);
    const o3Data = data.map((item) => item.polls.o3);
    const pm10Data = data.map((item) => item.polls.pm10);
    const pm25Data = data.map((item) => item.polls.pm25);

    setMatrix([
      [
        1,
        calculateCorrelationPearson(temperatureData, co2Data),
        calculateCorrelationPearson(temperatureData, no2Data),
        calculateCorrelationPearson(temperatureData, so2Data),
        calculateCorrelationPearson(temperatureData, o3Data),
        calculateCorrelationPearson(temperatureData, pm10Data),
        calculateCorrelationPearson(temperatureData, pm25Data),
      ],
      [
        calculateCorrelationPearson(co2Data, temperatureData),
        1,
        calculateCorrelationPearson(co2Data, no2Data),
        calculateCorrelationPearson(co2Data, so2Data),
        calculateCorrelationPearson(co2Data, o3Data),
        calculateCorrelationPearson(co2Data, pm10Data),
        calculateCorrelationPearson(co2Data, pm25Data),
      ],
      [
        calculateCorrelationPearson(no2Data, temperatureData),
        calculateCorrelationPearson(no2Data, co2Data),
        1,
        calculateCorrelationPearson(no2Data, so2Data),
        calculateCorrelationPearson(no2Data, o3Data),
        calculateCorrelationPearson(no2Data, pm10Data),
        calculateCorrelationPearson(no2Data, pm25Data),
      ],
      [
        calculateCorrelationPearson(so2Data, temperatureData),
        calculateCorrelationPearson(so2Data, co2Data),
        calculateCorrelationPearson(so2Data, no2Data),
        1,
        calculateCorrelationPearson(so2Data, o3Data),
        calculateCorrelationPearson(so2Data, pm10Data),
        calculateCorrelationPearson(so2Data, pm25Data),
      ],
      [
        calculateCorrelationPearson(o3Data, temperatureData),
        calculateCorrelationPearson(o3Data, co2Data),
        calculateCorrelationPearson(o3Data, no2Data),
        calculateCorrelationPearson(o3Data, so2Data),
        1,
        calculateCorrelationPearson(o3Data, pm10Data),
        calculateCorrelationPearson(o3Data, pm25Data),
      ],
      [
        calculateCorrelationPearson(pm10Data, temperatureData),
        calculateCorrelationPearson(pm10Data, co2Data),
        calculateCorrelationPearson(pm10Data, no2Data),
        calculateCorrelationPearson(pm10Data, so2Data),
        calculateCorrelationPearson(pm10Data, o3Data),
        1,
        calculateCorrelationPearson(pm10Data, pm25Data),
      ],
      [
        calculateCorrelationPearson(pm25Data, temperatureData),
        calculateCorrelationPearson(pm25Data, co2Data),
        calculateCorrelationPearson(pm25Data, no2Data),
        calculateCorrelationPearson(pm25Data, so2Data),
        calculateCorrelationPearson(pm25Data, o3Data),
        calculateCorrelationPearson(pm25Data, pm10Data),
        1,
      ],
    ]);
    /* console.log("Correlation Matrix", matrix);
    console.table(matrix); */

    /* printSingleCorrelation(
      temperatureData,
      co2Data,
      no2Data,
      so2Data,
      o3Data,
      pm10Data,
      pm25Data
    ); */
  }, []);

  useEffect(() => {
    if (isLoaded) {
      // set the dimensions and margins of the graph
      const margin = { top: 0, right: 0, bottom: 50, left: 50 },
        width = 450 - margin.left - margin.right,
        height = 450 - margin.top - margin.bottom;

      // Labels of row and columns
      const myGroups = ["T", "CO2", "NO2", "SO2", "O3", "PM10", "PM25"];
      const myVars = ["T", "CO2", "NO2", "SO2", "O3", "PM10", "PM25"].reverse();

      // Build X scales and axis:
      const x = d3.scaleBand().range([0, width]).domain(myGroups).padding(0.01);

      // Build X scales and axis:
      const y = d3.scaleBand().range([height, 0]).domain(myVars).padding(0.01);

      // Build color scale
      const myColor = d3.scaleLinear().range(colors).domain([-1, 1]);

      // Read the data
      const heatMapData = [];
      const reversedMatrix = matrix.reverse();
      for (let i = 0; i < myVars.length; i++) {
        for (let j = 0; j < myGroups.length; j++) {
          heatMapData.push({
            group: myGroups[j],
            variable: myVars[i],
            value: reversedMatrix[i][j],
          });
        }
      }

      const svg = d3
        .select(svgRef.current)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // Clear existing content before drawing the heatmap
      svg.selectAll("*").remove();

      svg
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
      svg.append("g").call(d3.axisLeft(y));

      // Imposta il colore delle etichette delle scale sull'asse x come bianche
      svg.selectAll(".tick text").style("fill", "white");

      svg
        .selectAll()
        .data(heatMapData)
        .enter()
        .append("rect")
        .attr("x", function (d) {
          return x(d.group);
        })
        .attr("y", function (d) {
          return y(d.variable);
        })
        .attr("width", x.bandwidth())
        .attr("height", y.bandwidth())
        .style("fill", function (d) {
          return d.value ? myColor(d.value) : "darkgrey";
        })
        .on("mouseover", function (event, d) {
          // Mostra il valore della cella come tooltip
          svg
            .append("text")
            .attr("class", "heatmap-cell-value")
            .attr("x", x(d.group) + x.bandwidth() / 2)
            .attr("y", y(d.variable) + y.bandwidth() / 2)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "central")
            .style("font-size", "12px")
            .style("fill", "black")
            .text(d.value.toFixed(2));
        })
        .on("mouseout", function (event, d) {
          // Rimuovi il tooltip quando il mouse esce dalla cella
          svg.selectAll(".heatmap-cell-value").remove();
        });
    }
  }, [isLoaded, colorBlind]);

  return (
    <div className="flex flex-col w-full items-center justify-center mr-10">
      <div
        className="flex-col mb-5 items-center justify-center"
        style={{ width: "400px" }}
      >
        <div className=" text-white text-xl flex justify-between mb-3">
          Value Near 1: Strong Correlation
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="icon icon-tabler icon-tabler-arrows-up"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M17 3l0 18"></path>
            <path d="M4 6l3 -3l3 3"></path>
            <path d="M20 6l-3 -3l-3 3"></path>
            <path d="M7 3l0 18"></path>
          </svg>
        </div>
        <div className=" text-white text-xl flex justify-between mb-3">
          Value Near 0: No Correlation
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
            />
          </svg>
        </div>
        <div className=" text-white text-xl flex justify-between mb-3">
          Value Near -1: Opposite Correlation
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="icon icon-tabler icon-tabler-arrows-down-up"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M17 3l0 18"></path>
            <path d="M10 18l-3 3l-3 -3"></path>
            <path d="M7 21l0 -18"></path>
            <path d="M20 6l-3 -3l-3 3"></path>
          </svg>
        </div>
      </div>
      <div>{matrix.length > 0 && <svg ref={svgRef} />}</div>
    </div>
  );
};

export default CorrelationMatrix;
