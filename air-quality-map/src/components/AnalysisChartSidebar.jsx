import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const AnalysisChartSidebar = () => {
  const [matrix, setMatrix] = useState([]);
  const svgRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);


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
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    const data = [
      {
        temperatura: 25,
        inquinanti: {
          co2: 150,
          no2: 120,
          so2: 80,
          o3: 50,
          pm10: 180,
          pm25: 120,
        },
      },
      {
        temperatura: -10,
        inquinanti: { co2: 100, no2: 40, so2: 15, o3: 30, pm10: 80, pm25: 50 },
      },
      {
        temperatura: 12,
        inquinanti: {
          co2: 50,
          no2: 180,
          so2: 160,
          o3: 120,
          pm10: 200,
          pm25: 180,
        },
      },
      {
        temperatura: 30,
        inquinanti: {
          co2: 120,
          no2: 80,
          so2: 50,
          o3: 70,
          pm10: 160,
          pm25: 100,
        },
      },
      {
        temperatura: -5,
        inquinanti: { co2: 70, no2: 90, so2: 70, o3: 90, pm10: 120, pm25: 80 },
      },
      {
        temperatura: 40,
        inquinanti: {
          co2: 180,
          no2: 60,
          so2: 30,
          o3: 200,
          pm10: 150,
          pm25: 90,
        },
      },
    ];

    // Estraiamo i dati di temperatura e inquinanti dagli oggetti all'interno dell'array
    const temperatureData = data.map((item) => item.temperatura);
    const co2Data = data.map((item) => item.inquinanti.co2);
    const no2Data = data.map((item) => item.inquinanti.no2);
    const so2Data = data.map((item) => item.inquinanti.so2);
    const o3Data = data.map((item) => item.inquinanti.o3);
    const pm10Data = data.map((item) => item.inquinanti.pm10);
    const pm25Data = data.map((item) => item.inquinanti.pm25);

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
    console.log("Correlation Matrix", matrix);
    console.table(matrix);

    // Calcoliamo il coefficiente di correlazione di Pearson per la temperatura e ciascun inquinante
    console.log(
      "Correlazione tra temperatura e CO2:",
      calculateCorrelationPearson(temperatureData, co2Data)
    );
    console.log(
      "Correlazione tra temperatura e NO2:",
      calculateCorrelationPearson(temperatureData, no2Data)
    );
    console.log(
      "Correlazione tra temperatura e SO2:",
      calculateCorrelationPearson(temperatureData, so2Data)
    );
    console.log(
      "Correlazione tra temperatura e O3:",
      calculateCorrelationPearson(temperatureData, o3Data)
    );
    console.log(
      "Correlazione tra temperatura e PM10:",
      calculateCorrelationPearson(temperatureData, pm10Data)
    );
    console.log(
      "Correlazione tra temperatura e PM25:",
      calculateCorrelationPearson(temperatureData, pm25Data)
    );
  }, []);

  useEffect(() => {
    if (isLoaded) {
      // set the dimensions and margins of the graph
      const margin = { top: 50, right: 50, bottom: 50, left: 50 },
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
      const myColor = d3
        .scaleLinear()
        .range(["white", "#318765"])
        .domain([-1, 1]);

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
          return myColor(d.value);
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
  }, [isLoaded]);

  return (
    <div className="w-full">
      {matrix.length > 0 && (
        <div>
          <svg ref={svgRef} />
        </div>
      )}
    </div>
  );

};

export default AnalysisChartSidebar;
