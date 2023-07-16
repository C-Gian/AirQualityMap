import React, { useEffect, useState } from "react";
import mapboxgl from "mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import Popup from "./Popup";
import * as turf from "@turf/turf";

function MapComponent({ dataR, stateClicked, handleCloseMenu }) {
  //console.log("1 \n", dataR);
  const [map, setMap] = useState(null);
  let hoveredPolygonId = null;
  const [showPopup, setShowPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState({});
  const [hoveredState, setHoveredState] = useState(null);
  const [hoveredStateColor, setHoveredStateColor] = useState(null);
  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoiYy1naWFuIiwiYSI6ImNsanB3MXVjdTAwdmUzZW80OWwxazl2M2EifQ.O0p5OWTAIw07QDYHYTH1rw";
    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/dark-v11",
      center: [-98.30953630020429, 38.75491131673913],
      minZoom: 2,
      zoom: 3,
    });
    setMap(map);

    const zoomThreshold = 8;

    map.on("load", () => {
      let show = false;
      map.style.stylesheet.layers.forEach(function (layer) {
        if (layer.type === "symbol") {
          map.setLayoutProperty(
            layer.id,
            "visibility",
            show ? "visible" : "none"
          );
        }
      });

      //map.addControl(new NavigationControl(), "top-right");

      map.addSource("aqi", {
        type: "geojson",
        data: dataR,
      });

      map.addLayer(
        {
          id: "state-aqi",
          source: "aqi",
          maxzoom: zoomThreshold,
          type: "fill",
          paint: {
            "fill-color": [
              "interpolate",
              ["linear"],
              ["get", "AQI"],
              0,
              "#FFFFFF",
              16.8,
              "#00ff04",
              33.4,
              "#a2ff00",
              50,
              "#bbff00",

              51,
              "#f6ff00",
              67.4,
              "#ffea00",
              83.7,
              "#ffd000",
              100,
              "#ffb300",

              101,
              "#ff9900",
              117.4,
              "#ff8000",
              133.7,
              "#ff6600",
              150,
              "#ff4800",

              151,
              "#ff0000",
              167.4,
              "#ff003c",
              183.7,
              "#ff0066",
              200,
              "#d6006f",

              201,
              "#db0072",
              220.8,
              "#b50460",
              240.6,
              "#9e0253",
              260.4,
              "#8a0349",
              280.2,
              "#7a0140",
              300,
              "#690137",

              301,
              "#57012d",
            ],
            "fill-opacity": [
              "case",
              ["boolean", ["feature-state", "hover"], false],
              1,
              0.75,
            ],
          },
        },
        "road-label-simple"
      );

      map.addLayer(
        {
          id: "state-aqi-line",
          source: "aqi",
          maxzoom: zoomThreshold,
          type: "line",
          interactive: false,
          paint: {
            "line-opacity": 0.3, // Opacità delle linee dei confini
            "line-color": "#212121", // Colore delle linee dei confini
            "line-width": 0.5, // Spessore delle linee dei confini
          },
        },
        "road-label-simple"
      );
    });

    /* map.on("zoom", () => {
      const stateLegendEl = document.getElementById("state-legend");
      const countyLegendEl = document.getElementById("county-legend");
      if (map.getZoom() > zoomThreshold) {
        stateLegendEl.style.display = "none";
        countyLegendEl.style.display = "block";
      } else {
        stateLegendEl.style.display = "block";
        countyLegendEl.style.display = "none";
      }
    });
 */

    map.on("mousemove", "state-aqi", (e) => {
      map.getCanvas().style.cursor = "pointer";
      if (e.features.length > 0) {
        if (hoveredPolygonId == null) {
          hoveredPolygonId = e.features[0].id;
          map.setFeatureState(
            { source: "aqi", id: hoveredPolygonId },
            { hover: true }
          );
          setHoveredState(dataR.features[e.features[0].id]);
          setHoveredStateColor(e.features[0].layer.paint["fill-color"]);
        } else if (e.features[0].id != hoveredPolygonId) {
          map.setFeatureState(
            { source: "aqi", id: hoveredPolygonId },
            { hover: false }
          );
          hoveredPolygonId = e.features[0].id;
          map.setFeatureState(
            { source: "aqi", id: hoveredPolygonId },
            { hover: true }
          );
          setHoveredState(dataR.features[e.features[0].id]);
          setHoveredStateColor(e.features[0].layer.paint["fill-color"]);
        }
        setPopupPosition({
          x: e.originalEvent.clientX,
          y: e.originalEvent.clientY,
        });
        setShowPopup(true);
      }
    });

    map.on("mouseleave", "state-aqi", () => {
      map.getCanvas().style.cursor = "";
      setShowPopup(false);
      setHoveredState({});
      setHoveredStateColor({});
      if (hoveredPolygonId !== null) {
        map.setFeatureState(
          { source: "aqi", id: hoveredPolygonId },
          { hover: false }
        );
      }
      hoveredPolygonId = null;
    });

    map.on("click", "state-aqi", (e) => {
      e.preventDefault();
      const stateInfos = dataR.features.find(
        (obj) => obj.id === e.features[0].id
      );
      stateClicked(stateInfos);
      const center = turf.center(e.features[0].geometry).geometry.coordinates;

      // Esegui l'animazione di zoom e panoramica verso il centro dello stato
      map.flyTo({
        center: center,
        zoom: 5, // Livello di zoom desiderato
        speed: 1.5, // Velocità dell'animazione
        curve: 1.5, // Curva di accelerazione dell'animazione
        essential: true, // Indica che questa animazione è essenziale per l'esperienza dell'utente
      });
    });

    map.on("click", (e) => {
      if (e.defaultPrevented === false) {
        handleCloseMenu();
      }
    });

    map.on("dragstart", () => {
      setShowPopup(false);
      setHoveredState({});
      setHoveredStateColor({});
      if (hoveredPolygonId !== null) {
        map.setFeatureState(
          { source: "aqi", id: hoveredPolygonId },
          { hover: false }
        );
      }
      hoveredPolygonId = null;
    });
  }, []);

  return (
    <div>
      <div id="map"></div>
      {showPopup && (
        <Popup
          x={popupPosition.x}
          y={popupPosition.y}
          hoveredState={hoveredState}
          hoveredStateColor={hoveredStateColor}
        />
      )}
    </div>
  );
}

export default MapComponent;
