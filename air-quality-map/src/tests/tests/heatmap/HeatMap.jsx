import React from "react";
import { useState, useEffect } from "react";
import ReactMapGL, { Layer, Source } from "react-map-gl";
import heatmapStyle from "./heatmap-style"; // File di stile per il layer di heatmap
import heatmapData from "./heatmap-data"; // File contenente i dati per la heatmap
import mapboxgl from "mapbox-gl"; // Importa mapbox-gl per l'utilizzo di heatmap.js

mapboxgl.accessToken =
  "pk.eyJ1IjoiYy1naWFuIiwiYSI6ImNsanB3MXVjdTAwdmUzZW80OWwxazl2M2EifQ.O0p5OWTAIw07QDYHYTH1rw";

function HeatMap() {
  const [viewport, setViewport] = useState({
    width: 800,
    height: 600,
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 8,
  });

  const initializeHeatmap = () => {
    const map = new mapboxgl.Map({
      container: "map", // ID dell'elemento HTML che contiene la mappa
      style: "mapbox://styles/mapbox/light-v10", // Stile della mappa di base
      center: [-98.30953630020429, 38.75491131673913],
      minZoom: 2,
      zoom: 3,
    });
    map.on("load", () => {
      const data = heatmapData; // I tuoi dati per la heatmap
      const maxIntensity = Math.max(...data.map((point) => point.intensity));

      map.addSource("heatmap-data", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: data.map((point) => ({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [point.longitude, point.latitude],
            },
            properties: {
              intensity: point.intensity,
            },
          })),
        },
      });

      map.addLayer({
        id: "heatmap-layer",
        type: "heatmap",
        source: "heatmap-data",
        paint: {
          "heatmap-weight": {
            property: "intensity",
            type: "exponential",
            stops: [
              [0, 0],
              [maxIntensity, 1],
            ],
          },
          "heatmap-intensity": 1,
          "heatmap-color": [
            "interpolate",
            ["linear"],
            ["heatmap-density"],
            0,
            "rgba(0, 0, 255, 0)",
            0.1,
            "royalblue",
            0.3,
            "cyan",
            0.5,
            "lime",
            0.7,
            "yellow",
            1,
            "red",
          ],
          "heatmap-radius": 20,
          "heatmap-opacity": 1,
        },
      });
    });
  };

  return (
    <div>
      <div id="map" style={{ width: "100%", height: "100%" }}></div>
      <ReactMapGL
        {...viewport}
        onViewportChange={setViewport}
        onLoad={initializeHeatmap}
      >
        {/* Altri componenti e overlay della mappa */}
      </ReactMapGL>
    </div>
  );
}

export default HeatMap;
