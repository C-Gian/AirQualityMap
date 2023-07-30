import React, { useEffect, useState } from "react";
import { SimpleLinearRegression } from "ml-regression";
import { Scatter, Line } from "react-chartjs-2";
import * as d3 from "d3";

const LinearRegression = ({ datas, id }) => {
  const data = [
    {
      temperatura: 20,
      co: 100,
      no2: 50,
      so2: 30,
      o3: 40,
      pm10: 70,
      pm25: 60,
    },
    {
      temperatura: 22,
      co: 90,
      no2: 45,
      so2: 35,
      o3: 42,
      pm10: 68,
      pm25: 58,
    },
    {
      temperatura: 18,
      co: 95,
      no2: 55,
      so2: 28,
      o3: 38,
      pm10: 72,
      pm25: 62,
    },
    {
      temperatura: 25,
      co: 85,
      no2: 60,
      so2: 25,
      o3: 36,
      pm10: 75,
      pm25: 64,
    },
    {
      temperatura: 23,
      co: 92,
      no2: 52,
      so2: 29,
      o3: 41,
      pm10: 69,
      pm25: 61,
    },
    {
      temperatura: 27,
      co: 80,
      no2: 48,
      so2: 32,
      o3: 39,
      pm10: 71,
      pm25: 59,
    },
    {
      temperatura: 21,
      co: 97,
      no2: 53,
      so2: 31,
      o3: 37,
      pm10: 73,
      pm25: 63,
    },
  ];

  const calculateRegressionLine = (data, xField, yField) => {
    // Calcola la somma di x, y, x^2, xy
    let n = data.length;
    let sumX = 0;
    let sumY = 0;
    let sumXX = 0;
    let sumXY = 0;
    for (let i = 0; i < n; i++) {
      const x = data[i][xField];
      const y = data[i][yField];
      sumX += x;
      sumY += y;
      sumXX += x * x;
      sumXY += x * y;
    }
    // Calcola i coefficienti della retta di regressione (y = mx + b)
    const m = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const b = (sumY - m * sumX) / n;
    // Restituisci i coefficienti della retta di regressione
    return { m, b };
  };

  // Definisci le dimensioni e i margini del grafico
  const width = 450;
  const height = 300;
  const margin = { top: 20, right: 30, bottom: 30, left: 60 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const xField = "temperatura";
  const yField = "co";
  // Crea le scale per gli assi x e y
  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(data, (d) => d[xField]))
    .range([0, innerWidth])
    .nice();

  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(data, (d) => d[yField]))
    .range([innerHeight, 0])
    .nice();

  const regressionLine = calculateRegressionLine(data, xField, yField);
  // Calcola i punti della retta di regressione
  const regressionLinePoints = [
    {
      x: d3.min(data, (d) => d[xField]),
      y: regressionLine.m * d3.min(data, (d) => d[xField]) + regressionLine.b,
    },
    {
      x: d3.max(data, (d) => d[xField]),
      y: regressionLine.m * d3.max(data, (d) => d[xField]) + regressionLine.b,
    },
  ];

  return (
    <div>
      <svg width={width} height={height}>
        <g transform={`translate(${margin.left},${margin.top})`}>
          {data.map((d) => (
            <circle
              key={`${d[xField]}-${d[yField]}`}
              cx={xScale(d[xField])}
              cy={yScale(d[yField])}
              r={5}
              fill="steelblue"
            />
          ))}

          <line
            x1={xScale(regressionLinePoints[0].x)}
            y1={yScale(regressionLinePoints[0].y)}
            x2={xScale(regressionLinePoints[1].x)}
            y2={yScale(regressionLinePoints[1].y)}
            stroke="red"
            strokeWidth={2}
          />

          {/* Aggiungi l'asse x */}
          <g
            transform={`translate(0, ${innerHeight})`}
            style={{ stroke: "white" }}
          >
            <line x1={0} y1={0} x2={innerWidth} y2={0} />
          </g>

          {/* Aggiungi l'asse y */}
          <g style={{ stroke: "white" }}>
            <line x1={0} y1={0} x2={0} y2={innerHeight} />
          </g>

          {/* Aggiungi annotazioni per la direzione */}
          <text
            x={xScale(d3.mean(data, (d) => d[xField]))}
            y={yScale(d3.mean(data, (d) => d[yField])) - 10}
            fill="white"
          >
            Pendenza: {regressionLine.m.toFixed(2)}
          </text>
        </g>
      </svg>
    </div>
  );
};

export default LinearRegression;
